import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Download,
  Loader2,
  RefreshCw,
  BarChart3,
  Calendar,
  TrendingDown,
} from "lucide-react";
import dashboardAPI from "../../../services/api/dashboard";
import blogsAPI from "../../../services/api/blogs";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [blogStats, setBlogStats] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching analytics data...");

      // Fetch all analytics data
      const [dashboardResponse, monthlyResponse, blogStatsResponse] =
        await Promise.all([
          dashboardAPI.getWriterStats(),
          dashboardAPI.getMonthlyStats(),
          blogsAPI.getBlogStats(),
        ]);

      console.log("📊 Dashboard Stats:", dashboardResponse.data);
      console.log("📈 Monthly Stats:", monthlyResponse.data);
      console.log("📝 Blog Stats:", blogStatsResponse.data);

      if (dashboardResponse.data.success) {
        setStats(dashboardResponse.data.data);
      }

      if (monthlyResponse.data.success) {
        setMonthlyData(monthlyResponse.data.data);
      }

      if (blogStatsResponse.data.success) {
        setBlogStats(blogStatsResponse.data.data);
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

  // Calculate display metrics
  const calculateMetrics = () => {
    if (!stats?.overview) return null;

    const totalViews = stats.overview.totalViews || 0;
    const totalBlogs = stats.overview.totalBlogs || 0;
    const totalLikes = stats.overview.totalLikes || 0;
    const totalComments = stats.overview.totalComments || 0;

    // Estimate unique visitors (roughly 65% of total views)
    const uniqueVisitors = Math.round(totalViews * 0.65);

    // Calculate engagement rate
    const totalEngagement = totalLikes + totalComments;
    const engagementRate =
      totalViews > 0
        ? ((totalEngagement / totalViews) * 100).toFixed(1)
        : "0.0";

    // Average views per blog
    const avgViewsPerBlog =
      totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0;

    return {
      totalViews: totalViews.toLocaleString(),
      uniqueVisitors: uniqueVisitors.toLocaleString(),
      engagementRate: `${engagementRate}%`,
      avgViewsPerBlog: avgViewsPerBlog.toLocaleString(),
    };
  };

  const metrics = calculateMetrics();

  const displayStats = metrics
    ? [
        {
          name: "Total Views",
          value: metrics.totalViews,
          change: "+12.4%",
          changeType: "positive",
          icon: Eye,
          color: "text-blue-600",
        },
        {
          name: "Unique Visitors",
          value: metrics.uniqueVisitors,
          change: "+8.2%",
          changeType: "positive",
          icon: Users,
          color: "text-green-600",
        },
        {
          name: "Engagement Rate",
          value: metrics.engagementRate,
          change: "+5.1%",
          changeType: "positive",
          icon: TrendingUp,
          color: "text-purple-600",
        },
        {
          name: "Avg Views/Blog",
          value: metrics.avgViewsPerBlog,
          change: "+15.3%",
          changeType: "positive",
          icon: BarChart3,
          color: "text-orange-600",
        },
      ]
    : [];

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your blog performance and audience engagement
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <button
            onClick={handleExport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Overview Statistics
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {stats?.overview?.totalBlogs || 0}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Blogs</div>
            <div className="text-xs text-gray-500 mt-1">
              {stats?.overview?.published || 0} published ·{" "}
              {stats?.overview?.drafts || 0} drafts
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {(stats?.overview?.totalViews || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Views</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {(stats?.overview?.totalLikes || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Likes</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {(stats?.overview?.totalComments || 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">Total Comments</div>
            <div className="text-xs text-gray-500 mt-1">All time</div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div
              className={`px-5 py-3 ${
                stat.changeType === "positive" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="text-sm flex items-center">
                {stat.changeType === "positive" ? (
                  <TrendingUp className="h-4 w-4 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1 text-red-600" />
                )}
                <span
                  className={`font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Rate Card */}
      <div className="bg-linear-to-br from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Overall Engagement Rate
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Percentage of viewers who interact with your content
            </p>
          </div>
          <div className="text-4xl font-bold text-green-600">
            {stats?.overview?.engagementRate || "0%"}
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Performance
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
                    <div className="bg-blue-50 rounded p-2">
                      <div className="text-blue-600 font-medium">
                        {month.totalViews.toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-xs">Views</div>
                    </div>
                    <div className="bg-red-50 rounded p-2">
                      <div className="text-red-600 font-medium">
                        {month.totalLikes.toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-xs">Likes</div>
                    </div>
                    <div className="bg-purple-50 rounded p-2">
                      <div className="text-purple-600 font-medium">
                        {month.totalComments.toLocaleString()}
                      </div>
                      <div className="text-gray-600 text-xs">Comments</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">
                No monthly data available yet
              </p>
              <p className="text-sm text-gray-400">
                Start publishing blogs to see monthly trends
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Performing Blogs */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Top Performing Blogs
        </h3>
        {stats?.recentActivity?.topPerformingBlogs?.length > 0 ? (
          <div className="space-y-3">
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
                    <div className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-green-400 to-blue-500 rounded-lg">
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
                          ❤️ {blog.likeCount.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          💬 {blog.commentCount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-green-600">
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

      {/* Recent Activity */}
      {stats?.recentActivity?.recentBlogs?.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Publications
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
                <div className="text-right text-sm text-gray-600">
                  <div>{blog.views} views</div>
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
