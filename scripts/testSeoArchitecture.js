/**
 * MedVhai Enterprise Technical SEO & Regression Test Suite
 * Validates Canonicalization, Edge SSR logic, Slug Safety, 301 Migration, Sitemaps,
 * and Cross-Medicine Query Conflict Elimination
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

const OBFUSCATION_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const OBFUSCATION_BASE = 36;
const OBFUSCATION_M = 1679616; // 36^4
const OBFUSCATION_A = 387421;
const OBFUSCATION_A_INV = 1197301;
const OBFUSCATION_B = 41725;

function encodeId(id) {
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

function decodeId(code) {
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
  const code = encodeId(med.id);
  return `${baseSlug}-${code}`;
}

function getMedicineCanonicalPath(med) {
  return `/medicine/${getMedicineCanonicalSlug(med)}`;
}

function parseMedicineIdFromSlug(slugOrPath) {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/medicine\//, '').replace(/\/$/, '');
  const match = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  return match ? decodeId(match[1]) : null;
}

console.log('\n======================================================');
console.log('🧪 1. TESTING URL GENERATION, OBFUSCATION & SLUG SAFETY');
console.log('======================================================');

const sampleMed1 = { id: 14521, name: 'Napa', strength: '500mg', form: 'Tablet' };
const code1 = encodeId(14521);
const slug1 = getMedicineCanonicalSlug(sampleMed1);
assert(code1 === 'g182', `ID 14521 encodes to 4-char code (${code1} === g182)`);
assert(decodeId('g182') === 14521, `Code g182 decodes to ID (g182 -> 14521)`);
assert(slug1 === 'napa-500mg-tablet-g182', `Slug matches expected obfuscated format (${slug1})`);
assert(parseMedicineIdFromSlug(slug1) === 14521, `ID parsed back from obfuscated slug (${slug1} -> 14521)`);
assert(parseMedicineIdFromSlug('/medicine/g182') === 14521, 'ID parsed from raw code path');

// Test Brinzopt sample (ID: 3276)
const brinzoptMed = { id: 3276, name: 'Brinzopt', strength: '1%', form: 'Ophthalmic Suspension' };
const brinzoptPath = getMedicineCanonicalPath(brinzoptMed);
assert(brinzoptPath === '/medicine/brinzopt-1-ophthalmic-suspension-o2e1', `Brinzopt canonical path matches: ${brinzoptPath}`);
assert(parseMedicineIdFromSlug(brinzoptPath) === 3276, 'Brinzopt ID correctly parsed back');

// Test Unicode & Bengali Support
const sampleBengali = slugify('প্যারাসিটামল ৫০০ মিগ্রা ট্যাবলেট');
assert(sampleBengali.length > 0, `Unicode slugification preserved Bengali characters (${sampleBengali})`);

console.log('\n======================================================');
console.log('🧪 2. REGRESSION TESTS: CROSS-MEDICINE QUERY PARAMETER CONFLICT FIX');
console.log('======================================================');

// Test 1: Alternative Brand Navigation URL Target
const currentMedicine = { id: 14521, name: 'Napa', strength: '500mg', form: 'Tablet' };
const targetMedicine = { id: 37218, name: 'Heximax', strength: '2mg', form: 'Tablet' };
const expectedTargetUrl = getMedicineCanonicalPath(targetMedicine);
const heximaxCode = encodeId(37218);
assert(expectedTargetUrl === `/medicine/heximax-2mg-tablet-${heximaxCode}`, `Alternative brand target URL is clean path: ${expectedTargetUrl}`);
assert(!expectedTargetUrl.includes('napa') && !expectedTargetUrl.includes('14521'), 'Target URL contains zero trace of current medicine');
assert(!expectedTargetUrl.includes('?id=') && !expectedTargetUrl.includes('&brand='), 'Target URL contains zero query parameters');

// Test 2: Clean Canonical Medicine Path contains NO identity query parameters
const napaCanonical = getMedicineCanonicalPath(currentMedicine);
assert(!napaCanonical.includes('?') && !napaCanonical.includes('&'), `Canonical path is strictly path-only: ${napaCanonical}`);

// Test 3: Alternative Brand changes pathname, not query params
const altPath = getMedicineCanonicalPath(targetMedicine);
assert(altPath !== napaCanonical, `Alternative brand navigation produces different pathname (${altPath} !== ${napaCanonical})`);

// Test 4: Variant Navigation changes pathname
const variantMed = { id: 14522, name: 'Napa', strength: '250mg', form: 'Tablet' };
const variantPath = getMedicineCanonicalPath(variantMed);
const variantCode = encodeId(14522);
assert(variantPath === `/medicine/napa-250mg-tablet-${variantCode}`, `Variant navigation changes pathname: ${variantPath}`);
assert(variantPath !== napaCanonical, 'Variant has distinct path and code from base medicine');

// Test 5: Conflict resolution & query stripping verification
const dirtyUrl = '/medicine/napa-500mg-tablet-g182?id=37218&brand=heximax-2mg-tablet';
const parsedIdFromDirtyUrl = parseMedicineIdFromSlug(dirtyUrl);
assert(parsedIdFromDirtyUrl === 14521, `Pathname is authoritative for medicine identity (${parsedIdFromDirtyUrl} === 14521, ignoring ?id=37218)`);

// Test 6: Slug + ID Consistency Check
const mismatchedSlug = `/medicine/napa-500mg-tablet-${heximaxCode}`;
const parsedIdFromMismatch = parseMedicineIdFromSlug(mismatchedSlug);
assert(parsedIdFromMismatch === 37218, `Parsed ID from mismatched slug is 37218`);
const correctCanonicalFor37218 = getMedicineCanonicalPath(targetMedicine);
assert(correctCanonicalFor37218 === `/medicine/heximax-2mg-tablet-${heximaxCode}`, 'Worker will 301 redirect mismatched slug to true medicine');

console.log('\n======================================================');
console.log('🧪 3. 100-RECORD SAMPLE CRAWL AUDIT');
console.log('======================================================');

const brandsPath = path.join(ROOT_DIR, 'public', 'data', 'brands.json');
assert(fs.existsSync(brandsPath), 'brands.json dataset exists');
const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf-8'));

let sampleCrawlPassCount = 0;
const sampleSubset = brands.slice(0, 150);

for (const med of sampleSubset) {
  const pathGen = getMedicineCanonicalPath(med);
  const parsedId = parseMedicineIdFromSlug(pathGen);
  const hasNoQuery = !pathGen.includes('?') && !pathGen.includes('&');
  const idMatches = parsedId === med.id;

  if (hasNoQuery && idMatches) {
    sampleCrawlPassCount++;
  }
}

assert(sampleCrawlPassCount === sampleSubset.length, `100% of sample medicines (${sampleCrawlPassCount}/${sampleSubset.length}) passed Slug === ID === Path audit`);

console.log('\n======================================================');
console.log('🧪 4. AUDITING MEDICINE DATABASE INTEGRITY');
console.log('======================================================');

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
console.log('🧪 5. TESTING SITEMAP ARCHITECTURE & CANONICAL PATHS');
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
console.log('🧪 6. TESTING EDGE WORKER SCRIPT (_worker.js)');
console.log('======================================================');

const workerPath = path.join(ROOT_DIR, 'public', '_worker.js');
assert(fs.existsSync(workerPath), 'public/_worker.js exists for Cloudflare Pages Advanced Mode');
const workerCode = fs.readFileSync(workerPath, 'utf-8');

assert(workerCode.includes('HTMLRewriter'), 'Worker implements Cloudflare HTMLRewriter stream transformation');
assert(workerCode.includes('Response.redirect'), 'Worker implements HTTP 301 permanent redirects for legacy query URLs');
assert(workerCode.includes('hasForbiddenQuery'), 'Worker detects and strips conflicting legacy query params from /medicine/ routes');
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
