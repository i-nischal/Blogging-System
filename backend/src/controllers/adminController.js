import User from "../models/User.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc    Get platform statistics (for writer dashboard)
 * @route   GET /api/admin/platform-stats
 * @access  Private (Writer)
 */
export const getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalWriters,
    totalReaders,
    totalBlogs,
    totalPublishedBlogs,
    totalDraftBlogs,
    totalComments,
    totalLikes,
    recentBlogs,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "writer" }),
    User.countDocuments({ role: "reader" }),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Comment.countDocuments(),
    Like.countDocuments(),
    Blog.find({ status: "published" })
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json(
    ApiResponse.success("Platform stats retrieved", {
      users: {
        total: totalUsers,
        writers: totalWriters,
        readers: totalReaders,
      },
      blogs: {
        total: totalBlogs,
        published: totalPublishedBlogs,
        draft: totalDraftBlogs,
      },
      engagement: {
        comments: totalComments,
        likes: totalLikes,
      },
      recentActivity: {
        recentBlogs,
      },
    })
  );
});

/**
 * @desc    Get user management list
 * @route   GET /api/admin/users
 * @access  Private (Writer)
 */
export const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const role = req.query.role;

  const query = {};
  if (role) {
    query.role = role;
  }

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const blogCount = await Blog.countDocuments({ author: user._id });
      const publishedBlogCount = await Blog.countDocuments({
        author: user._id,
        status: "published",
      });

      return {
        ...user.toObject(),
        blogCount,
        publishedBlogCount,
      };
    })
  );

  res.json(
    ApiResponse.success("Users retrieved", {
      users: usersWithStats,
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
 * @desc    Update user role (writer can manage other users)
 * @route   PATCH /api/admin/users/:userId/role
 * @access  Private (Writer)
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  if (!["reader", "writer"].includes(role)) {
    return res
      .status(400)
      .json(ApiResponse.error('Invalid role. Use "reader" or "writer"'));
  }

  // Prevent self-demotion
  if (userId === req.user._id.toString() && role === "reader") {
    return res
      .status(400)
      .json(ApiResponse.error("Cannot change your own role to reader"));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json(ApiResponse.notFound("User not found"));
  }

  res.json(ApiResponse.success(`User role updated to ${role}`, user));
});
