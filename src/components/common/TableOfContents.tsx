import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Pill, Tag, Layers, Atom, Stethoscope, HeartPulse, ShieldAlert, AlertCircle } from 'lucide-react';

interface TableOfContentsProps {
  activeSection: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ activeSection }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'sec-overview', label: 'Overview', icon: Pill },
    { id: 'sec-price', label: 'Pricing', icon: Tag },
    { id: 'sec-alternatives', label: 'Alternative Brand', icon: Layers },
    { id: 'sec-structure', label: 'Chemical Structure', icon: Atom },
    { id: 'sec-monograph', label: 'Indication', icon: Stethoscope },
    { id: 'sec-safety', label: 'Pregnancy', icon: HeartPulse },
    { id: 'sec-warnings', label: 'Warnings', icon: ShieldAlert },
    { id: 'sec-sideeffects', label: 'Side Effects', icon: AlertCircle }
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      const offset = isMobile ? 110 : 134;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

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
      aria-label="Table of Contents"
      className="sticky top-28 sm:top-32 z-20 bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800/80 rounded-xl p-1 shadow-xs transition-colors flex items-center gap-1"
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
        {sections.map((sec) => {
          const IconComp = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <a
              key={sec.id}
              href={`#${sec.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(sec.id);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-black whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#095D7E] dark:bg-[#14967F] text-white border-[#095D7E] dark:border-[#14967F] shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-[#14967F]'
              }`}
            >
              <IconComp className="w-3 h-3" />
              <span>{sec.label}</span>
            </a>
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
