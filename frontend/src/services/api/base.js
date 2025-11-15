// frontend/src/services/api/base.js
// THE PROBLEM IS HERE - The 401 interceptor redirects to /login
// This causes a loop when checking auth on the login page!

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.response?.status, error.config?.url);
    
    // ⚠️ CRITICAL FIX: Don't redirect to login if we're already on login/register page
    // or if we're checking auth (/auth/me endpoint)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthEndpoint = error.config?.url?.includes('/auth/me');
      const isOnAuthPage = currentPath === '/login' || currentPath === '/register';
      
      // Only redirect if:
      // 1. NOT already on login/register page
      // 2. NOT an auth check request
      // 3. User is actually trying to access protected content
      if (!isOnAuthPage && !isAuthEndpoint) {
        console.log("🔒 Unauthorized - redirecting to login");
        window.location.href = "/login";
      } else {
        console.log("🔓 Unauthorized but on auth page or checking auth - no redirect");
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;