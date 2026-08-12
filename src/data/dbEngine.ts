import { Medicine, GenericMonograph, CompanyInfo, DosageFormNote, FilterOptions, IndexStats } from '../types';

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

export async function loadDatabase(): Promise<void> {
  if (isLoaded) return;
  if (loadPromise) return loadPromise;

  isLoading = true;

  loadPromise = (async () => {
    try {
      const basePath = (import.meta as any).env?.BASE_URL || '/';
      const cleanBase = basePath.endsWith('/') ? basePath : basePath + '/';
      
      const [brandsRes, genericsRes, companiesRes, notesRes] = await Promise.all([
        fetch(`${cleanBase}data/brands.json`).then((res) => res.json()),
        fetch(`${cleanBase}data/generics.json`).then((res) => res.json()),
        fetch(`${cleanBase}data/companies.json`).then((res) => res.json()),
        fetch(`${cleanBase}data/dosageNotes.json`).then((res) => res.json())
      ]);

      BRANDS = brandsRes as Medicine[];
      GENERICS = genericsRes as GenericMonograph[];
      COMPANIES = companiesRes as CompanyInfo[];
      DOSAGE_NOTES = notesRes as Record<string, DosageFormNote>;

      // Populate O(1) Maps
      genericsMap.clear();
      GENERICS.forEach((g) => genericsMap.set(g.id, g));

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
    } catch (err) {
      console.error('Failed to load database JSON files:', err);
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

  // C. Manufacturer / Company Filter
  if (filters.manufacturer && filters.manufacturer !== 'All') {
    results = results.filter((b) => b.company.toLowerCase() === filters.manufacturer!.toLowerCase());
  }

  // D. Dosage Form Filter
  if (filters.dosageForm && filters.dosageForm !== 'All') {
    results = results.filter((b) => b.form.toLowerCase() === filters.dosageForm!.toLowerCase());
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
