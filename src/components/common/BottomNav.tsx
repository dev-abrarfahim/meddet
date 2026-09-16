import React from 'react';
import { Home, Search, SlidersHorizontal, Calculator } from 'lucide-react';
import { LanguageMode } from '../../types';

interface BottomNavProps {
  currentView: 'home' | 'search' | 'details' | 'tools';
  onGoHome: () => void;
  onGoSearch: () => void;
  onGoTools: () => void;
  onOpenFilters: () => void;
  lang?: LanguageMode;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onGoHome,
  onGoSearch,
  onGoTools,
  onOpenFilters,
  lang = 'en'
}) => {
  return (
    <nav aria-label="Bottom Navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0B1927]/90 backdrop-blur-md border-t border-[#CCECEE] dark:border-[#1E3A52] py-2 px-2 shadow-lg transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* Home Button */}
        <button
          onClick={onGoHome}
          id="bottom-nav-home-btn"
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-2.5 sm:px-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'home'
              ? 'text-[#14967F] dark:text-[#2DD4BF] font-extrabold bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40'
              : 'text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{lang === 'en' ? 'Home' : 'হোম'}</span>
        </button>

        {/* Search Index Button */}
        <button
          onClick={onGoSearch}
          id="bottom-nav-search-btn"
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-2.5 sm:px-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'search'
              ? 'text-[#14967F] dark:text-[#2DD4BF] font-extrabold bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40'
              : 'text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>{lang === 'en' ? 'Search' : 'অনুসন্ধান'}</span>
        </button>

        {/* Tools Button */}
        <button
          onClick={onGoTools}
          id="bottom-nav-tools-btn"
          className={`relative flex flex-col items-center gap-1 text-xs font-semibold py-1 px-2.5 sm:px-3 rounded-xl transition-all cursor-pointer ${
            currentView === 'tools'
              ? 'text-[#14967F] dark:text-[#2DD4BF] font-extrabold bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40'
              : 'text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
          }`}
        >
          {/* Subtle New Dot */}
          <span className="absolute top-1 right-2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14967F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14967F] dark:bg-[#2DD4BF]"></span>
          </span>
          <Calculator className="w-5 h-5" />
          <span>{lang === 'en' ? 'Tools' : 'টুলস'}</span>
        </button>

        {/* Filter Drawer Button */}
        <button
          onClick={onOpenFilters}
          id="bottom-nav-filter-btn"
          className="flex flex-col items-center gap-1 text-xs font-semibold py-1 px-2.5 sm:px-3 rounded-xl text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200 transition-all cursor-pointer"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>{lang === 'en' ? 'Filter' : 'ফিল্টার'}</span>
        </button>

      </div>
    </nav>
  );
};
