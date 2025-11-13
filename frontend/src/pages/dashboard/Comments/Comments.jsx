import React from "react";
import { MessageCircle, Heart, Reply, Trash2, Check, X } from "lucide-react";

const Comments = () => {
  const comments = [
    {
      id: 1,
      user: "John Doe",
      avatar: "JD",
      content: "Great article! Very helpful for beginners.",
      blogTitle: "Getting Started with React",
      likes: 5,
      timestamp: "2 hours ago",
      status: "approved",
    },
    {
      id: 2,
      user: "Sarah Smith",
      avatar: "SS",
      content: "Could you provide more examples about hooks?",
      blogTitle: "Advanced JavaScript Patterns",
      likes: 2,
      timestamp: "1 day ago",
      status: "pending",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage and moderate blog comments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">24</div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">18</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">6</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {comment.avatar}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {comment.user}
                        </h4>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                            comment.status
                          )}`}
                        >
                          {comment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {comment.content}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {comment.timestamp}
                        </span>
                        <span className="text-xs text-gray-500">
                          on "{comment.blogTitle}"
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-3">
                        <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                          <Heart className="h-3 w-3 mr-1" />
                          {comment.likes}
                        </button>
                        <button className="flex items-center text-xs text-gray-500 hover:text-gray-700">
                          <Reply className="h-3 w-3 mr-1" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {comment.status === "pending" && (
                      <>
                        <button className="text-green-600 hover:text-green-900 p-1">
                          <Check className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1">
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="text-gray-400 hover:text-red-600 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
