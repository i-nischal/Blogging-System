import Like from "../models/Like.js";
import Blog from "../models/Blog.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc    Toggle like/unlike a blog
 * @route   POST /api/likes/blog/:blogId
 * @access  Private (Any authenticated user)
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  // Check if blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  // Check if blog is published
  if (blog.status !== "published") {
    return res
      .status(403)
      .json(ApiResponse.forbidden("Cannot like unpublished blog"));
  }

  // Check if user already liked the blog
  const existingLike = await Like.findOne({
    blog: blogId,
    user: req.user._id,
  });

  if (existingLike) {
    // Unlike: Remove the like
    await Like.findByIdAndDelete(existingLike._id);

    res.json(
      ApiResponse.success("Blog unliked successfully", {
        liked: false,
        likeCount: blog.likeCount - 1,
      })
    );
  } else {
    // Like: Create new like
    await Like.create({
      blog: blogId,
      user: req.user._id,
    });

    res.json(
      ApiResponse.success("Blog liked successfully", {
        liked: true,
        likeCount: blog.likeCount + 1,
      })
    );
  }
});

/**
 * @desc    Check if user liked a blog
 * @route   GET /api/likes/blog/:blogId/status
 * @access  Private
 */
export const getLikeStatus = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  const like = await Like.findOne({
    blog: blogId,
    user: req.user._id,
  });

  res.json(
    ApiResponse.success("Like status retrieved", {
      liked: !!like,
      likeId: like?._id,
    })
  );
});

/**
 * @desc    Get user's liked blogs
 * @route   GET /api/likes/my-likes
 * @access  Private
 */
export const getMyLikes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const likes = await Like.find({ user: req.user._id })
    .populate({
      path: "blog",
      select: "title excerpt author coverImage likeCount commentCount",
      populate: {
        path: "author",
        select: "name",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  // Filter out likes where blog might be deleted
  const validLikes = likes.filter((like) => like.blog !== null);

  const total = await Like.countDocuments({ user: req.user._id });

  res.json(
    ApiResponse.success("My likes retrieved successfully", {
      likes: validLikes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});

/**
 * @desc    Get like count for a blog
 * @route   GET /api/likes/blog/:blogId/count
 * @access  Public
 */
export const getLikeCount = asyncHandler(async (req, res) => {
  const { blogId } = req.params;

  // Check if blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  const likeCount = await Like.countDocuments({ blog: blogId });

  res.json(ApiResponse.success("Like count retrieved", { likeCount }));
});

/**
 * @desc    Get users who liked a blog
 * @route   GET /api/likes/blog/:blogId/users
 * @access  Public
 */
export const getLikedUsers = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Check if blog exists
  const blog = await Blog.findById(blogId);
  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  const likes = await Like.find({ blog: blogId })
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Like.countDocuments({ blog: blogId });

  res.json(
    ApiResponse.success("Liked users retrieved", {
      users: likes.map((like) => like.user),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});
