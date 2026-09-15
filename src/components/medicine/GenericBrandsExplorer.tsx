import React, { useState, useMemo, useEffect } from 'react';
import { Building2, ChevronLeft, ArrowUpDown, Filter, Sparkles, RotateCcw, BookOpen, X, Pill, ExternalLink } from 'lucide-react';
import { getDosageFormIconInfo } from '../../utils/dosageFormHelper';
import { Medicine, LanguageMode, GenericCombination } from '../../types';
import { getAllBrandsForGeneric, getGenericById, getGenericCombinations, subscribeDatabase, isDatabaseReady } from '../../data/dbEngine';
import { getMedicineCanonicalPath, getGenericCanonicalPath } from '../../utils/urlHelper';

interface GenericBrandsExplorerProps {
  genericId: number;
  initialForm?: string;
  initialStrength?: string;
  onSelectMedicine: (med: Medicine) => void;
  onBack: () => void;
  onViewGenericDetails?: (genericId: number) => void;
  onSelectGeneric?: (generic: { id: number; name: string }) => void;
  lang: LanguageMode;
}

export const GenericBrandsExplorer: React.FC<GenericBrandsExplorerProps> = ({
  genericId,
  initialForm,
  initialStrength,
  onSelectMedicine,
  onBack,
  onViewGenericDetails,
  onSelectGeneric,
  lang
}) => {
  const [dbReady, setDbReady] = useState<boolean>(isDatabaseReady());
  const [dbVersion, setDbVersion] = useState<number>(0);

  useEffect(() => {
    return subscribeDatabase(() => {
      setDbReady(isDatabaseReady());
      setDbVersion((v) => v + 1);
    });
  }, []);

  const genericMonograph = useMemo(() => getGenericById(genericId), [genericId, dbVersion]);
  const allBrands = useMemo(() => getAllBrandsForGeneric(genericId), [genericId, dbVersion]);

  // Helper to normalize strings for robust comparison (strips whitespace and converts to lower case)
  const normalize = (s?: string) => (s || '').toLowerCase().replace(/\s+/g, '').trim();

  // Unique companies
  const companyOptions = useMemo(() => {
    const set = new Set<string>(allBrands.map((b) => b.company.trim()));
    return ['All', ...Array.from(set).sort((a: string, b: string) => a.localeCompare(b))];
  }, [allBrands]);

  // Unique dosage forms (deduplicated by normalized text, preserving title casing)
  const formOptions = useMemo(() => {
    const map = new Map<string, string>();
    allBrands.forEach((b) => {
      const raw = b.form.trim();
      const norm = normalize(raw);
      if (raw && !map.has(norm)) {
        map.set(norm, raw);
      }
    });
    return ['All', ...Array.from(map.values()).sort((a, b) => a.localeCompare(b))];
  }, [allBrands]);

  // Unique strengths (deduplicated by normalized text, e.g., '500mg' and '500 mg' unified into one option)
  const strengthOptions = useMemo(() => {
    const map = new Map<string, string>();
    allBrands.forEach((b) => {
      const raw = (b.strength || '').trim();
      const norm = normalize(raw);
      if (raw && !map.has(norm)) {
        map.set(norm, raw);
      }
    });
    return ['All', ...Array.from(map.values()).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))];
  }, [allBrands]);

  // Calculate default matching form (Strict exact match first to prevent "ER Tablet" from hijacking "Tablet")
  const defaultForm = useMemo(() => {
    if (!initialForm) return 'All';
    const target = initialForm.trim().toLowerCase();
    
    // 1. Exact match (case-insensitive)
    const exact = formOptions.find((f) => f.trim().toLowerCase() === target);
    if (exact) return exact;

    // 2. Word boundary or startsWith match
    const starts = formOptions.find((f) => {
      const fl = f.trim().toLowerCase();
      return fl.startsWith(target + ' ') || target.startsWith(fl + ' ');
    });
    if (starts) return starts;

    // 3. Fallback contains (only if no exact or word-boundary match exists)
    const contains = formOptions.find((f) => f.trim().toLowerCase().includes(target));
    return contains || 'All';
  }, [initialForm, formOptions]);

  // Calculate default matching strength:
  // If at least 2 brands share this strength in the selected form, filter by it.
  // If only 1 or 0 brands match, default to 'All' so the user is never stranded on an empty or single-item view!
  const defaultStrength = useMemo(() => {
    if (!initialStrength) return 'All';
    const targetNorm = normalize(initialStrength);

    const matchingFormBrands = defaultForm !== 'All'
      ? allBrands.filter((b) => normalize(b.form) === normalize(defaultForm))
      : allBrands;

    const sameStrengthCount = matchingFormBrands.filter(
      (b) => normalize(b.strength) === targetNorm
    ).length;

    if (sameStrengthCount >= 1) {
      const match = strengthOptions.find((s) => normalize(s) === targetNorm);
      if (match) return match;
    }

    return 'All';
  }, [initialStrength, strengthOptions, defaultForm, allBrands]);

  // Filter States initialized to intelligent matching dosage form & strength
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedStrength, setSelectedStrength] = useState<string>(defaultStrength);
  const [selectedForm, setSelectedForm] = useState<string>(defaultForm);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');

  // Sync filter state when generic context or initial props change
  useEffect(() => {
    setSelectedForm(defaultForm);
    setSelectedStrength(defaultStrength);
    setSelectedCompany('All');
  }, [defaultForm, defaultStrength]);

  const handleFormChange = (newForm: string) => {
    setSelectedForm(newForm);
    if (newForm !== 'All' && selectedStrength !== 'All') {
      const hasStrengthInNewForm = allBrands.some(
        (b) => normalize(b.form) === normalize(newForm) && normalize(b.strength) === normalize(selectedStrength)
      );
      if (!hasStrengthInNewForm) {
        setSelectedStrength('All');
      }
    }
  };

  // Filter & Sort Logic with robust normalized matching
  const filteredBrands = useMemo(() => {
    let result = [...allBrands];

    if (selectedCompany !== 'All') {
      result = result.filter((b) => b.company.trim() === selectedCompany);
    }
    if (selectedStrength !== 'All') {
      const normStrength = normalize(selectedStrength);
      result = result.filter((b) => normalize(b.strength) === normStrength);
    }
    if (selectedForm !== 'All') {
      const normForm = normalize(selectedForm);
      result = result.filter((b) => normalize(b.form) === normForm);
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      result.sort((a, b) => {
        const pA = a.mrp > 0 ? a.mrp : 9999;
        const pB = b.mrp > 0 ? b.mrp : 9999;
        return pA - pB;
      });
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [allBrands, selectedCompany, selectedStrength, selectedForm, sortBy]);

  const genericName = genericMonograph?.name || allBrands[0]?.genericName || 'Generic';
  const combinations = useMemo(() => getGenericCombinations(genericName), [genericName, dbVersion]);
  const [isCombinationsOpen, setIsCombinationsOpen] = useState<boolean>(false);
  const isDbLoading = !dbReady || (!isDatabaseReady() && allBrands.length === 0);

  // Helper icon for dosage forms
  const getFormIcon = (formStr: string) => {
    const { iconPath } = getDosageFormIconInfo(formStr);
    return <img src={iconPath} alt={formStr} className="w-3.5 h-3.5 object-contain shrink-0" loading="lazy" />;
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-16">
      
      {/* Top Back Header Bar */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-xs font-black text-[#14967F] dark:text-[#2DD4BF] hover:underline cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back to Details' : 'ফিরে যান'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
            Showing {filteredBrands.length} of {allBrands.length} Brands
          </span>
          
          {(selectedForm !== 'All' || selectedStrength !== 'All' || selectedCompany !== 'All') && (
            <button
              onClick={() => {
                setSelectedForm('All');
                setSelectedStrength('All');
                setSelectedCompany('All');
              }}
              className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Page Title Header (Strictly Matching User Reference Image) */}
      <div className="space-y-3 bg-white dark:bg-[#131B2E] p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs">
        <div className="border-l-4 border-[#095D7E] dark:border-[#2DD4BF] pl-3.5 space-y-0.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {genericName}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
            Available Brands {selectedForm !== 'All' ? `(${selectedForm})` : ''} {selectedStrength !== 'All' ? `• ${selectedStrength}` : ''}
          </p>
        </div>

        {/* Optional Pill Tagline */}
        <div className="pt-1 flex items-center gap-2 flex-wrap">
          {onViewGenericDetails && (
            <button
              onClick={() => onViewGenericDetails(genericId)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="View full prescribing indications, dose, side effects, precautions, and pharmacology"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{lang === 'en' ? 'Clinical Monograph & Info' : 'ক্লিনিক্যাল মোনোগ্রাফ ও তথ্য'}</span>
            </button>
          )}
          <button
            onClick={() => setIsCombinationsOpen(true)}
            id="explorer-other-combinations-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'en' ? 'Other Combinations of this Generic' : 'এই জেনেরিকের অন্যান্য কম্বিনেশন'}</span>
            {combinations.length > 0 && (
              <span className="bg-emerald-200 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 text-[10px] font-mono px-1.5 py-0.5 rounded-full">
                {combinations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filter and Sort Toolbar (Strictly Matching User Reference Image) */}
      <div className="bg-white dark:bg-[#131B2E] p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Left Side: Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-extrabold">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by:</span>
            </span>

            {/* Company Dropdown */}
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#14967F] max-w-[150px] truncate cursor-pointer"
            >
              <option value="All">Company (All)</option>
              {companyOptions.filter(c => c !== 'All').map((comp) => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>

            {/* Strength Dropdown */}
            <select
              value={selectedStrength}
              onChange={(e) => setSelectedStrength(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#14967F] max-w-[130px] truncate cursor-pointer"
            >
              <option value="All">Strength (All)</option>
              {strengthOptions.filter(s => s !== 'All').map((str) => (
                <option key={str} value={str}>{str}</option>
              ))}
            </select>

            {/* Dosage Form Dropdown */}
            <select
              value={selectedForm}
              onChange={(e) => handleFormChange(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#14967F] max-w-[140px] truncate cursor-pointer"
            >
              <option value="All">Dosage form (All)</option>
              {formOptions.filter(f => f !== 'All').map((form) => (
                <option key={form} value={form}>{form}</option>
              ))}
            </select>
          </div>

          {/* Right Side: Sort Toggle Buttons */}
          <div className="flex items-center gap-1.5 text-xs font-bold self-end md:self-auto">
            <span className="text-slate-500 dark:text-slate-400 font-extrabold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort By:</span>
            </span>

            <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800 p-0.5">
              <button
                onClick={() => setSortBy('name')}
                className={`px-2.5 py-1 text-xs font-black transition-colors rounded-lg cursor-pointer ${
                  sortBy === 'name'
                    ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-2.5 py-1 text-xs font-black transition-colors rounded-lg cursor-pointer ${
                  sortBy === 'price'
                    ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-2.5 py-1 text-xs font-black transition-colors rounded-lg cursor-pointer ${
                  sortBy === 'popularity'
                    ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Popularity
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Data Table View (Strictly Matching User Reference Image Layout) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs">
        
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#095D7E] dark:bg-[#14967F] text-white text-xs font-black uppercase tracking-wider">
                <th className="py-3 px-4">Brand Name</th>
                <th className="py-3 px-4">Dosage Form</th>
                <th className="py-3 px-4">Strength</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4 text-right">Pack Size & Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
              {filteredBrands.length === 0 ? (
                isDbLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse bg-white dark:bg-[#131B2E]">
                      <td className="py-3 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div></td>
                      <td className="py-3 px-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div></td>
                      <td className="py-3 px-4 text-right"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        {allBrands.length === 0
                          ? (lang === 'en' ? 'No brands registered for this generic substance in Bangladesh.' : 'বাংলাদেশে এই জেনেরিকের কোনো ব্র্যান্ড নিবন্ধিত পাওয়া যায়নি।')
                          : (lang === 'en'
                            ? 'No matching brands found for the selected filter combination.'
                            : 'নির্বাচিত ফিল্টারের সাথে কোনো ওষুধ খুঁজে পাওয়া যায়নি।')}
                      </p>
                      {allBrands.length > 0 && (
                        <button
                          onClick={() => {
                            setSelectedForm('All');
                            setSelectedStrength('All');
                            setSelectedCompany('All');
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white text-xs font-black shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{lang === 'en' ? `Show All ${allBrands.length} Brands` : `সবগুলো ${allBrands.length}টি ব্র্যান্ড দেখুন`}</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                )
              ) : (
                filteredBrands.map((brand, idx) => {
                  const brandHref = getMedicineCanonicalPath(brand);
                  return (
                    <tr
                      key={brand.id}
                      onClick={() => onSelectMedicine(brand)}
                      className={`hover:bg-emerald-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                        idx % 2 === 0 ? 'bg-white dark:bg-[#131B2E]' : 'bg-slate-50/50 dark:bg-slate-800/30'
                      }`}
                    >
                      {/* Brand Name with Crawlable Link */}
                      <td className="py-3 px-4 font-black text-slate-900 dark:text-slate-100 hover:text-[#14967F]">
                        <a
                          href={brandHref}
                          onClick={(e) => {
                            e.preventDefault();
                            onSelectMedicine(brand);
                          }}
                          className="hover:text-[#14967F] dark:hover:text-[#2DD4BF] block"
                        >
                          {brand.name}
                        </a>
                      </td>

                      {/* Dosage Form with Icon */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {getFormIcon(brand.form)}
                          <span>{brand.form}</span>
                        </div>
                      </td>

                      {/* Strength */}
                      <td className="py-3 px-4 font-mono font-black text-slate-700 dark:text-slate-300">
                        {brand.strength || '—'}
                      </td>

                      {/* Company */}
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <img src="/icons/pharmaceutical.webp" alt="Company" className="w-3.5 h-3.5 object-contain shrink-0" loading="lazy" />
                          <span className="truncate">{brand.company}</span>
                        </div>
                      </td>

                      {/* Pack Size & Price */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-black text-slate-900 dark:text-slate-100 font-mono">
                          Unit Price: ৳ {brand.mrp > 0 ? brand.mrp.toFixed(2) : 'N/A'}
                        </div>
                        {brand.packSize && (
                          <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 font-mono">
                            ({brand.packSize})
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Compact Card Rows */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredBrands.length === 0 ? (
            isDbLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3.5 space-y-2 animate-pulse bg-white dark:bg-[#131B2E]">
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-28"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-14"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
              ))
            ) : (
            <div className="py-10 px-4 text-center space-y-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {allBrands.length === 0
                  ? (lang === 'en' ? 'No brands registered for this generic substance in Bangladesh.' : 'বাংলাদেশে এই জেনেরিকের কোনো ব্র্যান্ড নিবন্ধিত পাওয়া যায়নি।')
                  : (lang === 'en'
                    ? 'No matching brands found for the selected filter combination.'
                    : 'নির্বাচিত ফিল্টারের সাথে কোনো ওষুধ খুঁজে পাওয়া যায়নি।')}
              </p>
              {allBrands.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedForm('All');
                    setSelectedStrength('All');
                    setSelectedCompany('All');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#095D7E] dark:bg-[#14967F] text-white text-xs font-black shadow-xs hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? `Show All ${allBrands.length} Brands` : `সবগুলো ${allBrands.length}টি ব্র্যান্ড দেখুন`}</span>
                </button>
              )}
            </div>
            )
          ) : (
            filteredBrands.map((brand) => {
              const brandHref = getMedicineCanonicalPath(brand);
              return (
                <a
                  key={brand.id}
                  href={brandHref}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectMedicine(brand);
                  }}
                  className="block p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 hover:text-[#14967F]">
                      {brand.name}
                    </h3>
                    <span className="text-xs font-black text-[#14967F] dark:text-[#2DD4BF] font-mono">
                      ৳ {brand.mrp > 0 ? brand.mrp.toFixed(2) : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold gap-2">
                    <div className="flex items-center gap-1">
                      {getFormIcon(brand.form)}
                      <span>{brand.form}</span>
                      {brand.strength && <span className="font-mono font-bold">• {brand.strength}</span>}
                    </div>
                    <span className="truncate max-w-[140px] text-right font-medium">{brand.company}</span>
                  </div>
                </a>
              );
            })
          )}
        </div>

      </div>

      {/* Other Combinations Modal */}
      {isCombinationsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#131B2E] rounded-3xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    {lang === 'en' ? 'Other Combinations' : 'আদার কম্বিনেশনস'}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? `Combination formulations containing ${genericName}` : `${genericName}-এর সমন্বিত ফর্মুলেশনসমূহ`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCombinationsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Combinations List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 space-y-1 pr-1">
              {combinations.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <Pill className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    {lang === 'en' ? 'No other combination formulations found' : 'অন্য কোনো কম্বিনেশন ফর্মুলেশন পাওয়া যায়নি'}
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {lang === 'en'
                      ? `${genericName} is primarily formulated as a single active ingredient in the Bangladesh market.`
                      : `${genericName} মূলত একক উপাদান হিসেবে বাংলাদেশের বাজারে প্রচলিত।`}
                  </p>
                </div>
              ) : (
                combinations.map((combo) => (
                  <a
                    key={combo.id}
                    href={`${getGenericCanonicalPath(combo)}?view=brands`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsCombinationsOpen(false);
                      if (onSelectGeneric) {
                        onSelectGeneric(combo);
                      } else {
                        window.location.href = `${getGenericCanonicalPath(combo)}?view=brands`;
                      }
                    }}
                    className="p-3 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/40 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer group block"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover:text-[#14967F] dark:group-hover:text-[#2DD4BF] transition-colors">
                        {combo.name}
                      </div>
                      {combo.nameBn && (
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {combo.nameBn}
                        </div>
                      )}
                      <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        {combo.brandCount} {combo.brandCount === 1 ? 'Brand available' : 'Brands available'}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1 text-xs font-black text-[#14967F] dark:text-[#2DD4BF]">
                      <span>{lang === 'en' ? 'Explore Brands' : 'ব্র্যান্ড দেখুন'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-right">
              <button
                onClick={() => setIsCombinationsOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              >
                {lang === 'en' ? 'Close' : 'বন্ধ করুন'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
