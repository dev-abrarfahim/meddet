import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Medicine } from '../../types';
import { searchMedicines } from '../../data/dbEngine';

interface SearchBarProps {
  query: string;
  onChangeQuery: (q: string) => void;
  onSelectMedicine: (med: Medicine) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChangeQuery,
  onSelectMedicine,
  onOpenFilterDrawer,
  activeFilterCount,
  inputRef
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close suggestions popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update live instant suggestions
  useEffect(() => {
    if (query.trim().length >= 2) {
      const res = searchMedicines(query, 'All', {}, 1, 6);
      setSuggestions(res.items);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] shadow-inner focus-within:border-[#14967F] dark:focus-within:border-[#2DD4BF] transition-all">
          <div className="pl-3.5 text-[#14967F] dark:text-[#2DD4BF]">
            <Search className="w-5 h-5" />
          </div>

          <input
            ref={inputRef as any}
            type="text"
            value={query}
            onChange={(e) => onChangeQuery(e.target.value)}
            onFocus={() => {
              if (query.trim().length >= 2) setIsOpen(true);
            }}
            placeholder="Search 30,500+ medicines (e.g. Napa, Seclo, Paracetamol)..."
            className="w-full text-sm sm:text-base font-bold text-[#095D7E] dark:text-slate-100 placeholder-[#095D7E]/50 dark:placeholder-slate-400 bg-transparent focus:outline-none py-2.5 sm:py-3 px-2"
          />

          {query && (
            <button
              onClick={() => onChangeQuery('')}
              className="pr-3 text-[#095D7E]/40 hover:text-[#095D7E] dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Trigger Button */}
        <button
          onClick={onOpenFilterDrawer}
          className="relative flex items-center justify-center p-2.5 bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] text-[#095D7E] dark:text-slate-200 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          title="Filter Results"
        >
          <SlidersHorizontal className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#14967F] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#095D7E]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Live Suggestions Dropdown Popover */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#152232] rounded-2xl shadow-2xl border border-[#CCECEE] dark:border-[#243B53] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2 border-b border-[#F1F9FF] dark:border-[#243B53] flex items-center justify-between text-xs font-bold text-[#095D7E]/60 dark:text-slate-400 px-3">
            <span>Instant Search Matches ({suggestions.length})</span>
            <span className="text-[10px]">Press Enter to view all</span>
          </div>

          <div className="divide-y divide-[#F1F9FF] dark:divide-[#243B53] max-h-80 overflow-y-auto">
            {suggestions.map((med) => (
              <button
                key={med.id}
                onClick={() => {
                  onSelectMedicine(med);
                  setIsOpen(false);
                }}
                className="w-full p-3 hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E] text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-[#095D7E] dark:text-slate-100">
                      {med.name}
                    </span>
                    <span className="text-[10px] font-bold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-1.5 py-0.5 rounded">
                      {med.strength} {med.form}
                    </span>
                  </div>
                  <div className="text-xs text-[#095D7E]/70 dark:text-slate-400">
                    {med.genericName} • <span className="font-semibold">{med.company}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">MRP</div>
                  <div className="text-sm font-black text-[#14967F] dark:text-[#2DD4BF]">৳{med.mrp.toFixed(2)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
