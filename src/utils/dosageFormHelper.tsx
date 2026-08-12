import React from 'react';
import {
  Pill,
  Syringe,
  Droplets,
  Droplet,
  Eye,
  Wind,
  FlaskConical,
  Beaker,
  Baby,
  HeartPulse,
  Sparkles,
  Package,
  Activity,
  LucideIcon
} from 'lucide-react';

export interface DosageFormCategoryInfo {
  id: string;
  name: string;
  nameBn: string;
  count: string;
  icon: LucideIcon;
  color: string; // Tailwind bg & text colors for light/dark modes
  badgeColor: string;
  formsMatch: string[]; // Keywords matching forms in database
}

export const DOSAGE_FORM_CATEGORIES: DosageFormCategoryInfo[] = [
  {
    id: 'tablet',
    name: 'Tablet',
    nameBn: 'ট্যাবলেট',
    count: '১৪,৯০৭ টি',
    icon: Pill,
    color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200',
    formsMatch: ['tablet', 'caplet', 'chewable']
  },
  {
    id: 'capsule',
    name: 'Capsule',
    nameBn: 'ক্যাপসুল',
    count: '৩,৩১৫ টি',
    icon: Package,
    color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/80',
    badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200',
    formsMatch: ['capsule', 'softgel', 'pellet']
  },
  {
    id: 'injection',
    name: 'Injection & IV Infusion',
    nameBn: 'ইনজেকশন ও স্যালাইন',
    count: '৩,১০০+ টি',
    icon: Syringe,
    color: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200',
    formsMatch: ['injection', 'infusion', 'ampoule', 'vial', 'iv']
  },
  {
    id: 'syrup',
    name: 'Syrup',
    nameBn: 'সিরাপ',
    count: '১,৩৫৬ টি',
    icon: FlaskConical,
    color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200',
    formsMatch: ['syrup', 'elixir', 'linctus']
  },
  {
    id: 'suspension',
    name: 'Powder for Suspension / Oral Suspension',
    nameBn: 'সাসপেনশন পাউডার',
    count: '১,৯০০+ টি',
    icon: Beaker,
    color: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/80',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200',
    formsMatch: ['suspension', 'powder for suspension', 'dry syrup']
  },
  {
    id: 'cream',
    name: 'Cream, Ointment & Gel',
    nameBn: 'ক্রিম, মলম ও জেল',
    count: '১,১৪২+ টি',
    icon: Sparkles,
    color: 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800/80',
    badgeColor: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-200',
    formsMatch: ['cream', 'ointment', 'gel', 'lotion', 'paste']
  },
  {
    id: 'eyedrops',
    name: 'Eye & Ear Drops',
    nameBn: 'চোখ ও কানের ড্রপ',
    count: '৯৪০+ টি',
    icon: Eye,
    color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800/80',
    badgeColor: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200',
    formsMatch: ['eye drops', 'ear drops', 'ophthalmic', 'otic']
  },
  {
    id: 'solution',
    name: 'Oral Solution & Paediatric Drops',
    nameBn: 'ড্রপস ও সল্যুশন',
    count: '৬০০+ টি',
    icon: Baby,
    color: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800/80',
    badgeColor: 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200',
    formsMatch: ['solution', 'paediatric drops', 'oral drops']
  },
  {
    id: 'inhaler',
    name: 'Inhaler & Nasal Spray',
    nameBn: 'ইনহেলার ও নেসাল স্প্রে',
    count: '২৪০+ টি',
    icon: Wind,
    color: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/80',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200',
    formsMatch: ['inhaler', 'spray', 'nasal', 'respirator', 'rotacap']
  },
  {
    id: 'suppository',
    name: 'Suppository',
    nameBn: 'সাপোজিটরি',
    count: '৯০ টি',
    icon: HeartPulse,
    color: 'bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/80',
    badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/60 dark:text-orange-200',
    formsMatch: ['suppository', 'pessary']
  }
];

/**
 * Returns specific dosage form icon & styling info based on form text
 */
export function getDosageFormIconInfo(formString: string): { icon: LucideIcon; color: string } {
  if (!formString) return { icon: Pill, color: 'text-emerald-600 dark:text-emerald-400' };

  const lower = formString.toLowerCase();

  for (const cat of DOSAGE_FORM_CATEGORIES) {
    if (cat.formsMatch.some(keyword => lower.includes(keyword))) {
      return { icon: cat.icon, color: cat.badgeColor };
    }
  }

  if (lower.includes('drop')) return { icon: Droplet, color: 'text-sky-600' };
  if (lower.includes('liquid')) return { icon: Droplets, color: 'text-teal-600' };
  
  return { icon: Pill, color: 'text-emerald-600 dark:text-emerald-400' };
}
