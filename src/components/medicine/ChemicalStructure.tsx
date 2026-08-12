import React from 'react';
import { Atom, Clock, Sparkles, ShieldAlert } from 'lucide-react';

interface ChemicalStructureProps {
  genericName: string;
}

export const ChemicalStructure: React.FC<ChemicalStructureProps> = ({ genericName }) => {
  return (
    <section id="sec-structure" className="bg-white dark:bg-[#152232] rounded-3xl border border-[#CCECEE] dark:border-[#243B53] p-6 sm:p-8 shadow-sm space-y-6 transition-colors">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap border-b border-[#F1F9FF] dark:border-[#243B53] pb-4">
        <div>
          <h2 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100 flex items-center gap-2">
            <Atom className="w-5 h-5 text-[#14967F]" />
            <span>Chemical Structure & Molecular Specifications</span>
          </h2>
          <p className="text-xs text-[#095D7E]/70 dark:text-slate-400 mt-0.5">
            2D/3D Molecular formula, IUPAC name, and CAS Chemical Registration
          </p>
        </div>

        <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-800 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Feature Coming Soon</span>
        </span>
      </div>

      {/* Feature Coming Soon Card */}
      <div className="bg-gradient-to-br from-[#F1F9FF] to-[#E2FCD6]/30 dark:from-[#1A2B3E] dark:to-[#0B1927] p-6 sm:p-8 rounded-2xl border-2 border-dashed border-[#14967F]/40 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#14967F] text-white flex items-center justify-center mx-auto shadow-md">
          <Sparkles className="w-7 h-7 text-[#E2FCD6]" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-black text-[#095D7E] dark:text-slate-100">
            Chemical Data for {genericName}
          </h3>
          <p className="text-xs text-[#095D7E]/80 dark:text-slate-300 leading-relaxed">
            Detailed 2D/3D molecular graphics, IUPAC nomenclature, molecular mass, and CAS registry identifiers for <span className="font-bold text-[#14967F] dark:text-[#2DD4BF]">{genericName}</span> are currently in development.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 bg-white dark:bg-[#152232] px-4 py-2 rounded-xl border border-[#CCECEE] dark:border-[#243B53] text-xs font-extrabold text-[#14967F] dark:text-[#2DD4BF] shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>This Feature is Coming Soon in the Next Database Update</span>
        </div>
      </div>

    </section>
  );
};
