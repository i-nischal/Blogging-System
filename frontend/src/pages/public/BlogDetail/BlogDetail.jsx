// frontend/src/pages/public/BlogDetail/BlogDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Eye,
  User,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import blogsAPI from "../../../services/api/blogs";

// ❌ FIXED: likesAPI must NOT come from comments.js
import { commentsAPI } from "../../../services/api/comments";
import { likesAPI } from "../../../services/api/likes";

import { useAuth } from "../../../contexts/AuthContext";

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

  const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const getExcerpt = (content, maxLength = 200) => {
    const text = stripHtml(content || "");
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Not Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Medium
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                isLiked
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              <span className="text-sm font-medium">{likeCount}</span>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bookmark size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Article */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1
          className="text-5xl font-bold mb-3 leading-tight text-gray-900"
          style={{
            fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
          }}
        >
          {blog.title}
        </h1>

        {/* Excerpt */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {blog.excerpt || getExcerpt(blog.content)}
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          <div className="w-12 h-12 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <User size={24} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">
                {blog.author?.name || "Unknown Author"}
              </span>
              <span className="text-gray-400">·</span>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                Follow
              </button>
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <span>{readTime} min read</span>
              <span>·</span>
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div
          className="article-content"
          style={{
            fontSize: "21px",
            lineHeight: "1.58",
            color: "#292929",
            fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif',
            letterSpacing: "-0.003em",
          }}
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        {/* Author Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {blog.author?.name || "Unknown Author"}
                </h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700">
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

      {/* Comments */}
      <div className="max-w-3xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Comments ({comments.length})
        </h2>

        {isAuthenticated ? (
          <div className="mb-8">
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!commentText.trim() || isSubmittingComment}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
                  >
                    {isSubmittingComment ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center mb-8">
            <p className="text-gray-800 mb-4">Sign in to leave a comment</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Sign In
            </button>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start space-x-4 bg-white p-4 rounded-lg border border-gray-200"
            >
              <div className="h-10 w-10 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {comment.user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {comment.user.name}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
