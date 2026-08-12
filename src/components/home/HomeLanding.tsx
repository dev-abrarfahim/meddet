import React, { useState } from 'react';
import {
  Search,
  Pill,
  ShieldCheck,
  ArrowRight,
  Activity,
  HeartPulse,
  Layers,
  Building2,
  Stethoscope
} from 'lucide-react';
import { Medicine, LanguageMode } from '../../types';
import { searchMedicines, getAllCompanies } from '../../data/dbEngine';

interface HomeLandingProps {
  onGoToSearch: (query?: string, category?: string, manufacturer?: string) => void;
  onSelectMedicine: (med: Medicine) => void;
  lang: LanguageMode;
}

export const HomeLanding: React.FC<HomeLandingProps> = ({
  onGoToSearch,
  onSelectMedicine,
  lang
}) => {
  const [heroQuery, setHeroQuery] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGoToSearch(heroQuery);
  };

  // Sample top featured medicines from database
  const featuredMedicines = searchMedicines('Napa', 'All', {}, 1, 6).items;

  // Top manufacturers
  const topCompanies = getAllCompanies()
    .filter((c) => c.brandCount > 100)
    .slice(0, 8);

  const categoriesList = [
    { name: 'Ulcer', label: lang === 'en' ? 'Acid Reflux & Ulcer' : 'এসিড রিফ্লাক্স ও আলসার', icon: Pill, color: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' },
    { name: 'Pain', label: lang === 'en' ? 'Pain Relief & Fever' : 'ব্যথানাশক ও জ্বর', icon: HeartPulse, color: 'bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] border-[#CCECEE] dark:border-[#243B53]' },
    { name: 'Infection', label: lang === 'en' ? 'Infection & Antibiotics' : 'সংক্রমণ ও অ্যান্টিবায়োটিক', icon: Stethoscope, color: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
    { name: 'Hypertension', label: lang === 'en' ? 'Blood Pressure & Heart' : 'রক্তচাপ ও হৃদরোগ', icon: Activity, color: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
    { name: 'Asthma', label: lang === 'en' ? 'Asthma & Respiratory' : 'অ্যাজমা ও শ্বাসকষ্ট', icon: Layers, color: 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800' }
  ];

  return (
    <div className="space-y-4 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* HERO BANNER SECTION (Clean & Modern Layout) */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#095D7E] via-[#074760] to-[#042C3C] dark:from-[#0B1927] dark:via-[#0E2439] dark:to-[#07131F] text-white p-3.5 sm:p-8 md:p-10 shadow-xl border border-[#074760] dark:border-[#1E3A52]">
        
        {/* Decorative Ambient Shapes */}
        <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-[#14967F]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-[#CCECEE]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3 sm:space-y-5">
          
          {/* Top Pill Tagline */}
          <div className="inline-flex items-center gap-1.5 bg-[#14967F]/30 dark:bg-[#2DD4BF]/20 border border-[#CCECEE]/30 dark:border-[#2DD4BF]/40 text-[#E2FCD6] dark:text-[#2DD4BF] text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2FCD6] dark:text-[#2DD4BF]" />
            <span>{lang === 'en' ? 'Clinical Medicine Index' : 'ক্লিনিক্যাল ড্রাগ ইনডেক্স'}</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            {lang === 'en' ? 'Search Medicines & Generic Brands' : 'ওষুধ ও জেনেরিক ব্রান্ড অনুসন্ধান করুন'}
          </h1>

          {/* Main Hero Subtitle */}
          <p className="text-xs sm:text-base text-[#CCECEE] dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Find active ingredients, verified MRP prices in ৳ BDT, generic brand alternatives, and complete clinical monographs in English & Bangla.'
              : 'ওষুধের বিবরণ, এমআরপি মূল্য, বিকল্প জেনেরিক ব্রান্ড এবং সম্পূর্ণ নির্দেশিকা বাংলা ও ইংরেজিতে দেখুন।'}
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl mx-auto pt-1">
            <div className="flex items-center gap-1.5 bg-white dark:bg-[#152232] p-1.5 rounded-xl shadow-xl border-2 border-[#CCECEE] dark:border-[#243B53] focus-within:border-[#14967F] dark:focus-within:border-[#2DD4BF] transition-all">
              <div className="pl-2 text-[#14967F] dark:text-[#2DD4BF]">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search brand (Napa, Seclo, Maxpro) or generic (Paracetamol)...' : 'ব্র্যান্ড বা জেনেরিক নাম (Napa, Seclo, Paracetamol)...'}
                className="w-full text-xs sm:text-sm font-semibold text-[#095D7E] dark:text-slate-100 placeholder-[#095D7E]/50 dark:placeholder-slate-400 bg-transparent focus:outline-none py-1.5 px-1"
                id="hero-medicine-search-input"
              />
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="bg-[#14967F] dark:bg-[#2DD4BF] hover:bg-[#11806C] dark:hover:bg-[#14967F] text-[#E2FCD6] dark:text-slate-950 font-black text-xs px-3.5 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Search' : 'খুঁজুন'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

        </div>

      </section>

      {/* CATEGORY EXPLORER SECTION (Compact Grid) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-1.5">
            <Pill className="w-4 h-4 text-[#14967F]" />
            <span>{lang === 'en' ? 'Browse by Condition' : 'রোগ বা ক্যাটাগরি অনুযায়ী খুঁজুন'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {categoriesList.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => onGoToSearch(cat.name)}
                className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2 ${cat.color}`}
              >
                <div className="w-8 h-8 rounded-lg bg-white/80 dark:bg-black/20 flex items-center justify-center shrink-0">
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black truncate">{cat.label}</div>
                  <div className="text-[10px] opacity-80 font-bold">{lang === 'en' ? 'Explore' : 'দেখুন'} →</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED POPULAR MEDICINES */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-1.5">
            <Stethoscope className="w-4 h-4 text-[#14967F]" />
            <span>{lang === 'en' ? 'Popular Medicines' : 'জনপ্রিয় ওষুধসমূহ'}</span>
          </h2>
          <button
            onClick={() => onGoToSearch()}
            className="text-xs font-black text-[#14967F] dark:text-[#2DD4BF] hover:underline cursor-pointer"
          >
            {lang === 'en' ? 'View All' : 'সবগুলো দেখুন'} →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {featuredMedicines.map((med) => (
            <div
              key={med.id}
              onClick={() => onSelectMedicine(med)}
              className="bg-white dark:bg-[#131B2E] p-3 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-[#14967F] dark:hover:border-[#2DD4BF] transition-all cursor-pointer flex items-center justify-between gap-2 shadow-xs group"
            >
              <div>
                <span className="text-[10px] font-bold text-[#14967F] dark:text-[#2DD4BF] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                  {med.form} • {med.strength}
                </span>
                <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] transition-colors mt-1">
                  {med.name}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[200px]">
                  {med.genericName}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] font-bold text-slate-400">MRP</div>
                <div className="text-xs font-black text-slate-900 dark:text-slate-100 font-mono">
                  ৳ {med.mrp.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP PHARMA MANUFACTURERS */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-lg font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#14967F]" />
            <span>{lang === 'en' ? 'Top Pharma Manufacturers' : 'শীর্ষ ফার্মাসিউটিক্যালস'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {topCompanies.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onGoToSearch(undefined, undefined, comp.name)}
              className="p-2.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800/80 text-left hover:border-[#14967F] transition-all cursor-pointer shadow-xs"
            >
              <div className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">{comp.name}</div>
              <div className="text-[10px] font-bold text-[#14967F] dark:text-[#2DD4BF] mt-0.5 font-mono">
                {comp.brandCount} Brands
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
