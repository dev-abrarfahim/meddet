import React from 'react';
import { HeartPulse, ShieldCheck, Languages } from 'lucide-react';
import { GenericMonograph, LanguageMode } from '../../types';

interface SafetySectionProps {
  monograph?: GenericMonograph;
  medicineName: string;
  lang: LanguageMode;
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  monograph,
  medicineName,
  lang
}) => {
  const pregnancyEn = monograph?.pregnancyCategory;
  const pregnancyBn = monograph?.pregnancyCategoryBn;

  const displayContent = lang === 'bn' && pregnancyBn ? pregnancyBn : pregnancyEn;

  if (!displayContent) return null;

  return (
    <section id="sec-safety" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-indigo-500" />
            <span>{lang === 'en' ? 'Pregnancy & Breastfeeding Safety' : 'গর্ভাবস্থা ও স্তন্যদানকালীন নিরাপত্তা'}</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            {lang === 'en' ? `Maternal and fetal clinical safety guidance for ${medicineName}` : `${medicineName} গর্ভাবস্থায় এবং স্তন্যদানকালে ব্যবহারের নির্দেশিকা`}
          </p>
        </div>

        <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-900 flex items-center gap-1">
          <Languages className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'English Monograph' : 'বাংলা সংস্করণ'}</span>
        </span>
      </div>

      <div className="bg-indigo-50/40 dark:bg-indigo-950/20 p-5 sm:p-6 rounded-2xl border border-indigo-200/60 dark:border-indigo-900/40 text-indigo-950 dark:text-indigo-200">
        <div className="whitespace-pre-line text-sm sm:text-base font-medium leading-relaxed">
          {displayContent}
        </div>
      </div>

    </section>
  );
};
