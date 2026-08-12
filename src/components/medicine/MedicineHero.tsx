import React from 'react';
import { Pill, Building2, ShieldCheck, ArrowLeft, Layers } from 'lucide-react';
import { Medicine, LanguageMode } from '../../types';
import { getAlternativeBrands } from '../../data/dbEngine';

interface MedicineHeroProps {
  medicine: Medicine;
  onBackToSearch: () => void;
  onSelectMedicine: (med: Medicine) => void;
  lang: LanguageMode;
  onToggleLang: () => void;
}

export const MedicineHero: React.FC<MedicineHeroProps> = ({
  medicine,
  onBackToSearch,
  onSelectMedicine,
  lang,
  onToggleLang
}) => {
  // Find variants of the same generic/brand with different strengths & forms
  const allGenericAlternatives = getAlternativeBrands(medicine.genericId);
  const variants = [
    medicine,
    ...allGenericAlternatives.filter(
      (m) => m.company.toLowerCase() === medicine.company.toLowerCase() || m.name.toLowerCase().startsWith(medicine.name.split(' ')[0].toLowerCase())
    )
  ].filter((v, idx, self) => self.findIndex(t => t.form === v.form && t.strength === v.strength) === idx).slice(0, 6);

  return (
    <section id="sec-overview" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-5 sm:p-7 shadow-lg relative overflow-hidden transition-colors space-y-5">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-3">
        <button
          onClick={onBackToSearch}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#14967F] dark:text-[#2DD4BF] hover:text-[#11806C] bg-[#F1F9FF] dark:bg-[#1A2B3E] px-3.5 py-2 rounded-xl border border-[#CCECEE] dark:border-[#243B53] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back' : 'ফিরে যান'}</span>
        </button>

        <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Drug</span>
        </span>
      </div>

      {/* Main Header Info (Strictly matching hand-drawn sketch) */}
      <div className="space-y-3">
        
        {/* Brand Name + Icon + Form Tag */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white flex items-center justify-center shrink-0 shadow-md">
            <Pill className="w-6 h-6 text-[#E2FCD6]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#095D7E] dark:text-slate-100 tracking-tight flex items-center gap-2">
              <span>{medicine.name}</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 font-mono">
                {medicine.form}
              </span>
            </h1>
          </div>
        </div>

        {/* Generic Name */}
        <div className="text-base sm:text-lg font-extrabold text-[#14967F] dark:text-[#2DD4BF] leading-snug">
          {medicine.genericName}
          {medicine.genericNameBn && (
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-2">
              ({medicine.genericNameBn})
            </span>
          )}
        </div>

        {/* Strength */}
        {medicine.strength && (
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 font-mono">
            {medicine.strength}
          </div>
        )}

        {/* Manufacturer / Company */}
        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 pt-1">
          <Building2 className="w-4 h-4 text-[#14967F] shrink-0" />
          <span>{medicine.company}</span>
        </div>

      </div>

      {/* "Also available As" Container (Exact Hand-Drawn Sketch Feature) */}
      <div className="pt-3 border-t border-[#CCECEE] dark:border-[#243B53] space-y-2">
        <div className="text-xs font-black uppercase tracking-wider text-[#095D7E] dark:text-[#2DD4BF] flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#14967F]" />
          <span>Also available As</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {variants.map((v) => {
            const isCurrent = v.id === medicine.id || (v.form === medicine.form && v.strength === medicine.strength);
            return (
              <button
                key={v.id}
                onClick={() => onSelectMedicine(v)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isCurrent
                    ? 'bg-[#095D7E] dark:bg-[#14967F] text-white border-[#095D7E] dark:border-[#14967F] shadow-sm'
                    : 'bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-slate-200 border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]'
                }`}
              >
                {v.strength || medicine.strength} - {v.form || medicine.form}
              </button>
            );
          })}
        </div>
      </div>

    </section>
  );
};
