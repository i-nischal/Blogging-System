import api from "./base";

export const blogsAPI = {
  // Get all published blogs with pagination
  getAllBlogs: async (params = {}) => {
    const { page = 1, limit = 10, tags, search } = params;
    return await api.get("/blogs", { params: { page, limit, tags, search } });
  },

  // Get single blog by ID
  getBlog: async (id) => {
    return await api.get(`/blogs/${id}`);
  },

  // Get user's blogs (for dashboard)
  getMyBlogs: async (params = {}) => {
    const { page = 1, limit = 10, status } = params;
    return await api.get("/blogs/my-blogs", {
      params: { page, limit, status },
    });
  },

  // Create new blog
  createBlog: async (blogData) => {
    return await api.post("/blogs", blogData);
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    return await api.put(`/blogs/${id}`, blogData);
  },

  // Delete blog
  deleteBlog: async (id) => {
    return await api.delete(`/blogs/${id}`);
  },

  // Toggle publish status
  togglePublish: async (id) => {
    return await api.patch(`/blogs/${id}/publish`);
  },

  // Like/Unlike blog
  toggleLike: async (id) => {
    return await api.post(`/blogs/${id}/like`);
  },

  // Get blog statistics
  getBlogStats: async () => {
    return await api.get("/blogs/stats");
  },

  // Search blogs with advanced filters
  searchBlogs: async (params = {}) => {
    const { q, tags, author, sortBy = "recent", page = 1, limit = 10 } = params;
    return await api.get("/blogs/search", {
      params: { q, tags, author, sortBy, page, limit },
    });
  },
};

export default blogsAPI;
