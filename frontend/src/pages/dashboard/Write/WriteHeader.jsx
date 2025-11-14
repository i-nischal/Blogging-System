import React, { useState } from "react";
import {
  Save,
  Eye,
  FileText,
  ChevronLeft,
  X,
  Upload,
  Tag,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WriteHeader = ({ content = "" }) => {
  const navigate = useNavigate();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [title, setTitle] = useState("Untitled");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [publishData, setPublishData] = useState({
    excerpt: "",
    tags: "",
    featuredImage: "",
    isPublishing: false,
  });

  const handleSaveDraft = () => {
    console.log("Saving draft...", { title, content });
  };

  const handlePublish = () => {
    if (title === "Untitled" || !title.trim()) {
      alert("Please add a title to your blog post before publishing.");
      return;
    }

    setPublishData((prev) => ({ ...prev, isPublishing: true }));
    console.log("Publishing...", { title, ...publishData, content });

    // Simulate publishing
    setTimeout(() => {
      setPublishData((prev) => ({ ...prev, isPublishing: false }));
      setShowPublishModal(false);
      navigate("/dashboard/my-blogs");
    }, 2000);
  };

  const handlePreview = () => {
    console.log("Opening preview...");
  };

  const handleTitleDoubleClick = () => {
    setIsEditingTitle(true);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (!title.trim()) {
      setTitle("Untitled");
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditingTitle(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Back to Dashboard"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <FileText className="h-5 w-5 text-green-600" />
              <div className="max-w-md">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    autoFocus
                    className="text-sm font-medium text-gray-900 bg-white border border-green-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                ) : (
                  <div
                    onDoubleClick={handleTitleDoubleClick}
                    className="text-sm font-medium text-gray-900 truncate px-2 py-1 cursor-text hover:bg-gray-50 rounded transition-colors"
                    title="Double-click to edit title"
                  >
                    {title}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveDraft}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
              >
                Save
              </button>

              <button
                onClick={handlePreview}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors flex items-center"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </button>

              <button
                onClick={() => setShowPublishModal(true)}
                className="px-4 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors flex items-center"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Publish Modal with Blur Background */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Ready to Publish?
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  "<span className="font-medium">{title}</span>"
                </p>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Featured Image
                  </div>
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Paste image URL or upload..."
                      value={publishData.featuredImage}
                      onChange={(e) =>
                        setPublishData((prev) => ({
                          ...prev,
                          featuredImage: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </button>
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Excerpt
                  </div>
                </label>
                <textarea
                  placeholder="Brief description that will appear in blog listings..."
                  value={publishData.excerpt}
                  onChange={(e) =>
                    setPublishData((prev) => ({
                      ...prev,
                      excerpt: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Tags
                  </div>
                </label>
                <input
                  type="text"
                  placeholder="technology, programming, web-development"
                  value={publishData.tags}
                  onChange={(e) =>
                    setPublishData((prev) => ({
                      ...prev,
                      tags: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate tags with commas
                </p>
              </div>

              {/* Publishing Info */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Ready to share your thoughts?
                </h3>
                <p className="text-sm text-blue-700">
                  Your blog "<span className="font-semibold">{title}</span>"
                  will be published and visible to your readers.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={handlePublish}
                disabled={publishData.isPublishing}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {publishData.isPublishing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Publishing...
                  </>
                ) : (
                  "Publish Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WriteHeader;
