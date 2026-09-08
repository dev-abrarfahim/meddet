import React from 'react';
import { X, Info, ShieldCheck, FileText, Mail, Building2, CheckCircle2 } from 'lucide-react';
import { LanguageMode } from '../../types';

export type InfoModalType = 'about' | 'privacy' | 'terms' | 'contact' | null;

interface InfoModalProps {
  type: InfoModalType;
  onClose: () => void;
  lang: LanguageMode;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose, lang }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-white dark:bg-[#152232] rounded-3xl shadow-2xl border border-[#CCECEE] dark:border-[#243B53] overflow-hidden z-10 my-8">
        
        {/* Header */}
        <div className="bg-[#095D7E] dark:bg-[#0B1927] text-white p-5 sm:p-6 flex items-center justify-between border-b border-[#074760] dark:border-[#1E3A52]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14967F] flex items-center justify-center text-white shrink-0">
              {type === 'about' && <Info className="w-5 h-5 text-[#E2FCD6]" />}
              {type === 'privacy' && <ShieldCheck className="w-5 h-5 text-[#E2FCD6]" />}
              {type === 'terms' && <FileText className="w-5 h-5 text-[#E2FCD6]" />}
              {type === 'contact' && <Mail className="w-5 h-5 text-[#E2FCD6]" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {type === 'about' && (lang === 'en' ? 'About MEDDET™' : 'MEDDET™ সম্পর্কে')}
                {type === 'privacy' && (lang === 'en' ? 'Privacy Policy' : 'প্রাইভেসি পলিসি')}
                {type === 'terms' && (lang === 'en' ? 'Terms & Medical Disclaimer' : 'ব্যবহারের শর্তাবলী ও ডিসক্লেইমার')}
                {type === 'contact' && (lang === 'en' ? 'Contact & Support' : 'যোগাযোগ ও সাপোর্ট')}
              </h2>
              <p className="text-xs text-[#CCECEE] dark:text-slate-400 mt-0.5">
                {type === 'about' && (lang === 'en' ? 'Clinical Drug Index & Medicine Price BD' : 'বাংলাদেশের ক্লিনিক্যাল ড্রাগ ইনডেক্স')}
                {type === 'privacy' && (lang === 'en' ? 'Your privacy and data protection principles' : 'ব্যবহারকারীর তথ্যের নিরাপত্তা')}
                {type === 'terms' && (lang === 'en' ? 'Clinical reference and educational usage guidelines' : 'ক্লিনিক্যাল তথ্যের ব্যবহার নির্দেশিকা')}
                {type === 'contact' && (lang === 'en' ? 'Get in touch with the development and clinical team' : 'আমাদের সাথে যোগাযোগ করুন')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-7 max-h-[70vh] overflow-y-auto space-y-5 text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
          
          {/* 1. ABOUT MODAL */}
          {type === 'about' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53]">
                <img src="/logo.webp" alt="MEDDET Logo" className="h-9 w-auto object-contain" />
                <p className="text-xs sm:text-sm font-semibold text-[#095D7E] dark:text-[#2DD4BF]">
                  {lang === 'en'
                    ? "Bangladesh's comprehensive pharmaceutical intelligence index and medicine price guide."
                    : 'বাংলাদেশের পূর্ণাঙ্গ ফার্মাসিউটিক্যাল ইনডেক্স এবং ওষুধের দাম সংক্রান্ত তথ্যভান্ডার।'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14967F]" />
                  <span>{lang === 'en' ? 'Our Mission & Scope' : 'আমাদের লক্ষ্য ও বৈশিষ্ট্য'}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {lang === 'en'
                    ? 'MEDDET is an independent clinical reference platform designed for doctors, pharmacists, medical students, and patients across Bangladesh. We index over 30,500+ brand medicines across 2,270+ active generic substances and 700+ licensed pharmaceutical manufacturers.'
                    : 'MEDDET বাংলাদেশের চিকিৎসক, ফার্মাসিস্ট, মেডিকেল শিক্ষার্থী ও সাধারণ রোগীদের জন্য তৈরি একটি ডিজিটাল ক্লিনিক্যাল রেফারেন্স প্ল্যাটফর্ম। এখানে ৩০,৫০০+ ব্র্যান্ড ওষুধ, ২,২৭০+ জেনেরিক উপাদান এবং ৭০০+ অনুমোদিত প্রস্তুতকারক কোম্পানির তথ্য সংরক্ষিত রয়েছে।'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-xs text-[#095D7E] dark:text-[#2DD4BF]">
                    {lang === 'en' ? '💰 Transparent Pricing' : '💰 ওষুধের সঠিক দাম'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? 'Verified BDT MRP unit and commercial pack pricing.' : 'অনুমোদিত সর্বোচ্চ খুচরা মূল্য (MRP) ও প্যাকের সঠিক হিসেব।'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-xs text-[#095D7E] dark:text-[#2DD4BF]">
                    {lang === 'en' ? '🔄 Smart Alternatives' : '🔄 সাশ্রয়ী বিকল্প ওষুধ'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? 'Instant generic alternative comparison with cost savings calculator.' : 'একই উপাদানের কম দামি বিকল্প ওষুধ খুঁজে পাওয়ার সুবিধা।'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-xs text-[#095D7E] dark:text-[#2DD4BF]">
                    {lang === 'en' ? '🌐 Bilingual Monographs' : '🌐 দ্বিভাষিক মনোগ্রাফ'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? 'Clinical indications, side effects, and dosage in English & বাংলা.' : 'ব্যবহারবিধি, পার্শ্বপ্রতিক্রিয়া ও সাবধানতা ইংরেজি ও বাংলায়।'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                  <div className="font-bold text-xs text-[#095D7E] dark:text-[#2DD4BF]">
                    {lang === 'en' ? '⚡ High-Performance Edge' : '⚡ দ্রুতগতির সার্চ'}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? 'Instant offline-ready indexed search with sub-second lookups.' : 'অফলাইন-রেডি প্রযুক্তিতে মুহূর্তের মধ্যে যেকোনো ওষুধ সার্চ।'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRIVACY POLICY MODAL */}
          {type === 'privacy' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-[#095D7E] dark:text-slate-100">
                  {lang === 'en' ? '1. Zero Personal Health Data Collection' : '১. ব্যক্তিগত তথ্য সংগ্রহ না করা'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {lang === 'en'
                    ? 'MEDDET does not require user registration, login, or personal profile creation. We do NOT collect, store, or sell personal medical histories, prescriptions, or identifiable search queries.'
                    : 'MEDDET ব্যবহারের জন্য কোনো অ্যাকাউন্ট বা রেজিস্ট্রেশনের প্রয়োজন নেই। আমরা ব্যবহারকারীর কোনো ব্যক্তিগত চিকিৎসা ইতিহাস, প্রেসক্রিপশন বা ব্যক্তিগত তথ্য সংগ্রহ বা বিক্রি করি না।'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-[#095D7E] dark:text-slate-100">
                  {lang === 'en' ? '2. Local Storage Usage' : '২. ব্রাউজার লোকাল স্টোরেজ'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {lang === 'en'
                    ? 'We use your browser’s local storage strictly for interface preferences (e.g., Dark Mode setting, recent medicine searches, and preferred language: English/বাংলা). This data never leaves your device.'
                    : 'আপনার ডিভাইসের লোকাল স্টোরেজ শুধুমাত্র থিম সেটিংস (ডার্ক/লাইট মোড), ভাষা নির্বাচন এবং সাম্প্রতিক সার্চ হিস্টোরির জন্য ব্যবহার করা হয়। এই তথ্য আপনার ডিভাইসের বাইরে কোথাও পাঠানো হয় না।'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-[#095D7E] dark:text-slate-100">
                  {lang === 'en' ? '3. Anonymous Analytics' : '৩. অ্যানালিটিক্স'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {lang === 'en'
                    ? 'Standard anonymous traffic diagnostics are utilized strictly to ensure platform reliability, fast page loads, and crawler uptime across Bangladesh.'
                    : 'প্ল্যাটফর্মের পারফরম্যান্স ও সার্ভার স্পিড বজায় রাখার জন্য সাধারণ ডায়াগনস্টিক ট্রাফিক অ্যানালিটিক্স ব্যবহার করা হয়।'}
                </p>
              </div>
            </div>
          )}

          {/* 3. TERMS & DISCLAIMER MODAL */}
          {type === 'terms' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-1.5">
                <div className="font-black text-rose-900 dark:text-rose-300 flex items-center gap-2 text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{lang === 'en' ? 'Important Medical Disclaimer' : 'জরুরি মেডিকেল ডিসক্লেইমার'}</span>
                </div>
                <p className="text-xs text-rose-800 dark:text-rose-300/90 leading-relaxed font-medium">
                  {lang === 'en'
                    ? 'MEDDET is an informational and educational clinical reference tool. The content provided on this website is NOT intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a registered physician or qualified healthcare provider with any questions you may have regarding a medical condition or prescription medication.'
                    : 'MEDDET শুধুমাত্র একটি শিক্ষামূলক ও তথ্যভিত্তিক ক্লিনিক্যাল রেফারেন্স ওয়েবসাইট। এখানে প্রদত্ত কোনো তথ্যকে চিকিৎসকের পরামর্শ, রোগ নির্ণয় বা চিকিৎসার বিকল্প হিসেবে গ্রহণ করা যাবে না। যেকোনো ওষুধ সেবন বা পরিবর্তনের পূর্বে অবশ্যই রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-[#095D7E] dark:text-slate-100">
                  {lang === 'en' ? 'Data Accuracy & Pricing Verification' : 'তথ্যের নির্ভুলতা ও ওষুধের দাম'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  {lang === 'en'
                    ? 'While we strive to keep all brand prices, pack sizes, and monograph indications up-to-date with official pharmaceutical releases in Bangladesh, commercial pharmaceutical prices and presentations may change over time. Please verify with certified pharmacy retailers.'
                    : 'আমরা নিয়মিতভাবে বাংলাদেশের ফার্মাসিউটিক্যাল তথ্যাদি এবং অনুমোদিত দাম আপডেট রাখি। তবে কোম্পানিভেদে ওষুধের বাজারমূল্য সময়ে সময়ে পরিবর্তিত হতে পারে।'}
                </p>
              </div>
            </div>
          )}

          {/* 4. CONTACT MODAL */}
          {type === 'contact' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {lang === 'en'
                  ? 'Have feedback, data corrections, pharmaceutical inquiries, or developer API questions? Reach out to our team directly.'
                  : 'কোনো ওষুধের তথ্য সংশোধন, মতামত বা এপিআই সংক্রান্ত তথ্যের জন্য আমাদের টিমের সাথে সরাসরি যোগাযোগ করুন।'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href="mailto:support@meddet.com"
                  className="p-4 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] transition-all flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#14967F] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Mail className="w-5 h-5 text-[#E2FCD6]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Support & Feedback</div>
                    <div className="text-sm font-black text-[#095D7E] dark:text-[#2DD4BF] truncate">support@meddet.com</div>
                  </div>
                </a>

                <a
                  href="mailto:api@meddet.com"
                  className="p-4 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] transition-all flex items-center gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#095D7E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Building2 className="w-5 h-5 text-[#E2FCD6]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Developer & Data API</div>
                    <div className="text-sm font-black text-[#095D7E] dark:text-[#2DD4BF] truncate">api@meddet.com</div>
                  </div>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div className="font-bold text-[#095D7E] dark:text-slate-200">
                  {lang === 'en' ? 'Medicine Data Correction Request' : 'তথ্য সংশোধন আবেদন'}
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                  {lang === 'en'
                    ? 'If you notice a newly updated MRP price, pack size variation, or dosage note update for any medicine, email us with the brand name and manufacturer details for verified indexing.'
                    : 'যেকোনো ওষুধের নতুন দাম, প্যাক সাইজ বা ক্লিনিক্যাল নির্দেশিকা আপডেটের জন্য ব্র্যান্ডের নামসহ আমাদের ইমেইল করুন।'}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-[#0E1B2A] px-5 py-4 sm:px-6 flex items-center justify-between border-t border-slate-200 dark:border-[#1E3A52]">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
            MEDDET Clinical Index © 2026
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white font-bold text-xs hover:bg-[#074760] transition-colors cursor-pointer shadow-sm"
          >
            {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
          </button>
        </div>

      </div>
    </div>
  );
};
