import Blog from "../models/Blog.js";
import Like from "../models/Like.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc    Create a new blog
 * @route   POST /api/blogs
 * @access  Private (Writer only)
 */
export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, tags, status } = req.body;

  const blog = await Blog.create({
    title,
    content,
    tags,
    status,
    author: req.user._id,
  });

  res.status(201).json(ApiResponse.created("Blog created successfully", blog));
});

/**
 * @desc    Get all published blogs with pagination
 * @route   GET /api/blogs
 * @access  Public
 */
export const getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Build query for published blogs only
  const query = { status: "published" };

  // Optional: Filter by tags
  if (req.query.tags) {
    const tagsArray = req.query.tags.split(",");
    query.tags = { $in: tagsArray };
  }

  // Optional: Search by title or content
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { content: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const blogs = await Blog.find(query)
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments(query);

  res.json(
    ApiResponse.success("Blogs retrieved successfully", {
      blogs,
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
 * @desc    Get single blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate(
    "author",
    "name email"
  );

  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  // Increment views count
  blog.views += 1;
  await blog.save();

  // Check if user liked this blog
  let userLiked = false;
  if (req.user) {
    const like = await Like.findOne({
      blog: req.params.id,
      user: req.user._id,
    });
    userLiked = !!like;
  }

  const blogWithLikeStatus = {
    ...blog.toObject(),
    userLiked,
  };

  res.json(
    ApiResponse.success("Blog retrieved successfully", blogWithLikeStatus)
  );
});

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:id
 * @access  Private (Writer - own blogs only)
 */
export const updateBlog = asyncHandler(async (req, res) => {
  let blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  // Check if user owns the blog
  if (blog.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(ApiResponse.forbidden("Not authorized to update this blog"));
  }

  blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("author", "name email");

  res.json(ApiResponse.success("Blog updated successfully", blog));
});

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private (Writer - own blogs only)
 */
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  // Check if user owns the blog
  if (blog.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(ApiResponse.forbidden("Not authorized to delete this blog"));
  }

  await Blog.findByIdAndDelete(req.params.id);

  res.json(ApiResponse.success("Blog deleted successfully"));
});

/**
 * @desc    Get user's blogs (for dashboard)
 * @route   GET /api/blogs/my-blogs
 * @access  Private (Writer only)
 */
export const getMyBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const query = { author: req.user._id };

  // Filter by status if provided
  if (req.query.status) {
    query.status = req.query.status;
  }

  const blogs = await Blog.find(query)
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Blog.countDocuments(query);

  res.json(
    ApiResponse.success("My blogs retrieved successfully", {
      blogs,
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
 * @desc    Toggle blog publish status
 * @route   PATCH /api/blogs/:id/publish
 * @access  Private (Writer - own blogs only)
 */
export const togglePublish = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  // Check if user owns the blog
  if (blog.author.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json(ApiResponse.forbidden("Not authorized to update this blog"));
  }

  blog.status = blog.status === "published" ? "draft" : "published";
  await blog.save();

  res.json(
    ApiResponse.success(
      `Blog ${
        blog.status === "published" ? "published" : "unpublished"
      } successfully`,
      blog
    )
  );
});

/**
 * @desc    Like/Unlike a blog
 * @route   POST /api/blogs/:id/like
 * @access  Private (Any authenticated user)
 */
export const toggleLike = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    return res.status(404).json(ApiResponse.notFound("Blog not found"));
  }

  // Check if user already liked the blog
  const existingLike = await Like.findOne({
    blog: req.params.id,
    user: req.user._id,
  });

  if (existingLike) {
    // Unlike: Remove the like
    await Like.findByIdAndDelete(existingLike._id);
    res.json(
      ApiResponse.success("Blog unliked successfully", { liked: false })
    );
  } else {
    // Like: Create new like
    await Like.create({
      blog: req.params.id,
      user: req.user._id,
    });
    res.json(ApiResponse.success("Blog liked successfully", { liked: true }));
  }
});

/**
 * @desc    Get blog statistics for writer
 * @route   GET /api/blogs/stats
 * @access  Private (Writer)
 */
export const getBlogStats = asyncHandler(async (req, res) => {
  const stats = await Blog.aggregate([
    { $match: { author: req.user._id } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likeCount" },
        totalComments: { $sum: "$commentCount" },
      },
    },
  ]);

  const totalStats = {
    published: 0,
    draft: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  };

  stats.forEach((stat) => {
    totalStats[stat._id] = stat.count;
    totalStats.totalViews += stat.totalViews;
    totalStats.totalLikes += stat.totalLikes;
    totalStats.totalComments += stat.totalComments;
  });

  res.json(ApiResponse.success("Blog stats retrieved", totalStats));
});

/**
 * @desc    Search blogs with advanced filters
 * @route   GET /api/blogs/search
 * @access  Public
 */
export const searchBlogs = asyncHandler(async (req, res) => {
  const {
    q,
    tags,
    author,
    sortBy = "recent",
    page = 1,
    limit = 10,
  } = req.query;
  const skip = (page - 1) * limit;

  let query = { status: "published" };
  let sort = {};

  // Search query
  if (q) {
    query.$or = [
      { title: { $regex: q, $options: "i" } },
      { content: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
    ];
  }

  // Filter by tags
  if (tags) {
    query.tags = { $in: tags.split(",") };
  }

  // Filter by author
  if (author) {
    const authorUser = await User.findOne({
      name: { $regex: author, $options: "i" },
    });
    if (authorUser) {
      query.author = authorUser._id;
    }
  }

  // Sorting
  switch (sortBy) {
    case "popular":
      sort = { views: -1 };
      break;
    case "likes":
      sort = { likeCount: -1 };
      break;
    case "comments":
      sort = { commentCount: -1 };
      break;
    default:
      sort = { createdAt: -1 };
  }

  const blogs = await Blog.find(query)
    .populate("author", "name email")
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Blog.countDocuments(query);

  res.json(
    ApiResponse.success("Blogs search results", {
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    })
  );
});
