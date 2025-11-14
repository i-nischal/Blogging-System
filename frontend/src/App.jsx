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
import Write from "./pages/dashboard/Write/Write";
import WriteLayout from "./pages/dashboard/Write/WriteLayout";

function App() {
  return (
    <BrowserRouter>
      {/* Header shows on all pages except dashboard and write */}
      <Routes>
        <Route path="/dashboard/*" element={null} />
        <Route path="/write/*" element={null} />
        <Route path="*" element={<Header />} />
      </Routes>

      {/* Main Routes */}
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

        {/* Write Routes - Separate layout */}
        <Route path="/write" element={<WriteLayout />}>
          <Route index element={<Write />} />
          <Route path=":id" element={<Write />} />{" "}
          {/* For editing existing blogs */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
