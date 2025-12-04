// frontend/src/pages/public/BlogDetail/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  User,
  Bookmark,
  MoreHorizontal,
  Send,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Share2,
} from "lucide-react";
import blogsAPI from "../../../services/api/blogs";
import { commentsAPI } from "../../../services/api/comments";
import { likesAPI } from "../../../services/api/likes";
import { useAuth } from "../../../contexts/AuthContext";
import DOMPurify from "dompurify";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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
      const text = blog.content.replace(/<[^>]*>/g, "");
      const words = text.split(/\s+/).filter((word) => word.length > 0);
      setReadTime(Math.ceil(words.length / 200));
    }
  }, [blog]);

  const fetchBlogAndComments = async () => {
    try {
      setLoading(true);
      setError(null);

      const blogResponse = await blogsAPI.getBlog(id);

      if (blogResponse.data.success) {
        const blogData = blogResponse.data.data;
        setBlog(blogData);
        setIsLiked(blogData.userLiked || false);
        setLikeCount(blogData.likeCount || 0);
      }

      const commentsResponse = await commentsAPI.getBlogComments(id);
      if (commentsResponse.data.success) {
        setComments(commentsResponse.data.data.comments);
      }
    } catch (err) {
      console.error("Error fetching blog:", err);
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
        setBlog({ ...blog, commentCount: blog.commentCount + 1 });
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const sanitizeHtml = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "strong",
        "em",
        "u",
        "s",
        "ul",
        "ol",
        "li",
        "a",
        "img",
        "blockquote",
        "code",
        "pre",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class"],
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Story Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "This story doesn't exist or has been removed."}
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Action Bar */}
      <div className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left side */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isLiked
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Heart
                size={20}
                fill={isLiked ? "currentColor" : "none"}
                className="transition-all"
              />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>

            {/* Comments Scroll */}
            <button
              onClick={() => {
                const commentsSection = document.getElementById("comments");
                commentsSection?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              <MessageCircle size={20} />
              <span className="text-sm font-medium">{blog.commentCount}</span>
            </button>

            {/* Bookmark */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Bookmark size={20} className="text-gray-700" />
            </button>

            {/* Share */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Share2 size={20} className="text-gray-700" />
            </button>

            {/* More */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <MoreHorizontal size={20} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-[680px] mx-auto px-6 pt-32 pb-20">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 leading-[1.15] text-gray-900 tracking-tight">
          {blog.title}
        </h1>

        {/* Author Info - MOVED BEFORE CONTENT */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {getInitial(blog.author?.name)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {blog.author?.name || "Unknown Author"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{formatDate(blog.createdAt)}</span>
                <span>·</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>

          <button className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
            Follow
          </button>
        </div>

        {/* Featured Image */}
        {blog.coverImage && (
          <div className="mb-10 -mx-6 sm:mx-0">
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full rounded-lg"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Article Content with Medium-style Typography */}
        <div
          className="article-content"
          style={{
            fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.content) }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author Card */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="h-16 w-16 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-semibold text-2xl">
                {getInitial(blog.author?.name)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {blog.author?.name || "Unknown Author"}
                </h3>
                <button className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                  Follow
                </button>
              </div>
              <p className="text-gray-600">
                Writer sharing insights about{" "}
                {blog.tags?.[0] || "various topics"}
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div
        id="comments"
        className="max-w-[680px] mx-auto px-6 pb-20 border-t border-gray-200"
      >
        <div className="pt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Responses ({comments.length})
          </h2>

          {/* Comment Input */}
          {isAuthenticated ? (
            <div className="mb-12">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold">
                    {getInitial(user?.name)}
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What are your thoughts?"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-base"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      onClick={handleCommentSubmit}
                      disabled={!commentText.trim() || isSubmittingComment}
                      className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center font-medium"
                    >
                      {isSubmittingComment ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Respond
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center mb-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Join the conversation
              </h3>
              <p className="text-gray-600 mb-6">
                Sign in to leave your thoughts
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-green-600 text-white px-8 py-3 rounded-full hover:bg-green-700 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-8">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-4">
                  <div className="h-10 w-10 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-semibold text-sm">
                      {getInitial(comment.user.name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {comment.user.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-800 leading-relaxed">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                        <Heart size={16} />
                        <span>Like</span>
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-900">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No responses yet</p>
                <p className="text-sm text-gray-500 mt-1">
                  Be the first to share your thoughts
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
