import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { GenericMonograph, LanguageMode } from '../../types';

interface ClinicalMonographAccordionsProps {
  monograph?: GenericMonograph;
  lang: LanguageMode;
  onToggleLang: () => void;
}

export const ClinicalMonographAccordions: React.FC<ClinicalMonographAccordionsProps> = ({
  monograph,
  lang
}) => {
  // Track open state for each accordion
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    indication: true,
    adultDose: true,
    childDose: false,
    renalDose: false,
    administration: false,
    contraindications: false
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getLangField = (enStr?: string, bnStr?: string) => {
    return lang === 'bn' && bnStr ? bnStr : enStr;
  };

  const indicationText = getLangField(monograph?.indication, monograph?.indicationBn);
  const doseText = getLangField(monograph?.dose, monograph?.doseBn);
  const contraText = getLangField(monograph?.contraIndication, monograph?.contraIndicationBn);
  const precautionText = getLangField(monograph?.precaution, monograph?.precautionBn);

  // Helper parser for dose sections
  const parseDosePart = (text?: string, type: 'adult' | 'child' | 'renal' | 'admin' = 'adult') => {
    if (!text) return 'Standard dosage instructions as directed by physician.';
    if (type === 'child') {
      return text.includes('Child') || text.includes('Pediatric') || text.includes('শিশু') 
        ? text 
        : 'Consult registered pediatrician for child dosage weight calculations.';
    }
    if (type === 'renal') {
      return text.includes('Renal') || text.includes('Kidney') || text.includes('বুক')
        ? text
        : 'Dosage adjustment may be required in severe renal impairment (CrCl < 30 mL/min).';
    }
    if (type === 'admin') {
      return 'Should be taken orally with water, preferably before meals or as directed.';
    }
    return text;
  };

  const accordionItems = [
    { key: 'indication', title: lang === 'en' ? 'Indication' : 'নির্দেশনা (Indication)', content: indicationText },
    { key: 'adultDose', title: lang === 'en' ? 'Adult Dose' : 'প্রাপ্তবয়স্কদের মাত্রা (Adult Dose)', content: parseDosePart(doseText, 'adult') },
    { key: 'childDose', title: lang === 'en' ? 'Child Dose' : 'শিশুদের মাত্রা (Child Dose)', content: parseDosePart(doseText, 'child') },
    { key: 'renalDose', title: lang === 'en' ? 'Renal Dose' : 'রেণাল ও কিডনি মাত্রা (Renal Dose)', content: parseDosePart(doseText, 'renal') },
    { key: 'administration', title: lang === 'en' ? 'Administration' : 'সেবনবিধি (Administration)', content: parseDosePart(doseText, 'admin') },
    { key: 'contraindications', title: lang === 'en' ? 'Contraindications' : 'প্রতিনির্দেশনা (Contraindications)', content: contraText || precautionText },
  ];

  return (
    <section id="sec-monograph" className="space-y-1.5 pt-0.5">
      
      {/* Accordions List (Strictly matching hand-drawn sketch) */}
      <div className="space-y-1">
        {accordionItems.map((item) => {
          const isOpen = !!openItems[item.key];
          if (!item.content) return null;

          return (
            <div
              key={item.key}
              className="bg-white dark:bg-[#131B2E] rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => toggleItem(item.key)}
                className="w-full py-1.5 px-2.5 flex items-center justify-between gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#14967F] dark:text-[#2DD4BF] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>
                </div>

                <div className="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {isOpen && (
                <div className="py-1.5 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/40">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </section>
  );
};
