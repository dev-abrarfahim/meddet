import React from 'react';
import { Clock, Info, ShieldCheck } from 'lucide-react';
import { DosageFormIcon } from '../../utils/dosageFormHelper';
import { GenericMonograph, DosageFormNote, LanguageMode } from '../../types';

interface HowToUseSectionProps {
  monograph?: GenericMonograph;
  dosageNote?: DosageFormNote;
  medicineName: string;
  dosageForm: string;
  lang: LanguageMode;
}

export const HowToUseSection: React.FC<HowToUseSectionProps> = ({
  monograph,
  dosageNote,
  medicineName,
  dosageForm,
  lang
}) => {
  const doseEn = monograph?.dose;
  const doseBn = monograph?.doseBn;
  const displayDose = lang === 'bn' && doseBn ? doseBn : doseEn;

  const noteEn = dosageNote?.note;
  const noteBn = dosageNote?.noteBn;
  const displayNote = lang === 'bn' && noteBn ? noteBn : noteEn;

  if (!displayDose && !displayNote) return null;

  return (
    <section id="sec-dosage" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#14967F]" />
            <span>{lang === 'en' ? 'Dosage & Administration Guidelines' : 'সেবনমাত্রা ও সেবনবিধি'}</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            {lang === 'en' ? `Clinical dosage rules for ${medicineName}` : `${medicineName} সেবনের পরিমাণ ও নিয়মাবলী`}
          </p>
        </div>
      </div>

      {/* DOSAGE INTAKE NOTE FOR DOSAGE FORM (From t_drug_note.json) */}
      {displayNote && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-5 rounded-2xl border-2 border-emerald-500/40 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-emerald-800 dark:text-emerald-300">
            <DosageFormIcon formString={dosageForm} size="sm" />
            <span>{lang === 'en' ? `Administration Note for ${dosageForm}` : `${dosageForm} ব্যবহারের বিশেষ নির্দেশিকা`}</span>
          </div>
          <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200 leading-relaxed">
            {displayNote}
          </p>
        </div>
      )}

      {/* CLINICAL DOSAGE TEXT */}
      {displayDose && (
        <div className="space-y-2">
          <h3 className="text-sm font-extrabold text-[#095D7E] dark:text-slate-200 uppercase tracking-wider">
            {lang === 'en' ? 'Clinical Dosage Rules' : 'চিকিৎসাগত সেবনমাত্রা'}
          </h3>
          <div className="bg-[#F1F9FF] dark:bg-[#1A2B3E] p-5 sm:p-6 rounded-2xl border border-[#CCECEE] dark:border-[#243B53] whitespace-pre-line text-sm sm:text-base font-medium text-[#095D7E] dark:text-slate-200 leading-relaxed">
            {displayDose}
          </div>
        </div>
      )}

    </section>
  );
};
