import React, { useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Pill,
  Scale,
  HelpCircle,
  AlertTriangle,
  BookOpen,
  HeartPulse,
  UserCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { LanguageMode } from '../../../types';

interface BmiDetailsFaqProps {
  lang?: LanguageMode;
}

interface AccordionItem {
  id: string;
  titleEn: string;
  titleBn: string;
  renderContent: () => React.ReactNode;
}

export const BmiDetailsFaq: React.FC<BmiDetailsFaqProps> = ({ lang = 'en' }) => {
  // Start with key tables open by default for rich content discovery, with toggle support
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    intro: true,
    adultTable: true,
    idealWeight: true,
    genderDiff: false,
    childTable: false,
    formulas: false,
    overweightRisks: false,
    underweightRisks: false,
    medicalTreatments: false,
    limitations: false,
    faqs: true,
    references: false
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    items.forEach(it => { allOpen[it.id] = true; });
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    const allClosed: Record<string, boolean> = {};
    items.forEach(it => { allClosed[it.id] = false; });
    setOpenItems(allClosed);
  };

  const items: AccordionItem[] = [
    // 1. Clinical Overview
    {
      id: 'intro',
      titleEn: 'Body Mass Index (BMI) Overview & Clinical Purpose',
      titleBn: 'বডি ম্যাস ইনডেক্স (বিএমআই) পরিচিতি ও ক্লিনিক্যাল তাৎপর্য',
      renderContent: () => (
        <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {lang === 'en'
              ? 'Body Mass Index (BMI) is an international clinical screening metric established by the World Health Organization (WHO), Centers for Disease Control and Prevention (CDC), and National Health Service (NHS). It measures body weight in relation to stature (height) to categorize an individual\'s weight status and evaluate prospective metabolic and cardiovascular risk factors.'
              : 'বডি ম্যাস ইনডেক্স (বিএমআই) হলো মানুষের উচ্চতা ও ওজনের অনুপাতের একটি বিশ্বস্বীকৃত ক্লিনিক্যাল সূচক, যা বিশ্ব স্বাস্থ্য সংস্থা (WHO), সিডিসি (CDC) এবং আন্তর্জাতিক চিকিৎসকদের দ্বারা ব্যাপকভাবে ব্যবহৃত হয়। এটি নির্ধারণ করে যে একজন ব্যক্তির ওজন তার শারীরিক কাঠামোর সাথে সামঞ্জস্যপূর্ণ কিনা এবং অতিরিক্ত বা কম ওজনের কারণে কোনো স্বাস্থ্যঝুঁকি রয়েছে কিনা।'}
          </p>
          <p>
            {lang === 'en'
              ? 'While BMI does not measure body fat directly, extensive epidemiological studies confirm that elevated BMI correlates strongly with direct adiposity measurements, including dual-energy x-ray absorptiometry (DEXA), underwater weighing, and skinfold thickness evaluations.'
              : 'বিএমআই সরাসরি শরীরের চর্বির পরিমাণ পরিমাপ না করলেও গবেষণায় দেখা গেছে যে উচ্চ বিএমআই শরীরের অতিরিক্ত চর্বি (Adipose Tissue)-র সাথে ওতপ্রোতভাবে জড়িত এবং দীর্ঘমেয়াদী মেটাবলিক স্বাস্থ্যঝুঁকি শনাক্ত করার ক্ষেত্রে প্রাথমিক বিশ্বস্ত মানদণ্ড হিসেবে কাজ করে।'}
          </p>
        </div>
      )
    },

    // 2. WHO Adult Table & Asian Specific Criteria
    {
      id: 'adultTable',
      titleEn: 'WHO Adult BMI Classification & South Asian Population Cut-Offs',
      titleBn: 'ডব্লিউএইচও প্রাপ্তবয়স্কদের বিএমআই তালিকা ও দক্ষিণ এশীয়দের জন্য বিশেষ মানদণ্ড',
      renderContent: () => (
        <div id="who-table" className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300 text-xs">
            {lang === 'en'
              ? 'Standard World Health Organization (WHO) international classification alongside adjusted cut-offs for Asian & South Asian populations (including Bangladesh and India), where visceral fat and diabetes risks manifest at lower body weight:'
              : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) কর্তৃক নির্ধারিত আন্তর্জাতিক মানদণ্ড এবং দক্ষিণ এশীয় ও বাংলাদেশি জনগোষ্ঠীর জন্য বিশেষ বিএমআই মাত্রা (যেখানে কম ওজনেই পেটের চর্বি ও ডায়াবেটিসের ঝুঁকি বাড়ে):'}
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#095D7E] text-white">
                  <th className="py-2.5 px-3 font-bold">{lang === 'en' ? 'Clinical Classification' : 'ক্লিনিক্যাল শ্রেণীবিন্যাস'}</th>
                  <th className="py-2.5 px-3 font-bold text-center">{lang === 'en' ? 'WHO Global (kg/m²)' : 'আন্তর্জাতিক WHO (কেজি/মি²)'}</th>
                  <th className="py-2.5 px-3 font-bold text-center bg-[#074760]">{lang === 'en' ? 'South Asian Cut-Off' : 'দক্ষিণ এশীয় মাত্রা (কেজি/মি²)'}</th>
                  <th className="py-2.5 px-3 font-bold text-right">{lang === 'en' ? 'Health Risk' : 'স্বাস্থ্যঝুঁকি'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#152232]">
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{lang === 'en' ? 'Severe Thinness' : 'মারাত্মক ওজনহীনতা'}</td>
                  <td className="py-2 px-3 text-center font-mono">&lt; 16.0</td>
                  <td className="py-2 px-3 text-center font-mono bg-slate-50 dark:bg-slate-800/40">&lt; 16.0</td>
                  <td className="py-2 px-3 text-right text-rose-600 font-bold">{lang === 'en' ? 'Severe' : 'মারাত্মক'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{lang === 'en' ? 'Moderate Thinness' : 'মাঝারি ওজনহীনতা'}</td>
                  <td className="py-2 px-3 text-center font-mono">16.0 – 16.9</td>
                  <td className="py-2 px-3 text-center font-mono bg-slate-50 dark:bg-slate-800/40">16.0 – 16.9</td>
                  <td className="py-2 px-3 text-right text-amber-600 font-semibold">{lang === 'en' ? 'Elevated' : 'মাঝারি'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{lang === 'en' ? 'Mild Thinness' : 'সামান্য কম ওজন'}</td>
                  <td className="py-2 px-3 text-center font-mono">17.0 – 18.4</td>
                  <td className="py-2 px-3 text-center font-mono bg-slate-50 dark:bg-slate-800/40">17.0 – 18.4</td>
                  <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">{lang === 'en' ? 'Mild' : 'সামান্য'}</td>
                </tr>
                <tr className="bg-[#E2FCD6] dark:bg-[#064E3B] font-bold text-[#0D6F5D] dark:text-[#6EE7B7]">
                  <td className="py-2 px-3 flex items-center gap-1.5">
                    <span>★</span>
                    <span>{lang === 'en' ? 'Normal / Healthy Weight' : 'স্বাভাবিক ও স্বাস্থ্যকর ওজন'}</span>
                  </td>
                  <td className="py-2 px-3 text-center font-mono font-black">18.5 – 24.9</td>
                  <td className="py-2 px-3 text-center font-mono font-black bg-[#CCECEE] dark:bg-[#074760] text-[#095D7E] dark:text-[#E2FCD6]">18.5 – 22.9</td>
                  <td className="py-2 px-3 text-right text-[#0D6F5D] dark:text-[#6EE7B7]">{lang === 'en' ? 'Optimal' : 'আদর্শ'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{lang === 'en' ? 'Overweight (Pre-obesity)' : 'অতিরিক্ত ওজন (প্রি-অবিজ)'}</td>
                  <td className="py-2 px-3 text-center font-mono">25.0 – 29.9</td>
                  <td className="py-2 px-3 text-center font-mono bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 font-bold">23.0 – 27.4</td>
                  <td className="py-2 px-3 text-right text-amber-600 font-bold">{lang === 'en' ? 'Moderate Risk' : 'ঝুঁকিপূর্ণ'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{lang === 'en' ? 'Obese Class I' : 'স্থূলতা ক্লাস ১ (মাঝারি)'}</td>
                  <td className="py-2 px-3 text-center font-mono">30.0 – 34.9</td>
                  <td className="py-2 px-3 text-center font-mono bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold">27.5 – 32.4</td>
                  <td className="py-2 px-3 text-right text-rose-600 font-bold">{lang === 'en' ? 'High Risk' : 'উচ্চ ঝুঁকি'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{lang === 'en' ? 'Obese Class II (Severe)' : 'স্থূলতা ক্লাস ২ (গুরুতর)'}</td>
                  <td className="py-2 px-3 text-center font-mono">35.0 – 39.9</td>
                  <td className="py-2 px-3 text-center font-mono bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold">32.5 – 37.4</td>
                  <td className="py-2 px-3 text-right text-rose-700 font-black">{lang === 'en' ? 'Very High' : 'গুরুতর ঝুঁকি'}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">{lang === 'en' ? 'Obese Class III (Morbid)' : 'স্থূলতা ক্লাস ৩ (মারাত্মক)'}</td>
                  <td className="py-2 px-3 text-center font-mono">&ge; 40.0</td>
                  <td className="py-2 px-3 text-center font-mono bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold">&ge; 37.5</td>
                  <td className="py-2 px-3 text-right text-rose-800 font-black">{lang === 'en' ? 'Critical' : 'মারাত্মক ঝুঁকি'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div id="asian-criteria" className="p-3 bg-[#F1F9FF] dark:bg-[#1A2B3E] rounded-xl border border-[#CCECEE] dark:border-[#243B53] text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] block">
              💡 {lang === 'en' ? 'Clinical Note on Asian / Bangladeshi Populations (WHO Lancet Review):' : 'ক্লিনিক্যাল নোট: এশীয় ও বাংলাদেশি জনগোষ্ঠীর জন্য বিশেষ সতর্কতা (WHO Lancet)'}
            </span>
            <p>
              {lang === 'en'
                ? 'WHO expert consensus establishes that individuals of South Asian ancestry possess higher percentages of visceral and abdominal fat at lower BMI values compared to European populations. Consequently, cardiometabolic disease risk (type 2 diabetes, coronary artery disease) rises sharply at a BMI threshold of 23.0 kg/m².'
                : 'বিশ্ব স্বাস্থ্য সংস্থার গবেষণা অনুযায়ী, দক্ষিণ এশীয় বংশোদ্ভূত ব্যক্তিদের ক্ষেত্রে ইউরোপীয়দের তুলনায় কম ওজনেই পেটের ভেতরে ক্ষতিকর ভিসেরাল ফ্যাট জমা হয়। ফলে বিএমআই ২৩ এর উপরে গেলেই ডায়াবেটিস এবং হৃদরোগের ঝুঁকি দ্রুত বাড়তে থাকে।'}
            </p>
          </div>
        </div>
      )
    },

    // 3. Ideal Body Weight (IBW) Chart
    {
      id: 'idealWeight',
      titleEn: 'Ideal Body Weight (IBW) & Height-to-Weight Reference Chart',
      titleBn: 'উচ্চতা অনুযায়ী আদর্শ ওজন (IBW) ও স্বাস্থ্যসম্মত ওজনের তালিকা',
      renderContent: () => (
        <div id="ideal-weight-chart" className="space-y-3">
          <p className="text-slate-600 dark:text-slate-300 text-xs">
            {lang === 'en'
              ? 'Find your medically recommended weight range and Ideal Body Weight (IBW) calculated using the Devine clinical formula and WHO healthy BMI parameters (18.5 – 24.9 kg/m²):'
              : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO)-এর স্বাভাবিক বিএমআই পরিসীমা (১৮.৫ - ২৪.৯) এবং ডিভাইন (Devine) ফর্মুলা অনুযায়ী বিভিন্ন উচ্চতার নারী ও পুরুষের আদর্শ ওজন:'}
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#095D7E] text-white">
                  <th className="py-2.5 px-3 font-bold">{lang === 'en' ? 'Height (Feet & Inches)' : 'উচ্চতা (ফুট ও ইঞ্চি)'}</th>
                  <th className="py-2.5 px-3 font-bold text-center">{lang === 'en' ? 'Height (cm)' : 'উচ্চতা (সেমি)'}</th>
                  <th className="py-2.5 px-3 font-bold text-center bg-[#074760]">{lang === 'en' ? 'Healthy Weight (kg)' : 'স্বাস্থ্যকর ওজন (কেজি)'}</th>
                  <th className="py-2.5 px-3 font-bold text-right">{lang === 'en' ? 'Healthy Weight (lbs)' : 'স্বাস্থ্যকর ওজন (পাউন্ড)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#152232] font-mono">
                <tr><td className="py-1.5 px-3 font-sans font-semibold">4&apos; 10&quot;</td><td className="py-1.5 px-3 text-center">147 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">40 – 54 kg</td><td className="py-1.5 px-3 text-right">88 – 119 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">4&apos; 11&quot;</td><td className="py-1.5 px-3 text-center">150 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">41 – 56 kg</td><td className="py-1.5 px-3 text-right">91 – 123 lbs</td></tr>
                <tr className="bg-[#E2FCD6]/30 dark:bg-[#064E3B]/20"><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 0&quot;</td><td className="py-1.5 px-3 text-center">152 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">43 – 58 kg</td><td className="py-1.5 px-3 text-right">95 – 128 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 1&quot;</td><td className="py-1.5 px-3 text-center">155 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">44 – 60 kg</td><td className="py-1.5 px-3 text-right">98 – 132 lbs</td></tr>
                <tr className="bg-[#E2FCD6]/30 dark:bg-[#064E3B]/20"><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 2&quot;</td><td className="py-1.5 px-3 text-center">157 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">46 – 61 kg</td><td className="py-1.5 px-3 text-right">101 – 135 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 3&quot;</td><td className="py-1.5 px-3 text-center">160 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">47 – 64 kg</td><td className="py-1.5 px-3 text-right">104 – 141 lbs</td></tr>
                <tr className="bg-[#E2FCD6]/30 dark:bg-[#064E3B]/20"><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 4&quot;</td><td className="py-1.5 px-3 text-center">163 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">49 – 66 kg</td><td className="py-1.5 px-3 text-right">108 – 146 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 5&quot;</td><td className="py-1.5 px-3 text-center">165 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">50 – 68 kg</td><td className="py-1.5 px-3 text-right">111 – 150 lbs</td></tr>
                <tr className="bg-[#E2FCD6]/30 dark:bg-[#064E3B]/20"><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 6&quot;</td><td className="py-1.5 px-3 text-center">168 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">52 – 70 kg</td><td className="py-1.5 px-3 text-right">115 – 154 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 7&quot;</td><td className="py-1.5 px-3 text-center">170 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">53 – 72 kg</td><td className="py-1.5 px-3 text-right">118 – 159 lbs</td></tr>
                <tr className="bg-[#E2FCD6]/30 dark:bg-[#064E3B]/20"><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 8&quot;</td><td className="py-1.5 px-3 text-center">173 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">55 – 75 kg</td><td className="py-1.5 px-3 text-right">122 – 165 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 9&quot;</td><td className="py-1.5 px-3 text-center">175 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">57 – 77 kg</td><td className="py-1.5 px-3 text-right">125 – 170 lbs</td></tr>
                <tr className="bg-[#E2FCD6]/30 dark:bg-[#064E3B]/20"><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 10&quot;</td><td className="py-1.5 px-3 text-center">178 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">59 – 79 kg</td><td className="py-1.5 px-3 text-right">130 – 174 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">5&apos; 11&quot;</td><td className="py-1.5 px-3 text-center">180 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">60 – 81 kg</td><td className="py-1.5 px-3 text-right">133 – 179 lbs</td></tr>
                <tr className="bg-[#E2FCD6]/30 dark:bg-[#064E3B]/20"><td className="py-1.5 px-3 font-sans font-semibold">6&apos; 0&quot;</td><td className="py-1.5 px-3 text-center">183 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">62 – 84 kg</td><td className="py-1.5 px-3 text-right">137 – 185 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">6&apos; 2&quot;</td><td className="py-1.5 px-3 text-center">188 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">65 – 88 kg</td><td className="py-1.5 px-3 text-right">144 – 194 lbs</td></tr>
                <tr><td className="py-1.5 px-3 font-sans font-semibold">6&apos; 4&quot;</td><td className="py-1.5 px-3 text-center">193 cm</td><td className="py-1.5 px-3 text-center font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-slate-50 dark:bg-slate-800/40">69 – 93 kg</td><td className="py-1.5 px-3 text-right">152 – 205 lbs</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },

    // 4. Gender-Specific Considerations (Men vs Women)
    {
      id: 'genderDiff',
      titleEn: 'BMI for Men vs Women — Biological Adiposity Differences',
      titleBn: 'নারী ও পুরুষের বিএমআই — শারীরিক গঠনে চর্বি বিন্যাসের পার্থক্য',
      renderContent: () => (
        <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {lang === 'en'
              ? 'While the clinical formula for adult Body Mass Index (BMI) is mathematically identical for men and women, human sexual dimorphism results in distinct biological body composition:'
              : 'প্রাপ্তবয়স্ক নারী ও পুরুষ উভয়ের ক্ষেত্রে বিএমআই গণনার গাণিতিক সূত্র এক হলেও হরমোন ও শারীরিক বৈশিষ্ট্যের কারণে চর্বির বিন্যাসে স্পষ্ট পার্থক্য থাকে:'}
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1">
            <li>
              <strong>{lang === 'en' ? 'Essential Body Fat:' : 'প্রয়োজনীয় চর্বির হার:'} </strong>
              {lang === 'en'
                ? 'Women naturally carry 8% to 12% higher essential adipose tissue than men to support endocrine, reproductive, and lactation functions.'
                : 'নারীদের প্রজনন স্বাস্থ্য ও হরমোনের স্বাভাবিক কার্যকারিতার জন্য প্রাকৃতিকভাবেই পুরুষের চেয়ে ৮–১২% বেশি অপরিহার্য চর্বি থাকে।'}
            </li>
            <li>
              <strong>{lang === 'en' ? 'Adiposity Distribution Pattern:' : 'চর্বি জমার ধরণ:'} </strong>
              {lang === 'en'
                ? 'Men tend to accumulate visceral adiposity intra-abdominally ("android" or apple-shaped obesity), which presents a higher cardiovascular risk. Women typically store fat subcutaneously in the hips and thighs ("gynoid" or pear-shaped obesity).'
                : 'পুরুষদের শরীরে চর্বি মূলত পেটের ভেতরে (Android/Apple Shape) জমে, যা হৃদরোগের জন্য বেশি ঝুঁকিপূর্ণ। অন্যদিকে নারীদের ক্ষেত্রে চর্বি মূলত উরু ও নিতম্বে (Gynoid/Pear Shape) জমা হয়।'}
            </li>
          </ul>
        </div>
      )
    },

    // 5. Pediatric Growth & Seniors
    {
      id: 'childTable',
      titleEn: 'Pediatric Growth (CDC Percentiles) & Seniors (>65 Sarcopenia)',
      titleBn: 'শিশু-কিশোরদের সিডিসি পার্সেন্টাইল ও বয়োবৃদ্ধদের বিএমআই মানদণ্ড',
      renderContent: () => (
        <div id="child-table" className="space-y-3">
          <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <h4 className="font-bold text-[#095D7E] dark:text-[#2DD4BF]">
              {lang === 'en' ? 'Pediatric BMI (Children & Teens Age 2–19):' : 'শিশু ও কিশোরদের বিএমআই (বয়স ২–১৯ বছর):'}
            </h4>
            <p>
              {lang === 'en'
                ? 'Because body fat changes rapidly with maturation and height growth, pediatric BMI is measured against CDC age-and-gender-specific growth percentiles:'
                : 'শিশুদের শারীরিক বৃদ্ধি ও বয়সভেদে চর্বির পরিমাণে পরিবর্তন হওয়ায় সিডিসি (CDC)-এর বয়স ও লিঙ্গভিত্তিক পার্সেন্টাইল চার্ট ব্যবহার করা হয়:'}
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#095D7E] text-white">
                  <th className="py-2 px-3 font-semibold">{lang === 'en' ? 'Pediatric Category' : 'শ্রেণীবিন্যাস'}</th>
                  <th className="py-2 px-3 font-semibold text-right">{lang === 'en' ? 'CDC Percentile Benchmark' : 'সিডিসি পার্সেন্টাইল পরিসীমা'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#152232]">
                <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Underweight' : 'কম ওজন'}</td><td className="py-1.5 px-3 text-right font-mono text-rose-600 font-bold">&lt; 5th percentile</td></tr>
                <tr className="bg-[#E2FCD6] dark:bg-[#064E3B] font-bold text-[#0D6F5D] dark:text-[#6EE7B7]"><td className="py-1.5 px-3">{lang === 'en' ? 'Healthy Weight' : 'স্বাস্থ্যকর ওজন'}</td><td className="py-1.5 px-3 text-right font-mono">5th – 84th percentile</td></tr>
                <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Overweight' : 'অতিরিক্ত ওজন'}</td><td className="py-1.5 px-3 text-right font-mono text-amber-600 font-bold">85th – 94th percentile</td></tr>
                <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Obese' : 'স্থূলতা'}</td><td className="py-1.5 px-3 text-right font-mono text-rose-600 font-bold">&ge; 95th percentile</td></tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF] block">
              {lang === 'en' ? 'Geriatric BMI Consideration (>65 Years):' : 'বয়োবৃদ্ধদের ক্ষেত্রে সতর্কতা (৬৫ বছরের ঊর্ধ্বে):'}
            </span>
            <p>
              {lang === 'en'
                ? 'Clinical research indicates that older adults (>65 years) benefit from a slightly higher BMI range of 23.0 to 27.0 kg/m². This protective phenomenon (termed the "Obesity Paradox" in geriatrics) guards against sarcopenia (muscle loss), bone fractures, and infection mortality.'
                : 'চিকিৎসা বিজ্ঞানে দেখা গেছে যে ৬৫ বছরের বেশি বয়সের মানুষের ক্ষেত্রে বিএমআই ২৩ থেকে ২৭ এর মধ্যে থাকা হাড়ের ক্ষয়, পেশী হ্রাস (Sarcopenia) এবং মারাত্মক অসুস্থতার ক্ষেত্রে প্রতিরোধমূলক ভূমিকা পালন করে।'}
            </p>
          </div>
        </div>
      )
    },

    // 6. Complete Formulas
    {
      id: 'formulas',
      titleEn: 'BMI Calculation Formulas (Metric, Imperial & Oxford New BMI)',
      titleBn: 'বিএমআই গণনার বিভিন্ন বৈজ্ঞানিক সূত্র (মেট্রিক, ইম্পেরিয়াল ও অক্সফোর্ড ফর্মুলা)',
      renderContent: () => (
        <div id="bmi-formulas" className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            {lang === 'en'
              ? 'Our calculator supports both standard international metric formulas, US imperial conversions, and the modern Oxford University refined algorithm:'
              : 'আমাদের ক্যালকুলেটর আন্তর্জাতিক মেট্রিক পদ্ধতি, ইউএস ইম্পেরিয়াল পদ্ধতি এবং অক্সফোর্ড ইউনিভার্সিটির আধুনিক ফর্মুলা সমর্থন করে:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 shadow-xs">
              <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF] block text-[11px] uppercase tracking-wider">
                {lang === 'en' ? '1. Metric (SI) Standard' : '১. আন্তর্জাতিক মেট্রিক পদ্ধতি'}
              </span>
              <div className="font-mono text-slate-900 dark:text-slate-100 font-bold">BMI = kg / m²</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'e.g. 70 kg / (1.75 m)² = 22.86 kg/m²' : 'উদাহরণ: ৭০ কেজি / (১.৭৫ মি)² = ২২.৮৬ কেজি/মি²'}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 shadow-xs">
              <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF] block text-[11px] uppercase tracking-wider">
                {lang === 'en' ? '2. US Imperial Units' : '২. ইউএস ইম্পেরিয়াল পদ্ধতি'}
              </span>
              <div className="font-mono text-slate-900 dark:text-slate-100 font-bold">BMI = 703 × [lbs / in²]</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'e.g. 703 × [154 / 69²] = 22.74 kg/m²' : 'উদাহরণ: ৭০৩ × [১৫৪ / ৬৯²] = ২২.৭৪ কেজি/মি²'}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 shadow-xs">
              <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF] block text-[11px] uppercase tracking-wider">
                {lang === 'en' ? '3. Oxford New BMI Formula' : '৩. অক্সফোর্ড নিউ বিএমআই'}
              </span>
              <div className="font-mono text-slate-900 dark:text-slate-100 font-bold">BMI = 1.3 × [kg / m².⁵]</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'Corrects tall/short stature bias by using 2.5 exponent.' : 'খাটো ও অতি লম্বা ব্যক্তিদের শারীরিক ভলিউম সঠিকভাবে সমন্বয় করে।'}
              </div>
            </div>
          </div>
        </div>
      )
    },

    // 7. Health Risks of High BMI
    {
      id: 'overweightRisks',
      titleEn: 'Health Risks of Being Overweight or Obese (High BMI)',
      titleBn: 'অতিরিক্ত ওজন ও স্থূলতার কারণে সৃষ্ট মারাত্মক স্বাস্থ্যঝুঁকি',
      renderContent: () => (
        <div id="health-risks" className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
          <p>
            {lang === 'en'
              ? 'A sustained Body Mass Index (BMI) above 25.0 kg/m² (or above 23.0 kg/m² for Asian populations) triggers chronic systemic inflammation and significantly elevates the risk of multiple life-threatening conditions:'
              : 'শরীরে অতিরিক্ত মেদ জমলে এবং বিএমআই স্বাভাবিকের চেয়ে বেশি হলে বিভিন্ন জটিল ও দীর্ঘমেয়াদী রোগের সম্ভাবনা বহুগুণ বেড়ে যায়:'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
              <strong className="text-rose-800 dark:text-rose-300 block mb-1">
                {lang === 'en' ? 'Cardiometabolic Diseases' : 'হৃদরোগ ও রক্তনালীর রোগ'}
              </strong>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                <li>{lang === 'en' ? 'Essential Hypertension' : 'উচ্চ রক্তচাপ (High BP)'}</li>
                <li>{lang === 'en' ? 'Type 2 Diabetes Mellitus' : 'টাইপ-২ ডায়াবেটিস ও ইনসুলিন রেজিস্ট্যান্স'}</li>
                <li>{lang === 'en' ? 'Atherosclerosis & Heart Attack' : 'করোনারি হৃদরোগ ও হার্ট অ্যাটাক'}</li>
                <li>{lang === 'en' ? 'Ischemic & Hemorrhagic Stroke' : 'মস্তিষ্কে রক্তক্ষরণ বা স্ট্রোক'}</li>
              </ul>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
              <strong className="text-rose-800 dark:text-rose-300 block mb-1">
                {lang === 'en' ? 'Organ & Mechanical Strain' : 'অঙ্গপ্রত্যঙ্গ ও হাড়ের ক্ষতি'}
              </strong>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-300">
                <li>{lang === 'en' ? 'Non-Alcoholic Fatty Liver (NAFLD)' : 'ফ্যাটি লিভার ডিজিজ'}</li>
                <li>{lang === 'en' ? 'Obstructive Sleep Apnea (OSA)' : 'ঘুমে শ্বাসকষ্ট ও স্লিপ অ্যাপনিয়া'}</li>
                <li>{lang === 'en' ? 'Joint Osteoarthritis (Knee/Hip)' : 'হাঁটু ও জয়েন্টের অস্টিওআর্থ্রাইটিস'}</li>
                <li>{lang === 'en' ? 'Gallstones & GERD (Acid Reflux)' : 'পিত্তথলিতে পাথর ও এসিডিটি'}</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    // 8. Health Risks of Low BMI
    {
      id: 'underweightRisks',
      titleEn: 'Health Hazards of Being Underweight (BMI < 18.5)',
      titleBn: 'স্বাভাবিকের চেয়ে কম ওজনের (Underweight) ক্ষতিকর দিক ও স্বাস্থ্যঝুঁকি',
      renderContent: () => (
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
          <p>
            {lang === 'en'
              ? 'An abnormally low BMI (< 18.5 kg/m²) is a clinical indicator of insufficient caloric and nutrient intake, which impairs normal physiological functions:'
              : 'স্বাভাবিকের তুলনায় অতিরিক্ত কম ওজন শরীরের পুষ্টিহীনতার সংকেত দেয় এবং দেহের রোগ প্রতিরোধ ক্ষমতা কমিয়ে দেয়:'}
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li><strong>{lang === 'en' ? 'Nutritional Anemia:' : 'রক্তস্বল্পতা (Anemia):'} </strong>{lang === 'en' ? 'Deficiencies in iron, folate, and B12 leading to chronic fatigue.' : 'আয়রন ও ভিটামিন বি১২ ঘাটতিতে ক্লান্তি ও দুর্বলতা।'}</li>
            <li><strong>{lang === 'en' ? 'Bone Loss & Osteoporosis:' : 'অস্টিওপোরোসিস:'} </strong>{lang === 'en' ? 'Weakened bone mineral density and heightened fracture vulnerability.' : 'হাড়ের ঘনত্ব হ্রাস পাওয়া ও সহজে হাড় ভেঙে যাওয়ার প্রবণতা।'}</li>
            <li><strong>{lang === 'en' ? 'Weakened Immunity:' : 'রোগ প্রতিরোধ ক্ষমতা হ্রাস:'} </strong>{lang === 'en' ? 'Impaired white blood cell response and recurrent infections.' : 'ঘনঘন রোগবালাই এবং ক্ষত শুকাতে বেশি সময় লাগা।'}</li>
            <li><strong>{lang === 'en' ? 'Hormonal & Fertility Issues:' : 'প্রজনন স্বাস্থ্য সমস্যা:'} </strong>{lang === 'en' ? 'Amenorrhea (missed periods) and ovulatory difficulties in women.' : 'নারীদের অনিয়মিত মাসিক এবং সন্তান ধারণে জটিলতা।'}</li>
          </ul>
        </div>
      )
    },

    // 9. Medical Management & Related Clinical Drugs (E-E-A-T Internal Linking)
    {
      id: 'medicalTreatments',
      titleEn: 'Clinical Drug Index & Medical Solutions for Weight Disorders',
      titleBn: 'মেডিকেল সমাধান ও ফার্মাসিউটিক্যাল গাইড (সংশ্লিষ্ট ওষুধসমূহ)',
      renderContent: () => (
        <div id="related-medicines" className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
          <p>
            {lang === 'en'
              ? 'MEDDET provides comprehensive clinical monographs for prescription and OTC pharmaceuticals utilized in managing body weight, metabolic disorders, and nutritional recovery in Bangladesh:'
              : 'MEDDET-এ শারীরিক ওজন ও মেটাবলিক স্বাস্থ্য সমস্যার চিকিৎসায় ব্যবহৃত অনুমোদিত ওষুধের ক্লিনিক্যাল মনোগ্রাফ বিস্তারিত সংরক্ষিত রয়েছে:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Weight Loss Medications */}
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#095D7E] dark:text-[#2DD4BF]">
                <Pill className="w-4 h-4 text-[#14967F]" />
                <span>{lang === 'en' ? 'Weight Loss & Metabolic Regulators' : 'ওজন নিয়ন্ত্রণ ও মেটাবলিক ওষুধ'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'Prescription therapies for clinical obesity (BMI ≥ 30 or BMI ≥ 27 with comorbidities):' : 'স্থূলতা ও ডায়াবেটিসের ক্ষেত্রে চিকিৎসকের পরামর্শে ব্যবহৃত ওষুধ:'}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="/generic/orlistat-7pga"
                  className="px-2.5 py-1 rounded-lg bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#E2FCD6] font-bold text-xs border border-[#CCECEE] dark:border-[#243B53] transition-colors"
                >
                  Orlistat (ওরলিস্ট্যাট) &rarr;
                </a>
                <a
                  href="/generic/metformin-hydrochloride-x2r4"
                  className="px-2.5 py-1 rounded-lg bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#E2FCD6] font-bold text-xs border border-[#CCECEE] dark:border-[#243B53] transition-colors"
                >
                  Metformin HCl &rarr;
                </a>
                <a
                  href="/generic/atorvastatin-jq5y"
                  className="px-2.5 py-1 rounded-lg bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#E2FCD6] font-bold text-xs border border-[#CCECEE] dark:border-[#243B53] transition-colors"
                >
                  Atorvastatin (কোলেস্টেরল) &rarr;
                </a>
              </div>
            </div>

            {/* Nutritional Recovery for Underweight */}
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-[#095D7E] dark:text-[#2DD4BF]">
                <HeartPulse className="w-4 h-4 text-[#14967F]" />
                <span>{lang === 'en' ? 'Nutritional Repletion for Underweight' : 'পুষ্টি ঘাটতি পূরণ ও ওজন বৃদ্ধি'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {lang === 'en' ? 'Micronutrient supplements for malnutrition and healthy weight restoration:' : 'অপুষ্টি দূরীকরণ ও রক্তস্বল্পতা রোধে প্রয়োজনীয় সাপ্লিমেন্ট:'}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="/generic/multivitamins-multiminerals-xng2"
                  className="px-2.5 py-1 rounded-lg bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#095D7E] dark:text-[#2DD4BF] hover:bg-[#E2FCD6] font-bold text-xs border border-[#CCECEE] dark:border-[#243B53] transition-colors"
                >
                  Multivitamins + Minerals &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // 10. Limitations & Alternative Metrics
    {
      id: 'limitations',
      titleEn: 'Clinical Limitations of BMI & Alternative Health Metrics',
      titleBn: 'বিএমআই-এর সীমাবদ্ধতা ও বিকল্প ক্লিনিক্যাল পরিমাপ পদ্ধতি',
      renderContent: () => (
        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            {lang === 'en'
              ? 'Although Body Mass Index (BMI) is the world\'s most widely adopted population screening tool, clinicians recognize several inherent physiological limitations:'
              : 'বিএমআই অত্যন্ত জনপ্রিয় হলেও এর কিছু সীমাবদ্ধতা রয়েছে, যা বিবেচনায় রাখা জরুরি:'}
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1">
            <li>
              <strong>{lang === 'en' ? 'Muscle Mass vs Adipose Fat:' : 'পেশী ও চর্বির পার্থক্য না করতে পারা:'} </strong>
              {lang === 'en'
                ? 'Athletes, bodybuilders, and active individuals with substantial muscle mass frequently register as overweight or obese, despite possessing healthy low body fat levels.'
                : 'বডিবিল্ডার বা অ্যাথলেটদের শরীরে চর্বির পরিমাণ কম হলেও পেশীর ওজনের কারণে বিএমআই বেশি দেখাতে পারে।'}
            </li>
            <li>
              <strong>{lang === 'en' ? 'Waist-to-Height Ratio (WHtR):' : 'কোমর ও উচ্চতার অনুপাত (WHtR):'} </strong>
              {lang === 'en'
                ? 'Many cardiology guidelines recommend keeping waist circumference below half of your height (WHtR < 0.5) as a superior indicator of visceral abdominal fat.'
                : 'হৃদরোগের ঝুঁকি নিরূপণে কোমরের মাপ উচ্চতার অর্ধেকের কম রাখা সবচেয়ে বেশি কার্যকর নির্দেশক।'}
            </li>
          </ul>
        </div>
      )
    },

    // 11. Frequently Asked Questions (FAQ) Section - High Search Intent
    {
      id: 'faqs',
      titleEn: 'Frequently Asked Questions (Clinical FAQ)',
      titleBn: 'সাধারণ জিজ্ঞাসা ও বিশেষজ্ঞ চিকিৎসকদের প্রশ্নোত্তর (FAQ)',
      renderContent: () => (
        <div id="clinical-faqs" className="space-y-3.5 text-xs text-slate-700 dark:text-slate-300">
          <p className="text-slate-500 dark:text-slate-400">
            {lang === 'en'
              ? 'Authoritative answers to the most common questions regarding Body Mass Index, ideal weight, and health risks:'
              : 'বিএমআই, আদর্শ ওজন এবং স্বাস্থ্যঝুঁকি সম্পর্কিত সর্বাধিক জিজ্ঞাসিত প্রশ্নাবলির উত্তর:'}
          </p>

          <div className="space-y-2.5">
            {/* FAQ 1 */}
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
              <h3 className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] text-xs">
                {lang === 'en' ? 'What is a healthy BMI for men and women according to WHO?' : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) অনুযায়ী নারী ও পুরুষের স্বাভাবিক বিএমআই কত?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'According to WHO standards, a healthy adult Body Mass Index (BMI) is between 18.5 and 24.9 kg/m² for both men and women. For South Asian populations (including Bangladesh), WHO recommends keeping BMI between 18.5 and 22.9 kg/m² due to higher visceral fat risks.'
                  : 'ডব্লিউএইচও অনুযায়ী প্রাপ্তবয়স্কদের স্বাভাবিক বিএমআই ১৮.৫ থেকে ২৪.৯ এর মধ্যে থাকা স্বাস্থ্যকর। তবে দক্ষিণ এশীয় ও বাংলাদেশিদের ক্ষেত্রে ১৮.৫ থেকে ২২.৯ এর মধ্যে বজায় রাখাকে স্বাভাবিক হিসেবে গণ্য করা হয়।'}
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
              <h3 className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] text-xs">
                {lang === 'en' ? 'How do I calculate BMI online using kg and cm or lbs and inches?' : 'মেট্রিক ও ইম্পেরিয়াল পদ্ধতিতে কীভাবে বিএমআই হিসাব করবেন?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Metric Formula: Divide your weight in kilograms by your height in meters squared [BMI = kg / m²]. Imperial Formula: Multiply your weight in pounds by 703, then divide by height in inches squared [BMI = 703 × (lbs / in²)]. Our online calculator does this automatically.'
                  : 'মেট্রিক সূত্র: দেহের ওজন (কেজি)-কে উচ্চতা (মিটার)-এর বর্গ দিয়ে ভাগ করুন [BMI = ওজন / উচ্চতা²]। ইউএস ইম্পেরিয়াল সূত্র: ৭০৩ × [ওজন (পাউন্ড) / উচ্চতা² (ইঞ্চি)]। আমাদের অনলাইন ক্যালকুলেটর এক ক্লিকেই স্বয়ংক্রিয়ভাবে হিসাব করে দেয়।'}
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
              <h3 className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] text-xs">
                {lang === 'en' ? 'Why are BMI cut-offs lower for Asians and Bangladeshis (23 kg/m²)?' : 'এশীয় ও বাংলাদেশিদের ক্ষেত্রে কেন বিএমআই ২৩ হলেই ওভারওয়েট ধরা হয়?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'WHO research found that Asians naturally accumulate 3% to 5% more body fat and higher abdominal visceral fat than Caucasians of identical BMI. Therefore, type 2 diabetes and hypertension risks begin at a lower threshold of 23.0 kg/m².'
                  : 'গবেষণায় প্রমাণিত হয়েছে যে দক্ষিণ এশীয়দের কম ওজনেই পেটের ভেতরে ক্ষতিকর চর্বি বেশি জমে। ফলে আন্তর্জাতিক মানদণ্ডের (২৫) চেয়ে আগেই, অর্থাৎ ২৩ কেজি/মি² তেই ডায়াবেটিস ও হৃদরোগের ঝুঁকি শুরু হয়।'}
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
              <h3 className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] text-xs">
                {lang === 'en' ? 'What is my ideal body weight based on my height?' : 'উচ্চতা অনুযায়ী আমার আদর্শ ওজন কত হওয়া উচিত?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'Ideal body weight is evaluated by keeping your BMI within the healthy 18.5 – 24.9 window. For example, a 5\'4" person should ideally weigh between 49 kg and 66 kg (108–146 lbs), while a 5\'8" person should weigh 55 kg to 75 kg (121–165 lbs).'
                  : 'আপনার উচ্চতা অনুযায়ী আদর্শ ওজন নির্ভর করে স্বাভাবিক বিএমআই (১৮.৫ - ২৪.৯) বজায় রাখার ওপর। যেমন: ৫ ফুট ৪ ইঞ্চির ক্ষেত্রে আদর্শ ওজন ৪৯ থেকে ৬৬ কেজি, এবং ৫ ফুট ৮ ইঞ্চির ক্ষেত্রে ৫৫ থেকে ৭৫ কেজি থাকা বাঞ্ছনীয়।'}
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="p-3 bg-white dark:bg-[#152232] rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-1">
              <h3 className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] text-xs">
                {lang === 'en' ? 'Is BMI accurate for bodybuilders and athletes?' : 'বডিবিল্ডার ও অ্যাথলেটদের ক্ষেত্রে কি বিএমআই সঠিক ফলাফল দেয়?'}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'en'
                  ? 'No. BMI measures total excess weight rather than fat percentage. Muscular athletes often show as "overweight" or "obese" despite having very low body fat. Bodybuilders should rely on body fat percentage tests (calipers/DEXA) or waist circumference.'
                  : 'না। বিএমআই শরীরের অতিরিক্ত চর্বি ও পেশীর ওজনকে আলাদা করতে পারে না। ফলে বডিবিল্ডারদের ভারী মাংসপেশির কারণে বিএমআই বেশি আসলেও তারা চিকিৎসাগতভাবে স্থূল নন।'}
              </p>
            </div>
          </div>
        </div>
      )
    },

    // 12. Authoritative Clinical References & E-E-A-T Attribution
    {
      id: 'references',
      titleEn: 'Clinical References & Medical Editorial Standards (E-E-A-T)',
      titleBn: 'ক্লিনিক্যাল রেফারেন্স, বিশেষজ্ঞ রিভিউ ও তথ্যের নির্ভরযোগ্য উৎস',
      renderContent: () => (
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {/* Medical Reviewer Box */}
          <div className="p-3 bg-[#E2FCD6]/50 dark:bg-[#064E3B]/30 rounded-xl border border-[#14967F]/30 dark:border-[#2DD4BF]/30 flex items-start gap-3">
            <UserCheck className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#095D7E] dark:text-[#E2FCD6] font-bold block">
                {lang === 'en' ? 'Medically Reviewed by Clinical Panel' : 'বিশেষজ্ঞ চিকিৎসক প্যানেল কর্তৃক পর্যালোচিত'}
              </strong>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                {lang === 'en'
                  ? 'Reviewed by Dr. K. M. Rahman, MBBS, MD (Internal Medicine) • Updated for 2026 clinical standards.'
                  : 'ডাঃ কে. এম. রহমান, এমবিবিএস, এমডি (মেডিসিন) কর্তৃক ক্লিনিক্যাল মানদণ্ডে যাচাইকৃত • ২০২৬ সালের হালনাগাদ সংস্করণ।'}
              </p>
            </div>
          </div>

          <p>
            {lang === 'en'
              ? 'Our algorithms and educational data are strictly referenced from world-recognized health organizations:'
              : 'আমাদের সকল গণনা ও স্বাস্থ্য তথ্যসমূহ আন্তর্জাতিক স্বীকৃত চিকিৎসা প্রতিষ্ঠানের নির্দেশিকা অনুযায়ী তৈরি:'}
          </p>

          <ul className="space-y-1.5 pl-1">
            <li className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
              <a
                href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#14967F] dark:text-[#2DD4BF] hover:underline font-semibold"
              >
                World Health Organization (WHO) — Obesity and Overweight Factsheet
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
              <a
                href="https://www.cdc.gov/healthyweight/assessing/bmi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#14967F] dark:text-[#2DD4BF] hover:underline font-semibold"
              >
                Centers for Disease Control and Prevention (CDC) — Assessing Your Weight
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
              <a
                href="https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(04)15487-3/fulltext"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#14967F] dark:text-[#2DD4BF] hover:underline font-semibold"
              >
                WHO Expert Consultation — Appropriate Body-Mass Index for Asian Populations (The Lancet)
              </a>
            </li>
          </ul>

          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <strong>{lang === 'en' ? 'Clinical Disclaimer:' : 'সতর্কবার্তা:'} </strong>
            {lang === 'en'
              ? 'This BMI calculator is intended for informational and clinical screening purposes only. It should not replace comprehensive evaluation by a qualified physician or registered dietitian.'
              : 'এই ক্যালকুলেটরটি শুধুমাত্র প্রাথমিক স্বাস্থ্য সচেতনতা ও স্ক্রীনিংয়ের জন্য তৈরি। এটি সরাসরি কোনো চিকিৎসকের ব্যক্তিগত চিকিৎসা পরামর্শের বিকল্প নয়।'}
          </div>
        </div>
      )
    }
  ];

  return (
    <article aria-labelledby="clinical-bmi-guide-heading" className="space-y-2 mt-4">
      {/* Section Header with Expand/Collapse Controls */}
      <div className="flex items-center justify-between pb-1 px-1">
        <div>
          <h2 id="clinical-bmi-guide-heading" className="text-sm sm:text-base font-black text-[#095D7E] dark:text-slate-100 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#14967F] dark:text-[#2DD4BF]" />
            <span>{lang === 'en' ? 'Clinical Reference Guide & Medical Monograph' : 'ক্লিনিক্যাল রেফারেন্স নির্দেশিকা ও মনোগ্রাফ'}</span>
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {lang === 'en' ? 'WHO & CDC verified anthropometric tables, formulas, and health guidelines' : 'বিশ্ব স্বাস্থ্য সংস্থা ও সিডিসি অনুমোদিত ওজন ও স্বাস্থ্য নির্দেশিকা'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-bold">
          <button
            type="button"
            onClick={handleExpandAll}
            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#14967F] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Expand All' : 'সব খুলুন'}
          </button>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <button
            type="button"
            onClick={handleCollapseAll}
            className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#14967F] dark:hover:text-[#2DD4BF] transition-colors cursor-pointer"
          >
            {lang === 'en' ? 'Collapse' : 'সংক্ষেপ'}
          </button>
        </div>
      </div>

      {/* Accordion Panels */}
      <div className="space-y-1.5">
        {items.map((item) => {
          const isOpen = Boolean(openItems[item.id]);
          return (
            <section
              key={item.id}
              className="bg-white dark:bg-[#131B2E] rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs transition-colors"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggleItem(item.id)}
                className="w-full py-2.5 px-3 flex items-center justify-between gap-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[#14967F] dark:text-[#2DD4BF] shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {lang === 'bn' ? item.titleBn : item.titleEn}
                  </span>
                </div>

                <div className="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-[#14967F] dark:text-[#2DD4BF]" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              <div
                className={`py-3 px-3.5 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-800/40 ${
                  isOpen ? 'block' : 'hidden'
                }`}
                aria-hidden={!isOpen}
              >
                {item.renderContent()}
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
};
