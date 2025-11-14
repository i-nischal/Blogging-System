import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Home,
  FileText,
  BarChart3,
  MessageSquare,
  X,
  User,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
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

  const handleLogout = () => {
    console.log("Logging out...");
    setIsProfileDropdownOpen(false);
  };

  const handleProfile = () => {
    console.log("Navigating to profile...");
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
  fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 
  transform transition-all duration-300 ease-in-out 
  flex flex-col
  lg:static lg:inset-0 lg:translate-x-0
  ${isOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"}
  ${collapsed ? "lg:w-20" : "lg:w-64"}
  h-screen // Add this
  overflow-hidden // Add this to prevent sidebar scrolling
`}
      >
        {/* Header - Fixed logo size */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center w-full" : "space-x-3"
            }`}
          >
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
              <Link to="/">
                <span className="text-white font-bold text-lg">J</span>
              </Link>
            </div>

            {!collapsed && (
              <span className="font-semibold text-gray-900 whitespace-nowrap">
                JennieBlog
              </span>
            )}
          </div>

          {/* Desktop Toggle & Mobile Close */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleCollapse}
              className="hidden lg:block p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => window.innerWidth < 1024 && onClose()}
                className={({ isActive }) =>
                  `flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-green-50 text-green-700 border-r-2 border-green-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${collapsed ? "justify-center" : ""}`
                }
                title={collapsed ? item.name : ""}
              >
                <item.icon className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
                {!collapsed && item.name}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Bottom Section - Profile with Fixed Dropdown */}
        <div className="p-3 border-t border-gray-200">
          <div className="relative" ref={dropdownRef}>
            {/* Profile Avatar Button */}
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className={`flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-white" />
              </div>

              {!collapsed && (
                <div className="ml-3 flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-gray-500 truncate">View Profile</p>
                </div>
              )}
            </button>

            {/* Dropdown Menu - Fixed positioning */}
            {isProfileDropdownOpen && (
              <div
                className={`
                absolute bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 w-48
                ${
                  collapsed
                    ? "left-full ml-2 -top-28" // Moved higher (-top-28)
                    : "left-3 right-3 -top-40" // Moved higher for expanded too
                }
              `}
              >
                {/* Profile Option */}
                <button
                  onClick={handleProfile}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User className="h-4 w-4 mr-3 text-gray-500" />
                  Your Profile
                </button>

                {/* Settings Option */}
                <NavLink
                  to="/dashboard/settings"
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    window.innerWidth < 1024 && onClose();
                  }}
                  className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4 mr-3 text-gray-500" />
                  Settings
                </NavLink>

                {/* Divider */}
                <div className="border-t border-gray-100 my-1"></div>

                {/* Logout Option */}
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
