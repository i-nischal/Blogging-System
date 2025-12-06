import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  Eye,
  FileText,
  ChevronLeft,
  X,
  Upload,
  Tag,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import blogsAPI from "../../../services/api/blogs";
import apiClient from "../../../services/api/base";

const WriteHeader = ({
  content = "",
  title,
  setTitle,
  blogId = null,
  blogData = null,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishData, setPublishData] = useState({
    tags: "",
    coverImage: "",
    status: "draft",
    isPublishing: false,
  });

  // Load existing blog data
  useEffect(() => {
    if (blogData) {
      setPublishData({
        tags: blogData.tags ? blogData.tags.join(", ") : "",
        coverImage: blogData.coverImage || "",
        status: blogData.status || "draft",
        isPublishing: false,
      });
      if (blogData.coverImage) {
        setImagePreview(blogData.coverImage);
      }
    }
  }, [blogData]);

  const handleSaveDraft = async () => {
    if (!title.trim() || title === "Untitled") {
      alert("Please add a title before saving.");
      return;
    }

    try {
      setIsSaving(true);

      const blogPayload = {
        title: title.trim(),
        content: content,
        status: "draft",
        tags: publishData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        coverImage: publishData.coverImage,
      };

      let response;
      if (blogId) {
        console.log("📝 Updating blog:", blogId);
        response = await blogsAPI.updateBlog(blogId, blogPayload);
      } else {
        console.log("📝 Creating new blog");
        response = await blogsAPI.createBlog(blogPayload);
      }

      if (response.data.success) {
        alert(blogId ? "Draft saved successfully!" : "Blog created as draft!");

        if (!blogId && response.data.data._id) {
          navigate(`/write/${response.data.data._id}`, { replace: true });
        }
      }
    } catch (err) {
      console.error("❌ Error saving draft:", err);
      alert(err.response?.data?.message || "Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || title === "Untitled") {
      alert("Please add a title to your blog post before publishing.");
      return;
    }

    if (!content || content.trim().length < 50) {
      alert("Please add more content before publishing.");
      return;
    }

    try {
      setPublishData((prev) => ({ ...prev, isPublishing: true }));

      const blogPayload = {
        title: title.trim(),
        content: content,
        tags: publishData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        coverImage: publishData.coverImage.trim(),
        status: "published",
      };

      let response;
      if (blogId) {
        console.log("📤 Publishing existing blog:", blogId);
        response = await blogsAPI.updateBlog(blogId, blogPayload);
      } else {
        console.log("📤 Publishing new blog");
        response = await blogsAPI.createBlog(blogPayload);
      }

      if (response.data.success) {
        alert(
          blogId
            ? "Blog updated and published!"
            : "Blog published successfully!"
        );
        setShowPublishModal(false);
        navigate("/dashboard/my-blogs");
      }
    } catch (err) {
      console.error("❌ Error publishing:", err);
      alert(err.response?.data?.message || "Failed to publish blog");
      setPublishData((prev) => ({ ...prev, isPublishing: false }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    try {
      setUploadingImage(true);

      // Create FormData
      const formData = new FormData();
      formData.append("image", file);

      console.log("📤 Uploading image to server...");

      // Upload to backend
      const response = await apiClient.post("/upload/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Upload response:", response.data);

      if (response.data.success) {
        const imageUrl = response.data.data.url;

        // Set preview and save URL
        setImagePreview(imageUrl);
        setPublishData((prev) => ({
          ...prev,
          coverImage: imageUrl,
        }));

        console.log("✅ Image uploaded successfully:", imageUrl);
        alert("Image uploaded successfully!");
      }
    } catch (err) {
      console.error("❌ Error uploading image:", err);
      alert(err.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPublishData((prev) => ({ ...prev, coverImage: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreview = () => {
    if (blogId) {
      window.open(`/blog/${blogId}`, "_blank");
    } else {
      alert("Please save as draft first to preview.");
    }
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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/dashboard/my-blogs")}
                className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                title="Back to My Blogs"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <FileText className="h-5 w-5 text-green-600" />

              {/* Editable Title */}
              <div className="max-w-md">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={handleTitleKeyDown}
                    autoFocus
                    placeholder="Blog Title"
                    className="text-sm font-medium text-gray-900 bg-white border border-green-500 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 min-w-[200px]"
                  />
                ) : (
                  <div
                    onDoubleClick={handleTitleDoubleClick}
                    className="text-sm font-medium text-gray-900 truncate px-3 py-1.5 cursor-text hover:bg-gray-50 rounded transition-colors min-w-[100px]"
                    title="Double-click to edit title"
                  >
                    {title}
                  </div>
                )}
              </div>

              {blogId && (
                <span className="text-xs text-gray-500 bg-blue-50 px-2 py-1 rounded">
                  Editing
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </>
                )}
              </button>

              {blogId && (
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
              )}

              <button
                onClick={() => setShowPublishModal(true)}
                className="px-5 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center font-medium"
              >
                {blogId ? "Update" : "Publish"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {blogId ? "Update Blog" : "Ready to Publish?"}
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
              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  <div className="flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Cover Image
                  </div>
                </label>

                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="cover-image-upload"
                    />
                    <label
                      htmlFor="cover-image-upload"
                      className="cursor-pointer"
                    >
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="h-12 w-12 text-green-600 animate-spin mb-3" />
                          <p className="text-sm text-gray-600">Uploading...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-12 w-12 text-gray-400 mb-3" />
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            Click to upload cover image
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {/* OR Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={publishData.coverImage}
                  onChange={(e) => {
                    setPublishData((prev) => ({
                      ...prev,
                      coverImage: e.target.value,
                    }));
                    if (e.target.value) {
                      setImagePreview(e.target.value);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separate tags with commas (e.g., react, javascript, tutorial)
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-linear-to-r from-green-50 to-blue-50 rounded-lg p-5 border border-green-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-green-600 mr-3 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      {blogId ? "Update your blog" : "Ready to share?"}
                    </h3>
                    <p className="text-sm text-gray-700">
                      Your blog will be {blogId ? "updated and" : ""} published
                      immediately and visible to all readers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white flex items-center justify-between p-6 border-t border-gray-200 rounded-b-2xl">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-6 py-2.5 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Continue Editing
              </button>
              <button
                onClick={handlePublish}
                disabled={publishData.isPublishing}
                className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-medium shadow-lg shadow-green-600/20"
              >
                {publishData.isPublishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {blogId ? "Updating..." : "Publishing..."}
                  </>
                ) : (
                  <>{blogId ? "Update Now" : "Publish Now"}</>
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
