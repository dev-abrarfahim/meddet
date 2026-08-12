import React from 'react';
import { ShieldAlert, Code2, ExternalLink } from 'lucide-react';

interface MedicalDisclaimerProps {
  onOpenApiDocs?: () => void;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ onOpenApiDocs }) => {
  return (
    <footer className="bg-transparent text-[#095D7E] dark:text-slate-300 border-t border-[#CCECEE] dark:border-[#243B53] pt-6 mt-6 space-y-4 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#14967F] text-[#E2FCD6] flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-extrabold text-[#095D7E] dark:text-slate-100">
            MedVhai Medical Information Disclaimer
          </h3>
          <p className="text-xs sm:text-sm text-[#095D7E]/80 dark:text-slate-400 leading-relaxed">
            MedVhai is a clinical reference and medicine explorer platform designed solely for educational, informational, and price-comparison purposes. It does NOT provide medical advice, diagnosis, or personalized treatment recommendations.
          </p>
        </div>
      </div>

      {/* Developer API & Links Footer Bar */}
      <div className="border-t border-[#CCECEE] dark:border-[#243B53] pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#095D7E]/80 dark:text-slate-400">
        <div className="space-y-1">
          <p>
            • Always consult a registered physician before starting or altering any drug therapy.
          </p>
          <p className="text-[11px] text-[#095D7E]/60 dark:text-slate-500">
            © 2026 MedVhai Healthcare Index. All rights reserved. Registered medical data updated periodically.
          </p>
        </div>

        {/* Developer API Link */}
        {onOpenApiDocs && (
          <button
            onClick={onOpenApiDocs}
            id="footer-open-api-docs-btn"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14967F]/10 dark:bg-[#14967F]/20 border border-[#14967F]/30 dark:border-[#2DD4BF]/40 text-xs font-black text-[#14967F] dark:text-[#2DD4BF] hover:bg-[#14967F] hover:text-white transition-all cursor-pointer shrink-0 shadow-xs"
          >
            <Code2 className="w-4 h-4" />
            <span>Developer API & Docs</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </footer>
  );
};
