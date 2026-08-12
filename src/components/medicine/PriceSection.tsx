import React from 'react';
import { Tag, ShieldCheck } from 'lucide-react';
import { Medicine } from '../../types';

interface PriceSectionProps {
  medicine: Medicine;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ medicine }) => {
  return (
    <section id="sec-price" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#14967F]" />
            <span>Pricing & MRP Details</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            Official Maximum Retail Price (MRP) from pharmaceutical database
          </p>
        </div>

        <span className="bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] text-xs font-bold px-3 py-1 rounded-full border border-[#14967F]/30 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Price Index</span>
        </span>
      </div>

      <div className="bg-[#F1F9FF] dark:bg-[#1A2B3E] p-6 sm:p-8 rounded-2xl border-2 border-[#14967F] space-y-3 shadow-md max-w-xl">
        <div className="text-xs font-black uppercase text-[#14967F] dark:text-[#2DD4BF] tracking-wider">
          Maximum Retail Price (Main MRP)
        </div>

        <div className="text-4xl font-black text-[#095D7E] dark:text-slate-100">
          ৳ {medicine.mrp > 0 ? medicine.mrp.toFixed(2) : 'N/A'}
        </div>

        <p className="text-xs text-[#095D7E]/80 dark:text-slate-300 leading-relaxed">
          Standard government-approved Maximum Retail Price (MRP) in Bangladeshi Taka (BDT).
        </p>

        {medicine.packSize && (
          <div className="pt-3 border-t border-[#CCECEE] dark:border-[#243B53] text-xs font-bold text-[#095D7E] dark:text-slate-200">
            Pack Size Specification: <span className="font-extrabold">{medicine.packSize}</span>
          </div>
        )}
      </div>

    </section>
  );
};
