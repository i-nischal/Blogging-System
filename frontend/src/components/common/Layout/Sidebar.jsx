// frontend/src/components/common/Layout/Sidebar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart3,
  MessageSquare,
  X,
  User,
  LogOut,
  Settings,
  ChevronDown,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Blogs", href: "/dashboard/my-blogs", icon: FileText },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Comments", href: "/dashboard/comments", icon: MessageSquare },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const handleNavClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleProfile = () => {
    console.log("Navigating to profile...");
    setIsProfileDropdownOpen(false);
    handleNavClick();
  };

  return (
    <>
      {/* Mobile Overlay - Only shows when sidebar is open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 shrink-0">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={handleNavClick}
          >
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg">
              JennieBlog
            </span>
          </Link>

          {/* Close button - Only visible on mobile */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                end={item.href === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User Profile Section - Fixed at bottom */}
        <div className="border-t border-gray-200 p-4 shrink-0">
          <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "reader"}
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform shrink-0 ${
                  isProfileDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm">Your Profile</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/dashboard/settings");
                    setIsProfileDropdownOpen(false);
                    handleNavClick();
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Settings</span>
                </button>

                <div className="border-t border-gray-100"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
