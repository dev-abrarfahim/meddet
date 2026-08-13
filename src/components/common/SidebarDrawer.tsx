import React from 'react';
import { X, Pill, Building2, SlidersHorizontal, Languages, ShieldCheck, Database } from 'lucide-react';
import { LanguageMode } from '../../types';
import { getAllCompanies } from '../../data/dbEngine';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFilters: () => void;
  lang: LanguageMode;
  onToggleLang: () => void;
  onSelectManufacturer?: (companyName: string) => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onOpenFilters,
  lang,
  onToggleLang,
  onSelectManufacturer
}) => {
  if (!isOpen) return null;

  const topCompanies = getAllCompanies().slice(0, 15);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#152232] text-[#095D7E] dark:text-slate-100 shadow-2xl flex flex-col border-l border-[#CCECEE] dark:border-[#243B53]">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 bg-[#095D7E] dark:bg-[#0B1927] text-white flex items-center justify-between border-b border-[#074760] dark:border-[#1E3A52]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#14967F] text-white flex items-center justify-center">
                <Database className="w-5 h-5 text-[#E2FCD6]" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg leading-none">MedVhai Index</h3>
                <p className="text-xs text-[#CCECEE] dark:text-slate-400 mt-1">
                  Database Directory & Navigation
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

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#095D7E]/60 dark:text-slate-400 uppercase tracking-wider">
                Language & Settings
              </h4>
              
              <button
                onClick={() => {
                  onToggleLang();
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Languages className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                  <div>
                    <span className="text-sm font-bold block">Active Language</span>
                    <span className="text-xs text-[#095D7E]/70 dark:text-slate-400">
                      {lang === 'en' ? 'English (En)' : 'বাংলা (Bangla)'}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black bg-[#14967F] text-white px-2.5 py-1 rounded-lg">
                  {lang === 'en' ? 'EN' : 'BN'}
                </span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenFilters();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] transition-all text-left font-bold text-sm"
              >
                <SlidersHorizontal className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                <span>Open Index Filter Drawer</span>
              </button>
            </div>

            {/* Top Manufacturers List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#095D7E]/60 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <img src="/icons/pharmaceutical.png" alt="Manufacturers" className="w-4 h-4 object-contain shrink-0" loading="lazy" />
                  <span>Top Manufacturers (723 Total)</span>
                </h4>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {topCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectManufacturer) onSelectManufacturer(c.name);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E] border border-transparent hover:border-[#CCECEE] dark:hover:border-[#243B53] text-left transition-colors text-xs font-semibold"
                  >
                    <span className="truncate pr-2">{c.name}</span>
                    <span className="bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0">
                      {c.brandCount} meds
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Database Notice */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-1">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Verified Bangladeshi Drug Index</span>
              </div>
              <p className="text-amber-700 dark:text-amber-400/90 leading-relaxed text-[11px]">
                Contains 30,507 verified brand items, 2,279 generic monographs, and 156 dosage form intake guidelines directly integrated from verified pharmaceutical records.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
