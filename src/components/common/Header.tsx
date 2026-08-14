import React from 'react';
import { Sun, Moon, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenFilters: () => void;
  onOpenSidebar: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onOpenFilters,
  onGoHome
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#095D7E] dark:bg-[#0B1927] border-b border-transparent dark:border-[#1E3A52] text-white shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-12 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Logo & Brand */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
          id="brand-logo-btn"
          aria-label="MedVhai - Home"
          className="flex items-center text-left group focus:outline-none focus:ring-2 focus:ring-[#CCECEE] rounded-lg p-0.5"
        >
          <img
            src="/logo.webp"
            alt="MedVhai Logo"
            className="h-8 sm:h-10 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
          />
        </a>

        {/* Right Navigation Actions */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1.5 sm:gap-2">

          {/* Filter Drawer Trigger */}
          <button
            onClick={onOpenFilters}
            id="header-open-filters-btn"
            title="Filter Index"
            className="sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#074760] dark:bg-[#1E2D3D] border border-[#CCECEE]/30 dark:border-[#2DD4BF]/40 text-xs font-bold text-white hover:bg-[#06384C] transition-colors hidden cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#E2FCD6]" />
            <span>Filter</span>
          </button>

          {/* Animated Dark Mode Toggle Switch */}
          <button
            onClick={onToggleDarkMode}
            id="header-dark-mode-toggle"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
            className="relative flex items-center p-1 w-12 sm:w-14 h-7 sm:h-8 rounded-full bg-[#074760] dark:bg-[#1E2D3D] border border-[#CCECEE]/30 dark:border-[#2DD4BF]/40 transition-colors shadow-inner cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#CCECEE]"
          >
            <span className="sr-only">Toggle theme</span>
            <div className="w-full flex items-center justify-between px-1 text-[10px] pointer-events-none z-0">
              <Sun className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${!isDarkMode ? 'text-amber-300' : 'text-slate-500'}`} />
              <Moon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-colors ${isDarkMode ? 'text-teal-300' : 'text-[#CCECEE]/40'}`} />
            </div>

            <motion.div
              className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                isDarkMode ? 'bg-[#14967F] text-teal-100' : 'bg-[#E2FCD6] text-[#095D7E]'
              }`}
              animate={{
                x: isDarkMode ? 20 : 0
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {isDarkMode ? (
                <Moon className="w-3.5 h-3.5 text-teal-200" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
            </motion.div>
          </button>

        </nav>
      </div>
    </header>
  );
};
