import React from 'react';
import { Stethoscope, ShieldCheck, Code2, ExternalLink, Heart, Lock } from 'lucide-react';

interface MedicalDisclaimerProps {
  onOpenApiDocs?: () => void;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ onOpenApiDocs }) => {
  return (
    <footer className="bg-[#074760] dark:bg-[#091522] rounded-2xl border border-[#095D7E] dark:border-[#1E3A52] p-4 sm:p-7 mt-4 sm:mt-8 space-y-4 sm:space-y-6 shadow-xl text-white transition-colors">
      
      {/* Top Grid: Brand & Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 pb-4 sm:pb-6 border-b border-[#095D7E] dark:border-[#1E3A52]">
        
        {/* Column 1: Brand Info & Mission */}
        <div className="md:col-span-2 space-y-2 sm:space-y-3">
          <div className="flex items-center">
            <img
              src="/logo.webp"
              alt="MedVhai Logo"
              className="h-8 sm:h-10 w-auto object-contain shrink-0"
            />
          </div>

          <p className="text-xs sm:text-sm text-[#CCECEE] dark:text-slate-300 leading-relaxed font-medium max-w-md">
            Empowering healthcare decisions with accurate clinical medicine data, verified BDT MRP prices, lower-cost generic brand alternatives, and bilingual monograph guidelines.
          </p>

          <div className="flex items-center gap-4 pt-1 text-xs font-bold text-[#E2FCD6] dark:text-[#2DD4BF]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF]" />
              Verified Clinical Index
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF]" />
              Secure Data Protocol
            </span>
          </div>
        </div>

        {/* Column 2: Quick Index Links & Medical Reference */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#E2FCD6] dark:text-[#2DD4BF]">
            Index Directory & Legal
          </h4>
          <ul className="space-y-1.5 text-xs text-[#CCECEE] dark:text-slate-300 font-semibold">
            <li>
              <a href="/about" className="hover:text-white transition-colors">
                About MedVhai Clinical Index
              </a>
            </li>
            <li>
              <a href="/companies" className="hover:text-white transition-colors">
                All 723 Pharma Companies
              </a>
            </li>
            <li>
              <a href="/terms" className="hover:text-white transition-colors">
                Medical Disclaimer & Terms
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy (Zero Health Tracking)
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-white transition-colors">
                Contact & Clinical Corrections
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Developer API Box */}
        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#E2FCD6] dark:text-[#2DD4BF]">
            Developer REST API
          </h4>
          <div className="bg-[#053548] dark:bg-[#112233] p-3 sm:p-3.5 rounded-xl border border-[#095D7E] dark:border-[#1E3A52] space-y-2">
            <p className="text-xs text-[#CCECEE] dark:text-slate-300 font-medium">
              Access medicine REST API endpoints for external app development.
            </p>
            {onOpenApiDocs && (
              <button
                onClick={onOpenApiDocs}
                id="footer-open-api-docs-btn"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#14967F] dark:bg-[#2DD4BF] text-[#E2FCD6] dark:text-slate-950 text-xs font-black shadow-sm hover:bg-[#11806C] transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>API Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Compact Medical Disclaimer Banner */}
      <div className="bg-[#053548]/90 dark:bg-[#112233]/90 p-3 sm:p-4 rounded-xl border border-[#095D7E] dark:border-[#1E3A52] text-xs text-[#CCECEE] dark:text-slate-300 space-y-1">
        <div className="font-black text-xs sm:text-sm flex items-center gap-1.5 text-[#E2FCD6] dark:text-[#2DD4BF]">
          <ShieldCheck className="w-4 h-4 text-[#E2FCD6] dark:text-[#2DD4BF] shrink-0" />
          <span>Medical Information Disclaimer</span>
        </div>
        <p className="text-xs leading-relaxed font-medium text-[#CCECEE]/90 dark:text-slate-300/90">
          MedVhai is an educational clinical reference platform. It does NOT provide medical advice or treatment recommendations. Always consult a registered physician before starting or altering any medication therapy.
        </p>
      </div>

      {/* Bottom Copyright & Credit Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#CCECEE] dark:text-slate-400 font-semibold border-t border-[#095D7E] dark:border-[#1E3A52]">
        <div>
          © 2026 MedVhai Healthcare Index. All rights reserved.
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
