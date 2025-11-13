import React from "react";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, MessageCircle, FileText } from "lucide-react";
import DashboardStats from "../../../components/writer/DashboardStats";

const DashboardHome = () => {
  const quickActions = [
    {
      icon: Plus,
      label: "Write New Blog",
      description: "Create a new blog post",
      href: "/dashboard/my-blogs?new=true",
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      label: "View Analytics",
      description: "Check your blog performance",
      href: "/dashboard/analytics",
      color: "bg-blue-500",
    },
    {
      icon: MessageCircle,
      label: "Manage Comments",
      description: "Review and respond to comments",
      href: "/dashboard/comments",
      color: "bg-purple-500",
    },
    {
      icon: FileText,
      label: "My Blogs",
      description: "Manage your blog posts",
      href: "/dashboard/my-blogs",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="mt-1 text-sm text-gray-600">
          Here's what's happening with your blogs today.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div
              className={`${action.color} h-12 w-12 rounded-lg flex items-center justify-center mb-3`}
            >
              <action.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">{action.label}</h3>
            <p className="text-sm text-gray-600 mt-1">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Drafts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">No recent activity</p>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Recent Drafts
          </h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">No draft posts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
