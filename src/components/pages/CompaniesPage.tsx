import React, { useState, useMemo } from 'react';
import { Building2, Search, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { LanguageMode } from '../../types';
import { getAllCompanies } from '../../data/dbEngine';
import { getCompanyCanonicalPath } from '../../utils/urlHelper';

interface CompaniesPageProps {
  lang: LanguageMode;
  onSelectCompany: (companyName: string) => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({ lang, onSelectCompany }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');

  const allCompanies = useMemo(() => getAllCompanies(), []);

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((comp) => {
      const matchesQuery = !searchQuery.trim() || comp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = selectedLetter === 'All' || comp.name.toUpperCase().startsWith(selectedLetter);
      return matchesQuery && matchesLetter;
    });
  }, [allCompanies, searchQuery, selectedLetter]);

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Pharmaceutical Manufacturer Directory' : 'ফার্মাসিউটিক্যাল কোম্পানি ডিরেক্টরি'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Pharmaceutical Companies in Bangladesh' : 'বাংলাদেশের ফার্মাসিউটিক্যাল কোম্পানিসমূহ'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? `Browse all ${allCompanies.length} licensed pharmaceutical manufacturers, explore their complete brand portfolios, and compare generic alternatives.`
              : `বাংলাদেশের সকল ${allCompanies.length}টি অনুমোদিত ফার্মাসিউটিক্যাল কোম্পানির তালিকা ও তাদের উৎপাদিত ওষুধের বিবরণ।`}
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-4">
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search manufacturers (e.g. Square, Beximco, Incepta)...' : 'কোম্পানির নাম দিয়ে খুঁজুন...'}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#14967F]"
          />
        </div>

        {/* Alphabet Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1">
          <span>
            {lang === 'en'
              ? `Showing ${filteredCompanies.length} of ${allCompanies.length} Manufacturers`
              : `${allCompanies.length}টির মধ্যে ${filteredCompanies.length}টি কোম্পানি প্রদর্শিত হচ্ছে`}
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-[#14967F] hover:underline font-extrabold cursor-pointer"
            >
              {lang === 'en' ? 'Clear Search' : 'সার্চ মুছুন'}
            </button>
          )}
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {filteredCompanies.map((company) => {
          const canonicalPath = getCompanyCanonicalPath(company.name);
          return (
            <a
              key={company.id}
              href={canonicalPath}
              onClick={(e) => {
                e.preventDefault();
                onSelectCompany(company.name);
              }}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] dark:hover:border-[#2DD4BF] hover:shadow-md transition-all group flex flex-col justify-between space-y-3 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Building2 className="w-5 h-5" />
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] text-xs font-black font-mono shrink-0">
                  {company.brandCount} meds
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#095D7E] dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors line-clamp-2">
                  {company.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1 flex items-center gap-1">
                  <span>{lang === 'en' ? 'Explore Portfolio' : 'ওষুধসমূহ দেখুন'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#14967F]" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

    </div>
  );
};
