import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/common/Layout/Header";
import Home from "./pages/public/Home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardHome from "./pages/dashboard/dashboard/DashboardHome";
import MyBlogs from "./pages/dashboard/MyBlogs/MyBlogs";
import Analytics from "./pages/dashboard/Analytics/Analytics";
import Comments from "./pages/dashboard/Comments/Comments";

function App() {
  return (
    <BrowserRouter>
      {/* Header shows on all pages except dashboard */}
      <Routes>
        <Route path="/dashboard/*" element={null} />
        <Route path="*" element={<Header />} />
      </Routes>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="my-blogs" element={<MyBlogs />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="comments" element={<Comments />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
