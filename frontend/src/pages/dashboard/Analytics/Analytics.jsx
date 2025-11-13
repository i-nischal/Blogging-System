import React from "react";
import { TrendingUp, Users, Eye, Clock, Download } from "lucide-react";

const Analytics = () => {
  const stats = [
    {
      name: "Total Views",
      value: "12,847",
      change: "+12.4%",
      changeType: "positive",
      icon: Eye,
    },
    {
      name: "Unique Visitors",
      value: "8,234",
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
    },
    {
      name: "Avg. Time on Page",
      value: "3m 24s",
      change: "+5.1%",
      changeType: "positive",
      icon: Clock,
    },
    {
      name: "Bounce Rate",
      value: "42%",
      change: "-2.3%",
      changeType: "negative",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-600">
            Track your blog performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div
              className={`px-5 py-3 ${
                stat.changeType === "positive" ? "bg-green-50" : "bg-red-50"
              }`}
            >
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-gray-500"> from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Analytics chart placeholder
        </h3>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">
            Analytics chart will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
