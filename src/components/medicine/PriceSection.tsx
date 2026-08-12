import React from 'react';
import { Tag } from 'lucide-react';
import { Medicine } from '../../types';

interface PriceSectionProps {
  medicine: Medicine;
}

export const PriceSection: React.FC<PriceSectionProps> = ({ medicine }) => {
  const unitPrice = medicine.mrp > 0 ? medicine.mrp : 7.00; // Fallback unit price if missing
  const unitDiscountPrice = unitPrice * 0.90; // 10% Pharmacy discount

  // Calculate pack size numbers (e.g., 140's Pack, 100's Pack, or 10's strip)
  const packCountMatch = medicine.packSize ? medicine.packSize.match(/\d+/) : null;
  const packCount = packCountMatch ? parseInt(packCountMatch[0], 10) : 140;
  
  const packPrice = unitPrice * packCount;
  const packDiscountPrice = packPrice * 0.90;

  return (
    <section id="sec-price" className="space-y-4">
      
      {/* Unit Price Card (Exact Hand-Drawn Sketch Design) */}
      <div className="bg-white dark:bg-[#152232] rounded-2xl border-2 border-[#CCECEE] dark:border-[#243B53] p-5 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between gap-2">
          <div className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#14967F]" />
            <span>Unit Price:</span>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-[#095D7E] dark:text-slate-100 font-mono">
            ৳ {unitPrice.toFixed(2)}
          </div>
        </div>

        <div className="text-right text-xs sm:text-sm font-bold text-[#14967F] dark:text-[#2DD4BF] pt-1 border-t border-[#F1F9FF] dark:border-[#243B53]">
          Pharmacy Discount (10%): <span className="font-extrabold">৳ {unitDiscountPrice.toFixed(2)} / unit</span>
        </div>
      </div>

      {/* Pack Price Card (Exact Hand-Drawn Sketch Design) */}
      <div className="bg-white dark:bg-[#152232] rounded-2xl border-2 border-[#CCECEE] dark:border-[#243B53] p-5 shadow-sm space-y-3 transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              Pack Price :
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-500 dark:text-slate-400 mt-1">
              {medicine.packSize || `${packCount}'s Pack`}
            </div>
          </div>

          <div className="text-2xl sm:text-3xl font-black text-[#095D7E] dark:text-slate-100 font-mono text-right">
            ৳ {packPrice.toFixed(2)}
          </div>
        </div>

        <div className="text-right text-xs sm:text-sm font-bold text-[#14967F] dark:text-[#2DD4BF] pt-1 border-t border-[#F1F9FF] dark:border-[#243B53]">
          Pharmacy Discount (10%): <span className="font-extrabold">৳ {packDiscountPrice.toFixed(0)} / pack</span>
        </div>
      </div>

    </section>
  );
};
