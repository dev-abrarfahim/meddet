import { Medicine, GenericMonograph, CompanyInfo, DosageFormNote, FilterOptions, IndexStats } from '../types';
import { DOSAGE_FORM_CATEGORIES } from '../utils/dosageFormHelper';

const CONDITION_KEYWORDS_MAP: Record<string, string[]> = {
  ulcer: ['ulcer', 'gastric', 'gerd', 'reflux', 'peptic', 'omeprazole', 'esomeprazole', 'pantoprazole', 'rabeprazole', 'antacid', 'alginate', 'acid', 'আলসার', 'গ্যাস্ট্রিক', 'বুকজ্বালা'],
  pain: ['pain', 'fever', 'paracetamol', 'analgesic', 'headache', 'nsaid', 'ibuprofen', 'naproxen', 'ketorolac', 'diclofenac', 'aceclofenac', 'tramadol', 'ব্যথা', 'জ্বর', 'মাথাব্যথা'],
  infection: ['infection', 'antibiotic', 'bacterial', 'antimicrobial', 'antiviral', 'antifungal', 'cefixime', 'azithromycin', 'ciprofloxacin', 'amoxicillin', 'clavulanic', 'সংক্রমণ', 'অ্যান্টিবায়োটিক'],
  hypertension: ['hypertension', 'blood pressure', 'cardiovascular', 'heart', 'amlodipine', 'losartan', 'bisoprolol', 'atenolol', 'telmisartan', 'valsartan', 'রক্তচাপ', 'হৃদরোগ', 'হাইপারটেনশন'],
  asthma: ['asthma', 'respiratory', 'bronchial', 'bronchodilator', 'salbutamol', 'montelukast', 'budesonide', 'fluticasone', 'ipratropium', 'শ্বাসকষ্ট', 'অ্যাজমা', 'হাঁপানি']
};

let BRANDS: Medicine[] = [];
let GENERICS: GenericMonograph[] = [];
let COMPANIES: CompanyInfo[] = [];
let DOSAGE_NOTES: Record<string, DosageFormNote> = {};

const genericsMap = new Map<number, GenericMonograph>();
const companiesMap = new Map<number, CompanyInfo>();
const genericToBrandsMap = new Map<number, Medicine[]>();
let uniqueDosageForms: string[] = [];

let isLoaded = false;
let isLoading = false;
let loadPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

export function isDatabaseReady(): boolean {
  return isLoaded;
}

export function subscribeDatabase(listener: () => void): () => void {
  listeners.add(listener);
  if (isLoaded) {
    listener();
  }
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

const TOP_50_PATTERNS = [
  /square\s*pharma/i,
  /incepta\s*pharma/i,
  /beximco\s*pharma/i,
  /healthcare\s*pharma/i,
  /renata/i,
  /eskayef/i,
  /opsonin/i,
  /aristopharma/i,
  /popular\s*pharma/i,
  /^acme\s*laboratories/i,
  /^aci\s*(limited|healthcare|pharma)/i,
  /radiant\s*pharma/i,
  /drug\s*international/i,
  /unimed\s*unihealth/i,
  /beacon\s*pharma/i,
  /novo\s*nordisk/i,
  /nipro\s*jmi/i,
  /ziska/i,
  /ibn\s*sina/i,
  /navana/i,
  /synovia/i,
  /nuvista/i,
  /novartis/i,
  /roche/i,
  /general\s*pharma/i,
  /sun\s*pharmaceutical/i,
  /^orion\s*pharma/i,
  /eli\s*lilly/i,
  /servier/i,
  /sandoz/i,
  /everest\s*pharma/i,
  /labaid/i,
  /delta\s*pharma/i,
  /osl\s*pharma|organic\s*health/i,
  /^biopharma/i,
  /pacific\s*pharma/i,
  /mundipharma\s*\(bangladesh\)|mundipharma/i,
  /dbl\s*pharma/i,
  /jenphar/i,
  /pharmasia/i,
  /pharmacil/i,
  /orion\s*infusion/i,
  /abbott|duphar|solvay/i,
  /jayson/i,
  /globe\s*pharma/i,
  /one\s*pharma/i,
  /team\s*pharma/i,
  /goodman/i,
  /white\s*horse/i,
  /sharif\s*pharma/i
];

function processRankedCompanies(rawCompanies: CompanyInfo[]): CompanyInfo[] {
  const ranked: CompanyInfo[] = [];
  const used = new Set<number>();

  TOP_50_PATTERNS.forEach((pat, idx) => {
    const matches = rawCompanies.filter(c => !used.has(c.id) && pat.test(c.name));
    matches.sort((a, b) => b.brandCount - a.brandCount);
    const bestMatch = matches[0];
    if (bestMatch) {
      used.add(bestMatch.id);
      ranked.push({ ...bestMatch, rank: idx + 1 });
    }
  });

  const remaining = rawCompanies
    .filter(c => !used.has(c.id))
    .sort((a, b) => b.brandCount - a.brandCount);

  return [...ranked, ...remaining.map((c, i) => ({ ...c, rank: ranked.length + i + 1 }))];
}

async function fetchCachedJson<T>(url: string): Promise<T> {
  if (typeof window !== 'undefined' && 'caches' in window) {
    try {
      const cache = await caches.open('meddet-data-v1');
      const cachedResponse = await cache.match(url);
      if (cachedResponse) {
        return (await cachedResponse.json()) as T;
      }
      const networkResponse = await fetch(url);
      if (networkResponse.ok) {
        cache.put(url, networkResponse.clone()).catch(() => {});
        return (await networkResponse.json()) as T;
      }
    } catch {
      // fallback to direct fetch below
    }
  }
  return fetch(url).then((res) => {
    if (!res.ok) throw new Error(`HTTP error ${res.status} fetching ${url}`);
    return res.json();
  });
}

export async function loadDatabase(): Promise<void> {
  if (isLoaded) return;
  if (loadPromise) return loadPromise;

  isLoading = true;

  loadPromise = (async () => {
    try {
      const basePath = (import.meta as any).env?.BASE_URL || '/';
      const cleanBase = basePath.endsWith('/') ? basePath : basePath + '/';
      
      // Tier 1: Fast initial load (Brands, Companies, Notes) for immediate UI rendering & search
      const [brandsRes, companiesRes, notesRes] = await Promise.all([
        fetchCachedJson<Medicine[]>(`${cleanBase}data/brands.json`),
        fetchCachedJson<CompanyInfo[]>(`${cleanBase}data/companies.json`),
        fetchCachedJson<Record<string, DosageFormNote>>(`${cleanBase}data/dosageNotes.json`)
      ]);

      BRANDS = brandsRes;
      COMPANIES = processRankedCompanies(companiesRes);
      DOSAGE_NOTES = notesRes;

      companiesMap.clear();
      COMPANIES.forEach((c) => companiesMap.set(c.id, c));

      genericToBrandsMap.clear();
      BRANDS.forEach((b) => {
        const existing = genericToBrandsMap.get(b.genericId) || [];
        existing.push(b);
        genericToBrandsMap.set(b.genericId, existing);
      });

      uniqueDosageForms = Array.from(
        new Set(BRANDS.map((b) => b.form).filter(Boolean))
      ).sort();

      isLoaded = true;
      isLoading = false;
      notifyListeners();

      // Tier 2: Deferred load for large full monographs in background (prevents blocking LCP)
      fetchCachedJson<GenericMonograph[]>(`${cleanBase}data/generics.json`)
        .then((genericsRes) => {
          GENERICS = genericsRes;
          genericsMap.clear();
          GENERICS.forEach((g) => genericsMap.set(g.id, g));
          notifyListeners();
        })
        .catch(() => {
          // Background monograph fetch silently retries on next user interaction
        });

    } catch (err) {
      isLoading = false;
      loadPromise = null;
    }
  })();

  return loadPromise;
}

// Auto-start loading database on module evaluation
if (typeof window !== 'undefined') {
  loadDatabase();
}

// 4. Get Full Medicine details (including Monograph & Dosage Note)
export function getMedicineById(id: number): Medicine | null {
  const brand = BRANDS.find((b) => b.id === id);
  if (!brand) return null;

  const monograph = genericsMap.get(brand.genericId);
  const noteKey = brand.form.trim().toLowerCase();
  const dosageNote = DOSAGE_NOTES[noteKey];

  return {
    ...brand,
    monograph,
    dosageNote
  };
}

// 5. Get Alternative Brands for a Generic ID (Strictly matched by Dosage Form)
export function getAlternativeBrands(genericId: number, currentBrandId?: number, dosageForm?: string): Medicine[] {
  const alternatives = genericToBrandsMap.get(genericId) || [];
  let filtered = alternatives.filter((b) => b.id !== currentBrandId);

  if (dosageForm && dosageForm.trim() !== '') {
    const targetForm = dosageForm.trim().toLowerCase();
    const sameFormMatches = filtered.filter((b) => {
      const bForm = b.form.trim().toLowerCase();
      return bForm === targetForm || bForm.includes(targetForm) || targetForm.includes(bForm);
    });

    if (sameFormMatches.length > 0) {
      filtered = sameFormMatches;
    }
  }

  return filtered;
}

// 5b. Get ALL Brands for a Generic ID (for Alternative Brands Page view)
export function getAllBrandsForGeneric(genericId: number): Medicine[] {
  return genericToBrandsMap.get(genericId) || [];
}

// 5c. Get Generic Monograph by ID
export function getGenericById(genericId: number): GenericMonograph | undefined {
  return genericsMap.get(genericId);
}

// 6. Database Statistics
export function getDatabaseStats(): IndexStats {
  return {
    totalBrands: BRANDS.length,
    totalGenerics: GENERICS.length,
    totalCompanies: COMPANIES.length
  };
}

// 7. Get Companies List
export function getAllCompanies(): CompanyInfo[] {
  return COMPANIES;
}

// 8. Get Unique Dosage Forms List
export function getAllDosageForms(): string[] {
  return uniqueDosageForms;
}

// 9. Main High-Performance Search & Filter Engine
export function searchMedicines(
  query: string,
  letter: string = 'All',
  filters: Partial<FilterOptions> = {},
  page: number = 1,
  pageSize: number = 48
): { items: Medicine[]; total: number; totalPages: number; page: number } {
  const cleanQuery = query.trim().toLowerCase();
  const cleanLetter = letter.trim().toUpperCase();

  let results = BRANDS;

  // A. Alphabet Filter (Brand name starting letter)
  if (cleanLetter !== 'ALL' && cleanLetter !== '') {
    if (cleanLetter === '#') {
      results = results.filter((b) => !/^[A-Z]/i.test(b.name));
    } else {
      results = results.filter((b) => b.name.toUpperCase().startsWith(cleanLetter));
    }
  }

  // B. Text Search (Brand, Generic EN & BN, Company, Indication)
  if (cleanQuery) {
    results = results.filter((b) => {
      // 1. Brand name match
      if (b.name.toLowerCase().includes(cleanQuery)) return true;
      // 2. Generic name match (English & Bangla)
      if (b.genericName.toLowerCase().includes(cleanQuery)) return true;
      if (b.genericNameBn && b.genericNameBn.includes(cleanQuery)) return true;
      // 3. Company name match
      if (b.company.toLowerCase().includes(cleanQuery)) return true;
      // 4. Strength or Form match
      if (b.strength.toLowerCase().includes(cleanQuery)) return true;
      if (b.form.toLowerCase().includes(cleanQuery)) return true;

      // 5. Indication match from Generic Monograph
      const mono = genericsMap.get(b.genericId);
      if (mono) {
        if (mono.indication.toLowerCase().includes(cleanQuery)) return true;
        if (mono.indicationBn && mono.indicationBn.includes(cleanQuery)) return true;
      }

      return false;
    });
  }

  // C. Medical Condition / Category Filter
  if (filters.category && filters.category !== 'All') {
    const catKey = filters.category.toLowerCase().trim();
    const keywords = CONDITION_KEYWORDS_MAP[catKey] || [catKey];
    results = results.filter((b) => {
      const mono = genericsMap.get(b.genericId);
      const targetText = [
        b.name,
        b.genericName,
        b.genericNameBn || '',
        mono?.indication || '',
        mono?.indicationBn || '',
        mono?.dose || '',
        mono?.sideEffect || ''
      ].join(' ').toLowerCase();

      return keywords.some((k) => targetText.includes(k.toLowerCase()));
    });
  }

  // D. Manufacturer / Company Filter
  if (filters.manufacturer && filters.manufacturer !== 'All') {
    const mfrTarget = filters.manufacturer.toLowerCase().trim();
    const mfrSlug = mfrTarget.replace(/[^\p{L}\p{N}\s-]+/gu, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    results = results.filter((b) => {
      const compLower = b.company.toLowerCase();
      if (compLower === mfrTarget) return true;
      const bSlug = compLower.replace(/[^\p{L}\p{N}\s-]+/gu, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      return bSlug === mfrSlug;
    });
  }

  // E. Dosage Form Filter
  if (filters.dosageForm && filters.dosageForm !== 'All') {
    const target = filters.dosageForm.toLowerCase().trim();

    // 1. Try matching with standard DOSAGE_FORM_CATEGORIES
    const category = DOSAGE_FORM_CATEGORIES.find(
      (c) =>
        c.id.toLowerCase() === target ||
        c.name.toLowerCase() === target ||
        c.nameBn.toLowerCase() === target ||
        target.includes(c.id.toLowerCase())
    );

    if (category) {
      results = results.filter((b) => {
        const formLower = b.form.toLowerCase();
        return category.formsMatch.some((k) => formLower.includes(k.toLowerCase()));
      });
    } else {
      // 2. Direct match on form string
      results = results.filter((b) => {
        const formLower = b.form.toLowerCase();
        return formLower === target || formLower.includes(target) || target.includes(formLower);
      });
    }
  }

  // E. Max Price Filter
  if (filters.maxPrice && filters.maxPrice > 0) {
    results = results.filter((b) => b.mrp <= filters.maxPrice!);
  }

  // F. Sorting
  const sortBy = filters.sortBy || 'relevance';
  if (sortBy === 'price-low') {
    results = [...results].sort((a, b) => a.mrp - b.mrp);
  } else if (sortBy === 'price-high') {
    results = [...results].sort((a, b) => b.mrp - a.mrp);
  } else if (sortBy === 'name-asc') {
    results = [...results].sort((a, b) => a.name.localeCompare(b.name));
  } else if (cleanQuery && sortBy === 'relevance') {
    // Relevance sorting: exact/prefix match on brand name comes first
    results = [...results].sort((a, b) => {
      const aLower = a.name.toLowerCase();
      const bLower = b.name.toLowerCase();
      const aStart = aLower.startsWith(cleanQuery);
      const bStart = bLower.startsWith(cleanQuery);
      if (aStart && !bStart) return -1;
      if (!aStart && bStart) return 1;
      return 0;
    });
  }

  // G. Pagination
  const total = results.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * pageSize;
  const paginatedItems = results.slice(startIndex, startIndex + pageSize);

  // Attach monograph & dosage note to returned page items
  const items = paginatedItems.map((b) => ({
    ...b,
    monograph: genericsMap.get(b.genericId),
    dosageNote: DOSAGE_NOTES[b.form.trim().toLowerCase()]
  }));

  return {
    items,
    total,
    totalPages,
    page: validPage
  };
}
