import React from 'react';
import { Medicine } from '../../types';

interface PriceSectionProps {
  medicine: Medicine;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ medicine }) => {
  const unitPrice = medicine.mrp > 0 ? medicine.mrp : 7.00;
  const unitDiscountPrice = unitPrice * 0.90; // 10% discount

  // Calculate pack size numbers (e.g. 140's Pack)
  const packCountMatch = medicine.packSize ? medicine.packSize.match(/\d+/) : null;
  const packCount = packCountMatch ? parseInt(packCountMatch[0], 10) : 140;
  
  const packPrice = unitPrice * packCount;
  const packDiscountPrice = packPrice * 0.90;

  return (
    <section id="sec-price" className="space-y-2">
      
      {/* Unit Price Card (Strictly Matching Hand-Drawn Sketch Layout) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs space-y-1.5 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Unit Price :
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            ৳ {unitPrice.toFixed(2)}
          </div>
        </div>

        <div className="text-right text-[11px] sm:text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] pt-1 border-t border-slate-100 dark:border-slate-800/60">
          Pharmacy Discount (10%): <span className="font-extrabold">৳ {unitDiscountPrice.toFixed(2)}/unit</span>
        </div>
      </div>

      {/* Pack Price Card (Strictly Matching Hand-Drawn Sketch Layout) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs space-y-1.5 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              Pack Price :
            </div>
            <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">
              {medicine.packSize || `${packCount}'s Pack`}
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono text-right">
            ৳ {packPrice.toFixed(2)}
          </div>
        </div>

        <div className="text-right text-[11px] sm:text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] pt-1 border-t border-slate-100 dark:border-slate-800/60">
          Pharmacy Discount (10%): <span className="font-extrabold">৳ {packDiscountPrice.toFixed(0)}/pack</span>
        </div>
      </div>

    </section>
  );
};
