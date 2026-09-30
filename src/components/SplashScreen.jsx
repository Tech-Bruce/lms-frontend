import React from 'react';
import { motion } from 'framer-motion';
import logo from '../assets/log.png';

const SplashScreen = () => {
  return (
    <motion.div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center"
      >
        <motion.img
          layoutId="main-logo"
          src={logo}
          alt="Cyber Security Brigade Logo"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-32 h-32 mb-6 object-cover"
        />
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-3xl font-extrabold text-white tracking-wider"
        >
          Welcome to LMS
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-gray-400 mt-2 font-medium"
        >
          Empowering your learning journey
        </motion.p>

        {/* Loading progress bar */}
        <div className="w-64 h-1.5 bg-gray-700 rounded-full mt-8 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600"
          ></motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
