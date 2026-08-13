import React from 'react';
import { Medicine } from '../../types';
import { calculateMedicinePricing } from '../../utils/pricingHelper';

interface PriceSectionProps {
  medicine: Medicine;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ medicine }) => {
  const pricing = calculateMedicinePricing(medicine);

  return (
    <section id="sec-price" className="space-y-2">
      
      {/* 1. Unit Price Card (Accurate Unit/Bottle/Tube/Device Price) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs space-y-1.5 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {pricing.unitLabel}
            </div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {pricing.unitSubtext}
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
            {pricing.hasPrice ? `৳ ${pricing.unitPrice.toFixed(2)}` : 'N/A'}
          </div>
        </div>

        {pricing.hasPrice && (
          <div className="text-right text-[11px] sm:text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] pt-1 border-t border-slate-100 dark:border-slate-800/60">
            Pharmacy Discount (10%): <span className="font-extrabold">৳ {pricing.unitDiscountPrice.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* 2. Pack Price / Commercial Packaging Card */}
      <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs space-y-1.5 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {pricing.hasSeparatePack ? 'Pack Price :' : 'Commercial Pack :'}
            </div>
            <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400 mt-0.5">
              {pricing.packLabel}
            </div>
          </div>

          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono text-right">
            {pricing.hasPrice ? `৳ ${pricing.packPrice.toFixed(2)}` : 'N/A'}
          </div>
        </div>

        {pricing.hasPrice && (
          <div className="text-right text-[11px] sm:text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] pt-1 border-t border-slate-100 dark:border-slate-800/60">
            Pharmacy Discount (10%): <span className="font-extrabold">৳ {pricing.packDiscountPrice.toFixed(2)}/pack</span>
          </div>
        )}
      </div>

    </section>
  );
};
