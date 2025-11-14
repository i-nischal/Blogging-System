import React from "react";
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
} from "lucide-react";

const MyBlogs = () => {
  const navigate = useNavigate();

  const blogs = [
    {
      id: 1,
      title: "Getting Started with React",
      excerpt:
        "Learn the fundamentals of React and build your first application",
      status: "published",
      views: 1234,
      likes: 56,
      comments: 12,
      createdAt: "2025-01-10",
      lastUpdated: "2025-01-15",
      category: "Programming",
    },
    {
      id: 2,
      title: "Advanced JavaScript Patterns",
      excerpt:
        "Deep dive into advanced JavaScript design patterns and best practices",
      status: "draft",
      views: 0,
      likes: 0,
      comments: 0,
      createdAt: "2025-01-12",
      lastUpdated: "2025-01-12",
      category: "JavaScript",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 border-green-200";
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleCreateNewBlog = () => {
    navigate("/write");
  };

  const handleEditBlog = (blogId) => {
    navigate(`/dashboard/edit-blog/${blogId}`);
  };

  const handleViewBlog = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your blog posts</p>
        </div>
        <button
          onClick={handleCreateNewBlog}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Blog
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{blogs.length}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">
            {blogs.filter((blog) => blog.status === "published").length}
          </div>
          <div className="text-sm text-gray-600">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">
            {blogs.filter((blog) => blog.status === "draft").length}
          </div>
          <div className="text-sm text-gray-600">Drafts</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">
            {blogs.reduce((total, blog) => total + blog.views, 0)}
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
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
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Created: {blog.createdAt}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                        blog.status
                      )}`}
                    >
                      {blog.status.charAt(0).toUpperCase() +
                        blog.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        {blog.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {blog.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {blog.comments}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {blog.lastUpdated}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditBlog(blog.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewBlog(blog.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
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

        {/* Empty State */}
        {blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900">No blogs yet</h3>
            <p className="text-gray-600 mt-2">
              Start writing your first blog post!
            </p>
            <button
              onClick={handleCreateNewBlog}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Create Your First Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBlogs;
