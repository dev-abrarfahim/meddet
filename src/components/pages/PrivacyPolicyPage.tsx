import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, Sparkles } from 'lucide-react';
import { LanguageMode } from '../../types';

interface PrivacyPolicyPageProps {
  lang: LanguageMode;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ lang }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'User Data Protection Protocol' : 'ব্যবহারকারীর তথ্যের সর্বোচ্চ সুরক্ষা'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Privacy Policy' : 'প্রাইভেসি পলিসি'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? 'Our commitment to transparency, zero personal health data collection, and user confidentiality.'
              : 'MedVhai-এ ব্যবহারকারীর তথ্যের গোপনীয়তা ও সুরক্ষা সংক্রান্ত নীতিমালা।'}
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-8 text-slate-700 dark:text-slate-200">
        
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? '1. Zero Personal Health Data Collection' : '১. ব্যক্তিগত স্বাস্থ্য সংক্রান্ত তথ্য সংগ্রহ না করা'}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
            {lang === 'en'
              ? 'MedVhai operates strictly as an open clinical reference guide. We do not require registration, login, email verification, or phone number submission to access our database. We do NOT store, sell, or monitor personal prescriptions, medical history, or individual drug searches.'
              : 'MedVhai একটি উন্মুক্ত ক্লিনিক্যাল রেফারেন্স গাইড। এই ওয়েবসাইট ব্যবহারের জন্য কোনো অ্যাকাউন্ট খোলা বা ব্যক্তিগত তথ্য প্রদানের প্রয়োজন নেই। আমরা ব্যবহারকারীর প্রেসক্রিপশন বা ব্যক্তিগত কোনো তথ্য সংরক্ষণ বা বিক্রি করি না।'}
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? '2. Local Storage & Client Cache' : '২. লোকাল স্টোরেজ ও ব্রাউজার ক্যাশ'}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
            {lang === 'en'
              ? "We utilize your device's native browser local storage strictly for client-side user experience preferences: your preferred theme (Dark/Light mode), active language setting (English/Bangla), and recent search keywords for instant autocomplete. This data resides solely on your device and is never uploaded to our servers."
              : 'আপনার ডিভাইসের লোকাল স্টোরেজ শুধুমাত্র থিম নির্বাচন (ডার্ক/লাইট মোড), ভাষা নির্বাচন এবং সাম্প্রতিক সার্চ হিস্টোরির জন্য ব্যবহৃত হয়। এই তথ্য শুধুমাত্র আপনার ব্রাউজারেই সীমাবদ্ধ থাকে।'}
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? '3. Anonymous Diagnostics & Security' : '৩. ডায়াগনস্টিক ট্রাফিক ও নিরাপত্তা'}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
            {lang === 'en'
              ? 'To protect our server infrastructure against automated denial-of-service abuse, rate limits (60 requests/min) and anonymized HTTP traffic metrics are enforced via our Cloudflare Edge security layer. No personally identifiable medical search intent is logged.'
              : 'সার্ভারের গতি ও নিরাপত্তা বজায় রাখার জন্য সাধারণ বেনামী ট্রাফিক মেট্রিক্স ব্যবহৃত হয়, যার মাধ্যমে কোনো ব্যক্তিগত তথ্য ট্র্যাক করা হয় না।'}
          </p>
        </div>

        {/* Last Updated Note */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 text-xs text-slate-400 dark:text-slate-500 font-bold">
          {lang === 'en' ? 'Last Updated: August 2026 • MedVhai Privacy Governance' : 'সর্বশেষ আপডেট: আগস্ট ২০২৬ • MedVhai প্রাইভেসি নীতিমালা'}
        </div>

      </div>

    </div>
  );
};
