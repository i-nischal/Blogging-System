import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import Like from "../models/Like.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../middleware/asyncHandler.js";

/**
 * @desc    Get writer dashboard statistics
 * @route   GET /api/dashboard/stats
 * @access  Private (Writer only)
 */
export const getWriterStats = asyncHandler(async (req, res) => {
  const writerId = req.user._id;

  // Get basic blog counts
  const [
    totalBlogs,
    publishedBlogs,
    draftBlogs,
    totalViews,
    totalLikes,
    totalComments,
    recentBlogs,
    topPerformingBlogs,
  ] = await Promise.all([
    // Basic counts
    Blog.countDocuments({ author: writerId }),
    Blog.countDocuments({ author: writerId, status: "published" }),
    Blog.countDocuments({ author: writerId, status: "draft" }),

    // Engagement totals
    Blog.aggregate([
      { $match: { author: writerId } },
      { $group: { _id: null, total: { $sum: "$views" } } },
    ]),
    Blog.aggregate([
      { $match: { author: writerId } },
      { $group: { _id: null, total: { $sum: "$likeCount" } } },
    ]),
    Blog.aggregate([
      { $match: { author: writerId } },
      { $group: { _id: null, total: { $sum: "$commentCount" } } },
    ]),

    // Recent blogs (last 5)
    Blog.find({ author: writerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status views likeCount commentCount createdAt"),

    // Top performing blogs (by views)
    Blog.find({ author: writerId, status: "published" })
      .sort({ views: -1 })
      .limit(5)
      .select("title views likeCount commentCount createdAt"),
  ]);

  // Extract totals from aggregation results
  const totalViewsCount = totalViews[0]?.total || 0;
  const totalLikesCount = totalLikes[0]?.total || 0;
  const totalCommentsCount = totalComments[0]?.total || 0;

  // Calculate engagement rate (if there are views)
  const engagementRate =
    totalViewsCount > 0
      ? (
          ((totalLikesCount + totalCommentsCount) / totalViewsCount) *
          100
        ).toFixed(1)
      : 0;

  res.json(
    ApiResponse.success("Dashboard stats retrieved", {
      overview: {
        totalBlogs,
        published: publishedBlogs,
        drafts: draftBlogs,
        totalViews: totalViewsCount,
        totalLikes: totalLikesCount,
        totalComments: totalCommentsCount,
        engagementRate: `${engagementRate}%`,
      },
      recentActivity: {
        recentBlogs,
        topPerformingBlogs,
      },
    })
  );
});

/**
 * @desc    Get detailed blog analytics
 * @route   GET /api/dashboard/analytics/:blogId
 * @access  Private (Writer - own blogs only)
 */
export const getBlogAnalytics = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const writerId = req.user._id;

  // Verify the blog belongs to the writer
  const blog = await Blog.findOne({ _id: blogId, author: writerId });
  if (!blog) {
    return res
      .status(404)
      .json(ApiResponse.notFound("Blog not found or access denied"));
  }

  // Get comments for this blog
  const comments = await Comment.find({ blog: blogId })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(10);

  // Get likes for this blog
  const likes = await Like.find({ blog: blogId })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(
    ApiResponse.success("Blog analytics retrieved", {
      blog: {
        _id: blog._id,
        title: blog.title,
        status: blog.status,
        views: blog.views,
        likeCount: blog.likeCount,
        commentCount: blog.commentCount,
        createdAt: blog.createdAt,
      },
      engagement: {
        comments,
        recentLikes: likes,
      },
    })
  );
});

/**
 * @desc    Get monthly stats for charts
 * @route   GET /api/dashboard/monthly-stats
 * @access  Private (Writer only)
 */
export const getMonthlyStats = asyncHandler(async (req, res) => {
  const writerId = req.user._id;

  // Get last 6 months of data
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await Blog.aggregate([
    {
      $match: {
        author: writerId,
        createdAt: { $gte: sixMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        blogsPublished: {
          $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
        },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likeCount" },
        totalComments: { $sum: "$commentCount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.json(
    ApiResponse.success("Monthly stats retrieved", {
      monthlyStats,
    })
  );
});
