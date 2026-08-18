export type LanguageMode = 'en' | 'bn';

export interface CompanyInfo {
  id: number;
  name: string;
  brandCount: number;
  rank?: number;
}

export interface DosageFormNote {
  form: string;
  note: string;
  noteBn: string;
}

export interface GenericMonograph {
  id: number;
  name: string;
  nameBn: string;
  indication: string;
  indicationBn: string;
  dose: string;
  doseBn: string;
  sideEffect: string;
  sideEffectBn: string;
  contraIndication: string;
  contraIndicationBn: string;
  precaution: string;
  precautionBn: string;
  pregnancyCategory: string;
  pregnancyCategoryBn: string;
  overdose: string;
  overdoseBn: string;
}

export interface Medicine {
  id: number;
  name: string;
  companyId: number;
  company: string;
  genericId: number;
  genericName: string;
  genericNameBn: string;
  form: string;
  strength: string;
  packSize: string;
  mrp: number; // Main Focus Price (Maximum Retail Price in ৳ BDT)
  sellingPrice: number; // Calculated 10% Discount Store Price
  discountPercentage: number; // 10%
  monograph?: GenericMonograph;
  dosageNote?: DosageFormNote;
}

export interface FilterOptions {
  category: string; // Indication/Category filter
  dosageForm: string;
  manufacturer: string;
  maxPrice: number;
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'name-asc';
}

export interface IndexStats {
  totalBrands: number;
  totalGenerics: number;
  totalCompanies: number;
}
