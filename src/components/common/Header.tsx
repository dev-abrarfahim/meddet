import React from 'react';
import { Stethoscope, ShieldCheck, Sun, Moon, Languages, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageMode } from '../../types';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  lang: LanguageMode;
  onToggleLang: () => void;
  onOpenFilters: () => void;
  onOpenSidebar: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isDarkMode,
  onToggleDarkMode,
  lang,
  onToggleLang,
  onOpenFilters,
  onOpenSidebar,
  onGoHome
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#095D7E] dark:bg-[#0B1927] border-b border-transparent dark:border-[#1E3A52] text-white shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Logo & Brand */}
        <button
          onClick={onGoHome}
          id="brand-logo-btn"
          className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-[#CCECEE] rounded-lg p-1"
        >
          <div className="w-10 h-10 rounded-xl bg-[#14967F] dark:bg-[#14967F] text-white flex items-center justify-center shadow-inner group-hover:bg-[#11806C] transition-colors shrink-0">
            <Stethoscope className="w-6 h-6 text-[#E2FCD6]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">MedVhai</span>
              <span className="bg-[#14967F] text-[#E2FCD6] dark:bg-[#14967F]/40 dark:text-[#2DD4BF] dark:border dark:border-[#2DD4BF]/40 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded tracking-wider">
                Database
              </span>
            </div>
            <p className="text-[11px] text-[#CCECEE] dark:text-slate-400 hidden sm:block">
              Bangladeshi Drug Index & Clinical Monograph Explorer
            </p>
          </div>
        </button>

        {/* Header Tagline Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[#CCECEE] dark:text-slate-300 bg-[#074760]/60 dark:bg-[#152232] px-3.5 py-1.5 rounded-full border border-[#CCECEE]/20 dark:border-[#243B53]">
          <ShieldCheck className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF]" />
          <span>Official Drug Index & Monograph Explorer</span>
        </div>

        {/* Right Navigation Actions */}
        <div className="flex items-center gap-2">

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
            className="relative flex items-center p-1 w-14 h-8 rounded-full bg-[#074760] dark:bg-[#1E2D3D] border border-[#CCECEE]/30 dark:border-[#2DD4BF]/40 transition-colors shadow-inner cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-[#CCECEE]"
          >
            <span className="sr-only">Toggle theme</span>
            <div className="w-full flex items-center justify-between px-1 text-[11px] pointer-events-none z-0">
              <Sun className={`w-3.5 h-3.5 transition-colors ${!isDarkMode ? 'text-amber-300' : 'text-slate-500'}`} />
              <Moon className={`w-3.5 h-3.5 transition-colors ${isDarkMode ? 'text-teal-300' : 'text-[#CCECEE]/40'}`} />
            </div>

            <motion.div
              className={`absolute top-1 left-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                isDarkMode ? 'bg-[#14967F] text-teal-100' : 'bg-[#E2FCD6] text-[#095D7E]'
              }`}
              animate={{
                x: isDarkMode ? 24 : 0,
                rotate: isDarkMode ? 360 : 0
              }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 25
              }}
            >
              {isDarkMode ? (
                <Moon className="w-3.5 h-3.5 fill-teal-200 text-teal-100" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              )}
            </motion.div>
          </button>

        </div>
      </div>
    </header>
  );
};
