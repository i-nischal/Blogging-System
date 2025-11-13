import React from "react";
import { Menu, Bell, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const DashboardHeader = ({ onMenuClick }) => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/dashboard":
        return "Dashboard Overview";
      case "/dashboard/my-blogs":
        return "My Blogs";
      case "/dashboard/analytics":
        return "Analytics";
      case "/dashboard/comments":
        return "Comments";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="ml-2 text-lg font-semibold text-gray-800 lg:ml-0">
            {getPageTitle()}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 relative">
            <Bell className="h-6 w-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden md:inline">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
