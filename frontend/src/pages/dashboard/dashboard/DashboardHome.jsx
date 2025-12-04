import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  TrendingUp,
  MessageCircle,
  FileText,
  Eye,
  Heart,
  Loader2,
} from "lucide-react";
import dashboardAPI from "../../../services/api/dashboard";

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getWriterStats();

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: Plus,
      label: "Write New Blog",
      description: "Create a new blog post",
      href: "/write",
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      label: "View Analytics",
      description: "Check your blog performance",
      href: "/dashboard/analytics",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      label: "Manage Comments",
      description: "Review and respond to comments",
      href: "/dashboard/comments",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      label: "My Blogs",
      description: "Manage your blog posts",
      href: "/dashboard/my-blogs",
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your blogs today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📝</div>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Blogs
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats?.overview?.totalBlogs || 0}
                </dd>
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              {stats?.overview?.published || 0} published
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👁️</div>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Views
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {(stats?.overview?.totalViews || 0).toLocaleString()}
                </dd>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">Across all blogs</div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💬</div>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Comments
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats?.overview?.totalComments || 0}
                </dd>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">Total engagement</div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">📄</div>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Drafts
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats?.overview?.drafts || 0}
                </dd>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">Unpublished posts</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div
              className={`${action.color} h-12 w-12 rounded-lg flex items-center justify-center mb-3`}
            >
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">{action.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Top Blogs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blogs */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Blogs
          </h3>
          <div className="space-y-3">
            {stats?.recentActivity?.recentBlogs?.length > 0 ? (
              stats.recentActivity.recentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {blog.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      {blog.status} •{" "}
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 ml-4">
                    {blog.views} views
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">
                No blogs yet
              </p>
            )}
          </div>
        </div>

        {/* Top Performing */}
        <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Top Performing
          </h3>
          <div className="space-y-3">
            {stats?.recentActivity?.topPerformingBlogs?.length > 0 ? (
              stats.recentActivity.topPerformingBlogs
                .slice(0, 3)
                .map((blog, index) => (
                  <div
                    key={blog._id}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-green-600 rounded-full text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {blog.title}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {blog.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {blog.likeCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">
                Publish blogs to see top performers
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
