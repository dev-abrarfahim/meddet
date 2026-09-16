import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { LanguageMode } from '../../../types';

interface BmiDetailsFaqProps {
  lang?: LanguageMode;
}

interface AccordionItem {
  key: string;
  titleEn: string;
  titleBn: string;
  renderContent: () => React.ReactNode;
}

export const BmiDetailsFaq: React.FC<BmiDetailsFaqProps> = ({ lang = 'en' }) => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    intro: false,
    adultTable: false,
    childTable: false,
    overweightRisks: false,
    underweightRisks: false,
    limitations: false,
    formulas: false
  });

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const items: AccordionItem[] = [
    {
      key: 'intro',
      titleEn: 'BMI Introduction & Clinical Overview',
      titleBn: 'বিএমআই পরিচিতি ও ক্লিনিক্যাল তথ্য',
      renderContent: () => (
        <div className="space-y-2">
          <p>
            {lang === 'en'
              ? "Body Mass Index (BMI) is an international anthropometric screening metric based on height and weight to quantify body tissue mass (adipose fat vs lean mass). It serves as a clinical screening tool to evaluate whether an individual's weight falls within a healthy physiological range."
              : 'বডি ম্যাস ইনডেক্স (বিএমআই) হলো মানুষের উচ্চতা ও ওজনের অনুপাতের একটি আন্তর্জাতিক পরিমাপক, যার মাধ্যমে দেহের টিস্যু বা চর্বির সামগ্রিক ঘনত্বের ধারণা পাওয়া যায়। এটি কোনো ব্যক্তির শরীরের ওজন স্বাস্থ্যসম্মত সীমার মধ্যে আছে কিনা তা সহজে জানার নির্ভরযোগ্য সূচক।'}
          </p>
          <p>
            {lang === 'en'
              ? 'BMI categories differentiate individuals into underweight, normal healthy weight, overweight, and obese ranges. Maintaining a balanced BMI significantly reduces long-term metabolic and cardiovascular health risks.'
              : 'বিএমআই গণনার ভিত্তিতে মানুষকে কম ওজন, স্বাভাবিক ওজন, অতিরিক্ত ওজন কিংবা মেদবহুল শ্রেণীতে বিভক্ত করা হয়। সঠিক বিএমআই বজায় রাখা দীর্ঘমেয়াদী হৃদরোগ ও ডায়াবেটিসের ঝুঁকি উল্লেখযোগ্যভাবে হ্রাস করে।'}
          </p>
        </div>
      )
    },
    {
      key: 'adultTable',
      titleEn: 'BMI Table for Adults (WHO Standards)',
      titleBn: 'প্রাপ্তবয়স্কদের জন্য বিএমআই তালিকা (WHO মানদণ্ড)',
      renderContent: () => (
        <div className="space-y-2.5">
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            {lang === 'en'
              ? 'World Health Organization (WHO) international classification for adults aged 20 and older:'
              : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) কর্তৃক প্রাপ্তবয়স্ক (২০ বছর বা তদূর্ধ্ব) পুরুষ ও নারীদের ক্ষেত্রে নির্ধারিত আন্তর্জাতিক মানদণ্ড:'}
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/80">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#095D7E] text-white">
                  <th className="py-2 px-3 font-semibold">{lang === 'en' ? 'Classification' : 'শ্রেণীবিন্যাস'}</th>
                  <th className="py-2 px-3 font-semibold text-right">{lang === 'en' ? 'BMI range (kg/m²)' : 'বিএমআই মাত্রা (কেজি/মি²)'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#152232]">
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Severe Thinness' : 'মারাত্মক ওজনহীনতা'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">&lt; 16.0</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Moderate Thinness' : 'মাঝারি ওজনহীনতা'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">16.0 - 16.9</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Mild Thinness' : 'সামান্য কম ওজন'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">17.0 - 18.4</td></tr>
                <tr className="bg-[#E2FCD6] dark:bg-[#064E3B] font-bold text-[#0D6F5D] dark:text-[#6EE7B7]"><td className="py-1.5 px-3">{lang === 'en' ? 'Normal / Healthy Weight' : 'স্বাভাবিক / স্বাস্থ্যকর ওজন'}</td><td className="py-1.5 px-3 text-right font-mono">18.5 - 24.9</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Overweight (Pre-obese)' : 'অতিরিক্ত ওজন (প্রি-অবিজ)'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">25.0 - 29.9</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Obese Class I (Moderate)' : 'স্থূলতা ক্লাস ১ (মাঝারি)'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">30.0 - 34.9</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Obese Class II (Severe)' : 'স্থূলতা ক্লাস ২ (গুরুতর)'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">35.0 - 39.9</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Obese Class III (Very Severe)' : 'স্থূলতা ক্লাস ৩ (মারাত্মক)'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">&ge; 40.0</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      key: 'childTable',
      titleEn: 'BMI for Children & Teens (CDC Percentiles)',
      titleBn: 'শিশু ও কিশোরদের বিএমআই (CDC পার্সেন্টাইল)',
      renderContent: () => (
        <div className="space-y-2.5">
          <p className="text-slate-500 dark:text-slate-400 text-[11px]">
            {lang === 'en'
              ? 'CDC clinical pediatric percentile benchmarks for age group 2–20:'
              : 'ইউএস সিডিসি (CDC) বয়স ও লিঙ্গভিত্তিক শিশু ও কিশোরদের পার্সেন্টাইল নির্দেশিকা (বয়স ২–২০ বছর):'}
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700/80">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#095D7E] text-white">
                  <th className="py-2 px-3 font-semibold">{lang === 'en' ? 'Category' : 'বিভাগ'}</th>
                  <th className="py-2 px-3 font-semibold text-right">{lang === 'en' ? 'Percentile Range' : 'পার্সেন্টাইল পরিসীমা'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#152232]">
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Underweight' : 'কম ওজন (Underweight)'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">&lt; 5th percentile</td></tr>
                <tr className="bg-[#E2FCD6] dark:bg-[#064E3B] font-bold text-[#0D6F5D] dark:text-[#6EE7B7]"><td className="py-1.5 px-3">{lang === 'en' ? 'Healthy weight' : 'স্বাস্থ্যকর ওজন (Healthy)'}</td><td className="py-1.5 px-3 text-right font-mono">5th - 85th percentile</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'At risk of overweight' : 'অতিরিক্ত ওজনের ঝুঁকি'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">85th - 95th percentile</td></tr>
                <tr><td className="py-1.5 px-3 text-slate-700 dark:text-slate-300">{lang === 'en' ? 'Overweight / Obese' : 'অতিরিক্ত ওজন বা স্থূল'}</td><td className="py-1.5 px-3 text-right font-mono text-slate-900 dark:text-slate-100">&ge; 95th percentile</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      key: 'overweightRisks',
      titleEn: 'Risks of Being Overweight',
      titleBn: 'অতিরিক্ত ওজনের স্বাস্থ্যঝুঁকি',
      renderContent: () => (
        <div className="space-y-2">
          <p className="text-slate-600 dark:text-slate-300">
            {lang === 'en'
              ? 'Excess adiposity significantly increases the incidence of chronic metabolic and vascular disorders:'
              : 'অতিরিক্ত মেদ ও স্থূলতার কারণে মানবদেহে বহুবিধ দীর্ঘমেয়াদী জটিলতা ও মারাত্মক রোগের ঝুঁকি বাড়ে:'}
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
            <li>{lang === 'en' ? 'High blood pressure (Hypertension)' : 'উচ্চ রক্তচাপ (Hypertension)'}</li>
            <li>{lang === 'en' ? 'Elevated LDL cholesterol & triglycerides, low HDL' : 'রক্তে ক্ষতিকর এলডিএল (LDL) কোলেস্টেরল ও ট্রাইগ্লিসারাইড বৃদ্ধি'}</li>
            <li>{lang === 'en' ? 'Type 2 diabetes & severe insulin resistance' : 'টাইপ-২ ডায়াবেটিস ও ইনসুলিন রেজিস্ট্যান্স'}</li>
            <li>{lang === 'en' ? 'Coronary heart disease, angina, and heart attack' : 'করোনারি হৃদরোগ ও হার্ট অ্যাটাকের ঝুঁকি'}</li>
            <li>{lang === 'en' ? 'Ischemic stroke and cerebrovascular accidents' : 'মস্তিষ্কে রক্তক্ষরণ বা স্ট্রোক'}</li>
            <li>{lang === 'en' ? 'Gallbladder diseases & gallstones' : 'পিত্তথলির রোগ ও পাথর সৃষ্টি'}</li>
            <li>{lang === 'en' ? 'Osteoarthritis (cartilage breakdown in knees and joints)' : 'অস্টিওআর্থ্রাইটিস বা হাঁটু ও সংযোগস্থলের ক্ষয়'}</li>
            <li>{lang === 'en' ? 'Obstructive sleep apnea & breathing difficulties' : 'স্লিপ অ্যাপনিয়া ও ঘুমে শ্বাসকষ্টজনিত সমস্যা'}</li>
          </ul>
        </div>
      )
    },
    {
      key: 'underweightRisks',
      titleEn: 'Risks of Being Underweight',
      titleBn: 'কম ওজনের স্বাস্থ্যঝুঁকি',
      renderContent: () => (
        <div className="space-y-2">
          <p className="text-slate-600 dark:text-slate-300">
            {lang === 'en'
              ? 'Being clinically underweight carries serious physiological risks:'
              : 'স্বাভাবিকের তুলনায় অতিমাত্রায় কম ওজনও স্বাস্থ্যের জন্য মারাত্মক ঝুঁকিপূর্ণ হতে পারে:'}
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 pl-1">
            <li>{lang === 'en' ? 'Malnutrition, vitamin deficiencies, and microcytic anemia' : 'অপুষ্টি, প্রয়োজনীয় ভিটামিনের ঘাটতি ও রক্তস্বল্পতা (Anemia)'}</li>
            <li>{lang === 'en' ? 'Osteoporosis, decreased bone mineral density, and fractures' : 'অস্টিওপোরোসিস বা হাড়ের ঘনত্ব হ্রাস ও ভঙ্গুরতা'}</li>
            <li>{lang === 'en' ? 'Impaired immune response and vulnerability to infections' : 'রোগ প্রতিরোধ ক্ষমতা হ্রাস ও ঘনঘন সংক্রমণ'}</li>
            <li>{lang === 'en' ? 'Delayed growth and hormonal development in adolescents' : 'শিশু ও কিশোরদের স্বাভাবিক বৃদ্ধি ও বিকাশে বাধা'}</li>
            <li>{lang === 'en' ? 'Amenorrhea, reproductive disorders, and pregnancy complications' : 'হরমোনজনিত ভারসাম্যহীনতা ও প্রজনন জটিলতা'}</li>
          </ul>
        </div>
      )
    },
    {
      key: 'limitations',
      titleEn: 'Clinical Limitations of BMI',
      titleBn: 'বিএমআই-এর ক্লিনিক্যাল সীমাবদ্ধতা',
      renderContent: () => (
        <p className="text-slate-600 dark:text-slate-300">
          {lang === 'en'
            ? 'While BMI is an effective population-level screening metric, it cannot distinguish between lean muscle mass and adipose fat tissue. Athletes with high muscle mass may be classified as overweight despite low body fat, while elderly patients experiencing sarcopenia (muscle loss) may test as normal weight despite elevated visceral adiposity.'
            : 'বিএমআই সামগ্রিক স্বাস্থ্যের একটি কার্যকর প্রাথমিক নির্দেশক হলেও এর কিছু সীমাবদ্ধতা রয়েছে। এটি সরাসরি শরীরের পেশী (Muscle Mass) এবং চর্বির (Body Fat) অনুপাত পৃথক করতে পারে না। যেমন: অ্যাথলেট বা বডিবিল্ডারদের পেশীর আধিক্যের কারণে বিএমআই বেশি দেখালেও তারা সুস্থ থাকেন। আবার বয়োবৃদ্ধদের ক্ষেত্রে পেশী কমে গেলেও বিএমআই স্বাভাবিক দেখাতে পারে।'}
        </p>
      )
    },
    {
      key: 'formulas',
      titleEn: 'BMI Calculation Formulas',
      titleBn: 'বিএমআই পরিমাপের সূত্র',
      renderContent: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="p-3 bg-white dark:bg-[#152232] rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF] block text-[11px]">
              {lang === 'en' ? 'Metric (SI) Units (Standard)' : 'আন্তর্জাতিক মেট্রিক পদ্ধতি (মানদণ্ড)'}
            </span>
            <div className="font-mono text-slate-900 dark:text-slate-100">BMI = weight (kg) / height² (m)</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'en' ? 'e.g. 70 kg / (1.75 m)² = 22.86 kg/m²' : 'উদাহরণ: ৭০ কেজি / (১.৭৫ মি)² = ২২.৮৬ কেজি/মি²'}
            </div>
          </div>
          <div className="p-3 bg-white dark:bg-[#152232] rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
            <span className="font-bold text-[#095D7E] dark:text-[#2DD4BF] block text-[11px]">
              {lang === 'en' ? 'USC Imperial Units' : 'ইউএস ইম্পেরিয়াল পদ্ধতি'}
            </span>
            <div className="font-mono text-slate-900 dark:text-slate-100">BMI = 703 × [weight (lbs) / height² (in)]</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'en' ? 'e.g. 703 × [154 / 69²] = 22.74 kg/m²' : 'উদাহরণ: ৭০৩ × [১৫৪ / ৬৯²] = ২২.৭৪ কেজি/মি²'}
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-1.5">
      {items.map((item) => {
        const isOpen = Boolean(openItems[item.key]);
        return (
          <div
            key={item.key}
            className="bg-white dark:bg-[#131B2E] rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs transition-colors"
          >
            <button
              type="button"
              onClick={() => toggleItem(item.key)}
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

              <div className="w-6 h-6 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                {isOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#14967F] dark:text-[#2DD4BF]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {isOpen && (
              <div className="py-2.5 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-800/40">
                {item.renderContent()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
