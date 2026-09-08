import React, { useState } from 'react';
import { Search, Home, ArrowRight, Pill, Sparkles, Layers, Building2 } from 'lucide-react';
import { LanguageMode } from '../../types';
import { getDosageFormCanonicalPath, getCompanyCanonicalPath } from '../../utils/urlHelper';

interface NotFoundPageProps {
  onGoHome: () => void;
  onGoToSearch: (query?: string, category?: string, manufacturer?: string, dosageForm?: string) => void;
  lang: LanguageMode;
  requestedSlug?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onGoToSearch,
  lang,
  requestedSlug
}) => {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onGoToSearch(searchVal.trim());
    } else {
      onGoHome();
    }
  };

  const popularMedicines = [
    'Napa', 'Seclo', 'Maxpro', 'Sergel', 'Ace', 'Monas', 'Alatrol', 'Ciprocin', 'Pantonix', 'Bexitrol'
  ];

  const popularForms = [
    { id: 'Tablet', name: 'Tablet', nameBn: 'ট্যাবলেট' },
    { id: 'Capsule', name: 'Capsule', nameBn: 'ক্যাপসুল' },
    { id: 'Syrup', name: 'Syrup', nameBn: 'সিরাপ' },
    { id: 'Injection', name: 'Injection', nameBn: 'ইনজেকশন' }
  ];

  const popularCompanies = [
    'Square Pharmaceuticals PLC.',
    'Beximco Pharmaceuticals Ltd.',
    'Incepta Pharmaceuticals Ltd.',
    'Renata Limited'
  ];

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-8 sm:py-12 animate-in fade-in zoom-in-95 duration-200">
      <div className="max-w-2xl w-full text-center space-y-6 bg-white dark:bg-[#131B2E] p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 404 Badge & Visual Icon */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-[#14967F] dark:text-[#2DD4BF] shadow-inner">
              <Pill className="w-10 h-10 sm:w-12 sm:h-12 rotate-45" />
            </div>
            <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#095D7E] text-white text-[11px] font-black font-mono shadow-md border-2 border-white dark:border-[#131B2E]">
              404
            </span>
          </div>

          <div className="pt-2">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {lang === 'en' ? 'Medicine Not Found' : 'ওষুধটি পাওয়া যায়নি'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium max-w-md mx-auto mt-1.5 leading-relaxed">
              {lang === 'en'
                ? `We couldn't find any medicine record matching ${requestedSlug ? `"${requestedSlug}"` : 'this link'}. It may have been discontinued or the URL is incorrect.`
                : `এই লিংকের সাথে মিলে এমন কোনো ওষুধের তথ্য পাওয়া যায়নি। লিংকটি ভুল হতে পারে বা ওষুধটির নাম পরিবর্তিত হয়েছে।`}
            </p>
          </div>
        </div>

        {/* In-Page Recovery Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#152232] p-1.5 sm:p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus-within:border-[#14967F] dark:focus-within:border-[#2DD4BF] transition-all shadow-inner">
            <div className="pl-3 text-[#14967F] dark:text-[#2DD4BF]">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              placeholder={lang === 'en' ? 'Search 30,500+ medicines (e.g. Napa, Seclo)...' : 'ওষুধ খুঁজুন (যেমন: Napa, Seclo)...'}
              className="w-full text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 placeholder-slate-400 bg-transparent focus:outline-none py-1.5 px-2"
              autoFocus
            />
            <button
              type="submit"
              className="bg-[#14967F] dark:bg-[#2DD4BF] hover:bg-[#11806C] text-white dark:text-slate-950 font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>{lang === 'en' ? 'Search' : 'খুঁজুন'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Popular Medicine Quick Chips */}
        <div className="space-y-2 pt-2 text-left">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5 justify-center sm:justify-start">
            <Sparkles className="w-3.5 h-3.5 text-[#14967F]" />
            <span>{lang === 'en' ? 'Popular Medicine Searches:' : 'জনপ্রিয় ওষুধসমূহ:'}</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
            {popularMedicines.map((brandName) => (
              <button
                key={brandName}
                onClick={() => onGoToSearch(brandName)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-[#14967F] dark:hover:text-[#2DD4BF] border border-slate-200 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
              >
                {brandName}
              </button>
            ))}
          </div>
        </div>

        {/* Categories & Directory Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-left">
          {/* Dosage Forms */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#14967F]" />
              <span>{lang === 'en' ? 'Dosage Forms' : 'ওষুধের ফর্ম'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularForms.map((f) => (
                <a
                  key={f.id}
                  href={getDosageFormCanonicalPath(f.id)}
                  onClick={(e) => {
                    e.preventDefault();
                    onGoToSearch(undefined, undefined, undefined, f.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-[#14967F]"
                >
                  {lang === 'en' ? f.name : f.nameBn}
                </a>
              ))}
            </div>
          </div>

          {/* Manufacturers */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-[#14967F]" />
              <span>{lang === 'en' ? 'Top Manufacturers' : 'ফার্মাসিউটিক্যালস'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {popularCompanies.map((c) => (
                <a
                  key={c}
                  href={getCompanyCanonicalPath(c)}
                  onClick={(e) => {
                    e.preventDefault();
                    onGoToSearch(undefined, undefined, c);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:border-[#14967F] truncate max-w-[180px]"
                  title={c}
                >
                  {c.split(' ')[0]} Pharma
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="pt-2">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onGoHome();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#095D7E] hover:bg-[#074760] text-white font-black text-sm transition-all shadow-md cursor-pointer group"
          >
            <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span>{lang === 'en' ? 'Return to MEDDET Homepage' : 'হোমপেজে ফিরে যান'}</span>
          </a>
        </div>

      </div>
    </main>
  );
};
