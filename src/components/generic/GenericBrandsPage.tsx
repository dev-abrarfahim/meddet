import React, { useState, useMemo } from 'react';
import { ArrowLeft, Pill, Building2, FlaskConical, SlidersHorizontal } from 'lucide-react';
import { Medicine } from '../../types';
import { getBrandsForGeneric } from '../../data/dbEngine';

interface GenericBrandsPageProps {
  genericId: number;
  genericName: string;
  onSelectMedicine: (med: Medicine) => void;
  onBack: () => void;
}

export const GenericBrandsPage: React.FC<GenericBrandsPageProps> = ({
  genericId,
  genericName,
  onSelectMedicine,
  onBack
}) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [selectedStrength, setSelectedStrength] = useState<string>('All');
  const [selectedForm, setSelectedForm] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');
  const [showOtherCombinations, setShowOtherCombinations] = useState<boolean>(false);

  // Fetch all brands for this generic
  const allBrands = useMemo(() => {
    return getBrandsForGeneric(genericId);
  }, [genericId]);

  // Extract unique filter dropdown values
  const companies = useMemo(() => {
    const set = new Set(allBrands.map((b) => b.company).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [allBrands]);

  const strengths = useMemo(() => {
    const set = new Set(allBrands.map((b) => b.strength).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [allBrands]);

  const dosageForms = useMemo(() => {
    const set = new Set(allBrands.map((b) => b.form).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [allBrands]);

  // Filter & sort brands
  const filteredBrands = useMemo(() => {
    let result = allBrands.filter((b) => {
      if (selectedCompany !== 'All' && b.company !== selectedCompany) return false;
      if (selectedStrength !== 'All' && b.strength !== selectedStrength) return false;
      if (selectedForm !== 'All' && b.form !== selectedForm) return false;
      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'price') {
        const pA = a.mrp > 0 ? a.mrp : 9999;
        const pB = b.mrp > 0 ? b.mrp : 9999;
        return pA - pB;
      }
      if (sortBy === 'popularity') {
        return a.id - b.id;
      }
      return 0;
    });
  }, [allBrands, selectedCompany, selectedStrength, selectedForm, sortBy]);

  return (
    <div className="space-y-4 animate-in fade-in duration-300 pb-16">
      
      {/* Top Back Navigation Bar */}
      <button
        onClick={onBack}
        id="generic-brands-back-btn"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 text-xs font-black text-slate-800 dark:text-slate-200 hover:border-[#14967F] transition-all cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-4 h-4 text-[#14967F]" />
        <span>Back to Product Details</span>
      </button>

      {/* 1. Header Section (Exact Match with Reference Image Layout) */}
      <div className="bg-white dark:bg-[#131B2E] p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          {/* Accent Left Bar */}
          <div className="w-1.5 h-10 bg-[#14967F] dark:bg-[#2DD4BF] rounded-full shrink-0 mt-1" />
          
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none font-sans">
              {genericName}
            </h1>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Available Brands ({filteredBrands.length} Brands Found)
            </p>
          </div>
        </div>

        {/* Pill Button: Other Combinations of this Generic */}
        <div>
          <button
            onClick={() => setShowOtherCombinations(!showOtherCombinations)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-xs font-black text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-all cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Other Combinations of this Generic</span>
          </button>
        </div>

        {showOtherCombinations && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            Showing all single active ingredient brand formulations for <strong>{genericName}</strong>. Combination drugs are indexed separately in the search database.
          </div>
        )}
      </div>

      {/* 2. Filter & Sort Control Bar (Exact Match with Reference Image) */}
      <div className="bg-white dark:bg-[#131B2E] p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Filter Dropdowns Group */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-1 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#14967F]" />
            <span>Filter by:</span>
          </div>

          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-[#14967F] max-w-[150px]"
          >
            <option value="All">Company (All)</option>
            {companies.filter(c => c !== 'All').map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Strength Filter */}
          <select
            value={selectedStrength}
            onChange={(e) => setSelectedStrength(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-[#14967F] max-w-[130px]"
          >
            <option value="All">Strength (All)</option>
            {strengths.filter(s => s !== 'All').map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Dosage Form Filter */}
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:border-[#14967F] max-w-[140px]"
          >
            <option value="All">Dosage form (All)</option>
            {dosageForms.filter(f => f !== 'All').map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {/* Sort By Pills */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
          <span className="text-slate-500 font-semibold">Sort By:</span>
          
          <button
            onClick={() => setSortBy('name')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
              sortBy === 'name'
                ? 'bg-[#14967F] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Name
          </button>

          <button
            onClick={() => setSortBy('price')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
              sortBy === 'price'
                ? 'bg-[#14967F] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Price
          </button>

          <button
            onClick={() => setSortBy('popularity')}
            className={`px-3 py-1 rounded-lg text-xs font-black transition-all ${
              sortBy === 'popularity'
                ? 'bg-[#14967F] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Popularity
          </button>
        </div>

      </div>

      {/* 3. Brands Data Table (Desktop / Tablet) */}
      <div className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-xs">
        
        {/* Responsive Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14967F] text-white font-black text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Brand Name</th>
                <th className="py-3 px-4">Dosage Form</th>
                <th className="py-3 px-4">Strength</th>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4 text-right">Pack Size & Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold text-slate-800 dark:text-slate-200">
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No matching brand medicines found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredBrands.map((brand, idx) => (
                  <tr
                    key={brand.id}
                    onClick={() => onSelectMedicine(brand)}
                    className={`hover:bg-emerald-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      idx % 2 === 0 ? 'bg-white dark:bg-[#131B2E]' : 'bg-slate-50/50 dark:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 px-4 font-black text-slate-900 dark:text-slate-100 hover:text-[#14967F]">
                      {brand.name}
                    </td>
                    <td className="py-3 px-4 flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Pill className="w-3.5 h-3.5 text-[#14967F] shrink-0" />
                      <span>{brand.form}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {brand.strength || 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-[#14967F] shrink-0" />
                        <span className="truncate max-w-[200px]">{brand.company}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                      <div>
                        Unit Price: ৳ {brand.mrp > 0 ? brand.mrp.toFixed(2) : 'N/A'}
                      </div>
                      {brand.packSize && (
                        <div className="text-[10px] font-normal text-slate-400 font-sans">
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

        {/* Responsive Mobile Cards View (< sm) */}
        <div className="sm:hidden divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredBrands.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No matching brands found.
            </div>
          ) : (
            filteredBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => onSelectMedicine(brand)}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 hover:text-[#14967F]">
                      {brand.name}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#14967F] dark:text-[#2DD4BF] flex items-center gap-1 mt-0.5">
                      <Pill className="w-3 h-3" />
                      <span>{brand.form} • {brand.strength}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-black font-mono text-slate-900 dark:text-slate-100">
                      ৳ {brand.mrp > 0 ? brand.mrp.toFixed(2) : 'N/A'}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400">Unit Price</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate pt-0.5 border-t border-slate-100 dark:border-slate-800/60">
                  <Building2 className="w-3 h-3 text-[#14967F] shrink-0" />
                  <span className="truncate">{brand.company}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
