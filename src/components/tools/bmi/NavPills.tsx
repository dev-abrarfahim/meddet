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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -120 : 120;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full bg-[#F1F9FF] dark:bg-[#152232] select-none transition-colors" aria-label="Clinical Navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Tab Bar */}
        <div className="hidden md:flex items-center justify-between py-2.5">
          <div className="flex items-center gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-pill-desktop-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold tracking-wide transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#14967F] dark:bg-[#2DD4BF] text-white dark:text-slate-950 border-[#14967F] dark:border-[#2DD4BF] shadow-sm'
                      : 'bg-white dark:bg-[#1A2B3E] text-[#475569] dark:text-slate-200 border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]/50 dark:hover:border-[#2DD4BF]/50 hover:text-[#095D7E] dark:hover:text-[#2DD4BF] hover:bg-white/80 dark:hover:bg-[#1E3A52]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white dark:text-slate-950' : 'text-[#14967F] dark:text-[#2DD4BF]'}`} />
                  <span>{lang === 'bn' ? tab.labelBn : tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-[#64748B] dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#14967F] dark:bg-[#2DD4BF] animate-pulse" />
            <span>
              {lang === 'en' ? 'Interactive Real-time Clinical Engine' : 'রিয়েল-টাইম ক্লিনিক্যাল ইঞ্জিন'}
            </span>
          </div>
        </div>

        {/* Mobile Tab Bar (Scrollable) */}
        <div className="md:hidden flex items-center gap-1.5 py-1.5">
          {/* Left Chevron */}
          <button
            id="btn-scroll-left"
            onClick={() => scroll('left')}
            aria-label="Scroll tabs left"
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded bg-white dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#CCECEE]/30 dark:hover:bg-[#243B53] active:scale-95 transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Tabs list */}
          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`tab-pill-${tab.id}`}
                  onClick={() => onTabChange(tab.id)}
                  className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all border ${
                    isActive
                      ? 'bg-[#14967F] dark:bg-[#2DD4BF] text-white dark:text-slate-950 border-[#14967F] dark:border-[#2DD4BF] shadow-xs'
                      : 'bg-white dark:bg-[#1A2B3E] text-[#475569] dark:text-slate-200 border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]/50 dark:hover:border-[#2DD4BF]/50 hover:text-[#095D7E] dark:hover:text-[#2DD4BF]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white dark:text-slate-950' : 'text-[#14967F] dark:text-[#2DD4BF]'}`} />
                  <span>{lang === 'bn' ? tab.labelBn : tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Chevron */}
          <button
            id="btn-scroll-right"
            onClick={() => scroll('right')}
            aria-label="Scroll tabs right"
            className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded bg-white dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#CCECEE]/30 dark:hover:bg-[#243B53] active:scale-95 transition-all shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
