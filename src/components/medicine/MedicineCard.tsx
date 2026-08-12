import React from 'react';
import { Pill, Building2, ChevronRight } from 'lucide-react';
import { Medicine } from '../../types';

interface MedicineCardProps {
  medicine: Medicine;
  onSelect: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(medicine)}
      className="bg-white dark:bg-[#131B2E] rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-[#14967F] dark:hover:border-[#2DD4BF] p-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 group"
    >
      <div className="space-y-1.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#14967F] dark:text-[#2DD4BF] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">
            <Pill className="w-3 h-3" />
            <span>{medicine.form}</span>
            {medicine.strength && <span>• {medicine.strength}</span>}
          </span>
        </div>

        {/* Brand Name */}
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors leading-tight">
            {medicine.name}
          </h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {medicine.genericName} {medicine.genericNameBn ? `(${medicine.genericNameBn})` : ''}
          </p>
        </div>

        {/* Manufacturer */}
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
          <Building2 className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
          <span className="truncate font-medium">{medicine.company}</span>
        </div>
      </div>

      {/* Pricing Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] font-bold text-slate-400">
            MRP Price
          </div>
          <div className="text-base font-black text-slate-900 dark:text-slate-100 font-mono">
            ৳ {medicine.mrp > 0 ? medicine.mrp.toFixed(2) : 'N/A'}
          </div>
        </div>

        <div className="inline-flex items-center text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] group-hover:translate-x-0.5 transition-transform">
          <span>Details</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
