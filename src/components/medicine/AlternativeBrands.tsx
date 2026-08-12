import React from 'react';
import { Layers, Building2, ChevronRight } from 'lucide-react';
import { Medicine } from '../../types';
import { getAlternativeBrands } from '../../data/dbEngine';

interface AlternativeBrandsProps {
  medicine: Medicine;
  onSelectMedicine: (med: Medicine) => void;
}

export const AlternativeBrands: React.FC<AlternativeBrandsProps> = ({
  medicine,
  onSelectMedicine
}) => {
  const alternatives = getAlternativeBrands(medicine.genericId, medicine.id).slice(0, 12);

  if (alternatives.length === 0) {
    return null;
  }

  return (
    <section id="sec-alternatives" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#14967F]" />
            <span>Alternative Brands ({alternatives.length} Available)</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            Other brand medicines sharing the same active generic ingredient ({medicine.genericName})
          </p>
        </div>

        <span className="bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] text-xs font-bold px-3 py-1 rounded-full border border-[#14967F]/30">
          Same Generic Composition
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternatives.map((alt) => (
          <div
            key={alt.id}
            onClick={() => onSelectMedicine(alt)}
            className="bg-[#F1F9FF] dark:bg-[#1A2B3E] p-4 rounded-2xl border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] dark:hover:border-[#2DD4BF] transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#14967F] dark:text-[#2DD4BF] bg-white dark:bg-[#152232] px-2 py-0.5 rounded border border-[#CCECEE] dark:border-[#243B53]">
                  {alt.form} • {alt.strength}
                </span>
                <h3 className="text-base font-black text-[#095D7E] dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors mt-1.5">
                  {alt.name}
                </h3>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase">MRP</div>
                <div className="text-sm font-black text-[#095D7E] dark:text-slate-100">
                  ৳ {alt.mrp.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#095D7E]/70 dark:text-slate-400 pt-2 border-t border-white/60 dark:border-[#243B53]">
              <div className="flex items-center gap-1 truncate max-w-[80%]">
                <Building2 className="w-3 h-3 text-[#14967F] shrink-0" />
                <span className="truncate font-medium">{alt.company}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#14967F] group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
