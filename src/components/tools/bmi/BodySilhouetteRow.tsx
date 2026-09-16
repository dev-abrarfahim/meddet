import React, { useRef, useEffect, useState } from 'react';
import { BmiCategoryKey, Gender } from '../../../types/bmi';
import { LanguageMode } from '../../../types';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface BodySilhouetteRowProps {
  currentCategory?: BmiCategoryKey | null;
  gender: Gender;
  currentBmi?: number | null;
  onSelectCategory?: (cat: BmiCategoryKey) => void;
  lang?: LanguageMode;
}

interface SilhouetteCardData {
  key: BmiCategoryKey;
  label: string;
  labelBn: string;
  range: string;
  rangeBn: string;
  maleImg: string;
  maleWebp: string;
  femaleImg: string;
  femaleWebp: string;
}

const CARDS: SilhouetteCardData[] = [
  {
    key: 'underweight',
    label: 'Underweight',
    labelBn: 'কম ওজন',
    range: '< 18.5',
    rangeBn: '< ১৮.৫',
    maleImg: '/male-underweight.png',
    maleWebp: '/male-underweight.webp',
    femaleImg: '/female-underweight.png',
    femaleWebp: '/female-underweight.webp',
  },
  {
    key: 'normal',
    label: 'Normal',
    labelBn: 'স্বাভাবিক',
    range: '18.5 - 24.9',
    rangeBn: '১৮.৫ - ২৪.৯',
    maleImg: '/male-normal.png',
    maleWebp: '/male-normal.webp',
    femaleImg: '/female-normal.png',
    femaleWebp: '/female-normal.webp',
  },
  {
    key: 'overweight',
    label: 'Overweight',
    labelBn: 'অতিরিক্ত ওজন',
    range: '25.0 - 29.9',
    rangeBn: '২৫.০ - ২৯.৯',
    maleImg: '/male-overweight.png',
    maleWebp: '/male-overweight.webp',
    femaleImg: '/female-overweight.png',
    femaleWebp: '/female-overweight.webp',
  },
  {
    key: 'obese',
    label: 'Obesity',
    labelBn: 'স্থূলতা',
    range: '30.0 - 39.9',
    rangeBn: '৩০.০ - ৩৯.৯',
    maleImg: '/male-obese.png',
    maleWebp: '/male-obese.webp',
    femaleImg: '/female-obese.png',
    femaleWebp: '/female-obese.webp',
  },
  {
    key: 'extremely_obese',
    label: 'Morbid Obesity',
    labelBn: 'মারাত্মক স্থূলতা',
    range: '≥ 40',
    rangeBn: '≥ ৪০',
    maleImg: '/male-extremely-obese.png',
    maleWebp: '/male-extremely-obese.webp',
    femaleImg: '/female-extremely-obese.png',
    femaleWebp: '/female-extremely-obese.webp',
  },
];

export const BodySilhouetteRow: React.FC<BodySilhouetteRowProps> = ({
  currentCategory,
  gender,
  currentBmi,
  onSelectCategory,
  lang = 'en',
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isInView, setIsInView] = useState(false);

  // Check scroll bounds to enable/disable arrow buttons
  const checkScrollBounds = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 6);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
    }
  };

  // Scroll to a specific category card and center it in the slider
  const scrollToCard = (key: BmiCategoryKey) => {
    const cardEl = document.getElementById(`card-silhouette-${key}`);
    if (cardEl && scrollRef.current) {
      const container = scrollRef.current;
      const elLeft = cardEl.offsetLeft;
      const elWidth = cardEl.offsetWidth;
      const containerWidth = container.offsetWidth;

      container.scrollTo({
        left: elLeft - (containerWidth - elWidth) / 2,
        behavior: 'smooth',
      });
      setTimeout(checkScrollBounds, 350);
    }
  };

  // Scroll trigger: when user scrolls through the page and reaches this section, trigger select animation
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (currentCategory) {
              scrollToCard(currentCategory);
            }
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [currentCategory]);

  // Auto-scroll to center the active category card whenever category or gender changes
  useEffect(() => {
    if (currentCategory) {
      scrollToCard(currentCategory);
    }
  }, [currentCategory, gender]);

  // Check bounds on window resize
  useEffect(() => {
    const handleResize = () => checkScrollBounds();
    window.addEventListener('resize', handleResize);
    checkScrollBounds();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle arrow button sliding
  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardEl = scrollRef.current.querySelector<HTMLElement>('[data-silhouette-card]');
      const step = cardEl ? cardEl.offsetWidth + 12 : 180;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -step : step,
        behavior: 'smooth',
      });
      setTimeout(checkScrollBounds, 350);
    }
  };

  return (
    <div
      ref={rowRef}
      className="w-full bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-4 sm:p-5 shadow-xs text-slate-800 dark:text-slate-100"
    >
      {/* Section Header with Slider Navigation */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-bold text-[#095D7E] dark:text-slate-100 tracking-tight flex items-center gap-1.5 font-['Poppins',sans-serif]">
            {lang === 'en' ? 'BMI Body Morphology' : 'শারীরিক গঠন মডেল'}
          </h2>
          <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5">
            {gender === 'male'
              ? (lang === 'en' ? 'Custom Male ♂ Anatomical Models' : 'পুরুষ ♂ অ্যানাটমিক্যাল গঠন মডেল')
              : (lang === 'en' ? 'Custom Female ♀ Anatomical Models' : 'নারী ♀ অ্যানাটমিক্যাল গঠন মডেল')}{' '}
            &bull; {lang === 'en' ? 'Slide to explore' : 'স্লাইড করে দেখুন'}
          </p>
        </div>

        {/* Carousel Prev/Next Buttons (Accessible on all screens) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label={lang === 'en' ? 'Previous body type' : 'পূর্ববর্তী বডি টাইপ'}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md border border-[#CCECEE] dark:border-[#243B53] bg-[#F1F9FF] dark:bg-[#1E293B] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#CCECEE]/60 dark:hover:bg-[#334155] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label={lang === 'en' ? 'Next body type' : 'পরবর্তী বডি টাইপ'}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md border border-[#CCECEE] dark:border-[#243B53] bg-[#F1F9FF] dark:bg-[#1E293B] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#CCECEE]/60 dark:hover:bg-[#334155] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-2xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Silhouette Cards Slider (Max 3-4 visible on desktop, 1-2 on mobile) */}
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={checkScrollBounds}
          className="flex gap-3 overflow-x-auto pb-3 pt-2 px-1 scroll-smooth snap-x snap-mandatory select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CARDS.map((card) => {
            const isSelected = currentCategory === card.key;
            const imageSrc = gender === 'male' ? card.maleImg : card.femaleImg;
            const webpSrc = gender === 'male' ? card.maleWebp : card.femaleWebp;
            const cardTitle = lang === 'en' ? card.label : card.labelBn;
            const cardRange = lang === 'en' ? `BMI ${card.range}` : `বিএমআই ${card.rangeBn}`;

            // Highlight styling for the active card with rich border shadow and halo
            let borderClass = 'border-[#CCECEE] dark:border-slate-800 hover:border-[#14967F]/50 dark:hover:border-[#2DD4BF]/50 bg-[#F1F9FF]/40 dark:bg-[#1E293B]/40 hover:shadow-xs';
            if (isSelected) {
              if (card.key === 'normal') {
                borderClass = 'border-2 border-[#14967F] dark:border-[#2DD4BF] ring-2 ring-[#14967F]/25 dark:ring-[#2DD4BF]/30 bg-[#E2FCD6]/30 dark:bg-[#064E3B]/30 shadow-md shadow-[#14967F]/30 dark:shadow-[#14967F]/40';
              } else if (card.key === 'underweight') {
                borderClass = 'border-2 border-[#00A8E8] dark:border-[#38BDF8] ring-2 ring-[#00A8E8]/25 dark:ring-[#38BDF8]/30 bg-[#F0F9FF] dark:bg-[#0284C7]/20 shadow-md shadow-[#00A8E8]/30 dark:shadow-[#00A8E8]/40';
              } else if (card.key === 'overweight') {
                borderClass = 'border-2 border-[#FB8C00] dark:border-[#FBBF24] ring-2 ring-[#FB8C00]/25 dark:ring-[#FBBF24]/30 bg-[#FFFBEB] dark:bg-[#F59E0B]/20 shadow-md shadow-[#FB8C00]/30 dark:shadow-[#FB8C00]/40';
              } else if (card.key === 'obese') {
                borderClass = 'border-2 border-[#F4511E] dark:border-[#FB923C] ring-2 ring-[#F4511E]/25 dark:ring-[#FB923C]/30 bg-[#FFF7ED] dark:bg-[#EA580C]/20 shadow-md shadow-[#F4511E]/30 dark:shadow-[#F4511E]/40';
              } else {
                borderClass = 'border-2 border-[#D32F2F] dark:border-[#F87171] ring-2 ring-[#D32F2F]/25 dark:ring-[#F87171]/30 bg-[#FEF2F2] dark:bg-[#DC2626]/20 shadow-md shadow-[#D32F2F]/30 dark:shadow-[#D32F2F]/40';
              }
            }

            return (
              <div
                key={card.key}
                id={`card-silhouette-${card.key}`}
                data-silhouette-card
                onClick={() => {
                  onSelectCategory?.(card.key);
                  scrollToCard(card.key);
                }}
                className={`w-[102px] sm:w-[108px] flex-shrink-0 snap-center rounded-lg border p-1.5 sm:p-2 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 relative ${borderClass} ${
                  isSelected && isInView ? 'animate-select-pop' : ''
                }`}
              >
                {/* Active Indicator Tick Mark in Upper Right Corner */}
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 bg-[#14967F] dark:bg-[#2DD4BF] text-white dark:text-slate-950 w-5 h-5 rounded-full shadow-md border-2 border-white dark:border-[#152232] flex items-center justify-center z-10 animate-tick-bounce">
                    <Check className="w-3 h-3 text-white dark:text-slate-950 stroke-[3]" />
                  </div>
                )}

                {/* Character Silhouette Image with Modern WebP & Dimensions */}
                <div className="w-full flex items-center justify-center py-1 flex-1">
                  <picture>
                    <source srcSet={webpSrc} type="image/webp" />
                    <img
                      src={imageSrc}
                      alt={`${cardTitle} body morphology silhouette - ${cardRange}`}
                      loading="lazy"
                      decoding="async"
                      width="86"
                      height="240"
                      className="w-[86px] h-[240px] object-contain select-none drop-shadow-xs"
                      draggable={false}
                    />
                  </picture>
                </div>

                {/* Card Label & BMI Range */}
                <div className="w-full text-center pt-1.5 border-t border-[#CCECEE]/60 dark:border-slate-800/60 mt-1">
                  <span
                    className={`text-[11px] font-bold block truncate leading-tight ${
                      isSelected ? 'text-[#095D7E] dark:text-[#2DD4BF]' : 'text-[#334155] dark:text-slate-300'
                    }`}
                  >
                    {cardTitle}
                  </span>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400 block font-medium leading-tight">
                    {cardRange}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Slider Pagination Dots (Visible on all screen sizes) */}
        <div className="flex items-center justify-center gap-1.5 pt-1 pb-1">
          {CARDS.map((c) => {
            const isSelected = currentCategory === c.key;
            return (
              <button
                key={'dot-' + c.key}
                type="button"
                aria-label={`Jump to ${c.label}`}
                onClick={() => {
                  onSelectCategory?.(c.key);
                  scrollToCard(c.key);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  isSelected
                    ? 'w-6 bg-[#14967F]'
                    : 'w-1.5 bg-[#CCECEE] hover:bg-[#095D7E]/40'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Linear Track Slider Bar with Pointer */}
      <div className="mt-2 pt-3 border-t border-[#CCECEE]">
        <div className="flex items-center justify-between text-[10px] text-[#64748B] font-semibold mb-1">
          <span>&lt;18.5</span>
          <span className="text-[#14967F]">18.5-24.9</span>
          <span>25-29.9</span>
          <span>30-39.9</span>
          <span>≥40</span>
        </div>

        {/* 5-zone Track */}
        <div className="relative w-full h-2.5 rounded overflow-hidden flex bg-[#CCECEE]">
          <div className="h-full w-[22%] bg-[#00A8E8] border-r border-white/60" title="Underweight < 18.5" />
          <div className="h-full w-[28%] bg-[#689F38] border-r border-white/60" title="Normal 18.5 - 24.9" />
          <div className="h-full w-[22%] bg-[#FB8C00] border-r border-white/60" title="Overweight 25 - 29.9" />
          <div className="h-full w-[16%] bg-[#F4511E] border-r border-white/60" title="Obesity 30 - 39.9" />
          <div className="h-full w-[12%] bg-[#D32F2F]" title="Morbid Obesity ≥ 40" />
        </div>

        {/* Marker indicator position calculation */}
        {(() => {
          if (currentBmi == null) return null;
          let pos = 50;
          if (currentBmi <= 15) pos = 2;
          else if (currentBmi < 18.5) {
            pos = 2 + ((currentBmi - 15) / (18.5 - 15)) * 20;
          } else if (currentBmi < 25) {
            pos = 22 + ((currentBmi - 18.5) / (25 - 18.5)) * 28;
          } else if (currentBmi < 30) {
            pos = 50 + ((currentBmi - 25) / (30 - 25)) * 22;
          } else if (currentBmi < 40) {
            pos = 72 + ((currentBmi - 30) / (40 - 30)) * 16;
          } else {
            pos = Math.min(98, 88 + ((currentBmi - 40) / 10) * 10);
          }

          return (
            <div className="relative w-full h-4 mt-0.5">
              <div
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
                style={{ left: `${pos}%` }}
              >
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[5px] border-b-[#095D7E]" />
                <span className="text-[10px] font-bold text-[#095D7E] leading-none">
                  {currentBmi.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
