import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Building2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Medicine } from '../../types';
import { getAlternativeBrands } from '../../data/dbEngine';
import { slugify } from '../../utils/slugify';

interface AlternativeBrandsProps {
  medicine: Medicine;
  onSelectMedicine: (med: Medicine) => void;
}

export const AlternativeBrands: React.FC<AlternativeBrandsProps> = ({
  medicine,
  onSelectMedicine
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Fetch alternatives with matching generic, dosage form, and strength
  const rawAlternatives = getAlternativeBrands(medicine.genericId, medicine.id, medicine.form);

  // Sort by lowest price first
  const alternatives = [...rawAlternatives].sort((a, b) => {
    const pA = a.mrp > 0 ? a.mrp : 999;
    const pB = b.mrp > 0 ? b.mrp : 999;
    return pA - pB;
  });

  // Automatic smooth transition every 4.5 seconds
  useEffect(() => {
    if (alternatives.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alternatives.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [alternatives.length, isPaused]);

  if (alternatives.length === 0) {
    return null;
  }

  const currentAlt = alternatives[currentIndex] || alternatives[0];

  // Pricing calculations
  const currentPrice = Number(medicine.mrp) > 0 ? Number(medicine.mrp) : 0;
  const altPrice = Number(currentAlt.mrp) > 0 ? Number(currentAlt.mrp) : 0;
  const hasValidComparison = currentPrice > 0 && altPrice > 0;
  const savings = hasValidComparison && currentPrice > altPrice ? currentPrice - altPrice : 0;
  const percentCheaper = hasValidComparison && savings > 0 ? Math.round((savings / currentPrice) * 100) : 0;

  const altSlug = slugify(`${currentAlt.name}-${currentAlt.strength || ''}-${currentAlt.form}`);
  const altHref = `/?id=${currentAlt.id}&brand=${altSlug}`;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    setCurrentIndex((prev) => (prev - 1 + alternatives.length) % alternatives.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused(true);
    setCurrentIndex((prev) => (prev + 1) % alternatives.length);
  };

  return (
    <section
      id="sec-alternatives"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs space-y-3 transition-colors relative"
    >
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-[#14967F] dark:text-[#2DD4BF] shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
              Alternative Brand
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
              Lowest-cost equivalent
            </p>
          </div>
        </div>

        {/* Top Right Controls & Page Counter */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-mono">
            {currentIndex + 1} of {alternatives.length}
          </span>

          {/* Top Up Arrow (Previous) */}
          <button
            onClick={handlePrev}
            id="alt-brand-prev-btn"
            title="Previous Alternative (↑)"
            aria-label="Previous Alternative"
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:border-[#14967F] transition-colors cursor-pointer"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Single Alternative Brand Card (Smooth Fade & Slide Transition) */}
      <div className="relative overflow-hidden min-h-[115px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAlt.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full"
          >
            <a
              href={altHref}
              onClick={(e) => {
                e.preventDefault();
                onSelectMedicine(currentAlt);
              }}
              className="w-full bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-[#14967F] transition-all cursor-pointer shadow-xs flex items-center justify-between gap-3 group"
            >
              {/* Left Column: Brand Name, Generic, Manufacturer */}
              <div className="space-y-1 min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors truncate">
                  {currentAlt.name} {currentAlt.strength} {currentAlt.form}
                </h3>
                
                <div className="text-xs font-extrabold text-[#14967F] dark:text-[#2DD4BF] truncate">
                  {medicine.genericName}
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-0.5 truncate">
                  <img src="/icons/pharmaceutical.webp" alt="Company" className="w-3.5 h-3.5 object-contain shrink-0" loading="lazy" />
                  <span className="truncate">{currentAlt.company}</span>
                </div>
              </div>

              {/* Right Column: Prominent Savings & Pricing Display */}
              <div className="text-right shrink-0 space-y-1 bg-white dark:bg-[#131B2E] p-2 rounded-lg border border-slate-200 dark:border-slate-800/80">
                {/* Savings Badge */}
                {percentCheaper > 0 && (
                  <div className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    <span>{percentCheaper}% cheaper</span>
                  </div>
                )}

                {/* Unit Price */}
                <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 font-mono">
                  {altPrice > 0 ? `৳ ${altPrice.toFixed(2)}` : 'MRP N/A'}
                </div>

                {/* Market Price Comparison */}
                {currentPrice > 0 && currentPrice !== altPrice && (
                  <div className="text-[10px] font-bold text-slate-400 line-through font-mono">
                    ৳ {currentPrice.toFixed(2)}
                  </div>
                )}

                {/* Saved Amount */}
                {savings > 0 && (
                  <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    Save ৳ {savings.toFixed(2)}
                  </div>
                )}
              </div>
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Bottom Navigation Control Bar (Wide Rounded Container with Centered Down Arrow ↓) */}
      <div className="pt-0.5 flex flex-col items-center gap-1">
        <button
          onClick={handleNext}
          id="alt-brand-next-btn"
          title="Next Alternative (↓)"
          aria-label="Next Alternative"
          className="w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 hover:border-[#14967F] transition-all flex items-center justify-center text-slate-700 dark:text-slate-300 cursor-pointer shadow-xs group"
        >
          <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-[#14967F] dark:text-[#2DD4BF]" />
        </button>

        {/* Small Pagination Indicator Dots */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {alternatives.slice(0, 8).map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused(true);
                setCurrentIndex(idx);
              }}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? 'w-4 bg-[#14967F] dark:bg-[#2DD4BF]'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
