import fs from 'fs';
import path from 'path';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

const baseUrl = 'https://medvhai.heliox.workers.dev';
const today = new Date().toISOString().split('T')[0];

console.log('Generating production sitemap for MedVhai...');

const brandsPath = path.resolve('public/data/brands.json');
const genericsPath = path.resolve('public/data/generics.json');

const brands = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
const generics = JSON.parse(fs.readFileSync(genericsPath, 'utf8'));

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    
    <!-- Core Pages -->
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.00</priority>
    </url>
    <url>
        <loc>https://medivhai.blogspot.com/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.00</priority>
    </url>

    <!-- Alphabetical Directory Pages -->
`;

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
alphabet.forEach((letter) => {
  xml += `    <url>
        <loc>${baseUrl}/?letter=${letter}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.80</priority>
    </url>\n`;
});

xml += `\n    <!-- Dosage Form Categories -->\n`;
const dosageForms = [
  'Tablet',
  'Capsule',
  'Injection',
  'Syrup',
  'Suspension',
  'Cream',
  'Drops',
  'Solution',
  'Inhaler',
  'Suppository'
];
dosageForms.forEach((form) => {
  xml += `    <url>
        <loc>${baseUrl}/?form=${encodeURIComponent(form)}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.85</priority>
    </url>\n`;
});

xml += `\n    <!-- Generic Monograph Pages -->\n`;
generics.forEach((gen) => {
  const genSlug = slugify(gen.name);
  xml += `    <url>
        <loc>${baseUrl}/?genericId=${gen.id}&amp;generic=${genSlug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.90</priority>
    </url>\n`;
});

xml += `\n    <!-- Brand Medicine Detail Pages -->\n`;
// Limit to first 2500 top brands for super fast indexing in Google Search Console
brands.slice(0, 2500).forEach((med) => {
  const brandSlug = slugify(`${med.name}-${med.strength || ''}-${med.form}`);
  xml += `    <url>
        <loc>${baseUrl}/?id=${med.id}&amp;brand=${brandSlug}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.85</priority>
    </url>\n`;
});

xml += `</urlset>\n`;

const outputPath = path.resolve('public/sitemap.xml');
fs.writeFileSync(outputPath, xml, 'utf8');

console.log(`Successfully generated sitemap.xml with ${generics.length + Math.min(brands.length, 2500) + 38} URLs at ${outputPath}!`);
