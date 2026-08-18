import React from 'react';
import {
  X,
  Info,
  ShieldCheck,
  FileText,
  Mail,
  Building2,
  SlidersHorizontal,
  Languages,
  Code2,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { LanguageMode } from '../../types';
import { getAllCompanies } from '../../data/dbEngine';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFilters: () => void;
  lang: LanguageMode;
  onToggleLang: () => void;
  onSelectManufacturer?: (companyName: string) => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenContact: () => void;
  onOpenApiDocs?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  onOpenFilters,
  lang,
  onToggleLang,
  onSelectManufacturer,
  onOpenAbout,
  onOpenPrivacy,
  onOpenTerms,
  onOpenContact,
  onOpenApiDocs
}) => {
  if (!isOpen) return null;

  const topCompanies = getAllCompanies().slice(0, 16);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel Sliding from LEFT */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-xs sm:max-w-sm bg-white dark:bg-[#152232] text-[#095D7E] dark:text-slate-100 shadow-2xl flex flex-col border-r border-[#CCECEE] dark:border-[#243B53] animate-in slide-in-from-left duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-[#095D7E] dark:bg-[#0B1927] text-white flex items-center justify-between border-b border-[#074760] dark:border-[#1E3A52]">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.webp"
                alt="MedVhai Logo"
                className="h-8 w-auto object-contain shrink-0"
              />
            </div>

            <button
              onClick={onClose}
              id="close-sidebar-btn"
              className="p-1.5 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">

            {/* Core Navigation Links */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider px-2 pb-1">
                {lang === 'en' ? 'Platform Information' : 'তথ্য ও দিকনির্দেশনা'}
              </div>

              {/* 1. About Us */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAbout();
                }}
                id="sidebar-about-btn"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] hover:bg-[#E2FCD6]/50 dark:hover:bg-[#1E3A52] border border-[#CCECEE] dark:border-[#243B53] text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Info className="w-4 h-4 text-[#E2FCD6]" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-[#095D7E] dark:text-slate-100 block">
                      {lang === 'en' ? 'About MedVhai' : 'আমাদের সম্পর্কে'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'en' ? 'Clinical mission & database scope' : 'উদ্দেশ্য ও তথ্যের উৎস'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 2. Privacy Policy */}
              <button
                onClick={() => {
                  onClose();
                  onOpenPrivacy();
                }}
                id="sidebar-privacy-btn"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] hover:bg-[#E2FCD6]/50 dark:hover:bg-[#1E3A52] border border-[#CCECEE] dark:border-[#243B53] text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#14967F] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4 text-[#E2FCD6]" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-[#095D7E] dark:text-slate-100 block">
                      {lang === 'en' ? 'Privacy Policy' : 'প্রাইভেসি পলিসি'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'en' ? 'Zero medical data collection' : 'তথ্যের সুরক্ষা ও নিরাপত্তা'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 3. Terms and Conditions */}
              <button
                onClick={() => {
                  onClose();
                  onOpenTerms();
                }}
                id="sidebar-terms-btn"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] hover:bg-[#E2FCD6]/50 dark:hover:bg-[#1E3A52] border border-[#CCECEE] dark:border-[#243B53] text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-600 dark:bg-amber-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4 text-amber-100" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-[#095D7E] dark:text-slate-100 block">
                      {lang === 'en' ? 'Terms & Conditions' : 'ব্যবহারের শর্তাবলী'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'en' ? 'Clinical reference disclaimer' : 'মেডিকেল ব্যবহারের নিয়ম'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 4. Contact Us */}
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                id="sidebar-contact-btn"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] hover:bg-[#E2FCD6]/50 dark:hover:bg-[#1E3A52] border border-[#CCECEE] dark:border-[#243B53] text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 dark:bg-teal-700 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-4 h-4 text-[#E2FCD6]" />
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-[#095D7E] dark:text-slate-100 block">
                      {lang === 'en' ? 'Contact Us' : 'যোগাযোগ'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lang === 'en' ? 'Support & medicine corrections' : 'সাপোর্ট ও তথ্য সংশোধন'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* 5. Developer REST API */}
              {onOpenApiDocs && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenApiDocs();
                  }}
                  id="sidebar-api-docs-btn"
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] hover:bg-[#E2FCD6]/50 dark:hover:bg-[#1E3A52] border border-[#CCECEE] dark:border-[#243B53] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Code2 className="w-4 h-4 text-[#E2FCD6]" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-[#095D7E] dark:text-slate-100 block">
                        {lang === 'en' ? 'Developer REST API' : 'ডেভেলপার এপিআই'}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {lang === 'en' ? 'Free medicine endpoints' : 'এপিআই ডকুমেন্টেশন'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            {/* Quick Actions (Language & Filter Drawer) */}
            <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider px-2">
                {lang === 'en' ? 'Preferences' : 'পছন্দসমূহ'}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onToggleLang}
                  id="sidebar-lang-toggle"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-black text-[#095D7E] dark:text-[#2DD4BF] hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Languages className="w-4 h-4" />
                  <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onOpenFilters();
                  }}
                  id="sidebar-filter-toggle"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-black text-[#095D7E] dark:text-[#2DD4BF] hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{lang === 'en' ? 'Filters' : 'ফিল্টার'}</span>
                </button>
              </div>
            </div>

            {/* Top Pharmaceutical Companies List */}
            <div className="space-y-2 pt-1 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between px-2">
                <h4 className="text-[11px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#14967F]" />
                  <span>{lang === 'en' ? 'Top Pharma Companies' : 'শীর্ষ ফার্মাসিউটিক্যাল কোম্পানি'}</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400">723 Total</span>
              </div>

              <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                {topCompanies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      if (onSelectManufacturer) onSelectManufacturer(c.name);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E] border border-transparent hover:border-[#CCECEE] dark:hover:border-[#243B53] text-left transition-colors text-xs font-bold group cursor-pointer"
                  >
                    <span className="truncate pr-2 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors">
                      {c.name}
                    </span>
                    <span className="bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 font-mono">
                      {c.brandCount}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-3 bg-slate-50 dark:bg-[#0E1B2A] border-t border-slate-200 dark:border-[#1E3A52] text-center text-[11px] font-bold text-slate-400 dark:text-slate-500">
            MedVhai™ Clinical Drug Index • 2026
          </div>

        </div>
      </div>
    </div>
  );
};
