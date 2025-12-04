import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Download,
  Loader2,
  RefreshCw,
  BarChart3,
  Calendar,
  TrendingDown,
  Heart,
  MessageCircle,
  FileText,
  Activity,
} from "lucide-react";
import dashboardAPI from "../../../services/api/dashboard";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching analytics data...");

      const [dashboardResponse, monthlyResponse] = await Promise.all([
        dashboardAPI.getWriterStats(),
        dashboardAPI.getMonthlyStats(),
      ]);

      console.log("📊 Dashboard Stats:", dashboardResponse.data);
      console.log("📈 Monthly Stats:", monthlyResponse.data);

      if (dashboardResponse.data.success) {
        setStats(dashboardResponse.data.data);
      }

      if (monthlyResponse.data.success) {
        setMonthlyData(monthlyResponse.data.data);
      }
    } catch (err) {
      console.error("❌ Error fetching analytics:", err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!stats) return;

    const csvContent = [
      ["Metric", "Value"],
      ["Total Blogs", stats?.overview?.totalBlogs || 0],
      ["Published Blogs", stats?.overview?.published || 0],
      ["Draft Blogs", stats?.overview?.drafts || 0],
      ["Total Views", stats?.overview?.totalViews || 0],
      ["Total Likes", stats?.overview?.totalLikes || 0],
      ["Total Comments", stats?.overview?.totalComments || 0],
      ["Engagement Rate", stats?.overview?.engagementRate || "0%"],
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-800 font-medium">
                Failed to load analytics
              </h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your blog performance and audience engagement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Blogs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Blogs
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.overview?.totalBlogs || 0}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">
              {stats?.overview?.published || 0} published
            </span>
            <span className="text-gray-400 mx-2">•</span>
            <span className="text-yellow-600">
              {stats?.overview?.drafts || 0} drafts
            </span>
          </div>
        </div>

        {/* Total Views */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <Activity className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Views
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {(stats?.overview?.totalViews || 0).toLocaleString()}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Across all your blogs
          </div>
        </div>

        {/* Total Likes */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Likes
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {(stats?.overview?.totalLikes || 0).toLocaleString()}
          </p>
          <div className="mt-2 text-sm text-gray-500">Total engagement</div>
        </div>

        {/* Total Comments */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <Activity className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="text-gray-600 text-sm font-medium mb-1">
            Total Comments
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {(stats?.overview?.totalComments || 0).toLocaleString()}
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Community discussions
          </div>
        </div>
      </div>

      {/* Engagement Rate Card */}
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Overall Engagement Rate
            </h3>
            <p className="text-sm text-gray-600">
              Percentage of viewers who interact with your content
            </p>
            <div className="mt-4 flex items-center space-x-6">
              <div>
                <p className="text-xs text-gray-500">Avg per Blog</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.overview?.totalBlogs > 0
                    ? Math.round(
                        stats.overview.totalViews / stats.overview.totalBlogs
                      )
                    : 0}{" "}
                  views
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Interaction Rate</p>
                <p className="text-lg font-semibold text-gray-900">
                  {stats?.overview?.engagementRate || "0%"}
                </p>
              </div>
            </div>
          </div>
          <div className="text-5xl font-bold text-green-600">
            {stats?.overview?.engagementRate || "0%"}
          </div>
        </div>
      </div>

      {/* Top Performing Blogs */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            🏆 Top Performing Blogs
          </h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>

        {stats?.recentActivity?.topPerformingBlogs?.length > 0 ? (
          <div className="space-y-4">
            {stats.recentActivity.topPerformingBlogs.map((blog, index) => {
              const engagementRate =
                blog.views > 0
                  ? (
                      ((blog.likeCount + blog.commentCount) / blog.views) *
                      100
                    ).toFixed(1)
                  : 0;

              return (
                <div
                  key={blog._id}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg">
                      <span className="text-white font-bold text-lg">
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {blog.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {blog.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1 text-red-500" />
                          {blog.likeCount.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1 text-blue-500" />
                          {blog.commentCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-600">
                      {engagementRate}%
                    </div>
                    <div className="text-xs text-gray-500">Engagement</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No blog data available yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Publish blogs to see performance metrics
            </p>
          </div>
        )}
      </div>

      {/* Monthly Performance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            📅 Monthly Performance
          </h3>
          <Calendar className="h-5 w-5 text-gray-400" />
        </div>

        {monthlyData?.monthlyStats?.length > 0 ? (
          <div className="space-y-4">
            {monthlyData.monthlyStats.map((month, index) => {
              const monthName = new Date(
                month._id.year,
                month._id.month - 1
              ).toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              });

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {monthName}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {month.blogsPublished} blog
                        {month.blogsPublished !== 1 ? "s" : ""} published
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {month.totalViews.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">views</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="bg-blue-50 rounded p-3 text-center">
                      <div className="text-blue-600 font-medium text-lg">
                        {month.totalViews.toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">Views</div>
                    </div>
                    <div className="bg-red-50 rounded p-3 text-center">
                      <div className="text-red-600 font-medium text-lg">
                        {month.totalLikes.toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">Likes</div>
                    </div>
                    <div className="bg-purple-50 rounded p-3 text-center">
                      <div className="text-purple-600 font-medium text-lg">
                        {month.totalComments.toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-xs mt-1">Comments</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No monthly data available yet</p>
            <p className="text-sm text-gray-400">
              Start publishing blogs to see monthly trends
            </p>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {stats?.recentActivity?.recentBlogs?.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📝 Recent Publications
          </h3>
          <div className="space-y-3">
            {stats.recentActivity.recentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{blog.title}</h4>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span className="capitalize">• {blog.status}</span>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-900 font-medium">
                    {blog.views} views
                  </div>
                  <div className="text-gray-500 text-xs mt-1">
                    {blog.likeCount} likes • {blog.commentCount} comments
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
