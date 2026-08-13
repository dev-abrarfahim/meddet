import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';
import { Medicine } from '../../types';
import { getDosageFormIconInfo } from '../../utils/dosageFormHelper';
import { slugify } from '../../utils/slugify';

interface MedicineCardProps {
  medicine: Medicine;
  onSelect: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onSelect }) => {
  const { iconPath, color: badgeColor } = getDosageFormIconInfo(medicine.form);
  const brandSlug = slugify(`${medicine.name}-${medicine.strength || ''}-${medicine.form}`);
  const href = `/?id=${medicine.id}&brand=${brandSlug}`;

  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onSelect(medicine);
      }}
      className="bg-white dark:bg-[#131B2E] rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-[#14967F] dark:hover:border-[#2DD4BF] p-3 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 group"
    >
      <div className="space-y-1.5">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <span className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-0.5 rounded font-mono ${badgeColor}`}>
            <img src={iconPath} alt={medicine.form} className="w-3.5 h-3.5 object-contain shrink-0" loading="lazy" />
            <span>{medicine.form}</span>
            {medicine.strength && <span>• {medicine.strength}</span>}
          </span>
        </div>

        {/* Brand Name */}
        <div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors leading-tight">
            {medicine.name}
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 mt-0.5 truncate">
            {medicine.genericName} {medicine.genericNameBn ? `(${medicine.genericNameBn})` : ''}
          </p>
        </div>

        {/* Manufacturer */}
        <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-0.5">
          <Building2 className="w-4 h-4 text-[#14967F] shrink-0" />
          <span className="truncate font-semibold">{medicine.company}</span>
        </div>
      </div>

      {/* Pricing Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold text-slate-400">
            MRP Price
          </div>
          <div className="text-lg sm:text-base font-black text-slate-900 dark:text-slate-100 font-mono">
            ৳ {medicine.mrp > 0 ? medicine.mrp.toFixed(2) : 'N/A'}
          </div>
        </div>

        <div className="inline-flex items-center text-xs sm:text-sm font-black text-[#14967F] dark:text-[#2DD4BF] group-hover:translate-x-0.5 transition-transform">
          <span>Details</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
};
