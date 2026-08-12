import React from 'react';
import { Pill, Building2, Languages, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Medicine, LanguageMode } from '../../types';

interface MedicineHeroProps {
  medicine: Medicine;
  onBackToSearch: () => void;
  lang: LanguageMode;
  onToggleLang: () => void;
}

export const MedicineHero: React.FC<MedicineHeroProps> = ({
  medicine,
  onBackToSearch,
  lang,
  onToggleLang
}) => {
  return (
    <section id="sec-overview" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-xl relative overflow-hidden transition-colors">
      
      {/* Top Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
        <button
          onClick={onBackToSearch}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#14967F] dark:text-[#2DD4BF] hover:text-[#11806C] bg-[#F1F9FF] dark:bg-[#1A2B3E] px-3.5 py-2 rounded-xl border border-[#CCECEE] dark:border-[#243B53] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back to Search Index' : 'ইনডেক্সে ফিরে যান'}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#095D7E] dark:text-slate-100 bg-[#E2FCD6] dark:bg-[#064E3B] px-3.5 py-2 rounded-xl border border-[#14967F]/30 hover:bg-[#d2f9bf] transition-colors cursor-pointer"
          >
            <Languages className="w-4 h-4 text-[#14967F] dark:text-[#2DD4BF]" />
            <span>{lang === 'en' ? 'Monograph: ENGLISH' : 'মনোগ্রাফ: বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* Main Header Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        <div className="lg:col-span-2 space-y-4">
          
          {/* Form & Strength Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 bg-[#095D7E] dark:bg-[#14967F] text-white text-xs font-black px-3 py-1 rounded-lg">
              <Pill className="w-3.5 h-3.5" />
              <span>{medicine.form}</span>
            </span>

            {medicine.strength && (
              <span className="bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] text-xs font-extrabold px-3 py-1 rounded-lg border border-[#CCECEE] dark:border-[#243B53]">
                Strength: {medicine.strength}
              </span>
            )}

            <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Bangladeshi Drug</span>
            </span>
          </div>

          {/* Brand Name */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-[#095D7E] dark:text-slate-100 tracking-tight">
              {medicine.name}
            </h1>
            
            {/* Generic Active Ingredient */}
            <div className="text-base sm:text-lg font-bold text-[#14967F] dark:text-[#2DD4BF] flex items-center gap-2 flex-wrap pt-1">
              <span>Generic Active Ingredient:</span>
              <span className="bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] px-2.5 py-0.5 rounded-lg border border-[#14967F]/30">
                {medicine.genericName}
              </span>
              {medicine.genericNameBn && (
                <span className="text-sm font-semibold text-[#095D7E]/80 dark:text-slate-300">
                  ({medicine.genericNameBn})
                </span>
              )}
            </div>
          </div>

          {/* Manufacturer Info */}
          <div className="flex items-center gap-2 text-sm text-[#095D7E]/80 dark:text-slate-300 pt-2 border-t border-[#F1F9FF] dark:border-[#243B53]">
            <Building2 className="w-4 h-4 text-[#14967F] shrink-0" />
            <span className="font-bold">Manufactured by:</span>
            <span className="font-extrabold text-[#095D7E] dark:text-slate-100">{medicine.company}</span>
          </div>

        </div>

        {/* Clean Main MRP Price Card */}
        <div className="bg-[#F1F9FF] dark:bg-[#1A2B3E] p-6 rounded-2xl border-2 border-[#14967F] space-y-3 shadow-md">
          
          <div className="text-xs font-black uppercase text-[#14967F] dark:text-[#2DD4BF] tracking-wider">
            Official MRP Price
          </div>

          <div className="text-3xl sm:text-4xl font-black text-[#095D7E] dark:text-slate-100">
            ৳ {medicine.mrp > 0 ? medicine.mrp.toFixed(2) : 'N/A'}
          </div>

          <div className="text-xs text-[#095D7E]/70 dark:text-slate-400 font-medium">
            Maximum Retail Price in Bangladeshi Taka (BDT)
          </div>

          {medicine.packSize && (
            <div className="text-xs font-bold text-[#095D7E] dark:text-slate-200 pt-2 border-t border-[#CCECEE] dark:border-[#243B53]">
              Pack Size: <span className="font-extrabold">{medicine.packSize}</span>
            </div>
          )}

        </div>

      </div>

    </section>
  );
};
