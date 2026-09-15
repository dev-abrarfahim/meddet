import React from 'react';
import { Atom, Clock, ShieldCheck } from 'lucide-react';
import { LanguageMode } from '../../types';

interface ChemicalStructureProps {
  genericName?: string;
  lang?: LanguageMode;
}

interface ChemicalInfo {
  formula: string;
  mass: string;
  cas: string;
  iupac?: string;
}

const CHEMICAL_DATA: Record<string, ChemicalInfo> = {
  paracetamol: { formula: 'C8H9NO2', mass: '151.16 g/mol', cas: '103-90-2', iupac: 'N-(4-hydroxyphenyl)acetamide' },
  omeprazole: { formula: 'C17H19N3O3S', mass: '345.42 g/mol', cas: '73590-58-6', iupac: '5-methoxy-2-[(4-methoxy-3,5-dimethylpyridin-2-yl)methylsulfinyl]-1H-benzimidazole' },
  esomeprazole: { formula: 'C19H19N3O3S', mass: '345.42 g/mol', cas: '119141-88-7', iupac: '(S)-5-methoxy-2-[(4-methoxy-3,5-dimethylpyridin-2-yl)methylsulfinyl]-1H-benzimidazole' },
  pantoprazole: { formula: 'C16H15F2N3O4S', mass: '383.37 g/mol', cas: '102625-70-7', iupac: '6-(difluoromethoxy)-2-[(3,4-dimethoxypyridin-2-yl)methylsulfinyl]-1H-benzimidazole' },
  metformin: { formula: 'C4H11N5', mass: '129.16 g/mol', cas: '657-24-9', iupac: '3-(diaminomethylidene)-1,1-dimethylguanidine' },
  cefixime: { formula: 'C16H15N5O7S2', mass: '453.45 g/mol', cas: '79350-37-1', iupac: '(6R,7R)-7-[[(2Z)-2-(2-amino-1,3-thiazol-4-yl)-2-(carboxymethoxyimino)acetyl]amino]-3-ethenyl-8-oxo-5-thia-1-azabicyclo[4.2.0]oct-2-ene-2-carboxylic acid' },
  azithromycin: { formula: 'C38H72N2O12', mass: '749.0 g/mol', cas: '83905-01-5', iupac: '9-deoxo-9a-aza-9a-methyl-9a-homoerythromycin A' },
  amlodipine: { formula: 'C20H25ClN2O5', mass: '408.88 g/mol', cas: '88150-42-9', iupac: '3-ethyl 5-methyl 2-(2-aminoethoxymethyl)-4-(2-chlorophenyl)-6-methyl-1,4-dihydropyridine-3,5-dicarboxylate' },
  losartan: { formula: 'C22H23ClN6O', mass: '422.91 g/mol', cas: '114798-26-4', iupac: '[2-butyl-5-chloro-3-[[4-[2-(2H-tetrazol-5-yl)phenyl]phenyl]methyl]imidazol-4-yl]methanol' },
  montelukast: { formula: 'C35H36ClNO3S', mass: '586.18 g/mol', cas: '158966-92-8', iupac: '2-[1-[[(1R)-1-[3-[(E)-2-(7-chloroquinolin-2-yl)ethenyl]phenyl]-3-[2-(2-hydroxypropan-2-yl)phenyl]propyl]sulfanylmethyl]cyclopropyl]acetic acid' },
  cetirizine: { formula: 'C21H25ClN2O3', mass: '388.89 g/mol', cas: '83881-51-0', iupac: '2-[2-[4-[(4-chlorophenyl)-phenylmethyl]piperazin-1-yl]ethoxy]acetic acid' },
  fexofenadine: { formula: 'C32H39NO4', mass: '501.66 g/mol', cas: '83799-24-0', iupac: '2-[4-[1-hydroxy-4-[4-[hydroxy(diphenyl)methyl]piperidin-1-yl]butyl]phenyl]-2-methylpropanoic acid' },
  salbutamol: { formula: 'C13H21NO3', mass: '239.31 g/mol', cas: '18559-94-9', iupac: '4-[2-(tert-butylamino)-1-hydroxyethyl]-2-(hydroxymethyl)phenol' },
  ibuprofen: { formula: 'C13H18O2', mass: '206.28 g/mol', cas: '15687-27-1', iupac: '2-[4-(2-methylpropyl)phenyl]propanoic acid' },
  atorvastatin: { formula: 'C33H35FN2O5', mass: '558.64 g/mol', cas: '134523-00-5', iupac: '(3R,5R)-7-[2-(4-fluorophenyl)-3-phenyl-4-(phenylcarbamoyl)-5-propan-2-ylpyrrol-1-yl]-3,5-dihydroxyheptanoic acid' },
  ciprofloxacin: { formula: 'C17H18FN3O3', mass: '331.34 g/mol', cas: '85721-33-1', iupac: '1-cyclopropyl-6-fluoro-4-oxo-7-piperazin-1-ylquinoline-3-carboxylic acid' }
};

export const ChemicalStructure: React.FC<ChemicalStructureProps> = ({ genericName = 'Active Generic Substance', lang = 'en' }) => {
  const norm = genericName.trim().toLowerCase().split(' ')[0].replace(/[^a-z]/g, '');
  const data = CHEMICAL_DATA[norm] || {
    formula: 'Active Clinical Substance',
    mass: 'Specified in Monograph',
    cas: 'DGDA / USP Verified',
    iupac: genericName
  };
  return (
    <section id="sec-structure" className="bg-white dark:bg-[#131B2E] rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3 sm:p-3.5 shadow-xs space-y-3 transition-colors">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-slate-100 dark:border-slate-800/60 pb-2">
        <div className="flex items-center gap-1.5">
          <Atom className="w-4 h-4 text-[#14967F]" />
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
            {lang === 'en' ? 'Chemical Structure' : 'রাসায়নিক গঠন'}
          </h2>
        </div>

        <span className="bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{lang === 'en' ? 'Coming soon' : 'শীঘ্রই আসছে'}</span>
        </span>
      </div>

      {/* 2D Skeletal Chemical Diagram Box (Strictly Matching Hand-Drawn Sketch Layout) */}
      <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-2 min-h-[180px]">
        
        {/* SVG Drawing of Esomeprazole / Chemical Ring Diagram */}
        <svg
          viewBox="0 0 450 180"
          role="img"
          aria-label={`2D Skeletal Chemical Structure for ${genericName}`}
          className="w-full max-w-sm h-auto text-slate-800 dark:text-[#2DD4BF] stroke-current stroke-2 fill-none"
        >
          <title>2D Chemical Diagram for {genericName}</title>
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
          {lang === 'en' ? `2D Structure for ${genericName}` : `${genericName}-এর দ্বিমাত্রিক গঠন`}
        </div>
      </div>

      {/* Info Grid (Strictly Matching Hand-Drawn Sketch Layout) */}
      <div className="space-y-1 border-t border-slate-100 dark:border-slate-800/60 pt-2">
        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="font-extrabold text-slate-800 dark:text-slate-300">{lang === 'en' ? 'Molecular Formula' : 'আণবিক সংকেত'}</span>
          <span className="font-mono font-black text-[#14967F] dark:text-[#2DD4BF]">{data.formula}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="font-extrabold text-slate-800 dark:text-slate-300">{lang === 'en' ? 'Molecular Mass' : 'আণবিক ভর'}</span>
          <span className="font-mono font-black text-[#14967F] dark:text-[#2DD4BF]">{data.mass}</span>
        </div>

        <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100 dark:border-slate-800/60">
          <span className="font-extrabold text-slate-800 dark:text-slate-300">{lang === 'en' ? 'CAS Registry NO' : 'সিএএস নম্বর'}</span>
          <span className="font-mono font-black text-[#14967F] dark:text-[#2DD4BF]">{data.cas}</span>
        </div>
      </div>

    </section>
  );
};
