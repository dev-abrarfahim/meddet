import React, { useState, useMemo } from 'react';
import { Pill, Syringe, Building2, ChevronLeft, ArrowUpDown, Filter, Sparkles } from 'lucide-react';
import { Medicine, LanguageMode } from '../../types';
import { getAllBrandsForGeneric, getGenericById } from '../../data/dbEngine';

interface GenericBrandsExplorerProps {
  genericId: number;
  initialForm?: string;
  initialStrength?: string;
  onSelectMedicine: (med: Medicine) => void;
  onBack: () => void;
  lang: LanguageMode;
}

export const GenericBrandsExplorer: React.FC<GenericBrandsExplorerProps> = ({
  genericId,
  initialForm,
  initialStrength,
  onSelectMedicine,
  onBack,
  lang
}) => {
  const genericMonograph = getGenericById(genericId);
  const allBrands = useMemo(() => getAllBrandsForGeneric(genericId), [genericId]);

  // Unique options for filter dropdowns
  const companyOptions = useMemo(() => {
    const set = new Set(allBrands.map((b) => b.company.trim()));
    return ['All', ...Array.from(set).sort()];
  }, [allBrands]);

  const strengthOptions = useMemo(() => {
    const set = new Set(allBrands.map((b) => (b.strength || 'N/A').trim()));
    return ['All', ...Array.from(set).sort()];
  }, [allBrands]);

  const formOptions = useMemo(() => {
    const set = new Set(allBrands.map((b) => b.form.trim()));
    return ['All', ...Array.from(set).sort()];
  }, [allBrands]);

  // Calculate default matching form and strength
  const defaultForm = useMemo(() => {
    if (!initialForm) return 'All';
    const target = initialForm.trim().toLowerCase();
    const match = formOptions.find(
      (f) => f.trim().toLowerCase() === target || f.trim().toLowerCase().includes(target) || target.includes(f.trim().toLowerCase())
    );
    return match || 'All';
  }, [initialForm, formOptions]);

  const defaultStrength = useMemo(() => {
    if (!initialStrength) return 'All';
    const target = initialStrength.trim().toLowerCase();
    const match = strengthOptions.find((s) => s.trim().toLowerCase() === target);
    return match || 'All';
  }, [initialStrength, strengthOptions]);

  // Filter States initialized to exact matching dosage form & strength
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedStrength, setSelectedStrength] = useState<string>(defaultStrength);
  const [selectedForm, setSelectedForm] = useState<string>(defaultForm);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');

  // Filter & Sort Logic
  const filteredBrands = useMemo(() => {
    let result = [...allBrands];

    if (selectedCompany !== 'All') {
      result = result.filter((b) => b.company.trim() === selectedCompany);
    }
    if (selectedStrength !== 'All') {
      result = result.filter((b) => (b.strength || 'N/A').trim() === selectedStrength);
    }
    if (selectedForm !== 'All') {
      result = result.filter((b) => b.form.trim() === selectedForm);
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'price') {
      result.sort((a, b) => {
        const pA = a.mrp > 0 ? a.mrp : 999;
        const pB = b.mrp > 0 ? b.mrp : 999;
        return pA - pB;
      });
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [allBrands, selectedCompany, selectedStrength, selectedForm, sortBy]);

  const genericName = genericMonograph?.name || allBrands[0]?.genericName || 'Generic';

  // Helper icon for dosage forms
  const getFormIcon = (formStr: string) => {
    const lower = formStr.toLowerCase();
    if (lower.includes('inj') || lower.includes('vial') || lower.includes('ampoule')) {
      return <Syringe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    }
    return <Pill className="w-3.5 h-3.5 text-[#14967F] dark:text-[#2DD4BF] shrink-0" />;
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
        <div className="pt-1">
          <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Other Combinations of this Generic</span>
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
              onChange={(e) => setSelectedForm(e.target.value)}
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
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Name
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-2.5 py-1 text-xs font-black transition-colors rounded-lg cursor-pointer ${
                  sortBy === 'price'
                    ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Price
              </button>
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-2.5 py-1 text-xs font-black transition-colors rounded-lg cursor-pointer ${
                  sortBy === 'popularity'
                    ? 'bg-[#095D7E] dark:bg-[#14967F] text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900'
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
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No matching brands found for the selected filter combination.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand, idx) => (
                  <tr
                    key={brand.id}
                    onClick={() => onSelectMedicine(brand)}
                    className={`hover:bg-emerald-50/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      idx % 2 === 0 ? 'bg-white dark:bg-[#131B2E]' : 'bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    {/* Brand Name */}
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-slate-100 hover:text-[#14967F]">
                      {brand.name}
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
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Compact Card Rows */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filteredBrands.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching brands found for the selected filter.
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => onSelectMedicine(brand)}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer space-y-1.5"
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
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
