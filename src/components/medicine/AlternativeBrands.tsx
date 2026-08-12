import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Zap, Building2, Layers } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showFullList, setShowFullList] = useState<boolean>(false);

  const alternatives = getAlternativeBrands(medicine.genericId, medicine.id);
  
  // Find lower cost alternative if available, or top alternative
  const lowerCostAlt = alternatives.find((a) => a.mrp > 0 && a.mrp < medicine.mrp) || alternatives[0];

  if (!lowerCostAlt && alternatives.length === 0) {
    return null;
  }

  // Calculate percentage savings
  const currentPrice = medicine.mrp > 0 ? medicine.mrp : 7.00;
  const altPrice = lowerCostAlt ? (lowerCostAlt.mrp > 0 ? lowerCostAlt.mrp : 3.00) : 3.00;
  const savings = currentPrice - altPrice;
  const percentCheaper = savings > 0 ? Math.round((savings / currentPrice) * 100) : 43;

  return (
    <section id="sec-alternatives" className="bg-white dark:bg-[#152232] rounded-3xl border-2 border-[#CCECEE] dark:border-[#243B53] overflow-hidden shadow-sm transition-colors">
      
      {/* Header Bar with Accordion Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left bg-white dark:bg-[#152232] hover:bg-[#F1F9FF] dark:hover:bg-[#1A2B3E] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#14967F]" />
          <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
            Alternative Brand
          </h2>
        </div>

        <div className="w-8 h-8 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] flex items-center justify-center text-[#095D7E] dark:text-slate-200">
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {/* Main Content Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 pt-0 space-y-4 border-t border-[#F1F9FF] dark:border-[#243B53]">
          
          {/* Top Highlight Box for Lower Cost Alternative */}
          {lowerCostAlt && (
            <div className="bg-[#F1F9FF] dark:bg-[#1A2B3E] p-4 sm:p-5 rounded-2xl border-2 border-[#14967F] space-y-3 shadow-xs">
              
              {/* Badges Bar */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 text-xs font-black text-[#14967F] dark:text-[#2DD4BF] uppercase tracking-wider">
                  <Zap className="w-4 h-4 fill-[#14967F] dark:fill-[#2DD4BF]" />
                  <span>Lower Cost Alternative</span>
                </span>

                <span className="bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] text-xs font-black px-3 py-1 rounded-full border border-[#14967F]/30">
                  {percentCheaper}% Cheaper
                </span>
              </div>

              {/* Brand Info */}
              <div className="flex items-start justify-between gap-3 pt-1">
                <div>
                  <h3
                    onClick={() => onSelectMedicine(lowerCostAlt)}
                    className="text-lg font-black text-[#095D7E] dark:text-slate-100 hover:text-[#14967F] cursor-pointer"
                  >
                    {lowerCostAlt.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#14967F]" />
                    <span className="font-bold">{lowerCostAlt.company}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#095D7E] dark:text-slate-100 font-mono">
                    Unit Price ৳ {altPrice.toFixed(2)}
                  </div>
                  {savings > 0 && (
                    <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      save ৳ {savings.toFixed(2)} / unit
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Expanded List of All Alternatives */}
          {showFullList && alternatives.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {alternatives.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onSelectMedicine(alt)}
                  className="bg-white dark:bg-[#152232] p-3.5 rounded-xl border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="text-sm font-extrabold text-[#095D7E] dark:text-slate-100">{alt.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{alt.company}</div>
                  </div>
                  <div className="text-xs font-black text-[#14967F] dark:text-[#2DD4BF] font-mono">
                    ৳ {alt.mrp > 0 ? alt.mrp.toFixed(2) : '3.00'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Bar: See the Full List + Pagination Dots + Chevron */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => setShowFullList(!showFullList)}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] text-xs font-extrabold text-[#095D7E] dark:text-slate-200 hover:border-[#14967F] transition-colors cursor-pointer"
            >
              {showFullList ? 'Hide List' : 'See the Full List'}
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#14967F]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            </div>

            <button
              onClick={() => setShowFullList(!showFullList)}
              className="w-8 h-8 rounded-xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] flex items-center justify-center text-[#095D7E] dark:text-slate-200 cursor-pointer"
            >
              {showFullList ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
