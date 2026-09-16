import React, { useMemo, useState, useEffect, useRef } from 'react';
import { BmiCalculationResult, BmiCategoryInfo } from '../../../types/bmi';
import { LanguageMode } from '../../../types';
import { kgToLbs } from '../../../utils/bmiCalculator';
import { Activity, Scale } from 'lucide-react';

interface BmiGaugeProps {
  result?: BmiCalculationResult | null;
  bmi?: number;
  category?: BmiCategoryInfo;
  lang?: LanguageMode;
}

const cx = 300;
const cy = 320;
const R = 270;

// Radius fractions matching the calibrated SVG gauge architecture
const RING = {
  darkGrayOut: 1.000, darkGrayIn: 0.971,
  lightGrayOut: 0.971, lightGrayIn: 0.923,
  brightOut:    0.923, brightIn:   0.658,
  darkOut:      0.658, darkIn:     0.362,
  hubRingOut:   0.362, hubRingIn:  0.332,
  hub:          0.332
};

interface Segment {
  name: string;
  range: string;
  a1: number;
  a2: number;
  bright: string;
  dark: string;
}

// Calibrated segments matching clinical thresholds and medical palette
const SEGMENTS: Segment[] = [
  { name: 'UNDERWEIGHT',     range: '<18.5',     a1: 180, a2: 144, bright: '#38BDF8', dark: '#0284C7' },
  { name: 'NORMAL',          range: '18.5-24.9', a1: 144, a2: 108, bright: '#14967F', dark: '#0D6F5D' },
  { name: 'OVERWEIGHT',      range: '25-29.9',   a1: 108, a2: 72,  bright: '#FBBF24', dark: '#D97706' },
  { name: 'OBESE',           range: '30-34.9',   a1: 72,  a2: 36,  bright: '#FB923C', dark: '#EA580C' },
  { name: 'EXTREMELY OBESE', range: '>35',       a1: 36,  a2: 0,   bright: '#EF4444', dark: '#DC2626' }
];

function polar(r: number, deg: number): [number, number] {
  const rad = deg * Math.PI / 180;
  return [ cx + r * Math.cos(rad), cy - r * Math.sin(rad) ];
}

function sectorPath(rOuter: number, rInner: number, a1: number, a2: number): string {
  const [ox1, oy1] = polar(rOuter, a1);
  const [ox2, oy2] = polar(rOuter, a2);
  const large = (a1 - a2) > 180 ? 1 : 0;
  if (rInner <= 0) {
    return `M ${ox1} ${oy1} A ${rOuter} ${rOuter} 0 ${large} 1 ${ox2} ${oy2} L ${cx} ${cy} Z`;
  }
  const [ix2, iy2] = polar(rInner, a2);
  const [ix1, iy1] = polar(rInner, a1);
  return `M ${ox1} ${oy1} A ${rOuter} ${rOuter} 0 ${large} 1 ${ox2} ${oy2} `
       + `L ${ix2} ${iy2} A ${rInner} ${rInner} 0 ${large} 0 ${ix1} ${iy1} Z`;
}

function arcPath(r: number, a1: number, a2: number): string {
  const [x1, y1] = polar(r, a1);
  const [x2, y2] = polar(r, a2);
  const large = (a1 - a2) > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

function fitFont(text: string, arcLen: number, opts?: { max?: number; min?: number; avgChar?: number; pad?: number }): number {
  const o = Object.assign({ max: 19, min: 10, avgChar: 0.66, pad: 0.86 }, opts || {});
  const size = (arcLen * o.pad) / (text.length * o.avgChar);
  return Math.max(o.min, Math.min(o.max, size));
}

function bmiToAngle(val: number): number {
  const MIN = 15, MAX = 40;
  const clamped = Math.max(MIN, Math.min(MAX, val));
  return 180 - ((clamped - MIN) / (MAX - MIN)) * 180;
}

export const BmiGauge: React.FC<BmiGaugeProps> = ({ result, bmi: propBmi, category: propCategory, lang = 'en' }) => {
  const hasResult = Boolean(result || propBmi !== undefined);
  const bmi = propBmi ?? result?.bmi ?? 0;
  const category = propCategory ?? result?.category;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // IntersectionObserver to detect when the user scrolls to the BMI Radial Dial section
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            setIsInView(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // When bmi changes (e.g. after Calculate click), replay the dial hand moving animation
  useEffect(() => {
    if (!hasResult) return;
    setIsInView(false);
    const timer = setTimeout(() => {
      setIsInView(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [bmi, hasResult]);

  const angle = useMemo(() => {
    if (!hasResult) return 180;
    return bmiToAngle(bmi);
  }, [hasResult, bmi]);

  const minLbs = result ? kgToLbs(result.healthyWeightMin) : 0;
  const maxLbs = result ? kgToLbs(result.healthyWeightMax) : 0;
  const isHealthy = category?.key === 'normal';

  // Geometric radii calculations
  const labelRadius = R * ((RING.brightOut + RING.brightIn) / 2 + 0.015);
  const rangeRadius = R * (RING.darkOut - 0.06);
  const segAngleRad = (180 / SEGMENTS.length) * Math.PI / 180;
  const labelArcLen = labelRadius * segAngleRad;
  const rangeArcLen = rangeRadius * segAngleRad;

  // Needle geometry pointing at 90deg straight up
  const tip = polar(R * 0.650, 90);
  const base1 = polar(R * RING.hubRingOut, 90 + 11.5);
  const base2 = polar(R * RING.hubRingOut, 90 - 11.5);

  // Badge styling matching the official Meddit light-mode tokens
  let badgeStyle = 'bg-[#E2FCD6] text-[#0D6F5D] border-[#14967F]/30';
  if (category?.key === 'overweight') {
    badgeStyle = 'bg-amber-50 text-amber-800 border-amber-300';
  } else if (category?.key === 'underweight') {
    badgeStyle = 'bg-[#F1F9FF] dark:bg-[#1E293B] text-[#095D7E] dark:text-[#2DD4BF] border-[#CCECEE] dark:border-[#243B53]';
  } else if (category?.key === 'obese' || category?.key === 'extremely_obese') {
    badgeStyle = 'bg-rose-50 text-rose-800 border-rose-300';
  }

  return (
    <div
      ref={containerRef}
      className="w-full bg-white dark:bg-[#152232] text-slate-800 dark:text-slate-100 rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-3 sm:p-5 shadow-xs flex flex-col items-center"
    >
      {/* Light Theme Card Header */}
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-[#CCECEE] dark:border-[#243B53]">
        <h2 className="text-sm font-bold text-[#095D7E] dark:text-slate-100 tracking-tight flex items-center gap-1.5 font-['Poppins',sans-serif]">
          {lang === 'en' ? 'BMI Radial Dial' : 'বিএমআই ডায়াল গেজ'}
        </h2>
        <span className="text-[10px] text-[#095D7E] dark:text-[#2DD4BF] font-semibold bg-[#F1F9FF] dark:bg-[#1E293B] px-2 py-0.5 rounded border border-[#CCECEE] dark:border-[#243B53]">
          {lang === 'en' ? 'WHO Clinical Scale' : 'WHO ক্লিনিক্যাল স্কেল'}
        </span>
      </div>

      {/* SVG Radial Semi-Circle Gauge: Full width on mobile, sleek and compact on PC */}
      <div className="w-full max-w-full md:max-w-[400px] lg:max-w-[410px] mx-auto relative px-0">
        <svg
          id="gaugeSvg"
          viewBox="25 44 550 282"
          className="w-full h-auto block overflow-visible select-none"
        >
          <defs>
            {SEGMENTS.map((s, i) => (
              <React.Fragment key={'arc-defs-' + i}>
                <path
                  id={'labelArc' + i}
                  d={arcPath(labelRadius, s.a1 - 1.5, s.a2 + 1.5)}
                  fill="none"
                />
                <path
                  id={'rangeArc' + i}
                  d={arcPath(rangeRadius, s.a1 - 1.5, s.a2 + 1.5)}
                  fill="none"
                />
              </React.Fragment>
            ))}

            {/* Needle gradient in Med Navy to Med Teal */}
            <linearGradient id="needleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#095D7E" />
              <stop offset="100%" stopColor="#14967F" />
            </linearGradient>

            {/* Subtle Hub Shadow Filter */}
            <filter id="hubShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#095D7E" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Decorative Outer Rings in Med Navy and Med Cyan */}
          <path
            d={sectorPath(R * RING.darkGrayOut, R * RING.darkGrayIn, 180, 0)}
            fill="#095D7E"
          />
          <path
            d={sectorPath(R * RING.lightGrayOut, R * RING.lightGrayIn, 180, 0)}
            fill="#CCECEE"
          />

          {/* Colored Segments */}
          {SEGMENTS.map(s => (
            <React.Fragment key={'seg-' + s.name}>
              <path
                d={sectorPath(R * RING.brightOut, R * RING.brightIn, s.a1, s.a2)}
                fill={s.bright}
              />
              <path
                d={sectorPath(R * RING.darkOut, R * RING.darkIn, s.a1, s.a2)}
                fill={s.dark}
              />
            </React.Fragment>
          ))}

          {/* Calibrated Curved Labels & Ranges along radial paths - Large & Bold for Mobile */}
          {SEGMENTS.map((s, i) => {
            const fsLabel = fitFont(s.name, labelArcLen, { max: 14, min: 11 });
            const fsRange = fitFont(s.range, rangeArcLen, { max: 17, min: 14 });
            return (
              <React.Fragment key={'label-group-' + i}>
                <text
                  fontSize={fsLabel.toFixed(1)}
                  fill="#ffffff"
                  letterSpacing="0.3"
                  fontFamily="'Poppins', sans-serif"
                  fontWeight="700"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                >
                  <textPath
                    href={'#labelArc' + i}
                    xlinkHref={'#labelArc' + i}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {s.name}
                  </textPath>
                </text>

                <text
                  fontSize={fsRange.toFixed(1)}
                  fill="#ffffff"
                  fontFamily="'Poppins', sans-serif"
                  fontWeight="800"
                  letterSpacing="0.2"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.65))' }}
                >
                  <textPath
                    href={'#rangeArc' + i}
                    xlinkHref={'#rangeArc' + i}
                    startOffset="50%"
                    textAnchor="middle"
                  >
                    {s.range}
                  </textPath>
                </text>
              </React.Fragment>
            );
          })}

          {/* Needle Indicator with smooth moving animation on scroll into view */}
          <g
            id="needleGroup"
            style={{
              transformOrigin: '300px 320px',
              transition: isInView ? 'transform 1.2s cubic-bezier(0.34, 1.35, 0.35, 1)' : 'none',
              transform: `rotate(${isInView ? (90 - angle) : -90}deg)`
            }}
          >
            <path
              d={`M ${tip[0]} ${tip[1]} L ${base1[0]} ${base1[1]} L ${base2[0]} ${base2[1]} Z`}
              fill="url(#needleGrad)"
            />
          </g>

          {/* Hub Ring in Med Cyan */}
          <path
            d={sectorPath(R * RING.hubRingOut, R * RING.hubRingIn, 180, 0)}
            fill="#CCECEE"
          />

          {/* Hub Center in Light Blue (#F1F9FF) with crisp Med Cyan border */}
          <path
            d={sectorPath(R * RING.hub, 0, 180, 0)}
            fill="#F1F9FF"
            stroke="#CCECEE"
            strokeWidth="1.5"
            filter="url(#hubShadow)"
          />

          {/* Baseline flat border */}
          <line
            x1={cx - R}
            y1={cy}
            x2={cx + R}
            y2={cy}
            stroke="#CCECEE"
            strokeWidth="1.5"
          />

          {/* BMI Readout Inside Hub in official Med Navy (#095D7E) */}
          <text
            x={cx}
            y={cy - 56}
            textAnchor="middle"
            fill="#14967F"
            fontFamily="'Poppins', sans-serif"
            fontWeight="800"
            fontSize="22"
            letterSpacing="1"
          >
            BMI
          </text>
          <text
            x={cx}
            y={cy - 10}
            textAnchor="middle"
            fill="#095D7E"
            fontFamily="'Poppins', sans-serif"
            fontWeight="900"
            fontSize="50"
            id="bmiValueText"
          >
            {hasResult ? bmi.toFixed(1) : '—'}
          </text>
        </svg>
      </div>

      {/* Category Readout below gauge matching medical palette */}
      <div className="mt-2 text-center flex flex-col items-center">
        {category ? (
          <>
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded border ${badgeStyle} shadow-2xs`}>
              {lang === 'bn' && category.labelBn ? category.labelBn : category.label}
            </span>

            {(category.description || category.descriptionBn) && (
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 text-center mt-1.5 px-4 leading-relaxed font-['Poppins',sans-serif]">
                {lang === 'bn' && category.descriptionBn ? category.descriptionBn : category.description}
              </p>
            )}
          </>
        ) : (
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded border bg-[#F1F9FF] dark:bg-[#1E293B] text-[#64748B] dark:text-slate-400 border-[#CCECEE] dark:border-[#243B53] shadow-2xs">
            {lang === 'en' ? 'Awaiting Calculation' : 'হিসাব করার জন্য তথ্য দিন'}
          </span>
        )}
      </div>

      {/* Merged Clinical Anthropometric Metrics & Accordion */}
      {result && (
        <div className="w-full mt-3.5 pt-3.5 border-t border-[#CCECEE] dark:border-[#243B53]">
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 mb-3">
            <h3 className="text-xs font-bold text-[#095D7E] dark:text-slate-100 flex items-center gap-1.5 font-['Poppins',sans-serif]">
              <Activity className="w-3.5 h-3.5 text-[#14967F]" />
              {lang === 'en' ? 'Clinical Anthropometric Metrics' : 'ক্লিনিক্যাল পরিমাপ ও বিশ্লেষণ'}
            </h3>
            <span className="text-[10px] font-semibold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-2 py-0.5 rounded border border-[#14967F]/20">
              {lang === 'en' ? 'Verified' : 'যাচাইকৃত'}
            </span>
          </div>

          {/* Metrics List in Responsive 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 w-full">
            {/* Metric 1: Healthy BMI Range */}
            <div className="flex items-center justify-between p-2.5 rounded-md bg-[#F1F9FF] dark:bg-[#1E293B] border border-[#CCECEE] dark:border-[#243B53]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#14967F]" />
                <span className="text-xs font-semibold text-[#095D7E] dark:text-slate-200">
                  {lang === 'en' ? 'Healthy BMI Range' : 'স্বাভাবিক বিএমআই মাত্রা'}
                </span>
              </div>
              <span className="text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] bg-[#E2FCD6] dark:bg-[#064E3B] px-2.5 py-0.5 rounded border border-[#14967F]/20">
                18.5 - 24.9 kg/m²
              </span>
            </div>

            {/* Metric 2: Healthy Weight for Height */}
            <div className="flex items-center justify-between p-2.5 rounded-md bg-[#F1F9FF] dark:bg-[#1E293B] border border-[#CCECEE] dark:border-[#243B53]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#095D7E] dark:bg-[#2DD4BF]" />
                <span className="text-xs font-semibold text-[#095D7E] dark:text-slate-200">
                  {lang === 'en'
                    ? `Healthy Weight (Height ${result.currentHeightCm} cm)`
                    : `আদর্শ ওজন (উচ্চতা ${result.currentHeightCm} সেমি)`}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-xs font-bold text-[#095D7E] dark:text-slate-100">
                  {result.healthyWeightMin} - {result.healthyWeightMax} {lang === 'en' ? 'kg' : 'কেজি'}
                </span>
                <span className="block text-[10px] text-[#64748B] dark:text-slate-400">
                  ({minLbs} - {maxLbs} {lang === 'en' ? 'lbs' : 'পাউন্ড'})
                </span>
              </div>
            </div>

            {/* Metric 3: BMI Prime */}
            <div className="flex items-center justify-between p-2.5 rounded-md bg-[#F1F9FF] dark:bg-[#1E293B] border border-[#CCECEE] dark:border-[#243B53]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#095D7E] dark:bg-[#2DD4BF]" />
                <div>
                  <span className="text-xs font-semibold text-[#095D7E] dark:text-slate-200">
                    {lang === 'en' ? 'BMI Prime (Ratio to 25.0)' : 'বিএমআই প্রাইম (২৫.০ এর অনুপাত)'}
                  </span>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400">
                    {lang === 'en' ? 'Optimal clinical standard: 0.74 - 1.00' : 'আদর্শ মানদণ্ড: ০.৭৪ - ১.০০'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#095D7E] dark:text-slate-200 px-2 py-0.5 bg-white dark:bg-[#152232] rounded border border-[#CCECEE] dark:border-[#243B53]">
                {result.bmiPrime.toFixed(2)}
              </span>
            </div>

            {/* Metric 4: Ponderal Index */}
            <div className="flex items-center justify-between p-2.5 rounded-md bg-[#F1F9FF] dark:bg-[#1E293B] border border-[#CCECEE] dark:border-[#243B53]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#095D7E] dark:bg-[#2DD4BF]" />
                <div>
                  <span className="text-xs font-semibold text-[#095D7E] dark:text-slate-200">
                    {lang === 'en' ? 'Ponderal Index (Rohrer)' : 'পন্ডারাল ইনডেক্স (রোরার)'}
                  </span>
                  <p className="text-[10px] text-[#64748B] dark:text-slate-400">
                    {lang === 'en' ? 'Mass to cubic height (kg/m³)' : 'ঘন উচ্চতার অনুপাতে ভর (কেজি/মি³)'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#095D7E] dark:text-slate-200 px-2 py-0.5 bg-white dark:bg-[#152232] rounded border border-[#CCECEE] dark:border-[#243B53]">
                {result.ponderalIndex.toFixed(1)} kg/m³
              </span>
            </div>

            {/* Metric 5: Target Weight Change (Full width on 2-column grid) */}
            <div className="md:col-span-2 p-2.5 rounded-md bg-white dark:bg-[#1E293B] border border-[#CCECEE] dark:border-[#243B53] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#14967F]" />
                <span className="text-xs font-semibold text-[#095D7E] dark:text-slate-200">
                  {lang === 'en' ? 'Target Weight Change' : 'ওজন পরিবর্তনের লক্ষ্যমাত্রা'}
                </span>
              </div>
              {isHealthy ? (
                <span className="text-xs font-bold text-[#0D6F5D] dark:text-[#6EE7B7] bg-[#E2FCD6] dark:bg-[#064E3B] px-2.5 py-0.5 rounded border border-[#14967F]/20">
                  {lang === 'en' ? 'Optimal weight maintained ✓' : 'অনুকূল ওজন বজায় রয়েছে ✓'}
                </span>
              ) : result.weightDifferenceKg > 0 ? (
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                  {lang === 'en'
                    ? `Target loss: ${result.weightDifferenceKg} kg (${kgToLbs(result.weightDifferenceKg)} lbs)`
                    : `কমাতে হবে: ${result.weightDifferenceKg} কেজি (${kgToLbs(result.weightDifferenceKg)} পাউন্ড)`}
                </span>
              ) : (
                <span className="text-xs font-bold text-[#095D7E] dark:text-[#2DD4BF] bg-[#F1F9FF] dark:bg-[#1E293B] px-2 py-0.5 rounded border border-[#CCECEE] dark:border-[#243B53]">
                  {lang === 'en'
                    ? `Target gain: ${Math.abs(result.weightDifferenceKg)} kg (${kgToLbs(Math.abs(result.weightDifferenceKg))} lbs)`
                    : `বাড়াতে হবে: ${Math.abs(result.weightDifferenceKg)} কেজি (${kgToLbs(Math.abs(result.weightDifferenceKg))} পাউন্ড)`}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
