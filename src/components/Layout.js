import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Background gradient effects */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] right-0 bottom-0 bg-gradient-radial from-blue-800/20 to-transparent"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-radial from-purple-800/20 to-transparent"></div>
        
        <div className="absolute top-[10%] right-[20%] w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[30%] left-[10%] w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 w-full p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                QuizMaster
              </span>
            </div>
            
            {/* Dynamic header content based on route */}
            <div className="hidden md:flex items-center space-x-1">
              <div className="px-3 py-1 text-sm bg-white/10 backdrop-blur-md rounded-full text-blue-200">
                {location.pathname === '/' && 'Welcome'}
                {location.pathname === '/quiz' && 'Quiz in Progress'}
                {location.pathname === '/results' && 'Quiz Results'}
              </div>
            </div>
          </motion.div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 w-full p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="border-t border-white/10 pt-4 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} QuizMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;