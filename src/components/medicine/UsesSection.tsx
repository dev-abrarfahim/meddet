import React from 'react';
import { Stethoscope, CheckCircle2, Languages } from 'lucide-react';
import { GenericMonograph, LanguageMode } from '../../types';

interface UsesSectionProps {
  monograph?: GenericMonograph;
  medicineName: string;
  lang: LanguageMode;
}

export const UsesSection: React.FC<UsesSectionProps> = ({ monograph, medicineName, lang }) => {
  const contentEn = monograph?.indication;
  const contentBn = monograph?.indicationBn;

  const displayContent = lang === 'bn' && contentBn ? contentBn : contentEn;

  if (!displayContent) return null;

  return (
    <section id="sec-uses" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-[#14967F]" />
            <span>{lang === 'en' ? 'Therapeutic Indications & Uses' : 'ব্যবহার নির্দেশিকা ও নির্দেশনা'}</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            {lang === 'en' ? `What ${medicineName} is prescribed and used for` : `${medicineName} কিসের চিকিৎসায় ব্যবহৃত হয়`}
          </p>
        </div>

        <span className="bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] text-xs font-bold px-3 py-1 rounded-full border border-[#CCECEE] dark:border-[#243B53] flex items-center gap-1">
          <Languages className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'English Monograph' : 'বাংলা সংস্করণ'}</span>
        </span>
      </div>

      <div className="bg-[#F1F9FF] dark:bg-[#1A2B3E] p-5 sm:p-6 rounded-2xl border border-[#CCECEE] dark:border-[#243B53]">
        <div className="whitespace-pre-line text-sm sm:text-base font-medium text-[#095D7E] dark:text-slate-200 leading-relaxed">
          {displayContent}
        </div>
      </div>

    </section>
  );
};
