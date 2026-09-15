import React, { useState, useMemo } from 'react';
import {
  Pill,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  X,
  ExternalLink,
  CheckCircle2,
  Building2,
  Stethoscope,
  Info
} from 'lucide-react';
import { Medicine, GenericMonograph, LanguageMode, GenericCombination } from '../../types';
import { getAllBrandsForGeneric, getGenericById, getGenericCombinations } from '../../data/dbEngine';
import { getDosageFormIconInfo } from '../../utils/dosageFormHelper';
import { getMedicineCanonicalPath, getGenericCanonicalPath } from '../../utils/urlHelper';
import { ChemicalStructure } from './ChemicalStructure';
import { GenericBrandsExplorer } from './GenericBrandsExplorer';

interface GenericDetailsPageProps {
  genericId: number;
  initialForm?: string;
  initialStrength?: string;
  onSelectMedicine: (med: Medicine) => void;
  onSelectGeneric: (generic: { id: number; name: string }) => void;
  onOpenBrandsExplorer?: (genericId: number, form?: string, strength?: string) => void;
  onBack: () => void;
  lang: LanguageMode;
  onToggleLang?: () => void;
}

export const GenericDetailsPage: React.FC<GenericDetailsPageProps> = ({
  genericId,
  initialForm,
  initialStrength,
  onSelectMedicine,
  onSelectGeneric,
  onOpenBrandsExplorer,
  onBack,
  lang,
  onToggleLang
}) => {
  const monograph = getGenericById(genericId);
  const allBrands = useMemo(() => getAllBrandsForGeneric(genericId), [genericId]);
  const genericName = monograph?.name || allBrands[0]?.genericName || 'Generic Substance';
  const genericNameBn = monograph?.nameBn || allBrands[0]?.genericNameBn || '';

  // Combinations
  const combinations = useMemo(() => getGenericCombinations(genericName), [genericName]);

  // Unique dosage forms for filtering
  const uniqueForms = useMemo(() => {
    const set = new Set<string>();
    allBrands.forEach((b) => {
      if (b.form && b.form.trim()) set.add(b.form.trim());
    });
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allBrands]);

  // Filtering and search state for brands
  const [brandSearch, setBrandSearch] = useState<string>('');
  const [selectedForm, setSelectedForm] = useState<string>(initialForm || 'All');
  const [selectedSort, setSelectedSort] = useState<'name' | 'price-low' | 'price-high'>('name');

  // Modals / Drawers state
  const [isMobileBrandsOpen, setIsMobileBrandsOpen] = useState<boolean>(false);
  const [isCombinationsOpen, setIsCombinationsOpen] = useState<boolean>(false);
  const [showFullExplorer, setShowFullExplorer] = useState<boolean>(false);

  // Accordion toggle states for clinical monograph
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    indication: true,
    dosage: true,
    contraindication: false,
    sideEffect: false,
    precaution: false,
    pregnancy: false,
    overdose: false
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filtered brands list
  const filteredBrands = useMemo(() => {
    let list = [...allBrands];
    const q = brandSearch.trim().toLowerCase();

    if (q) {
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        b.company.toLowerCase().includes(q) ||
        b.strength.toLowerCase().includes(q)
      );
    }

    if (selectedForm !== 'All') {
      const formNorm = selectedForm.toLowerCase();
      list = list.filter((b) => b.form.toLowerCase() === formNorm);
    }

    if (selectedSort === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'price-low') {
      list.sort((a, b) => (a.mrp || 9999) - (b.mrp || 9999));
    } else if (selectedSort === 'price-high') {
      list.sort((a, b) => (b.mrp || 0) - (a.mrp || 0));
    }

    return list;
  }, [allBrands, brandSearch, selectedForm, selectedSort]);

  // Helper for bilingual content
  const t = (en: string, bn?: string) => (lang === 'bn' && bn ? bn : en);

  // Parse dosage section
  const doseText = t(monograph?.dose || '', monograph?.doseBn);
  const indicationText = t(monograph?.indication || '', monograph?.indicationBn);
  const contraText = t(monograph?.contraIndication || '', monograph?.contraIndicationBn);
  const sideEffectText = t(monograph?.sideEffect || '', monograph?.sideEffectBn);
  const precautionText = t(monograph?.precaution || '', monograph?.precautionBn);
  const pregnancyText = t(monograph?.pregnancyCategory || '', monograph?.pregnancyCategoryBn);
  const overdoseText = t(monograph?.overdose || '', monograph?.overdoseBn);

  // Common Questions (FAQs) dynamic list
  const faqs = useMemo(() => {
    const name = genericName;
    return [
      {
        q: lang === 'en' ? `What is ${name} used for?` : `${name} কী কাজে ব্যবহার করা হয়?`,
        a: indicationText || (lang === 'en'
          ? `${name} is an active pharmaceutical substance used for conditions diagnosed and indicated by registered physicians.`
          : `${name} একটি সক্রিয় ওষুধ উপাদান যা ডাক্তারের পরামর্শ অনুযায়ী নির্দিষ্ট উপসর্গে নির্দেশিত হয়।`)
      },
      {
        q: lang === 'en' ? `How should ${name} be taken?` : `${name} কীভাবে ও কখন সেবন করতে হয়?`,
        a: doseText || (lang === 'en'
          ? `Take ${name} strictly as prescribed by your doctor or pharmacist. Complete the recommended course.`
          : `ডাক্তারের প্রেসক্রিপশন অনুযায়ী সঠিক মাত্রায় ও সময়ে সেবন করুন। নির্দেশিত কোর্স সম্পন্ন করুন।`)
      },
      {
        q: lang === 'en' ? 'What should I do if I miss a dose?' : 'একটি ডোজ মিস করলে কী করা উচিত?',
        a: lang === 'en'
          ? `Take the missed dose as soon as you remember. If it is almost time for your next dose, skip the missed dose and continue with your regular schedule. Never take a double dose to make up for a missed one.`
          : `মনে পড়ার সাথে সাথেই মিস করা ডোজটি গ্রহণ করুন। তবে পরবর্তী ডোজের সময় কাছাকাছি হলে মিস করা ডোজটি বাদ দিন। কখনো ক্ষতিপূরণের জন্য একসাথে দ্বিগুণ ডোজ খাবেন না।`
      },
      {
        q: lang === 'en' ? `Is ${name} safe during pregnancy and breastfeeding?` : `গর্ভাবস্থায় বা স্তন্যদানকালে কি ${name} নিরাপদ?`,
        a: pregnancyText || (lang === 'en'
          ? `Consult your gynecologist or physician before taking ${name} during pregnancy or lactation to assess the benefit-risk balance.`
          : `গর্ভাবস্থায় বা স্তন্যদানকালে এই ওষুধ গ্রহণের পূর্বে অবশ্যই আপনার ডাক্তারের সাথে পরামর্শ করুন।`)
      },
      {
        q: lang === 'en' ? `What are the most common side effects of ${name}?` : `${name}-এর সাধারণ পার্শ্বপ্রতিক্রিয়া কী কী?`,
        a: sideEffectText || (lang === 'en'
          ? `Most patients tolerate ${name} well. Consult a doctor immediately if you develop unusual allergic reactions, rash, or persistent discomfort.`
          : `সাধারণত বেশিরভাগ রোগী ওষুধটি ভালোভাবে সহ্য করেন। অস্বাভাবিক অ্যালার্জি, ফুসকুড়ি বা সমস্যা দেখা দিলে দ্রুত ডাক্তারকে জানান।`)
      },
      {
        q: lang === 'en' ? `What precautions should I know about?` : `এই ওষুধের সাথে কী কী সতর্কতা মেনে চলা উচিত?`,
        a: precautionText || (lang === 'en'
          ? `Inform your physician of your complete medical history, especially liver, renal, or cardiovascular conditions, and any concurrent medications.`
          : `আপনার পূর্ববর্তী লিভার, কিডনি বা হৃদরোগের ইতিহাস এবং চলমান অন্যান্য সব ওষুধের বিবরণ ডাক্তারকে অবহিত করুন।`)
      },
      {
        q: lang === 'en' ? 'What should be done in case of an accidental overdose?' : 'ভুলবশত অতিরিক্ত মাত্রায় ওষুধ খেলে কী করবেন?',
        a: overdoseText || (lang === 'en'
          ? `An overdose requires immediate medical attention. Contact the nearest emergency hospital or toxicology center right away.`
          : `ওভারডোজ হলে অবিলম্বে নিকটস্থ জরুরি বিভাগে যোগাযোগ করুন অথবা বিষাক্ততাবিষয়ক চিকিৎসাকেন্দ্রে নিয়ে যান।`)
      }
    ];
  }, [genericName, indicationText, doseText, pregnancyText, sideEffectText, precautionText, overdoseText, lang]);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // If user toggled full explorer view
  if (showFullExplorer) {
    return (
      <div className="space-y-4">
        <GenericBrandsExplorer
          genericId={genericId}
          initialForm={selectedForm !== 'All' ? selectedForm : undefined}
          initialStrength={initialStrength}
          onSelectMedicine={onSelectMedicine}
          onBack={() => setShowFullExplorer(false)}
          lang={lang}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200 pb-16">
      
      {/* Top Header Card */}
      <section className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
        
        {/* Navigation & Controls Row */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3 flex-wrap">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#14967F] dark:text-[#2DD4BF] hover:underline cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'en' ? 'Back' : 'ফিরে যান'}</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14967F]" />
              <span>{lang === 'en' ? 'Verified Generic' : 'ভেরিফাইড জেনেরিক'}</span>
            </span>

            {onToggleLang && (
              <button
                onClick={onToggleLang}
                className="text-xs font-black px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[#095D7E] dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'বাংলা' : 'English'}
              </button>
            )}
          </div>
        </div>

        {/* Generic Title & Meta Badges */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[#14967F] dark:text-[#2DD4BF]">
                  <Pill className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {genericName}
                </h1>
              </div>

              {genericNameBn && (
                <p className="text-base sm:text-lg font-extrabold text-[#14967F] dark:text-[#2DD4BF] mt-1 pl-1">
                  {genericNameBn}
                </p>
              )}
            </div>

            {/* Quick Stats Pill Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                <Building2 className="w-3.5 h-3.5 text-[#14967F]" />
                <span><strong>{allBrands.length}</strong> {lang === 'en' ? 'Brands in BD' : 'টি ব্র্যান্ড'}</span>
              </span>

              {uniqueForms.length > 1 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700">
                  <Layers className="w-3.5 h-3.5 text-[#14967F]" />
                  <span><strong>{uniqueForms.length - 1}</strong> {lang === 'en' ? 'Dosage Forms' : 'ডোজ ফর্ম'}</span>
                </span>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS (Specified by user) */}
          <div className="pt-2 flex items-center gap-2.5 flex-wrap">
            
            {/* 1. "Available Brands" Button (Mobile Version Only - On PC it's shown in Right Sidebar) */}
            <button
              onClick={() => setIsMobileBrandsOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#095D7E] hover:bg-[#074760] text-white text-xs sm:text-sm font-black shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Pill className="w-4 h-4 text-[#2DD4BF]" />
              <span>{lang === 'en' ? 'Available Brands' : 'এভেইলেবল ব্র্যান্ডস'}</span>
              <span className="bg-white/20 text-white text-[11px] font-mono px-2 py-0.5 rounded-full">
                {allBrands.length}
              </span>
            </button>

            {/* 2. "Other Combinations" Button (Mobile and PC) */}
            <button
              onClick={() => setIsCombinationsOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-black shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'en' ? 'Other Combinations' : 'আদার কম্বিনেশনস'}</span>
              {combinations.length > 0 && (
                <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-[11px] font-mono px-2 py-0.5 rounded-full">
                  {combinations.length}
                </span>
              )}
            </button>

            {/* Link to Full Table Explorer (PC Desktop Helper) */}
            <button
              onClick={() => {
                if (onOpenBrandsExplorer) {
                  onOpenBrandsExplorer(genericId, selectedForm !== 'All' ? selectedForm : undefined, initialStrength);
                } else {
                  setShowFullExplorer(true);
                }
              }}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-slate-600 dark:text-slate-300 hover:text-[#095D7E] dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Compare Brands in Table' : 'টেবিলে তুলনা করুন'}</span>
            </button>

          </div>
        </div>

      </section>

      {/* Main Grid Layout: Left Column (Clinical Details) + Right Sidebar (Available Brands on PC) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* PRIMARY COLUMN (lg:col-span-8) - CLINICAL MONOGRAPH & DETAILS */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* SECTION 1: CLINICAL MONOGRAPH ACCORDIONS */}
          <section className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#14967F]" />
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  {lang === 'en' ? 'Clinical Monograph & Prescribing Details' : 'ক্লিনিক্যাল মোনোগ্রাফ ও নির্দেশিকা'}
                </h2>
              </div>
              <span className="text-[11px] font-bold text-slate-400">DGDA Reference</span>
            </div>

            <div className="space-y-2">
              
              {/* 1. Indications */}
              {indicationText && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('indication')}
                    className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? 'Indications & Uses' : 'নির্দেশনা (Indications)'}
                      </span>
                    </div>
                    {openAccordions.indication ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openAccordions.indication && (
                    <div className="p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 whitespace-pre-line">
                      {indicationText}
                    </div>
                  )}
                </div>
              )}

              {/* 2. Dosage & Administration */}
              {doseText && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('dosage')}
                    className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Pill className="w-4 h-4 text-[#095D7E] dark:text-[#2DD4BF] shrink-0" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? 'Dosage & Administration' : 'ডোজ ও সেবনবিধি (Dosage)'}
                      </span>
                    </div>
                    {openAccordions.dosage ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openAccordions.dosage && (
                    <div className="p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 whitespace-pre-line space-y-2">
                      <div>{doseText}</div>
                      <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        * {lang === 'en' ? 'Strictly follow the dosage prescribed by a registered physician.' : 'রেজিস্টার্ড চিকিৎসকের দেওয়া ডোজ সতর্কতার সাথে অনুসরণ করুন।'}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* 3. Contraindications */}
              {contraText && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('contraindication')}
                    className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? 'Contraindications' : 'প্রতিনির্দেশনা (Contraindications)'}
                      </span>
                    </div>
                    {openAccordions.contraindication ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openAccordions.contraindication && (
                    <div className="p-3.5 text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed border-t border-rose-100 dark:border-rose-950/40 bg-rose-50/50 dark:bg-rose-950/20 whitespace-pre-line">
                      {contraText}
                    </div>
                  )}
                </div>
              )}

              {/* 4. Side Effects */}
              {sideEffectText && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('sideEffect')}
                    className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? 'Side Effects' : 'পার্শ্বপ্রতিক্রিয়া (Side Effects)'}
                      </span>
                    </div>
                    {openAccordions.sideEffect ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openAccordions.sideEffect && (
                    <div className="p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 whitespace-pre-line">
                      {sideEffectText}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Precautions & Warnings */}
              {precautionText && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('precaution')}
                    className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? 'Precautions & Warnings' : 'সতর্কতা (Precautions)'}
                      </span>
                    </div>
                    {openAccordions.precaution ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openAccordions.precaution && (
                    <div className="p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 whitespace-pre-line">
                      {precautionText}
                    </div>
                  )}
                </div>
              )}

              {/* 6. Pregnancy & Lactation */}
              {pregnancyText && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('pregnancy')}
                    className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#14967F] shrink-0" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? 'Pregnancy & Lactation' : 'গর্ভাবস্থায় ও স্তন্যদানকালে ব্যবহার'}
                      </span>
                    </div>
                    {openAccordions.pregnancy ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openAccordions.pregnancy && (
                    <div className="p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 whitespace-pre-line">
                      {pregnancyText}
                    </div>
                  )}
                </div>
              )}

              {/* 7. Overdose & Emergency */}
              {overdoseText && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleAccordion('overdose')}
                    className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'en' ? 'Overdose Effects & Management' : 'ওভারডোজ ও জরুরি চিকিৎসা'}
                      </span>
                    </div>
                    {openAccordions.overdose ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openAccordions.overdose && (
                    <div className="p-3.5 text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed border-t border-rose-100 dark:border-rose-950/40 bg-rose-50/50 dark:bg-rose-950/20 whitespace-pre-line">
                      {overdoseText}
                    </div>
                  )}
                </div>
              )}

            </div>
          </section>

          {/* SECTION 2: CHEMICAL STRUCTURE (Explicitly requested for mobile & desktop) */}
          <ChemicalStructure genericName={genericName} lang={lang} />

          {/* SECTION 3: COMMON QUESTIONS / FAQS (Explicitly requested by user) */}
          <section className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
              <HelpCircle className="w-4 h-4 text-[#14967F]" />
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {lang === 'en' ? `Frequently Asked Questions about ${genericName}` : `${genericName} সম্পর্কিত সাধারণ জিজ্ঞাসা (FAQs)`}
              </h2>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full py-3 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 pr-2">
                        {faq.q}
                      </span>
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#14967F] shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="p-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 whitespace-pre-line">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Medical Disclaimer Note */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[11px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-[#14967F] shrink-0 mt-0.5" />
              <span>
                {lang === 'en'
                  ? 'The medical information provided is for educational purposes only. Always consult a registered medical doctor before starting, stopping, or altering any medication.'
                  : 'প্রদর্শিত তথ্য শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে প্রদান করা হয়েছে। কোনো ওষুধ শুরু বা বন্ধ করার আগে সর্বদা রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন।'}
              </span>
            </div>
          </section>

        </div>

        {/* SECONDARY COLUMN (lg:col-span-4) - PC DESKTOP "AVAILABLE BRANDS" SIDEBAR */}
        {/* User requested: On PC, show Available Brands on the right side. On mobile, this section is hidden, instead mobile has the top button. */}
        <aside className="hidden lg:block lg:col-span-4 space-y-3 sticky top-24">
          <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 space-y-3 transition-colors">
            
            {/* Header with Brand Count */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-[#14967F] dark:text-[#2DD4BF]" />
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {lang === 'en' ? 'Available Brands' : 'এভেইলেবল ব্র্যান্ডস'}
                </h3>
              </div>
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {filteredBrands.length} {lang === 'en' ? 'of' : '/'} {allBrands.length}
              </span>
            </div>

            {/* In-sidebar Search Filter */}
            <div className="relative">
              <input
                type="text"
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                placeholder={lang === 'en' ? 'Search brands by name or company...' : 'ব্র্যান্ড বা কোম্পানি খুঁজুন...'}
                className="w-full text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-7 py-2 focus:outline-none focus:border-[#14967F]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              {brandSearch && (
                <button onClick={() => setBrandSearch('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dosage Form Tabs Filter */}
            {uniqueForms.length > 2 && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                {uniqueForms.map((form) => (
                  <button
                    key={form}
                    onClick={() => setSelectedForm(form)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer border ${
                      selectedForm === form
                        ? 'bg-[#095D7E] text-white border-[#095D7E]'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#14967F]'
                    }`}
                  >
                    {form}
                  </button>
                ))}
              </div>
            )}

            {/* Scrollable Brands List */}
            <div className="max-h-[540px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 pr-1 space-y-1">
              {filteredBrands.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-slate-400">
                  {lang === 'en' ? 'No matching brands found' : 'কোনো ব্র্যান্ড পাওয়া যায়নি'}
                </div>
              ) : (
                filteredBrands.map((brand) => {
                  const icon = getDosageFormIconInfo(brand.form);
                  return (
                    <a
                      key={brand.id}
                      href={getMedicineCanonicalPath(brand)}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectMedicine(brand);
                      }}
                      className="p-2.5 hover:bg-[#F1F9FF] dark:hover:bg-slate-800/60 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group block"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <img src={icon.iconPath} alt={brand.form} className="w-4 h-4 object-contain shrink-0" loading="lazy" />
                          <span className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-[#095D7E] dark:group-hover:text-[#2DD4BF] transition-colors truncate">
                            {brand.name}
                          </span>
                          <span className="text-[10px] font-extrabold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-1.5 py-0.5 rounded font-mono">
                            {brand.strength}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {brand.company}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">MRP</div>
                        <div className="text-xs sm:text-sm font-black text-[#14967F] dark:text-[#2DD4BF] font-mono">
                          ৳{brand.mrp.toFixed(2)}
                        </div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>

            {/* Bottom button: Open full explorer table */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <button
                onClick={() => {
                  if (onOpenBrandsExplorer) {
                    onOpenBrandsExplorer(genericId, selectedForm !== 'All' ? selectedForm : undefined, initialStrength);
                  } else {
                    setShowFullExplorer(true);
                  }
                }}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <Layers className="w-3.5 h-3.5 text-[#14967F]" />
                <span>{lang === 'en' ? 'Open Detailed Brands Explorer' : 'বিস্তারিত ব্র্যান্ড এক্সপ্লোরার খুলুন'}</span>
              </button>
            </div>

          </div>
        </aside>

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: MOBILE AVAILABLE BRANDS DRAWER / MODAL (lg:hidden) */}
      {/* ========================================================================= */}
      {isMobileBrandsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end lg:hidden animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#131B2E] rounded-t-3xl max-h-[85vh] flex flex-col border-t border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                    {lang === 'en' ? 'Available Brands' : 'এভেইলেবল ব্র্যান্ডস'}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {genericName} • {allBrands.length} {lang === 'en' ? 'Brands found' : 'টি ব্র্যান্ড'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMobileBrandsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search & Filter bar inside Drawer */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={brandSearch}
                  onChange={(e) => setBrandSearch(e.target.value)}
                  placeholder={lang === 'en' ? 'Search brand name or company...' : 'ব্র্যান্ড বা কোম্পানি খুঁজুন...'}
                  className="w-full text-xs font-bold text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-7 py-2.5 focus:outline-none focus:border-[#14967F]"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                {brandSearch && (
                  <button onClick={() => setBrandSearch('')} className="absolute right-2.5 top-3 text-slate-400">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Form Filter Pills */}
              {uniqueForms.length > 2 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {uniqueForms.map((form) => (
                    <button
                      key={form}
                      onClick={() => setSelectedForm(form)}
                      className={`text-xs font-bold px-3 py-1 rounded-xl shrink-0 transition-colors cursor-pointer border ${
                        selectedForm === form
                          ? 'bg-[#095D7E] text-white border-[#095D7E]'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {form}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Brands List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 p-2">
              {filteredBrands.length === 0 ? (
                <div className="py-12 text-center text-xs font-bold text-slate-400">
                  {lang === 'en' ? 'No matching brands found' : 'কোনো ব্র্যান্ড পাওয়া যায়নি'}
                </div>
              ) : (
                filteredBrands.map((brand) => {
                  const icon = getDosageFormIconInfo(brand.form);
                  return (
                    <a
                      key={brand.id}
                      href={getMedicineCanonicalPath(brand)}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMobileBrandsOpen(false);
                        onSelectMedicine(brand);
                      }}
                      className="p-3 hover:bg-[#F1F9FF] dark:hover:bg-slate-800/60 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer block"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <img src={icon.iconPath} alt={brand.form} className="w-4 h-4 object-contain shrink-0" loading="lazy" />
                          <span className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                            {brand.name}
                          </span>
                          <span className="text-[10px] font-extrabold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-1.5 py-0.5 rounded font-mono">
                            {brand.strength} {brand.form}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {brand.company}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">MRP</div>
                        <div className="text-xs sm:text-sm font-black text-[#14967F] dark:text-[#2DD4BF] font-mono">
                          ৳{brand.mrp.toFixed(2)}
                        </div>
                      </div>
                    </a>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: OTHER COMBINATIONS MODAL */}
      {/* ========================================================================= */}
      {isCombinationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#131B2E] rounded-3xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    {lang === 'en' ? 'Other Combinations' : 'আদার কম্বিনেশনস'}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? `Combination drugs containing ${genericName}` : `${genericName}-এর সমন্বিত ওষুধসমূহ`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCombinationsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Combinations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-1 pr-1">
              {combinations.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Pill className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {lang === 'en' ? 'No other combination formulations found' : 'অন্য কোনো কম্বিনেশন ফর্মুলেশন পাওয়া যায়নি'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {lang === 'en'
                      ? `${genericName} is primarily formulated as a single active ingredient in the Bangladesh market.`
                      : `${genericName} মূলত একক উপাদান হিসেবে বাংলাদেশের বাজারে প্রচলিত।`}
                  </p>
                </div>
              ) : (
                combinations.map((combo) => (
                  <a
                    key={combo.id}
                    href={getGenericCanonicalPath(combo)}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCombinationsOpen(false);
                      onSelectGeneric(combo);
                    }}
                    className="p-3 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group block"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors">
                        {combo.name}
                      </div>
                      {combo.nameBn && (
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {combo.nameBn}
                        </div>
                      )}
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        {combo.brandCount} {combo.brandCount === 1 ? 'Brand available' : 'Brands available'}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-black text-[#14967F] dark:text-[#2DD4BF]">
                      <span>{lang === 'en' ? 'View' : 'দেখুন'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setIsCombinationsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
