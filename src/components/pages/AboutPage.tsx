import React from 'react';
import { ShieldCheck, Database, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { LanguageMode } from '../../types';

interface AboutPageProps {
  lang: LanguageMode;
  onGoHome: () => void;
  onGoToSearch: (query?: string, category?: string, manufacturer?: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ lang, onGoHome, onGoToSearch }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#14967F]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Clinical Pharmaceutical Intelligence' : 'ক্লিনিক্যাল ড্রাগ ইনডেক্স প্ল্যাটফর্ম'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'About MEDDET™ Clinical Index' : 'MEDDET™ ক্লিনিক্যাল ইনডেক্স সম্পর্কে'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? "Bangladesh's comprehensive clinical medicine index, BDT pharmaceutical price comparator, and bilingual drug monograph reference platform."
              : 'বাংলাদেশের পূর্ণাঙ্গ ক্লিনিক্যাল ড্রাগ ডিরেক্টরি, ওষুধের সঠিক বাজারমূল্য এবং বিকল্প ব্র্যান্ডের তুলনামূলক তথ্যভান্ডার।'}
          </p>
        </div>
      </div>

      {/* Key Database Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#095D7E] dark:text-[#2DD4BF] font-mono">
            30,507
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'Brand Medicines' : 'ব্র্যান্ডের ওষুধ'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#14967F] dark:text-[#6EE7B7] font-mono">
            2,279
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'Generic Ingredients' : 'জেনেরিক উপাদান'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#095D7E] dark:text-[#2DD4BF] font-mono">
            723
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'Manufacturers' : 'প্রস্তুতকারক কোম্পানি'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs text-center space-y-1">
          <div className="text-2xl sm:text-3xl font-black text-[#14967F] dark:text-[#6EE7B7] font-mono">
            156
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'Dosage Forms' : 'ওষুধের ধরন ও রূপ'}
          </div>
        </div>
      </div>

      {/* Mission & Purpose Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#095D7E] dark:text-slate-100">
            {lang === 'en' ? 'Our Clinical Mission' : 'আমাদের লক্ষ্য'}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'MEDDET was created to bridge the information gap in the Bangladeshi healthcare ecosystem. We empower healthcare practitioners, pharmacists, medical students, and everyday patients with unbiased, accurate, and structured pharmaceutical intelligence.'
              : 'MEDDET-এর মূল উদ্দেশ্য বাংলাদেশের স্বাস্থ্যসেবা খাতে সঠিক তথ্যের অবাধ প্রবাহ নিশ্চিত করা। চিকিৎসক, ফার্মাসিস্ট, মেডিকেল শিক্ষার্থী এবং সাধারণ রোগীদের জন্য নিরপেক্ষ, নির্ভরযোগ্য ও সহজে ব্যবহারযোগ্য ডিজিটাল ড্রাগ রেফারেন্স প্ল্যাটফর্ম প্রদান করাই আমাদের লক্ষ্য।'}
          </p>

          <ul className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14967F] shrink-0" />
              <span>{lang === 'en' ? 'Verified BDT Maximum Retail Prices (MRP)' : 'অনুমোদিত সর্বোচ্চ খুচরা মূল্যের (MRP) সঠিক হিসেব'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14967F] shrink-0" />
              <span>{lang === 'en' ? 'Lower-cost generic brand alternatives detection' : 'একই উপাদানের সাশ্রয়ী বিকল্প ওষুধ নির্বাচন'}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#14967F] shrink-0" />
              <span>{lang === 'en' ? 'Bilingual clinical monographs (English & বাংলা)' : 'ইংরেজি ও বাংলায় বিস্তারিত ড্রাগ মনোগ্রাফ'}</span>
            </li>
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#6EE7B7] flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#095D7E] dark:text-slate-100">
            {lang === 'en' ? 'Data Integrity & Architecture' : 'তথ্যের নির্ভরযোগ্যতা ও প্রযুক্তি'}
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'Our database is continuously synchronized and categorized across dosage strengths, presentations, commercial pack packaging, and indications. Built with edge-native infrastructure to guarantee sub-second search responses.'
              : 'আমাদের ডেটাবেজ নিয়মিতভাবে নতুন অনুমোদিত ওষুধ, বাজারমূল্য ও প্যাক সাইজের সাথে আপডেট করা হয়। ক্লাউডফ্লেয়ার এজ নেটওয়ার্ক এবং আধুনিক ফ্রন্টএন্ড আর্কিটেকচারের মাধ্যমে দ্রুতগতির ও নির্ভরযোগ্য অভিজ্ঞতা প্রদান করা হয়।'}
          </p>

          <div className="pt-2">
            <button
              onClick={() => onGoToSearch()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white font-bold text-xs hover:bg-[#074760] transition-colors cursor-pointer shadow-xs"
            >
              <span>{lang === 'en' ? 'Explore 30,500+ Medicines' : 'ওষুধের ইনডেক্স দেখুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
