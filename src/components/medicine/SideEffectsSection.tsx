import React from 'react';
import { AlertCircle, Languages } from 'lucide-react';
import { GenericMonograph, LanguageMode } from '../../types';

interface SideEffectsSectionProps {
  monograph?: GenericMonograph;
  medicineName: string;
  lang: LanguageMode;
}

export const SideEffectsSection: React.FC<SideEffectsSectionProps> = ({
  monograph,
  medicineName,
  lang
}) => {
  const sideEffectEn = monograph?.sideEffect;
  const sideEffectBn = monograph?.sideEffectBn;

  const displayContent = lang === 'bn' && sideEffectBn ? sideEffectBn : sideEffectEn;

  if (!displayContent) return null;

  return (
    <section id="sec-sideeffects" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>{lang === 'en' ? 'Possible Side Effects' : 'পার্শ্ব প্রতিক্রিয়া'}</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            {lang === 'en' ? `Potential side effects reported for ${medicineName}` : `${medicineName} সেবনের সম্ভাব্য পার্শ্ব প্রতিক্রিয়া`}
          </p>
        </div>

        <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900 flex items-center gap-1">
          <Languages className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'English Monograph' : 'বাংলা সংস্করণ'}</span>
        </span>
      </div>

      <div className="bg-amber-50/40 dark:bg-amber-950/20 p-5 sm:p-6 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 text-amber-950 dark:text-amber-200">
        <div className="whitespace-pre-line text-sm sm:text-base font-medium leading-relaxed">
          {displayContent}
        </div>
      </div>

    </section>
  );
};
