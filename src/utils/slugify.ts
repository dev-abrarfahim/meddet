/**
 * SEO-Friendly URL Slug & Canonical URL Helper
 * Re-exports from centralized urlHelper for backward compatibility
 */

export {
  slugify,
  SITE_BASE_URL,
  getMedicineCanonicalSlug,
  getMedicineCanonicalPath,
  getMedicineCanonicalUrl,
  getGenericCanonicalSlug,
  getGenericCanonicalPath,
  getGenericCanonicalUrl,
  getDosageFormCanonicalPath,
  getCompanyCanonicalPath,
  parseMedicineIdFromSlug,
  parseGenericIdFromSlug,
  encodeId,
  decodeId
} from './urlHelper';
