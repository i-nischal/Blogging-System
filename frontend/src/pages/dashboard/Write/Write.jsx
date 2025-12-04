import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Sparkles, Loader2 } from "lucide-react";
import TinyMCEEditor from "../../../components/writer/TinyMCEEditor";
import WriteHeader from "./WriteHeader";
import blogsAPI from "../../../services/api/blogs";

const Write = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [wordCount, setWordCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch blog data if editing
  useEffect(() => {
    if (id) {
      fetchBlogData(id);
    }
  }, [id]);

  const fetchBlogData = async (blogId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("📥 Fetching blog data for ID:", blogId);
      const response = await blogsAPI.getBlog(blogId);
      
      if (response.data.success) {
        const blog = response.data.data;
        console.log("✅ Blog data loaded:", blog);
        
        setTitle(blog.title);
        setContent(blog.content);
        
        // Calculate word count from loaded content
        const textContent = blog.content.replace(/<[^>]*>/g, "");
        const words = textContent.split(/\s+/).filter((word) => word.length > 0);
        setWordCount(words.length);
      }
    } catch (err) {
      console.error("❌ Error fetching blog:", err);
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
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchBlogData(id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
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