import React, { useState, useEffect } from 'react';
import { Cookie, Settings, Check, X, ExternalLink } from 'lucide-react';
import { LanguageMode } from '../../types';

export interface CookiePreferences {
  essential: boolean;     // Always true
  analytics: boolean;     // Google Analytics, Microsoft Clarity
  advertising: boolean;   // Google AdSense, DoubleClick
  timestamp: string;
}

interface CookieConsentBannerProps {
  lang: LanguageMode;
  onNavigate?: (path: string) => void;
}

const STORAGE_KEY = 'meddet_cookie_consent_v1';

// Determines if visitor is in an EU/EEA/UK jurisdiction where cookie consent banner is legally mandatory
function isGdprJurisdiction(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    // Bangladesh & South Asia are NOT subject to EU GDPR cookie consent requirements
    if (tz.startsWith('Asia/Dhaka') || tz === 'Asia/Dhaka' || tz.startsWith('Asia/Kolkata')) {
      return false;
    }
    // Check European Economic Area, UK, and Swiss timezones
    if (
      tz.startsWith('Europe/') ||
      tz.startsWith('Atlantic/Reykjavik') ||
      tz.startsWith('Atlantic/Canary') ||
      tz.startsWith('Atlantic/Madeira')
    ) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Push consent update to Google Consent Mode v2
function updateGoogleConsentMode(prefs: { analytics: boolean; advertising: boolean }) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    try {
      (window as any).gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.advertising ? 'granted' : 'denied',
        ad_user_data: prefs.advertising ? 'granted' : 'denied',
        ad_personalization: prefs.advertising ? 'granted' : 'denied'
      });
    } catch {}
  }
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({ lang, onNavigate }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState<boolean>(true);
  const [advertisingAllowed, setAdvertisingAllowed] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CookiePreferences = JSON.parse(stored);
        setAnalyticsAllowed(parsed.analytics);
        setAdvertisingAllowed(parsed.advertising);
        updateGoogleConsentMode({ analytics: parsed.analytics, advertising: parsed.advertising });
      } else {
        // If the user is NOT in the EU/EEA (e.g., in Bangladesh), automatically grant consent silently
        // without bothering the user with a popup banner
        const isEU = isGdprJurisdiction();
        if (!isEU) {
          const defaultPrefs: CookiePreferences = {
            essential: true,
            analytics: true,
            advertising: true,
            timestamp: new Date().toISOString()
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPrefs));
          updateGoogleConsentMode({ analytics: true, advertising: true });
        } else {
          // In EU/EEA: Show the ultra-sleek, compact single-line bar after a brief delay
          const timer = setTimeout(() => setIsVisible(true), 1200);
          return () => clearTimeout(timer);
        }
      }
    } catch {}

    // Handler to allow reopening settings anytime from footer or privacy policy page
    const handleReopen = () => {
      setShowPreferences(true);
      setIsVisible(true);
    };

    window.addEventListener('meddet_open_cookie_settings', handleReopen);
    return () => window.removeEventListener('meddet_open_cookie_settings', handleReopen);
  }, []);

  const saveConsent = (analytics: boolean, advertising: boolean) => {
    const prefs: CookiePreferences = {
      essential: true,
      analytics,
      advertising,
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}

    updateGoogleConsentMode({ analytics, advertising });
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    setAnalyticsAllowed(true);
    setAdvertisingAllowed(true);
    saveConsent(true, true);
  };

  const handleDismiss = () => {
    saveConsent(analyticsAllowed, advertisingAllowed);
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate('/privacy-policy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 1. FULL PREFERENCES MODAL (Only when user explicitly clicks Settings / Manage Cookies) */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#152232] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 text-slate-800 dark:text-slate-100 z-10">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#14967F] text-white flex items-center justify-center">
                  <Settings className="w-4 h-4 text-[#E2FCD6]" />
                </div>
                <h3 className="text-base font-black text-[#095D7E] dark:text-slate-100">
                  {lang === 'en' ? 'Cookie & Privacy Preferences' : 'কুকি সেটিংস ও পছন্দ'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPreferences(false);
                  setIsVisible(false);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              {/* Category 1: Strictly Necessary */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF]">
                      {lang === 'en' ? '1. Strictly Necessary' : '১. প্রয়োজনীয় কুকি'}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {lang === 'en' ? 'Active' : 'সক্রিয়'}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {lang === 'en'
                      ? 'Essential for core theme selection, offline medicine indexing, and security.'
                      : 'থিম সেটিংস, ভাষা নির্বাচন ও সাইটের কার্যকারিতার জন্য অপরিহার্য।'}
                  </p>
                </div>
                <span className="w-8 h-4 bg-[#14967F] rounded-full inline-flex items-center justify-end px-1 opacity-80 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                </span>
              </div>

              {/* Category 2: Analytics */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] block">
                    {lang === 'en' ? '2. Analytics (GA4 & Clarity)' : '২. অ্যানালিটিক্স'}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {lang === 'en'
                      ? 'Anonymous search performance and page speed metrics.'
                      : 'সার্ভার স্পিড ও অনুসন্ধান পরিসংখ্যান মূল্যায়নে ব্যবহৃত হয়।'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={analyticsAllowed}
                    onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#14967F]"></div>
                </label>
              </div>

              {/* Category 3: Advertising */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[#095D7E] dark:text-[#2DD4BF] block">
                    {lang === 'en' ? '3. Advertising (Google AdSense)' : '৩. বিজ্ঞাপন (Google AdSense)'}
                  </span>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {lang === 'en'
                      ? 'Enables relevant non-intrusive ads to keep the index free.'
                      : 'সাইটটি উন্মুক্ত রাখতে প্রাসঙ্গিক বিজ্ঞাপন প্রদর্শনে ব্যবহৃত হয়।'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={advertisingAllowed}
                    onChange={(e) => setAdvertisingAllowed(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#14967F]"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => saveConsent(analyticsAllowed, advertisingAllowed)}
                className="px-4 py-2 rounded-xl text-xs font-black bg-[#14967F] hover:bg-[#11806C] text-white shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Save Choices' : 'সংরক্ষণ করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. ULTRA-COMPACT SINGLE-LINE FLOATING BAR (Only shown in EU/EEA where required by law) */}
      {!showPreferences && (
        <div
          role="region"
          aria-label="Cookie Notice"
          className="fixed bottom-16 sm:bottom-4 inset-x-3 sm:inset-x-auto sm:right-4 z-40 pointer-events-none max-w-lg"
        >
          <div className="bg-slate-900/95 dark:bg-[#111C2E]/95 backdrop-blur-md text-white rounded-full shadow-2xl border border-slate-700/60 p-1.5 pl-3.5 flex items-center justify-between gap-2.5 pointer-events-auto transition-all animate-in slide-in-from-bottom duration-300 text-xs">
            
            {/* Left: Icon & Concise Single-Line Text */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Cookie className="w-4 h-4 text-[#2DD4BF] shrink-0" />
              <span className="truncate text-slate-200 text-[11px] sm:text-xs font-medium">
                {lang === 'en'
                  ? 'We use cookies for analytics and Google ads.'
                  : 'আমরা অ্যানালিটিক্স ও গুগল বিজ্ঞাপনের জন্য কুকি ব্যবহার করি।'}
              </span>
              <a
                href="/privacy-policy"
                onClick={handlePrivacyClick}
                className="underline text-slate-300 hover:text-white text-[11px] shrink-0 font-bold hidden sm:inline"
              >
                {lang === 'en' ? 'Privacy' : 'পলিসি'}
              </a>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleAcceptAll}
                className="px-3 py-1 rounded-full bg-[#14967F] hover:bg-[#11806C] text-white text-[11px] font-black shadow-sm transition-colors cursor-pointer"
              >
                {lang === 'en' ? 'OK' : 'ঠিক আছে'}
              </button>
              
              <button
                onClick={() => setShowPreferences(true)}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={lang === 'en' ? 'Cookie Preferences' : 'কুকি সেটিংস'}
                aria-label="Cookie preferences"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleDismiss}
                className="p-1 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                title={lang === 'en' ? 'Dismiss' : 'বন্ধ করুন'}
                aria-label="Dismiss cookie notice"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
