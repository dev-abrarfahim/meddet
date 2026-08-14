/**
 * SEO Friendly URL Slug Helper
 * Converts medicine and generic names into clean URL slugs
 * e.g., "Napa 500 mg Tablet" -> "napa-500-mg-tablet"
 */

export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\p{L}\p{N}\-]+/gu, '') // Keep all Unicode letters, numbers, and dashes (including Bengali script)
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
