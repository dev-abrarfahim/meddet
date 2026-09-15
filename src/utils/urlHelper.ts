import { Medicine, GenericMonograph } from '../types';

export const SITE_BASE_URL = 'https://meddet.site';

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
 * e.g., "https://meddet.site/medicine/brinzopt-1-ophthalmic-suspension-o2e1"
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
 * e.g., "https://meddet.site/generic/paracetamol-k9p3"
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
 * Clean 4-character Code ID extractor from medicine slug or pathname
 * e.g., "/medicine/brinzopt-1-ophthalmic-suspension-o2e1" -> 3276
 */
export function parseMedicineIdFromSlug(slugOrPath: string): number | null {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/medicine\//, '').replace(/\/$/, '');
  const match = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  return match ? decodeId(match[1]) : null;
}

/**
 * Clean 4-character Code ID extractor from generic slug or pathname
 * e.g., "/generic/paracetamol-k9p3" -> 1124
 */
export function parseGenericIdFromSlug(slugOrPath: string): number | null {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/generic\//, '').replace(/\/$/, '');
  const match = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  return match ? decodeId(match[1]) : null;
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

  const title = `${brandName} ${strength} ${form} — Uses, Price, Dosage & Alternatives | MEDDET`.replace(/\s+/g, ' ');
  const description = `Learn about ${brandName} ${strength} ${form} by ${company}. Generic: ${genericName}${genericBn}. MRP Price: ${priceFormatted} BDT. View dosage, indications, side effects, precautions & lower-cost alternative brands on MEDDET.`.replace(/\s+/g, ' ');
  const keywords = `${brandName}, ${genericName}, ${company}, ${brandName} price in BD, ${brandName} dosage, ${brandName} uses, ${form}, medicine BD, MEDDET`;
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
    'sku': `MEDDET-${medicine.id}`,
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
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.5',
      'bestRating': '5',
      'worstRating': '1',
      'ratingCount': '1',
      'reviewCount': '1'
    },
    'review': {
      '@type': 'Review',
      'reviewRating': {
        '@type': 'Rating',
        'ratingValue': '4.5',
        'bestRating': '5',
        'worstRating': '1'
      },
      'author': {
        '@type': 'Organization',
        'name': 'MEDDET Clinical Index'
      },
      'reviewBody': `${brandName} ${strength} ${form} manufactured by ${company}. Contains ${genericName}. DGDA verified clinical drug index entry.`,
      'datePublished': '2025-01-01'
    },
    'offers': {
      '@type': 'Offer',
      'url': canonicalUrl,
      'priceCurrency': 'BDT',
      'price': medicine.mrp > 0 ? medicine.mrp.toFixed(2) : '0.00',
      'priceValidUntil': '2027-12-31',
      'validFrom': '2025-01-01',
      'itemCondition': 'https://schema.org/NewCondition',
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'MEDDET'
      },
      'hasMerchantReturnPolicy': {
        '@type': 'MerchantReturnPolicy',
        'applicableCountry': 'BD',
        'returnPolicyCategory': 'https://schema.org/MerchantReturnNotPermitted',
        'merchantReturnDays': 0
      },
      'shippingDetails': {
        '@type': 'OfferShippingDetails',
        'shippingDestination': {
          '@type': 'DefinedRegion',
          'addressCountry': 'BD'
        },
        'deliveryTime': {
          '@type': 'ShippingDeliveryTime',
          'handlingTime': {
            '@type': 'QuantitativeValue',
            'minValue': 0,
            'maxValue': 1,
            'unitCode': 'DAY'
          },
          'transitTime': {
            '@type': 'QuantitativeValue',
            'minValue': 1,
            'maxValue': 3,
            'unitCode': 'DAY'
          }
        },
        'shippingRate': {
          '@type': 'MonetaryAmount',
          'value': '0',
          'currency': 'BDT'
        }
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
  const title = `${genName} Brands in Bangladesh — Price List, Dosage & Monograph | MEDDET`;
  const description = `Complete clinical monograph for ${genName}${genBn} in Bangladesh. Compare brand medicines, BDT prices, indications, contraindications, dosage, and side effects.`;
  const keywords = `${genName}, ${genName} brands BD, ${genName} price, ${genName} side effects, ${genName} dosage, MEDDET`;
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
      'codingSystem': 'MEDDET-Generic-Index'
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
    const title = `${dosageForm} Medicines in Bangladesh — Price List & Directory | MEDDET`;
    const description = `Browse all verified ${dosageForm} dosage form medicines in Bangladesh. Check BDT MRP prices, manufacturers, active ingredients, and brand alternatives.`;
    const canonicalUrl = `${SITE_BASE_URL}${getDosageFormCanonicalPath(dosageForm)}`;
    return {
      title,
      description,
      keywords: `${dosageForm} medicines BD, ${dosageForm} list Bangladesh, ${dosageForm} prices, MEDDET`,
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
    const title = `${manufacturer} Medicines List & MRP Prices in BD | MEDDET`;
    const description = `Explore all pharmaceutical brands manufactured by ${manufacturer} in Bangladesh. View active ingredients, dosage forms, verified MRP prices, and monographs.`;
    const canonicalUrl = `${SITE_BASE_URL}${getCompanyCanonicalPath(manufacturer)}`;
    return {
      title,
      description,
      keywords: `${manufacturer} medicine list, ${manufacturer} products, ${manufacturer} pharma BD price, MEDDET`,
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
    const title = `Search Results for "${searchQuery}" — Medicine Price & Index | MEDDET`;
    const description = `Search results for ${searchQuery} on MEDDET. Find brand medicines, active generic ingredients, BDT MRP prices, and lower-cost alternatives.`;
    const canonicalUrl = `${SITE_BASE_URL}/`;
    return {
      title,
      description,
      keywords: `${searchQuery}, medicine search, MEDDET`,
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
  const title = 'MEDDET™ — Clinical Drug Index & Medicine Price BD';
  const description = "Bangladesh's clinical drug index & medicine price guide. Search 30,000+ brand medicines, generic ingredients, BDT MRP prices & alternatives.";
  const canonicalUrl = `${SITE_BASE_URL}/`;

  return {
    title,
    description,
    keywords: 'MEDDET, Medicine Index, Drug Price BD, Generic Medicine BD, Napa, Seclo, Maxpro, Paracetamol, Esomeprazole, Beximco, Square Pharma, Incepta',
    canonicalUrl,
    h1: 'MEDDET™ Clinical Drug Index & Medicine Price BD',
    og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
    twitter: { card: 'summary_large_image', title, description, image: logoUrl },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'MEDDET',
      'alternateName': ['MEDDET BD', 'MEDDET Health Index', 'MEDDET Clinical Index'],
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

/**
 * Authoritative Metadata Factory for Standalone Static Content Pages
 */
export function generateStaticPageMetadata(pageType: 'about' | 'privacy' | 'terms' | 'contact' | 'companies' | 'api-docs' | 'tools' | 'bmi-calculator'): SEOMetadata {
  const logoUrl = `${SITE_BASE_URL}/logo.webp`;

  switch (pageType) {
    case 'tools': {
      const title = 'Medical Tools & Clinical Calculators | MEDDET™';
      const description = 'Free clinical healthcare calculators for medical professionals and patients. Calculate BMI, body morphology, and health metrics.';
      const canonicalUrl = `${SITE_BASE_URL}/tools`;
      return {
        title,
        description,
        keywords: 'Medical tools BD, BMI calculator, clinical calculators Bangladesh, health tools, MEDDET',
        canonicalUrl,
        h1: 'Medical Tools & Clinical Calculators',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'CollectionPage',
              name: title,
              description,
              url: canonicalUrl,
              inLanguage: ['en', 'bn'],
              isPartOf: {
                '@type': 'WebSite',
                name: 'MEDDET',
                url: SITE_BASE_URL
              }
            },
            {
              '@type': 'ItemList',
              name: 'Available Medical & Clinical Tools',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Medical BMI Calculator',
                  url: `${SITE_BASE_URL}/tools/bmi-calculator`
                }
              ]
            }
          ]
        },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
    case 'bmi-calculator': {
      const title = 'Medical BMI Calculator — WHO Clinical Standards | MEDDET™';
      const description = 'Accurate clinical Body Mass Index (BMI) calculator. Calculate healthy weight ranges, body morphology scan, and personalized diet & lifestyle guidance.';
      const canonicalUrl = `${SITE_BASE_URL}/tools/bmi-calculator`;
      return {
        title,
        description,
        keywords: 'BMI calculator BD, body mass index, WHO BMI ranges, weight loss calculator, MEDDET BMI, বিএমআই ক্যালকুলেটর',
        canonicalUrl,
        h1: 'Medical BMI Calculator',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'WebApplication',
              name: 'MEDDET Medical BMI Calculator',
              url: canonicalUrl,
              applicationCategory: 'HealthApplication',
              operatingSystem: 'All',
              browserRequirements: 'Requires JavaScript. Requires HTML5.',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'BDT'
              },
              featureList: [
                'WHO & CDC standard 5-tier classification',
                'Calibrated radial dial gauge',
                'Gender-specific anatomical morphology silhouettes',
                'Metric (cm/kg) and Imperial (ft/lbs) parity',
                'Clinical diet and lifestyle suggestions',
                'English and Bengali bilingual interface'
              ]
            },
            {
              '@type': 'MedicalWebPage',
              name: title,
              description,
              url: canonicalUrl,
              aspect: ['Diagnosis', 'RiskFactors', 'Treatment'],
              about: {
                '@type': 'MedicalCondition',
                name: 'Body Mass Index & Obesity'
              }
            },
            {
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What is a healthy BMI for adults according to WHO?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'According to the World Health Organization (WHO), a healthy adult Body Mass Index (BMI) is between 18.5 and 24.9 kg/m² for both men and women.'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'How do you calculate Body Mass Index (BMI)?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'In the metric system, BMI is calculated as weight in kilograms divided by height in meters squared (kg/m²). In the US imperial system, it is calculated as 703 × [weight (lbs) / height (in)²].'
                  }
                },
                {
                  '@type': 'Question',
                  name: 'What health risks are associated with a high BMI?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'A high BMI (overweight or obese) significantly increases the risks of hypertension, type 2 diabetes, coronary heart disease, stroke, sleep apnea, osteoarthritis, and several malignancies.'
                  }
                }
              ]
            }
          ]
        },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
    case 'about': {
      const title = 'About MEDDET™ — Clinical Drug Index & Medicine Guide BD';
      const description = 'Learn about MEDDET, Bangladesh’s verified clinical medicine index, BDT pharmaceutical price comparator, and bilingual drug monographs.';
      const canonicalUrl = `${SITE_BASE_URL}/about`;
      return {
        title,
        description,
        keywords: 'About MEDDET, Medicine index BD mission, Clinical drug index Bangladesh, MEDDET',
        canonicalUrl,
        h1: 'About MEDDET™ Clinical Index',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: { '@context': 'https://schema.org', '@type': 'AboutPage', name: title, description, url: canonicalUrl },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
    case 'privacy': {
      const title = 'Privacy Policy — MEDDET™ Clinical Healthcare Index';
      const description = 'Our commitment to zero medical health data tracking, client-side local storage protection, and patient confidentiality on MEDDET.';
      const canonicalUrl = `${SITE_BASE_URL}/privacy-policy`;
      return {
        title,
        description,
        keywords: 'MEDDET privacy policy, health data privacy Bangladesh, zero medical tracking',
        canonicalUrl,
        h1: 'Privacy Policy',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonicalUrl },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
    case 'terms': {
      const title = 'Terms & Conditions & Medical Disclaimer | MEDDET™';
      const description = 'Educational clinical reference guidelines, medical disclaimer, and prescribing practitioner terms for MEDDET.';
      const canonicalUrl = `${SITE_BASE_URL}/terms`;
      return {
        title,
        description,
        keywords: 'MEDDET terms and conditions, medical disclaimer BD, clinical reference terms',
        canonicalUrl,
        h1: 'Terms & Conditions',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: canonicalUrl },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
    case 'contact': {
      const title = 'Contact Us — Support & Medicine Corrections | MEDDET™';
      const description = 'Get in touch with the MEDDET clinical indexing team for medicine price corrections, new presentations, and developer queries.';
      const canonicalUrl = `${SITE_BASE_URL}/contact`;
      return {
        title,
        description,
        keywords: 'Contact MEDDET, medicine correction request, support MEDDET BD',
        canonicalUrl,
        h1: 'Contact MEDDET™',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: { '@context': 'https://schema.org', '@type': 'ContactPage', name: title, description, url: canonicalUrl },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
    case 'companies': {
      const title = 'Pharmaceutical Companies in Bangladesh (723 Manufacturers) | MEDDET';
      const description = 'Complete directory of all 723 licensed pharmaceutical companies in Bangladesh. Browse brand medicine portfolios, dosages, and prices.';
      const canonicalUrl = `${SITE_BASE_URL}/companies`;
      return {
        title,
        description,
        keywords: 'Pharmaceutical companies Bangladesh, Square Pharma, Beximco, Incepta, Renata, medicine manufacturers BD',
        canonicalUrl,
        h1: 'Pharmaceutical Companies in Bangladesh',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, description, url: canonicalUrl },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
    case 'api-docs': {
      const title = 'Developer REST API Documentation & Live Studio | MEDDET™';
      const description = 'Free open REST API endpoints for searching 30,500+ medicines, generics, active ingredients, and BDT MRP prices.';
      const canonicalUrl = `${SITE_BASE_URL}/api-docs`;
      return {
        title,
        description,
        keywords: 'MEDDET API, medicine REST API Bangladesh, drug database API BD, drug price API',
        canonicalUrl,
        h1: 'Developer REST API',
        og: { title, description, url: canonicalUrl, image: logoUrl, type: 'website' },
        twitter: { card: 'summary_large_image', title, description, image: logoUrl },
        jsonLd: { '@context': 'https://schema.org', '@type': 'TechArticle', name: title, description, url: canonicalUrl },
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      };
    }
  }
}
