import React from 'react';
import { ShieldAlert, AlertTriangle, XCircle } from 'lucide-react';
import { GenericMonograph, LanguageMode } from '../../types';

interface WarningsSectionProps {
  monograph?: GenericMonograph;
  medicineName: string;
  lang: LanguageMode;
}

export const WarningsSection: React.FC<WarningsSectionProps> = ({
  monograph,
  medicineName,
  lang
}) => {
  const precautionEn = monograph?.precaution;
  const precautionBn = monograph?.precautionBn;
  const displayPrecaution = lang === 'bn' && precautionBn ? precautionBn : precautionEn;

  const contraEn = monograph?.contraIndication;
  const contraBn = monograph?.contraIndicationBn;
  const displayContra = lang === 'bn' && contraBn ? contraBn : contraEn;

  if (!displayPrecaution && !displayContra) return null;

  return (
    <section id="sec-warnings" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" />
            <span>{lang === 'en' ? 'Warnings, Precautions & Contraindications' : 'সতর্কতা ও প্রতিনির্দেশনা'}</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            {lang === 'en' ? `Critical safety guidelines when prescribing ${medicineName}` : `${medicineName} ব্যবহারের বিশেষ সতর্কতা ও নিষেধ`}
          </p>
        </div>
      </div>

      {/* PRECAUTIONS */}
      {displayPrecaution && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>{lang === 'en' ? 'Precautions & Warnings' : 'সতর্কতা ও সাবধানতা'}</span>
          </div>
          <div className="bg-amber-50/50 dark:bg-amber-950/30 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 whitespace-pre-line text-sm sm:text-base font-medium text-amber-950 dark:text-amber-200 leading-relaxed">
            {displayPrecaution}
          </div>
        </div>
      )}

      {/* CONTRAINDICATIONS */}
      {displayContra && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-rose-700 dark:text-rose-400">
            <XCircle className="w-4 h-4" />
            <span>{lang === 'en' ? 'Contraindications (Do Not Use If)' : 'প্রতি-নির্দেশনা (যাদের জন্য ব্যবহার নিষেধ)'}</span>
          </div>
          <div className="bg-rose-50/50 dark:bg-rose-950/30 p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 whitespace-pre-line text-sm sm:text-base font-medium text-rose-950 dark:text-rose-200 leading-relaxed">
            {displayContra}
          </div>
        </div>
      )}

    </section>
  );
};
