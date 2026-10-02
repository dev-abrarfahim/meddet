import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { LanguageMode } from '../../types';

interface TermsPageProps {
  lang: LanguageMode;
}

export const TermsPage: React.FC<TermsPageProps> = ({ lang }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <FileText className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Clinical Reference Terms' : 'ব্যবহার নির্দেশিকা ও শর্তাবলী'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Terms & Medical Disclaimer' : 'ব্যবহারের শর্তাবলী ও ডিসক্লেইমার'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? 'Please review the guidelines, educational purpose limitations, and medical reference disclaimer governing MEDDET.'
              : 'MEDDET প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী ও জরুরি মেডিকেল ডিসক্লেইমার।'}
          </p>
        </div>
      </div>

      {/* Critical Medical Disclaimer Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-200 dark:border-rose-900/60 shadow-xs space-y-3">
        <div className="flex items-center gap-3 text-rose-800 dark:text-rose-300 font-black text-base sm:text-lg">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
          <span>{lang === 'en' ? 'CRITICAL MEDICAL DISCLAIMER' : 'জরুরি চিকিৎসা সংক্রান্ত সতর্কবার্তা'}</span>
        </div>

        <p className="text-sm text-rose-900/90 dark:text-rose-200/90 leading-relaxed font-medium">
          {lang === 'en'
            ? 'MEDDET is an independent clinical reference and pharmaceutical educational tool. The content published on this website (including dosage guidelines, drug indications, pharmacology monographs, and pricing comparisons) is provided strictly for educational and informational purposes. It DOES NOT constitute formal medical advice, clinical diagnosis, or treatment recommendations.'
            : 'MEDDET শুধুমাত্র একটি শিক্ষামূলক ও তথ্যভিত্তিক ক্লিনিক্যাল রেফারেন্স গাইড। এখানে প্রকাশিত কোনো তথ্য চিকিৎসকের প্রেসক্রিপশন বা চিকিৎসার বিকল্প নয়। যেকোনো ওষুধ সেবন, বন্ধ বা পরিবর্তন করার পূর্বে অবশ্যই রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।'}
        </p>

        <p className="text-xs text-rose-800/80 dark:text-rose-300/80 font-bold">
          {lang === 'en'
            ? '⚠️ Always consult a certified physician (MBBS/BDS) or registered pharmacist before taking any prescription medication.'
            : '⚠️ যেকোনো প্রেসক্রিপশন ওষুধ গ্রহণের পূর্বে সর্বদা একজন সনদপ্রাপ্ত চিকিৎসকের পরামর্শ গ্রহণ করুন।'}
        </p>
      </div>

      {/* Main Terms Sections */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-8 text-slate-700 dark:text-slate-200">
        
        {/* Term 1 */}
        <div className="space-y-2">
          <h2 className="text-base sm:text-lg font-extrabold text-[#095D7E] dark:text-slate-100">
            {lang === 'en' ? '1. Pricing & Presentation Accuracy' : '১. ওষুধের বাজারমূল্য ও তথ্যের নির্ভুলতা'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'While MEDDET continuously indexes and cross-references Maximum Retail Prices (MRP) from verified pharmaceutical releases across Bangladesh, pharmaceutical manufacturers periodically revise packaging presentations, bottle volumes, and commercial unit rates. MEDDET makes no warranties regarding real-time retail price parity at specific local pharmacies.'
              : 'আমরা নিয়মিতভাবে ওষুধের সর্বোচ্চ খুচরা মূল্য (MRP) আপডেট করি। তবে প্রস্তুতকারক কোম্পানিভেদে বা সময়ের সাথে সাথে ওষুধের দাম পরিবর্তিত হতে পারে। নির্দিষ্ট ফার্মেসিতে ক্রয়ের পূর্বে খুচরা মূল্য যাচাই করে নেওয়ার অনুরোধ করা হচ্ছে।'}
          </p>
        </div>

        {/* Term 2 */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-base sm:text-lg font-extrabold text-[#095D7E] dark:text-slate-100">
            {lang === 'en' ? '2. Generic Alternatives Comparison' : '২. বিকল্প ওষুধের তুলনামূলক তথ্য'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'The generic alternative brand comparison tool groups medicines by identical active generic substances and dosage forms to illustrate commercial price variances. Bioequivalence and patient-specific brand substitution must always be confirmed by a licensed medical practitioner or clinical pharmacist.'
              : 'একই জেনেরিক উপাদানের ভিন্ন ভিন্ন ব্র্যান্ডের দামের তুলনা শুধুমাত্র তথ্যের সুবিধার্থে দেওয়া হয়েছে। এক ব্র্যান্ডের পরিবর্তে অন্য ব্র্যান্ডের ওষুধ ব্যবহারের পূর্বে অবশ্যই চিকিৎসকের পরামর্শ নিতে হবে।'}
          </p>
        </div>

        {/* Term 3 */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-base sm:text-lg font-extrabold text-[#095D7E] dark:text-slate-100">
            {lang === 'en' ? '3. Intellectual Property & Brand Rights' : '৩. ব্র্যান্ড ও ট্রেডমার্ক সংক্রান্ত অধিকার'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'All pharmaceutical brand names, trade dress, logos, and manufacturer trademarks displayed on MEDDET remain the exclusive intellectual property of their respective licensed pharmaceutical companies.'
              : 'সাইটে উল্লেখিত সকল ওষুধের নাম, লোগো এবং প্রস্তুতকারকের নাম সংশ্লিষ্ট কোম্পানির নিজস্ব ট্রেডমার্ক ও বুদ্ধিবৃত্তিক সম্পত্তি।'}
          </p>
        </div>

        {/* Term 4 */}
        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-6">
          <h2 className="text-base sm:text-lg font-extrabold text-[#095D7E] dark:text-slate-100">
            {lang === 'en' ? '4. Acceptable Use & Advertising Transparency' : '৪. ব্যবহারের নিয়মনীতি ও বিজ্ঞাপন স্বচ্ছতা'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'en'
              ? 'MEDDET is funded through compliant, non-intrusive display advertisements (including Google AdSense). Automated scraping, malicious probing, or artificial traffic generation is strictly prohibited under Cloudflare Edge security rules. By using this service, you consent to our Terms and our Privacy Policy.'
              : 'MEDDET গুগল অ্যাডসেন্সসহ নিরাপদ ও নিরপেক্ষ বিজ্ঞাপনের মাধ্যমে পরিচালিত হয়। ক্লাউডফ্লেয়ার সুরক্ষার অধীনে কৃত্রিম বট ট্রাফিক বা ডাটা স্ক্র্যাপিং সম্পূর্ণ নিষিদ্ধ। সাইটটি ব্যবহারের মাধ্যমে আপনি আমাদের শর্তাবলী ও প্রাইভেসি পলিসিতে সম্মতি জ্ঞাপন করছেন।'}
          </p>
        </div>

      </div>

    </div>
  );
};
