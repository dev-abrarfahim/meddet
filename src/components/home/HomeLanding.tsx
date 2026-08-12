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
  Flame,
  Stethoscope
} from 'lucide-react';
import { Medicine, LanguageMode } from '../../types';
import { getDatabaseStats, searchMedicines, getAllCompanies } from '../../data/dbEngine';

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
  const stats = getDatabaseStats();

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
    <div className="space-y-10 sm:space-y-14 animate-in fade-in duration-300">
      
      {/* HERO BANNER SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#095D7E] via-[#074760] to-[#042C3C] dark:from-[#0B1927] dark:via-[#0E2439] dark:to-[#07131F] text-white p-6 sm:p-10 md:p-14 shadow-2xl border border-[#074760] dark:border-[#1E3A52]">
        
        {/* Decorative Ambient Shapes */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#14967F]/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-[#CCECEE]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          
          {/* Top Pill Tagline */}
          <div className="inline-flex items-center gap-2 bg-[#14967F]/30 dark:bg-[#2DD4BF]/20 border border-[#CCECEE]/30 dark:border-[#2DD4BF]/40 text-[#E2FCD6] dark:text-[#2DD4BF] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full shadow-inner">
            <ShieldCheck className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF]" />
            <span>{lang === 'en' ? 'Official Bangladeshi Drug Index' : 'অফিসিয়াল বাংলাদেশী ড্রাগ ইনডেক্স'}</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-white font-sans">
            {lang === 'en' ? 'Search 30,500+ Medicines & Generic Brands' : '৩০,৫০০+ ওষুধ ও জেনেরিক ব্রান্ড অনুসন্ধান করুন'}
          </h1>

          {/* Main Hero Subtitle */}
          <p className="text-sm sm:text-lg md:text-xl text-[#CCECEE] dark:text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            {lang === 'en'
              ? 'Find active ingredients, official MRP prices in ৳ BDT, generic brand alternatives, and complete clinical monographs in English & Bangla.'
              : 'ওষুধের বিবরণ, অফিসিয়াল এমআরপি মূল্য, বিকল্প জেনেরিক ব্রান্ড এবং সম্পূর্ণ নির্দেশিকা বাংলা ও ইংরেজিতে দেখুন।'}
          </p>

          {/* Search Box Form */}
          <form onSubmit={handleHeroSearchSubmit} className="max-w-2xl mx-auto pt-2">
            <div className="flex items-center gap-2 bg-white dark:bg-[#152232] p-2 rounded-2xl shadow-2xl border-2 border-[#CCECEE] dark:border-[#243B53] focus-within:border-[#14967F] dark:focus-within:border-[#2DD4BF] transition-all">
              <div className="pl-3 text-[#14967F] dark:text-[#2DD4BF]">
                <Search className="w-6 h-6" />
              </div>
              <input
                type="text"
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder={lang === 'en' ? 'Search by brand (Napa, Seclo, Maxpro) or generic (Paracetamol)...' : 'ব্র্যান্ড বা জেনেরিক নাম লিখুন (যেমন: Napa, Seclo, Paracetamol)...'}
                className="w-full text-sm sm:text-base font-semibold text-[#095D7E] dark:text-slate-100 placeholder-[#095D7E]/50 dark:placeholder-slate-400 bg-transparent focus:outline-none py-2 px-1"
                id="hero-medicine-search-input"
              />
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="bg-[#14967F] dark:bg-[#2DD4BF] hover:bg-[#11806C] dark:hover:bg-[#14967F] text-[#E2FCD6] dark:text-slate-950 font-black text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Search Index' : 'খুঁজুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Stats Grid */}
          <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-6 max-w-2xl mx-auto border-t border-white/10">
            <div className="space-y-0.5">
              <div className="text-xl sm:text-3xl font-black text-[#E2FCD6] dark:text-[#2DD4BF]">
                {stats.totalBrands.toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs text-[#CCECEE] dark:text-slate-400 font-semibold">
                {lang === 'en' ? 'Brand Medicines' : 'ব্র্যান্ড ওষুধ'}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-3xl font-black text-[#E2FCD6] dark:text-[#2DD4BF]">
                {stats.totalGenerics.toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs text-[#CCECEE] dark:text-slate-400 font-semibold">
                {lang === 'en' ? 'Generic Monographs' : 'জেনেরিক উপাদান'}
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xl sm:text-3xl font-black text-[#E2FCD6] dark:text-[#2DD4BF]">
                {stats.totalCompanies.toLocaleString()}
              </div>
              <div className="text-[11px] sm:text-xs text-[#CCECEE] dark:text-slate-400 font-semibold">
                {lang === 'en' ? 'Pharma Companies' : 'ফার্মাসিউটিক্যালস'}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK CATEGORY SEARCH */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>{lang === 'en' ? 'Popular Therapeutic Indications' : 'জনপ্রিয় চিকিৎসাগত ক্যাটাগরি'}</span>
          </h2>
          <button
            onClick={() => onGoToSearch()}
            className="text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] hover:underline flex items-center gap-1"
          >
            <span>{lang === 'en' ? 'View All Medicines' : 'সব ওষুধ দেখুন'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {categoriesList.map((cat) => {
            const IconComp = cat.icon;
            return (
              <button
                key={cat.name}
                onClick={() => onGoToSearch(cat.name)}
                className={`p-4 rounded-2xl border ${cat.color} hover:scale-[1.02] transition-all text-left flex flex-col justify-between space-y-3 shadow-xs cursor-pointer`}
              >
                <div className="w-9 h-9 rounded-xl bg-white/80 dark:bg-black/30 flex items-center justify-center shadow-xs">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-snug">{cat.name}</h3>
                  <p className="text-[11px] opacity-80 mt-0.5">{cat.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED POPULAR MEDICINES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Pill className="w-5 h-5 text-[#14967F]" />
            <span>{lang === 'en' ? 'Featured Medicines' : 'ফিচার্ড ওষুধসমূহ'}</span>
          </h2>
          <button
            onClick={() => onGoToSearch()}
            className="text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] hover:underline flex items-center gap-1"
          >
            <span>{lang === 'en' ? 'Search Full Index' : 'সম্পূর্ণ ইনডেক্স খুঁজুন'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredMedicines.map((med) => (
            <div
              key={med.id}
              onClick={() => onSelectMedicine(med)}
              className="bg-white dark:bg-[#152232] p-5 rounded-2xl border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] dark:hover:border-[#2DD4BF] shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#14967F] dark:text-[#2DD4BF] bg-[#F1F9FF] dark:bg-[#1A2B3E] px-2 py-0.5 rounded-md border border-[#CCECEE] dark:border-[#243B53]">
                    {med.form} • {med.strength}
                  </span>
                  <h3 className="text-lg font-black text-[#095D7E] dark:text-slate-100 mt-1.5">
                    {med.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">MRP Price</div>
                  <div className="text-base font-black text-[#14967F] dark:text-[#2DD4BF]">৳{med.mrp.toFixed(2)}</div>
                </div>
              </div>

              <div className="text-xs text-[#095D7E]/70 dark:text-slate-400 space-y-1">
                <div><span className="font-bold">{lang === 'en' ? 'Generic:' : 'জেনেরিক:'}</span> {lang === 'bn' && med.genericNameBn ? med.genericNameBn : med.genericName}</div>
                <div><span className="font-bold">{lang === 'en' ? 'Company:' : 'কোম্পানি:'}</span> {med.company}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TOP PHARMACEUTICAL COMPANIES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#14967F]" />
            <span>{lang === 'en' ? 'Top Pharmaceutical Manufacturers' : 'শীর্ষ ফার্মাসিউটিক্যাল কোম্পানি'}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {topCompanies.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onGoToSearch(undefined, undefined, comp.name)}
              className="p-3.5 bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] transition-all text-left space-y-1 cursor-pointer"
            >
              <div className="font-bold text-xs sm:text-sm text-[#095D7E] dark:text-slate-200 truncate">
                {comp.name}
              </div>
              <div className="text-[11px] text-[#14967F] dark:text-[#2DD4BF] font-semibold">
                {comp.brandCount} {lang === 'en' ? 'Medicines' : 'ওষুধ'}
              </div>
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};
