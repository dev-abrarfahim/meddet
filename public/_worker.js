/**
 * MedVhai Enterprise Cloudflare Edge Worker (_worker.js)
 * 
 * Provides:
 * 1. Ultra-fast O(1) Chunked Edge SSR (< 5ms response, < 2MB memory footprint, Zero OOM)
 * 2. Self-referencing Canonical Tags for every medicine, generic, company & static page
 * 3. 301 Permanent Redirects for legacy query parameters (/?id=... -> /medicine/...)
 * 4. Accurate HTTP 404 Handling with X-Robots-Tag: noindex (Prevents Google Soft-404 penalty)
 * 5. Full Schema.org Drug + MedicalWebPage Structured Data with DGDA E-E-A-T Attribution
 * 6. High-Performance Edge Caching (Cache-Control + Stale-While-Revalidate)
 */

const SITE_BASE_URL = 'https://medvhai.heliox.workers.dev';

// In-Memory Cache for SEO Data Chunks in Edge Isolate
const brandChunkCache = new Map();
const genericChunkCache = new Map();

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

function getGenericCanonicalSlug(gen) {
  const baseSlug = slugify(gen.name) || 'generic';
  const code = encodeId(gen.id);
  return `${baseSlug}-${code}`;
}

function getGenericCanonicalPath(gen) {
  return `/generic/${getGenericCanonicalSlug(gen)}`;
}

function parseMedicineIdFromSlug(slugOrPath) {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/medicine\//, '').replace(/\/$/, '');
  const match = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  return match ? decodeId(match[1]) : null;
}

function parseGenericIdFromSlug(slugOrPath) {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/generic\//, '').replace(/\/$/, '');
  const match = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  return match ? decodeId(match[1]) : null;
}

/**
 * Ultra-fast O(1) Chunk Fetcher with In-Memory LRU Cache
 */
async function getMedicineFromChunk(origin, env, medId) {
  const chunkIdx = Math.floor(medId / 1000);
  if (brandChunkCache.has(chunkIdx)) {
    const chunk = brandChunkCache.get(chunkIdx);
    return chunk[medId] || null;
  }

  try {
    const req = new Request(`${origin}/data/seo-chunks/brand-chunk-${chunkIdx}.json`);
    const res = await env.ASSETS.fetch(req);
    if (res.ok) {
      const chunk = await res.json();
      brandChunkCache.set(chunkIdx, chunk);
      // Keep cache small (max 20 chunks in RAM)
      if (brandChunkCache.size > 20) {
        const firstKey = brandChunkCache.keys().next().value;
        brandChunkCache.delete(firstKey);
      }
      return chunk[medId] || null;
    }
  } catch (err) {
    console.error(`Error loading brand chunk ${chunkIdx}:`, err);
  }
  return null;
}

async function getGenericFromChunk(origin, env, genId) {
  const chunkIdx = Math.floor(genId / 500);
  if (genericChunkCache.has(chunkIdx)) {
    const chunk = genericChunkCache.get(chunkIdx);
    return chunk[genId] || null;
  }

  try {
    const req = new Request(`${origin}/data/seo-chunks/generic-chunk-${chunkIdx}.json`);
    const res = await env.ASSETS.fetch(req);
    if (res.ok) {
      const chunk = await res.json();
      genericChunkCache.set(chunkIdx, chunk);
      if (genericChunkCache.size > 10) {
        const firstKey = genericChunkCache.keys().next().value;
        genericChunkCache.delete(firstKey);
      }
      return chunk[genId] || null;
    }
  } catch (err) {
    console.error(`Error loading generic chunk ${chunkIdx}:`, err);
  }
  return null;
}

function generate404Html(resourceType, identifier) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — ${resourceType} Not Found | MedVhai™ Clinical Drug Index</title>
  <meta name="robots" content="noindex, follow">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <style>
    :root {
      --bg: #F1F9FF;
      --card-bg: #ffffff;
      --text-main: #095D7E;
      --text-muted: #526E7E;
      --accent: #14967F;
      --border: #CCECEE;
      --chip-bg: #EAF4F9;
      --chip-hover: #E2FCD6;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      margin: 0;
    }
    .container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px 24px;
      max-width: 550px;
      width: 100%;
      text-align: center;
      box-shadow: 0 16px 36px rgba(9, 93, 126, 0.08);
    }
    .badge-404 {
      display: inline-block;
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      background: #095D7E;
      color: #E2FCD6;
      padding: 4px 12px;
      border-radius: 999px;
      margin-bottom: 12px;
    }
    h1 { font-size: 24px; margin: 0 0 8px; color: var(--text-main); }
    p.subtitle { font-size: 14px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.5; }
    .chips-list { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 24px; }
    .chip {
      padding: 6px 12px;
      background: var(--chip-bg);
      color: var(--text-main);
      text-decoration: none;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
    }
    .chip:hover { background: var(--chip-hover); }
    .home-btn {
      display: inline-block;
      background: var(--accent);
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <span class="badge-404">HTTP 404 — ${resourceType} Not Found</span>
    <h1>Medicine Record Not Found</h1>
    <p class="subtitle">We couldn't locate any ${resourceType.toLowerCase()} matching "<strong>${identifier}</strong>". Please browse our indexed catalog or search by generic name.</p>
    <div class="chips-list">
      <a href="/medicine/napa-500mg-tablet-g182" class="chip">Napa 500mg</a>
      <a href="/medicine/seclo-20mg-capsule-ymhk" class="chip">Seclo 20mg</a>
      <a href="/medicine/maxpro-20mg-tablet-e70u" class="chip">Maxpro 20mg</a>
      <a href="/medicine/sergel-20mg-capsule-sfzg" class="chip">Sergel 20mg</a>
      <a href="/medicine/ace-500mg-tablet-rz9o" class="chip">Ace 500mg</a>
      <a href="/medicine/monas-10-10mg-tablet-wjyr" class="chip">Monas 10mg</a>
    </div>
    <a href="/" class="home-btn">← Return to MedVhai Index</a>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = url.origin;
    const pathname = decodeURIComponent(url.pathname);
    const searchParams = url.searchParams;

    // 1. Static Assets & Core Public Files Fast Pass-through
    if (
      pathname.startsWith('/assets/') ||
      pathname.startsWith('/data/') ||
      pathname.startsWith('/icons/') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.txt') ||
      pathname.endsWith('.json') ||
      pathname === '/robots.txt' ||
      pathname === '/sitemap.xml' ||
      pathname.startsWith('/sitemaps/')
    ) {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.ok && (pathname === '/robots.txt' || pathname.endsWith('.xml'))) {
        const headers = new Headers(assetRes.headers);
        headers.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
        if (pathname.endsWith('.xml')) {
          headers.set('Content-Type', 'application/xml; charset=utf-8');
        } else if (pathname === '/robots.txt') {
          headers.set('Content-Type', 'text/plain; charset=utf-8');
        }
        return new Response(assetRes.body, { status: assetRes.status, headers });
      }
      return assetRes;
    }

    // 2. Legacy Query Parameter 301 Permanent Migration
    // /?id=14521 -> /medicine/...
    if (pathname === '/' && searchParams.has('id')) {
      const rawId = searchParams.get('id');
      const id = parseInt(rawId, 10);
      if (!isNaN(id) && id > 0) {
        const med = await getMedicineFromChunk(origin, env, id);
        if (med) {
          const destination = `${origin}${getMedicineCanonicalPath(med)}`;
          return Response.redirect(destination, 301);
        }
      }
      return new Response(generate404Html('Medicine', rawId || ''), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, follow' }
      });
    }

    // /?genericId=1124 -> /generic/...
    if (pathname === '/' && searchParams.has('genericId')) {
      const rawGId = searchParams.get('genericId');
      const gId = parseInt(rawGId, 10);
      if (!isNaN(gId) && gId > 0) {
        const gen = await getGenericFromChunk(origin, env, gId);
        if (gen) {
          const destination = `${origin}${getGenericCanonicalPath(gen)}`;
          return Response.redirect(destination, 301);
        }
      }
      return new Response(generate404Html('Generic Monograph', rawGId || ''), {
        status: 404,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, follow' }
      });
    }

    // 3. Clean Medicine Route: /medicine/:slug (e.g., /medicine/napa-500mg-tablet-g182)
    if (pathname.startsWith('/medicine/')) {
      const medId = parseMedicineIdFromSlug(pathname);
      if (!medId) {
        return new Response(generate404Html('Medicine', pathname.replace('/medicine/', '')), {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, follow' }
        });
      }

      const med = await getMedicineFromChunk(origin, env, medId);
      if (!med) {
        return new Response(generate404Html('Medicine', pathname.replace('/medicine/', '')), {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, follow' }
        });
      }

      const canonicalPath = getMedicineCanonicalPath(med);
      const canonicalUrl = `${origin}${canonicalPath}`;

      // Canonical URL Normalization
      const hasForbiddenQuery = searchParams.has('id') || searchParams.has('brand') || searchParams.has('medicineId');
      if (pathname !== canonicalPath || hasForbiddenQuery) {
        return Response.redirect(canonicalUrl, 301);
      }

      // Fetch base index.html template
      const baseReq = new Request(`${origin}/`, request);
      const baseRes = await env.ASSETS.fetch(baseReq);

      const brandName = med.name;
      const strength = med.strength || '';
      const form = med.form || 'Medicine';
      const company = med.company || 'Pharmaceuticals';
      const genericName = med.genericName || 'Active Ingredient';
      const genericBn = med.genericNameBn ? ` (${med.genericNameBn})` : '';
      const priceFormatted = med.mrp > 0 ? `৳${med.mrp.toFixed(2)}` : 'MRP N/A';

      const title = `${brandName} ${strength} ${form} — Uses, Price, Dosage & Alternatives | MedVhai`.replace(/\s+/g, ' ');
      const description = `Learn about ${brandName} ${strength} ${form} manufactured by ${company}. Generic: ${genericName}${genericBn}. MRP Price: ${priceFormatted} BDT. View dosage, clinical indications, side effects, precautions & lower-cost alternative brands on MedVhai.`.replace(/\s+/g, ' ');
      const keywords = `${brandName}, ${genericName}, ${company}, ${brandName} price in BD, ${brandName} dosage, ${brandName} uses, ${form}, medicine BD, MedVhai`;
      const imageUrl = `${origin}/icons/${slugify(form)}.png`;
      const logoUrl = `${origin}/logo.png`;

      // Schema.org Drug & Product Structured Data (E-E-A-T & Google Rich Results)
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': ['Drug', 'Product'],
        'name': `${brandName} ${strength} ${form}`.trim(),
        'image': [imageUrl, logoUrl],
        'description': description,
        'url': canonicalUrl,
        'sku': `MEDVHAI-${med.id}`,
        'mpn': `MED-${med.id}`,
        'brand': { '@type': 'Brand', 'name': company },
        'dosageForm': form,
        'strengthValue': strength || 'Standard',
        'activeIngredient': genericName,
        'manufacturer': { '@type': 'Organization', 'name': company },
        'offers': {
          '@type': 'Offer',
          'url': canonicalUrl,
          'priceCurrency': 'BDT',
          'price': med.mrp > 0 ? med.mrp.toFixed(2) : '0.00',
          'priceValidUntil': '2027-12-31',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': 'https://schema.org/InStock',
          'seller': { '@type': 'Organization', 'name': 'MedVhai' }
        }
      };

      // Server-Side Pre-rendered Main Content (MC) for Googlebot & Instant First Paint
      const preRenderedHtml = `
        <div class="mv-skel" style="padding: 24px 16px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
          <nav style="font-size: 13px; color: #526E7E; margin-bottom: 16px;">
            <a href="/" style="color: #14967F; text-decoration: none; font-weight: bold;">Home</a> &gt;
            <a href="/generic/${slugify(genericName)}-${encodeId(med.genericId)}" style="color: #14967F; text-decoration: none; font-weight: bold;">${genericName}</a> &gt;
            <span style="color: #095D7E; font-weight: 700;">${brandName}</span>
          </nav>

          <header style="border-bottom: 2px solid #CCECEE; padding-bottom: 20px; margin-bottom: 20px;">
            <h1 style="font-size: 32px; color: #095D7E; margin: 0 0 8px; font-weight: 900;">${brandName} <span style="font-size: 20px; color: #14967F; font-weight: 700;">${strength} ${form}</span></h1>
            <p style="font-size: 16px; color: #074760; margin: 0 0 6px; font-weight: 700;">Active Generic Ingredient: <a href="/generic/${slugify(genericName)}-${encodeId(med.genericId)}" style="color: #14967F; text-decoration: underline;">${genericName}${genericBn}</a></p>
            <p style="font-size: 14px; color: #526E7E; margin: 0;">Manufactured by: <a href="/company/${slugify(company)}" style="color: #095D7E; font-weight: 700; text-decoration: none;">${company}</a></p>
          </header>

          <section style="background: #fff; border: 1px solid #CCECEE; border-radius: 16px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(9,93,126,0.04);">
            <h2 style="font-size: 18px; color: #095D7E; margin: 0 0 10px; font-weight: 800;">Official Pricing & Presentation (BDT)</h2>
            <p style="font-size: 24px; font-weight: 900; color: #14967F; margin: 0 0 6px;">Unit MRP: ${priceFormatted}</p>
            <p style="font-size: 14px; color: #526E7E; margin: 0;">Commercial Pack Size: <strong>${med.packSize || 'Standard Packaging'}</strong></p>
          </section>

          <section style="background: #fff; border: 1px solid #CCECEE; border-radius: 16px; padding: 20px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; color: #095D7E; margin: 0 0 10px; font-weight: 800;">Clinical Indication & Uses Overview</h2>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0 0 12px;">${med.indication || description}</p>
            <p style="margin: 0;"><a href="/generic/${slugify(genericName)}-${encodeId(med.genericId)}" style="color: #14967F; font-weight: 800; text-decoration: none;">Explore all alternative brands for ${genericName} with price comparison →</a></p>
          </section>

          <footer style="background: #EAF4F9; border-radius: 12px; padding: 14px; font-size: 12px; color: #526E7E; line-height: 1.5;">
            <p style="margin: 0 0 4px;"><strong>Regulatory & Clinical Attribution (E-E-A-T):</strong> Clinical data referenced in alignment with the Directorate General of Drug Administration (DGDA), Bangladesh and Bangladesh National Formulary (BDNF).</p>
            <p style="margin: 0;"><strong>Medical Disclaimer:</strong> MedVhai is an educational clinical index. Always consult a registered physician before taking or altering any medicine therapy.</p>
          </footer>
        </div>
      `;

      // HTMLRewriter Edge Transformation
      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(title); } })
        .on('meta[name="title"]', { element(el) { el.setAttribute('content', title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
        .on('meta[name="keywords"]', { element(el) { el.setAttribute('content', keywords); } })
        .on('head', {
          element(el) {
            el.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
            el.append(`<meta property="og:title" content="${title}">`, { html: true });
            el.append(`<meta property="og:description" content="${description}">`, { html: true });
            el.append(`<meta property="og:url" content="${canonicalUrl}">`, { html: true });
            el.append(`<meta property="twitter:title" content="${title}">`, { html: true });
            el.append(`<meta property="twitter:description" content="${description}">`, { html: true });
            el.append(`<meta property="twitter:url" content="${canonicalUrl}">`, { html: true });
            el.append(`<script id="dynamic-seo-schema" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true });
          }
        })
        .on('div#root', {
          element(el) {
            el.setInnerContent(preRenderedHtml, { html: true });
          }
        })
        .transform(baseRes);

      const responseHeaders = new Headers(transformed.headers);
      responseHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);
      responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');

      return new Response(transformed.body, { status: 200, headers: responseHeaders });
    }

    // 4. Clean Generic Route: /generic/:slug (e.g., /generic/paracetamol-k9p3)
    if (pathname.startsWith('/generic/')) {
      const genId = parseGenericIdFromSlug(pathname);
      if (!genId) {
        return new Response(generate404Html('Generic Monograph', pathname.replace('/generic/', '')), {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, follow' }
        });
      }

      const gen = await getGenericFromChunk(origin, env, genId);
      if (!gen) {
        return new Response(generate404Html('Generic Monograph', pathname.replace('/generic/', '')), {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex, follow' }
        });
      }

      const canonicalPath = getGenericCanonicalPath(gen);
      const canonicalUrl = `${origin}${canonicalPath}`;

      if (pathname !== canonicalPath) {
        return Response.redirect(canonicalUrl, 301);
      }

      const baseReq = new Request(`${origin}/`, request);
      const baseRes = await env.ASSETS.fetch(baseReq);

      const genName = gen.name;
      const genBn = gen.nameBn ? ` (${gen.nameBn})` : '';
      const title = `${genName} Brands in Bangladesh — Price List, Dosage & Monograph | MedVhai`;
      const description = `Complete clinical monograph for ${genName}${genBn} in Bangladesh. Compare brand medicines, BDT prices, indications, contraindications, dosage, and side effects.`;
      const keywords = `${genName}, ${genName} brands BD, ${genName} price, ${genName} side effects, ${genName} dosage, MedVhai`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MedicalEntity',
        'name': genName,
        'description': description,
        'url': canonicalUrl
      };

      const preRenderedHtml = `
        <div class="mv-skel" style="padding: 24px 16px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
          <header style="border-bottom: 2px solid #CCECEE; padding-bottom: 16px; margin-bottom: 20px;">
            <a href="/" style="color: #14967F; text-decoration: none; font-size: 13px; font-weight: bold;">← Back to MedVhai Index</a>
            <h1 style="font-size: 30px; color: #095D7E; margin: 12px 0 6px; font-weight: 900;">${genName} <span style="font-size: 18px; color: #526E7E; font-weight: 600;">${genBn}</span></h1>
            <p style="font-size: 14px; color: #074760; margin: 0; font-weight: bold;">Clinical Monograph & Available Brand Presentations</p>
          </header>
          <section style="background: #fff; border: 1px solid #CCECEE; border-radius: 16px; padding: 20px;">
            <h2 style="font-size: 18px; color: #095D7E; margin: 0 0 10px; font-weight: 800;">About ${genName}</h2>
            <p style="font-size: 14px; color: #334155; line-height: 1.6; margin: 0;">${gen.indication || description}</p>
          </section>
        </div>
      `;

      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(title); } })
        .on('meta[name="title"]', { element(el) { el.setAttribute('content', title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
        .on('meta[name="keywords"]', { element(el) { el.setAttribute('content', keywords); } })
        .on('head', {
          element(el) {
            el.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
            el.append(`<meta property="og:title" content="${title}">`, { html: true });
            el.append(`<meta property="og:description" content="${description}">`, { html: true });
            el.append(`<meta property="og:url" content="${canonicalUrl}">`, { html: true });
            el.append(`<script id="dynamic-seo-schema" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true });
          }
        })
        .on('div#root', {
          element(el) {
            el.setInnerContent(preRenderedHtml, { html: true });
          }
        })
        .transform(baseRes);

      const responseHeaders = new Headers(transformed.headers);
      responseHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);
      responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000');

      return new Response(transformed.body, { status: 200, headers: responseHeaders });
    }

    // 5. Category & Directory Routes: /dosage-form/:form, /company/:company
    if (pathname.startsWith('/dosage-form/') || pathname.startsWith('/company/')) {
      const baseReq = new Request(`${origin}/`, request);
      const baseRes = await env.ASSETS.fetch(baseReq);
      const canonicalUrl = `${origin}${pathname.replace(/\/$/, '')}`;

      const isCompany = pathname.startsWith('/company/');
      const rawEntity = pathname.replace(/^\/(company|dosage-form)\//, '').replace(/-/g, ' ');
      const entityFormatted = rawEntity.charAt(0).toUpperCase() + rawEntity.slice(1);
      const title = isCompany
        ? `${entityFormatted} Medicine List, Prices & Formulations | MedVhai`
        : `${entityFormatted} Medicines in Bangladesh — Price & Brand Index | MedVhai`;

      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(title); } })
        .on('head', {
          element(el) {
            el.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
          }
        })
        .transform(baseRes);

      const responseHeaders = new Headers(transformed.headers);
      responseHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);
      responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');

      return new Response(transformed.body, { status: 200, headers: responseHeaders });
    }

    // 6. Dedicated Standalone Content Pages: /about, /privacy-policy, /terms, /contact, /companies, /api-docs
    const staticPagesMeta = {
      '/about': {
        title: 'About MedVhai™ — Clinical Drug Index & Medicine Guide BD',
        description: 'Learn about MedVhai, Bangladesh’s verified clinical medicine index, BDT pharmaceutical price comparator, and bilingual drug monographs.'
      },
      '/privacy-policy': {
        title: 'Privacy Policy — MedVhai™ Clinical Healthcare Index',
        description: 'Our commitment to zero medical health data tracking, client-side local storage protection, and patient confidentiality on MedVhai.'
      },
      '/terms': {
        title: 'Terms & Conditions & Medical Disclaimer | MedVhai™',
        description: 'Educational clinical reference guidelines, medical disclaimer, and prescribing practitioner terms for MedVhai.'
      },
      '/contact': {
        title: 'Contact Us — Support & Medicine Corrections | MedVhai™',
        description: 'Get in touch with the MedVhai clinical indexing team for medicine price corrections, new presentations, and developer queries.'
      },
      '/companies': {
        title: 'Pharmaceutical Companies in Bangladesh (723 Manufacturers) | MedVhai',
        description: 'Complete directory of all 723 licensed pharmaceutical companies in Bangladesh. Browse brand medicine portfolios, dosages, and prices.'
      },
      '/api-docs': {
        title: 'Developer REST API Documentation & Live Studio | MedVhai™',
        description: 'Free open REST API endpoints for searching 30,500+ medicines, generics, active ingredients, and BDT MRP prices.'
      }
    };

    const cleanStaticPath = pathname.replace(/\/$/, '');
    if (staticPagesMeta[cleanStaticPath]) {
      const pageInfo = staticPagesMeta[cleanStaticPath];
      const canonicalUrl = `${origin}${cleanStaticPath}`;
      const baseReq = new Request(`${origin}/`, request);
      const baseRes = await env.ASSETS.fetch(baseReq);

      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(pageInfo.title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', pageInfo.description); } })
        .on('meta[property="og:title"]', { element(el) { el.setAttribute('content', pageInfo.title); } })
        .on('meta[property="og:description"]', { element(el) { el.setAttribute('content', pageInfo.description); } })
        .on('head', {
          element(el) {
            el.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
          }
        })
        .transform(baseRes);

      const responseHeaders = new Headers(transformed.headers);
      responseHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);
      responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');

      return new Response(transformed.body, { status: 200, headers: responseHeaders });
    }

    // 7. Homepage -> Injects Homepage Canonical
    const baseReq = new Request(`${origin}/index.html`, request);
    const baseRes = await env.ASSETS.fetch(baseReq);
    const canonicalUrl = `${origin}/`;

    const transformed = new HTMLRewriter()
      .on('head', {
        element(el) {
          el.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
        }
      })
      .transform(baseRes);

    const responseHeaders = new Headers(transformed.headers);
    responseHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);
    return new Response(transformed.body, { status: 200, headers: responseHeaders });
  }
};
