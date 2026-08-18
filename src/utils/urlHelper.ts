import { Medicine, GenericMonograph } from '../types';

export const SITE_BASE_URL = 'https://medvhai.heliox.workers.dev';

/**
 * Enterprise Unicode & Case-Safe Slugifier
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]+/gu, '') // Keep letters, numbers, spaces, hyphens in any script (including Bengali)
    .replace(/\s+/g, '-')              // Replace spaces with hyphens
    .replace(/-+/g, '-')               // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '')                // Trim leading hyphens
    .replace(/-+$/, '');               // Trim trailing hyphens
}

/**
 * Mathematical Bijective ID Obfuscation (Zero-collision 4-character alphanumeric hash)
 * Maps any integer 1 <= ID < 1,679,616 to a unique 4-character Base36 code
 */
const OBFUSCATION_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const OBFUSCATION_BASE = 36;
const OBFUSCATION_M = 1679616; // 36^4
const OBFUSCATION_A = 387421;  // Coprime to 36
const OBFUSCATION_A_INV = 1197301; // Modular multiplicative inverse of A mod M
const OBFUSCATION_B = 41725;

export function encodeId(id: number): string {
  if (!id || id <= 0 || isNaN(id)) return '';
  const x = Number((BigInt(id) * BigInt(OBFUSCATION_A) + BigInt(OBFUSCATION_B)) % BigInt(OBFUSCATION_M));
  let str = '';
  let n = x;
  for (let i = 0; i < 4; i++) {
    str = OBFUSCATION_ALPHABET[n % OBFUSCATION_BASE] + str;
    n = Math.floor(n / OBFUSCATION_BASE);
  }
  return str;
}

export function decodeId(code: string): number | null {
  if (!code || typeof code !== 'string') return null;
  const clean = code.toLowerCase().trim();
  if (clean.length !== 4) return null;
  let x = 0;
  for (let i = 0; i < 4; i++) {
    const idx = OBFUSCATION_ALPHABET.indexOf(clean[i]);
    if (idx === -1) return null;
    x = x * OBFUSCATION_BASE + idx;
  }
  const id = Number(((BigInt(x) - BigInt(OBFUSCATION_B) + BigInt(OBFUSCATION_M)) * BigInt(OBFUSCATION_A_INV)) % BigInt(OBFUSCATION_M));
  return (id > 0 && !isNaN(id)) ? id : null;
}

/**
 * Canonical Medicine Slug Generator (Collision-safe with stable trailing 4-char code)
 * e.g., "brinzopt-1-ophthalmic-suspension-o2e1"
 */
export function getMedicineCanonicalSlug(medicine: { id: number; name: string; strength?: string; form: string }): string {
  const parts = [slugify(medicine.name)];
  if (medicine.strength) {
    const cleanStrength = slugify(medicine.strength);
    if (cleanStrength) parts.push(cleanStrength);
  }
  if (medicine.form) {
    const cleanForm = slugify(medicine.form);
    if (cleanForm) parts.push(cleanForm);
  }
  const baseSlug = parts.filter(Boolean).join('-');
  const code = encodeId(medicine.id);
  return `${baseSlug}-${code}`;
}

/**
 * Canonical Medicine Path
 * e.g., "/medicine/brinzopt-1-ophthalmic-suspension-o2e1"
 */
export function getMedicineCanonicalPath(medicine: { id: number; name: string; strength?: string; form: string }): string {
  return `/medicine/${getMedicineCanonicalSlug(medicine)}`;
}

export const buildMedicinePath = getMedicineCanonicalPath;

/**
 * Canonical Absolute Medicine URL
 * e.g., "https://medvhai.heliox.workers.dev/medicine/brinzopt-1-ophthalmic-suspension-o2e1"
 */
export function getMedicineCanonicalUrl(medicine: { id: number; name: string; strength?: string; form: string }): string {
  return `${SITE_BASE_URL}${getMedicineCanonicalPath(medicine)}`;
}

export const getMedicineUrl = getMedicineCanonicalUrl;

/**
 * Canonical Generic Slug Generator (Collision-safe with stable trailing 4-char code)
 * e.g., "paracetamol-k9p3"
 */
export function getGenericCanonicalSlug(generic: { id: number; name: string }): string {
  const baseSlug = slugify(generic.name) || 'generic';
  const code = encodeId(generic.id);
  return `${baseSlug}-${code}`;
}

/**
 * Canonical Generic Path
 * e.g., "/generic/paracetamol-k9p3"
 */
export function getGenericCanonicalPath(generic: { id: number; name: string }): string {
  return `/generic/${getGenericCanonicalSlug(generic)}`;
}

/**
 * Canonical Absolute Generic URL
 * e.g., "https://medvhai.heliox.workers.dev/generic/paracetamol-k9p3"
 */
export function getGenericCanonicalUrl(generic: { id: number; name: string }): string {
  return `${SITE_BASE_URL}${getGenericCanonicalPath(generic)}`;
}

/**
 * Canonical Dosage Form Path
 * e.g., "/dosage-form/tablet"
 */
export function getDosageFormCanonicalPath(form: string): string {
  return `/dosage-form/${slugify(form)}`;
}

/**
 * Canonical Company Path
 * e.g., "/company/square-pharmaceuticals-plc"
 */
export function getCompanyCanonicalPath(company: string): string {
  return `/company/${slugify(company)}`;
}

/**
 * Robust ID extractor from medicine slug or pathname
 * Supports both new 4-char obfuscated codes (e.g. "-o2e1") and legacy numeric IDs (e.g. "-3276")
 */
export function parseMedicineIdFromSlug(slugOrPath: string): number | null {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/medicine\//, '').replace(/\/$/, '');
  
  // 1. Try extracting trailing 4-char alphanumeric code
  const codeMatch = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  if (codeMatch) {
    const decoded = decodeId(codeMatch[1]);
    if (decoded) return decoded;
  }

  // 2. Fallback: Try extracting legacy raw numeric ID
  const numMatch = clean.match(/-(\d+)$/) || clean.match(/^(\d+)$/);
  if (numMatch) {
    const id = parseInt(numMatch[1], 10);
    return isNaN(id) ? null : id;
  }
  return null;
}

/**
 * Robust ID extractor from generic slug or pathname
 * Supports both new 4-char obfuscated codes (e.g. "-k9p3") and legacy numeric IDs (e.g. "-1124")
 */
export function parseGenericIdFromSlug(slugOrPath: string): number | null {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/generic\//, '').replace(/\/$/, '');
  
  // 1. Try extracting trailing 4-char alphanumeric code
  const codeMatch = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  if (codeMatch) {
    const decoded = decodeId(codeMatch[1]);
    if (decoded) return decoded;
  }

  // 2. Fallback: Try extracting legacy raw numeric ID
  const numMatch = clean.match(/-(\d+)$/) || clean.match(/^(\d+)$/);
  if (numMatch) {
    const id = parseInt(numMatch[1], 10);
    return isNaN(id) ? null : id;
  }
  return null;
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  h1: string;
  og: {
    title: string;
    description: string;
    url: string;
    image: string;
    type: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  jsonLd: Record<string, any>;
  robots: string;
}

/**
 * Authoritative Central Metadata Factory for Medicines
 */
export function generateMedicineMetadata(medicine: Medicine, generic?: GenericMonograph | null): SEOMetadata {
  const brandName = medicine.name;
  const strength = medicine.strength || '';
  const form = medicine.form || 'Medicine';
  const company = medicine.company || 'Pharmaceuticals';
  const genericName = medicine.genericName || 'Active Ingredient';
  const genericBn = medicine.genericNameBn ? ` (${medicine.genericNameBn})` : '';
  const priceFormatted = medicine.mrp > 0 ? `৳${medicine.mrp.toFixed(2)}` : 'MRP N/A';

  const title = `${brandName} ${strength} ${form} — Uses, Price, Dosage & Alternatives | MedVhai`.replace(/\s+/g, ' ');
  const description = `Learn about ${brandName} ${strength} ${form} by ${company}. Generic: ${genericName}${genericBn}. MRP Price: ${priceFormatted} BDT. View dosage, indications, side effects, precautions & lower-cost alternative brands on MedVhai.`.replace(/\s+/g, ' ');
  const keywords = `${brandName}, ${genericName}, ${company}, ${brandName} price in BD, ${brandName} dosage, ${brandName} uses, ${form}, medicine BD, MedVhai`;
  const canonicalUrl = getMedicineCanonicalUrl(medicine);
  const h1 = `${brandName} ${strength} ${form}`.trim();
  const imageUrl = `${SITE_BASE_URL}/icons/${slugify(form)}.png`;
  const logoUrl = `${SITE_BASE_URL}/logo.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Drug', 'Product'],
    'name': h1,
    'image': [imageUrl, logoUrl],
    'description': description,
    'url': canonicalUrl,
    'sku': `MEDVHAI-${medicine.id}`,
    'mpn': `MED-${medicine.id}`,
    'brand': {
      '@type': 'Brand',
      'name': company
    },
    'dosageForm': form,
    'strengthValue': strength || 'N/A',
    'activeIngredient': genericName,
    'manufacturer': {
      '@type': 'Organization',
      'name': company
    },
    'offers': {
      '@type': 'Offer',
      'url': canonicalUrl,
      'priceCurrency': 'BDT',
      'price': medicine.mrp > 0 ? medicine.mrp.toFixed(2) : '0.00',
      'priceValidUntil': '2027-12-31',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'MedVhai'
      },
      'hasMerchantReturnPolicy': {
        '@type': 'MerchantReturnPolicy',
        'applicableCountry': 'BD',
        'returnPolicyCategory': 'https://schema.org/MerchantReturnNotPermitted'
      },
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': '0',
          'currency': 'BDT'
        },
        'shippingDestination': [
          {
            '@type': 'DefinedRegion',
            'addressCountry': 'BD'
          }
        ]
      }
    }
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    h1,
    og: {
      title,
      description,
      url: canonicalUrl,
      image: logoUrl,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: logoUrl
    },
    jsonLd,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  };
}

/**
 * Authoritative Central Metadata Factory for Generics
 */
export function generateGenericMetadata(generic: GenericMonograph): SEOMetadata {
  const genName = generic.name;
  const genBn = generic.nameBn ? ` (${generic.nameBn})` : '';
  const canonicalUrl = getGenericCanonicalUrl(generic);
  const title = `${genName} Brands in Bangladesh — Price List, Dosage & Monograph | MedVhai`;
  const description = `Complete clinical monograph for ${genName}${genBn} in Bangladesh. Compare brand medicines, BDT prices, indications, contraindications, dosage, and side effects.`;
  const keywords = `${genName}, ${genName} brands BD, ${genName} price, ${genName} side effects, ${genName} dosage, MedVhai`;
  const logoUrl = `${SITE_BASE_URL}/logo.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalEntity',
    'name': genName,
    'description': description,
    'url': canonicalUrl,
    'code': {
      '@type': 'MedicalCode',
      'code': generic.id.toString(),
      'codingSystem': 'MedVhai-Generic-Index'
    }
  };

  return {
    title,
    description,
    keywords,
    canonicalUrl,
    h1: `${genName} Clinical Monograph & Brands`,
    og: {
      title,
      description,
      url: canonicalUrl,
      image: logoUrl,
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: logoUrl
    },
    jsonLd,
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  };
}

/**
 * Authoritative Central Metadata Factory for Homepage & Category Routes
 */
export function generateDefaultMetadata(categoryName?: string, dosageForm?: string, manufacturer?: string, letter?: string, searchQuery?: string): SEOMetadata {
  const logoUrl = `${SITE_BASE_URL}/logo.png`;

  if (dosageForm && dosageForm !== 'All') {
    const title = `${dosageForm} Medicines in Bangladesh — Price List & Directory | MedVhai`;
    const description = `Browse all verified ${dosageForm} dosage form medicines in Bangladesh. Check BDT MRP prices, manufacturers, active ingredients, and brand alternatives.`;
    const canonicalUrl = `${SITE_BASE_URL}${getDosageFormCanonicalPath(dosageForm)}`;
    return {
      title,
      description,
      keywords: `${dosageForm} medicines BD, ${dosageForm} list Bangladesh, ${dosageForm} prices, MedVhai`,
      canonicalUrl,
      h1: `${dosageForm} Medicines in Bangladesh`,
      og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
      twitter: { card: 'summary_large_image', title, description, image: logoUrl },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        'name': title,
        'description': description,
        'url': canonicalUrl
      },
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    };
  }

  if (manufacturer && manufacturer !== 'All') {
    const title = `${manufacturer} Medicines List & MRP Prices in BD | MedVhai`;
    const description = `Explore all pharmaceutical brands manufactured by ${manufacturer} in Bangladesh. View active ingredients, dosage forms, verified MRP prices, and monographs.`;
    const canonicalUrl = `${SITE_BASE_URL}${getCompanyCanonicalPath(manufacturer)}`;
    return {
      title,
      description,
      keywords: `${manufacturer} medicine list, ${manufacturer} products, ${manufacturer} pharma BD price, MedVhai`,
      canonicalUrl,
      h1: `${manufacturer} Medicine Directory`,
      og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
      twitter: { card: 'summary_large_image', title, description, image: logoUrl },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'MedicalWebPage',
        'name': title,
        'description': description,
        'url': canonicalUrl
      },
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    };
  }

  if (searchQuery) {
    const title = `Search Results for "${searchQuery}" — Medicine Price & Index | MedVhai`;
    const description = `Search results for ${searchQuery} on MedVhai. Find brand medicines, active generic ingredients, BDT MRP prices, and lower-cost alternatives.`;
    const canonicalUrl = `${SITE_BASE_URL}/`;
    return {
      title,
      description,
      keywords: `${searchQuery}, medicine search, MedVhai`,
      canonicalUrl,
      h1: `Search: ${searchQuery}`,
      og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
      twitter: { card: 'summary_large_image', title, description, image: logoUrl },
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'SearchResultsPage',
        'name': title,
        'url': `${SITE_BASE_URL}/?q=${encodeURIComponent(searchQuery)}`
      },
      robots: 'noindex, follow' // User search queries should not pollute index with thin search results
    };
  }

  // Core Homepage
  const title = 'MedVhai™ — Clinical Drug Index & Medicine Price BD';
  const description = "Bangladesh's clinical drug index & medicine price guide. Search 30,000+ brand medicines, generic ingredients, BDT MRP prices & alternatives.";
  const canonicalUrl = `${SITE_BASE_URL}/`;

  return {
    title,
    description,
    keywords: 'MedVhai, Medicine Index, Drug Price BD, Generic Medicine BD, Napa, Seclo, Maxpro, Paracetamol, Esomeprazole, Beximco, Square Pharma, Incepta',
    canonicalUrl,
    h1: 'MedVhai™ Clinical Drug Index & Medicine Price BD',
    og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
    twitter: { card: 'summary_large_image', title, description, image: logoUrl },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'MedVhai',
      'alternateName': ['MedVhai BD', 'MedVhai Health Index', 'MedVhai Clinical Index'],
      'url': canonicalUrl,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${SITE_BASE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  };
}
