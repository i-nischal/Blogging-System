import api from "./base";

export const blogsAPI = {
  // Get all published blogs with pagination
  getAllBlogs: async (params = {}) => {
    const { page = 1, limit = 10, tags, search } = params;
    const response = await api.get("/blogs", {
      params: { page, limit, tags, search },
    });
    return response; // Return the full response
  },

  // Get single blog by ID
  getBlog: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response;
  },

  // Get user's blogs (for dashboard)
  getMyBlogs: async (params = {}) => {
    const { page = 1, limit = 10, status } = params;
    console.log("🌐 Calling /blogs/my-blogs with params:", {
      page,
      limit,
      status,
    });

    const response = await api.get("/blogs/my-blogs", {
      params: { page, limit, status },
    });

    console.log("✅ Raw API response:", response);
    console.log("📊 Response data:", response.data);

    return response; // Return full axios response
  },

  // Create new blog
  createBlog: async (blogData) => {
    const response = await api.post("/blogs", blogData);
    return response;
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response;
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await api.delete(`/blogs/${id}`);
    return response;
  },

  // Toggle publish status
  togglePublish: async (id) => {
    const response = await api.patch(`/blogs/${id}/publish`);
    return response;
  },

  // Like/Unlike blog
  toggleLike: async (id) => {
    const response = await api.post(`/blogs/${id}/like`);
    return response;
  },

  // Get blog statistics
  getBlogStats: async () => {
    const response = await api.get("/blogs/stats");
    return response;
  },

  // Search blogs with advanced filters
  searchBlogs: async (params = {}) => {
    const { q, tags, author, sortBy = "recent", page = 1, limit = 10 } = params;
    const response = await api.get("/blogs/search", {
      params: { q, tags, author, sortBy, page, limit },
    });
    return response;
  },
};

export default blogsAPI;
