import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/common/Layout/Sidebar";
import DashboardHeader from "../../components/common/Layout/DashboardHeader";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Fixed position */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content - Independent scrolling */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Dashboard Header - Fixed */}
        <div className="shrink-0">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>

        {/* Page Content - Scrollable area only */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
