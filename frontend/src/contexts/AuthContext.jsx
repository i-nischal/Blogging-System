// First, let's add debugging to understand what's happening
// Add this to your AuthContext.jsx temporarily to see what's causing the loop

// frontend/src/contexts/AuthContext.jsx (with debugging)
import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { authAPI } from "../services/api/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasCheckedAuth = useRef(false); // Track if we've already checked

  useEffect(() => {
    console.log("🔍 AuthProvider mounted, checking auth...");
    
    // Only check auth once on mount
    if (!hasCheckedAuth.current) {
      hasCheckedAuth.current = true;
      checkAuth();
    }
  }, []); // Empty deps - runs only once

  const checkAuth = async () => {
    console.log("⏳ Starting auth check...");
    
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      
      console.log("✅ Auth check response:", response);
      
      if (response.success) {
        setUser(response.data);
        console.log("👤 User authenticated:", response.data);
      } else {
        console.log("❌ Auth check failed - no user");
      }
    } catch (err) {
      console.error("❌ Auth check error:", err);
      setUser(null);
    } finally {
      setLoading(false);
      console.log("✔️ Auth check complete");
    }
  };

  const login = async (credentials) => {
    console.log("🔐 Login attempt...");
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      
      console.log("Login response:", response);
      
      if (response.success) {
        setUser(response.data);
        console.log("✅ Login successful, user set");
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Login failed");
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const register = async (userData) => {
    console.log("📝 Register attempt...");
    try {
      setError(null);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        setUser(response.data);
        console.log("✅ Registration successful");
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("❌ Registration error:", err);
      setError(err.message || "Registration failed");
      return { success: false, error: err.message || "Registration failed" };
    }
  };

  const logout = async () => {
    console.log("🚪 Logout attempt...");
    try {
      await authAPI.logout();
      setUser(null);
      console.log("✅ Logout successful");
      return { success: true };
    } catch (err) {
      console.error("❌ Logout error:", err);
      setUser(null); // Clear user anyway
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
  };

  console.log("📊 Auth state:", { 
    hasUser: !!user, 
    loading, 
    isAuthenticated: !!user 
  });

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