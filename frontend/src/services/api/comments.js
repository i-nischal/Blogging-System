import api from "./base";

// Comments API
export const commentsAPI = {
  // Create a new comment
  createComment: async (blogId, content) => {
    return await api.post(`/comments/blog/${blogId}`, { content });
  },

  // Get all comments for a blog
  getBlogComments: async (blogId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    return await api.get(`/comments/blog/${blogId}`, {
      params: { page, limit },
    });
  },

  // Get single comment
  getComment: async (id) => {
    return await api.get(`/comments/${id}`);
  },

  // Update comment
  updateComment: async (id, content) => {
    return await api.put(`/comments/${id}`, { content });
  },

  // Delete comment
  deleteComment: async (id) => {
    return await api.delete(`/comments/${id}`);
  },

  // Get user's comments
  getMyComments: async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    return await api.get("/comments/my-comments", { params: { page, limit } });
  },
};

// Likes API
export const likesAPI = {
  // Toggle like/unlike a blog
  toggleLike: async (blogId) => {
    return await api.post(`/likes/blog/${blogId}`);
  },

  // Check if user liked a blog
  getLikeStatus: async (blogId) => {
    return await api.get(`/likes/blog/${blogId}/status`);
  },

  // Get user's liked blogs
  getMyLikes: async (params = {}) => {
    const { page = 1, limit = 10 } = params;
    return await api.get("/likes/my-likes", { params: { page, limit } });
  },

  // Get like count for a blog
  getLikeCount: async (blogId) => {
    return await api.get(`/likes/blog/${blogId}/count`);
  },

  // Get users who liked a blog
  getLikedUsers: async (blogId, params = {}) => {
    const { page = 1, limit = 10 } = params;
    return await api.get(`/likes/blog/${blogId}/users`, {
      params: { page, limit },
    });
  },
};

export default { commentsAPI, likesAPI };
