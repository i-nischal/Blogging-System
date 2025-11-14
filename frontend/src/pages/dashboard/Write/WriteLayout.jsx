import React from "react";
import { Outlet } from "react-router-dom";

const WriteLayout = () => {
  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default WriteLayout;
