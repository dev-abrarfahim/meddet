import React from 'react';
import { Stethoscope, ShieldCheck, Code2, ExternalLink, Heart, Lock } from 'lucide-react';

interface MedicalDisclaimerProps {
  onOpenApiDocs?: () => void;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ onOpenApiDocs }) => {
  return (
    <footer className="bg-white/80 dark:bg-[#0B1927]/90 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-3.5 sm:p-6 mt-4 sm:mt-8 space-y-3 sm:space-y-6 shadow-xs transition-colors">
      
      {/* Top Grid: Brand & Links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 pb-3 sm:pb-6 border-b border-slate-100 dark:border-slate-800/60">
        
        {/* Column 1: Brand Info & Mission */}
        <div className="md:col-span-2 space-y-1.5 sm:space-y-2.5">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="MedVhai Logo" className="h-7 sm:h-8 w-auto object-contain shrink-0" />
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-slate-100">
              MedVhai
            </span>
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
              Drug Index
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-md">
            Empowering healthcare decisions with accurate clinical medicine data, verified BDT MRP prices, lower-cost generic brand alternatives, and bilingual monograph guidelines.
          </p>

          <div className="flex items-center gap-3 pt-0.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#14967F]" />
              Verified Clinical Index
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#14967F]" />
              Secure Data Protocol
            </span>
          </div>
        </div>

        {/* Column 2: Quick Index Links (Hidden on small mobile to save space) */}
        <div className="space-y-1.5 hidden sm:block">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Clinical Tools
          </h4>
          <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400 font-semibold">
            <li>
              <a href="#sec-overview" className="hover:text-[#14967F] transition-colors">
                Medicine Search Index
              </a>
            </li>
            <li>
              <a href="#sec-alternatives" className="hover:text-[#14967F] transition-colors">
                Lower Cost Brand Comparison
              </a>
            </li>
            <li>
              <a href="#sec-monograph" className="hover:text-[#14967F] transition-colors">
                Clinical Monograph Guidelines
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Developer API Box */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100">
            Developer REST API
          </h4>
          <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1.5">
            <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-400 font-medium">
              Access medicine REST API endpoints for external app development.
            </p>
            {onOpenApiDocs && (
              <button
                onClick={onOpenApiDocs}
                id="footer-open-api-docs-btn"
                className="w-full inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#095D7E] dark:bg-[#14967F] text-white text-[11px] sm:text-xs font-black shadow-xs hover:bg-[#074760] transition-colors cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5 text-[#E2FCD6]" />
                <span>API Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Compact Medical Disclaimer Banner */}
      <div className="bg-amber-50/60 dark:bg-amber-950/30 p-2.5 sm:p-3 rounded-xl border border-amber-200/80 dark:border-amber-800/40 text-[10px] sm:text-xs text-amber-900 dark:text-amber-300 space-y-0.5">
        <div className="font-black text-[11px] sm:text-xs flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>Medical Information Disclaimer</span>
        </div>
        <p className="text-[10px] sm:text-[11px] leading-relaxed font-medium text-amber-800/90 dark:text-amber-300/90">
          MedVhai is an educational clinical reference platform. It does NOT provide medical advice or treatment recommendations. Always consult a registered physician before starting or altering any medication therapy.
        </p>
      </div>

      {/* Bottom Copyright & Credit Bar */}
      <div className="pt-1.5 flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold border-t border-slate-100 dark:border-slate-800/60">
        <div>
          © 2026 MedVhai Healthcare Index. All rights reserved.
        </div>
        <div className="flex items-center gap-1">
          <span>Crafted with</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          <span>for Bangladeshi Healthcare</span>
        </div>
      </div>

    </footer>
  );
};
