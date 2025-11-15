import api from "./base";

export const dashboardAPI = {
  // Get writer dashboard statistics
  getWriterStats: async () => {
    return await api.get("/dashboard/stats");
  },

  // Get detailed blog analytics
  getBlogAnalytics: async (blogId) => {
    return await api.get(`/dashboard/analytics/${blogId}`);
  },

  // Get monthly stats for charts
  getMonthlyStats: async () => {
    return await api.get("/dashboard/monthly-stats");
  },
};

export default dashboardAPI;
