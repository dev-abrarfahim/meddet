/**
 * MedVhai Enterprise Cloudflare Edge Worker (_worker.js)
 * 
 * Provides:
 * 1. Dynamic Edge SSR HTML Pre-rendering & Metadata Injection via HTMLRewriter
 * 2. Self-referencing Canonical Tags & HTTP Link Canonical Headers
 * 3. 301 Permanent Redirects for Legacy Query Parameters (/?id=... -> /medicine/...)
 * 4. Fast O(1) In-Memory Cached Dataset Indexing in Edge RAM
 * 5. Accurate HTTP 404 Handling for Invalid Medicine IDs (Preventing Soft-404s)
 * 6. Public REST API Router (/api/v1/*)
 * 7. Edge Caching & Fast Static Asset Pass-through
 */

const SITE_BASE_URL = 'https://medvhai.heliox.workers.dev';

// In-Memory Global Dataset Cache for Edge Isolate
let cachedMedicinesMap = null;
let cachedGenericsMap = null;
let cachedCompaniesMap = null;

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
  
  // 1. Try extracting trailing 4-char alphanumeric code
  const codeMatch = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  if (codeMatch) {
    const decoded = decodeId(codeMatch[1]);
    if (decoded) return decoded;
  }

  // 2. Fallback: Try extracting legacy raw numeric ID
  const match = clean.match(/-(\d+)$/) || clean.match(/^(\d+)$/);
  if (match) {
    const id = parseInt(match[1], 10);
    return isNaN(id) ? null : id;
  }
  return null;
}

function parseGenericIdFromSlug(slugOrPath) {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/generic\//, '').replace(/\/$/, '');
  
  // 1. Try extracting trailing 4-char alphanumeric code
  const codeMatch = clean.match(/-([0-9a-z]{4})$/i) || clean.match(/^([0-9a-z]{4})$/i);
  if (codeMatch) {
    const decoded = decodeId(codeMatch[1]);
    if (decoded) return decoded;
  }

  // 2. Fallback: Try extracting legacy raw numeric ID
  const match = clean.match(/-(\d+)$/) || clean.match(/^(\d+)$/);
  if (match) {
    const id = parseInt(match[1], 10);
    return isNaN(id) ? null : id;
  }
  return null;
}

async function loadDataMaps(origin, env) {
  if (cachedMedicinesMap && cachedGenericsMap) {
    return { medicines: cachedMedicinesMap, generics: cachedGenericsMap, companies: cachedCompaniesMap };
  }

  try {
    const brandsReq = new Request(`${origin}/data/brands.json`);
    const brandsRes = await env.ASSETS.fetch(brandsReq);
    if (brandsRes.ok) {
      const brandsList = await brandsRes.json();
      const medMap = new Map();
      for (const m of brandsList) {
        medMap.set(m.id, m);
      }
      cachedMedicinesMap = medMap;
    }
  } catch (err) {
    console.error('Failed to load brands.json in worker:', err);
  }

  try {
    const genReq = new Request(`${origin}/data/generics.json`);
    const genRes = await env.ASSETS.fetch(genReq);
    if (genRes.ok) {
      const genList = await genRes.json();
      const genMap = new Map();
      for (const g of genList) {
        genMap.set(g.id, g);
      }
      cachedGenericsMap = genMap;
    }
  } catch (err) {
    console.error('Failed to load generics.json in worker:', err);
  }

  return {
    medicines: cachedMedicinesMap || new Map(),
    generics: cachedGenericsMap || new Map(),
    companies: cachedCompaniesMap || new Map()
  };
}

function generate404Html(resourceType, identifier) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 — ${resourceType} Not Found | MedVhai™ Clinical Drug Index</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${SITE_BASE_URL}/">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <style>
    :root {
      --bg: #F1F9FF;
      --card-bg: #ffffff;
      --text-main: #095D7E;
      --text-muted: #526E7E;
      --accent: #14967F;
      --accent-hover: #11806C;
      --border: #CCECEE;
      --chip-bg: #EAF4F9;
      --chip-hover: #E2FCD6;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0B131B;
        --card-bg: #131B2E;
        --text-main: #E2FCD6;
        --text-muted: #94A3B8;
        --accent: #2DD4BF;
        --accent-hover: #14967F;
        --border: #1E3A52;
        --chip-bg: #1E293B;
        --chip-hover: #064E3B;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text-main);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
    }
    .container {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 40px 28px;
      max-width: 600px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 40px rgba(9, 93, 126, 0.08);
      position: relative;
    }
    .badge-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 16px;
      background: #E2FCD6;
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);
    }
    @media (prefers-color-scheme: dark) {
      .badge-icon { background: #064E3B; }
    }
    .badge-icon svg { width: 44px; height: 44px; stroke: #14967F; }
    .badge-404 {
      display: inline-block;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: #095D7E;
      color: #E2FCD6;
      padding: 4px 10px;
      border-radius: 999px;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 28px;
      font-weight: 900;
      color: var(--text-main);
      margin-bottom: 8px;
      line-height: 1.2;
    }
    p.subtitle {
      font-size: 14px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 24px;
    }
    .search-form {
      display: flex;
      gap: 8px;
      background: var(--bg);
      border: 2px solid var(--border);
      border-radius: 16px;
      padding: 6px;
      margin-bottom: 24px;
      transition: border 0.2s;
    }
    .search-form:focus-within {
      border-color: var(--accent);
    }
    .search-form input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 8px 12px;
      font-size: 14px;
      font-weight: 600;
      color: var(--text-main);
      outline: none;
    }
    .search-form button {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .search-form button:hover {
      background: var(--accent-hover);
    }
    .chips-section {
      text-align: left;
      margin-bottom: 20px;
    }
    .chips-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      display: inline-block;
      padding: 6px 12px;
      background: var(--chip-bg);
      color: var(--text-main);
      text-decoration: none;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      transition: all 0.15s;
    }
    .chip:hover {
      background: var(--chip-hover);
      color: #095D7E;
    }
    .home-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #095D7E;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 14px;
      font-weight: 800;
      font-size: 14px;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(9,93,126,0.2);
    }
    .home-btn:hover {
      background: #074760;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/>
        <path d="m8.5 8.5 7 7"/>
      </svg>
    </div>

    <span class="badge-404">HTTP 404 — ${resourceType} Not Found</span>
    <h1>Medicine Record Not Found</h1>
    <p class="subtitle">We couldn't find any ${resourceType.toLowerCase()} record matching "<strong>${identifier}</strong>". It may have been discontinued or the URL is incorrect.</p>

    <!-- Instant Search Recovery -->
    <form class="search-form" action="/" method="GET">
      <input type="text" name="q" placeholder="Search 30,500+ medicines (e.g. Napa, Seclo)..." autofocus required>
      <button type="submit">Search</button>
    </form>

    <!-- Popular Searches -->
    <div class="chips-section">
      <div class="chips-title">Popular Medicine Searches:</div>
      <div class="chips-list">
        <a href="/medicine/napa-500mg-tablet-g182" class="chip">Napa 500mg</a>
        <a href="/medicine/seclo-20mg-capsule-ymhk" class="chip">Seclo 20mg</a>
        <a href="/medicine/maxpro-20mg-tablet-e70u" class="chip">Maxpro 20mg</a>
        <a href="/medicine/sergel-20mg-capsule-sfzg" class="chip">Sergel 20mg</a>
        <a href="/medicine/ace-500mg-tablet-rz9o" class="chip">Ace 500mg</a>
        <a href="/medicine/monas-10-10mg-tablet-wjyr" class="chip">Monas 10mg</a>
      </div>
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

    // 2. Load In-Memory Data Maps for Edge Lookup
    const { medicines, generics } = await loadDataMaps(origin, env);

    // 3. Legacy Query Parameter 301 Permanent Migration
    // Case A: /?id=14521&brand=... or /?id=14521
    if (pathname === '/' && searchParams.has('id')) {
      const rawId = searchParams.get('id');
      const id = parseInt(rawId, 10);
      if (!isNaN(id) && medicines.has(id)) {
        const med = medicines.get(id);
        const destination = `${origin}${getMedicineCanonicalPath(med)}`;
        return Response.redirect(destination, 301);
      } else {
        return new Response(generate404Html('Medicine', rawId || ''), {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
    }

    // Case B: /?genericId=1124&generic=... or /?genericId=1124
    if (pathname === '/' && searchParams.has('genericId')) {
      const rawGId = searchParams.get('genericId');
      const gId = parseInt(rawGId, 10);
      if (!isNaN(gId) && generics.has(gId)) {
        const gen = generics.get(gId);
        const destination = `${origin}${getGenericCanonicalPath(gen)}`;
        return Response.redirect(destination, 301);
      } else {
        return new Response(generate404Html('Generic Monograph', rawGId || ''), {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
    }

    // 4. Clean Medicine Route: /medicine/:slug (e.g., /medicine/napa-500mg-tablet-14521)
    if (pathname.startsWith('/medicine/')) {
      const medId = parseMedicineIdFromSlug(pathname);
      if (!medId || !medicines.has(medId)) {
        return new Response(generate404Html('Medicine', pathname.replace('/medicine/', '')), {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, follow'
          }
        });
      }

      const med = medicines.get(medId);
      const canonicalPath = getMedicineCanonicalPath(med);
      const canonicalUrl = `${origin}${canonicalPath}`;

      // Canonical URL Normalization & Slug-ID Consistency Enforcement:
      // If requested with mismatched slug or forbidden legacy medicine query parameters, 301 to exact clean canonical URL
      const hasForbiddenQuery = searchParams.has('id') || searchParams.has('brand') || searchParams.has('medicineId') || searchParams.has('genericId');
      if (pathname !== canonicalPath || hasForbiddenQuery) {
        return Response.redirect(canonicalUrl, 301);
      }

      // Fetch base index.html template
      const baseReq = new Request(`${origin}/index.html`, request);
      const baseRes = await env.ASSETS.fetch(baseReq);

      const brandName = med.name;
      const strength = med.strength || '';
      const form = med.form || 'Medicine';
      const company = med.company || 'Pharmaceuticals';
      const genericName = med.genericName || 'Active Ingredient';
      const genericBn = med.genericNameBn ? ` (${med.genericNameBn})` : '';
      const priceFormatted = med.mrp > 0 ? `৳${med.mrp.toFixed(2)}` : 'N/A';

      const title = `${brandName} ${strength} ${form} — Uses, Price, Dosage & Alternatives | MedVhai`.replace(/\s+/g, ' ');
      const description = `Learn about ${brandName} ${strength} ${form} by ${company}. Generic: ${genericName}${genericBn}. MRP Price: ${priceFormatted} BDT. View dosage, indications, side effects, precautions & lower-cost alternative brands on MedVhai.`.replace(/\s+/g, ' ');
      const keywords = `${brandName}, ${genericName}, ${company}, ${brandName} price in BD, ${brandName} dosage, ${brandName} uses, ${form}, medicine BD, MedVhai`;
      const imageUrl = `${origin}/icons/${slugify(form)}.png`;
      const logoUrl = `${origin}/logo.png`;

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
        'strengthValue': strength || 'N/A',
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
          'seller': { '@type': 'Organization', 'name': 'MedVhai' },
          'hasMerchantReturnPolicy': {
            '@type': 'MerchantReturnPolicy',
            'applicableCountry': 'BD',
            'returnPolicyCategory': 'https://schema.org/MerchantReturnNotPermitted'
          },
          'shippingDetails': {
            '@type': 'OfferShippingDetails',
            'shippingRate': { '@type': 'MonetaryAmount', 'value': '0', 'currency': 'BDT' },
            'shippingDestination': [{ '@type': 'DefinedRegion', 'addressCountry': 'BD' }]
          }
        }
      };

      const preRenderedHtml = `
        <div class="mv-skel" style="padding: 20px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
          <header style="border-bottom: 1px solid #CCECEE; padding-bottom: 16px; margin-bottom: 20px;">
            <a href="/" style="color: #14967F; text-decoration: none; font-size: 14px; font-weight: bold;">← Back to MedVhai Clinical Index</a>
            <h1 style="font-size: 28px; color: #095D7E; margin: 12px 0 6px;">${brandName} <span style="font-size: 18px; color: #14967F; font-family: monospace;">${strength} ${form}</span></h1>
            <p style="font-size: 16px; color: #074760; margin: 0; font-weight: bold;">Generic: ${genericName}${genericBn}</p>
            <p style="font-size: 14px; color: #666; margin: 4px 0 0;">Manufactured by: <strong>${company}</strong></p>
          </header>
          
          <section style="background: #fff; border: 1px solid #CCECEE; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h2 style="font-size: 18px; color: #095D7E; margin-top: 0;">Pricing & Pack Details</h2>
            <p style="font-size: 20px; font-weight: bold; color: #14967F; margin: 0;">MRP Unit Price: ${priceFormatted} BDT</p>
            <p style="font-size: 13px; color: #777; margin: 4px 0 0;">Available Pack Size: ${med.packSize || 'Standard Presentation'}</p>
          </section>

          <section style="background: #fff; border: 1px solid #CCECEE; border-radius: 12px; padding: 16px;">
            <h2 style="font-size: 18px; color: #095D7E; margin-top: 0;">Clinical Monograph & Alternatives</h2>
            <p style="font-size: 14px; color: #444; line-height: 1.6;">${description}</p>
            <p><a href="${getGenericCanonicalPath({ id: med.genericId, name: genericName })}" style="color: #14967F; font-weight: bold;">Explore all alternative brands for ${genericName} →</a></p>
          </section>
        </div>
      `;

      // Edge HTML Rewriter Transformation
      const transformed = new HTMLRewriter()
        .on('title', {
          element(el) {
            el.setInnerContent(title);
          }
        })
        .on('meta[name="title"]', {
          element(el) {
            el.setAttribute('content', title);
          }
        })
        .on('meta[name="description"]', {
          element(el) {
            el.setAttribute('content', description);
          }
        })
        .on('meta[name="keywords"]', {
          element(el) {
            el.setAttribute('content', keywords);
          }
        })
        .on('link[rel="canonical"]', {
          element(el) {
            el.setAttribute('href', canonicalUrl);
          }
        })
        .on('meta[property="og:title"]', {
          element(el) {
            el.setAttribute('content', title);
          }
        })
        .on('meta[property="og:description"]', {
          element(el) {
            el.setAttribute('content', description);
          }
        })
        .on('meta[property="og:url"]', {
          element(el) {
            el.setAttribute('content', canonicalUrl);
          }
        })
        .on('meta[property="twitter:title"]', {
          element(el) {
            el.setAttribute('content', title);
          }
        })
        .on('meta[property="twitter:description"]', {
          element(el) {
            el.setAttribute('content', description);
          }
        })
        .on('meta[property="twitter:url"]', {
          element(el) {
            el.setAttribute('content', canonicalUrl);
          }
        })
        .on('head', {
          element(el) {
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
      responseHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');

      return new Response(transformed.body, {
        status: 200,
        headers: responseHeaders
      });
    }

    // 5. Clean Generic Route: /generic/:slug (e.g., /generic/paracetamol-1124)
    if (pathname.startsWith('/generic/')) {
      const genId = parseGenericIdFromSlug(pathname);
      if (!genId || !generics.has(genId)) {
        return new Response(generate404Html('Generic Monograph', pathname.replace('/generic/', '')), {
          status: 404,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'X-Robots-Tag': 'noindex, follow'
          }
        });
      }

      const gen = generics.get(genId);
      const canonicalPath = getGenericCanonicalPath(gen);
      const canonicalUrl = `${origin}${canonicalPath}`;

      const hasForbiddenGenQuery = searchParams.has('id') || searchParams.has('brand') || searchParams.has('genericId');
      if (pathname !== canonicalPath || hasForbiddenGenQuery) {
        return Response.redirect(canonicalUrl, 301);
      }

      const baseReq = new Request(`${origin}/index.html`, request);
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
        <div class="mv-skel" style="padding: 20px; max-width: 900px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
          <header style="border-bottom: 1px solid #CCECEE; padding-bottom: 16px; margin-bottom: 20px;">
            <a href="/" style="color: #14967F; text-decoration: none; font-size: 14px; font-weight: bold;">← Back to MedVhai Clinical Index</a>
            <h1 style="font-size: 28px; color: #095D7E; margin: 12px 0 6px;">${genName} <span style="font-size: 18px; color: #666;">${genBn}</span></h1>
            <p style="font-size: 14px; color: #074760; margin: 0; font-weight: bold;">Clinical Monograph & Brand Directory</p>
          </header>
          <section style="background: #fff; border: 1px solid #CCECEE; border-radius: 12px; padding: 16px;">
            <h2 style="font-size: 18px; color: #095D7E; margin-top: 0;">About ${genName}</h2>
            <p style="font-size: 14px; color: #444; line-height: 1.6;">${description}</p>
          </section>
        </div>
      `;

      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(title); } })
        .on('meta[name="title"]', { element(el) { el.setAttribute('content', title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
        .on('meta[name="keywords"]', { element(el) { el.setAttribute('content', keywords); } })
        .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', canonicalUrl); } })
        .on('meta[property="og:title"]', { element(el) { el.setAttribute('content', title); } })
        .on('meta[property="og:description"]', { element(el) { el.setAttribute('content', description); } })
        .on('meta[property="og:url"]', { element(el) { el.setAttribute('content', canonicalUrl); } })
        .on('head', {
          element(el) {
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
      responseHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');

      return new Response(transformed.body, {
        status: 200,
        headers: responseHeaders
      });
    }

    // 6. Category & Directory Routes: /dosage-form/:form, /company/:company
    if (pathname.startsWith('/dosage-form/') || pathname.startsWith('/company/')) {
      const baseReq = new Request(`${origin}/index.html`, request);
      const baseRes = await env.ASSETS.fetch(baseReq);
      const canonicalUrl = `${origin}${pathname.replace(/\/$/, '')}`;

      const transformed = new HTMLRewriter()
        .on('link[rel="canonical"]', {
          element(el) {
            el.setAttribute('href', canonicalUrl);
          }
        })
        .transform(baseRes);

      const responseHeaders = new Headers(transformed.headers);
      responseHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);
      responseHeaders.set('Cache-Control', 'public, max-age=3600, s-maxage=86400');

      return new Response(transformed.body, {
        status: 200,
        headers: responseHeaders
      });
    }

    // 7. Homepage and other valid routes -> Return base index.html
    const defaultRes = await env.ASSETS.fetch(request);
    return defaultRes;
  }
};
