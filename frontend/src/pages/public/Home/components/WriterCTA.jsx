import React from 'react';
import { motion } from 'framer-motion';

const WriterCTA = () => {
  return (
    <section className="py-20 bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to share your story with the world?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join our community of passionate writers.
          </p>
          {/* FIXED BUTTON */}
          <motion.button
            className="bg-blue-600 text-white text-lg px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Become a Writer
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WriterCTA;