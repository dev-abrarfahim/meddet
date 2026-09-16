import React, { useState, useEffect } from 'react';
import { Gender, UnitSystem } from '../../../types/bmi';
import { LanguageMode } from '../../../types';
import { cmToFtInches, ftInchesToCm, kgToLbs, lbsToKg } from '../../../utils/bmiCalculator';
import { Calculator, RotateCcw, ArrowRight, Check } from 'lucide-react';

interface BmiCalculatorCardProps {
  age: number | null;
  gender: Gender;
  heightCm: number | null;
  weightKg: number | null;
  onUpdate: (params: { age: number | null; gender: Gender; heightCm: number | null; weightKg: number | null }) => void;
  onCalculate: () => void;
  onReset: () => void;
  lang?: LanguageMode;
}

export const BmiCalculatorCard: React.FC<BmiCalculatorCardProps> = ({
  age,
  gender,
  heightCm,
  weightKg,
  onUpdate,
  onCalculate,
  onReset,
  lang = 'en'
}) => {
  const [heightUnit, setHeightUnit] = useState<UnitSystem>('metric');
  const [weightUnit, setWeightUnit] = useState<UnitSystem>('metric');

  // Convert for display
  const ftIn = heightCm !== null ? cmToFtInches(heightCm) : { feet: 0, inches: 0 };
  const weightLbs = weightKg !== null ? kgToLbs(weightKg) : 0;

  // String values for inputs - start completely empty by default
  const [ageStr, setAgeStr] = useState<string>('');
  const [heightCmStr, setHeightCmStr] = useState<string>('');
  const [heightFtStr, setHeightFtStr] = useState<string>('');
  const [heightInStr, setHeightInStr] = useState<string>('');
  const [weightKgStr, setWeightKgStr] = useState<string>('');
  const [weightLbsStr, setWeightLbsStr] = useState<string>('');

  const handleAgeChange = (valStr: string) => {
    setAgeStr(valStr);
    if (valStr.trim() !== '') {
      const num = parseInt(valStr, 10);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, 2), 120);
        onUpdate({ age: clamped, gender, heightCm, weightKg });
      }
    } else {
      onUpdate({ age: null, gender, heightCm, weightKg });
    }
  };

  const handleAgeBlur = () => {
    if (ageStr.trim() !== '') {
      const num = parseInt(ageStr, 10);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, 2), 120);
        setAgeStr(clamped.toString());
        onUpdate({ age: clamped, gender, heightCm, weightKg });
      }
    } else {
      onUpdate({ age: null, gender, heightCm, weightKg });
    }
  };

  const handleGenderChange = (newGender: Gender) => {
    onUpdate({ age, gender: newGender, heightCm, weightKg });
  };

  const handleMetricHeightChange = (valStr: string) => {
    setHeightCmStr(valStr);
    if (valStr.trim() !== '') {
      const num = parseInt(valStr, 10);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, 60), 240);
        onUpdate({ age, gender, heightCm: clamped, weightKg });
      }
    } else {
      onUpdate({ age, gender, heightCm: null, weightKg });
    }
  };

  const handleMetricHeightBlur = () => {
    if (heightCmStr.trim() !== '') {
      const num = parseInt(heightCmStr, 10);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, 60), 240);
        setHeightCmStr(clamped.toString());
        onUpdate({ age, gender, heightCm: clamped, weightKg });
      }
    } else {
      onUpdate({ age, gender, heightCm: null, weightKg });
    }
  };

  const handleFtChange = (valStr: string) => {
    setHeightFtStr(valStr);
    if (valStr.trim() === '' && heightInStr.trim() === '') {
      onUpdate({ age, gender, heightCm: null, weightKg });
    } else {
      const feet = parseInt(valStr, 10) || 0;
      const inches = parseInt(heightInStr, 10) || 0;
      const cm = ftInchesToCm(feet, inches);
      const clamped = Math.min(Math.max(cm, 60), 240);
      onUpdate({ age, gender, heightCm: clamped, weightKg });
    }
  };

  const handleInChange = (valStr: string) => {
    setHeightInStr(valStr);
    if (valStr.trim() === '' && heightFtStr.trim() === '') {
      onUpdate({ age, gender, heightCm: null, weightKg });
    } else {
      const feet = parseInt(heightFtStr, 10) || 0;
      const inches = parseInt(valStr, 10) || 0;
      const cm = ftInchesToCm(feet, inches);
      const clamped = Math.min(Math.max(cm, 60), 240);
      onUpdate({ age, gender, heightCm: clamped, weightKg });
    }
  };

  const handleWeightKgChange = (valStr: string) => {
    setWeightKgStr(valStr);
    if (valStr.trim() !== '') {
      const num = parseFloat(valStr);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, 15), 250);
        onUpdate({ age, gender, heightCm, weightKg: clamped });
      }
    } else {
      onUpdate({ age, gender, heightCm, weightKg: null });
    }
  };

  const handleWeightKgBlur = () => {
    if (weightKgStr.trim() !== '') {
      const num = parseFloat(weightKgStr);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, 15), 250);
        setWeightKgStr(clamped.toString());
        onUpdate({ age, gender, heightCm, weightKg: clamped });
      }
    } else {
      onUpdate({ age, gender, heightCm, weightKg: null });
    }
  };

  const handleWeightLbsChange = (valStr: string) => {
    setWeightLbsStr(valStr);
    if (valStr.trim() !== '') {
      const num = parseFloat(valStr);
      if (!isNaN(num)) {
        const kg = lbsToKg(num);
        const clamped = Math.min(Math.max(kg, 15), 250);
        onUpdate({ age, gender, heightCm, weightKg: clamped });
      }
    } else {
      onUpdate({ age, gender, heightCm, weightKg: null });
    }
  };

  const handleWeightLbsBlur = () => {
    if (weightLbsStr.trim() !== '') {
      const lbs = parseFloat(weightLbsStr);
      if (!isNaN(lbs)) {
        const kg = lbsToKg(lbs);
        const clamped = Math.min(Math.max(kg, 15), 250);
        setWeightLbsStr(Math.round(kgToLbs(clamped)).toString());
        onUpdate({ age, gender, heightCm, weightKg: clamped });
      }
    } else {
      onUpdate({ age, gender, heightCm, weightKg: null });
    }
  };

  const handleResetClick = () => {
    setAgeStr('');
    setHeightCmStr('');
    setHeightFtStr('');
    setHeightInStr('');
    setWeightKgStr('');
    setWeightLbsStr('');
    onReset();
  };

  return (
    <div className="w-full bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] shadow-xs p-4 sm:p-5 text-slate-800 dark:text-slate-100">
      {/* Title & Subtitle */}
      <div className="border-b border-[#CCECEE] dark:border-[#243B53] pb-3 mb-3.5 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-[#095D7E] dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
            {lang === 'en' ? 'BMI Calculator' : 'বিএমআই ক্যালকুলেটর'}
          </h2>
          <p className="text-xs text-[#64748B] dark:text-slate-400 font-medium mt-0.5">
            {lang === 'en' ? 'Body Mass Index Clinical Measurement' : 'বডি ম্যাস ইনডেক্স ক্লিনিক্যাল পরিমাপ'}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F1F9FF] text-[#095D7E] dark:bg-[#1A2B3E] dark:text-[#2DD4BF] border border-[#CCECEE] dark:border-[#243B53]">
          {lang === 'en' ? 'WHO Standard' : 'WHO মানদণ্ড'}
        </span>
      </div>

      {/* 1. Biological Sex / Gender Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-[#095D7E] dark:text-slate-200 flex items-center gap-1.5">
            {lang === 'en' ? 'Biological Sex' : 'শারীরবৃত্তীয় লিঙ্গ'}
          </label>
          <span className="text-[11px] font-medium text-[#64748B] dark:text-slate-400">
            {lang === 'en' ? 'Morphology Reference' : 'দেহ গঠন রেফারেন্স'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Biological Sex">
          {/* Male Selector Card */}
          <button
            type="button"
            id="btn-gender-male"
            role="radio"
            aria-checked={gender === 'male'}
            onClick={() => handleGenderChange('male')}
            className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left select-none ${
              gender === 'male'
                ? 'bg-gradient-to-r from-[#095D7E] to-[#14967F] border-transparent text-white shadow-sm ring-2 ring-[#14967F]/20'
                : 'bg-[#F8FCFD] dark:bg-[#1A2B3E] border-[#CCECEE] dark:border-[#243B53] text-[#475569] dark:text-slate-200 hover:bg-[#F1F9FF] dark:hover:bg-[#1E3A52] hover:border-[#14967F]/50 hover:text-[#095D7E]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  gender === 'male'
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'bg-[#CCECEE]/40 dark:bg-[#243B53] text-[#095D7E] dark:text-[#2DD4BF] group-hover:bg-[#14967F]/10 group-hover:text-[#14967F]'
                }`}
              >
                {/* Modern Mars SVG Icon */}
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="10" cy="14" r="5" />
                  <path d="M19 5l-5.4 5.4" />
                  <path d="M19 5h-5" />
                  <path d="M19 5v5" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">
                  {lang === 'en' ? 'Male' : 'পুরুষ'}
                </span>
                <span
                  className={`text-[9.5px] leading-tight block font-medium ${
                    gender === 'male' ? 'text-white/80' : 'text-[#94A3B8] dark:text-slate-400'
                  }`}
                >
                  {lang === 'en' ? 'XY Reference' : 'XY রেফারেন্স'}
                </span>
              </div>
            </div>

            {/* Check / Selection Indicator */}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                gender === 'male'
                  ? 'bg-white text-[#095D7E] shadow-xs scale-100'
                  : 'border border-[#CBD5E1] dark:border-[#243B53] bg-white dark:bg-[#152232] group-hover:border-[#14967F]/60'
              }`}
            >
              {gender === 'male' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>

          {/* Female Selector Card */}
          <button
            type="button"
            id="btn-gender-female"
            role="radio"
            aria-checked={gender === 'female'}
            onClick={() => handleGenderChange('female')}
            className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200 cursor-pointer text-left select-none ${
              gender === 'female'
                ? 'bg-gradient-to-r from-[#095D7E] to-[#14967F] border-transparent text-white shadow-sm ring-2 ring-[#14967F]/20'
                : 'bg-[#F8FCFD] dark:bg-[#1A2B3E] border-[#CCECEE] dark:border-[#243B53] text-[#475569] dark:text-slate-200 hover:bg-[#F1F9FF] dark:hover:bg-[#1E3A52] hover:border-[#14967F]/50 hover:text-[#095D7E]'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  gender === 'female'
                    ? 'bg-white/20 text-white shadow-inner'
                    : 'bg-[#CCECEE]/40 dark:bg-[#243B53] text-[#095D7E] dark:text-[#2DD4BF] group-hover:bg-[#14967F]/10 group-hover:text-[#14967F]'
                }`}
              >
                {/* Modern Venus SVG Icon */}
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="9" r="5" />
                  <path d="M12 14v7" />
                  <path d="M9 18h6" />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold block leading-tight">
                  {lang === 'en' ? 'Female' : 'মহিলা'}
                </span>
                <span
                  className={`text-[9.5px] leading-tight block font-medium ${
                    gender === 'female' ? 'text-white/80' : 'text-[#94A3B8] dark:text-slate-400'
                  }`}
                >
                  {lang === 'en' ? 'XX Reference' : 'XX রেফারেন্স'}
                </span>
              </div>
            </div>

            {/* Check / Selection Indicator */}
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                gender === 'female'
                  ? 'bg-white text-[#095D7E] shadow-xs scale-100'
                  : 'border border-[#CBD5E1] dark:border-[#243B53] bg-white dark:bg-[#152232] group-hover:border-[#14967F]/60'
              }`}
            >
              {gender === 'female' && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
          </button>
        </div>
      </div>

      {/* 2. Age Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="input-age" className="text-sm font-semibold text-[#095D7E] dark:text-slate-200">
            {lang === 'en' ? 'Age' : 'বয়স'}
          </label>
          <span className="text-[11px] font-medium text-[#64748B] dark:text-slate-400">
            {lang === 'en' ? 'Pediatric & Adult (2–120 yrs)' : 'শিশু ও প্রাপ্তবয়স্ক (২-১২০ বছর)'}
          </span>
        </div>

        {/* Clean, professional Input Box with embedded unit inside */}
        <div className="relative flex items-center w-full">
          <input
            id="input-age"
            type="number"
            min={2}
            max={120}
            value={ageStr}
            placeholder={lang === 'en' ? 'e.g. 28' : 'যেমন: ২৮'}
            onBlur={handleAgeBlur}
            onChange={(e) => handleAgeChange(e.target.value)}
            className="w-full h-11 px-3.5 pr-14 text-sm sm:text-base font-bold text-[#095D7E] dark:text-slate-100 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14967F] dark:focus:ring-[#2DD4BF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
          />
          <span className="absolute right-3.5 text-xs font-bold text-[#64748B] dark:text-slate-400 pointer-events-none select-none">
            {lang === 'en' ? 'yrs' : 'বছর'}
          </span>
        </div>
      </div>

      {/* 3. Height Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-[#095D7E] dark:text-slate-200">
            {lang === 'en' ? 'Height' : 'উচ্চতা'}
          </label>
          {/* Unit Toggle: Metric vs USA */}
          <div className="flex items-center bg-[#F1F9FF] dark:bg-[#1A2B3E] p-0.5 rounded-lg border border-[#CCECEE] dark:border-[#243B53] text-xs">
            <button
              type="button"
              id="btn-height-metric"
              onClick={() => setHeightUnit('metric')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                heightUnit === 'metric'
                  ? 'bg-[#14967F] dark:bg-[#2DD4BF] text-white dark:text-slate-950 shadow-xs'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
              }`}
            >
              {lang === 'en' ? 'Metric (cm)' : 'সেমি (cm)'}
            </button>
            <button
              type="button"
              id="btn-height-imperial"
              onClick={() => setHeightUnit('imperial')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                heightUnit === 'imperial'
                  ? 'bg-[#14967F] dark:bg-[#2DD4BF] text-white dark:text-slate-950 shadow-xs'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
              }`}
            >
              {lang === 'en' ? 'USA (ft/in)' : 'ফিট/ইঞ্চি'}
            </button>
          </div>
        </div>

        {/* Input fields based on unit */}
        {heightUnit === 'metric' ? (
          <div className="relative flex items-center w-full">
            <input
              id="input-height-cm"
              type="number"
              min={60}
              max={240}
              value={heightCmStr}
              placeholder={lang === 'en' ? 'e.g. 172' : 'যেমন: ১৭২'}
              onBlur={handleMetricHeightBlur}
              onChange={(e) => handleMetricHeightChange(e.target.value)}
              className="w-full h-11 px-3.5 pr-14 text-sm sm:text-base font-bold text-[#095D7E] dark:text-slate-100 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14967F] dark:focus:ring-[#2DD4BF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
            />
            <span className="absolute right-3.5 text-xs font-bold text-[#64748B] dark:text-slate-400 pointer-events-none select-none">
              {lang === 'en' ? 'cm' : 'সেমি'}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <div className="relative flex items-center w-full">
              <input
                id="input-height-ft"
                type="number"
                min={2}
                max={7}
                value={heightFtStr}
                placeholder={lang === 'en' ? 'e.g. 5' : 'যেমন: ৫'}
                onChange={(e) => handleFtChange(e.target.value)}
                className="w-full h-11 px-3.5 pr-12 text-sm sm:text-base font-bold text-[#095D7E] dark:text-slate-100 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14967F] dark:focus:ring-[#2DD4BF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
              />
              <span className="absolute right-3.5 text-xs font-bold text-[#64748B] dark:text-slate-400 pointer-events-none select-none">
                {lang === 'en' ? 'ft' : 'ফিট'}
              </span>
            </div>
            <div className="relative flex items-center w-full">
              <input
                id="input-height-in"
                type="number"
                min={0}
                max={11}
                value={heightInStr}
                placeholder={lang === 'en' ? 'e.g. 8' : 'যেমন: ৮'}
                onChange={(e) => handleInChange(e.target.value)}
                className="w-full h-11 px-3.5 pr-12 text-sm sm:text-base font-bold text-[#095D7E] dark:text-slate-100 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14967F] dark:focus:ring-[#2DD4BF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
              />
              <span className="absolute right-3.5 text-xs font-bold text-[#64748B] dark:text-slate-400 pointer-events-none select-none">
                {lang === 'en' ? 'in' : 'ইঞ্চি'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Weight Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-[#095D7E] dark:text-slate-200">
            {lang === 'en' ? 'Weight' : 'ওজন'}
          </label>
          {/* Unit Toggle: Metric vs USA */}
          <div className="flex items-center bg-[#F1F9FF] dark:bg-[#1A2B3E] p-0.5 rounded-lg border border-[#CCECEE] dark:border-[#243B53] text-xs">
            <button
              type="button"
              id="btn-weight-metric"
              onClick={() => setWeightUnit('metric')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                weightUnit === 'metric'
                  ? 'bg-[#14967F] dark:bg-[#2DD4BF] text-white dark:text-slate-950 shadow-xs'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
              }`}
            >
              {lang === 'en' ? 'Metric (kg)' : 'কেজি (kg)'}
            </button>
            <button
              type="button"
              id="btn-weight-imperial"
              onClick={() => setWeightUnit('imperial')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                weightUnit === 'imperial'
                  ? 'bg-[#14967F] dark:bg-[#2DD4BF] text-white dark:text-slate-950 shadow-xs'
                  : 'text-[#64748B] dark:text-slate-400 hover:text-[#095D7E] dark:hover:text-slate-200'
              }`}
            >
              {lang === 'en' ? 'USA (lbs)' : 'পাউন্ড (lbs)'}
            </button>
          </div>
        </div>

        {weightUnit === 'metric' ? (
          <div className="relative flex items-center w-full">
            <input
              id="input-weight-kg"
              type="number"
              step={0.5}
              min={20}
              max={250}
              value={weightKgStr}
              placeholder={lang === 'en' ? 'e.g. 68' : 'যেমন: ৬৮'}
              onBlur={handleWeightKgBlur}
              onChange={(e) => handleWeightKgChange(e.target.value)}
              className="w-full h-11 px-3.5 pr-14 text-sm sm:text-base font-bold text-[#095D7E] dark:text-slate-100 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14967F] dark:focus:ring-[#2DD4BF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
            />
            <span className="absolute right-3.5 text-xs font-bold text-[#64748B] dark:text-slate-400 pointer-events-none select-none">
              {lang === 'en' ? 'kg' : 'কেজি'}
            </span>
          </div>
        ) : (
          <div className="relative flex items-center w-full">
            <input
              id="input-weight-lbs"
              type="number"
              step={0.5}
              min={44}
              max={550}
              value={weightLbsStr}
              placeholder={lang === 'en' ? 'e.g. 150' : 'যেমন: ১৫০'}
              onBlur={handleWeightLbsBlur}
              onChange={(e) => handleWeightLbsChange(e.target.value)}
              className="w-full h-11 px-3.5 pr-14 text-sm sm:text-base font-bold text-[#095D7E] dark:text-slate-100 bg-[#F1F9FF] dark:bg-[#1A2B3E] border border-[#CCECEE] dark:border-[#243B53] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#14967F] dark:focus:ring-[#2DD4BF] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-normal"
            />
            <span className="absolute right-3.5 text-xs font-bold text-[#64748B] dark:text-slate-400 pointer-events-none select-none">
              {lang === 'en' ? 'lbs' : 'পাউন্ড'}
            </span>
          </div>
        )}
      </div>

      {/* 5. Action Buttons (Calculate & Clear) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button
          type="button"
          id="btn-calculate-bmi"
          onClick={onCalculate}
          className="w-full py-2.5 px-4 rounded-xl bg-[#14967F] hover:bg-[#0D6F5D] dark:bg-[#2DD4BF] dark:hover:bg-[#14B8A6] dark:text-slate-950 active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>{lang === 'en' ? 'Calculate' : 'হিসাব করুন'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          id="btn-clear-bmi"
          onClick={handleResetClick}
          className="w-full py-2.5 px-4 rounded-xl bg-[#F1F9FF] hover:bg-[#CCECEE]/40 dark:bg-[#1A2B3E] dark:hover:bg-[#243B53] active:scale-[0.98] text-[#475569] hover:text-[#095D7E] dark:text-slate-300 dark:hover:text-white font-semibold text-sm border border-[#CCECEE] dark:border-[#243B53] flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{lang === 'en' ? 'Clear' : 'মুছে ফেলুন'}</span>
        </button>
      </div>
    </div>
  );
};
