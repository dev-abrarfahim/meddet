import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Languages } from 'lucide-react';
import { GenericMonograph, LanguageMode } from '../../types';

interface ClinicalMonographAccordionsProps {
  monograph?: GenericMonograph;
  lang: LanguageMode;
  onToggleLang: () => void;
}

export const ClinicalMonographAccordions: React.FC<ClinicalMonographAccordionsProps> = ({
  monograph,
  lang,
  onToggleLang
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
  const sideEffectText = getLangField(monograph?.sideEffect, monograph?.sideEffectBn);
  const pregText = getLangField(monograph?.pregnancyCategory, monograph?.pregnancyCategoryBn);

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
    <section id="sec-monograph" className="space-y-4 pt-2">
      
      {/* Accordions List (Strictly matching hand-drawn sketch) */}
      <div className="space-y-2.5">
        {accordionItems.map((item) => {
          const isOpen = !!openItems[item.key];
          if (!item.content) return null;

          return (
            <div
              key={item.key}
              className="bg-white dark:bg-[#152232] rounded-2xl border-2 border-[#CCECEE] dark:border-[#243B53] overflow-hidden shadow-xs transition-colors"
            >
              <button
                onClick={() => toggleItem(item.key)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[#14967F] dark:text-[#2DD4BF]">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <span className="text-base font-extrabold text-[#095D7E] dark:text-slate-100">
                    {item.title}
                  </span>
                </div>

                <div className="w-7 h-7 rounded-lg bg-[#F1F9FF] dark:bg-[#1A2B3E] flex items-center justify-center text-[#095D7E] dark:text-slate-200">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="p-4 pt-0 text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed border-t border-[#F1F9FF] dark:border-[#243B53] whitespace-pre-line bg-[#F1F9FF]/40 dark:bg-[#1A2B3E]/40">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating / Sticky Bottom Language Toggle Button (Exact Hand-Drawn Sketch Feature: "বাংলায় দেখুন") */}
      <div className="pt-2 flex justify-center sticky bottom-16 z-30 pointer-events-auto">
        <button
          onClick={onToggleLang}
          id="toggle-bangla-btn-sketch"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#095D7E] dark:bg-[#14967F] text-white text-sm font-black shadow-2xl border-2 border-white dark:border-[#243B53] hover:scale-105 transition-all cursor-pointer"
        >
          <Languages className="w-4 h-4 text-[#E2FCD6]" />
          <span>{lang === 'en' ? 'বাংলায় দেখুন' : 'View in English'}</span>
        </button>
      </div>

    </section>
  );
};
