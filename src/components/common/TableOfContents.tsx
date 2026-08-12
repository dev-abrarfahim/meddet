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
      const top = el.offsetTop - 140;
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
    <div className="sticky top-28 z-20 bg-white/95 dark:bg-[#152232]/95 backdrop-blur-md border-2 border-[#CCECEE] dark:border-[#243B53] rounded-2xl p-1.5 shadow-md transition-colors flex items-center gap-1">
      
      {/* Left Chevron Arrow Button < */}
      <button
        onClick={handleScrollLeft}
        id="toc-scroll-left-btn"
        className="w-7 h-7 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] flex items-center justify-center text-[#095D7E] dark:text-slate-200 hover:border-[#14967F] shrink-0 cursor-pointer"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Scrollable Tabs */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 px-1"
      >
        {sections.map((sec) => {
          const IconComp = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-[#095D7E] dark:bg-[#14967F] text-white border-[#095D7E] dark:border-[#14967F] shadow-xs'
                  : 'bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-slate-200 border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Chevron Arrow Button > */}
      <button
        onClick={handleScrollRight}
        id="toc-scroll-right-btn"
        className="w-7 h-7 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] flex items-center justify-center text-[#095D7E] dark:text-slate-200 hover:border-[#14967F] shrink-0 cursor-pointer"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

    </div>
  );
};
