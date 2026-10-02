import React from 'react';
import { ShieldCheck, Heart, Cookie } from 'lucide-react';

interface MedicalDisclaimerProps {
  onOpenApiDocs?: () => void;
  onNavigate?: (path: string) => void;
  onOpenCookieSettings?: () => void;
}

export const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({
  onOpenApiDocs,
  onNavigate,
  onOpenCookieSettings
}) => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCookieClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onOpenCookieSettings) {
      onOpenCookieSettings();
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('meddet_open_cookie_settings'));
    }
  };

  return (
    <footer className="bg-[#074760] dark:bg-[#091522] rounded-2xl border border-[#095D7E] dark:border-[#1E3A52] p-4 sm:p-6 mt-4 sm:mt-6 text-white transition-colors space-y-3.5 shadow-lg">
      
      {/* Top Bar: Brand Identity + Fast Navigation Links */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-white/10">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.webp"
            alt="MEDDET Logo"
            className="h-7 sm:h-8 w-auto object-contain shrink-0"
          />
          <span className="text-[11px] font-bold text-[#E2FCD6] dark:text-[#2DD4BF] bg-white/10 dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
            Clinical Drug Index BD
          </span>
        </div>

        {/* Directory Navigation Links */}
        <nav aria-label="Footer Navigation" className="flex items-center gap-x-3 gap-y-1.5 flex-wrap text-xs font-bold text-[#CCECEE] dark:text-slate-300">
          <a
            href="/about"
            onClick={(e) => handleLinkClick(e, '/about')}
            className="hover:text-white transition-colors"
          >
            About
          </a>
          <span>•</span>
          <a
            href="/companies"
            onClick={(e) => handleLinkClick(e, '/companies')}
            className="hover:text-white transition-colors"
          >
            Companies
          </a>
          <span>•</span>
          <a
            href="/tools/bmi-calculator"
            onClick={(e) => handleLinkClick(e, '/tools/bmi-calculator')}
            className="hover:text-white transition-colors"
          >
            BMI Calculator
          </a>
          <span>•</span>
          <a
            href="/tools"
            onClick={(e) => handleLinkClick(e, '/tools')}
            className="hover:text-white transition-colors"
          >
            Health Tools
          </a>
          <span>•</span>
          {onOpenApiDocs && (
            <>
              <button
                type="button"
                onClick={onOpenApiDocs}
                className="hover:text-white transition-colors cursor-pointer"
              >
                API Docs
              </button>
              <span>•</span>
            </>
          )}
          <a
            href="/contact"
            onClick={(e) => handleLinkClick(e, '/contact')}
            className="hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>

      </div>

      {/* Middle Bar: Legal, Privacy Policy & Cookie Preferences */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#CCECEE]/90 dark:text-slate-400 font-semibold">
        <div className="flex items-center gap-3 flex-wrap">
          <a
            href="/privacy-policy"
            onClick={(e) => handleLinkClick(e, '/privacy-policy')}
            className="text-[#E2FCD6] dark:text-[#2DD4BF] hover:underline font-bold"
          >
            Privacy Policy
          </a>
          <span className="opacity-40">•</span>
          <a
            href="/terms"
            onClick={(e) => handleLinkClick(e, '/terms')}
            className="hover:text-white hover:underline"
          >
            Terms & Conditions
          </a>
          <span className="opacity-40">•</span>
          <button
            type="button"
            onClick={handleCookieClick}
            className="hover:text-white hover:underline inline-flex items-center gap-1 cursor-pointer text-left p-0 bg-transparent border-0 font-semibold text-xs text-[#CCECEE] dark:text-slate-300"
          >
            <Cookie className="w-3 h-3 text-[#E2FCD6] dark:text-[#2DD4BF]" />
            <span>Manage Cookies</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#CCECEE]/80 dark:text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-[#E2FCD6] dark:text-[#2DD4BF] shrink-0" />
          <span>DGDA Aligned • Zero Health Tracking</span>
        </div>
      </div>

      {/* Medical Disclaimer Note (Concise & Unobtrusive) */}
      <p className="text-[11px] text-[#CCECEE]/75 dark:text-slate-400 leading-relaxed border-t border-white/5 pt-2.5 font-medium">
        <strong className="text-[#CCECEE] dark:text-slate-200 font-bold">Medical Disclaimer:</strong> MEDDET is an educational clinical reference guide. It does not provide medical advice or prescription therapy. Always consult a registered physician (MBBS/BDS) before taking or altering any medications.
      </p>

      {/* Bottom Bar: Copyright & Attribution */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[11px] text-[#CCECEE]/60 dark:text-slate-500 font-medium pt-1">
        <div>© 2026 MEDDET™ Healthcare Index. All rights reserved.</div>
        <div className="flex items-center gap-1">
          <span>Crafted for Bangladeshi Healthcare</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
        </div>
      </div>

    </footer>
  );
};
