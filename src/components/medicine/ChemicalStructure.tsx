import React from 'react';
import { Atom, Clock } from 'lucide-react';

interface ChemicalStructureProps {
  genericName: string;
}

export const ChemicalStructure: React.FC<ChemicalStructureProps> = ({ genericName }) => {
  return (
    <section id="sec-structure" className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs space-y-3 transition-colors">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 dark:border-slate-800/60 pb-2">
        <div className="flex items-center gap-1.5">
          <Atom className="w-4 h-4 text-[#14967F]" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
            Chemical Structure
          </h2>
        </div>

        <span className="bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Coming soon</span>
        </span>
      </div>

      {/* 2D Skeletal Chemical Diagram Box (Strictly Matching Hand-Drawn Sketch Layout) */}
      <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-2 min-h-[180px]">
        
        {/* SVG Drawing of Esomeprazole / Chemical Ring Diagram */}
        <svg
          viewBox="0 0 450 180"
          className="w-full max-w-sm h-auto text-slate-800 dark:text-[#2DD4BF] stroke-current stroke-2 fill-none"
        >
          {/* Left Benzene Ring */}
          <polygon points="50,90 80,40 130,40 160,90 130,140 80,140" />
          <line x1="85" y1="50" x2="125" y2="50" strokeWidth="1.5" />
          <line x1="150" y1="90" x2="125" y2="130" strokeWidth="1.5" />
          <line x1="60" y1="90" x2="85" y2="130" strokeWidth="1.5" />

          {/* Imidazole Ring Junction */}
          <line x1="160" y1="90" x2="200" y2="60" />
          <text x="202" y="55" className="fill-current text-xs font-extrabold stroke-none">N</text>
          
          <line x1="160" y1="90" x2="200" y2="120" />
          <text x="202" y="130" className="fill-current text-xs font-extrabold stroke-none">N</text>

          <line x1="215" y1="60" x2="250" y2="90" />
          <line x1="215" y1="120" x2="250" y2="90" />

          {/* Sulfinyl Linker - S(=O) */}
          <line x1="250" y1="90" x2="280" y2="90" />
          <circle cx="280" cy="90" r="14" className="fill-white dark:fill-[#131B2E] stroke-2" />
          <text x="276" y="94" className="fill-current text-xs font-black stroke-none">S</text>
          <line x1="280" y1="76" x2="280" y2="60" />
          <circle cx="280" cy="54" r="8" className="fill-white dark:fill-[#131B2E] stroke-1" />
          <text x="276" y="58" className="fill-current text-[10px] font-bold stroke-none">O</text>

          {/* Pyridine Ring on Right */}
          <line x1="294" y1="90" x2="330" y2="90" />
          <polygon points="330,90 360,40 410,40 440,90 410,140 360,140" />
          <text x="382" y="32" className="fill-current text-xs font-extrabold stroke-none">N</text>
          
          {/* Methoxy Group - OCH3 */}
          <line x1="440" y1="90" x2="455" y2="90" />
          <text x="458" y="94" className="fill-current text-xs font-extrabold stroke-none">OCH3</text>
        </svg>

        <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
          2D Structure for {genericName}
        </div>
      </div>

      {/* Info Grid (Strictly Matching Hand-Drawn Sketch Layout) */}
      <div className="space-y-1 border-t border-slate-100 dark:border-slate-800/60 pt-2">
        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="font-extrabold text-slate-800 dark:text-slate-300">Molecular Formula</span>
          <span className="font-mono font-black text-[#14967F] dark:text-[#2DD4BF]">C19H19N3O3S</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="font-extrabold text-slate-800 dark:text-slate-300">Molecular Mass</span>
          <span className="font-mono font-black text-[#14967F] dark:text-[#2DD4BF]">345.42 g/mol</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="font-extrabold text-slate-800 dark:text-slate-300">CAS Registry NO</span>
          <span className="font-mono font-black text-[#14967F] dark:text-[#2DD4BF]">119141-88-7</span>
        </div>
      </div>

    </section>
  );
};
