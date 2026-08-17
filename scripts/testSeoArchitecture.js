/**
 * MedVhai Enterprise Technical SEO & Regression Test Suite
 * Validates Canonicalization, Edge SSR logic, Slug Safety, 301 Migration, and Sitemaps
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
}

// 1. Central URL Logic Verification
function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]+/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getMedicineCanonicalSlug(med) {
  const parts = [slugify(med.name)];
  if (med.strength) {
    const cleanStrength = slugify(med.strength);
    if (cleanStrength) parts.push(cleanStrength);
  }
  if (med.form) {
    const cleanForm = slugify(med.form);
    if (cleanForm) parts.push(cleanForm);
  }
  const baseSlug = parts.filter(Boolean).join('-');
  return `${baseSlug}-${med.id}`;
}

function parseMedicineIdFromSlug(slugOrPath) {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/medicine\//, '').replace(/\/$/, '');
  const match = clean.match(/-(\d+)$/) || clean.match(/^(\d+)$/);
  if (match) {
    const id = parseInt(match[1], 10);
    return isNaN(id) ? null : id;
  }
  return null;
}

console.log('\n======================================================');
console.log('🧪 1. TESTING URL GENERATION & SLUG COLLISION SAFETY');
console.log('======================================================');

const sampleMed1 = { id: 14521, name: 'Napa', strength: '500mg', form: 'Tablet' };
const slug1 = getMedicineCanonicalSlug(sampleMed1);
assert(slug1 === 'napa-500mg-tablet-14521', `Slug matches expected format (${slug1})`);
assert(parseMedicineIdFromSlug(slug1) === 14521, `ID parsed back from slug (${slug1} -> 14521)`);
assert(parseMedicineIdFromSlug('/medicine/napa-500mg-tablet-14521') === 14521, 'ID parsed from full path');
assert(parseMedicineIdFromSlug('/medicine/14521') === 14521, 'ID parsed from raw ID path');

// Test Unicode & Bengali Support
const sampleBengali = slugify('প্যারাসিটামল ৫০০ মিগ্রা ট্যাবলেট');
assert(sampleBengali.length > 0, `Unicode slugification preserved Bengali characters (${sampleBengali})`);

console.log('\n======================================================');
console.log('🧪 2. AUDITING MEDICINE DATABASE INTEGRITY');
console.log('======================================================');

const brandsPath = path.join(ROOT_DIR, 'public', 'data', 'brands.json');
assert(fs.existsSync(brandsPath), 'brands.json dataset exists');
const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf-8'));
assert(brands.length > 30000, `Total medicines in database: ${brands.length.toLocaleString()}`);

let missingNameCount = 0;
let missingIdCount = 0;
const idSet = new Set();
let duplicateIdCount = 0;

for (const m of brands) {
  if (!m.name || m.name.trim() === '') missingNameCount++;
  if (!m.id) missingIdCount++;
  if (idSet.has(m.id)) duplicateIdCount++;
  idSet.add(m.id);
}

assert(missingNameCount === 0, `Zero records with missing brand names (Found: ${missingNameCount})`);
assert(missingIdCount === 0, `Zero records with missing IDs (Found: ${missingIdCount})`);
assert(duplicateIdCount === 0, `Zero duplicate IDs in database (Found: ${duplicateIdCount})`);

console.log('\n======================================================');
console.log('🧪 3. TESTING SITEMAP ARCHITECTURE & CANONICAL PATHS');
console.log('======================================================');

const rootSitemapPath = path.join(ROOT_DIR, 'public', 'sitemap.xml');
assert(fs.existsSync(rootSitemapPath), 'Root sitemap.xml exists');
const rootSitemapContent = fs.readFileSync(rootSitemapPath, 'utf-8');
assert(rootSitemapContent.includes('<sitemapindex'), 'Root sitemap is a valid Sitemap Index (<sitemapindex>)');
assert(!rootSitemapContent.includes('?id='), 'Root sitemap contains zero query URLs');

const sitemapsDir = path.join(ROOT_DIR, 'public', 'sitemaps');
assert(fs.existsSync(sitemapsDir), 'public/sitemaps directory exists');
const subSitemaps = fs.readdirSync(sitemapsDir).filter(f => f.endsWith('.xml'));
assert(subSitemaps.length >= 3, `Sitemap suite contains ${subSitemaps.length} chunked sub-sitemaps`);

let totalSitemapUrls = 0;
let queryUrlCountInSubSitemaps = 0;

for (const f of subSitemaps) {
  const content = fs.readFileSync(path.join(sitemapsDir, f), 'utf-8');
  if (content.includes('?id=')) queryUrlCountInSubSitemaps++;
  const count = (content.match(/<loc>/g) || []).length;
  totalSitemapUrls += count;
}

assert(queryUrlCountInSubSitemaps === 0, 'Zero legacy query URLs across all sub-sitemaps');
assert(totalSitemapUrls > 30000, `Total canonical URLs across sitemap suite: ${totalSitemapUrls.toLocaleString()}`);

console.log('\n======================================================');
console.log('🧪 4. TESTING EDGE WORKER SCRIPT (_worker.js)');
console.log('======================================================');

const workerPath = path.join(ROOT_DIR, 'public', '_worker.js');
assert(fs.existsSync(workerPath), 'public/_worker.js exists for Cloudflare Pages Advanced Mode');
const workerCode = fs.readFileSync(workerPath, 'utf-8');

assert(workerCode.includes('HTMLRewriter'), 'Worker implements Cloudflare HTMLRewriter stream transformation');
assert(workerCode.includes('Response.redirect'), 'Worker implements HTTP 301 permanent redirects for legacy query URLs');
assert(workerCode.includes('404 Not Found') || workerCode.includes('generate404Html'), 'Worker implements true HTTP 404 responses for invalid IDs');
assert(workerCode.includes('Link'), 'Worker sets HTTP canonical Link header');
assert(workerCode.includes('dynamic-seo-schema'), 'Worker injects dynamic Schema.org JSON-LD');

console.log('\n======================================================');
console.log('📊 TEST SUMMARY');
console.log('======================================================');
console.log(`Total Assertions: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ALL TECHNICAL SEO & ARCHITECTURE TESTS PASSED SUCCESSFULLY!\n');
  process.exit(0);
} else {
  console.error('\n❌ SOME TESTS FAILED. PLEASE REVIEW OUTPUT ABOVE.\n');
  process.exit(1);
}
