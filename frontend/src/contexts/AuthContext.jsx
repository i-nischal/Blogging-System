// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { authAPI } from "../services/api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      setError(err.message || "Login failed");
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      setError(err.message || "Registration failed");
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      return { success: true };
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null); // Clear user anyway
      return { success: false, error: err.message };
    }
  };

  const updateUser = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(userData);
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      setError(err.message || "Update failed");
      return { success: false, error: err.message || "Update failed" };
    }
  };

  const becomeWriter = async () => {
    try {
      setError(null);
      const response = await authAPI.becomeWriter();
      if (response.success) {
        setUser(response.data);
        return { success: true, data: response.data };
      }
    } catch (err) {
      setError(err.message || "Failed to become writer");
      return { success: false, error: err.message };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isWriter: user?.role === "writer",
    isReader: user?.role === "reader",
    login,
    register,
    logout,
    updateUser,
    becomeWriter,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
