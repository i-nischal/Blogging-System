// frontend/src/pages/public/Home/components/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, BookOpen } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';

const Hero = () => {
  const { isAuthenticated, user } = useAuth();

  const scrollToBlogs = () => {
    const blogsSection = document.getElementById('blogs-section');
    if (blogsSection) {
      blogsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 pt-16">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-6xl md:text-8xl mb-6 block">
            {isAuthenticated ? "👋" : "🚀"}
          </span>
        </motion.div>

        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {isAuthenticated 
            ? `Welcome Back, ${user?.name || 'Reader'}!` 
            : "Your Stories, Your Audience"}
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {isAuthenticated 
            ? "Discover amazing stories from our community of writers" 
            : "A clean space to write, read, and connect with readers who care about your voice."}
        </motion.p>

        <motion.button
          onClick={scrollToBlogs}
          className="bg-green-600 text-white text-lg px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg inline-flex items-center space-x-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <BookOpen className="h-5 w-5" />
          <span>Start Reading</span>
        </motion.button>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <button
            onClick={scrollToBlogs}
            className="text-gray-400 hover:text-gray-600 transition-colors animate-bounce"
          >
            <ArrowDown className="h-8 w-8" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;