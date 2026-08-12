import React from 'react';
import { AlertCircle, FileText, Languages } from 'lucide-react';
import { GenericMonograph, LanguageMode } from '../../types';

interface MoreInfoSectionProps {
  monograph?: GenericMonograph;
  medicineName: string;
  lang: LanguageMode;
}

export const MoreInfoSection: React.FC<MoreInfoSectionProps> = ({
  monograph,
  medicineName,
  lang
}) => {
  const overdoseEn = monograph?.overdose;
  const overdoseBn = monograph?.overdoseBn;

  const displayContent = lang === 'bn' && overdoseBn ? overdoseBn : overdoseEn;

  if (!displayContent) return null;

  return (
    <section id="sec-moreinfo" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-500" />
            <span>{lang === 'en' ? 'Overdose Symptoms & Management' : 'ওভারডোজ ও অতিরিক্ত মাত্রার তথ্য'}</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            {lang === 'en' ? `Overdose emergency protocols for ${medicineName}` : `${medicineName} অতিরিক্ত সেবনের লক্ষণ ও জরুরি ব্যবস্থা`}
          </p>
        </div>
      </div>

      <div className="bg-rose-50/40 dark:bg-rose-950/20 p-5 sm:p-6 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 text-rose-950 dark:text-rose-200">
        <div className="whitespace-pre-line text-sm sm:text-base font-medium leading-relaxed">
          {displayContent}
        </div>
      </div>

    </section>
  );
};
