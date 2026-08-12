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
      className="bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] dark:hover:border-[#2DD4BF] p-5 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#14967F] dark:text-[#2DD4BF] bg-[#F1F9FF] dark:bg-[#1A2B3E] px-2.5 py-0.5 rounded-lg border border-[#CCECEE] dark:border-[#243B53]">
            <Pill className="w-3 h-3" />
            <span>{medicine.form}</span>
            {medicine.strength && <span>• {medicine.strength}</span>}
          </span>
        </div>

        {/* Brand Name */}
        <div>
          <h3 className="text-xl font-black text-[#095D7E] dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors leading-tight">
            {medicine.name}
          </h3>
          <p className="text-xs font-semibold text-[#095D7E]/70 dark:text-slate-400 mt-1">
            {medicine.genericName} {medicine.genericNameBn ? `(${medicine.genericNameBn})` : ''}
          </p>
        </div>

        {/* Manufacturer */}
        <div className="flex items-center gap-1.5 text-xs text-[#095D7E]/80 dark:text-slate-300 pt-1">
          <Building2 className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
          <span className="truncate font-medium">{medicine.company}</span>
        </div>
      </div>

      {/* Pricing Footer (Clean MRP Display) */}
      <div className="pt-3 border-t border-[#F1F9FF] dark:border-[#243B53] flex items-center justify-between gap-2">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#095D7E]/60 dark:text-slate-400">
            MRP Price
          </div>
          <div className="text-xl font-black text-[#095D7E] dark:text-slate-100">
            ৳ {medicine.mrp > 0 ? medicine.mrp.toFixed(2) : 'N/A'}
          </div>
          {medicine.packSize && (
            <div className="text-[10px] font-medium text-slate-400 truncate">
              {medicine.packSize}
            </div>
          )}
        </div>

        <div className="inline-flex items-center text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] group-hover:translate-x-0.5 transition-transform">
          <span>View Monograph</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
