import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import TinyMCEEditor from "../../../components/writer/TinyMCEEditor";
import WriteHeader from "./WriteHeader";
import blogsAPI from "../../../services/api/blogs";

const Write = () => {
  const { id } = useParams(); // Get blog ID from URL params
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blogData, setBlogData] = useState(null);

  // Load blog data if editing
  useEffect(() => {
    if (id) {
      loadBlogData();
    }
  }, [id]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("📖 Loading blog data for ID:", id);

      const response = await blogsAPI.getBlog(id);
      
      if (response.data.success) {
        const blog = response.data.data;
        console.log("✅ Blog loaded:", blog);
        
        setBlogData(blog);
        setTitle(blog.title || "Untitled");
        setContent(blog.content || "");
        
        // Calculate initial word count
        const textContent = (blog.content || "").replace(/<[^>]*>/g, "");
        const words = textContent.split(/\s+/).filter((word) => word.length > 0);
        setWordCount(words.length);
      }
    } catch (err) {
      console.error("❌ Error loading blog:", err);
      setError(err.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = useCallback((newContent) => {
    setContent(newContent);

    // Calculate word count
    const textContent = newContent.replace(/<[^>]*>/g, "");
    const words = textContent.split(/\s+/).filter((word) => word.length > 0);
    setWordCount(words.length);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Blog
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <WriteHeader 
        content={content} 
        title={title}
        setTitle={setTitle}
        blogId={id}
        blogData={blogData}
      />

      <div className="flex-1 bg-white">
        <div className="border-b border-gray-200 px-6 py-2 bg-white flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4" />
            <span>{wordCount} words</span>
          </div>
          <div className="text-xs text-gray-400">
            {id ? "Editing blog post" : "Start writing your content"}
          </div>
        </div>

        <div className="h-[calc(100vh-96px)]">
          <TinyMCEEditor
            content={content}
            onContentChange={handleContentChange}
            height="100%"
          />
        </div>
      </div>
    </div>
  );
};

export default Write;