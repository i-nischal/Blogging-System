import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    { 
      name: 'Total Blogs', 
      value: '12', 
      change: '+2', 
      changeType: 'positive',
      icon: '📝'
    },
    { 
      name: 'Total Views', 
      value: '1,234', 
      change: '+12%', 
      changeType: 'positive',
      icon: '👁️'
    },
    { 
      name: 'Comments', 
      value: '56', 
      change: '+5', 
      changeType: 'positive',
      icon: '💬'
    },
    { 
      name: 'Drafts', 
      value: '3', 
      change: '-1', 
      changeType: 'negative',
      icon: '📄'
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">{stat.icon}</div>
              <div>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </dd>
              </div>
            </div>
            <div className={`mt-2 flex items-center text-sm ${
              stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.changeType === 'positive' ? 
                <TrendingUp className="h-4 w-4 mr-1" /> : 
                <TrendingDown className="h-4 w-4 mr-1" />
              }
              {stat.change} from last month
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;