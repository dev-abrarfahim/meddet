import React from 'react';
import { BmiCalculationResult, BmiCategoryKey } from '../../../types/bmi';
import { LanguageMode } from '../../../types';
import { NavTabId } from './NavPills';
import { Apple, Dumbbell, Stethoscope, HeartPulse, CheckCircle, AlertTriangle, Scale, Activity } from 'lucide-react';

const MALE_IMAGE_MAP: Record<BmiCategoryKey, string> = {
  underweight: '/male-underweight.png',
  normal: '/male-normal.png',
  overweight: '/male-overweight.png',
  obese: '/male-obese.png',
  extremely_obese: '/male-extremely-obese.png'
};

const MALE_WEBP_MAP: Record<BmiCategoryKey, string> = {
  underweight: '/male-underweight.webp',
  normal: '/male-normal.webp',
  overweight: '/male-overweight.webp',
  obese: '/male-obese.webp',
  extremely_obese: '/male-extremely-obese.webp'
};

const FEMALE_IMAGE_MAP: Record<BmiCategoryKey, string> = {
  underweight: '/female-underweight.png',
  normal: '/female-normal.png',
  overweight: '/female-overweight.png',
  obese: '/female-obese.png',
  extremely_obese: '/female-extremely-obese.png'
};

const FEMALE_WEBP_MAP: Record<BmiCategoryKey, string> = {
  underweight: '/female-underweight.webp',
  normal: '/female-normal.webp',
  overweight: '/female-overweight.webp',
  obese: '/female-obese.webp',
  extremely_obese: '/female-extremely-obese.webp'
};

interface TabPanelsProps {
  activeTab: NavTabId;
  result: BmiCalculationResult | null;
  searchQuery: string;
  lang?: LanguageMode;
}

export const TabPanels: React.FC<TabPanelsProps> = ({ activeTab, result, searchQuery, lang = 'en' }) => {
  if (activeTab === 'overview') {
    return null;
  }

  if (!result) {
    return (
      <div className="w-full bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-8 shadow-sm text-center">
        <p className="text-sm font-black text-[#095D7E] dark:text-[#2DD4BF] mb-1">
          {lang === 'en' ? 'Calculation Required' : 'হিসাব সম্পন্ন করা প্রয়োজন'}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {lang === 'en'
            ? 'Please enter your Age, Height, and Weight and click "Calculate" on the Overview tab to unlock detailed clinical guidance.'
            : 'অনুগ্রহ করে সারসংক্ষেপ ট্যাবে আপনার বয়স, উচ্চতা এবং ওজন দিয়ে "হিসাব করুন" বাটনে ক্লিক করুন।'}
        </p>
      </div>
    );
  }

  const { category, gender, bmi, currentHeightCm, currentWeightKg, healthyWeightMin, healthyWeightMax } = result;

  // Filter helper for search
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const lifestyleList = lang === 'bn' ? (category.lifestyleAdviceBn || category.lifestyleAdvice) : category.lifestyleAdvice;
  const dietList = lang === 'bn' ? (category.dietAdviceBn || category.dietAdvice) : category.dietAdvice;
  const medicalText = lang === 'bn' ? (category.medicalAdviceBn || category.medicalAdvice) : category.medicalAdvice;
  const categoryLabel = lang === 'bn' ? category.labelBn : category.label;
  const categoryDesc = lang === 'bn' ? category.descriptionBn : category.description;

  const maleImg = MALE_IMAGE_MAP[category.key] || '/male-normal.png';
  const maleWebp = MALE_WEBP_MAP[category.key] || '/male-normal.webp';
  const femaleImg = FEMALE_IMAGE_MAP[category.key] || '/female-normal.png';
  const femaleWebp = FEMALE_WEBP_MAP[category.key] || '/female-normal.webp';

  return (
    <div className="w-full bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-5 shadow-sm space-y-5 text-slate-800 dark:text-slate-100">
      
      {/* 1. Body Scan Tab */}
      {activeTab === 'body-scan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#CCECEE] dark:border-[#243B53] pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                <span>{lang === 'en' ? 'Body Morphology Scan & Anthropometrics' : 'বডি মরফোলজি স্ক্যান ও শারীরিক পরিমাপ'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'en' ? 'Clinical anatomical profile evaluation • WHO reference guidelines' : 'ক্লিনিক্যাল শারীরিক গঠন মূল্যায়ন • ডব্লিউএইচও রেফারেন্স নির্দেশিকা'}
              </p>
            </div>
            <span className="text-xs font-bold text-[#095D7E] dark:text-[#2DD4BF] bg-[#F1F9FF] dark:bg-[#1A2B3E] px-3 py-1 rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
              {gender === 'male' ? (lang === 'en' ? 'Male Biometrics ♂' : 'পুরুষের বায়োমেট্রিক্স ♂') : (lang === 'en' ? 'Female Biometrics ♀' : 'নারীর বায়োমেট্রিক্স ♀')}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#F1F9FF] dark:bg-[#1A2B3E] p-5 rounded-2xl border border-[#CCECEE] dark:border-[#243B53]">
            {/* Left Column: Visual Silhouette */}
            <div className="md:col-span-4 flex flex-col items-center justify-center bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] p-4 shadow-xs">
              <div className="w-full flex items-center justify-center py-2">
                <picture>
                  <source srcSet={gender === 'male' ? maleWebp : femaleWebp} type="image/webp" />
                  <img
                    src={gender === 'male' ? maleImg : femaleImg}
                    alt={categoryLabel}
                    loading="lazy"
                    decoding="async"
                    width="86"
                    height="240"
                    className="w-[86px] h-[240px] object-contain select-none drop-shadow-sm"
                    draggable={false}
                  />
                </picture>
              </div>
              <div className="w-full text-center mt-2 pt-2 border-t border-[#CCECEE] dark:border-[#243B53]">
                <span className="text-xs font-black text-[#095D7E] dark:text-slate-100 block">
                  {categoryLabel}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {lang === 'en' ? `Measured BMI: ${bmi.toFixed(1)} kg/m²` : `পরিমাপকৃত বিএমআই: ${bmi.toFixed(1)} কেজি/মি²`}
                </span>
              </div>
            </div>

            {/* Right Column: Morphology Details */}
            <div className="md:col-span-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-xs font-black uppercase tracking-wider mb-1">
                  {lang === 'en' ? 'Morphological Analysis' : 'শারীরিক গঠন বিশ্লেষণ'}
                </span>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {categoryDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-[#152232] p-3 rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">{lang === 'en' ? 'Height' : 'উচ্চতা'}</span>
                  <strong className="text-base text-[#095D7E] dark:text-slate-100">{currentHeightCm} cm</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">({Math.floor(currentHeightCm / 30.48)}&apos; {Math.round((currentHeightCm % 30.48) / 2.54)}&quot;)</span>
                </div>
                <div className="bg-white dark:bg-[#152232] p-3 rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">{lang === 'en' ? 'Weight' : 'ওজন'}</span>
                  <strong className="text-base text-[#095D7E] dark:text-slate-100">{currentWeightKg} kg</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">({(currentWeightKg * 2.20462).toFixed(1)} lbs)</span>
                </div>
                <div className="bg-white dark:bg-[#152232] p-3 rounded-xl border border-[#CCECEE] dark:border-[#243B53] col-span-2 sm:col-span-1">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-bold uppercase">{lang === 'en' ? 'Healthy Weight Range' : 'আদর্শ ওজনের সীমা'}</span>
                  <strong className="text-sm text-[#14967F] dark:text-[#2DD4BF] block">{healthyWeightMin} - {healthyWeightMax} kg</strong>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">{lang === 'en' ? 'BMI 18.5 - 24.9' : 'বিএমআই ১৮.৫ - ২৪.৯'}</span>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-[#CCECEE] dark:border-[#243B53] text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#14967F] dark:text-[#2DD4BF] shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Silhouettes are rendered in clinical Med Navy (#095D7E) for medical consistency across genders and body classes.'
                    : 'মেডিকেল রেফারেন্স মান অনুযায়ী সিলুয়েট মডেলগুলো উপস্থাপন করা হয়েছে।'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Suggestion Tab */}
      {activeTab === 'suggestion' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#CCECEE] dark:border-[#243B53] pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                <span>{lang === 'en' ? 'Lifestyle & Physical Activity Suggestions' : 'জীবনযাত্রা ও শরীরচর্চার পরামর্শ'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'en'
                  ? `Evidence-based physical recommendations tailored for BMI ${bmi.toFixed(1)} (${categoryLabel})`
                  : `বিএমআই ${bmi.toFixed(1)} (${categoryLabel}) এর জন্য স্বাস্থ্যসম্মত শরীরচর্চা ও জীবনযাত্রার পরামর্শ`}
              </p>
            </div>
            <span className="text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-3 py-1 rounded-xl border border-[#14967F]/20">
              {lang === 'en' ? 'Personalized Plan' : 'ব্যক্তিগত পরামর্শ'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lifestyleList
              .filter(matchesSearch)
              .map((advice, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]/40 transition-colors">
                  <CheckCircle className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{advice}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 3. Diet Tab */}
      {activeTab === 'diet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#CCECEE] dark:border-[#243B53] pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
                <Apple className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                <span>{lang === 'en' ? 'Clinical Nutrition Guidelines' : 'ক্লিনিক্যাল পুষ্টি ও ডায়েট গাইডলাইন'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'en' ? 'Dietary targets aligned with metabolic health and macronutrient balance' : 'মেটাবলিক সুস্থতা ও ম্যাক্রো-নিউট্রিয়েন্টের সুষম বণ্টন নিশ্চিত করার ডায়েট পরিকল্পনা'}
              </p>
            </div>
            <span className="text-xs font-bold text-[#095D7E] dark:text-slate-200 bg-[#F1F9FF] dark:bg-[#1A2B3E] px-3 py-1 rounded-xl border border-[#CCECEE] dark:border-[#243B53]">
              {lang === 'en' ? 'Clinical Protocol' : 'ডায়েট প্রোটোকল'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dietList
              .filter(matchesSearch)
              .map((diet, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F]/40 transition-colors">
                  <div className="w-6 h-6 rounded-lg bg-[#E2FCD6] text-[#0D6F5D] dark:bg-[#064E3B] dark:text-[#6EE7B7] flex items-center justify-center text-xs font-black shrink-0 mt-0.5 border border-[#14967F]/30">
                    {idx + 1}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{diet}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 4. Advice Tab */}
      {activeTab === 'advice' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#CCECEE] dark:border-[#243B53] pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                <span>{lang === 'en' ? 'Physician Advisory & Clinical Action Steps' : 'চিকিৎসকের পরামর্শ ও করণীয়'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'en' ? 'Professional guidance, risk factors, and diagnostic context' : 'পেশাদার স্বাস্থ্য পরামর্শ, সম্ভাব্য ঝুঁকি ও রোগ নির্ণয়ের প্রাসঙ্গিক তথ্য'}
              </p>
            </div>
            <span className="text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-3 py-1 rounded-xl border border-[#14967F]/20">
              {lang === 'en' ? 'Clinical Advisory' : 'চিকিৎসা পরামর্শ'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 p-4 rounded-xl bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] space-y-2">
              <div className="flex items-center gap-2 text-[#095D7E] dark:text-[#2DD4BF] font-black text-sm">
                <AlertTriangle className="w-4 h-4 text-[#14967F] dark:text-[#2DD4BF]" />
                <span>{lang === 'en' ? `Clinical Assessment for BMI ${bmi.toFixed(1)} (${categoryLabel})` : `বিএমআই ${bmi.toFixed(1)} (${categoryLabel}) এর ক্লিনিক্যাল মূল্যায়ন`}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {medicalText}
              </p>
            </div>

            <div className="md:col-span-4 p-4 rounded-xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] space-y-2 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[#095D7E] dark:text-slate-200 font-bold text-xs">
                <Scale className="w-4 h-4 text-[#14967F] dark:text-[#2DD4BF]" />
                <span>{lang === 'en' ? 'Target Anthropometrics' : 'লক্ষ্য শারীরিক ওজন'}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {lang === 'en' ? (
                  <>To achieve the standard WHO normal threshold (BMI 18.5 - 24.9), your target weight range is <strong className="text-[#095D7E] dark:text-[#2DD4BF] font-black">{healthyWeightMin} - {healthyWeightMax} kg</strong>.</>
                ) : (
                  <>ডব্লিউএইচও স্বাভাবিক সীমা (বিএমআই ১৮.৫ - ২৪.৯) অর্জন করতে আপনার লক্ষ্য ওজনের পরিসীমা হওয়া উচিত <strong className="text-[#095D7E] dark:text-[#2DD4BF] font-black">{healthyWeightMin} - {healthyWeightMax} কেজি</strong>।</>
                )}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-[#152232] border border-[#CCECEE] dark:border-[#243B53] text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <strong className="text-[#095D7E] dark:text-slate-200 block font-bold">
              {lang === 'en' ? 'Clinical Screening Disclaimer:' : 'ক্লিনিক্যাল স্ক্রিনিং সতর্কতা:'}
            </strong>
            <p>
              {lang === 'en'
                ? 'Body Mass Index (BMI) is an anthropometric population screening metric. It does not directly quantify visceral fat versus lean skeletal muscle mass. Clinical consultations should integrate lipid panels, blood pressure, and individual medical history.'
                : 'বডি মাস ইনডেক্স (বিএমআই) একটি সামগ্রিক স্ক্রিনিং পরিমাপ। এটি পেশী ও পেটের অতিরিক্ত চর্বির পার্থক্য সরাসরি পরিমাপ করতে পারে না। সঠিক মূল্যায়নের জন্য রক্তচাপ, লিপিড প্রোফাইল এবং সার্বিক স্বাস্থ্য ইতিহাস পরীক্ষা করা উচিত।'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
