import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const MedicalDisclaimer: React.FC = () => {
  return (
    <footer className="bg-transparent text-[#095D7E] dark:text-slate-300 border-t border-[#CCECEE] dark:border-[#243B53] pt-8 mt-8 space-y-4 transition-colors">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#14967F] text-[#E2FCD6] flex items-center justify-center shrink-0">
          <ShieldAlert className="w-6 h-6" />
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

      <div className="border-t border-[#CCECEE] dark:border-[#243B53] pt-4 text-xs text-[#095D7E]/80 dark:text-slate-400 space-y-2">
        <p>
          • Always consult a registered physician or licensed medical practitioner before starting, stopping, or altering any medication or drug therapy.
        </p>
        <p>
          • Alternative brand comparisons are generated strictly by matching active pharmaceutical ingredients (generics), dosage forms, and strengths. Individual drug responses, bioavailability, and excipient tolerances may vary.
        </p>
        <p className="text-[11px] text-[#095D7E]/60 dark:text-slate-500">
          © 2026 MedVhai Healthcare Index. All rights reserved. Registered medical data updated periodically.
        </p>
      </div>
    </footer>
  );
};
