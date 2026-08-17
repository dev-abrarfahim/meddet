import React, { useState } from 'react';
import {
  Search,
  Pill,
  ArrowRight,
  Activity,
  HeartPulse,
  Layers,
  Building2,
  Stethoscope,
  Grid
} from 'lucide-react';
import { Medicine, LanguageMode } from '../../types';
import { searchMedicines, getAllCompanies } from '../../data/dbEngine';
import { DOSAGE_FORM_CATEGORIES } from '../../utils/dosageFormHelper';
import { getDosageFormCanonicalPath, getCompanyCanonicalPath } from '../../utils/urlHelper';

interface HomeLandingProps {
  onGoToSearch: (query?: string, category?: string, manufacturer?: string, dosageForm?: string) => void;
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
      <section className="relative overflow-hidden rounded-2xl bg-[#095D7E] dark:bg-[#0B1927] text-white p-4 sm:p-10 md:p-12 shadow-xl border border-[#074760]/60 dark:border-[#1E3A52]">
        
        {/* Hero Background Image (Optimized WebP with Fallback) */}
        <picture>
          <source srcSet="/hero-bg.webp" type="image/webp" />
          <img
            src="/hero-bg.jpg"
            alt="MedVhai banner background"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-35 dark:opacity-25 pointer-events-none select-none"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        {/* Professional Multi-Layer Overlay for Legibility & Brand Tone */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#095D7E]/75 via-[#074760]/70 to-[#042C3C]/80 dark:from-[#0B1927]/85 dark:via-[#0E2439]/80 dark:to-[#07131F]/90 pointer-events-none" />

        {/* Decorative Ambient Shapes */}
        <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-[#14967F]/25 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-[#CCECEE]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">

          {/* Main Hero Heading */}
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white">
            {lang === 'en' ? 'Search Medicines & Generic Brands' : 'ওষুধ ও জেনেরিক ব্রান্ড অনুসন্ধান করুন'}
          </h1>

          {/* Main Hero Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-[#CCECEE] dark:text-slate-300 font-semibold max-w-3xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Find active ingredients, verified MRP prices in ৳ BDT, generic brand alternatives, and complete clinical monographs in English & Bangla.'
              : 'ওষুধের বিবরণ, এমআরপি মূল্য, বিকল্প জেনেরিক ব্রান্ড এবং সম্পূর্ণ নির্দেশিকা বাংলা ও ইংরেজিতে দেখুন।'}
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="flex items-center gap-2 bg-white dark:bg-[#152232] p-2 sm:p-2.5 rounded-2xl shadow-2xl border-2 border-[#CCECEE] dark:border-[#243B53] focus-within:border-[#14967F] dark:focus-within:border-[#2DD4BF] transition-all">
              <div className="pl-2.5 text-[#14967F] dark:text-[#2DD4BF]">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search brand (Napa, Seclo, Maxpro) or generic...' : 'ব্র্যান্ড বা জেনেরিক নাম (Napa, Seclo, Paracetamol)...'}
                className="w-full text-sm sm:text-base md:text-lg font-bold text-[#095D7E] dark:text-slate-100 placeholder-[#095D7E]/50 dark:placeholder-slate-400 bg-transparent focus:outline-none py-2 px-1"
                id="hero-medicine-search-input"
                aria-label="Search medicine by brand or generic name"
              />
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="bg-[#14967F] dark:bg-[#2DD4BF] hover:bg-[#11806C] dark:hover:bg-[#14967F] text-[#E2FCD6] dark:text-slate-950 font-black text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Search' : 'খুঁজুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

      </section>

      {/* DOSAGE FORM CATEGORY EXPLORER (10 Distinct Types with Custom Icons & Counts) */}
      <section className="space-y-3.5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Grid className="w-5 h-5 sm:w-6 sm:h-6 text-[#14967F]" />
            <span>{lang === 'en' ? 'Browse by Dosage Form' : 'ওষুধের ক্যাটাগরি ও রূপ অনুযায়ী খুঁজুন'}</span>
          </h2>
          <a
            href="/?tab=search"
            onClick={(e) => {
              e.preventDefault();
              onGoToSearch();
            }}
            className="text-xs sm:text-sm font-black text-[#14967F] dark:text-[#2DD4BF] hover:underline cursor-pointer"
          >
            {lang === 'en' ? 'View All Forms' : 'সব ফর্ম দেখুন'} →
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {DOSAGE_FORM_CATEGORIES.map((formCat) => {
            return (
              <a
                key={formCat.id}
                href={getDosageFormCanonicalPath(formCat.id)}
                onClick={(e) => {
                  e.preventDefault();
                  onGoToSearch(undefined, undefined, undefined, formCat.id);
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex flex-col justify-between space-y-3 shadow-xs group ${formCat.color}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-10 h-10 rounded-xl bg-white/90 dark:bg-black/30 flex items-center justify-center shadow-inner shrink-0 group-hover:bg-[#14967F] group-hover:text-white transition-colors">
                    <img src={formCat.iconPath} alt={formCat.name} className="w-7 h-7 object-contain" loading="lazy" />
                  </div>

                  <span className="text-xs font-black font-mono px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-black/30 border border-current/20">
                    {formCat.count}
                  </span>
                </div>

                <div>
                  <div className="text-sm sm:text-base font-black leading-snug group-hover:text-[#14967F] transition-colors">
                    {lang === 'en' ? formCat.name : formCat.nameBn}
                  </div>
                  <div className="text-xs opacity-80 font-extrabold mt-1">
                    {lang === 'en' ? 'Explore Index' : 'খুঁজুন'} →
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* CONDITION CATEGORY EXPLORER SECTION (Compact Grid) */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-[#14967F]" />
            <span>{lang === 'en' ? 'Browse by Medical Condition' : 'রোগ অনুযায়ী খুঁজুন'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoriesList.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <a
                key={idx}
                href={`/?category=${encodeURIComponent(cat.name)}`}
                onClick={(e) => {
                  e.preventDefault();
                  onGoToSearch(undefined, cat.name);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2.5 ${cat.color}`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-black/20 flex items-center justify-center shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-black truncate">{cat.label}</div>
                  <div className="text-[11px] opacity-85 font-extrabold">{lang === 'en' ? 'Explore' : 'দেখুন'} →</div>
                </div>
              </a>
            );
          })}
        </div>
      </section>

      {/* TOP PHARMA MANUFACTURERS */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-xl md:text-2xl font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <img src="/icons/pharmaceutical.webp" alt="Pharma Manufacturers" className="w-6 h-6 sm:w-7 sm:h-7 object-contain shrink-0" loading="lazy" />
            <span>{lang === 'en' ? 'Top Pharma Manufacturers' : 'শীর্ষ ফার্মাসিউটিক্যালস'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {topCompanies.map((comp) => (
            <a
              key={comp.id}
              href={getCompanyCanonicalPath(comp.name)}
              onClick={(e) => {
                e.preventDefault();
                onGoToSearch(undefined, undefined, comp.name);
              }}
              className="p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800/80 text-left hover:border-[#14967F] transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-700/60 group-hover:bg-[#E2FCD6] dark:group-hover:bg-[#064E3B] transition-colors">
                  <img src="/icons/pharmaceutical.webp" alt={comp.name} className="w-5 h-5 object-contain shrink-0" loading="lazy" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors truncate">{comp.name}</div>
                  <div className="text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] mt-0.5 font-mono">
                    {comp.brandCount} Brands
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

    </div>
  );
};
