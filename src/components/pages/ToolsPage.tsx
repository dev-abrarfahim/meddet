import React from 'react';
import {
  Calculator,
  Activity,
  Flame,
  Scale,
  Pill,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Home
} from 'lucide-react';
import { LanguageMode } from '../../types';

interface ToolsPageProps {
  onNavigate: (path: string) => void;
  lang: LanguageMode;
  onGoHome?: () => void;
}

export const ToolsPage: React.FC<ToolsPageProps> = ({
  onNavigate,
  lang,
  onGoHome
}) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 pb-12">
      
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

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#095D7E] via-[#0D6F5D] to-[#14967F] text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-black tracking-wide text-[#E2FCD6]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Evidence-Based Healthcare Suite' : 'প্রমাণভিত্তিক স্বাস্থ্য সেবা টুলস'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Clinical Tools & Health Calculators' : 'ক্লিনিক্যাল টুলস ও স্বাস্থ্য ক্যালকুলেটর'}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed font-medium">
            {lang === 'en'
              ? 'Accurate, validated diagnostic calculators and anthropometric computing tools compliant with World Health Organization (WHO) and CDC standards.'
              : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) ও সিডিসি স্ট্যান্ডার্ড অনুযায়ী তৈরি নির্ভুল ক্লিনিক্যাল ক্যালকুলেটর এবং শারীরিক পরিমাপক টুলস।'}
          </p>
        </div>
      </div>

      {/* Tools Directory Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#14967F]" />
            <span>{lang === 'en' ? 'Available Medical Tools' : 'উপলব্ধ মেডিকেল টুলস'}</span>
          </h2>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {lang === 'en' ? '1 Active • 3 In Development' : '১টি সক্রিয় • ৩টি প্রক্রিয়াধীন'}
          </span>
        </div>

        {/* Tools Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          
          {/* 1. BMI CALCULATOR (ACTIVE TOOL) */}
          <div className="relative bg-white dark:bg-[#152232] rounded-2xl border-2 border-[#14967F]/40 dark:border-[#14967F]/50 p-5 sm:p-6 shadow-md hover:shadow-xl transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              {/* Badge & Icon Header */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] flex items-center justify-center border border-[#14967F]/30 shadow-xs group-hover:scale-105 transition-transform">
                  <Calculator className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#E2FCD6] text-[#0D6F5D] dark:bg-[#064E3B] dark:text-[#6EE7B7] border border-[#14967F]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#14967F] animate-pulse" />
                  {lang === 'en' ? 'Active • WHO Standards' : 'সক্রিয় • WHO মান'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-black text-[#095D7E] dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors">
                  {lang === 'en' ? 'Body Mass Index (BMI) Calculator' : 'বডি মাস ইনডেক্স (বিএমআই) ক্যালকুলেটর'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {lang === 'en'
                    ? 'Clinical anthropometric assessment with calibrated radial dial gauge, gender-specific anatomical silhouettes, ideal weight variance, and comprehensive dietary guidance.'
                    : 'রেডিয়াল ডায়াল গেজ, পুরুষ ও নারীর শারীরিক গঠন মডেল, আদর্শ ওজনের পরিসীমা ও পুষ্টি পরামর্শসহ সম্পূর্ণ বিএমআই ক্যালকুলেটর।'}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
                  <span>{lang === 'en' ? 'Metric (cm/kg) & Imperial (ft/lbs) parity' : 'মেট্রিক ও ইম্পেরিয়াল উভয় একক সমর্থন'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
                  <span>{lang === 'en' ? 'WHO & CDC 5-tier clinical classifications' : 'WHO ও সিডিসি অনুমোদিত ৫টি স্তরে শ্রেণীবিন্যাস'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
                  <span>{lang === 'en' ? 'Diet, resistance exercise & physician advice' : 'ডায়েট, ব্যায়াম ও চিকিৎসকের দিকনির্দেশনা'}</span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-5 mt-4">
              <button
                onClick={() => onNavigate('/tools/bmi-calculator')}
                id="launch-bmi-calculator-btn"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#14967F] hover:bg-[#0D6F5D] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer group-hover:bg-[#0D6F5D]"
              >
                <span>{lang === 'en' ? 'Open BMI Calculator' : 'বিএমআই ক্যালকুলেটর চালু করুন'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 2. BMR & TDEE CALCULATOR (COMING SOON) */}
          <div className="relative bg-white/70 dark:bg-[#152232]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between opacity-85">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200 dark:border-orange-800 shadow-xs">
                  <Flame className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {lang === 'en' ? 'In Development' : 'শীঘ্রই আসছে'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'en' ? 'Basal Metabolic Rate (BMR & TDEE)' : 'বেসাল মেটাবলিক রেট (বিএমআর ও টিডিইই)'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang === 'en'
                    ? 'Compute basal resting energy expenditure and total daily calorie requirements using Mifflin-St Jeor and Katch-McArdle clinical formulas.'
                    : 'মিফলিন-সেন্ট জিওর ফর্মুলার সাহায্যে দৈনিক ক্যালোরি ব্যয় এবং শক্তি চাহিদা নির্ধারণের টুল।'}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>• Mifflin-St Jeor & Harris-Benedict algorithms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>• Activity multiplier for deficit & maintenance</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4">
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-not-allowed text-center"
              >
                {lang === 'en' ? 'Coming Soon' : 'শীঘ্রই যুক্ত হবে'}
              </button>
            </div>
          </div>

          {/* 3. IDEAL BODY WEIGHT (IBW) (COMING SOON) */}
          <div className="relative bg-white/70 dark:bg-[#152232]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between opacity-85">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-xs">
                  <Scale className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {lang === 'en' ? 'In Development' : 'শীঘ্রই আসছে'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'en' ? 'Ideal Body Weight (IBW) Calculator' : 'আদর্শ শারীরিক ওজন (আইবিডব্লিউ) ক্যালকুলেটর'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang === 'en'
                    ? 'Synthesize clinical benchmarks using Devine, Robinson, Hamwi, and Miller formulas for pharmacological target weight estimation.'
                    : 'ডিভাইন, রবিনসন ও হ্যামউই ফর্মুলার মাধ্যমে নির্ভুল আদর্শ শারীরিক ওজন তুলনা করুন।'}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>• Devine formula for clinical pharmacological dosing</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>• Adjusted Body Weight (ABW) computations</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4">
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-not-allowed text-center"
              >
                {lang === 'en' ? 'Coming Soon' : 'শীঘ্রই যুক্ত হবে'}
              </button>
            </div>
          </div>

          {/* 4. PEDIATRIC DOSAGE CALCULATOR (COMING SOON) */}
          <div className="relative bg-white/70 dark:bg-[#152232]/70 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between opacity-85">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800 shadow-xs">
                  <Pill className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {lang === 'en' ? 'In Development' : 'শীঘ্রই আসছে'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">
                  {lang === 'en' ? 'Pediatric Dosage Calculator' : 'শিশু ওষুধের ডোজ ক্যালকুলেটর'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {lang === 'en'
                    ? 'Weight-adjusted mg/kg per day dosage calculator with standard concentration conversion for liquid suspensions and drops.'
                    : 'ওজন ও বয়স অনুযায়ী শিশু ও নবজাতকদের নিরাপদ ওষুধের মাত্রা হিসাব করার টুল।'}
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span>• Weight-based (mg/kg/day) calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>• Suspension concentration to mL converter</span>
                </div>
              </div>
            </div>

            <div className="pt-5 mt-4">
              <button
                disabled
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold text-xs cursor-not-allowed text-center"
              >
                {lang === 'en' ? 'Coming Soon' : 'শীঘ্রই যুক্ত হবে'}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Clinical Disclaimer Notice */}
      <div className="bg-[#F1F9FF] dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-4 sm:p-5 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#14967F] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-bold text-[#095D7E] dark:text-slate-200 block">
            {lang === 'en' ? 'Clinical Reference & Diagnostic Use' : 'ক্লিনিক্যাল রেফারেন্স ও ডায়াগনস্টিক তথ্য'}
          </span>
          <p>
            {lang === 'en'
              ? 'MEDDET clinical tools are intended for educational and reference purposes only. They should never substitute for professional clinical judgment, diagnosis, or personalized medical counsel.'
              : 'MEDDET-এর ক্লিনিক্যাল টুলস শুধুমাত্র শিক্ষামূলক ও রেফারেন্সের উদ্দেশ্যে তৈরি। কোনো অবস্থাতেই এটি পেশাদার চিকিৎসকের পরামর্শ বা রোগ নির্ণয়ের বিকল্প নয়।'}
          </p>
        </div>
      </div>

    </div>
  );
};
