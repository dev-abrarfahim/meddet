import React from 'react';
import {
  ShieldCheck,
  EyeOff,
  Server,
  HardDrive,
  Cookie,
  ExternalLink,
  Lock,
  Mail,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LanguageMode } from '../../types';

interface PrivacyPolicyPageProps {
  lang: LanguageMode;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ lang }) => {
  const handleOpenCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('meddet_open_cookie_settings'));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'AdSense & Privacy Governance Protocol' : 'গুগল অ্যাডসেন্স ও ডেটা প্রটেকশন নীতিমালা'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Privacy Policy & Cookie Statement' : 'প্রাইভেসি পলিসি ও কুকি নীতিমালা'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? 'Comprehensive disclosure of our zero personal health data collection principles, Google advertising technologies, third-party cookies, and your privacy choices on MEDDET™.'
              : 'MEDDET-এ ব্যবহারকারীর তথ্যের গোপনীয়তা, গুগল বিজ্ঞাপন, থার্ড-পার্টি কুকি এবং স্বাস্থ্য তথ্যের সর্বোচ্চ সুরক্ষা সংক্রান্ত পূর্ণাঙ্গ নীতিমালা।'}
          </p>
        </div>
      </div>

      {/* Interactive Cookie Preference Quick Action Card */}
      <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#14967F] text-white flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5 text-[#E2FCD6]" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-emerald-900 dark:text-emerald-200">
              {lang === 'en' ? 'Your Cookie Consent & Control' : 'আপনার কুকি সম্মতি ও নিয়ন্ত্রণ'}
            </h2>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              {lang === 'en'
                ? 'You can review or change your cookie choices for analytics and advertising at any time.'
                : 'বিজ্ঞাপন ও অ্যানালিটিক্স কুকির বিষয়ে আপনার পছন্দ যেকোনো সময় পরিবর্তন করতে পারেন।'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCookieSettings}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#14967F] hover:bg-[#11806C] text-white font-black text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
        >
          <Cookie className="w-4 h-4" />
          <span>{lang === 'en' ? 'Manage Cookie Preferences' : 'কুকি সেটিংস পরিবর্তন'}</span>
        </button>
      </div>

      {/* Main Content Sections Container */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-8 text-slate-700 dark:text-slate-200">
        
        {/* Section 1: Zero Personal Health Data Collection */}
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
              ? 'MEDDET operates strictly as an educational and open clinical drug reference platform for healthcare practitioners and patients in Bangladesh. We do NOT require user account registration, login, phone number entry, or email verification to access our pharmaceutical database. We do NOT store, monitor, sell, or transmit personal prescriptions, medical diagnostic records, or identifiable drug search histories.'
              : 'MEDDET বাংলাদেশের চিকিৎসক, ফার্মাসিস্ট ও রোগীদের জন্য একটি উন্মুক্ত ক্লিনিক্যাল ড্রাগ রেফারেন্স গাইড। এই ওয়েবসাইট ব্যবহারের জন্য কোনো অ্যাকাউন্ট খোলা বা ব্যক্তিগত তথ্য প্রদানের প্রয়োজন নেই। আমরা ব্যবহারকারীর কোনো প্রেসক্রিপশন বা ব্যক্তিগত চিকিৎসা ইতিহাস সংরক্ষণ বা কারো সাথে শেয়ার করি না।'}
          </p>
        </div>

        {/* Section 2: Google AdSense, DoubleClick & Third-Party Advertising (BLOCKING REQUIREMENT) */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en'
                ? '2. Google Advertising, AdSense & Third-Party Cookies'
                : '২. গুগল অ্যাডসেন্স ও থার্ড-পার্টি বিজ্ঞাপন কুকি'}
            </h2>
          </div>
          
          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13 space-y-3">
            <p>
              {lang === 'en'
                ? 'We partner with third-party advertising vendors, including Google LLC, to serve advertisements when you visit our website. This enables us to maintain MEDDET as a free open-access clinical reference for healthcare professionals and the public.'
                : 'আমরা ব্যবহারকারীদের সুবিধার্থে ওয়েবসাইটটি বিনামূল্যে উন্মুক্ত রাখতে গুগল (Google LLC) সহ অন্যান্য থার্ড-পার্টি বিজ্ঞাপন পার্টনারদের সাথে কাজ করি।'}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2 text-xs sm:text-sm">
              <div className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{lang === 'en' ? 'Mandatory AdSense Disclosures:' : 'গুগল অ্যাডসেন্স সংক্রান্ত আবশ্যকীয় তথ্যাদি:'}</span>
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14967F] shrink-0 mt-0.5" />
                  <span>
                    {lang === 'en'
                      ? 'Third-party vendors, including Google, use cookies (including the DoubleClick / DART cookie) to serve ads based on a user’s prior visits to MEDDET or other websites on the Internet.'
                      : 'গুগল সহ অন্যান্য অনুমোদিত থার্ড-পার্টি ভেন্ডররা কুকি ব্যবহার করে ব্যবহারকারীর বিগত ভিজিটের তথ্যের ভিত্তিতে বিজ্ঞাপন প্রদর্শন করে।'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14967F] shrink-0 mt-0.5" />
                  <span>
                    {lang === 'en'
                      ? 'Google’s use of advertising cookies enables it and its partners to serve ads to users based on their visits to our site and/or other sites across the web.'
                      : 'বিজ্ঞাপন কুকি ব্যবহারের মাধ্যমে গুগল ও তার অংশীদারেরা ইন্টারনেট জুড়ে প্রাসঙ্গিক বিজ্ঞাপন পৌঁছে দেয়।'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14967F] shrink-0 mt-0.5" />
                  <span>
                    {lang === 'en'
                      ? 'Users may opt out of personalized advertising by visiting Google Ads Settings at '
                      : 'ব্যবহারকারীরা তাদের ব্যক্তিগতকৃত বিজ্ঞাপন নিয়ন্ত্রণ বা বন্ধ করতে গুগলের অ্যাড সেটিংস ভিজিট করতে পারেন: '}
                    <a
                      href="https://adssettings.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#095D7E] dark:text-[#2DD4BF] underline inline-flex items-center gap-0.5"
                    >
                      <span>adssettings.google.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#14967F] shrink-0 mt-0.5" />
                  <span>
                    {lang === 'en'
                      ? 'Alternatively, you can opt out of a third-party vendor’s use of cookies for personalized advertising by visiting '
                      : 'অথবা থার্ড-পার্টি ভেন্ডরদের কুকি অপ্ট-আউট করতে ভিজিট করতে পারেন: '}
                    <a
                      href="https://www.aboutads.info/choices"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#095D7E] dark:text-[#2DD4BF] underline inline-flex items-center gap-0.5"
                    >
                      <span>www.aboutads.info</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {lang === 'en' ? ' or the Network Advertising Initiative at ' : ' বা '}
                    <a
                      href="https://optout.networkadvertising.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#095D7E] dark:text-[#2DD4BF] underline inline-flex items-center gap-0.5"
                    >
                      <span>optout.networkadvertising.org</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Cookie Categories Breakdown */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? '3. Types of Cookies We Use' : '৩. ব্যবহৃত কুকির প্রকারভেদ'}
            </h2>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-extrabold text-xs text-[#095D7E] dark:text-[#2DD4BF]">
                  {lang === 'en' ? 'Strictly Necessary' : 'অপরিহার্য কুকি'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'en'
                    ? 'Stores theme preference (Dark/Light mode), language selection (English/Bangla), and temporary indexed database caches in your browser.'
                    : 'থিম সেটিংস (ডার্ক/লাইট), ভাষা নির্বাচন এবং ব্রাউজারে ইনডেক্স করা ওষুধের ক্যাশ সংরক্ষণের জন্য ব্যবহৃত হয়।'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-extrabold text-xs text-[#095D7E] dark:text-[#2DD4BF]">
                  {lang === 'en' ? 'Analytics & Performance' : 'অ্যানালিটিক্স কুকি'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'en'
                    ? 'Google Analytics 4 and Microsoft Clarity help us understand medicine search trends, generic lookup patterns, and diagnose site performance.'
                    : 'সার্চ ট্রেন্ড এবং পেজ লোডিং স্পিড ট্র্যাক করতে Google Analytics 4 ও Microsoft Clarity ব্যবহৃত হয়।'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="font-extrabold text-xs text-[#095D7E] dark:text-[#2DD4BF]">
                  {lang === 'en' ? 'Advertising & Marketing' : 'বিজ্ঞাপন কুকি'}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lang === 'en'
                    ? 'Google AdSense delivers personalized or contextual display advertisements based on user interests while honoring privacy consent choices.'
                    : 'গুগল অ্যাডসেন্সের মাধ্যমে প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শনের জন্য ব্যবহৃত হয়।'}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Section 4: Log Files & Edge Diagnostic Metrics */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? '4. Server Logs & Edge Diagnostics' : '৪. সার্ভার লগ ও ডায়াগনস্টিক ট্রাফিক'}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
            {lang === 'en'
              ? 'Like most standard websites, MEDDET follows standard procedures of utilizing log files and edge telemetry (via Cloudflare edge infrastructure). These files record anonymized diagnostic data including IP addresses, browser types, Internet Service Providers (ISPs), date and time stamps, referring/exit pages, and click paths to prevent automated DDoS attacks and enforce fair rate limits. This data is not linked to any personally identifiable medical information.'
              : 'সার্ভারের গতি ও নিরাপত্তা বজায় রাখার জন্য সাধারণ ডায়াগনস্টিক তথ্য (যেমন ব্রাউজারের ধরণ, আইপি অ্যাড্রেস ও ভিজিটের সময়) স্বয়ংক্রিয়ভাবে ক্লাউডফ্লেয়ার এজ নেটওয়ার্কে রেকর্ড হতে পারে, যা দিয়ে কোনো ব্যক্তিকে আলাদাভাবে চিহ্নিত করা সম্ভব নয়।'}
          </p>
        </div>

        {/* Section 5: Children's Online Privacy Protection (COPPA) */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? "5. Children's Privacy Protection (COPPA)" : '৫. অপ্রাপ্তবয়স্কদের তথ্যের সুরক্ষা (COPPA)'}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
            {lang === 'en'
              ? 'Protecting children’s privacy online is paramount. MEDDET does not knowingly collect any personally identifiable information from children under the age of 13. If you believe your child has provided personal information on our site, please contact us immediately and we will promptly remove such records from our systems.'
              : 'MEDDET ১৩ বছরের কম বয়সী কোনো শিশুর ব্যক্তিগত তথ্য সংগ্রহ করে না। আমাদের সাইটটি মূলত স্বাস্থ্যসেবা সংশ্লিষ্ট প্রাপ্তবয়স্ক পেশাজীবী ও রোগীদের জন্য প্রস্তুত করা।'}
          </p>
        </div>

        {/* Section 6: GDPR & International User Rights */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? '6. GDPR & CCPA/CPRA Privacy Rights' : '৬. আন্তর্জাতিক প্রাইভেসি অধিকার (GDPR/CCPA)'}
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13">
            {lang === 'en'
              ? 'Under data protection regulations including the EU General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA), users have the right to access, rectify, or request erasure of personal data, object to automated profiling, and withdraw consent for non-essential cookies at any time without penalty.'
              : 'GDPR এবং আন্তর্জাতিক ডেটা সুরক্ষা আইন অনুযায়ী ব্যবহারকারীদের তাদের তথ্যের অ্যাক্সেস, সংশোধন এবং যেকোনো সময় কুকি সম্মতি প্রত্যাহার করার পূর্ণ অধিকার রয়েছে।'}
          </p>
        </div>

        {/* Section 7: Contact & Privacy Officer */}
        <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100">
              {lang === 'en' ? '7. Contacting Our Privacy Team' : '৭. প্রাইভেসি সংক্রান্ত যোগাযোগ'}
            </h2>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-13 space-y-2">
            <p>
              {lang === 'en'
                ? 'If you have any questions, suggestions, or concerns regarding this Privacy Policy, our use of cookies, or Google advertising practices, please reach out to our team:'
                : 'আমাদের প্রাইভেসি পলিসি বা কুকি ব্যবহার সংক্রান্ত যেকোনো প্রশ্নের জন্য আমাদের সাথে যোগাযোগ করতে পারেন:'}
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 inline-flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-bold">
              <div>
                <span className="text-slate-400 block">{lang === 'en' ? 'Privacy Officer Email' : 'প্রাইভেসি ইমেইল'}:</span>
                <a href="mailto:privacy@meddet.site" className="text-[#095D7E] dark:text-[#2DD4BF] font-mono text-sm underline">
                  privacy@meddet.site
                </a>
              </div>
              <div className="hidden sm:block w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div>
                <span className="text-slate-400 block">{lang === 'en' ? 'General Support' : 'সাধারণ সাপোর্ট'}:</span>
                <a href="mailto:support@meddet.site" className="text-[#095D7E] dark:text-[#2DD4BF] font-mono text-sm underline">
                  support@meddet.site
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated Note */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500 font-bold">
          <span>{lang === 'en' ? 'Last Updated: October 2026 • Verified Google AdSense & GDPR Compliance' : 'সর্বশেষ পরিমার্জন: অক্টোবর ২০২৬ • গুগল অ্যাডসেন্স ও GDPR নীতিমালা অনুযায়ী অনুমোদিত'}</span>
          <span>MEDDET™ Healthcare Index Governance</span>
        </div>

      </div>

    </div>
  );
};
