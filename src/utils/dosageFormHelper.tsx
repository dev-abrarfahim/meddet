import React from 'react';

/**
 * Custom Dosage Form Icon System
 * 
 * Uses high-quality WebP icons from /public/icons/ instead of generic Lucide SVG components.
 * Each dosage form maps to a specific, visually distinctive medical icon.
 */

export interface DosageFormCategoryInfo {
  id: string;
  name: string;
  nameBn: string;
  count: string;
  iconPath: string;
  color: string; // Tailwind bg & text colors for light/dark modes
  badgeColor: string;
  formsMatch: string[]; // Keywords matching forms in database
}

// Base path for static icons served from /public/icons/
const ICON_BASE = '/icons';

export const DOSAGE_FORM_CATEGORIES: DosageFormCategoryInfo[] = [
  {
    id: 'tablet',
    name: 'Tablet',
    nameBn: 'ট্যাবলেট',
    count: '১৪,৯০৭ টি',
    iconPath: `${ICON_BASE}/tablet.webp`,
    color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    formsMatch: ['tablet', 'caplet', 'chewable', 'dispersible', 'mups', 'sublingual']
  },
  {
    id: 'capsule',
    name: 'Capsule',
    nameBn: 'ক্যাপসুল',
    count: '৩,৩১৫ টি',
    iconPath: `${ICON_BASE}/capsule.webp`,
    color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200',
    formsMatch: ['capsule', 'softgel', 'pellet']
  },
  {
    id: 'injection',
    name: 'Injection & IV Infusion',
    nameBn: 'ইনজেকশন ও স্যালাইন',
    count: '৩,১০০+ টি',
    iconPath: `${ICON_BASE}/injection.webp`,
    color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
    formsMatch: ['injection', 'infusion', 'ampoule', 'vial', 'iv']
  },
  {
    id: 'syrup',
    name: 'Syrup',
    nameBn: 'সিরাপ',
    count: '১,৩৫৬ টি',
    iconPath: `${ICON_BASE}/syrup.webp`,
    color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
    formsMatch: ['syrup', 'elixir', 'linctus']
  },
  {
    id: 'suspension',
    name: 'Powder for Suspension / Oral Suspension',
    nameBn: 'সাসপেনশন পাউডার',
    count: '১,৯০০+ টি',
    iconPath: `${ICON_BASE}/powder-for-suspension.webp`,
    color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/80',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200',
    formsMatch: ['suspension', 'powder for suspension', 'dry syrup']
  },
  {
    id: 'cream',
    name: 'Cream, Ointment & Gel',
    nameBn: 'ক্রিম, মলম ও জেল',
    count: '১,১৪২+ টি',
    iconPath: `${ICON_BASE}/ointment.webp`,
    color: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800/80',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-200',
    formsMatch: ['cream', 'ointment', 'gel', 'lotion', 'paste']
  },
  {
    id: 'eyedrops',
    name: 'Eye & Ear Drops',
    nameBn: 'চোখ ও কানের ড্রপ',
    count: '৯৪০+ টি',
    iconPath: `${ICON_BASE}/eye-drop.webp`,
    color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/80',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200',
    formsMatch: ['eye drops', 'ear drops', 'ophthalmic', 'otic']
  },
  {
    id: 'solution',
    name: 'Oral Solution & Paediatric Drops',
    nameBn: 'ড্রপস ও সল্যুশন',
    count: '৬০০+ টি',
    iconPath: `${ICON_BASE}/water.webp`,
    color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/80',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200',
    formsMatch: ['solution', 'paediatric drops', 'oral drops']
  },
  {
    id: 'inhaler',
    name: 'Inhaler & Nasal Spray',
    nameBn: 'ইনহেলার ও নেসাল স্প্রে',
    count: '২৪০+ টি',
    iconPath: `${ICON_BASE}/inhalator.webp`,
    color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
    formsMatch: ['inhaler', 'spray', 'nasal', 'respirator', 'rotacap']
  },
  {
    id: 'suppository',
    name: 'Suppository',
    nameBn: 'সাপোজিটরি',
    count: '৯০ টি',
    iconPath: `${ICON_BASE}/suppositories.webp`,
    color: 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/80',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200',
    formsMatch: ['suppository', 'pessary']
  }
];

/**
 * Extended icon mapping for more specific dosage form types
 * that don't fit in the main 10 categories but deserve unique icons.
 */
const EXTENDED_ICON_MAP: { keywords: string[]; iconPath: string }[] = [
  { keywords: ['ear drop', 'otic'], iconPath: `${ICON_BASE}/ear-dropper.webp` },
  { keywords: ['nasal'], iconPath: `${ICON_BASE}/nasal.webp` },
  { keywords: ['nebuliz', 'nebuliser', 'nebulizer'], iconPath: `${ICON_BASE}/nebulizer.webp` },
  { keywords: ['saline', 'iv infusion', 'infusion'], iconPath: `${ICON_BASE}/saline.webp` },
  { keywords: ['sachet', 'oral powder', 'granule'], iconPath: `${ICON_BASE}/sachet.webp` },
  { keywords: ['shampoo', 'scalp'], iconPath: `${ICON_BASE}/shampoo.webp` },
  { keywords: ['mouthwash', 'mouth wash', 'gargle'], iconPath: `${ICON_BASE}/mouthwash.webp` },
  { keywords: ['dental', 'toothpaste', 'tooth paste', 'dental gel'], iconPath: `${ICON_BASE}/toothpaste.webp` },
  { keywords: ['antiseptic', 'disinfect', 'hand wash', 'sanitiz'], iconPath: `${ICON_BASE}/antiseptic.webp` },
  { keywords: ['irrigat', 'douche', 'enema'], iconPath: `${ICON_BASE}/irrigator.webp` },
  { keywords: ['dialysis', 'hemodia', 'peritoneal'], iconPath: `${ICON_BASE}/kidney-dialysis.webp` },
  { keywords: ['vaginal', 'pessary'], iconPath: `${ICON_BASE}/vaginal-tablet.webp` },
  { keywords: ['respirator', 'rotacap', 'rotahaler'], iconPath: `${ICON_BASE}/respirator.webp` },
  { keywords: ['topical spray', 'aerosol', 'spray solution'], iconPath: `${ICON_BASE}/topical-spray.webp` },
  { keywords: ['body lotion', 'emollient', 'moisturiz'], iconPath: `${ICON_BASE}/body-lotion.webp` },
  { keywords: ['nebul'], iconPath: `${ICON_BASE}/nebulizer.webp` },
];

export interface DosageFormIconResult {
  iconPath: string;
  color: string;
}

/**
 * Returns the icon path and badge color for a given dosage form string.
 * First checks extended specific matches, then falls back to main categories.
 */
export function getDosageFormIconInfo(formString: string): DosageFormIconResult {
  if (!formString) return { iconPath: `${ICON_BASE}/tablet.webp`, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' };

  const lower = formString.toLowerCase();

  // Check extended specific matches first (more specific wins)
  for (const entry of EXTENDED_ICON_MAP) {
    if (entry.keywords.some(keyword => lower.includes(keyword))) {
      // Find matching main category for color, or use a fallback
      const mainCat = DOSAGE_FORM_CATEGORIES.find(cat =>
        cat.formsMatch.some(fm => lower.includes(fm))
      );
      return {
        iconPath: entry.iconPath,
        color: mainCat?.badgeColor || 'bg-slate-100 text-slate-800 dark:bg-slate-900/60 dark:text-slate-200'
      };
    }
  }

  // Check main categories
  for (const cat of DOSAGE_FORM_CATEGORIES) {
    if (cat.formsMatch.some(keyword => lower.includes(keyword))) {
      return { iconPath: cat.iconPath, color: cat.badgeColor };
    }
  }

  // Fallback matches
  if (lower.includes('drop')) return { iconPath: `${ICON_BASE}/eye-drop.webp`, color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200' };
  if (lower.includes('liquid')) return { iconPath: `${ICON_BASE}/water.webp`, color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200' };

  return { iconPath: `${ICON_BASE}/tablet.webp`, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' };
}

/**
 * Reusable DosageFormIcon component that renders an <img> tag
 * with proper sizing and accessibility attributes.
 */
interface DosageFormIconProps {
  formString: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP: Record<string, string> = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

export const DosageFormIcon: React.FC<DosageFormIconProps> = ({
  formString,
  size = 'md',
  className = ''
}) => {
  const { iconPath } = getDosageFormIconInfo(formString);
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <img
      src={iconPath}
      alt={formString || 'Medicine'}
      className={`${sizeClass} object-contain shrink-0 ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
};
