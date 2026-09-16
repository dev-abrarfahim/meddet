import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Activity, HeartPulse, Dumbbell, Apple, Stethoscope } from 'lucide-react';
import { LanguageMode } from '../../../types';

export type NavTabId = 'overview' | 'body-scan' | 'suggestion' | 'diet' | 'advice';

interface NavTabItem {
  id: NavTabId;
  label: string;
  labelBn: string;
  icon: React.ElementType;
  desc: string;
}

const TABS: NavTabItem[] = [
  { id: 'overview', label: 'Overview', labelBn: 'সারসংক্ষেপ', icon: Activity, desc: 'Calculator & Gauge' },
  { id: 'body-scan', label: 'Body Scan', labelBn: 'বডি স্ক্যান', icon: HeartPulse, desc: 'Morphology' },
  { id: 'suggestion', label: 'Suggestion', labelBn: 'পরামর্শ', icon: Dumbbell, desc: 'Exercise & Habits' },
  { id: 'diet', label: 'Diet', labelBn: 'ডায়েট', icon: Apple, desc: 'Clinical Nutrition' },
  { id: 'advice', label: 'Advice', labelBn: 'চিকিৎসা উপদেশ', icon: Stethoscope, desc: 'Physician Guidance' }
];

interface NavPillsProps {
  activeTab: NavTabId;
  onTabChange: (id: NavTabId) => void;
  lang?: LanguageMode;
}

export const NavPills: React.FC<NavPillsProps> = ({ activeTab, onTabChange, lang = 'en' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -140, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 140, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Clinical Navigation"
      className="bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-xl p-1 shadow-xs transition-colors flex items-center gap-1 select-none"
    >
      {/* Left Chevron Arrow Button < */}
      <button
        onClick={handleScrollLeft}
        id="toc-scroll-left-btn"
        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:border-[#14967F] shrink-0 cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Scrollable Tabs */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth flex-1 px-0.5"
      >
        {TABS.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-pill-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black whitespace-nowrap transition-all border cursor-pointer ${
                isActive
                  ? 'bg-[#095D7E] dark:bg-[#14967F] text-white border-[#095D7E] dark:border-[#14967F] shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-[#14967F]'
              }`}
            >
              <IconComp className="w-3 h-3" />
              <span>{lang === 'bn' ? tab.labelBn : tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Chevron Arrow Button > */}
      <button
        onClick={handleScrollRight}
        id="toc-scroll-right-btn"
        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:border-[#14967F] shrink-0 cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </nav>
  );
};
