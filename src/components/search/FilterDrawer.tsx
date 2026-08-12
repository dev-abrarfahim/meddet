import React from 'react';
import { X, RotateCcw, Filter } from 'lucide-react';
import { FilterOptions } from '../../types';
import { getAllCompanies, getAllDosageForms } from '../../data/dbEngine';

export interface FilterPanelProps {
  filters: FilterOptions;
  onChangeFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onChangeFilters,
  onResetFilters
}) => {
  const companies = getAllCompanies();
  const dosageForms = getAllDosageForms();

  return (
    <div className="space-y-5">
      {/* Sort Order */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-[#095D7E]/70 dark:text-slate-400">
          Sort Results By
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onChangeFilters({ ...filters, sortBy: e.target.value as any })}
          className="w-full bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl p-2.5 text-xs font-semibold text-[#095D7E] dark:text-slate-100 focus:outline-none focus:border-[#14967F]"
        >
          <option value="relevance">Relevance & Match</option>
          <option value="name-asc">Name (A to Z)</option>
          <option value="price-low">Price (Lowest First)</option>
          <option value="price-high">Price (Highest First)</option>
        </select>
      </div>

      {/* Manufacturer / Company Filter */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-[#095D7E]/70 dark:text-slate-400">
          Pharmaceutical Company
        </label>
        <select
          value={filters.manufacturer}
          onChange={(e) => onChangeFilters({ ...filters, manufacturer: e.target.value })}
          className="w-full bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl p-2.5 text-xs font-semibold text-[#095D7E] dark:text-slate-100 focus:outline-none focus:border-[#14967F]"
        >
          <option value="All">All Manufacturers ({companies.length})</option>
          {companies.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name} ({c.brandCount} meds)
            </option>
          ))}
        </select>
      </div>

      {/* Dosage Form Filter */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black uppercase tracking-wider text-[#095D7E]/70 dark:text-slate-400">
          Dosage Form
        </label>
        <select
          value={filters.dosageForm}
          onChange={(e) => onChangeFilters({ ...filters, dosageForm: e.target.value })}
          className="w-full bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl p-2.5 text-xs font-semibold text-[#095D7E] dark:text-slate-100 focus:outline-none focus:border-[#14967F]"
        >
          <option value="All">All Dosage Forms ({dosageForms.length})</option>
          {dosageForms.map((form) => (
            <option key={form} value={form}>
              {form}
            </option>
          ))}
        </select>
      </div>

      {/* Max MRP Price Range Filter */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="uppercase text-[11px] tracking-wider text-[#095D7E]/70 dark:text-slate-400">
            Max MRP Price (৳ BDT)
          </span>
          <span className="text-[#14967F] dark:text-[#2DD4BF] font-black text-xs">
            {filters.maxPrice > 0 ? `৳ ${filters.maxPrice}` : 'Any Price'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="500"
          step="5"
          value={filters.maxPrice}
          onChange={(e) => onChangeFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-[#14967F]"
        />
        <div className="flex justify-between text-[10px] text-[#095D7E]/50 dark:text-slate-400 font-semibold">
          <span>৳0</span>
          <span>৳250</span>
          <span>৳500+</span>
        </div>
      </div>

      <button
        onClick={onResetFilters}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#095D7E]/80 dark:text-slate-300 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Filters</span>
      </button>
    </div>
  );
};

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onChangeFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onChangeFilters,
  onResetFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#152232] text-[#095D7E] dark:text-slate-100 shadow-2xl flex flex-col border-l border-[#CCECEE] dark:border-[#243B53]">
          
          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#095D7E] dark:bg-[#0B1927] text-white flex items-center justify-between border-b border-[#074760] dark:border-[#1E3A52]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#14967F] text-white flex items-center justify-center">
                <Filter className="w-5 h-5 text-[#E2FCD6]" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg leading-none">Filter Medicine Index</h3>
                <p className="text-xs text-[#CCECEE] dark:text-slate-400 mt-1">
                  Refine by Manufacturer, Form, Price & Sort
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Controls */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <FilterPanel
              filters={filters}
              onChangeFilters={onChangeFilters}
              onResetFilters={onResetFilters}
            />
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 bg-[#F1F9FF] dark:bg-[#0B1927] border-t border-[#CCECEE] dark:border-[#243B53] flex items-center justify-between gap-3">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs font-bold text-[#095D7E]/70 dark:text-slate-400 hover:text-[#095D7E] py-2 px-3 rounded-lg border border-transparent hover:border-[#CCECEE] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>

            <button
              onClick={onClose}
              className="bg-[#14967F] hover:bg-[#11806C] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-md transition-colors cursor-pointer"
            >
              Apply & Show Results
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
