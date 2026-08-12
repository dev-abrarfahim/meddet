import React from 'react';
import { Pill, Tag, Layers, Atom, Stethoscope, HeartPulse, Clock, ShieldAlert, AlertCircle, Info } from 'lucide-react';

interface TableOfContentsProps {
  activeSection: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ activeSection }) => {
  const sections = [
    { id: 'sec-overview', label: 'Overview', icon: Pill },
    { id: 'sec-price', label: 'Pricing', icon: Tag },
    { id: 'sec-alternatives', label: 'Alternatives', icon: Layers },
    { id: 'sec-structure', label: 'Structure', icon: Atom },
    { id: 'sec-uses', label: 'Indications', icon: Stethoscope },
    { id: 'sec-safety', label: 'Pregnancy', icon: HeartPulse },
    { id: 'sec-dosage', label: 'Dosage', icon: Clock },
    { id: 'sec-warnings', label: 'Warnings', icon: ShieldAlert },
    { id: 'sec-sideeffects', label: 'Side Effects', icon: AlertCircle },
    { id: 'sec-moreinfo', label: 'Overdose', icon: Info }
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 140;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-28 z-20 bg-white/90 dark:bg-[#152232]/90 backdrop-blur-md border border-[#CCECEE] dark:border-[#243B53] rounded-2xl p-2 shadow-md transition-colors overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-1.5 min-w-max">
        {sections.map((sec) => {
          const IconComp = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#14967F] text-white shadow-xs'
                  : 'text-[#095D7E]/70 dark:text-slate-300 hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E]'
              }`}
            >
              <IconComp className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
