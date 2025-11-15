import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  EyeIcon,
  Heart,
  MessageCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import blogsAPI from "../../../services/api/blogs";

const MyBlogs = () => {
  const navigate = useNavigate();

  // State management
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Stats state
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalViews: 0,
  });

  // Fetch blogs on mount and when filters change
  useEffect(() => {
    fetchBlogs();
  }, [pagination.page, statusFilter]);

  // Fetch user's blogs
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await blogsAPI.getMyBlogs({
        page: pagination.page,
        limit: pagination.limit,
        status: statusFilter,
      });

      if (response.data.success) {
        setBlogs(response.data.data.blogs);
        setPagination({
          ...pagination,
          total: response.data.data.pagination.total,
          pages: response.data.data.pagination.pages,
        });

        // Calculate stats
        calculateStats(response.data.data.blogs);
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.response?.data?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from blogs
  const calculateStats = (blogsData) => {
    const published = blogsData.filter((blog) => blog.status === "published")
      .length;
    const draft = blogsData.filter((blog) => blog.status === "draft").length;
    const totalViews = blogsData.reduce((sum, blog) => sum + blog.views, 0);

    setStats({
      total: blogsData.length,
      published,
      draft,
      totalViews,
    });
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Implement debounced search if needed
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPagination({ ...pagination, page: 1 }); // Reset to first page
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (
      !window.confirm(`Are you sure you want to delete "${blogTitle}"?`)
    ) {
      return;
    }

    try {
      const response = await blogsAPI.deleteBlog(blogId);

      if (response.data.success) {
        // Remove blog from state
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
        alert("Blog deleted successfully!");
        fetchBlogs(); // Refresh the list
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(err.response?.data?.message || "Failed to delete blog");
    }
  };

  // Handle toggle publish
  const handleTogglePublish = async (blogId, currentStatus) => {
    try {
      const response = await blogsAPI.togglePublish(blogId);

      if (response.data.success) {
        // Update blog status in state
        setBlogs(
          blogs.map((blog) =>
            blog._id === blogId
              ? { ...blog, status: response.data.data.status }
              : blog
          )
        );
        alert(
          `Blog ${
            currentStatus === "published" ? "unpublished" : "published"
          } successfully!`
        );
      }
    } catch (err) {
      console.error("Error toggling publish:", err);
      alert(err.response?.data?.message || "Failed to update blog status");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Loading state
  if (loading && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading your blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your blog posts</p>
        </div>
        <button
          onClick={() => navigate("/write")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Blog
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-red-800 font-medium">Error loading blogs</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={fetchBlogs}
            className="ml-4 text-red-600 hover:text-red-800"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {stats.published}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.draft}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalViews}
          </div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={handleStatusFilter}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Blog Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metrics
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {blog.excerpt}
                          </p>
                        )}
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {formatDate(blog.createdAt)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleTogglePublish(blog._id, blog.status)
                        }
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          blog.status
                        )} hover:opacity-80 transition-opacity`}
                      >
                        {blog.status.charAt(0).toUpperCase() +
                          blog.status.slice(1)}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {blog.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {blog.likeCount}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {blog.commentCount}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(blog.updatedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/write/${blog._id}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {blog.status === "published" && (
                          <button
                            onClick={() => navigate(`/blog/${blog._id}`)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteBlog(blog._id, blog.title)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900">No blogs yet</h3>
            <p className="text-gray-600 mt-2">
              Start writing your first blog post!
            </p>
            <button
              onClick={() => navigate("/write")}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Create Your First Blog
            </button>
          </div>
        )}

        {/* Pagination */}
        {blogs.length > 0 && pagination.pages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {pagination.page} of {pagination.pages} (
                {pagination.total} total blogs)
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;