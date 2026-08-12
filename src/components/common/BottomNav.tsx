import React from 'react';
import { Home, Search, SlidersHorizontal, ArrowLeft } from 'lucide-react';

interface BottomNavProps {
  currentView: 'home' | 'search' | 'details';
  onGoHome: () => void;
  onGoSearch: () => void;
  onOpenFilters: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onGoHome,
  onGoSearch,
  onOpenFilters
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#0B1927]/90 backdrop-blur-md border-t border-[#CCECEE] dark:border-[#1E3A52] py-2 px-4 shadow-lg transition-colors">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* Home Button */}
        <button
          onClick={onGoHome}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-3 rounded-xl transition-all ${
            currentView === 'home'
              ? 'text-[#14967F] dark:text-[#2DD4BF] font-extrabold bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40'
              : 'text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        {/* Search Index Button */}
        <button
          onClick={onGoSearch}
          className={`flex flex-col items-center gap-1 text-xs font-semibold py-1 px-3 rounded-xl transition-all ${
            currentView === 'search'
              ? 'text-[#14967F] dark:text-[#2DD4BF] font-extrabold bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40'
              : 'text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        {/* Filter Drawer Button */}
        <button
          onClick={onOpenFilters}
          className="flex flex-col items-center gap-1 text-xs font-semibold py-1 px-3 rounded-xl text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200 transition-all"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filter</span>
        </button>

        {/* Details Back Button (if viewing details) */}
        {currentView === 'details' && (
          <button
            onClick={onGoSearch}
            className="flex flex-col items-center gap-1 text-xs font-bold py-1 px-3 rounded-xl text-[#14967F] dark:text-[#2DD4BF] bg-[#F1F9FF] dark:bg-[#1A2B3E] transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        )}

      </div>
    </div>
  );
};
