// frontend/src/pages/public/Home/Home.jsx
import React from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Hero from "./components/Hero";
import BlogList from "../../../components/reader/BlogList";
import WriterCTA from "./components/WriterCTA";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {isAuthenticated ? (
        // Logged in - Show Medium-style feed (no hero, no CTA)
        <main className="pt-16">
          <BlogList />
        </main>
      ) : (
        // Guest - Show landing page
        <main>
          <Hero />
          <BlogList />
          <WriterCTA />
        </main>
      )}
    </div>
  );
};

export default Home;
