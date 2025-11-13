import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          🚀 Your Stories, Your Audience
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          A clean space to write, read, and connect<br />
          with readers who care about your voice.
        </motion.p>

        {/* FIXED BUTTON */}
        <motion.button
          className="bg-green-600 text-white text-lg px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Reading
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;