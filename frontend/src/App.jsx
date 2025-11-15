// frontend/src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

// Component to conditionally render Header
function ConditionalHeader() {
  const location = useLocation();
  const hideHeaderPaths = ['/dashboard', '/write', '/login', '/register'];
  
  // Don't show header on these paths or their sub-routes
  const shouldHideHeader = hideHeaderPaths.some(path => 
    location.pathname.startsWith(path)
  );
  
  console.log("📍 Current path:", location.pathname, "Hide header:", shouldHideHeader);
  
  return shouldHideHeader ? null : <Header />;
}

function App() {
  console.log("🚀 App component mounted");
  
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Conditional Header - won't render on auth pages */}
        <ConditionalHeader />

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
            <Route path=":id" element={<Write />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;