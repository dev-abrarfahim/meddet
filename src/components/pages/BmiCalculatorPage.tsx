import React, { useState, useMemo } from 'react';
import { Gender, BmiCategoryKey } from '../../types/bmi';
import { calculateBmi } from '../../utils/bmiCalculator';
import { NavPills, NavTabId } from '../tools/bmi/NavPills';
import { BmiCalculatorCard } from '../tools/bmi/BmiCalculatorCard';
import { BodySilhouetteRow } from '../tools/bmi/BodySilhouetteRow';
import { BmiGauge } from '../tools/bmi/BmiGauge';
import { BmiDetailsFaq } from '../tools/bmi/BmiDetailsFaq';
import { TabPanels } from '../tools/bmi/TabPanels';
import { BmiInfoModal } from '../tools/bmi/BmiInfoModal';
import { Check, ChevronRight, Home, ArrowLeft, Info } from 'lucide-react';
import { LanguageMode } from '../../types';

interface BmiCalculatorPageProps {
  onNavigate: (path: string) => void;
  lang: LanguageMode;
  onGoHome?: () => void;
}

export const BmiCalculatorPage: React.FC<BmiCalculatorPageProps> = ({
  onNavigate,
  lang,
  onGoHome
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
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    <div className="max-w-7xl mx-auto space-y-5 animate-in fade-in duration-200 pb-16">
      
      {/* Top Header Bar: Breadcrumb + Back to Tools + Standards Button */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <button
            onClick={onGoHome ? onGoHome : () => onNavigate('/')}
            className="flex items-center gap-1 hover:text-[#14967F] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Home' : 'হোম'}</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => onNavigate('/tools')}
            className="hover:text-[#14967F] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Tools' : 'টুলস'}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF]">
            {lang === 'en' ? 'BMI Calculator' : 'বিএমআই ক্যালকুলেটর'}
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('/tools')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#095D7E] dark:text-slate-200 bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] px-3 py-1.5 rounded-xl hover:border-[#14967F] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'All Tools' : 'সকল টুলস'}</span>
          </button>

          <button
            onClick={() => setIsInfoModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] border border-[#14967F]/30 px-3 py-1.5 rounded-xl hover:scale-102 transition-transform cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'WHO Guidelines' : 'WHO নির্দেশিকা'}</span>
          </button>
        </div>
      </div>

      {/* Responsive Navigation Pills / Tab Bar */}
      <div className="rounded-2xl overflow-hidden border border-[#CCECEE] dark:border-[#243B53] shadow-xs bg-white dark:bg-[#152232]">
        <NavPills activeTab={activeTab} onTabChange={setActiveTab} lang={lang} />
      </div>

      {/* Search query banner if active */}
      {searchQuery && (
        <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] text-xs text-[#095D7E] dark:text-slate-200 flex items-center justify-between shadow-xs">
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
        <div className="rounded-2xl overflow-hidden shadow-xs">
          <TabPanels activeTab={activeTab} result={result} searchQuery={searchQuery} lang={lang} />
        </div>
      )}

      {/* Overview Tab: Desktop 2-Column Bento Layout, Mobile Stack */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Calculator Card & Patient Biometric Summary */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
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

          {/* Right Column: Visual Silhouettes, Gauge & Reference Details */}
          <div id="bmi-results-section" className="lg:col-span-7 space-y-6">
            {/* 2. Body Silhouette Row with Med Navy Silhouettes */}
            <div className="bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-4 shadow-xs">
              <BodySilhouetteRow
                currentCategory={result ? result.category.key : null}
                gender={calculatedState ? calculatedState.gender : inputGender}
                currentBmi={result ? result.bmi : null}
                onSelectCategory={handleSelectCategory}
                lang={lang}
              />
            </div>

            {/* 3. Semi-Circular Radial Dial Gauge with Merged Clinical Anthropometric Metrics */}
            <div className="bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-4 shadow-xs">
              <BmiGauge result={result} lang={lang} />
            </div>

            {/* 4. Dropdown Details / FAQ Reference Section */}
            <div className="bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-4 shadow-xs">
              <BmiDetailsFaq lang={lang} />
            </div>
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

      {/* Info Modal */}
      <BmiInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};
