import { Medicine, GenericMonograph } from '../types';

/**
 * Enterprise Dynamic SEO & OpenGraph Meta Tag Manager for MedVhai
 * Dynamically updates document title, meta descriptions, canonical URLs,
 * OpenGraph / Twitter cards, and Schema.org Medical JSON-LD snippets.
 */

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  medicine?: Medicine | null;
  generic?: GenericMonograph | null;
  categoryName?: string;
  dosageForm?: string;
  manufacturer?: string;
  letter?: string;
  searchQuery?: string;
}

export function updateDynamicSEO(props: SEOProps) {
  const siteName = 'MedVhai';
  const defaultBaseUrl = 'https://medvhai.heliox.workers.dev';

  let pageTitle = 'MedVhai™ - Clinical Drug Index & Medicine Price BD';
  let pageDesc = "Bangladesh's clinical drug index & medicine price guide. Search 30,000+ brand medicines, generic ingredients, BDT MRP prices & alternatives.";
  let pageKeywords = 'MedVhai, Medicine Index, Drug Price BD, Generic Medicine BD, Napa, Seclo, Maxpro, Paracetamol, Esomeprazole, Beximco, Square Pharma, Incepta';
  let pageCanonical = `${defaultBaseUrl}/`;

  // 1. Medicine Details Page SEO
  if (props.medicine) {
    const med = props.medicine;
    pageTitle = `${med.name} ${med.strength || ''} ${med.form} (${med.genericName}) - Price ৳${med.mrp > 0 ? med.mrp.toFixed(2) : 'N/A'} | MedVhai`;
    pageDesc = `${med.name} ${med.strength || ''} ${med.form} by ${med.company}. Generic: ${med.genericName}${med.genericNameBn ? ` (${med.genericNameBn})` : ''}. MRP Price: ৳${med.mrp > 0 ? med.mrp.toFixed(2) : 'N/A'} BDT. View dosage, side effects, indications & lower-cost alternative brands.`;
    pageKeywords = `${med.name}, ${med.genericName}, ${med.company}, ${med.name} price in BD, ${med.name} dosage, ${med.name} side effects, ${med.form}, MedVhai`;
    pageCanonical = `${defaultBaseUrl}/?id=${med.id}`;
  } 
  // 2. Generic Explorer Page SEO
  else if (props.generic) {
    const gen = props.generic;
    pageTitle = `${gen.name} Brands in Bangladesh - Price List, Dosage & Side Effects | MedVhai`;
    pageDesc = `Complete clinical monograph for ${gen.name}${gen.nameBn ? ` (${gen.nameBn})` : ''} in Bangladesh. Compare brand medicines, BDT prices, indications, contraindications, and side effects.`;
    pageKeywords = `${gen.name}, ${gen.name} brands BD, ${gen.name} price, ${gen.name} side effects, ${gen.name} dosage, MedVhai`;
    pageCanonical = `${defaultBaseUrl}/?genericId=${gen.id}`;
  }
  // 3. Dosage Form Filter SEO
  else if (props.dosageForm && props.dosageForm !== 'All') {
    const form = props.dosageForm;
    pageTitle = `${form} Medicines in Bangladesh - Price List, Brands & Directory | MedVhai`;
    pageDesc = `Browse all verified ${form} dosage form medicines in Bangladesh. Check BDT MRP prices, manufacturers, active ingredients, and brand alternatives.`;
    pageKeywords = `${form} medicines BD, ${form} list Bangladesh, ${form} prices, MedVhai`;
    pageCanonical = `${defaultBaseUrl}/?form=${encodeURIComponent(form)}`;
  }
  // 4. Manufacturer Filter SEO
  else if (props.manufacturer && props.manufacturer !== 'All') {
    const comp = props.manufacturer;
    pageTitle = `${comp} Medicines List & MRP Prices in BD | MedVhai`;
    pageDesc = `Explore all pharmaceutical brands manufactured by ${comp} in Bangladesh. View active ingredients, dosage forms, verified MRP prices, and monographs.`;
    pageKeywords = `${comp} medicine list, ${comp} products, ${comp} pharma BD price, MedVhai`;
    pageCanonical = `${defaultBaseUrl}/?manufacturer=${encodeURIComponent(comp)}`;
  }
  // 5. Letter Alphabet Filter SEO
  else if (props.letter && props.letter !== 'All') {
    const letChar = props.letter;
    pageTitle = `Medicines Starting with Letter "${letChar}" - Bangladesh Drug Directory | MedVhai`;
    pageDesc = `Complete list of Bangladeshi medicine brands starting with letter ${letChar}. Search by brand name, check active generic substances and BDT MRP prices.`;
    pageKeywords = `medicines starting with ${letChar}, drugs letter ${letChar} BD, MedVhai`;
    pageCanonical = `${defaultBaseUrl}/?letter=${encodeURIComponent(letChar)}`;
  }
  // 6. Medical Condition / Search Query SEO
  else if (props.categoryName || props.searchQuery) {
    const query = props.categoryName || props.searchQuery;
    pageTitle = `${query} Medicines & Brands in Bangladesh - Price List | MedVhai`;
    pageDesc = `Explore ${query} medicines, brand alternatives, BDT MRP prices, and clinical monograph guidelines on MedVhai Drug Index.`;
    pageKeywords = `${query}, ${query} medicine BD, ${query} price list, MedVhai`;
    pageCanonical = props.searchQuery ? `${defaultBaseUrl}/?q=${encodeURIComponent(props.searchQuery)}` : `${defaultBaseUrl}/?category=${encodeURIComponent(props.categoryName || '')}`;
  }

  // Update Document Title
  document.title = pageTitle;

  // Update Meta Tags Helper
  setMetaTag('name', 'description', pageDesc);
  setMetaTag('name', 'keywords', pageKeywords);
  setMetaTag('property', 'og:title', pageTitle);
  setMetaTag('property', 'og:description', pageDesc);
  setMetaTag('property', 'og:site_name', siteName);
  setMetaTag('property', 'og:url', pageCanonical);
  setMetaTag('property', 'twitter:title', pageTitle);
  setMetaTag('property', 'twitter:description', pageDesc);

  // Update Canonical Link
  let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', pageCanonical);

  // Update Schema.org Structured Data
  updateMedicalSchema(props.medicine, props.generic, pageTitle, pageDesc, pageCanonical);
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function updateMedicalSchema(
  medicine?: Medicine | null,
  generic?: GenericMonograph | null,
  title?: string,
  description?: string,
  url?: string
) {
  let scriptEl = document.querySelector<HTMLScriptElement>('#dynamic-seo-schema');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'dynamic-seo-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  let schemaObj: Record<string, any>;

  if (medicine) {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'Drug',
      'name': medicine.name,
      'description': description,
      'url': url,
      'dosageForm': medicine.form,
      'strengthValue': medicine.strength || 'N/A',
      'activeIngredient': medicine.genericName,
      'manufacturer': {
        '@type': 'Organization',
        'name': medicine.company
      },
      'offers': {
        '@type': 'Offer',
        'priceCurrency': 'BDT',
        'price': medicine.mrp > 0 ? medicine.mrp.toFixed(2) : '0.00',
        'availability': 'https://schema.org/InStock'
      }
    };
  } else if (generic) {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'MedicalEntity',
      'name': generic.name,
      'description': description,
      'url': url,
      'code': {
        '@type': 'MedicalCode',
        'code': generic.id.toString(),
        'codingSystem': 'MedVhai-Generic-Index'
      }
    };
  } else {
    schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'MedicalWebPage',
      'name': title,
      'description': description,
      'url': url,
      'inLanguage': ['en', 'bn'],
      'audience': {
        '@type': 'MedicalAudience',
        'audienceType': ['Patients', 'Doctors', 'Pharmacists']
      }
    };
  }

  scriptEl.textContent = JSON.stringify(schemaObj);
}
