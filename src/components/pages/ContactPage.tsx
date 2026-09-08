import React, { useState } from 'react';
import { Mail, Building2, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { LanguageMode } from '../../types';

interface ContactPageProps {
  lang: LanguageMode;
}

export const ContactPage: React.FC<ContactPageProps> = ({ lang }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Medicine Data Correction',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <Mail className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Get In Touch' : 'যোগাযোগ ও সাপোর্ট'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Contact MEDDET™' : 'আমাদের সাথে যোগাযোগ করুন'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? 'Have medicine price updates, clinical monograph suggestions, developer API queries, or general feedback?'
              : 'ওষুধের তথ্যের সংশোধন, মতামত বা ডেভেলপার এপিআই সংক্রান্ত যেকোনো তথ্যের জন্য আমাদের লিখুন।'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Contact Channels */}
        <div className="md:col-span-1 space-y-4">
          <a
            href="mailto:support@meddet.com"
            className="p-5 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs flex items-center gap-4 hover:border-[#14967F] transition-all group block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#14967F] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6 text-[#E2FCD6]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'General & Support Email' : 'সাপোর্ট ইমেইল'}
              </div>
              <div className="text-sm font-black text-[#095D7E] dark:text-[#2DD4BF] truncate">
                support@meddet.com
              </div>
            </div>
          </a>

          <a
            href="mailto:api@meddet.com"
            className="p-5 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs flex items-center gap-4 hover:border-[#14967F] transition-all group block cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#095D7E] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-[#E2FCD6]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'Developer API Department' : 'ডেভেলপার এপিআই বিভাগ'}
              </div>
              <div className="text-sm font-black text-[#095D7E] dark:text-[#2DD4BF] truncate">
                api@meddet.com
              </div>
            </div>
          </a>

          <div className="p-5 rounded-3xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] text-xs space-y-2">
            <div className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'en' ? 'Medicine Correction Protocol' : 'তথ্য সংশোধনের নিয়ম'}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
              {lang === 'en'
                ? 'To report an outdated MRP price or newly released dosage form, please include the Brand Name, Manufacturer, Strength, and Pack Size.'
                : 'ওষুধের নতুন দাম বা প্যাকেজিংয়ের তথ্য জানাতে ব্র্যান্ডের নাম, কোম্পানি ও প্যাক সাইজ উল্লেখ করুন।'}
            </p>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs">
          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E2FCD6] text-[#14967F] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#095D7E] dark:text-slate-100">
                {lang === 'en' ? 'Thank you! Message Received.' : 'ধন্যবাদ! আপনার বার্তাটি গৃহীত হয়েছে।'}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {lang === 'en'
                  ? 'Our clinical index team will review your submission promptly.'
                  : 'আমাদের টিম আপনার তথ্যটি দ্রুত যাচাই করে ব্যবস্থা গ্রহণ করবে।'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white text-xs font-bold hover:bg-[#074760] transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'Send Another Message' : 'আরেকটি বার্তা পাঠান'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-[#095D7E] dark:text-slate-100">
                {lang === 'en' ? 'Send us a Message' : 'বার্তা পাঠান'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'en' ? 'Your Name' : 'আপনার নাম'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'en' ? 'Dr. / Pharmacist / Student' : 'আপনার নাম লিখুন'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#14967F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {lang === 'en' ? 'Email Address' : 'ইমেইল ঠিকানা'}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#14967F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'en' ? 'Subject' : 'বিষয়'}
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-[#14967F]"
                >
                  <option value="Medicine Data Correction">
                    {lang === 'en' ? 'Medicine Price or Data Correction' : 'ওষুধের দাম বা তথ্য সংশোধন'}
                  </option>
                  <option value="Developer API Query">
                    {lang === 'en' ? 'Developer REST API Query' : 'ডেভেলপার এপিআই সংক্রান্ত'}
                  </option>
                  <option value="General Feedback">
                    {lang === 'en' ? 'General Feedback & Suggestion' : 'সাধারণ মতামত ও পরামর্শ'}
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'en' ? 'Your Message & Details' : 'বিস্তারিত বিবরণ'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={lang === 'en' ? 'Please provide medicine brand names, manufacturer info, or your inquiry...' : 'ওষুধের নাম ও বিস্তারিত বিবরণ লিখুন...'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#14967F] resize-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white font-extrabold text-xs sm:text-sm hover:bg-[#074760] transition-colors cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'en' ? 'Submit Inquiry' : 'বার্তা পাঠান'}</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
