import React, { useState, useEffect, useMemo } from 'react';
import { Building2, Search, ArrowRight, Trophy, Award, Star } from 'lucide-react';
import { LanguageMode, CompanyInfo } from '../../types';
import { getAllCompanies, subscribeDatabase, isDatabaseReady } from '../../data/dbEngine';
import { getCompanyCanonicalPath } from '../../utils/urlHelper';

interface CompaniesPageProps {
  lang: LanguageMode;
  onSelectCompany: (companyName: string) => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({ lang, onSelectCompany }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('All');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'top50' | 'major'>('all');
  const [allCompanies, setAllCompanies] = useState<CompanyInfo[]>(() => getAllCompanies());

  // Listen for database updates and load instantly
  useEffect(() => {
    const update = () => {
      setAllCompanies(getAllCompanies());
    };
    update();
    const unsubscribe = subscribeDatabase(update);
    return () => unsubscribe();
  }, []);

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((comp) => {
      const matchesQuery = !searchQuery.trim() || comp.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLetter = selectedLetter === 'All' || comp.name.toUpperCase().startsWith(selectedLetter);
      
      let matchesTab = true;
      if (activeFilterTab === 'top50') {
        matchesTab = (comp.rank !== undefined && comp.rank <= 50);
      } else if (activeFilterTab === 'major') {
        matchesTab = comp.brandCount >= 100;
      }

      return matchesQuery && matchesLetter && matchesTab;
    });
  }, [allCompanies, searchQuery, selectedLetter, activeFilterTab]);

  const alphabet = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const getRankBadge = (rank?: number) => {
    if (!rank) return null;

    if (rank === 1) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-black border border-amber-300 dark:border-amber-700 shadow-xs">
          <span>👑</span>
          <span>Rank #1</span>
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-black border border-slate-300 dark:border-slate-600 shadow-xs">
          <span>🥈</span>
          <span>Rank #2</span>
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200 text-[11px] font-black border border-amber-200 dark:border-amber-800 shadow-xs">
          <span>🥉</span>
          <span>Rank #3</span>
        </span>
      );
    }
    if (rank <= 10) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-[11px] font-black border border-emerald-300 dark:border-emerald-700">
          <Star className="w-3 h-3 fill-current text-emerald-600 dark:text-emerald-400" />
          <span>Rank #{rank}</span>
        </span>
      );
    }
    if (rank <= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E2FCD6] dark:bg-[#064E3B]/80 text-[#0D6F5D] dark:text-[#6EE7B7] text-[11px] font-black border border-[#14967F]/30">
          <Award className="w-3 h-3 text-[#14967F]" />
          <span>Top 50 • #{rank}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold font-mono">
        #{rank}
      </span>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Hero Banner */}
      <div className="rounded-3xl bg-linear-to-br from-[#095D7E] via-[#074760] to-[#042C3C] text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black text-[#E2FCD6]">
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Pharmaceutical Industry Directory' : 'ফার্মাসিউটিক্যাল কোম্পানি ডিরেক্টরি'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'en' ? 'Top Pharmaceutical Companies in Bangladesh' : 'বাংলাদেশের শীর্ষ ফার্মাসিউটিক্যাল কোম্পানিসমূহ'}
          </h1>

          <p className="text-sm sm:text-base text-[#CCECEE] leading-relaxed font-medium">
            {lang === 'en'
              ? `Ranked directory of all ${allCompanies.length || '723'} pharmaceutical companies. Featuring Bangladesh's Top 50 manufacturers followed by all active companies ordered by market medicine portfolio size.`
              : `বাংলাদেশের শীর্ষ ৫০টি ফার্মাসিউটিক্যাল কোম্পানি এবং বাজারে বিদ্যমান ওষুধের সংখ্যার ভিত্তিতে ক্রমানুসারে সাজানো সকল ${allCompanies.length || '৭২৩'}টি কোম্পানির তালিকা।`}
          </p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search manufacturers (e.g. Square, Incepta, Beximco, Healthcare)...' : 'কোম্পানির নাম দিয়ে খুঁজুন...'}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#14967F]"
          />
        </div>

        {/* View Segment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setActiveFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeFilterTab === 'all'
                ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {lang === 'en' ? `All Companies (${allCompanies.length || '...'})` : `সকল কোম্পানি (${allCompanies.length || '...'})`}
          </button>

          <button
            onClick={() => setActiveFilterTab('top50')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeFilterTab === 'top50'
                ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'en' ? 'Top 50 Industry Leaders' : 'শীর্ষ ৫০ কোম্পানি'}</span>
          </button>

          <button
            onClick={() => setActiveFilterTab('major')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
              activeFilterTab === 'major'
                ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {lang === 'en' ? 'Major Portfolios (100+ Meds)' : '১০০+ ওষুধ বিশিষ্ট কোম্পানি'}
          </button>
        </div>

        {/* Alphabet Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1 border-t border-slate-100 dark:border-slate-800">
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => setSelectedLetter(letter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-[#14967F] text-white shadow-xs'
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
              ? `Showing ${filteredCompanies.length} of ${allCompanies.length} Manufacturers (Ranked)`
              : `${allCompanies.length}টির মধ্যে ${filteredCompanies.length}টি কোম্পানি র‍্যাঙ্ক অনুযায়ী প্রদর্শিত হচ্ছে`}
          </span>
          {(searchQuery || selectedLetter !== 'All' || activeFilterTab !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLetter('All');
                setActiveFilterTab('all');
              }}
              className="text-[#14967F] hover:underline font-extrabold cursor-pointer"
            >
              {lang === 'en' ? 'Reset Filters' : 'ফিল্টার মুছুন'}
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {allCompanies.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="p-5 rounded-3xl bg-white dark:bg-[#152232] border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700" />
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        /* Companies Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredCompanies.map((company) => {
            const canonicalPath = getCompanyCanonicalPath(company.name);
            const isTopTier = (company.rank || 999) <= 10;
            return (
              <a
                key={company.id}
                href={canonicalPath}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCompany(company.name);
                }}
                className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#152232] border transition-all group flex flex-col justify-between space-y-3 cursor-pointer hover:shadow-lg ${
                  isTopTier
                    ? 'border-[#14967F]/40 dark:border-[#2DD4BF]/40 shadow-xs'
                    : 'border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${
                    isTopTier ? 'bg-[#095D7E] text-[#E2FCD6]' : 'bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF]'
                  }`}>
                    <Building2 className="w-5 h-5" />
                  </div>

                  {getRankBadge(company.rank)}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-[#095D7E] dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors line-clamp-2">
                    {company.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">
                      {company.brandCount} {lang === 'en' ? 'medicines' : 'টি ওষুধ'}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-[#14967F] dark:text-[#2DD4BF]">
                      <span>{lang === 'en' ? 'View' : 'দেখুন'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      )}

    </div>
  );
};
