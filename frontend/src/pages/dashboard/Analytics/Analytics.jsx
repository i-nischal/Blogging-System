import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Clock,
  Download,
  Loader2,
  RefreshCw,
} from "lucide-react";
import dashboardAPI from "../../../services/api/dashboard";
import blogsAPI from "../../../services/api/blogs";
// import { dashboardAPI, blogsAPI } from "../../../services/api";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("7days");
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both dashboard stats and monthly data
      const [dashboardResponse, monthlyResponse, blogStatsResponse] =
        await Promise.all([
          dashboardAPI.getWriterStats(),
          dashboardAPI.getMonthlyStats(),
          blogsAPI.getBlogStats(),
        ]);

      if (dashboardResponse.success) {
        setStats(dashboardResponse.data);
      }

      if (monthlyResponse.success) {
        setMonthlyData(monthlyResponse.data);
      }

      // Merge blog stats if needed
      if (blogStatsResponse.success) {
        setStats((prev) => ({
          ...prev,
          blogStats: blogStatsResponse.data,
        }));
      }
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Exporting analytics data...");

    // Create CSV data
    const csvContent = [
      ["Metric", "Value"],
      ["Total Views", stats?.overview?.totalViews || 0],
      ["Total Blogs", stats?.overview?.totalBlogs || 0],
      ["Published Blogs", stats?.overview?.published || 0],
      ["Total Comments", stats?.overview?.totalComments || 0],
      ["Total Likes", stats?.overview?.totalLikes || 0],
      ["Engagement Rate", stats?.overview?.engagementRate || "0%"],
    ]
      .map((row) => row.join(","))
      .join("\n");

    // Download CSV
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

  // Calculate analytics based on fetched data
  const calculateAnalytics = () => {
    if (!stats?.overview) return null;

    const totalViews = stats.overview.totalViews || 0;
    const totalBlogs = stats.overview.totalBlogs || 0;
    const avgViewsPerBlog =
      totalBlogs > 0 ? Math.round(totalViews / totalBlogs) : 0;

    // Calculate engagement rate (likes + comments) / views
    const totalEngagement =
      (stats.overview.totalLikes || 0) + (stats.overview.totalComments || 0);
    const engagementRate =
      totalViews > 0
        ? ((totalEngagement / totalViews) * 100).toFixed(1)
        : "0.0";

    // Mock bounce rate (backend doesn't provide this yet)
    const bounceRate = "42";

    return {
      totalViews: totalViews.toLocaleString(),
      uniqueVisitors: Math.round(totalViews * 0.65).toLocaleString(), // ~65% unique
      avgTimeOnPage: "3m 24s", // Mock data (backend doesn't track this yet)
      bounceRate: `${bounceRate}%`,
      engagementRate: `${engagementRate}%`,
      avgViewsPerBlog,
    };
  };

  const analytics = calculateAnalytics();

  const displayStats = analytics
    ? [
        {
          name: "Total Views",
          value: analytics.totalViews,
          change: "+12.4%", // TODO: Calculate from monthly data
          changeType: "positive",
          icon: Eye,
        },
        {
          name: "Unique Visitors",
          value: analytics.uniqueVisitors,
          change: "+8.2%", // TODO: Calculate from monthly data
          changeType: "positive",
          icon: Users,
        },
        {
          name: "Engagement Rate",
          value: analytics.engagementRate,
          change: "+5.1%",
          changeType: "positive",
          icon: TrendingUp,
        },
        {
          name: "Avg Views/Blog",
          value: analytics.avgViewsPerBlog.toString(),
          change: analytics.avgViewsPerBlog > 100 ? "+15.3%" : "-2.3%",
          changeType: analytics.avgViewsPerBlog > 100 ? "positive" : "negative",
          icon: Clock,
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your blog performance
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
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
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500"> from last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Stats Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Monthly Performance
        </h3>
        {monthlyData?.monthlyStats?.length > 0 ? (
          <div className="space-y-4">
            {monthlyData.monthlyStats.map((month, index) => (
              <div
                key={index}
                className="border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(
                      month._id.year,
                      month._id.month - 1
                    ).toLocaleDateString("default", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-sm text-gray-500">
                    {month.blogsPublished} blogs published
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Views:</span>
                    <span className="ml-2 font-medium">
                      {month.totalViews.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Likes:</span>
                    <span className="ml-2 font-medium">{month.totalLikes}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Comments:</span>
                    <span className="ml-2 font-medium">
                      {month.totalComments}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-500 mb-2">
                No monthly data available yet
              </p>
              <p className="text-sm text-gray-400">
                Start publishing blogs to see trends
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top Performing Blogs */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Top Performing Blogs
        </h3>
        {stats?.recentActivity?.topPerformingBlogs?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.topPerformingBlogs.map((blog, index) => (
              <div
                key={blog._id}
                className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-bold text-gray-300">
                    #{index + 1}
                  </span>
                  <div>
                    <h4 className="font-medium text-gray-900">{blog.title}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                      <span>👁️ {blog.views}</span>
                      <span>❤️ {blog.likeCount}</span>
                      <span>💬 {blog.commentCount}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {(
                      ((blog.likeCount + blog.commentCount) / blog.views) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No blog data available yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
