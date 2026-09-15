export type Gender = 'male' | 'female';
export type UnitSystem = 'metric' | 'imperial';

export type BmiCategoryKey =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese'
  | 'extremely_obese';

export interface BmiCategoryInfo {
  key: BmiCategoryKey;
  label: string;
  labelBn: string;
  shortLabel: string;
  shortLabelBn: string;
  rangeText: string;
  minBmi: number;
  maxBmi: number;
  statusType: 'healthy' | 'warning' | 'high-risk';
  description: string;
  descriptionBn: string;
  dietAdvice: string[];
  dietAdviceBn: string[];
  lifestyleAdvice: string[];
  lifestyleAdviceBn: string[];
  medicalAdvice: string;
  medicalAdviceBn: string;
}

export interface BmiCalculationResult {
  bmi: number;
  category: BmiCategoryInfo;
  healthyWeightMin: number; // in kg
  healthyWeightMax: number; // in kg
  bmiPrime: number;
  ponderalIndex: number; // in kg/m3
  weightDifferenceKg: number; // 0 if healthy, positive if needs to lose, negative if needs to gain
  currentWeightKg: number;
  currentHeightCm: number;
  age: number;
  gender: Gender;
}
