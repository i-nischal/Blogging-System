// frontend/src/pages/public/BlogDetail/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Eye,
  Calendar,
  User,
  Share2,
  Bookmark,
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";
import blogsAPI from "../../../services/api/blogs";
import { commentsAPI, likesAPI } from "../../../services/api/comments";
import { useAuth } from "../../../contexts/AuthContext";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // State management
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [readTime, setReadTime] = useState(0);

  useEffect(() => {
    fetchBlogAndComments();
  }, [id]);

  useEffect(() => {
    if (blog?.content) {
      // Calculate read time (average 200 words per minute)
      const text = blog.content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      const minutes = Math.ceil(words.length / 200);
      setReadTime(minutes);
    }
  }, [blog]);

  const fetchBlogAndComments = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📖 Fetching blog:", id);

      // Fetch blog details
      const blogResponse = await blogsAPI.getBlog(id);

      console.log("✅ Blog response:", blogResponse);

      if (blogResponse.data.success) {
        setBlog(blogResponse.data.data);
        setIsLiked(blogResponse.data.data.userLiked || false);
        setLikeCount(blogResponse.data.data.likeCount || 0);
      }

      // Fetch comments
      const commentsResponse = await commentsAPI.getBlogComments(id);
      console.log("💬 Comments response:", commentsResponse);

      if (commentsResponse.data.success) {
        setComments(commentsResponse.data.data.comments);
      }
    } catch (err) {
      console.error("❌ Error fetching blog:", err);
      setError(err.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      const response = await likesAPI.toggleLike(id);

      if (response.data.success) {
        setIsLiked(response.data.data.liked);
        setLikeCount(response.data.data.likeCount);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      alert("Failed to like blog");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!commentText.trim()) return;

    try {
      setIsSubmittingComment(true);
      const response = await commentsAPI.createComment(id, commentText);

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setCommentText("");
        // Update comment count in blog
        setBlog({ ...blog, commentCount: blog.commentCount + 1 });
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert(err.response?.data?.message || "Failed to post comment");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The blog you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
      </nav>

      {/* Blog Content */}
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Author Info & Meta */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Link
                to={`/profile/${blog.author._id}`}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {blog.author.name}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(blog.createdAt)}
                  </div>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {blog.views.toLocaleString()}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {readTime} min read
              </div>
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Featured Image */}
          {blog.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </header>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none mb-12 text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
          style={{
            fontSize: "1.125rem",
            lineHeight: "1.8",
          }}
        />

        {/* Engagement Bar */}
        <div className="flex items-center justify-between py-6 border-y border-gray-200 bg-white rounded-lg px-6 shadow-sm">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors ${
                isLiked ? "text-red-600" : "text-gray-600 hover:text-red-600"
              }`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">{likeCount}</span>
            </button>

            <div className="flex items-center space-x-2 text-gray-600">
              <MessageCircle className="h-6 w-6" />
              <span className="font-medium">{blog.commentCount}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-sm font-medium hidden sm:inline">
                Share
              </span>
            </button>

            <button className="text-gray-600 hover:text-yellow-600 transition-colors">
              <Bookmark className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {isAuthenticated ? (
            <div className="mb-8">
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        handleCommentSubmit(e);
                      }
                    }}
                    placeholder="Share your thoughts... (Ctrl+Enter to submit)"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      Ctrl+Enter to submit
                    </span>
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim() || isSubmittingComment}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSubmittingComment ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center mb-8">
              <MessageCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <p className="text-gray-800 font-medium mb-2">
                Join the conversation
              </p>
              <p className="text-gray-600 mb-4 text-sm">
                Sign in to leave a comment and engage with the community
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start space-x-4 bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {comment.user.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No comments yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;

// ===== Update frontend/src/App.jsx =====
// Add this import at the top:
// import BlogDetail from "./pages/public/BlogDetail/BlogDetail";

// Add this route in your Routes section (after the Home route):
// <Route path="/blog/:id" element={<BlogDetail />} />