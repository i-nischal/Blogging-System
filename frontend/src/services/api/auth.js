import apiClient from "./base";

export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Registration failed" };
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Login failed" };
    }
  },

  // Logout user
  logout: async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Logout failed" };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch user data" };
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    try {
      const response = await apiClient.put("/auth/profile", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Profile update failed" };
    }
  },

  // Become writer
  becomeWriter: async () => {
    try {
      const response = await apiClient.post("/auth/become-writer");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to upgrade to writer" };
    }
  },
};
