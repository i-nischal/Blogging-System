// frontend/src/components/reader/BlogList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  TrendingUp,
  Clock,
  Loader2,
} from "lucide-react";
import blogsAPI from "../../services/api/blogs";
import { useAuth } from "../../contexts/AuthContext";

const BlogList = () => {
  const { isAuthenticated, user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("foryou"); // foryou or featured
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchBlogs();
  }, [pagination.page, activeTab]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await blogsAPI.getAllBlogs({
        page: pagination.page,
        limit: pagination.limit,
      });

      if (response.data.success) {
        setBlogs(response.data.data.blogs);
        setPagination({
          ...pagination,
          total: response.data.data.pagination.total,
          pages: response.data.data.pagination.pages,
        });
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1d ago";
    if (diffInDays < 30) return `${diffInDays}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const calculateReadTime = (content) => {
    if (!content) return 1;
    const text = content.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).filter((word) => word.length > 0);
    return Math.ceil(words.length / 200);
  };

  const getExcerpt = (content, maxLength = 150) => {
    const text = content.replace(/<[^>]*>/g, "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Tabs - For You / Featured */}
      <div className="border-b border-gray-200 sticky top-16 bg-white z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("foryou")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "foryou"
                  ? "border-gray-900 text-gray-900 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              For you
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "featured"
                  ? "border-gray-900 text-gray-900 font-medium"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Featured
            </button>
          </div>
        </div>
      </div>

      {/* Blog Feed */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {blogs.length > 0 ? (
          <div className="space-y-8">
            {blogs.map((blog, index) => (
              <article
                key={blog._id}
                className="border-b border-gray-200 pb-8 last:border-b-0"
              >
                {/* Author Info */}
                <div className="flex items-center space-x-2 mb-3">
                  <Link
                    to={`/profile/${blog.author._id}`}
                    className="flex items-center space-x-2 hover:opacity-80"
                  >
                    <div className="h-5 w-5 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-600">
                        {blog.author.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900 font-medium">
                      {blog.author.name}
                    </span>
                  </Link>
                  {blog.tags && blog.tags.length > 0 && (
                    <>
                      <span className="text-gray-400">in</span>
                      <Link
                        to={`/tag/${blog.tags[0]}`}
                        className="text-sm text-gray-700 hover:text-gray-900"
                      >
                        {blog.tags[0]}
                      </Link>
                    </>
                  )}
                </div>

                <div className="flex gap-6">
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/blog/${blog._id}`}>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 hover:text-gray-700 line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>

                    <p className="text-gray-600 text-base mb-4 line-clamp-2 hidden md:block">
                      {blog.excerpt || getExcerpt(blog.content)}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          {formatDate(blog.createdAt)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          {calculateReadTime(blog.content)} min read
                        </span>
                        {index === 0 && (
                          <span className="flex items-center text-yellow-600">
                            ⭐ Member-only
                          </span>
                        )}
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center space-x-3">
                        <button
                          className="hover:text-gray-900 transition-colors"
                          title="Bookmark"
                        >
                          <Bookmark className="h-5 w-5" />
                        </button>
                        <button
                          className="hover:text-gray-900 transition-colors"
                          title="More options"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    {/* Engagement Stats (Below Title on Mobile) */}
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 md:hidden">
                      <span className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        {blog.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {blog.likeCount}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {blog.commentCount}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {blog.coverImage && (
                    <Link
                      to={`/blog/${blog._id}`}
                      className="shrink-0 w-28 h-28 md:w-32 md:h-32"
                    >
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-600">Be the first to publish!</p>
          </div>
        )}

        {/* Load More / Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-12 text-center">
            {pagination.page < pagination.pages && (
              <button
                onClick={() =>
                  setPagination({ ...pagination, page: pagination.page + 1 })
                }
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Load more stories
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
