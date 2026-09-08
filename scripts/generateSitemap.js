import fs from 'fs';
import path from 'path';

const OBFUSCATION_ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';
const OBFUSCATION_BASE = 36;
const OBFUSCATION_M = 1679616; // 36^4
const OBFUSCATION_A = 387421;
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

function xmlEscape(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const baseUrl = 'https://meddet.site';
const today = new Date().toISOString().split('T')[0];

console.log('Generating production sitemap suite for MEDDET with Sitemap Index & Chunking...');

const brandsPath = path.resolve('public/data/brands.json');
const genericsPath = path.resolve('public/data/generics.json');
const companiesPath = path.resolve('public/data/companies.json');

const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
const generics = JSON.parse(fs.readFileSync(genericsPath, 'utf8'));
const companies = fs.existsSync(companiesPath) ? JSON.parse(fs.readFileSync(companiesPath, 'utf8')) : [];

// Ensure public/sitemaps directory exists
const sitemapsDir = path.resolve('public/sitemaps');
if (!fs.existsSync(sitemapsDir)) {
  fs.mkdirSync(sitemapsDir, { recursive: true });
}

// 1. Core & Directory Pages Sitemap (sitemap-core.xml)
let coreXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Homepage -->
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.00</priority>
    </url>
    <!-- Standalone Core Content Pages -->
    <url>
        <loc>${baseUrl}/about</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.80</priority>
    </url>
    <url>
        <loc>${baseUrl}/companies</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.85</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy-policy</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.70</priority>
    </url>
    <url>
        <loc>${baseUrl}/terms</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.70</priority>
    </url>
    <url>
        <loc>${baseUrl}/contact</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.75</priority>
    </url>
    <url>
        <loc>${baseUrl}/api-docs</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.80</priority>
    </url>
`;

const dosageForms = [
  'Tablet', 'Capsule', 'Injection', 'Syrup', 'Suspension',
  'Cream', 'Eye Drops', 'Solution', 'Inhaler', 'Suppository'
];
dosageForms.forEach((form) => {
  coreXml += `    <url>
        <loc>${baseUrl}/dosage-form/${slugify(form)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.85</priority>
    </url>\n`;
});

const activeCompanies = companies.filter((c) => c.brandCount > 20);
activeCompanies.forEach((comp) => {
  coreXml += `    <url>
        <loc>${baseUrl}/company/${slugify(comp.name)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.80</priority>
    </url>\n`;
});

coreXml += `</urlset>\n`;
fs.writeFileSync(path.resolve(sitemapsDir, 'sitemap-core.xml'), coreXml, 'utf8');

// 2. Generic Monograph Pages Sitemap (sitemap-generics.xml)
let genXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

generics.forEach((gen) => {
  if (!gen.id || !gen.name) return;
  const genSlug = slugify(gen.name) || 'generic';
  const genCode = encodeId(gen.id);
  genXml += `    <url>
        <loc>${baseUrl}/generic/${genSlug}-${genCode}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.90</priority>
    </url>\n`;
});

genXml += `</urlset>\n`;
fs.writeFileSync(path.resolve(sitemapsDir, 'sitemap-generics.xml'), genXml, 'utf8');

// 3. Brand Medicine Detail Pages Sitemaps (Chunked into 15,000 batches)
const CHUNK_SIZE = 15000;
const validBrands = brands.filter((m) => m.id && m.name);
const totalChunks = Math.ceil(validBrands.length / CHUNK_SIZE);
const medicineSitemapFiles = [];

for (let i = 0; i < totalChunks; i++) {
  const chunkIndex = i + 1;
  const fileName = `sitemap-medicines-${chunkIndex}.xml`;
  medicineSitemapFiles.push(fileName);

  const chunk = validBrands.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
  let medXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  chunk.forEach((med) => {
    const parts = [slugify(med.name)];
    if (med.strength) {
      const cleanStr = slugify(med.strength);
      if (cleanStr) parts.push(cleanStr);
    }
    if (med.form) {
      const cleanForm = slugify(med.form);
      if (cleanForm) parts.push(cleanForm);
    }
    const brandSlug = parts.filter(Boolean).join('-');
    const code = encodeId(med.id);
    const canonicalPath = `/medicine/${brandSlug}-${code}`;

    medXml += `    <url>
        <loc>${baseUrl}${canonicalPath}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>\n`;
  });

  medXml += `</urlset>\n`;
  fs.writeFileSync(path.resolve(sitemapsDir, fileName), medXml, 'utf8');
}

// 4. Authoritative Root Sitemap Index (public/sitemap.xml)
let indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${baseUrl}/sitemaps/sitemap-core.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
    <sitemap>
        <loc>${baseUrl}/sitemaps/sitemap-generics.xml</loc>
        <lastmod>${today}</lastmod>
    </sitemap>
`;

medicineSitemapFiles.forEach((file) => {
  indexXml += `    <sitemap>
        <loc>${baseUrl}/sitemaps/${file}</loc>
        <lastmod>${today}</lastmod>
    </sitemap>\n`;
});

indexXml += `</sitemapindex>\n`;

const rootSitemapPath = path.resolve('public/sitemap.xml');
fs.writeFileSync(rootSitemapPath, indexXml, 'utf8');

console.log(`✅ Successfully generated Sitemap Index at ${rootSitemapPath}`);
console.log(`   - sitemap-core.xml (${dosageForms.length + activeCompanies.length + 1} URLs)`);
console.log(`   - sitemap-generics.xml (${generics.length} URLs)`);
console.log(`   - ${medicineSitemapFiles.length} Medicine sub-sitemaps (${validBrands.length} total medicine URLs)`);
