import React from 'react';
import { ShieldCheck, Heart, Lock, Building2, Pill, Dna, FileText, ChevronRight, Code2 } from 'lucide-react';

interface MedicalDisclaimerProps {
  onOpenApiDocs?: () => void;
  onNavigate?: (path: string) => void;
}

const POPULAR_MEDICINES = [
  { name: 'Napa 500mg Tablet', path: '/medicine/napa-500mg-tablet-6n1u' },
  { name: 'Maxpro 20mg Tablet', path: '/medicine/maxpro-20mg-tablet-2mv2' },
  { name: 'Sergel 20mg Capsule', path: '/medicine/sergel-20mg-capsule-mwkt' },
  { name: 'Monas 10mg Tablet', path: '/medicine/monas-10mg-tablet-558t' },
  { name: 'Alatrol 10mg Tablet', path: '/medicine/alatrol-10mg-tablet-1r5a' },
  { name: 'Fexo 120mg Tablet', path: '/medicine/fexo-120mg-tablet-pjxb' },
  { name: 'Ace PLUS Tablet', path: '/medicine/ace-plus-500mg-65mg-tablet-0hha' },
  { name: 'Ceevit 250mg Tablet', path: '/medicine/ceevit-250mg-chewable-tablet-bsvw' }
];

const TOP_GENERICS = [
  { name: 'Paracetamol', path: '/generic/paracetamol-3aut' },
  { name: 'Esomeprazole', path: '/generic/esomeprazole-magnesium-trihydrate-1v5w' },
  { name: 'Omeprazole', path: '/generic/omeprazole-36u7' },
  { name: 'Montelukast', path: '/generic/montelukast-2z0l' },
  { name: 'Cefixime', path: '/generic/cefixime-0xfx' },
  { name: 'Azithromycin', path: '/generic/azithromycin-0fse' },
  { name: 'Losartan Potassium', path: '/generic/losartan-potassium-2qny' },
  { name: 'Amlodipine', path: '/generic/amlodipine-06dp' }
];

const TOP_COMPANIES = [
  { name: 'Square Pharmaceuticals PLC', path: '/company/square-pharmaceuticals-plc' },
  { name: 'Incepta Pharmaceuticals Ltd', path: '/company/incepta-pharmaceuticals-ltd' },
  { name: 'Beximco Pharmaceuticals Ltd', path: '/company/beximco-pharmaceuticals-ltd' },
  { name: 'Healthcare Pharmaceuticals Ltd', path: '/company/healthcare-pharmaceuticals-ltd' },
  { name: 'Renata PLC', path: '/company/renata-plc' },
  { name: 'Eskayef Pharmaceuticals Ltd', path: '/company/eskayef-pharmaceuticals-ltd' },
  { name: 'Opsonin Pharma Limited', path: '/company/opsonin-pharma-limited' },
  { name: 'Aristopharma Limited', path: '/company/aristopharma-limited' }
];

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ onOpenApiDocs, onNavigate }) => {
  const handleInternalClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  return (
    <footer className="bg-[#074760] dark:bg-[#091522] rounded-3xl border border-[#095D7E] dark:border-[#1E3A52] p-6 sm:p-10 mt-6 sm:mt-10 space-y-8 shadow-xl text-white transition-colors">
      
      {/* Top Header: Brand Info & Mission */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#095D7E]/80 dark:border-[#1E3A52]">
        <div className="space-y-2 max-w-xl">
          <a
            href="/"
            onClick={(e) => handleInternalClick(e, '/')}
            className="inline-block cursor-pointer"
            aria-label="MedVhai Home"
          >
            <img
              src="/logo.webp"
              alt="MedVhai Logo"
              className="h-9 sm:h-11 w-auto object-contain shrink-0"
            />
          </a>
          <p className="text-xs sm:text-sm text-[#CCECEE] dark:text-slate-300 leading-relaxed font-medium">
            Bangladesh's authoritative clinical drug directory and verified medicine pricing platform. Empowering patients, doctors, and pharmacists with 30,000+ brand monographs, generic alternatives, and BDT MRP prices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-[#E2FCD6] dark:text-[#2DD4BF]">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#053548] dark:bg-[#112233] border border-[#095D7E] dark:border-[#1E3A52]">
            <ShieldCheck className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF]" />
            Verified Clinical Index
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#053548] dark:bg-[#112233] border border-[#095D7E] dark:border-[#1E3A52]">
            <Lock className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF]" />
            100% Private • No Tracking
          </span>
        </div>
      </div>

      {/* 4-Column High-Density Semantic Internal Linking Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 pb-6 border-b border-[#095D7E]/80 dark:border-[#1E3A52]">
        
        {/* Column 1: Core Directory Pages */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#E2FCD6] dark:text-[#2DD4BF] flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>MedVhai Directory</span>
          </h4>
          <ul className="space-y-2 text-xs text-[#CCECEE] dark:text-slate-300 font-semibold">
            <li>
              <a
                href="/about"
                onClick={(e) => handleInternalClick(e, '/about')}
                className="hover:text-white hover:underline flex items-center gap-1 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-[#14967F]" />
                About MedVhai
              </a>
            </li>
            <li>
              <a
                href="/companies"
                onClick={(e) => handleInternalClick(e, '/companies')}
                className="hover:text-white hover:underline flex items-center gap-1 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-[#14967F]" />
                Top Pharma Companies
              </a>
            </li>
            <li>
              <a
                href="/privacy-policy"
                onClick={(e) => handleInternalClick(e, '/privacy-policy')}
                className="hover:text-white hover:underline flex items-center gap-1 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-[#14967F]" />
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                onClick={(e) => handleInternalClick(e, '/terms')}
                className="hover:text-white hover:underline flex items-center gap-1 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-[#14967F]" />
                Terms & Conditions
              </a>
            </li>
            <li>
              <a
                href="/contact"
                onClick={(e) => handleInternalClick(e, '/contact')}
                className="hover:text-white hover:underline flex items-center gap-1 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-[#14967F]" />
                Contact & Corrections
              </a>
            </li>
            <li>
              <a
                href="/api-docs"
                onClick={(e) => handleInternalClick(e, '/api-docs')}
                className="hover:text-white hover:underline flex items-center gap-1 transition-colors"
              >
                <ChevronRight className="w-3 h-3 text-[#14967F]" />
                Developer REST API
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Popular Medicines in BD */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#E2FCD6] dark:text-[#2DD4BF] flex items-center gap-1.5">
            <Pill className="w-3.5 h-3.5" />
            <span>Popular Medicines</span>
          </h4>
          <ul className="space-y-2 text-xs text-[#CCECEE] dark:text-slate-300 font-semibold">
            {POPULAR_MEDICINES.map((med) => (
              <li key={med.path}>
                <a
                  href={med.path}
                  onClick={(e) => handleInternalClick(e, med.path)}
                  className="hover:text-white hover:underline flex items-center gap-1 transition-colors truncate"
                  title={med.name}
                >
                  <ChevronRight className="w-3 h-3 text-[#14967F] shrink-0" />
                  <span className="truncate">{med.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Top Generic Ingredients */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#E2FCD6] dark:text-[#2DD4BF] flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5" />
            <span>Top Generic Classes</span>
          </h4>
          <ul className="space-y-2 text-xs text-[#CCECEE] dark:text-slate-300 font-semibold">
            {TOP_GENERICS.map((gen) => (
              <li key={gen.path}>
                <a
                  href={gen.path}
                  onClick={(e) => handleInternalClick(e, gen.path)}
                  className="hover:text-white hover:underline flex items-center gap-1 transition-colors truncate"
                  title={gen.name}
                >
                  <ChevronRight className="w-3 h-3 text-[#14967F] shrink-0" />
                  <span className="truncate">{gen.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Top Manufacturers */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#E2FCD6] dark:text-[#2DD4BF] flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Top Manufacturers</span>
          </h4>
          <ul className="space-y-2 text-xs text-[#CCECEE] dark:text-slate-300 font-semibold">
            {TOP_COMPANIES.map((comp) => (
              <li key={comp.path}>
                <a
                  href={comp.path}
                  onClick={(e) => handleInternalClick(e, comp.path)}
                  className="hover:text-white hover:underline flex items-center gap-1 transition-colors truncate"
                  title={comp.name}
                >
                  <ChevronRight className="w-3 h-3 text-[#14967F] shrink-0" />
                  <span className="truncate">{comp.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Medical Disclaimer Banner */}
      <div className="bg-[#053548]/90 dark:bg-[#112233]/90 p-4 sm:p-5 rounded-2xl border border-[#095D7E] dark:border-[#1E3A52] text-xs text-[#CCECEE] dark:text-slate-300 space-y-1.5">
        <div className="font-black text-xs sm:text-sm flex items-center gap-1.5 text-[#E2FCD6] dark:text-[#2DD4BF]">
          <ShieldCheck className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF] shrink-0" />
          <span>Clinical & Educational Information Disclaimer</span>
        </div>
        <p className="text-xs leading-relaxed font-medium text-[#CCECEE]/90 dark:text-slate-300/90">
          MedVhai is an independent clinical reference index. Information provided on this site is for educational and clinical guidance only and does not constitute medical advice, diagnosis, or treatment. Always consult a registered physician or healthcare professional before initiating or altering any medication regimen.
        </p>
      </div>

      {/* Bottom Copyright & Credit Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#CCECEE] dark:text-slate-400 font-semibold border-t border-[#095D7E]/80 dark:border-[#1E3A52]">
        <div>
          © 2026 MedVhai™ Healthcare Index. All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>for Bangladeshi Healthcare</span>
        </div>
      </div>

    </footer>
  );
};
