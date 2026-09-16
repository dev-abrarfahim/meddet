import React, { useMemo } from 'react';
import { Layers, ArrowLeft, ExternalLink } from 'lucide-react';
import { Medicine, LanguageMode } from '../../types';
import { getAlternativeBrands } from '../../data/dbEngine';
import { getDosageFormIconInfo } from '../../utils/dosageFormHelper';
import { getMedicineCanonicalPath, getGenericCanonicalPath } from '../../utils/urlHelper';

interface MedicineHeroProps {
  medicine: Medicine;
  onBackToSearch: () => void;
  onSelectMedicine: (med: Medicine) => void;
  onOpenGenericBrandsExplorer: (genericId: number, form?: string, strength?: string) => void;
  onSelectGeneric?: (genericId: number) => void;
  lang: LanguageMode;
  onToggleLang?: () => void;
}

export const MedicineHero: React.FC<MedicineHeroProps> = ({
  medicine,
  onBackToSearch,
  onSelectMedicine,
  onOpenGenericBrandsExplorer,
  onSelectGeneric,
  lang
}) => {
  const { iconPath, color: badgeColor } = getDosageFormIconInfo(medicine.form);

  // Find variants of the same generic/brand with different strengths & forms
  const variants = useMemo(() => {
    const allGenericAlternatives = getAlternativeBrands(medicine.genericId);
    return [
      medicine,
      ...allGenericAlternatives.filter(
        (m) => m.company.toLowerCase() === medicine.company.toLowerCase() || m.name.toLowerCase().startsWith(medicine.name.split(' ')[0].toLowerCase())
      )
    ].filter((v, idx, self) => self.findIndex(t => t.form === v.form && t.strength === v.strength) === idx).slice(0, 6);
  }, [medicine]);

  return (
    <section id="sec-overview" className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-2.5 sm:p-3 shadow-sm transition-colors space-y-1.5">
      
      {/* Back Button Bar */}
      <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-100 dark:border-slate-800/60">
        <button
          onClick={onBackToSearch}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-black text-[#14967F] dark:text-[#2DD4BF] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back to Index' : 'ইনডেক্সে ফিরে যান'}</span>
        </button>

        <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          Verified Drug
        </span>
      </div>

      {/* Main Header Info */}
      <div className="space-y-0.5 sm:space-y-1">
        
        {/* Line 1: Dynamic Dosage Form Icon + Brand Name + Form Badge */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center shrink-0" title={medicine.form}>
            <img src={iconPath} alt={medicine.form} className="w-9 h-9 object-contain" loading="lazy" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-1.5 flex-wrap">
            <span>{medicine.name}</span>
            <span className={`inline-flex items-center text-xs font-extrabold px-2 py-0.5 rounded font-mono ${badgeColor}`}>
              {medicine.form}
            </span>
          </h1>
        </div>

        {/* Line 2: Generic Name */}
        <div>
          <a
            href={getGenericCanonicalPath({ id: medicine.genericId, name: medicine.genericName })}
            onClick={(e) => {
              e.preventDefault();
              if (onSelectGeneric) {
                onSelectGeneric(medicine.genericId);
              } else {
                onOpenGenericBrandsExplorer(medicine.genericId);
              }
            }}
            className="inline-block text-sm sm:text-base font-extrabold text-[#14967F] dark:text-[#2DD4BF] hover:underline cursor-pointer leading-snug pl-0.5"
            title={`View full clinical monograph for ${medicine.genericName}`}
          >
            {medicine.genericName}
            {medicine.genericNameBn && (
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 ml-1.5">
                ({medicine.genericNameBn})
              </span>
            )}
          </a>
        </div>

        {/* Line 3: Strength */}
        {medicine.strength && (
          <div className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 font-mono pl-0.5">
            {medicine.strength}
          </div>
        )}

        {/* Line 4: Manufacturer */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 pt-0.5 pl-0.5">
          <img src="/icons/pharmaceutical.webp" alt="Manufacturer" className="w-4 h-4 object-contain shrink-0" loading="lazy" />
          <span>{medicine.company}</span>
        </div>

      </div>

      {/* "Also available As" Container with "Alternative Brands" Button */}
      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#14967F]" />
            <span>Also available As</span>
          </div>

          {/* Alternative Brands Dedicated Explorer Link */}
          <a
            href={`${getGenericCanonicalPath({ id: medicine.genericId, name: medicine.genericName })}?view=brands${medicine.form ? `&form=${encodeURIComponent(medicine.form)}` : ''}${medicine.strength ? `&strength=${encodeURIComponent(medicine.strength)}` : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onOpenGenericBrandsExplorer(medicine.genericId, medicine.form, medicine.strength);
            }}
            id="hero-open-alt-brands-explorer-btn"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-[11px] font-black text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all cursor-pointer shadow-xs"
          >
            <span>Alternative Brands</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {variants.map((v) => {
            const isCurrent = v.id === medicine.id || (v.form === medicine.form && v.strength === medicine.strength);
            return (
              <a
                key={v.id}
                href={getMedicineCanonicalPath(v)}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectMedicine(v);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isCurrent
                    ? 'bg-[#095D7E] dark:bg-[#14967F] text-white border-[#095D7E] dark:border-[#14967F] shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#14967F]'
                }`}
              >
                {v.strength || medicine.strength} - {v.form || medicine.form}
              </a>
            );
          })}
        </div>
      </div>

    </section>
  );
};
