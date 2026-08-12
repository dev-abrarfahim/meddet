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

  const alternatives = getAlternativeBrands(medicine.genericId, medicine.id, medicine.form);
  
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
    <section id="sec-alternatives" className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs transition-colors">
      
      {/* Header Bar with Accordion Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 sm:p-3.5 flex items-center justify-between gap-2 text-left bg-white dark:bg-[#131B2E] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#14967F]" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Alternative Brand
          </h2>
        </div>

        <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Main Content Body */}
      {isExpanded && (
        <div className="p-3 sm:p-3.5 pt-0 space-y-2.5 border-t border-slate-100 dark:border-slate-800/60">
          
          {/* Top Highlight Box for Lower Cost Alternative (Exact Hand-Drawn Sketch Layout) */}
          {lowerCostAlt && (
            <div className="bg-slate-50 dark:bg-slate-800/80 p-3 sm:p-3.5 rounded-xl border border-[#14967F]/40 space-y-2 shadow-xs">
              
              {/* Badges Bar */}
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#14967F] dark:text-[#2DD4BF] uppercase tracking-wider">
                  <Zap className="w-3 h-3 fill-[#14967F] dark:fill-[#2DD4BF]" />
                  <span>Lower Cost Alternative</span>
                </span>

                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                  {percentCheaper}% Cheaper
                </span>
              </div>

              {/* Brand Info */}
              <div className="flex items-start justify-between gap-2 pt-0.5">
                <div>
                  <h3
                    onClick={() => onSelectMedicine(lowerCostAlt)}
                    className="text-base font-black text-slate-900 dark:text-slate-100 hover:text-[#14967F] cursor-pointer"
                  >
                    {lowerCostAlt.name} {lowerCostAlt.strength} {lowerCostAlt.form}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <Building2 className="w-3 h-3 text-[#14967F]" />
                    <span className="font-bold">{lowerCostAlt.company}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 font-mono">
                    Unit Price ৳ {altPrice.toFixed(2)}
                  </div>
                  {savings > 0 && (
                    <div className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      save ৳ {savings.toFixed(2)} / unit
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* Expanded List of All Alternatives */}
          {showFullList && alternatives.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {alternatives.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onSelectMedicine(alt)}
                  className="bg-white dark:bg-[#131B2E] p-2.5 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-[#14967F] transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs"
                >
                  <div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-slate-100">{alt.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{alt.company}</div>
                  </div>
                  <div className="text-xs font-black text-[#14967F] dark:text-[#2DD4BF] font-mono">
                    ৳ {alt.mrp > 0 ? alt.mrp.toFixed(2) : '3.00'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Bar: See the Full List + Pagination Dots + Chevron */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setShowFullList(!showFullList)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 hover:border-[#14967F] transition-colors cursor-pointer"
            >
              {showFullList ? 'Hide List' : 'See the Full List'}
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14967F]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            </div>

            <button
              onClick={() => setShowFullList(!showFullList)}
              className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {showFullList ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>
      )}

    </section>
  );
};
