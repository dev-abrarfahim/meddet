import { Medicine, GenericMonograph } from '../types';
import {
  generateMedicineMetadata,
  generateGenericMetadata,
  generateDefaultMetadata,
  SEOMetadata
} from './urlHelper';

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

/**
 * Enterprise Client-Side Dynamic SEO & Schema Synchronizer
 * Keeps the browser DOM metadata 100% in parity with server/edge SSR metadata.
 */
export function updateDynamicSEO(props: SEOProps) {
  let meta: SEOMetadata;

  if (props.medicine) {
    meta = generateMedicineMetadata(props.medicine, props.generic);
  } else if (props.generic) {
    meta = generateGenericMetadata(props.generic);
  } else {
    meta = generateDefaultMetadata(
      props.categoryName,
      props.dosageForm,
      props.manufacturer,
      props.letter,
      props.searchQuery
    );
  }

  // 1. Document Title
  document.title = meta.title;

  // 2. Standard Meta Tags
  setMetaTag('name', 'description', meta.description);
  setMetaTag('name', 'keywords', meta.keywords);
  setMetaTag('name', 'robots', meta.robots);

  // 3. OpenGraph Social Cards
  setMetaTag('property', 'og:title', meta.og.title);
  setMetaTag('property', 'og:description', meta.og.description);
  setMetaTag('property', 'og:site_name', 'MedVhai');
  setMetaTag('property', 'og:url', meta.og.url);
  setMetaTag('property', 'og:image', meta.og.image);
  setMetaTag('property', 'og:type', meta.og.type);

  // 4. Twitter Social Cards
  setMetaTag('property', 'twitter:card', meta.twitter.card);
  setMetaTag('property', 'twitter:title', meta.twitter.title);
  setMetaTag('property', 'twitter:description', meta.twitter.description);
  setMetaTag('property', 'twitter:image', meta.twitter.image);

  // 5. Canonical Link (Single authoritative self-referencing tag)
  let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', meta.canonicalUrl);

  // 6. Schema.org JSON-LD Structured Data
  let scriptEl = document.querySelector<HTMLScriptElement>('#dynamic-seo-schema');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'dynamic-seo-schema';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  scriptEl.textContent = JSON.stringify(meta.jsonLd);
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
