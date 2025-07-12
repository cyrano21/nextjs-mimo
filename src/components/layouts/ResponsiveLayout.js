'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ResponsiveLayout({ 
  children, 
  sidebar, 
  header, 
  theme = 'light',
  className = '' 
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className={`
      min-h-screen flex flex-col
      ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
      ${className}
    `}>
      {/* Header */}
      {header && (
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`
            sticky top-0 z-40 w-full border-b backdrop-blur-sm
            ${theme === 'dark' 
              ? 'bg-gray-900/95 border-gray-800' 
              : 'bg-white/95 border-gray-200'
            }
          `}
        >
          <div className="flex items-center justify-between px-4 py-3 md:px-6">
            {/* Mobile menu button */}
            {sidebar && isMobile && (
              <button
                onClick={toggleSidebar}
                className={`
                  p-2 rounded-lg transition-colors
                  ${theme === 'dark' 
                    ? 'hover:bg-gray-800 text-gray-300' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }
                `}
                aria-label="Ouvrir le menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            {header}
          </div>
        </motion.header>
      )}
      
      {/* Main content area */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        {sidebar && (
          <>
            {/* Desktop sidebar */}
            <motion.aside 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`
                hidden md:flex md:flex-col md:w-64 lg:w-72
                ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
                border-r
              `}
            >
              <div className="flex-1 overflow-y-auto p-4">
                {sidebar}
              </div>
            </motion.aside>
            
            {/* Mobile sidebar overlay */}
            <AnimatePresence>
              {isMobile && sidebarOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
                  />
                  
                  {/* Mobile sidebar */}
                  <motion.aside
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '-100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className={`
                      fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw]
                      ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
                      shadow-xl md:hidden
                    `}
                  >
                    {/* Mobile sidebar header */}
                    <div className={`
                      flex items-center justify-between p-4 border-b
                      ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                    `}>
                      <h2 className="text-lg font-semibold">Menu</h2>
                      <button
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          p-2 rounded-lg transition-colors
                          ${theme === 'dark' 
                            ? 'hover:bg-gray-700 text-gray-300' 
                            : 'hover:bg-gray-100 text-gray-600'
                          }
                        `}
                        aria-label="Fermer le menu"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Mobile sidebar content */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {sidebar}
                    </div>
                  </motion.aside>
                </>
              )}
            </AnimatePresence>
          </>
        )}
        
        {/* Main content */}
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-hidden"
        >
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
}

