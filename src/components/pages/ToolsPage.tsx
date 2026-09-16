import React, { useState } from 'react';
import {
  Calculator,
  Flame,
  Scale,
  Pill,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Home,
  CheckCircle2
} from 'lucide-react';
import { LanguageMode } from '../../types';

interface ToolsPageProps {
  onNavigate: (path: string) => void;
  lang: LanguageMode;
  onGoHome?: () => void;
}

interface ToolItem {
  id: string;
  titleEn: string;
  titleBn: string;
  status: 'active' | 'coming_soon';
  path: string;
  icon: React.ElementType;
  descriptionEn: string;
  descriptionBn: string;
  standardsEn: string;
  standardsBn: string;
}

const TOOLS: ToolItem[] = [
  {
    id: 'bmi-calculator',
    titleEn: 'Body Mass Index (BMI) Calculator',
    titleBn: 'বডি মাস ইনডেক্স (বিএমআই) ক্যালকুলেটর',
    status: 'active',
    path: '/tools/bmi-calculator',
    icon: Calculator,
    descriptionEn: 'Clinical anthropometric assessment with calibrated radial dial gauge, gender-specific anatomical silhouettes, ideal weight variance, and comprehensive dietary & lifestyle guidance.',
    descriptionBn: 'রেডিয়াল ডায়াল গেজ, পুরুষ ও নারীর শারীরিক গঠন মডেল, আদর্শ ওজনের পরিসীমা ও পুষ্টি পরামর্শসহ সম্পূর্ণ বিএমআই ক্যালকুলেটর।',
    standardsEn: 'WHO & CDC Clinical Standards • Metric & Imperial Parity',
    standardsBn: 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও সিডিসি স্ট্যান্ডার্ড • মেট্রিক ও ইম্পেরিয়াল একক'
  },
  {
    id: 'bmr-tdee',
    titleEn: 'Basal Metabolic Rate (BMR & TDEE)',
    titleBn: 'বেসাল মেটাবলিক রেট (বিএমআর ও টিডিইই)',
    status: 'coming_soon',
    path: '#',
    icon: Flame,
    descriptionEn: 'Compute basal resting energy expenditure and total daily calorie requirements using Mifflin-St Jeor and Katch-McArdle clinical formulas for weight maintenance or calorie deficit.',
    descriptionBn: 'মিফলিন-সেন্ট জিওর ফর্মুলার সাহায্যে দৈনিক ক্যালোরি ব্যয় এবং শক্তি চাহিদা নির্ধারণের ডায়াগনস্টিক টুল।',
    standardsEn: 'Mifflin-St Jeor & Katch-McArdle Clinical Algorithms',
    standardsBn: 'মিফলিন-সেন্ট জিওর ও ক্যাচ-ম্যাকআর্ডল অ্যালগরিদম'
  },
  {
    id: 'ibw-calculator',
    titleEn: 'Ideal Body Weight (IBW) Calculator',
    titleBn: 'আদর্শ শারীরিক ওজন (আইবিডব্লিউ) ক্যালকুলেটর',
    status: 'coming_soon',
    path: '#',
    icon: Scale,
    descriptionEn: 'Synthesize clinical benchmarks using Devine, Robinson, Hamwi, and Miller formulas for pharmacological target weight estimation and dose adjustments.',
    descriptionBn: 'ডিভাইন, রবিনসন ও হ্যামউই ফর্মুলার মাধ্যমে নির্ভুল আদর্শ শারীরিক ওজন ও ফার্মাকোলজিক্যাল ডোজ সমন্বয়।',
    standardsEn: 'Devine & Robinson Pharmacological Benchmarks',
    standardsBn: 'ডিভাইন ও রবিনসন ক্লিনিক্যাল বেঞ্চমার্ক'
  },
  {
    id: 'pediatric-dosage',
    titleEn: 'Pediatric Dosage Calculator',
    titleBn: 'শিশু ওষুধের ডোজ ক্যালকুলেটর',
    status: 'coming_soon',
    path: '#',
    icon: Pill,
    descriptionEn: 'Weight-adjusted mg/kg per day dosage calculator with standard concentration conversion for pediatric suspensions, drops, and liquid medications.',
    descriptionBn: 'ওজন ও বয়স অনুযায়ী শিশু ও নবজাতকদের নিরাপদ ওষুধের মাত্রা এবং সাসপেনশন ড্রপের পরিমাপ হিসাব করার টুল।',
    standardsEn: 'Pediatric Clinical Guidelines (mg/kg/day)',
    standardsBn: 'পেডিয়াট্রিক ক্লিনিক্যাল নির্দেশিকা (mg/kg/day)'
  }
];

export const ToolsPage: React.FC<ToolsPageProps> = ({
  onNavigate,
  lang,
  onGoHome
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'bmi-calculator': false
  });

  const toggleToolInfo = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200 pb-16">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
        <button
          onClick={onGoHome ? onGoHome : () => onNavigate('/')}
          className="flex items-center gap-1 hover:text-[#14967F] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{lang === 'en' ? 'Home' : 'হোম'}</span>
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF]">
          {lang === 'en' ? 'Clinical Tools' : 'ক্লিনিক্যাল টুলস'}
        </span>
      </nav>

      {/* Clean Header */}
      <div className="flex items-center justify-between pt-1 pb-1 border-b border-[#CCECEE] dark:border-[#1E3A52]">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#14967F]" />
            <span>{lang === 'en' ? 'Medical Tools & Calculators' : 'মেডিকেল টুলস ও ক্যালকুলেটর'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            {lang === 'en'
              ? 'Select any tool to open. Click the arrow on the right to view details.'
              : 'যেকোনো টুল চালু করতে ক্লিক করুন। বিস্তারিত তথ্যের জন্য ডানপাশের ড্রপডাউনে ক্লিক করুন।'}
          </p>
        </div>
        <span className="hidden sm:inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E2FCD6] text-[#0D6F5D] dark:bg-[#064E3B] dark:text-[#6EE7B7] border border-[#14967F]/20">
          {lang === 'en' ? 'WHO & CDC Standards' : 'WHO মানদণ্ড'}
        </span>
      </div>

      {/* Tools Clean List Container */}
      <div className="bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 shadow-xs">
        {TOOLS.map((tool) => {
          const isExpanded = Boolean(expandedIds[tool.id]);
          const isActive = tool.status === 'active';
          const Icon = tool.icon;

          return (
            <div key={tool.id} className="transition-colors">
              {/* Tool Row */}
              <div className="w-full flex items-center justify-between gap-1 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                
                {/* Main Link/Button to open tool */}
                <button
                  type="button"
                  onClick={() => {
                    if (isActive) {
                      onNavigate(tool.path);
                    } else {
                      toggleToolInfo(tool.id);
                    }
                  }}
                  className="flex-1 py-3 px-3.5 flex items-center justify-between gap-2 text-left cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`shrink-0 ${isActive ? 'text-[#14967F] dark:text-[#2DD4BF]' : 'text-slate-400 dark:text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors truncate">
                      {lang === 'en' ? tool.titleEn : tool.titleBn}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0 flex items-center gap-1.5 mr-1">
                    {isActive ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E2FCD6] text-[#0D6F5D] dark:bg-[#064E3B] dark:text-[#6EE7B7] border border-[#14967F]/20">
                        {lang === 'en' ? 'Open' : 'চালু করুন'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                        {lang === 'en' ? 'Soon' : 'শীঘ্রই'}
                      </span>
                    )}
                  </div>
                </button>

                {/* Dropdown Information Toggle Button matching requested style */}
                <button
                  type="button"
                  onClick={(e) => toggleToolInfo(tool.id, e)}
                  title={lang === 'en' ? 'View details' : 'বিস্তারিত দেখুন'}
                  aria-label={lang === 'en' ? 'View details' : 'বিস্তারিত দেখুন'}
                  className="mr-2.5 my-2 w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#14967F] dark:text-[#2DD4BF]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>

              </div>

              {/* Expandable Information Drawer */}
              {isExpanded && (
                <div className="py-3 px-4 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5 animate-in fade-in duration-150">
                  <p className="text-slate-600 dark:text-slate-300">
                    {lang === 'en' ? tool.descriptionEn : tool.descriptionBn}
                  </p>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#14967F]" />
                      <span>{lang === 'en' ? tool.standardsEn : tool.standardsBn}</span>
                    </span>

                    {isActive && (
                      <button
                        onClick={() => onNavigate(tool.path)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#14967F] hover:bg-[#0D6F5D] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <span>{lang === 'en' ? 'Open Calculator' : 'ক্যালকুলেটর চালু করুন'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle Clinical Disclaimer */}
      <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 leading-relaxed pt-2">
        {lang === 'en'
          ? 'MEDDET clinical tools are intended for educational and reference purposes only and do not replace professional medical advice.'
          : 'MEDDET-এর ক্লিনিক্যাল টুলস শুধুমাত্র শিক্ষামূলক ও রেফারেন্সের উদ্দেশ্যে তৈরি এবং এটি পেশাদার চিকিৎসকের বিকল্প নয়।'}
      </p>

    </div>
  );
};
