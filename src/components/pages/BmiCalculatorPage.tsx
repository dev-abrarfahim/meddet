import React, { useState, useMemo } from 'react';
import { Gender, BmiCategoryKey } from '../../types/bmi';
import { calculateBmi } from '../../utils/bmiCalculator';
import { NavPills, NavTabId } from '../tools/bmi/NavPills';
import { BmiCalculatorCard } from '../tools/bmi/BmiCalculatorCard';
import { BodySilhouetteRow } from '../tools/bmi/BodySilhouetteRow';
import { BmiGauge } from '../tools/bmi/BmiGauge';
import { BmiDetailsFaq } from '../tools/bmi/BmiDetailsFaq';
import { TabPanels } from '../tools/bmi/TabPanels';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { LanguageMode } from '../../types';

interface BmiCalculatorPageProps {
  onNavigate?: (path: string) => void;
  lang: LanguageMode;
  onGoHome?: () => void;
}

export const BmiCalculatorPage: React.FC<BmiCalculatorPageProps> = ({
  onNavigate: _onNavigate,
  lang,
  onGoHome: _onGoHome
}) => {
  // Input form states - start empty (null) so no default values are shown
  const [inputAge, setInputAge] = useState<number | null>(null);
  const [inputGender, setInputGender] = useState<Gender>('male');
  const [inputHeightCm, setInputHeightCm] = useState<number | null>(null);
  const [inputWeightKg, setInputWeightKg] = useState<number | null>(null);

  // Calculated parameters - ONLY set when user clicks the "Calculate" button
  const [calculatedState, setCalculatedState] = useState<{
    age: number;
    gender: Gender;
    heightCm: number;
    weightKg: number;
  } | null>(null);

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<NavTabId>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState<boolean>(false);

  // Compute BMI Result strictly from calculatedState (no real-time recalculation while typing)
  const result = useMemo(() => {
    if (!calculatedState) return null;
    return calculateBmi(
      calculatedState.weightKg,
      calculatedState.heightCm,
      calculatedState.age,
      calculatedState.gender
    );
  }, [calculatedState]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // handleUpdate updates only the input form state (does not calculate)
  const handleUpdate = (params: { age: number | null; gender: Gender; heightCm: number | null; weightKg: number | null }) => {
    setInputAge(params.age);
    setInputGender(params.gender);
    setInputHeightCm(params.heightCm);
    setInputWeightKg(params.weightKg);
  };

  // handleCalculate commits the inputs to trigger calculation and smoothly scrolls to results
  const handleCalculate = () => {
    if (inputAge === null || inputHeightCm === null || inputWeightKg === null) {
      showToast(lang === 'en' ? 'Please enter your Age, Height, and Weight to calculate BMI' : 'বিএমআই হিসাব করতে বয়স, উচ্চতা ও ওজন প্রবেশ করান');
      return;
    }
    setCalculatedState({
      age: inputAge,
      gender: inputGender,
      heightCm: inputHeightCm,
      weightKg: inputWeightKg,
    });
    const calc = calculateBmi(inputWeightKg, inputHeightCm, inputAge, inputGender);
    showToast(`${lang === 'en' ? 'Calculated BMI' : 'হিসাবকৃত বিএমআই'}: ${calc.bmi} (${calc.category.label})`);

    // Scroll smoothly to results if on overview
    const element = document.getElementById('bmi-results-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setInputAge(null);
    setInputGender('male');
    setInputHeightCm(null);
    setInputWeightKg(null);
    setCalculatedState(null);
    showToast(lang === 'en' ? 'All fields cleared' : 'সকল তথ্য মুছে ফেলা হয়েছে');
  };

  const handleSelectCategory = (catKey: BmiCategoryKey) => {
    showToast(`${lang === 'en' ? 'Category' : 'শ্রেণী'}: ${catKey.replace('_', ' ').toUpperCase()}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-2 animate-in fade-in duration-200 pb-12">

      {/* 0. Clinical Breadcrumbs & Dropdown Hero Header */}
      <header className="bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] shadow-xs overflow-hidden transition-all duration-200">
        {/* Compact Clickable Top Bar (Default minimal view for instant form focus) */}
        <div
          onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
          className="p-2.5 sm:p-3 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#1A2B3E]/60 transition-colors select-none"
          role="button"
          tabIndex={0}
          aria-expanded={isHeaderExpanded}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsHeaderExpanded(!isHeaderExpanded);
            }
          }}
        >
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {/* Small WHO 2026 Badge */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] text-[10px] font-black uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#14967F] dark:bg-[#2DD4BF]"></span>
              <span>WHO 2026</span>
            </span>

            {/* Semantic H1 Title (Always in DOM for SEO, styled sleek and compact) */}
            <h1 className="text-xs sm:text-sm font-black text-[#095D7E] dark:text-slate-100 tracking-tight truncate">
              {lang === 'en'
                ? 'BMI Calculator Online — Accurate WHO Body Mass Index & Ideal Weight'
                : 'অনলাইন বিএমআই ক্যালকুলেটর — ডব্লিউএইচও মানসম্মত বডি ম্যাস ইনডেক্স ও আদর্শ ওজন'}
            </h1>
          </div>

          {/* Right Action: Dropdown / Expand Toggle Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-bold text-[#14967F] dark:text-[#2DD4BF] hidden sm:inline">
              {isHeaderExpanded
                ? (lang === 'en' ? 'Hide Info' : 'সংক্ষেপ করুন')
                : (lang === 'en' ? 'Clinical Info' : 'ক্লিনিক্যাল তথ্য')}
            </span>
            <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#14967F] dark:text-[#2DD4BF] border border-slate-200 dark:border-slate-700/80">
              {isHeaderExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Content Drawer (Hidden by default for instant form focus, visible on click) */}
        {isHeaderExpanded && (
          <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1A2B3E]/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-3 flex items-center gap-1.5 flex-wrap">
              <a
                href="/"
                onClick={(e) => {
                  e.stopPropagation();
                  if (_onGoHome) {
                    e.preventDefault();
                    _onGoHome();
                  } else if (_onNavigate) {
                    e.preventDefault();
                    _onNavigate('/');
                  }
                }}
                className="hover:text-[#14967F] dark:hover:text-[#2DD4BF] font-semibold transition-colors"
              >
                {lang === 'en' ? 'Home' : 'হোম'}
              </a>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <a
                href="/tools"
                onClick={(e) => {
                  e.stopPropagation();
                  if (_onNavigate) {
                    e.preventDefault();
                    _onNavigate('/tools');
                  }
                }}
                className="hover:text-[#14967F] dark:hover:text-[#2DD4BF] font-semibold transition-colors"
              >
                {lang === 'en' ? 'Medical Tools' : 'মেডিকেল টুলস'}
              </a>
              <span className="text-slate-300 dark:text-slate-600">/</span>
              <span className="text-[#095D7E] dark:text-[#2DD4BF] font-bold">
                {lang === 'en' ? 'BMI Calculator Online' : 'অনলাইন বিএমআই ক্যালকুলেটর'}
              </span>
            </nav>

            {/* Description Paragraph */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'en'
                ? 'Free online clinical Body Mass Index (BMI) calculator. Calculate accurate BMI for adult men, women, and children with interactive radial gauge visualizer, anatomical body silhouettes, WHO Asian risk cut-offs, ideal weight chart, and personalized dietary advice.'
                : 'সকলের জন্য সম্পূর্ণ ফ্রি অনলাইন বিএমআই ক্যালকুলেটর। প্রাপ্তবয়স্ক নারী, পুরুষ এবং শিশু-কিশোরদের নির্ভুল বডি ম্যাস ইনডেক্স, ইন্টারেক্টিভ স্পিডোমিটার গেজ, শারীরিক গড়ন মডেল, দক্ষিণ এশীয় ঝুঁকির মাত্রা এবং উচ্চতা অনুযায়ী আদর্শ ওজনের পুষ্টি পরামর্শ নিন।'}
            </p>

            {/* Clinical Trust Badges & Quick Jump Pills */}
            <div className="pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                  ✓ {lang === 'en' ? 'Metric (kg/cm) & Imperial (lbs/ft)' : 'মেট্রিক ও ইম্পেরিয়াল'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                  ✓ {lang === 'en' ? 'Asian Cut-Offs (23 kg/m²)' : 'এশীয় মানদণ্ড (২৩)'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                  ✓ {lang === 'en' ? 'CDC Pediatric Growth (Age 2-19)' : 'শিশু সিডিসি চার্ট'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
                  ✓ {lang === 'en' ? '100% Private' : 'শতভাগ গোপনীয়'}
                </span>
              </div>

              {/* Quick Jump Links */}
              <div className="flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
                <a
                  href="#who-table"
                  className="text-[11px] font-bold text-[#14967F] dark:text-[#2DD4BF] hover:underline px-2 py-1 rounded bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40"
                >
                  {lang === 'en' ? '📊 WHO Table' : '📊 WHO চার্ট'}
                </a>
                <a
                  href="#ideal-weight-chart"
                  className="text-[11px] font-bold text-[#14967F] dark:text-[#2DD4BF] hover:underline px-2 py-1 rounded bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40"
                >
                  {lang === 'en' ? '⚖️ Ideal Weight' : '⚖️ আদর্শ ওজন'}
                </a>
                <a
                  href="#bmi-formulas"
                  className="text-[11px] font-bold text-[#14967F] dark:text-[#2DD4BF] hover:underline px-2 py-1 rounded bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40"
                >
                  {lang === 'en' ? '📐 Formulas' : '📐 সূত্র'}
                </a>
                <a
                  href="#clinical-faqs"
                  className="text-[11px] font-bold text-[#14967F] dark:text-[#2DD4BF] hover:underline px-2 py-1 rounded bg-[#E2FCD6]/50 dark:bg-[#064E3B]/40"
                >
                  {lang === 'en' ? '❓ FAQs' : '❓ প্রশ্নোত্তর'}
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Responsive Navigation Pills / Tab Bar */}
      <NavPills activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />

      {/* Search query banner if active */}
      {searchQuery && (
        <div className="p-2.5 bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] text-xs text-[#095D7E] dark:text-slate-200 flex items-center justify-between shadow-xs">
          <span>Filter active: &quot;{searchQuery}&quot;</span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-bold text-[#14967F] hover:underline cursor-pointer"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Non-overview Tabs (Body Scan, Suggestion, Diet, Advice) */}
      {activeTab !== 'overview' && (
        <div className="rounded-xl overflow-hidden shadow-xs">
          <TabPanels activeTab={activeTab} result={result} searchQuery={searchQuery} lang={lang} />
        </div>
      )}

      {/* Overview Tab: Desktop 2-Column Bento Layout, Mobile Stack */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-2.5 items-start">
          
          {/* Left Column: Calculator Card & Patient Biometric Summary */}
          <div id="bmi-calculator-tool" className="lg:col-span-5 space-y-1.5 sm:space-y-2 lg:sticky lg:top-20">
            {/* 1. Primary Calculator Input Card */}
            <BmiCalculatorCard
              age={inputAge}
              gender={inputGender}
              heightCm={inputHeightCm}
              weightKg={inputWeightKg}
              onUpdate={handleUpdate}
              onCalculate={handleCalculate}
              onReset={handleReset}
              lang={lang}
            />

            {/* Desktop Quick Biometrics Badge Card */}
            <div className="hidden lg:block bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#CCECEE] dark:border-[#243B53] pb-2 mb-3">
                <span className="text-xs font-black text-[#095D7E] dark:text-slate-200 uppercase tracking-wider">
                  {lang === 'en' ? 'Current Patient Summary' : 'রোগীর পরিমাপ সারসংক্ষেপ'}
                </span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  calculatedState
                    ? 'text-[#14967F] bg-[#E2FCD6] border-[#14967F]/20 dark:bg-[#064E3B] dark:text-[#6EE7B7]'
                    : 'text-slate-500 bg-[#F1F9FF] border-[#CCECEE] dark:bg-[#1A2B3E] dark:text-slate-400 dark:border-[#243B53]'
                }`}>
                  {calculatedState ? (lang === 'en' ? 'Calculated Result' : 'ফলাফল তৈরি') : (lang === 'en' ? 'Awaiting Input' : 'তথ্য অপেক্ষমাণ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-[#F1F9FF] dark:bg-[#1A2B3E] rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{lang === 'en' ? 'Age & Gender' : 'বয়স ও লিঙ্গ'}</span>
                  <strong className="text-[#095D7E] dark:text-slate-100 font-bold">
                    {calculatedState ? `${calculatedState.age} yrs • ${calculatedState.gender === 'male' ? (lang === 'en' ? 'Male ♂' : 'পুরুষ ♂') : (lang === 'en' ? 'Female ♀' : 'নারী ♀')}` : '—'}
                  </strong>
                </div>
                <div className="p-2.5 bg-[#F1F9FF] dark:bg-[#1A2B3E] rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{lang === 'en' ? 'Body Mass Index' : 'বডি মাস ইনডেক্স'}</span>
                  <strong className="text-[#095D7E] dark:text-slate-100 font-bold">
                    {result ? `${result.bmi.toFixed(1)} kg/m²` : '—'}
                  </strong>
                </div>
                <div className="p-2.5 bg-[#F1F9FF] dark:bg-[#1A2B3E] rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{lang === 'en' ? 'Measured Stature' : 'উচ্চতা'}</span>
                  <strong className="text-[#095D7E] dark:text-slate-100 font-bold">
                    {calculatedState ? `${calculatedState.heightCm} cm (${Math.floor(calculatedState.heightCm / 30.48)}' ${Math.round((calculatedState.heightCm % 30.48) / 2.54)}")` : '—'}
                  </strong>
                </div>
                <div className="p-2.5 bg-[#F1F9FF] dark:bg-[#1A2B3E] rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">{lang === 'en' ? 'Measured Weight' : 'ওজন'}</span>
                  <strong className="text-[#095D7E] dark:text-slate-100 font-bold">
                    {calculatedState ? `${calculatedState.weightKg} kg (${(calculatedState.weightKg * 2.20462).toFixed(1)} lbs)` : '—'}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Radial Dial Gauge, Visual Silhouettes & Reference Details */}
          <div id="bmi-results-section" className="lg:col-span-7 space-y-1.5 sm:space-y-2">
            {/* 1. Semi-Circular Radial Dial Gauge with Merged Clinical Anthropometric Metrics */}
            <BmiGauge result={result} lang={lang} />

            {/* 2. Body Silhouette Row */}
            <BodySilhouetteRow
              currentCategory={result ? result.category.key : null}
              gender={calculatedState ? calculatedState.gender : inputGender}
              currentBmi={result ? result.bmi : null}
              onSelectCategory={handleSelectCategory}
              lang={lang}
            />

            {/* 3. Clinical Monograph Accordions FAQ Reference Section */}
            <BmiDetailsFaq lang={lang} />
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[#095D7E] text-white text-xs font-bold rounded-xl shadow-2xl border border-[#CCECEE]/40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
          <Check className="w-4 h-4 text-[#E2FCD6]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
