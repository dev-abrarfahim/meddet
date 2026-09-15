import { BmiCategoryInfo, BmiCategoryKey, BmiCalculationResult, Gender } from '../types/bmi';

export const BMI_CATEGORIES: Record<BmiCategoryKey, BmiCategoryInfo> = {
  underweight: {
    key: 'underweight',
    label: 'Underweight',
    labelBn: 'কম ওজন',
    shortLabel: 'Underweight',
    shortLabelBn: 'কম ওজন',
    rangeText: '< 18.5',
    minBmi: 0,
    maxBmi: 18.49,
    statusType: 'warning',
    description: 'Below the recommended clinical weight range for your height.',
    descriptionBn: 'আপনার উচ্চতার তুলনায় ওজন ক্লিনিক্যাল স্বাভাবিক মাত্রার চেয়ে কম।',
    dietAdvice: [
      'Focus on nutrient-dense, calorie-rich whole foods like nuts, avocados, and whole grains.',
      'Incorporate lean protein sources at every meal to build healthy muscle mass.',
      'Consider 5–6 smaller, balanced meals spread evenly throughout the day.'
    ],
    dietAdviceBn: [
      'পুষ্টিকর ও স্বাস্থ্যকর ক্যালরিযুক্ত খাবার যেমন বাদাম, ঘি, ডিম, দুধ ও আস্ত শস্যদানা খাদ্যতালিকায় রাখুন।',
      'প্রতিবেলার খাবারে পর্যাপ্ত মাছ, মাংস, ডাল বা পনিরের মতো প্রোটিন যুক্ত করুন যাতে স্বাস্থ্যকর পেশী গঠিত হয়।',
      'একবারে বেশি না খেয়ে সারাদিনে অল্প অল্প করে ৫–৬ বার পুষ্টিকর সুষম খাবার গ্রহণ করুন।'
    ],
    lifestyleAdvice: [
      'Emphasize progressive resistance training to promote muscular development rather than pure fat gain.',
      'Stay consistently hydrated with milk, smoothies, and 100% juices.'
    ],
    lifestyleAdviceBn: [
      'কেবলমাত্র চর্বি না বাড়িয়ে পেশী বৃদ্ধির জন্য নিয়মিত হালকা রেজিস্ট্যান্স বা শক্তি বাড়ানোর ব্যায়াম করুন।',
      'দুধ, পুষ্টিকর স্মুদি এবং তাজা ফলের জুস পান করে শরীরে পুষ্টি ও তরলের ভারসাম্য বজায় রাখুন।'
    ],
    medicalAdvice: 'Consult a medical provider or registered dietitian to evaluate underlying metabolic or nutritional factors.',
    medicalAdviceBn: 'কোনো অন্তর্নিহিত মেটাবলিক, থাইরয়েড বা হজমজনিত ঘাটতি আছে কি না তা যাচাই করতে একজন চিকিৎসকের পরামর্শ নিন।'
  },
  normal: {
    key: 'normal',
    label: 'Normal Weight',
    labelBn: 'স্বাভাবিক ওজন',
    shortLabel: 'Normal',
    shortLabelBn: 'স্বাভাবিক',
    rangeText: '18.5 - 24.9',
    minBmi: 18.5,
    maxBmi: 24.99,
    statusType: 'healthy',
    description: 'Optimal clinical weight range associated with lowest mortality and chronic disease risk.',
    descriptionBn: 'আদর্শ শারীরিক ওজন; যা দীর্ঘমেয়াদী রোগ ও কার্ডিওভাসকুলার স্বাস্থ্যঝুঁকি সবচেয়ে কম রাখে।',
    dietAdvice: [
      'Maintain a balanced dietary pattern emphasizing colorful vegetables, fruits, and lean proteins.',
      'Prioritize complex carbohydrates with high fiber and heart-healthy unsaturated fats.',
      'Keep added refined sugars and ultra-processed sodium snacks to a minimum.'
    ],
    dietAdviceBn: [
      'বিভিন্ন রঙের তাজা শাকসবজি, মৌসুমি ফলমূল ও পরিমিত প্রোটিন সমৃদ্ধ সুষম খাদ্যাভ্যাস বজায় রাখুন।',
      'উচ্চ আঁশযুক্ত জটিল শর্করা (লাল চাল, ওটস) এবং হৃদযন্ত্রের জন্য উপকারী অসম্পৃক্ত চর্বিকে প্রাধান্য দিন।',
      'অতিরিক্ত চিনি, মিষ্টি কোমল পানীয় এবং প্রক্রিয়াজাত লবণাক্ত স্ন্যাকস খাওয়া থেকে বিরত থাকুন।'
    ],
    lifestyleAdvice: [
      'Engage in at least 150 minutes of moderate aerobic exercise or 75 minutes of vigorous exercise weekly.',
      'Include two or more weekly muscle-strengthening resistance sessions.'
    ],
    lifestyleAdviceBn: [
      'সপ্তাহে অন্তত ১৫০ মিনিট মাঝারি ধরনের শরীরচর্চা অথবা ৭৫ মিনিট দ্রুত হাঁটা বা জগিংয়ের অভ্যাস বজায় রাখুন।',
      'শরীরের স্ট্যামিনা ও হাড়ের শক্তি বাড়াতে সপ্তাহে অন্তত দুই দিন পেশী মজবুত করার ব্যায়াম করুন।'
    ],
    medicalAdvice: 'Continue routine preventative health checkups and maintain active cardiovascular habits.',
    medicalAdviceBn: 'বর্তমান সুস্বাস্থ্য বজায় রাখতে নিয়মিত রুটিন স্বাস্থ্য পরীক্ষা করান এবং সক্রিয় জীবনযাপন করুন।'
  },
  overweight: {
    key: 'overweight',
    label: 'Overweight',
    labelBn: 'অতিরিক্ত ওজন',
    shortLabel: 'Overweight',
    shortLabelBn: 'অতিরিক্ত ওজন',
    rangeText: '25.0 - 29.9',
    minBmi: 25.0,
    maxBmi: 29.99,
    statusType: 'warning',
    description: 'Slightly above the ideal clinical range; may increase risk of hypertension and cardiovascular strain.',
    descriptionBn: 'আদর্শ ওজনের চেয়ে কিছুটা বেশি; এটি উচ্চ রক্তচাপ ও হৃদরোগের ঝুঁকি বৃদ্ধি করতে পারে।',
    dietAdvice: [
      'Adopt caloric awareness with moderate portion sizes and mindful plate composition.',
      'Swap refined grain carbohydrates for high-fiber legumes, quinoa, and vegetables.',
      'Limit sugary beverages and liquid calories, favoring water and unsweetened herbal teas.'
    ],
    dietAdviceBn: [
      'খাবারের পরিমাণের (Portion size) দিকে খেয়াল রাখুন এবং প্লেটে শর্করা কমিয়ে শাকসবজির পরিমাণ বাড়ান।',
      'পরিশোধিত সাদা চাল ও ময়দার বদলে ওটস, লাল চাল ও শাকসবজি জাতীয় উচ্চ আঁশযুক্ত খাবার বেছে নিন।',
      'কোমল পানীয়, মিষ্টি চা ও প্যাকেটজাত জুস এড়িয়ে প্রচুর পরিমাণে সাধারণ বিশুদ্ধ পানি পান করুন।'
    ],
    lifestyleAdvice: [
      'Aim for a daily step goal of 8,000–10,000 steps alongside structured physical activities.',
      'Prioritize 7–9 hours of quality sleep to stabilize hunger hormones (ghrelin and leptin).'
    ],
    lifestyleAdviceBn: [
      'প্রতিদিন অন্তত ৮,০০০ থেকে ১০,০০০ কদম হাঁটার লক্ষ্য নির্ধারণ করুন এবং নিয়মিত সক্রিয় থাকুন।',
      'ক্ষুধা নিয়ন্ত্রণকারী হরমোন স্বাভাবিক রাখতে প্রতিদিন রাতে ৭–৮ ঘণ্টা নিরবচ্ছিন্ন ঘুম নিশ্চিত করুন।'
    ],
    medicalAdvice: 'Discuss metabolic health, lipid panels, and blood glucose with your clinician.',
    medicalAdviceBn: 'রক্তের লিপিড প্রোফাইল, কোলেস্টেরল ও গ্লুকোজ লেভেল পরীক্ষা করে চিকিৎসকের পরামর্শ নিন।'
  },
  obese: {
    key: 'obese',
    label: 'Obesity (Class I & II)',
    labelBn: 'স্থূলতা (ক্লাস ১ ও ২)',
    shortLabel: 'Obese',
    shortLabelBn: 'স্থূল',
    rangeText: '30.0 - 34.9',
    minBmi: 30.0,
    maxBmi: 34.99,
    statusType: 'high-risk',
    description: 'Significantly elevated weight category with established clinical risks for type 2 diabetes and joint stress.',
    descriptionBn: 'উল্লেখযোগ্যভাবে বেশি ওজন; যা টাইপ-২ ডায়াবেটিস, উচ্চ রক্তচাপ ও হাড়ের জয়েন্টের সমস্যার বড় কারণ।',
    dietAdvice: [
      'Focus on an anti-inflammatory, whole-food dietary structure supervised by a clinical nutritionist.',
      'Establish consistent eating schedules to prevent insulin spikes and late-night cravings.',
      'Increase soluble fiber to promote prolonged satiety and lower cholesterol.'
    ],
    dietAdviceBn: [
      'একজন পুষ্টিবিদের তত্ত্বাবধানে অ্যান্টি-ইনফ্ল্যামেটরি ও পরিকল্পিত সুষম লো-ক্যালোরি খাদ্যাভ্যাস গড়ে তুলুন।',
      'দেরিতে রাতের খাবার খাওয়া বন্ধ করুন এবং রক্তে ইনসুলিনের ভারসাম্য বজায় রাখতে নির্দিষ্ট সময়ে আহার করুন।',
      'কোলেস্টেরল কমাতে ও দীর্ঘক্ষণ পেট ভরা রাখার অনুভূতি পেতে খাদ্যতালিকায় দ্রবণীয় আঁশযুক্ত খাবার বাড়ান।'
    ],
    lifestyleAdvice: [
      'Initiate low-impact cardiovascular workouts such as brisk walking, swimming, or stationary cycling.',
      'Gradually increase physical activity to protect weight-bearing joints.'
    ],
    lifestyleAdviceBn: [
      'হাঁটু বা জয়েন্টের ওপর অতিরিক্ত চাপ না ফেলে সাঁতার কাটা, দ্রুত হাঁটা বা সাইক্লিংয়ের মতো হালকা ব্যায়াম শুরু করুন।',
      'ধীরে ধীরে প্রতিদিনের সক্রিয় সময় বাড়িয়ে শরীরের অতিরিক্ত মেদ নিয়ন্ত্রণে আনুন।'
    ],
    medicalAdvice: 'A comprehensive medical evaluation including cardiovascular screening and thyroid review is strongly recommended.',
    medicalAdviceBn: 'হৃদযন্ত্রের সুস্থতা এবং থাইরয়েড ও হরমোনের অবস্থা মূল্যায়নের জন্য অবিলম্বে চিকিৎসকের শরণাপন্ন হওয়া প্রয়োজন।'
  },
  extremely_obese: {
    key: 'extremely_obese',
    label: 'Extreme Obesity (Class III)',
    labelBn: 'মারাত্মক স্থূলতা (ক্লাস ৩)',
    shortLabel: 'Extreme Obese',
    shortLabelBn: 'মারাত্মক স্থূল',
    rangeText: '≥ 35.0',
    minBmi: 35.0,
    maxBmi: 150.0,
    statusType: 'high-risk',
    description: 'High-risk clinical classification requiring personalized multidisciplinary medical supervision.',
    descriptionBn: 'উচ্চ ঝুঁকিপূর্ণ শারীরিক অবস্থা; যার জন্য জরুরি ভিত্তিতে চিকিৎসকের সার্বক্ষণিক পর্যবেক্ষণ ও সহায়তা প্রয়োজন।',
    dietAdvice: [
      'Follow a structured, medically supervised medical nutritional therapy plan.',
      'Monitor macronutrient distribution and micronutrient status closely with laboratory panels.'
    ],
    dietAdviceBn: [
      'ক্লিনিক্যাল নিউট্রিশনিস্টের সরাসরি নির্দেশনায় মেডিকেল নিউট্রিশন থেরাপি (MNT) গ্রহণ করুন।',
      'নিয়মিত ল্যাব টেস্টের মাধ্যমে প্রয়োজনীয় ভিটামিন ও পুষ্টি উপাদানের ভারসাম্য সার্বক্ষণিক পর্যবেক্ষণ করুন।'
    ],
    lifestyleAdvice: [
      'Partner with physical therapy or clinical exercise physiology for joint-safe movement protocols.',
      'Evaluate sleep apnea and respiratory patterns with a physician.'
    ],
    lifestyleAdviceBn: [
      'হাড় ও জয়েন্ট সম্পূর্ণ নিরাপদ রেখে অভিজ্ঞ ফিজিওথেরাপিস্টের পরামর্শ নিয়ে নির্ধারিত এক্সারসাইজ করুন।',
      'ঘুমের মধ্যে শ্বাসকষ্ট বা অবস্ট্রাকটিভ স্লিপ অ্যাপনিয়ার লক্ষণ থাকলে বিশেষজ্ঞ ডাক্তারের শরণাপন্ন হন।'
    ],
    medicalAdvice: 'Consult your primary physician or endocrinologist for targeted medical weight management strategies.',
    medicalAdviceBn: 'চিকিৎসক বা এন্ডোক্রিনোলজিস্টের সাথে পরামর্শ করে সমন্বিত ওজন নিয়ন্ত্রণ চিকিৎসা পরিকল্পনা নিন।'
  }
};

export const ORDERED_CATEGORIES: BmiCategoryKey[] = [
  'underweight',
  'normal',
  'overweight',
  'obese',
  'extremely_obese'
];

export function getBmiCategory(bmi: number): BmiCategoryInfo {
  if (bmi < 18.5) return BMI_CATEGORIES.underweight;
  if (bmi < 25.0) return BMI_CATEGORIES.normal;
  if (bmi < 30.0) return BMI_CATEGORIES.overweight;
  if (bmi < 35.0) return BMI_CATEGORIES.obese;
  return BMI_CATEGORIES.extremely_obese;
}

export function calculateBmi(
  weightKg: number,
  heightCm: number,
  age: number = 24,
  gender: Gender = 'male'
): BmiCalculationResult {
  const heightM = Math.max(heightCm / 100, 0.4);
  const safeWeightKg = Math.max(weightKg, 5);

  const rawBmi = safeWeightKg / (heightM * heightM);
  const bmi = Math.round(rawBmi * 10) / 10;
  const category = getBmiCategory(bmi);

  const healthyWeightMin = Math.round(18.5 * heightM * heightM * 10) / 10;
  const healthyWeightMax = Math.round(24.9 * heightM * heightM * 10) / 10;

  const bmiPrime = Math.round((bmi / 25.0) * 100) / 100;
  const ponderalIndex = Math.round((safeWeightKg / Math.pow(heightM, 3)) * 10) / 10;

  let weightDifferenceKg = 0;
  if (safeWeightKg < healthyWeightMin) {
    weightDifferenceKg = Math.round((safeWeightKg - healthyWeightMin) * 10) / 10; // negative, needs gain
  } else if (safeWeightKg > healthyWeightMax) {
    weightDifferenceKg = Math.round((safeWeightKg - healthyWeightMax) * 10) / 10; // positive, needs loss
  }

  return {
    bmi,
    category,
    healthyWeightMin,
    healthyWeightMax,
    bmiPrime,
    ponderalIndex,
    weightDifferenceKg,
    currentWeightKg: safeWeightKg,
    currentHeightCm: heightCm,
    age,
    gender
  };
}

// Unit conversion helpers
export function cmToFtInches(cm: number): { feet: number; inches: number } {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  if (inches === 12) {
    return { feet: feet + 1, inches: 0 };
  }
  return { feet, inches };
}

export function ftInchesToCm(feet: number, inches: number): number {
  const totalInches = feet * 12 + inches;
  return Math.round(totalInches * 2.54);
}

export function kgToLbs(kg: number): number {
  return Math.round(kg * 2.20462 * 10) / 10;
}

export function lbsToKg(lbs: number): number {
  return Math.round((lbs / 2.20462) * 10) / 10;
}
