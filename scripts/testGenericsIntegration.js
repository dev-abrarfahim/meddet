/**
 * Test Suite: Generics Page, Autocomplete & Combinations Integration
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

// 1. Obfuscation & Canonical Path Functions
const OBFUSCATION_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const OBFUSCATION_BASE = 36;
const OBFUSCATION_M = 1679616;
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

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim()
    .replace(/[^\p{L}\p{N}\s-]+/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function getGenericCanonicalPath(generic) {
  const base = slugify(generic.name) || 'generic';
  return `/generic/${base}-${encodeId(generic.id)}`;
}

function parseGenericIdFromSlug(slugOrPath) {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/generic\//, '').replace(/\/$/, '');
  const match = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  return match ? decodeId(match[1]) : null;
}

console.log('\n======================================================');
console.log('🧪 1. TESTING GENERIC CANONICAL URL & SLUG ROUNDTRIP');
console.log('======================================================');

const sampleGeneric = { id: 1124, name: 'Paracetamol' };
const genPath = getGenericCanonicalPath(sampleGeneric);
assert(genPath.startsWith('/generic/paracetamol-'), `Canonical path starts with /generic/paracetamol- (${genPath})`);

const parsedId = parseGenericIdFromSlug(genPath);
assert(parsedId === 1124, `Decoded ID matches original generic ID: ${parsedId} === 1124`);

const sampleGenericCombo = { id: 247, name: 'Paracetamol + Caffeine' };
const comboPath = getGenericCanonicalPath(sampleGenericCombo);
assert(comboPath.startsWith('/generic/paracetamol-caffeine-'), `Combination slug generated correctly: ${comboPath}`);
assert(parseGenericIdFromSlug(comboPath) === 247, `Combination ID parsed back correctly: 247 === 247`);

console.log('\n======================================================');
console.log('🧪 2. TESTING BRANDS & GENERICS DATABASE INTEGRITY');
console.log('======================================================');

const brandsPath = path.join(ROOT_DIR, 'public', 'data', 'brands.json');
const genericsPath = path.join(ROOT_DIR, 'public', 'data', 'generics.json');

assert(fs.existsSync(brandsPath), 'brands.json exists in public/data');
assert(fs.existsSync(genericsPath), 'generics.json exists in public/data');

const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
const generics = JSON.parse(fs.readFileSync(genericsPath, 'utf8'));

assert(brands.length > 30000, `Brands count verified: ${brands.length}`);
assert(generics.length > 2000, `Generics monographs count verified: ${generics.length}`);

// Map genericToBrands
const genericToBrandsMap = new Map();
brands.forEach(b => {
  const list = genericToBrandsMap.get(b.genericId) || [];
  list.push(b);
  genericToBrandsMap.set(b.genericId, list);
});

const paracetamolBrands = genericToBrandsMap.get(1124) || [];
assert(paracetamolBrands.length > 50, `Paracetamol brands found: ${paracetamolBrands.length} (Expected > 50)`);

// Check unique dosage forms for Paracetamol
const paracetamolForms = Array.from(new Set(paracetamolBrands.map(b => b.form).filter(Boolean)));
assert(paracetamolForms.includes('Tablet') || paracetamolForms.some(f => f.includes('Tablet')), 'Paracetamol has Tablet form');
assert(paracetamolForms.length >= 3, `Paracetamol has multiple dosage forms (${paracetamolForms.join(', ')})`);

console.log('\n======================================================');
console.log('🧪 3. TESTING GENERIC SEARCH & COMBINATION FORMULATIONS');
console.log('======================================================');

// Build fast generic list
const fastGenericList = [];
genericToBrandsMap.forEach((gBrands, genId) => {
  if (gBrands.length > 0) {
    const first = gBrands[0];
    const forms = Array.from(new Set(gBrands.map(b => b.form).filter(Boolean)));
    fastGenericList.push({
      id: genId,
      name: first.genericName,
      nameBn: first.genericNameBn || '',
      brandCount: gBrands.length,
      dosageForms: forms
    });
  }
});
fastGenericList.sort((a, b) => b.brandCount - a.brandCount);

function searchGenerics(query, limit = 6) {
  const clean = query.trim().toLowerCase();
  if (!clean || clean.length < 2) return [];

  const matched = fastGenericList.filter((g) => {
    return g.name.toLowerCase().includes(clean) || (g.nameBn && g.nameBn.includes(clean));
  });

  matched.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aExact = aName === clean;
    const bExact = bName === clean;
    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStart = aName.startsWith(clean);
    const bStart = bName.startsWith(clean);
    if (aStart && !bStart) return -1;
    if (!aStart && bStart) return 1;

    return b.brandCount - a.brandCount;
  });

  return matched.slice(0, limit);
}

function getGenericCombinations(genericName) {
  const target = genericName.trim().toLowerCase();
  if (!target) return [];

  const results = [];
  const seenIds = new Set();

  fastGenericList.forEach((g) => {
    const gNameLower = g.name.toLowerCase();
    if (gNameLower === target) return;

    const isCombination =
      gNameLower.includes('+') ||
      gNameLower.includes('/') ||
      gNameLower.includes(' with ') ||
      gNameLower.includes('&') ||
      gNameLower.includes(',');

    if (isCombination && gNameLower.includes(target)) {
      if (!seenIds.has(g.id)) {
        seenIds.add(g.id);
        results.push({
          id: g.id,
          name: g.name,
          nameBn: g.nameBn,
          brandCount: g.brandCount
        });
      }
    }
  });

  results.sort((a, b) => b.brandCount - a.brandCount);
  return results;
}

// Test searchGenerics
const paraSearch = searchGenerics('Paracetamol');
assert(paraSearch.length > 0, `Search "Paracetamol" returns results (${paraSearch.length})`);
assert(paraSearch[0].name.toLowerCase() === 'paracetamol', `First result is exact Paracetamol: ${paraSearch[0].name}`);
assert(paraSearch[0].brandCount > 50, `Paracetamol brandCount is accurate: ${paraSearch[0].brandCount}`);

const omepSearch = searchGenerics('omeprazole');
assert(omepSearch.length > 0, `Search "omeprazole" returns results (${omepSearch.length})`);
assert(omepSearch.some(g => g.name.toLowerCase() === 'omeprazole'), 'Found Omeprazole in search results');

// Test Combinations
const paraCombos = getGenericCombinations('Paracetamol');
assert(paraCombos.length >= 3, `Found multiple Paracetamol combinations: ${paraCombos.length}`);
const caffeineCombo = paraCombos.find(c => c.name.includes('Caffeine'));
assert(caffeineCombo !== undefined, `Found "Paracetamol + Caffeine" combination`);
assert(caffeineCombo.brandCount > 0, `Paracetamol + Caffeine has available brands: ${caffeineCombo?.brandCount}`);

console.log('\n======================================================');
console.log('🧪 4. TESTING MONOGRAPH CLINICAL SECTIONS (PARACETAMOL)');
console.log('======================================================');

const paracetamolMono = generics.find(g => g.id === 1124 || g.name.toLowerCase() === 'paracetamol');
assert(paracetamolMono !== undefined, 'Found Paracetamol monograph in generics.json');
assert(paracetamolMono.indication && paracetamolMono.indication.length > 10, 'Indication section populated');
assert(paracetamolMono.dose && paracetamolMono.dose.length > 10, 'Dose section populated');
assert(paracetamolMono.contraIndication && paracetamolMono.contraIndication.length > 10, 'Contraindication section populated');
assert(paracetamolMono.sideEffect && paracetamolMono.sideEffect.length > 10, 'Side effects section populated');
assert(paracetamolMono.precaution && paracetamolMono.precaution.length > 10, 'Precautions section populated');
assert(paracetamolMono.pregnancyCategory && paracetamolMono.pregnancyCategory.length > 10, 'Pregnancy category section populated');
assert(paracetamolMono.overdose && paracetamolMono.overdose.length > 10, 'Overdose section populated');

console.log('\n======================================================');
console.log('📊 TEST SUMMARY');
console.log('======================================================');
console.log(`Total Assertions: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
  console.log('\n🎉 ALL GENERICS INTEGRATION TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error(`\n❌ ${failedTests} TESTS FAILED!`);
  process.exit(1);
}
