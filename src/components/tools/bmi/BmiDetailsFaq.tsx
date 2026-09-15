import React, { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { LanguageMode } from '../../../types';

interface BmiDetailsFaqProps {
  lang?: LanguageMode;
}

export const BmiDetailsFaq: React.FC<BmiDetailsFaqProps> = ({ lang = 'en' }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div id="bmi-details-section" className="w-full bg-white rounded-md border border-[#CCECEE] shadow-sm overflow-hidden">
      {/* Simple Dropdown Details Button */}
      <button
        id="btn-toggle-bmi-intro"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#F1F9FF] hover:bg-[#E5F3FD] transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#095D7E]" />
          <span className="text-sm font-semibold text-[#095D7E]">
            {lang === 'en' ? 'BMI Details & Clinical Information' : 'বিএমআই বিস্তারিত ক্লিনিক্যাল তথ্য ও নির্দেশিকা'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#095D7E] font-medium">
          <span>{isOpen ? (lang === 'en' ? 'Hide Details' : 'তথ্য লুকান') : (lang === 'en' ? 'Show Details' : 'বিস্তারিত দেখুন')}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Details Content */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-[#CCECEE] space-y-5 text-xs text-[#334155] leading-relaxed">
          {/* Overview */}
          <p className="bg-[#F1F9FF] p-3 rounded border border-[#CCECEE] text-[#095D7E] font-medium leading-relaxed">
            {lang === 'en'
              ? 'The Body Mass Index (BMI) Calculator can be used to calculate BMI value and corresponding weight status while taking age into consideration. Use the Metric Units (cm/kg) or USA Units (ft/lbs) to compute your body mass index, ideal healthy weight range, BMI Prime, and Ponderal Index according to World Health Organization (WHO) and CDC clinical standards.'
              : 'বডি ম্যাস ইনডেক্স (বিএমআই) ক্যালকুলেটরের মাধ্যমে বয়স, উচ্চতা ও ওজনের ভিত্তিতে বিএমআই মান এবং শরীরের ওজনের স্বাস্থ্যকর অবস্থা নির্ণয় করা যায়। আন্তর্জাতিক মেট্রিক পদ্ধতি (সেমি/কেজি) অথবা ইউএস ইম্পেরিয়াল পদ্ধতি (ফিট-ইঞ্চি/পাউন্ড) উভয় এককেই এটি কাজ করে। এটি স্বাভাবিক বিএমআই-এর পাশাপাশি পন্ডারাল ইনডেক্স ও বিএমআই প্রাইমও নিখুঁতভাবে গণনা করে।'}
          </p>

          {/* BMI introduction */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#095D7E]">
              {lang === 'en' ? 'BMI Introduction' : 'বিএমআই পরিচিতি'}
            </h3>
            <p>
              {lang === 'en'
                ? "BMI is a measurement of a person's leanness or corpulence based on their height and weight, and is intended to quantify tissue mass. It is widely used as a general indicator of whether a person has a healthy body weight for their height."
                : 'বিএমআই (BMI) বা বডি ম্যাস ইনডেক্স হলো মানুষের উচ্চতা ও ওজনের অনুপাতের একটি আন্তর্জাতিক ক্লিনিক্যাল পরিমাপ, যার মাধ্যমে দেহের টিস্যু বা চর্বির সামগ্রিক ঘনত্বের ধারণা পাওয়া যায়। এটি কোনো ব্যক্তির উচ্চতা অনুযায়ী তার শরীরের ওজন স্বাভাবিক বা স্বাস্থ্যসম্মত সীমার মধ্যে আছে কিনা তা সহজে জানার নির্ভরযোগ্য নির্দেশক।'}
            </p>
            <p>
              {lang === 'en'
                ? 'Specifically, the value obtained from the calculation of BMI is used to categorize whether a person is underweight, normal weight, overweight, or obese depending on what range the value falls between. These ranges of BMI vary based on factors such as region and age, and are sometimes further divided into subcategories such as severely underweight or very severely obese.'
                : 'বিএমআই গণনার প্রাপ্ত মানের ভিত্তিতে কোনো ব্যক্তিকে কম ওজনের (Underweight), স্বাভাবিক ওজনের (Normal), অতিরিক্ত ওজনের (Overweight) কিংবা স্থূল বা মেদবহুল (Obese) শ্রেণীতে বিভক্ত করা হয়। ভৌগোলিক অঞ্চল এবং বয়সের ভিত্তিতে বিএমআই এর এই স্তরগুলোর প্রভাব ভিন্ন হতে পারে।'}
            </p>
            <p>
              {lang === 'en'
                ? 'Being overweight or underweight can have significant health effects, so while BMI is an imperfect measure of healthy body weight, it is a useful indicator of whether any additional testing or action is required. Refer to the table below to see the different categories based on BMI that are used by the calculator.'
                : 'অতিরিক্ত বা অস্বাভাবিক কম ওজন উভয়েই স্বাস্থ্যের জন্য মারাত্মক ঝুঁকির কারণ হতে পারে। তাই স্বাস্থ্যঝুঁকি শনাক্তকরণ ও সঠিক জীবনযাপন পরিকল্পনা করতে বিএমআই অত্যন্ত জরুরি একটি প্রাথমিক পরীক্ষা।'}
            </p>
          </div>

          {/* BMI table for adults */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#095D7E]">
              {lang === 'en' ? 'BMI Table for Adults (WHO Standards)' : 'প্রাপ্তবয়স্কদের জন্য বিএমআই তালিকা (WHO মানদণ্ড)'}
            </h3>
            <p className="text-[#64748B]">
              {lang === 'en'
                ? "This is the World Health Organization's (WHO) recommended body weight based on BMI values for adults. It is used for both men and women, age 20 or older."
                : 'বিশ্ব স্বাস্থ্য সংস্থা (WHO) কর্তৃক অনুমোদিত প্রাপ্তবয়স্ক (২০ বছর বা তদূর্ধ্ব) পুরুষ ও নারীদের ক্ষেত্রে প্রযোজ্য মানদণ্ড।'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-[#CCECEE] rounded">
                <thead>
                  <tr className="bg-[#095D7E] text-white">
                    <th className="py-2 px-3 font-semibold">{lang === 'en' ? 'Classification' : 'শ্রেণীবিন্যাস'}</th>
                    <th className="py-2 px-3 font-semibold text-right">{lang === 'en' ? 'BMI range - kg/m²' : 'বিএমআই মাত্রা (কেজি/মি²)'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CCECEE]">
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Severe Thinness' : 'মারাত্মক ওজনহীনতা'}</td><td className="py-1.5 px-3 text-right font-mono">&lt; 16.0</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Moderate Thinness' : 'মাঝারি ওজনহীনতা'}</td><td className="py-1.5 px-3 text-right font-mono">16.0 - 16.9</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Mild Thinness' : 'সামান্য কম ওজন'}</td><td className="py-1.5 px-3 text-right font-mono">17.0 - 18.4</td></tr>
                  <tr className="bg-[#E2FCD6] font-semibold text-[#0D6F5D]"><td className="py-1.5 px-3">{lang === 'en' ? 'Normal / Healthy Weight' : 'স্বাভাবিক / স্বাস্থ্যকর ওজন'}</td><td className="py-1.5 px-3 text-right font-mono">18.5 - 24.9</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Overweight (Pre-obese)' : 'অতিরিক্ত ওজন (প্রি-অবিজ)'}</td><td className="py-1.5 px-3 text-right font-mono">25.0 - 29.9</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Obese Class I (Moderate)' : 'স্থূলতা ক্লাস ১ (মাঝারি)'}</td><td className="py-1.5 px-3 text-right font-mono">30.0 - 34.9</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Obese Class II (Severe)' : 'স্থূলতা ক্লাস ২ (গুরুতর)'}</td><td className="py-1.5 px-3 text-right font-mono">35.0 - 39.9</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Obese Class III (Very Severe)' : 'স্থূলতা ক্লাস ৩ (মারাত্মক)'}</td><td className="py-1.5 px-3 text-right font-mono">&ge; 40.0</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* BMI table for children and teens */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#095D7E]">
              {lang === 'en' ? 'BMI Table for Children & Teens, Age 2–20 (CDC Percentiles)' : 'শিশু ও কিশোরদের বিএমআই তালিকা, বয়স ২–২০ (CDC পার্সেন্টাইল)'}
            </h3>
            <p className="text-[#64748B]">
              {lang === 'en'
                ? 'The Centers for Disease Control and Prevention (CDC) recommends BMI categorization for children and teens using percentile curves.'
                : 'ইউএস সেন্টারস ফর ডিজিজ কন্ট্রোল অ্যান্ড প্রিভেনশন (CDC) শিশু ও কিশোর-কিশোরীদের ক্ষেত্রে বয়স ও লিঙ্গভিত্তিক পার্সেন্টাইল পরিমাপ নির্দেশ করে।'}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border border-[#CCECEE] rounded">
                <thead>
                  <tr className="bg-[#095D7E] text-white">
                    <th className="py-2 px-3 font-semibold">{lang === 'en' ? 'Category' : 'বিভাগ'}</th>
                    <th className="py-2 px-3 font-semibold text-right">{lang === 'en' ? 'Percentile Range' : 'পার্সেন্টাইল পরিসীমা'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CCECEE]">
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Underweight' : 'কম ওজন (Underweight)'}</td><td className="py-1.5 px-3 text-right font-mono">&lt; 5th percentile</td></tr>
                  <tr className="bg-[#E2FCD6] font-semibold text-[#0D6F5D]"><td className="py-1.5 px-3">{lang === 'en' ? 'Healthy weight' : 'স্বাস্থ্যকর ওজন (Healthy)'}</td><td className="py-1.5 px-3 text-right font-mono">5th - 85th percentile</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'At risk of overweight' : 'অতিরিক্ত ওজনের ঝুঁকি'}</td><td className="py-1.5 px-3 text-right font-mono">85th - 95th percentile</td></tr>
                  <tr><td className="py-1.5 px-3">{lang === 'en' ? 'Overweight / Obese' : 'অতিরিক্ত ওজন বা স্থূল'}</td><td className="py-1.5 px-3 text-right font-mono">&ge; 95th percentile</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Risks associated with being overweight */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#095D7E]">
              {lang === 'en' ? 'Risks Associated with Being Overweight' : 'অতিরিক্ত ওজনের স্বাস্থ্যঝুঁকি'}
            </h3>
            <p>
              {lang === 'en'
                ? 'Being overweight increases the risk of a number of serious diseases and health conditions, according to the CDC and WHO:'
                : 'অতিরিক্ত ওজনের কারণে মানবদেহে বহুবিধ দীর্ঘমেয়াদী জটিলতা ও মারাত্মক রোগের ঝুঁকি বহুগুণ বেড়ে যায়:'}
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[#475569]">
              <li>{lang === 'en' ? 'High blood pressure (Hypertension)' : 'উচ্চ রক্তচাপ (Hypertension)'}</li>
              <li>{lang === 'en' ? 'Elevated LDL cholesterol & triglycerides, lowered HDL' : 'রক্তে ক্ষতিকর এলডিএল (LDL) কোলেস্টেরল ও ট্রাইগ্লিসারাইড বৃদ্ধি'}</li>
              <li>{lang === 'en' ? 'Type 2 diabetes & insulin resistance' : 'টাইপ-২ ডায়াবেটিস ও ইনসুলিন রেজিস্ট্যান্স'}</li>
              <li>{lang === 'en' ? 'Coronary heart disease and myocardial infarction' : 'করোনারি হৃদরোগ ও হার্ট অ্যাটাকের ঝুঁকি'}</li>
              <li>{lang === 'en' ? 'Ischemic stroke' : 'মস্তিষ্কে রক্তক্ষরণ বা স্ট্রোক'}</li>
              <li>{lang === 'en' ? 'Gallbladder disease & gallstones' : 'পিত্তথলির রোগ ও পাথর সৃষ্টি'}</li>
              <li>{lang === 'en' ? 'Osteoarthritis (cartilage breakdown in knees and joints)' : 'অস্টিওআর্থ্রাইটিস বা হাঁটু ও সংযোগস্থলের ক্ষয়'}</li>
              <li>{lang === 'en' ? 'Obstructive sleep apnea & breathing difficulties' : 'স্লিপ অ্যাপনিয়া ও ঘুমে শ্বাসকষ্টজনিত সমস্যা'}</li>
              <li>{lang === 'en' ? 'Certain malignancies (colon, breast, endometrial, kidney, liver)' : 'ক্যান্সারের ঝুঁকি বৃদ্ধি (কোলন, স্তন, কিডনি ও লিভার)'}</li>
              <li>{lang === 'en' ? 'Clinical depression and impaired quality of life' : 'মানসিক অবসাদ, বিষণ্নতা ও শারীরিক কার্যক্ষমতা হ্রাস'}</li>
            </ul>
          </div>

          {/* Risks associated with being underweight */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#095D7E]">
              {lang === 'en' ? 'Risks Associated with Being Underweight' : 'স্বাভাবিকের চেয়ে কম ওজনের স্বাস্থ্যঝুঁকি'}
            </h3>
            <p>
              {lang === 'en'
                ? 'Being clinically underweight has notable associated health risks:'
                : 'স্বাভাবিকের তুলনায় অতিমাত্রায় কম ওজনও স্বাস্থ্যের জন্য মারাত্মক ঝুঁকিপূর্ণ হতে পারে:'}
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1 text-[#475569]">
              <li>{lang === 'en' ? 'Malnutrition, micronutrient deficiencies, and anemia' : 'অপুষ্টি, প্রয়োজনীয় ভিটামিনের ঘাটতি ও রক্তস্বল্পতা (Anemia)'}</li>
              <li>{lang === 'en' ? 'Osteoporosis and elevated fracture risk' : 'অস্টিওপোরোসিস বা হাড়ের ঘনত্ব হ্রাস ও ভঙ্গুরতা'}</li>
              <li>{lang === 'en' ? 'Suppressed immune function and infection susceptibility' : 'রোগ প্রতিরোধ ক্ষমতা হ্রাস ও ঘনঘন সংক্রমণ'}</li>
              <li>{lang === 'en' ? 'Growth and hormonal developmental delays in youth' : 'শিশু ও কিশোরদের স্বাভাবিক বৃদ্ধি ও বিকাশে বাধা'}</li>
              <li>{lang === 'en' ? 'Amenorrhea, cycle irregularities, and pregnancy complications' : 'হরমোনজনিত ভারসাম্যহীনতা ও নারীদের ক্ষেত্রে প্রজনন জটিলতা'}</li>
            </ul>
          </div>

          {/* Limitations of BMI */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#095D7E]">
              {lang === 'en' ? 'Clinical Limitations of BMI' : 'বিএমআই-এর ক্লিনিক্যাল সীমাবদ্ধতা'}
            </h3>
            <p>
              {lang === 'en'
                ? "Although BMI is a widely used screening parameter, it cannot directly measure body composition (muscle mass vs. adipose fat). In highly trained muscular athletes, BMI may overestimate body fat. Conversely, in older adults with sarcopenia (muscle loss), BMI may underestimate adiposity."
                : 'বিএমআই সামগ্রিক স্বাস্থ্যের একটি কার্যকর প্রাথমিক সূচক হলেও এর কিছু সীমাবদ্ধতা রয়েছে। এটি সরাসরি শরীরের পেশী (Muscle Mass) এবং চর্বির (Body Fat) অনুপাত পৃথক করতে পারে না। যেমন: অ্যাথলেট বা বডিবিল্ডারদের পেশীর আধিক্যের কারণে বিএমআই বেশি দেখালেও তারা সম্পূর্ণ সুস্থ থাকেন। আবার প্রবীণ ব্যক্তিদের ক্ষেত্রে পেশীর পরিমাণ কমে গেলেও বিএমআই স্বাভাবিক দেখাতে পারে।'}
            </p>
          </div>

          {/* BMI Formula */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-[#095D7E]">
              {lang === 'en' ? 'BMI Calculation Formulas' : 'বিএমআই হিসাব করার আন্তর্জাতিক সূত্র'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-[#F1F9FF] border border-[#CCECEE] rounded font-mono space-y-1">
                <span className="font-sans font-bold text-[#095D7E] block">
                  {lang === 'en' ? 'SI, Metric Units (Standard):' : 'আন্তর্জাতিক মেট্রিক পদ্ধতি (মানদণ্ড):'}
                </span>
                <div>BMI = mass (kg) / height² (m)</div>
                <div className="text-slate-500 font-sans text-[11px]">
                  {lang === 'en' ? 'Example: 70 kg / (1.75 m)² = 22.86 kg/m²' : 'উদাহরণ: ৭০ কেজি / (১.৭৫ মি)² = ২২.৮৬ কেজি/মি²'}
                </div>
              </div>
              <div className="p-3 bg-[#F1F9FF] border border-[#CCECEE] rounded font-mono space-y-1">
                <span className="font-sans font-bold text-[#095D7E] block">
                  {lang === 'en' ? 'USC Imperial Units:' : 'ইউএস ইম্পেরিয়াল পদ্ধতি:'}
                </span>
                <div>BMI = 703 &times; [ mass (lbs) / height² (in) ]</div>
                <div className="text-slate-500 font-sans text-[11px]">
                  {lang === 'en' ? 'Example: 703 &times; [154 / 69²] = 22.74 kg/m²' : 'উদাহরণ: ৭০৩ &times; [১৫৪ / ৬৯²] = ২২.৭৪ কেজি/মি²'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
