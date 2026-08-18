import React, { useState, useEffect, useRef } from 'react';
import {
  Header,
  SearchBar,
  AlphabetFilter,
  MedicineCard,
  TableOfContents,
  MedicineHero,
  PriceSection,
  AlternativeBrands,
  ChemicalStructure,
  MedicalDisclaimer,
  BottomNav,
  FilterDrawer,
  SidebarDrawer,
  HomeLanding,
  ClinicalMonographAccordions,
  GenericBrandsExplorer,
  FilterPanel,
  NotFoundPage,
  AboutPage,
  PrivacyPolicyPage,
  TermsPage,
  ContactPage,
  CompaniesPage,
  ApiDocsPage
} from './components';

import { Medicine, FilterOptions, LanguageMode } from './types';
import { searchMedicines, getMedicineById, getGenericById, subscribeDatabase, isDatabaseReady } from './data/dbEngine';
import {
  slugify,
  getMedicineCanonicalPath,
  getGenericCanonicalPath,
  getDosageFormCanonicalPath,
  getCompanyCanonicalPath,
  parseMedicineIdFromSlug,
  parseGenericIdFromSlug
} from './utils/urlHelper';
import { updateDynamicSEO } from './utils/seoManager';
import { Pill, Search, RotateCcw, ChevronLeft, ChevronRight, Languages, ShieldCheck, SlidersHorizontal } from 'lucide-react';

export default function App() {
  const [dbReady, setDbReady] = useState<boolean>(isDatabaseReady());
  const [dbVersion, setDbVersion] = useState<number>(0);

  useEffect(() => {
    return subscribeDatabase(() => {
      setDbReady(isDatabaseReady());
      setDbVersion((v) => v + 1);
    });
  }, []);

  // Active Main Tab State ('home' vs 'search')
  const [activeTab, setActiveTab] = useState<'home' | 'search'>('home');

  // Dual Language State ('en' vs 'bn')
  const [lang, setLang] = useState<LanguageMode>(() => {
    try {
      const saved = localStorage.getItem('medvhai_lang');
      return (saved === 'bn' ? 'bn' : 'en');
    } catch {
      return 'en';
    }
  });

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === 'en' ? 'bn' : 'en';
      try {
        localStorage.setItem('medvhai_lang', next);
      } catch {}
      return next;
    });
  };

  // Theme State (Dark / Light Mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('medvhai_dark_mode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sync dark class on html root element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('medvhai_dark_mode', JSON.stringify(isDarkMode));
    } catch {}
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<FilterOptions>({
    category: 'All',
    dosageForm: 'All',
    manufacturer: 'All',
    maxPrice: 0,
    sortBy: 'relevance'
  });

  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [explorerGenericId, setExplorerGenericId] = useState<number | null>(null);
  const [explorerForm, setExplorerForm] = useState<string | undefined>(undefined);
  const [explorerStrength, setExplorerStrength] = useState<string | undefined>(undefined);
  const [is404, setIs404] = useState<boolean>(false);
  const [notFoundSlug, setNotFoundSlug] = useState<string>('');
  const [activeStandalonePage, setActiveStandalonePage] = useState<'about' | 'privacy' | 'terms' | 'contact' | 'companies' | 'api-docs' | null>(null);

  // Helper to update browser URL using clean canonical path or query parameters
  const syncNavigationUrl = (canonicalPath: string, searchParams?: Record<string, string | null>) => {
    try {
      const url = new URL(window.location.href);
      url.pathname = canonicalPath;
      if (searchParams) {
        Object.entries(searchParams).forEach(([key, val]) => {
          if (val === null) {
            url.searchParams.delete(key);
          } else {
            url.searchParams.set(key, val);
          }
        });
      } else {
        url.search = '';
      }

      // Update current window history
      window.history.pushState(null, '', url.pathname + url.search);

      // If embedded inside Blogger iframe, sync URL via postMessage
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'MEDVHAI_URL_CHANGE', pathname: url.pathname, search: url.search }, '*');
      }
    } catch {}
  };

  // Reusable function: Restore React state from current URL path & search parameters
  const restoreStateFromUrl = () => {
    try {
      const url = new URL(window.location.href);
      const pathname = decodeURIComponent(url.pathname);
      const searchParams = url.searchParams;

      // Reset 404 state
      setIs404(false);
      setNotFoundSlug('');

      // Dedicated Standalone Content Pages: /about, /privacy-policy, /terms, /contact, /companies, /api-docs
      const cleanPath = pathname.replace(/\/$/, '');
      if (cleanPath === '/about') {
        setActiveStandalonePage('about');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        return;
      }
      if (cleanPath === '/privacy-policy') {
        setActiveStandalonePage('privacy');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        return;
      }
      if (cleanPath === '/terms') {
        setActiveStandalonePage('terms');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        return;
      }
      if (cleanPath === '/contact') {
        setActiveStandalonePage('contact');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        return;
      }
      if (cleanPath === '/companies') {
        setActiveStandalonePage('companies');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        return;
      }
      if (cleanPath === '/api-docs') {
        setActiveStandalonePage('api-docs');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        return;
      }

      setActiveStandalonePage(null);

      // 1. Path-based routing: /medicine/:slug (e.g., /medicine/napa-500mg-tablet-14521)
      if (pathname.startsWith('/medicine/')) {
        const medId = parseMedicineIdFromSlug(pathname);
        if (medId) {
          const med = getMedicineById(medId);
          if (med) {
            setSelectedMedicine(med);
            setExplorerGenericId(null);
            setIs404(false);

            // Enforce clean canonical URL: Strip any legacy/conflicting query parameters from browser address bar
            const canonicalPath = getMedicineCanonicalPath(med);
            if (url.search !== '' || pathname !== canonicalPath) {
              window.history.replaceState(null, '', canonicalPath);
            }
            return;
          }
        }
        setIs404(true);
        setNotFoundSlug(pathname.replace(/^\/medicine\//, '').replace(/\/$/, ''));
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        return;
      }

      // 2. Path-based routing: /generic/:slug (e.g., /generic/paracetamol-1124)
      if (pathname.startsWith('/generic/')) {
        const genId = parseGenericIdFromSlug(pathname);
        if (genId) {
          const gen = getGenericById(genId);
          if (gen) {
            setSelectedMedicine(null);
            setExplorerGenericId(genId);
            setIs404(false);
            const formParam = searchParams.get('form');
            const strParam = searchParams.get('strength');
            if (formParam) setExplorerForm(formParam);
            if (strParam) setExplorerStrength(strParam);
            return;
          }
        }
        setIs404(true);
        setNotFoundSlug(pathname.replace(/^\/generic\//, '').replace(/\/$/, ''));
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        return;
      }

      // 3. Path-based routing: /dosage-form/:form (e.g., /dosage-form/tablet)
      if (pathname.startsWith('/dosage-form/')) {
        const formSlug = pathname.replace(/^\/dosage-form\//, '').replace(/\/$/, '');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        setActiveTab('search');
        setFilters((prev) => ({ ...prev, dosageForm: formSlug }));
        return;
      }

      // 4. Path-based routing: /company/:company (e.g., /company/square-pharmaceuticals-plc)
      if (pathname.startsWith('/company/')) {
        const compSlug = pathname.replace(/^\/company\//, '').replace(/\/$/, '');
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setIs404(false);
        setActiveTab('search');
        setFilters((prev) => ({ ...prev, manufacturer: compSlug }));
        return;
      }

      // 5. Legacy Query Parameter Fallback (e.g., /?id=14521&brand=napa-500mg-tablet)
      const idParam = searchParams.get('id');
      const gIdParam = searchParams.get('genericId');
      const formParam = searchParams.get('form');
      const strParam = searchParams.get('strength');
      const qParam = searchParams.get('q');
      const letterParam = searchParams.get('letter');
      const catParam = searchParams.get('category');
      const mfrParam = searchParams.get('company') || searchParams.get('manufacturer');

      if (idParam && !isNaN(Number(idParam))) {
        const med = getMedicineById(Number(idParam));
        if (med) {
          setSelectedMedicine(med);
          setExplorerGenericId(null);
          // Upgrade URL in address bar to clean canonical path
          window.history.replaceState(null, '', getMedicineCanonicalPath(med));
          return;
        }
      }

      if (gIdParam && !isNaN(Number(gIdParam))) {
        setSelectedMedicine(null);
        setExplorerGenericId(Number(gIdParam));
        if (formParam) setExplorerForm(formParam);
        if (strParam) setExplorerStrength(strParam);
        const gen = getGenericById(Number(gIdParam));
        if (gen) {
          window.history.replaceState(null, '', getGenericCanonicalPath(gen));
        }
        return;
      }

      if (qParam || letterParam || catParam || mfrParam || formParam) {
        setSelectedMedicine(null);
        setExplorerGenericId(null);
        setActiveTab('search');
        if (qParam) setSearchQuery(qParam);
        if (letterParam) setSelectedLetter(letterParam);
        if (catParam || mfrParam || formParam) {
          setFilters((prev) => ({
            ...prev,
            category: catParam || prev.category,
            manufacturer: mfrParam || prev.manufacturer,
            dosageForm: formParam || prev.dosageForm
          }));
        }
        return;
      }

      // 6. Default Root Homepage
      setSelectedMedicine(null);
      setExplorerGenericId(null);
      setActiveTab('home');
    } catch {}
  };

  // Sync & restore URL state on initial load and whenever dbReady is true
  useEffect(() => {
    if (!dbReady) return;
    restoreStateFromUrl();
  }, [dbReady]);

  // Synchronize Search & Filter state to browser URL (Debounced replaceState)
  useEffect(() => {
    if (!dbReady || selectedMedicine || explorerGenericId || is404) return;
    const pathname = window.location.pathname;
    if (pathname.startsWith('/medicine/') || pathname.startsWith('/generic/')) return;

    const timer = setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        const params: Record<string, string | null> = {
          q: searchQuery.trim() ? searchQuery.trim() : null,
          letter: selectedLetter !== 'All' ? selectedLetter : null,
          category: filters.category !== 'All' ? filters.category : null,
          form: filters.dosageForm !== 'All' ? filters.dosageForm : null,
          company: filters.manufacturer !== 'All' ? filters.manufacturer : null,
        };

        Object.entries(params).forEach(([key, val]) => {
          if (val === null) {
            url.searchParams.delete(key);
          } else {
            url.searchParams.set(key, val);
          }
        });

        if (!pathname.startsWith('/dosage-form/') && !pathname.startsWith('/company/')) {
          url.pathname = '/';
        }

        const newUrl = url.pathname + (url.searchParams.toString() ? `?${url.searchParams.toString()}` : '');
        if (window.location.pathname + window.location.search !== newUrl) {
          window.history.replaceState(null, '', newUrl);
        }
      } catch {}
    }, 250);

    return () => clearTimeout(timer);
  }, [dbReady, searchQuery, selectedLetter, filters, activeTab, selectedMedicine, explorerGenericId, is404]);

  // Handle browser Back / Forward button navigation (popstate)
  useEffect(() => {
    if (!dbReady) return;

    const handlePopState = () => {
      restoreStateFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [dbReady]);

  // Re-hydrate detailed monograph when Tier 2 background loading completes
  useEffect(() => {
    if (selectedMedicine && !selectedMedicine.monograph) {
      const refreshed = getMedicineById(selectedMedicine.id);
      if (refreshed && refreshed.monograph) {
        setSelectedMedicine(refreshed);
      }
    }
  }, [dbVersion]);

  // Dynamically update document title, meta descriptions, canonical link, OpenGraph & Schema.org JSON-LD
  useEffect(() => {
    if (activeStandalonePage) {
      updateDynamicSEO({ staticPage: activeStandalonePage });
      return;
    }
    const genericObj = explorerGenericId ? getGenericById(explorerGenericId) : null;
    updateDynamicSEO({
      medicine: selectedMedicine,
      generic: genericObj,
      categoryName: filters.category !== 'All' ? filters.category : undefined,
      dosageForm: filters.dosageForm !== 'All' ? filters.dosageForm : undefined,
      manufacturer: filters.manufacturer !== 'All' ? filters.manufacturer : undefined,
      letter: selectedLetter !== 'All' ? selectedLetter : undefined,
      searchQuery: searchQuery || undefined
    });
  }, [activeStandalonePage, selectedMedicine, explorerGenericId, searchQuery, filters.category, filters.dosageForm, filters.manufacturer, selectedLetter, activeTab]);

  const handleOpenGenericBrandsExplorer = (genericId: number, form?: string, strength?: string) => {
    setActiveStandalonePage(null);
    setExplorerGenericId(genericId);
    setExplorerForm(form);
    setExplorerStrength(strength);
    const gen = getGenericById(genericId);
    const canonicalPath = gen ? getGenericCanonicalPath(gen) : `/generic/${genericId}`;
    syncNavigationUrl(canonicalPath, { form: form || null, strength: strength || null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseGenericBrandsExplorer = () => {
    setActiveStandalonePage(null);
    setExplorerGenericId(null);
    setExplorerForm(undefined);
    setExplorerStrength(undefined);
    syncNavigationUrl('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modal / Drawer States
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('sec-overview');

  const mainInputRef = useRef<HTMLInputElement | null>(null);

  // Keyboard shortcut (⌘K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleGoToSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track active scrolling section when viewing medicine details
  useEffect(() => {
    if (!selectedMedicine) return;

    const sections = [
      'sec-overview',
      'sec-price',
      'sec-alternatives',
      'sec-structure',
      'sec-uses',
      'sec-safety',
      'sec-dosage',
      'sec-warnings',
      'sec-sideeffects',
      'sec-moreinfo'
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [selectedMedicine]);

  // Unified Page Navigator for Standalone Pages (/about, /privacy-policy, /terms, /contact, /companies, /api-docs)
  const handleNavigatePage = (path: string) => {
    setIs404(false);
    setSelectedMedicine(null);
    setExplorerGenericId(null);

    const clean = path.replace(/\/$/, '');
    if (clean === '/about') {
      setActiveStandalonePage('about');
      syncNavigationUrl('/about');
    } else if (clean === '/privacy-policy') {
      setActiveStandalonePage('privacy');
      syncNavigationUrl('/privacy-policy');
    } else if (clean === '/terms') {
      setActiveStandalonePage('terms');
      syncNavigationUrl('/terms');
    } else if (clean === '/contact') {
      setActiveStandalonePage('contact');
      syncNavigationUrl('/contact');
    } else if (clean === '/companies') {
      setActiveStandalonePage('companies');
      syncNavigationUrl('/companies');
    } else if (clean === '/api-docs') {
      setActiveStandalonePage('api-docs');
      syncNavigationUrl('/api-docs');
    } else {
      setActiveStandalonePage(null);
      if (clean === '') {
        handleGoHome();
      } else {
        syncNavigationUrl(path);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execute database search with pagination
  const searchResults = searchMedicines(
    searchQuery,
    selectedLetter,
    {
      category: filters.category,
      dosageForm: filters.dosageForm,
      manufacturer: filters.manufacturer,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy
    },
    currentPage,
    48
  );

  const activeFilterCount =
    (filters.category !== 'All' ? 1 : 0) +
    (filters.dosageForm !== 'All' ? 1 : 0) +
    (filters.manufacturer !== 'All' ? 1 : 0) +
    (filters.maxPrice > 0 ? 1 : 0);

  const handleSelectMedicine = (med: Medicine) => {
    const fullMed = getMedicineById(med.id) || med;
    setIs404(false);
    setActiveStandalonePage(null);
    setSelectedMedicine(fullMed);
    setExplorerGenericId(null);
    setExplorerForm(undefined);
    setExplorerStrength(undefined);
    const canonicalPath = getMedicineCanonicalPath(fullMed);
    syncNavigationUrl(canonicalPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setIs404(false);
    setActiveStandalonePage(null);
    setSelectedMedicine(null);
    setExplorerGenericId(null);
    setActiveTab('home');
    syncNavigationUrl('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToSearch = (query?: string, category?: string, manufacturer?: string, dosageForm?: string) => {
    setIs404(false);
    setActiveStandalonePage(null);
    setSelectedMedicine(null);
    setExplorerGenericId(null);
    setActiveTab('search');
    setSelectedLetter('All');
    setCurrentPage(1);

    setFilters({
      category: category !== undefined ? category : 'All',
      manufacturer: manufacturer !== undefined ? manufacturer : 'All',
      dosageForm: dosageForm !== undefined ? dosageForm : 'All',
      maxPrice: 0,
      sortBy: 'relevance'
    });

    if (query !== undefined) {
      setSearchQuery(query);
    } else {
      setSearchQuery('');
    }

    if (dosageForm && dosageForm !== 'All') {
      syncNavigationUrl(getDosageFormCanonicalPath(dosageForm));
    } else if (manufacturer && manufacturer !== 'All') {
      syncNavigationUrl(getCompanyCanonicalPath(manufacturer));
    } else if (query) {
      syncNavigationUrl('/', { q: query });
    } else {
      syncNavigationUrl('/');
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const resetFilters = () => {
    setFilters({
      category: 'All',
      dosageForm: 'All',
      manufacturer: 'All',
      maxPrice: 0,
      sortBy: 'relevance'
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F9FF]/70 dark:bg-[#0B131B]/70 text-[#095D7E] dark:text-slate-100 font-sans pb-24 transition-colors duration-300 relative z-10">
      
      {/* Primary Navigation Header */}
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenFilters={() => setIsFiltersOpen(true)}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Secondary Sticky Search Header Toolbar */}
      <div className="sticky top-16 z-30 bg-[#095D7E] dark:bg-[#0B1927] border-b border-[#074760] dark:border-[#1E3A52] py-2.5 px-4 sm:px-6 lg:px-8 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <SearchBar
            query={searchQuery}
            onChangeQuery={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
              if (selectedMedicine) setSelectedMedicine(null);
              if (activeTab !== 'search') setActiveTab('search');
            }}
            onSelectMedicine={handleSelectMedicine}
            onOpenFilterDrawer={() => setIsFiltersOpen(true)}
            activeFilterCount={activeFilterCount}
            inputRef={mainInputRef}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 space-y-6">

        {/* VIEW 404: MEDICINE NOT FOUND RECOVERY VIEW */}
        {is404 ? (
          <NotFoundPage
            onGoHome={handleGoHome}
            onGoToSearch={handleGoToSearch}
            lang={lang}
            requestedSlug={notFoundSlug}
          />
        ) : activeStandalonePage === 'about' ? (
          <AboutPage lang={lang} onGoHome={handleGoHome} onGoToSearch={handleGoToSearch} />
        ) : activeStandalonePage === 'privacy' ? (
          <PrivacyPolicyPage lang={lang} />
        ) : activeStandalonePage === 'terms' ? (
          <TermsPage lang={lang} />
        ) : activeStandalonePage === 'contact' ? (
          <ContactPage lang={lang} />
        ) : activeStandalonePage === 'companies' ? (
          <CompaniesPage lang={lang} onSelectCompany={(compName) => handleGoToSearch(undefined, undefined, compName)} />
        ) : activeStandalonePage === 'api-docs' ? (
          <ApiDocsPage lang={lang} />
        ) : explorerGenericId ? (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-200 pb-16">
            <GenericBrandsExplorer
              genericId={explorerGenericId}
              initialForm={explorerForm}
              initialStrength={explorerStrength}
              onSelectMedicine={handleSelectMedicine}
              onBack={handleCloseGenericBrandsExplorer}
              lang={lang}
            />
          </div>
        ) : selectedMedicine ? (
          <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-200 pb-16">
            
            {/* Sticky Table of Contents Jump Bar */}
            <TableOfContents activeSection={activeSection} />

            {/* Responsive Grid Layout for Tablet (md:), PC/Desktop (lg: & xl:) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Primary Clinical Column (lg:col-span-8) */}
              <div className="lg:col-span-8 space-y-3 sm:space-y-4">
                {/* 1. Hero Overview */}
                <MedicineHero
                  medicine={selectedMedicine}
                  onBackToSearch={() => {
                    setSelectedMedicine(null);
                    setActiveTab('search');
                  }}
                  onSelectMedicine={handleSelectMedicine}
                  onOpenGenericBrandsExplorer={handleOpenGenericBrandsExplorer}
                  lang={lang}
                  onToggleLang={toggleLang}
                />

                {/* 2. Price Information (Unit Price + Pack Price Cards) */}
                <PriceSection medicine={selectedMedicine} lang={lang} />

                {/* 3. Alternative Brands Comparison */}
                <AlternativeBrands
                  medicine={selectedMedicine}
                  onSelectMedicine={handleSelectMedicine}
                />

                {/* 4. Clinical Monograph Accordions */}
                <ClinicalMonographAccordions
                  monograph={selectedMedicine.monograph}
                  lang={lang}
                  onToggleLang={toggleLang}
                />
              </div>

              {/* Secondary Sidebar Column (lg:col-span-4) - PC & Tablet */}
              <div className="lg:col-span-4 space-y-3 sm:space-y-4 lg:sticky lg:top-24">
                {/* Chemical Structure (2D Diagram + Formula Grid) */}
                <ChemicalStructure
                  genericName={selectedMedicine.genericName}
                  lang={lang}
                />

                {/* Verified Clinical Quick Info Card */}
                <div className="bg-white dark:bg-[#131B2E] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-slate-100">
                    <ShieldCheck className="w-4 h-4 text-[#14967F]" />
                    <span>Clinical Verification Summary</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    Active ingredient: <span className="font-bold text-slate-800 dark:text-slate-200">{selectedMedicine.genericName}</span> ({selectedMedicine.strength}). Manufactured by <span className="font-bold text-slate-800 dark:text-slate-200">{selectedMedicine.company}</span>.
                  </p>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>Form: {selectedMedicine.form}</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">MRP: ৳{selectedMedicine.mrp.toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        ) : activeTab === 'home' ? (
          /* VIEW 2: HOME LANDING PAGE */
          <div className="space-y-8 animate-in fade-in duration-200">
            <HomeLanding
              onGoToSearch={handleGoToSearch}
              onSelectMedicine={handleSelectMedicine}
              lang={lang}
            />
          </div>
        ) : (
          /* VIEW 3: MEDICINE INDEX SEARCH & FILTER GRID PAGE */
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
            
            {/* Alphabet Quick Filter */}
            <AlphabetFilter
              selectedLetter={selectedLetter}
              onSelectLetter={(letter) => {
                setSelectedLetter(letter);
                setCurrentPage(1);
                if (selectedMedicine) setSelectedMedicine(null);
              }}
            />

            {/* Responsive Grid Layout for PC Desktop & Tablet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Desktop Sticky Filter Sidebar (lg:col-span-3 - Hidden on Mobile, visible on PC lg:) */}
              <div className="hidden lg:block lg:col-span-3 space-y-4 sticky top-24">
                <div className="bg-white dark:bg-[#131B2E] p-4.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-[#14967F]" />
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Filter Index</h3>
                    </div>
                    {activeFilterCount > 0 && (
                      <span className="bg-[#14967F] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {activeFilterCount} Active
                      </span>
                    )}
                  </div>

                  <FilterPanel
                    filters={filters}
                    onChangeFilters={(f) => {
                      setFilters(f);
                      setCurrentPage(1);
                    }}
                    onResetFilters={resetFilters}
                  />
                </div>
              </div>

              {/* Main Results Column (lg:col-span-9) */}
              <div className="lg:col-span-9 space-y-4">

                {/* Results Counter & Filter Status Bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap bg-white dark:bg-[#152232] p-3.5 sm:p-4 rounded-2xl border border-[#CCECEE] dark:border-[#243B53] transition-colors shadow-xs">
                  <div>
                    <h1 className="text-base sm:text-lg font-bold text-[#095D7E] dark:text-slate-100 flex items-center gap-2 flex-wrap">
                      <Pill className="w-5 h-5 text-[#14967F] dark:text-[#2DD4BF]" />
                      <span>{lang === 'en' ? 'Database Search Results' : 'ডাটাবেজ ফলাফল'}</span>
                      <span className="bg-[#E2FCD6] dark:bg-[#064E3B] text-[#0D6F5D] dark:text-[#6EE7B7] text-xs font-black px-3 py-0.5 rounded-full border border-[#14967F]/30">
                        {searchResults.total.toLocaleString()} {lang === 'en' ? 'Medicines Found' : 'টি ওষুধ পাওয়া গেছে'}
                      </span>
                    </h1>
                    
                    {/* Active Filter Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <p className="text-xs text-[#095D7E]/70 dark:text-slate-400">
                        Showing page {searchResults.page} of {searchResults.totalPages} {selectedLetter !== 'All' ? `• Letter "${selectedLetter}"` : ''} {searchQuery ? `• Query "${searchQuery}"` : ''}
                      </p>

                      {filters.dosageForm !== 'All' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold px-2.5 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-700">
                          <span>Form: {filters.dosageForm}</span>
                          <button
                            onClick={() => setFilters((p) => ({ ...p, dosageForm: 'All' }))}
                            className="hover:text-rose-500 cursor-pointer ml-0.5"
                            title="Clear Dosage Form filter"
                          >
                            ✕
                          </button>
                        </span>
                      )}

                      {filters.category !== 'All' && (
                        <span className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 text-xs font-extrabold px-2.5 py-0.5 rounded-lg border border-indigo-300 dark:border-indigo-700">
                          <span>Condition: {filters.category}</span>
                          <button
                            onClick={() => setFilters((p) => ({ ...p, category: 'All' }))}
                            className="hover:text-rose-500 cursor-pointer ml-0.5"
                            title="Clear Condition filter"
                          >
                            ✕
                          </button>
                        </span>
                      )}

                      {filters.manufacturer !== 'All' && (
                        <span className="inline-flex items-center gap-1 bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 text-xs font-extrabold px-2.5 py-0.5 rounded-lg border border-sky-300 dark:border-sky-700">
                          <span>Company: {filters.manufacturer}</span>
                          <button
                            onClick={() => setFilters((p) => ({ ...p, manufacturer: 'All' }))}
                            className="hover:text-rose-500 cursor-pointer ml-0.5"
                            title="Clear Manufacturer filter"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                    </div>
                  </div>

                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      id="reset-search-filters-btn"
                      className="text-xs font-bold text-[#14967F] dark:text-[#2DD4BF] hover:text-[#0D6F5D] flex items-center gap-1 bg-[#F1F9FF] dark:bg-[#1A2B3E] px-3 py-1.5 rounded-xl border border-[#CCECEE] dark:border-[#243B53] transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear All Filters</span>
                    </button>
                  )}
                </div>

                {/* Medicine Cards Grid (1 col mobile, 2 col tablet md, 3 col pc lg/xl) */}
                {searchResults.items.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3.5 sm:gap-4">
                      {searchResults.items.map((med) => (
                        <MedicineCard
                          key={med.id}
                          medicine={med}
                          onSelect={handleSelectMedicine}
                        />
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {searchResults.totalPages > 1 && (
                      <div className="flex items-center justify-between bg-white dark:bg-[#152232] p-4 rounded-2xl border border-[#CCECEE] dark:border-[#243B53] mt-6 shadow-xs">
                        <button
                          disabled={currentPage <= 1}
                          onClick={() => {
                            setCurrentPage((p) => Math.max(1, p - 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-[#095D7E] dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed bg-[#F1F9FF] dark:bg-[#1A2B3E] px-4 py-2 rounded-xl border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Previous Page</span>
                        </button>

                        <div className="text-xs font-bold text-[#095D7E] dark:text-slate-200">
                          Page <span className="text-[#14967F] dark:text-[#2DD4BF] font-black">{currentPage}</span> of {searchResults.totalPages}
                        </div>

                        <button
                          disabled={currentPage >= searchResults.totalPages}
                          onClick={() => {
                            setCurrentPage((p) => Math.min(searchResults.totalPages, p + 1));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-[#095D7E] dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed bg-[#F1F9FF] dark:bg-[#1A2B3E] px-4 py-2 rounded-xl border border-[#CCECEE] dark:border-[#243B53] hover:border-[#14967F] cursor-pointer"
                        >
                          <span>Next Page</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Empty Search State */
                  <div className="bg-white dark:bg-[#152232] rounded-2xl border border-[#CCECEE] dark:border-[#243B53] p-8 sm:p-12 text-center space-y-4 max-w-lg mx-auto my-6 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-[#F1F9FF] dark:bg-[#1A2B3E] text-[#14967F] dark:text-[#2DD4BF] flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-extrabold text-[#095D7E] dark:text-slate-100">No medicines found</h3>
                      <p className="text-xs sm:text-sm text-[#095D7E]/80 dark:text-slate-400">
                        Try searching by brand name (e.g., "Napa", "Seclo", "Maxpro") or generic ingredient (e.g., "Esomeprazole", "Paracetamol").
                      </p>
                    </div>

                    <div className="pt-2 flex justify-center gap-3">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedLetter('All');
                          resetFilters();
                        }}
                        id="clear-search-empty-state-btn"
                        className="bg-[#14967F] text-[#E2FCD6] font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-[#11806C] transition-colors cursor-pointer"
                      >
                        Reset Search & Filters
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

        {/* Global Footer (Rendered on ALL Pages) */}
        <MedicalDisclaimer onOpenApiDocs={() => handleNavigatePage('/api-docs')} />

      </main>

      {/* Persistent Floating Language Switcher Pill (Always Floating Right Above Bottom Nav on All Tabs) */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <button
          onClick={toggleLang}
          id="persistent-floating-lang-toggle"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#095D7E] dark:bg-[#14967F] text-white text-xs font-black shadow-2xl border-2 border-white dark:border-slate-800 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Languages className="w-4 h-4 text-[#E2FCD6]" />
          <span>{lang === 'en' ? 'বাংলায় দেখুন' : 'View in English'}</span>
        </button>
      </div>

      {/* Floating Bottom Utility Bar */}
      <BottomNav
        currentView={selectedMedicine ? 'details' : activeTab}
        onGoHome={handleGoHome}
        onGoSearch={() => handleGoToSearch()}
        onOpenFilters={() => setIsFiltersOpen(true)}
        lang={lang}
      />

      {/* Drawers */}
      <FilterDrawer
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        filters={filters}
        onChangeFilters={(f) => {
          setFilters(f);
          setCurrentPage(1);
        }}
        onResetFilters={resetFilters}
      />

      <SidebarDrawer
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenFilters={() => setIsFiltersOpen(true)}
        lang={lang}
        onToggleLang={toggleLang}
        onNavigate={handleNavigatePage}
      />

    </div>
  );
}
