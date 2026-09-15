import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, X, Clock, Trash2, Dna, ChevronRight } from 'lucide-react';
import { Medicine, GenericSearchResult } from '../../types';
import { searchMedicines, searchGenerics } from '../../data/dbEngine';
import { getDosageFormIconInfo } from '../../utils/dosageFormHelper';
import { getMedicineCanonicalPath, getGenericCanonicalPath } from '../../utils/urlHelper';

interface SearchBarProps {
  query: string;
  onChangeQuery: (q: string) => void;
  onSelectMedicine: (med: Medicine) => void;
  onSelectGeneric?: (generic: { id: number; name: string }) => void;
  onOpenFilterDrawer: () => void;
  activeFilterCount: number;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onChangeQuery,
  onSelectMedicine,
  onSelectGeneric,
  onOpenFilterDrawer,
  activeFilterCount,
  inputRef
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Medicine[]>([]);
  const [genericSuggestions, setGenericSuggestions] = useState<GenericSearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // 5 Recent Searches State saved in localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meddet_recent_searches') || localStorage.getItem('medvhai_recent_searches');
      return saved ? JSON.parse(saved) : ['Napa', 'Paracetamol', 'Seclo', 'Maxpro', 'Ceevit'];
    } catch {
      return ['Napa', 'Paracetamol', 'Seclo', 'Maxpro', 'Ceevit'];
    }
  });

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('meddet_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const removeRecentSearch = (term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item.toLowerCase() !== term.toLowerCase());
      try {
        localStorage.setItem('meddet_recent_searches', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearAllRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    try {
      localStorage.removeItem('meddet_recent_searches'); localStorage.removeItem('medvhai_recent_searches');
    } catch {}
  };

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
      const timer = setTimeout(() => {
        const res = searchMedicines(query, 'All', {}, 1, 6);
        const genRes = searchGenerics(query, 3);
        setSuggestions(res.items);
        setGenericSuggestions(genRes);
        setIsOpen(true);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setGenericSuggestions([]);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim().length >= 2) {
      saveRecentSearch(query);
      setIsOpen(false);
    }
  };

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
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
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
          className="relative flex items-center justify-center p-2.5 sm:p-3 bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] text-[#095D7E] dark:text-slate-200 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
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

      {/* Popover Dropdown (Instant Matches OR 5 Recent Searches) */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#152232] rounded-2xl shadow-2xl border border-[#CCECEE] dark:border-[#243B53] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          
          {/* SCENARIO 1: INSTANT SEARCH MATCHES (When typing >= 2 chars) */}
          {query.trim().length >= 2 && (genericSuggestions.length > 0 || suggestions.length > 0) ? (
            <div className="max-h-96 overflow-y-auto divide-y divide-[#F1F9FF] dark:divide-[#243B53]">
              
              {/* CATEGORY A: GENERICS (CLINICAL MONOGRAPHS) */}
              {genericSuggestions.length > 0 && (
                <div>
                  <div className="p-2 border-b border-emerald-100 dark:border-emerald-950/80 flex items-center justify-between text-xs font-black text-emerald-800 dark:text-emerald-300 px-3.5 bg-emerald-50/80 dark:bg-emerald-950/40">
                    <div className="flex items-center gap-1.5">
                      <Dna className="w-3.5 h-3.5 text-[#14967F] dark:text-[#2DD4BF]" />
                      <span>Generics ({genericSuggestions.length})</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Clinical Monograph</span>
                  </div>

                  <div className="divide-y divide-emerald-50 dark:divide-slate-800/60">
                    {genericSuggestions.map((gen) => (
                      <a
                        key={`gen-${gen.id}`}
                        href={getGenericCanonicalPath(gen)}
                        onClick={(e) => {
                          e.preventDefault();
                          saveRecentSearch(gen.name);
                          if (onSelectGeneric) {
                            onSelectGeneric(gen);
                          } else {
                            window.location.href = getGenericCanonicalPath(gen);
                          }
                          setIsOpen(false);
                        }}
                        className="w-full p-3 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm sm:text-base text-emerald-900 dark:text-emerald-300 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors">
                              {gen.name}
                            </span>
                            {gen.nameBn && (
                              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                                ({gen.nameBn})
                              </span>
                            )}
                            <span className="text-[10px] font-black text-white bg-[#14967F] dark:bg-[#0D6F5D] px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Generic
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                              {gen.brandCount} {gen.brandCount === 1 ? 'Brand' : 'Available Brands'}
                            </span>
                            {gen.dosageForms.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="text-slate-400 dark:text-slate-500">
                                  {gen.dosageForms.slice(0, 3).join(', ')}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1 text-xs font-black text-[#14967F] dark:text-[#2DD4BF] group-hover:translate-x-0.5 transition-transform">
                          <span className="hidden sm:inline">View Generic</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* CATEGORY B: BRAND MEDICINES */}
              {suggestions.length > 0 && (
                <div>
                  <div className="p-2 border-b border-[#F1F9FF] dark:border-[#243B53] flex items-center justify-between text-xs font-extrabold text-[#095D7E]/70 dark:text-slate-300 px-3.5 bg-slate-50/70 dark:bg-[#111C2B]/80">
                    <span>Brand Medicines ({suggestions.length})</span>
                    <span className="text-[10px] font-medium text-slate-400">Press Enter to save search</span>
                  </div>

                  <div className="divide-y divide-[#F1F9FF] dark:divide-[#243B53]">
                    {suggestions.map((med) => (
                      <a
                        key={med.id}
                        href={getMedicineCanonicalPath(med)}
                        onClick={(e) => {
                          e.preventDefault();
                          saveRecentSearch(med.name);
                          onSelectMedicine(med);
                          setIsOpen(false);
                        }}
                        className="w-full p-3 sm:p-3.5 hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E] text-left flex items-center justify-between gap-3 transition-colors cursor-pointer block"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <img src={getDosageFormIconInfo(med.form).iconPath} alt={med.form} className="w-5 h-5 object-contain shrink-0" loading="lazy" />
                            <span className="font-black text-sm sm:text-base text-[#095D7E] dark:text-slate-100">
                              {med.name}
                            </span>
                            <span className="text-xs font-extrabold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-2 py-0.5 rounded font-mono">
                              {med.strength} {med.form}
                            </span>
                          </div>
                          <div className="text-xs text-[#095D7E]/70 dark:text-slate-400 truncate">
                            {med.genericName} • <span className="font-semibold text-slate-700 dark:text-slate-300">{med.company}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">MRP</div>
                          <div className="text-sm sm:text-base font-black text-[#14967F] dark:text-[#2DD4BF] font-mono">৳{med.mrp.toFixed(2)}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : recentSearches.length > 0 ? (
            /* SCENARIO 2: 5 RECENT SEARCHES (When query is empty or focused) */
            <div>
              <div className="p-2.5 border-b border-[#F1F9FF] dark:border-[#243B53] flex items-center justify-between text-xs font-black text-[#095D7E] dark:text-slate-200 px-3.5 bg-slate-50/70 dark:bg-[#111C2B]/80">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#14967F] dark:text-[#2DD4BF]" />
                  <span>Recent Searches (5)</span>
                </div>
                <button
                  onClick={clearAllRecentSearches}
                  className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              </div>

              <div className="divide-y divide-[#F1F9FF] dark:divide-[#243B53]">
                {recentSearches.slice(0, 5).map((term) => (
                  <div
                    key={term}
                    onClick={() => {
                      onChangeQuery(term);
                      saveRecentSearch(term);
                      setIsOpen(false);
                    }}
                    className="w-full px-3.5 py-2.5 sm:py-3 hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E] flex items-center justify-between gap-2 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Clock className="w-4 h-4 text-slate-400 group-hover:text-[#14967F] transition-colors shrink-0" />
                      <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors truncate">
                        {term}
                      </span>
                    </div>

                    <button
                      onClick={(e) => removeRecentSearch(term, e)}
                      title="Remove from recent searches"
                      className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

