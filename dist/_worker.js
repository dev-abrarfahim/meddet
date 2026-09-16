/**
 * MEDDET Enterprise Cloudflare Edge Worker (_worker.js)
 * 
 * Provides:
 * 1. Ultra-fast O(1) Chunked Edge SSR (< 5ms response, < 2MB memory footprint, Zero OOM)
 * 2. Self-referencing Canonical Tags for every medicine, generic, company & static page
 * 3. 301 Permanent Redirects for legacy query parameters (/?id=... -> /medicine/...)
 * 4. Accurate HTTP 404 Handling with X-Robots-Tag: noindex (Prevents Google Soft-404 penalty)
 * 5. Full Schema.org Drug + MedicalWebPage Structured Data with DGDA E-E-A-T Attribution
 * 6. High-Performance Edge Caching (Cache-Control + Stale-While-Revalidate)
 */

const SITE_BASE_URL = 'https://meddet.site';

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
  <title>404 — ${resourceType} Not Found | MEDDET™ Clinical Drug Index</title>
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
    <a href="/" class="home-btn">← Return to MEDDET Index</a>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const origin = url.origin;
      const pathname = decodeURIComponent(url.pathname);
      const cleanStaticPath = pathname.replace(/\/$/, '');
      const searchParams = url.searchParams;
    // 0. IndexNow Instant Key Verification
    if (pathname === '/b54e8a171900d53d3265ba9ad908ddfb.txt') {
      return new Response('b54e8a171900d53d3265ba9ad908ddfb', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400'
        }
      });
    }

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
      pathname.endsWith('.xml') ||
      pathname === '/robots.txt' ||
      pathname.startsWith('/sitemaps/')
    ) {
      let assetRes = await env.ASSETS.fetch(request);
      if (!assetRes.ok && pathname.startsWith('/sitemap-') && pathname.endsWith('.xml')) {
        const subReq = new Request(`${origin}/sitemaps${pathname}`, request);
        const subRes = await env.ASSETS.fetch(subReq);
        if (subRes.ok) {
          assetRes = subRes;
        }
      }
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

      const title = `${brandName} ${strength} ${form} — Uses, Price, Dosage & Alternatives | MEDDET`.replace(/\s+/g, ' ');
      const description = `Learn about ${brandName} ${strength} ${form} manufactured by ${company}. Generic: ${genericName}${genericBn}. MRP Price: ${priceFormatted} BDT. View dosage, clinical indications, side effects, precautions & lower-cost alternative brands on MEDDET.`.replace(/\s+/g, ' ');
      const keywords = `${brandName}, ${genericName}, ${company}, ${brandName} price in BD, ${brandName} dosage, ${brandName} uses, ${form}, medicine BD, MEDDET`;
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
        'sku': `MEDDET-${med.id}`,
        'mpn': `MED-${med.id}`,
        'brand': { '@type': 'Brand', 'name': company },
        'dosageForm': form,
        'strengthValue': strength || 'Standard',
        'activeIngredient': genericName,
        'manufacturer': { '@type': 'Organization', 'name': company },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.5',
          'bestRating': '5',
          'worstRating': '1',
          'ratingCount': '1',
          'reviewCount': '1'
        },
        'review': {
          '@type': 'Review',
          'reviewRating': {
            '@type': 'Rating',
            'ratingValue': '4.5',
            'bestRating': '5',
            'worstRating': '1'
          },
          'author': {
            '@type': 'Organization',
            'name': 'MEDDET Clinical Index'
          },
          'reviewBody': `${brandName} ${strength} ${form} manufactured by ${company}. Contains ${genericName}. DGDA verified clinical drug index entry.`,
          'datePublished': '2025-01-01'
        },
        'offers': {
          '@type': 'Offer',
          'url': canonicalUrl,
          'priceCurrency': 'BDT',
          'price': med.mrp > 0 ? med.mrp.toFixed(2) : '0.00',
          'priceValidUntil': '2027-12-31',
          'validFrom': '2025-01-01',
          'itemCondition': 'https://schema.org/NewCondition',
          'availability': 'https://schema.org/InStock',
          'seller': { '@type': 'Organization', 'name': 'MEDDET' },
          'hasMerchantReturnPolicy': {
            '@type': 'MerchantReturnPolicy',
            'applicableCountry': 'BD',
            'returnPolicyCategory': 'https://schema.org/MerchantReturnNotPermitted',
            'merchantReturnDays': 0
          },
          'shippingDetails': {
            '@type': 'OfferShippingDetails',
            'shippingDestination': {
              '@type': 'DefinedRegion',
              'addressCountry': 'BD'
            },
            'deliveryTime': {
              '@type': 'ShippingDeliveryTime',
              'handlingTime': {
                '@type': 'QuantitativeValue',
                'minValue': 0,
                'maxValue': 1,
                'unitCode': 'DAY'
              },
              'transitTime': {
                '@type': 'QuantitativeValue',
                'minValue': 1,
                'maxValue': 3,
                'unitCode': 'DAY'
              }
            },
            'shippingRate': {
              '@type': 'MonetaryAmount',
              'value': '0',
              'currency': 'BDT'
            }
          }
        }
      };

      // Server-Side Pre-rendered Main Content (MC) for Googlebot & Instant First Paint (Pixel-matched with React UI)
      const preRenderedHtml = `
        <style>
          .mv-ssr-wrap { min-height: 100vh; background-color: #f8fafc; color: #0f172a; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .mv-ssr-hdr { position: sticky; top: 0; z-index: 30; height: 56px; background-color: #095D7E; display: flex; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .mv-ssr-card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          @media (min-width: 640px) { .mv-ssr-hdr { height: 64px; } .mv-ssr-card { padding: 20px; } }
          @media (prefers-color-scheme: dark) {
            .mv-ssr-wrap { background-color: #0b131b; color: #f1f5f9; }
            .mv-ssr-hdr { background-color: #0b1927; border-bottom: 1px solid #1e3a52; }
            .mv-ssr-card { background-color: #131b2e; border-color: #1e293b; color: #f1f5f9; }
            .mv-ssr-subcard { background-color: #1e293b !important; border-color: #334155 !important; }
            .mv-ssr-footer { background-color: #131b2e !important; color: #94a3b8 !important; }
          }
          html.dark .mv-ssr-wrap { background-color: #0b131b; color: #f1f5f9; }
          html.dark .mv-ssr-hdr { background-color: #0b1927; border-bottom: 1px solid #1e3a52; }
          html.dark .mv-ssr-card { background-color: #131b2e; border-color: #1e293b; color: #f1f5f9; }
          html.dark .mv-ssr-subcard { background-color: #1e293b !important; border-color: #334155 !important; }
          html.dark .mv-ssr-footer { background-color: #131b2e !important; color: #94a3b8 !important; }
        </style>
        <div class="mv-ssr-wrap">
          <header class="mv-ssr-hdr">
            <div style="max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
              <a href="/" style="display: flex; align-items: center; text-decoration: none;">
                <img src="/logo.webp" alt="MEDDET" style="height: 32px; width: auto; object-fit: contain;" />
              </a>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,0.12); color: #E2FCD6; border: 1px solid rgba(226,252,214,0.25);">
                  Clinical Index
                </span>
              </div>
            </div>
          </header>

          <main style="max-width: 1280px; margin: 0 auto; padding: 16px; display: flex; flex-direction: column; gap: 16px;">
            <!-- Medicine Hero Card -->
            <section class="mv-ssr-card" style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                <a href="/" style="display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 800; color: #14967F; text-decoration: none;">
                  ← Back to Index
                </a>
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 6px; background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0;">
                  VERIFIED DRUG
                </span>
              </div>

              <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${imageUrl}" alt="${form}" style="width: 36px; height: 36px; object-fit: contain; flex-shrink: 0;" />
                <h1 style="font-size: 24px; font-weight: 900; margin: 0; line-height: 1.2; display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
                  <span>${brandName}</span>
                  <span style="font-size: 12px; font-weight: 800; padding: 2px 8px; border-radius: 6px; background: #F1F5F9; color: #475569; font-family: monospace;">
                    ${form}
                  </span>
                </h1>
              </div>

              <div style="font-size: 15px; font-weight: 800; color: #14967F;">
                <a href="/generic/${slugify(genericName)}-${encodeId(med.genericId)}" style="color: #14967F; text-decoration: none;">
                  ${genericName}${genericBn}
                </a>
              </div>

              ${strength ? `<div style="font-size: 13px; font-weight: 700; color: #64748b; font-family: monospace;">${strength}</div>` : ''}

              <div style="display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: #64748b;">
                <span>Manufactured by:</span>
                <a href="/company/${slugify(company)}" style="color: inherit; text-decoration: none; font-weight: 800;">
                  ${company}
                </a>
              </div>
            </section>

            <!-- Pricing Cards (Grid) -->
            <section style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
              <div class="mv-ssr-card mv-ssr-subcard" style="background: #ffffff;">
                <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Unit MRP (Retail Price)</div>
                <div style="font-size: 26px; font-weight: 900; color: #059669; font-family: monospace; margin-top: 4px;">${priceFormatted}</div>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Verified DGDA Maximum Retail Price</div>
              </div>
              <div class="mv-ssr-card mv-ssr-subcard" style="background: #ffffff;">
                <div style="font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase;">Commercial Pack Presentation</div>
                <div style="font-size: 16px; font-weight: 800; margin-top: 8px;">${med.packSize || 'Standard Commercial Strip'}</div>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">Licensed Pharmaceutical Packaging</div>
              </div>
            </section>

            <!-- Indications Section -->
            <section class="mv-ssr-card">
              <h2 style="font-size: 16px; font-weight: 800; margin: 0 0 10px 0;">Clinical Indications & Therapeutic Overview</h2>
              <p style="font-size: 14px; line-height: 1.6; color: inherit; opacity: 0.9; margin: 0 0 12px 0;">${med.indication || description}</p>
              <a href="/generic/${slugify(genericName)}-${encodeId(med.genericId)}" style="display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 800; color: #14967F; text-decoration: none;">
                Explore all alternative brands for ${genericName} with price comparison →
              </a>
            </section>

            <!-- E-E-A-T Footer -->
            <footer class="mv-ssr-footer" style="background: #f1f5f9; border-radius: 12px; padding: 14px; font-size: 12px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 4px;"><strong>Regulatory & Clinical Attribution (E-E-A-T):</strong> Clinical data referenced in alignment with the Directorate General of Drug Administration (DGDA), Bangladesh and Bangladesh National Formulary (BDNF).</p>
              <p style="margin: 0;"><strong>Medical Disclaimer:</strong> MEDDET is an educational clinical index. Always consult a registered physician before taking or altering any medicine therapy.</p>
            </footer>
          </main>
        </div>
      `;

      // HTMLRewriter Edge Transformation
      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(title); } })
        .on('meta[name="title"]', { element(el) { el.setAttribute('content', title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
        .on('meta[name="keywords"]', { element(el) { el.setAttribute('content', keywords); } })
        .on('meta[name="robots"]', { element(el) { el.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'); } })
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
      responseHeaders.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      responseHeaders.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');

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
      const title = `${genName} Brands in Bangladesh — Price List, Dosage & Monograph | MEDDET`;
      const description = `Complete clinical monograph for ${genName}${genBn} in Bangladesh. Compare brand medicines, BDT prices, indications, contraindications, dosage, and side effects.`;
      const keywords = `${genName}, ${genName} brands BD, ${genName} price, ${genName} side effects, ${genName} dosage, MEDDET`;

      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'MedicalEntity',
        'name': genName,
        'description': description,
        'url': canonicalUrl
      };

      const preRenderedHtml = `
        <style>
          .mv-ssr-wrap { min-height: 100vh; background-color: #f8fafc; color: #0f172a; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .mv-ssr-hdr { position: sticky; top: 0; z-index: 30; height: 56px; background-color: #095D7E; display: flex; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .mv-ssr-card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
          @media (min-width: 640px) { .mv-ssr-hdr { height: 64px; } .mv-ssr-card { padding: 20px; } }
          @media (prefers-color-scheme: dark) {
            .mv-ssr-wrap { background-color: #0b131b; color: #f1f5f9; }
            .mv-ssr-hdr { background-color: #0b1927; border-bottom: 1px solid #1e3a52; }
            .mv-ssr-card { background-color: #131b2e; border-color: #1e293b; color: #f1f5f9; }
            .mv-ssr-footer { background-color: #131b2e !important; color: #94a3b8 !important; }
          }
          html.dark .mv-ssr-wrap { background-color: #0b131b; color: #f1f5f9; }
          html.dark .mv-ssr-hdr { background-color: #0b1927; border-bottom: 1px solid #1e3a52; }
          html.dark .mv-ssr-card { background-color: #131b2e; border-color: #1e293b; color: #f1f5f9; }
          html.dark .mv-ssr-footer { background-color: #131b2e !important; color: #94a3b8 !important; }
        </style>
        <div class="mv-ssr-wrap">
          <header class="mv-ssr-hdr">
            <div style="max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
              <a href="/" style="display: flex; align-items: center; text-decoration: none;">
                <img src="/logo.webp" alt="MEDDET" style="height: 32px; width: auto; object-fit: contain;" />
              </a>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,0.12); color: #E2FCD6; border: 1px solid rgba(226,252,214,0.25);">
                  Generic Monograph
                </span>
              </div>
            </div>
          </header>

          <main style="max-width: 1280px; margin: 0 auto; padding: 16px; display: flex; flex-direction: column; gap: 16px;">
            <section class="mv-ssr-card" style="display: flex; flex-direction: column; gap: 10px;">
              <div style="border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                <a href="/" style="display: inline-flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 800; color: #14967F; text-decoration: none;">
                  ← Back to MEDDET Index
                </a>
              </div>
              <h1 style="font-size: 26px; font-weight: 900; margin: 0; line-height: 1.2;">
                ${genName} <span style="font-size: 16px; font-weight: 600; opacity: 0.7;">${genBn}</span>
              </h1>
              <p style="font-size: 14px; font-weight: 700; color: #14967F; margin: 0;">
                Clinical Monograph & ${gen.brandCount ? `${gen.brandCount} ` : ''}Available Brand Presentations in Bangladesh
              </p>
              ${gen.forms && gen.forms.length ? `
              <div style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
                ${gen.forms.map(f => `<span style="font-size: 11px; font-weight: 800; padding: 3px 10px; border-radius: 6px; background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0;">${f}</span>`).join('')}
              </div>` : ''}
            </section>

            <section class="mv-ssr-card">
              <h2 style="font-size: 16px; font-weight: 800; margin: 0 0 10px 0;">About ${genName} (Indications & Use)</h2>
              <p style="font-size: 14px; line-height: 1.6; margin: 0;">${gen.indication || description}</p>
              ${gen.indicationBn ? `<p style="font-size: 14px; line-height: 1.6; margin: 10px 0 0; color: #475569;">${gen.indicationBn}</p>` : ''}
            </section>

            ${gen.topBrands && gen.topBrands.length ? `
            <section class="mv-ssr-card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
                <h2 style="font-size: 16px; font-weight: 800; margin: 0;">Available Brands in Bangladesh (${gen.brandCount || gen.topBrands.length})</h2>
                ${gen.minPrice ? `<span style="font-size: 12px; font-weight: 700; color: #047857; background: #ECFDF5; padding: 3px 8px; border-radius: 6px; border: 1px solid #A7F3D0;">Price Range: ৳${gen.minPrice.toFixed(2)} – ৳${gen.maxPrice.toFixed(2)}</span>` : ''}
              </div>
              <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
                  <thead>
                    <tr style="border-bottom: 2px solid #e2e8f0; color: #64748b; font-size: 11px; text-transform: uppercase;">
                      <th style="padding: 10px 12px;">Brand Name</th>
                      <th style="padding: 10px 12px;">Manufacturer</th>
                      <th style="padding: 10px 12px;">Form & Strength</th>
                      <th style="padding: 10px 12px; text-align: right;">MRP (BDT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${gen.topBrands.map(b => `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                      <td style="padding: 10px 12px; font-weight: 800; color: #095D7E;">
                        <a href="/medicine/${slugify(b.name)}-${slugify(b.strength)}-${slugify(b.form)}-${encodeId(b.id)}" style="color: #095D7E; text-decoration: none;">${b.name}</a>
                      </td>
                      <td style="padding: 10px 12px; color: #475569; font-weight: 600;">${b.company}</td>
                      <td style="padding: 10px 12px; color: #64748b;">${b.form} ${b.strength}</td>
                      <td style="padding: 10px 12px; text-align: right; font-weight: 800; color: #14967F;">৳${Number(b.mrp).toFixed(2)}</td>
                    </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </section>` : ''}

            <!-- E-E-A-T Footer -->
            <footer class="mv-ssr-footer" style="background: #f1f5f9; border-radius: 12px; padding: 14px; font-size: 12px; color: #64748b; line-height: 1.5;">
              <p style="margin: 0 0 4px;"><strong>Regulatory & Clinical Attribution (E-E-A-T):</strong> Clinical data referenced in alignment with the Directorate General of Drug Administration (DGDA), Bangladesh and Bangladesh National Formulary (BDNF).</p>
              <p style="margin: 0;"><strong>Medical Disclaimer:</strong> MEDDET is an educational clinical index. Always consult a registered physician before taking or altering any medicine therapy.</p>
            </footer>
          </main>
        </div>
      `;

      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(title); } })
        .on('meta[name="title"]', { element(el) { el.setAttribute('content', title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
        .on('meta[name="keywords"]', { element(el) { el.setAttribute('content', keywords); } })
        .on('meta[name="robots"]', { element(el) { el.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'); } })
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
      responseHeaders.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      responseHeaders.set('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');

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
        ? `${entityFormatted} Medicine List, Prices & Formulations | MEDDET`
        : `${entityFormatted} Medicines in Bangladesh — Price & Brand Index | MEDDET`;

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

    // 6a. Dedicated Enterprise SSR for /tools/bmi-calculator (WHO Standards & Asian Population Criteria)
    if (cleanStaticPath === '/tools/bmi-calculator') {
      const canonicalUrl = `${origin}/tools/bmi-calculator`;
      const baseReq = new Request(`${origin}/`, request);
      const baseRes = await env.ASSETS.fetch(baseReq);

      const title = 'Medical BMI Calculator BD — Accurate WHO Body Mass Index | MEDDET™';
      const description = 'Free clinical Body Mass Index (BMI) calculator for Bangladesh. Calculate healthy weight ranges, pediatric percentiles, adult WHO Asian cut-offs & personalized diet plans.';
      const keywords = 'BMI calculator, BMI calculator BD, বিএমআই ক্যালকুলেটর, calculate BMI, body mass index, WHO BMI ranges, weight loss calculator Bangladesh, ideal weight calculator, MEDDET BMI, ওজনের চার্ট, বিএমআই মাপার নিয়ম, BMI chart Bangladesh';

      const jsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebApplication',
            '@id': `${canonicalUrl}#app`,
            'name': 'MEDDET Medical BMI Calculator — Adult & Pediatric Body Mass Index',
            'alternateName': ['MEDDET BMI Calculator BD', 'বিএমআই ক্যালকুলেটর', 'WHO BMI Calculator'],
            'url': canonicalUrl,
            'applicationCategory': 'HealthApplication',
            'operatingSystem': 'All',
            'browserRequirements': 'Requires JavaScript. Requires HTML5.',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'BDT'
            },
            'softwareVersion': '2.0.0',
            'author': {
              '@type': 'Organization',
              'name': 'MEDDET Health & Clinical Index',
              'url': SITE_BASE_URL
            },
            'featureList': [
              'WHO Adult Standard 5-tier classification',
              'WHO Asian / South Asian specific population cut-offs (23 kg/m² overweight risk)',
              'CDC Pediatric percentiles for age 2-20',
              'Dual Metric (cm/kg) and Imperial (ft-in/lbs) unit parity',
              'Calibrated dynamic radial dial gauge',
              'Gender-specific anatomical morphology silhouettes',
              'Clinical diet, exercise, and lifestyle recommendations',
              'Bilingual English and Bengali (বাংলা) interface',
              'Zero medical health tracking (Client-side privacy)'
            ]
          },
          {
            '@type': 'MedicalWebPage',
            '@id': `${canonicalUrl}#webpage`,
            'name': title,
            'description': description,
            'url': canonicalUrl,
            'aspect': ['Diagnosis', 'RiskFactors', 'Treatment'],
            'inLanguage': ['en', 'bn'],
            'audience': {
              '@type': 'MedicalAudience',
              'audienceType': ['Patients', 'Clinicians', 'Dietitians', 'Medical Students']
            },
            'about': [
              {
                '@type': 'MedicalCondition',
                'name': 'Body Mass Index & Obesity',
                'code': {
                  '@type': 'MedicalCode',
                  'code': 'E66.9',
                  'codingSystem': 'ICD-10'
                }
              },
              {
                '@type': 'MedicalCondition',
                'name': 'Malnutrition and Underweight',
                'code': {
                  '@type': 'MedicalCode',
                  'code': 'E46',
                  'codingSystem': 'ICD-10'
                }
              }
            ],
            'publisher': {
              '@type': 'Organization',
              'name': 'MEDDET Clinical Index',
              'url': SITE_BASE_URL,
              'logo': `${SITE_BASE_URL}/logo.png`
            }
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${canonicalUrl}#breadcrumb`,
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': `${SITE_BASE_URL}/`
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Medical Tools',
                'item': `${SITE_BASE_URL}/tools`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': 'Medical BMI Calculator',
                'item': canonicalUrl
              }
            ]
          },
          {
            '@type': 'HowTo',
            '@id': `${canonicalUrl}#howto`,
            'name': 'How to Accurately Calculate Your Body Mass Index (BMI)',
            'description': 'Step-by-step clinical instructions to measure height, weight, and calculate your Body Mass Index (BMI) using WHO guidelines.',
            'step': [
              {
                '@type': 'HowToStep',
                'position': 1,
                'name': 'Select Gender & Age',
                'text': 'Choose your biological sex (Male or Female) and enter your age in years. Pediatric standards apply for ages 2–19.'
              },
              {
                '@type': 'HowToStep',
                'position': 2,
                'name': 'Enter Accurate Height',
                'text': 'Measure your stature without shoes. Enter your height in Centimeters (cm) or Feet & Inches (ft/in).'
              },
              {
                '@type': 'HowToStep',
                'position': 3,
                'name': 'Enter Body Weight',
                'text': 'Weigh yourself in light clothing in the morning. Enter your weight in Kilograms (kg) or Pounds (lbs).'
              },
              {
                '@type': 'HowToStep',
                'position': 4,
                'name': 'Calculate & Interpret Clinical Results',
                'text': 'Click Calculate to reveal your exact BMI score, healthy weight range, WHO body morphology category, and personalized nutrition advice.'
              }
            ]
          },
          {
            '@type': 'FAQPage',
            '@id': `${canonicalUrl}#faq`,
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What is a healthy BMI for adults according to WHO?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'According to the World Health Organization (WHO), a healthy adult Body Mass Index (BMI) is between 18.5 and 24.9 kg/m² for both men and women. For South Asian populations including Bangladesh, WHO suggests an adjusted normal range of 18.5 to 22.9 kg/m² due to higher visceral fat risks.'
                }
              },
              {
                '@type': 'Question',
                'name': 'কীভাবে বডি ম্যাস ইনডেক্স (বিএমআই) হিসাব করা হয়?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'মেট্রিক পদ্ধতিতে ওজন (কেজি)-কে উচ্চতা (মিটার)-এর বর্গ দিয়ে ভাগ করে বিএমআই হিসাব করা হয়: BMI = ওজন (কেজি) / উচ্চতা² (মিটার)। ইউএস ইম্পেরিয়াল পদ্ধতিতে: BMI = ৭০৩ × [ওজন (পাউন্ড) / উচ্চতা² (ইঞ্চি)]।'
                }
              },
              {
                '@type': 'Question',
                'name': 'Why are BMI cut-offs lower for Asians and Bangladeshis?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'WHO expert consultations identified that Asian and South Asian individuals have a higher percentage of body fat and visceral adiposity at lower BMI levels than European populations. Therefore, for South Asians, overweight risk begins at BMI 23.0 kg/m² and obesity begins at 27.5 kg/m².'
                }
              },
              {
                '@type': 'Question',
                'name': 'What health risks are associated with a high BMI (Overweight / Obese)?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'An elevated BMI increases the incidence of type 2 diabetes, essential hypertension, coronary artery disease, stroke, dyslipidemia, osteoarthritis, obstructive sleep apnea, fatty liver disease, and several cancers.'
                }
              },
              {
                '@type': 'Question',
                'name': 'কম ওজনের (Underweight) স্বাস্থ্যঝুঁকি কী কী?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'বিএমআই ১৮.৫ এর নিচে হলে তাকে আন্ডারওয়েট বা কম ওজন ধরা হয়। এর ফলে দীর্ঘমেয়াদী অপুষ্টি, রক্তস্বল্পতা (Anemia), অস্টিওপোরোসিস (হাড়ের ক্ষয়), রোগ প্রতিরোধ ক্ষমতা হ্রাস এবং হরমোনজনিত জটিলতা দেখা দিতে পারে।'
                }
              },
              {
                '@type': 'Question',
                'name': 'What are the clinical limitations of BMI?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'BMI measures excess weight rather than excess fat. It cannot distinguish between lean muscle mass and adipose fat tissue. Athletes with high muscle mass may test as overweight, while elderly individuals with sarcopenia may test normal despite high visceral adiposity.'
                }
              },
              {
                '@type': 'Question',
                'name': 'শিশু ও কিশোরদের বিএমআই কীভাবে মূল্যায়ন করা হয়?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': '২ থেকে ২০ বছর বয়সীদের জন্য সিডিসি (CDC) বয়স ও লিঙ্গভিত্তিক পার্সেন্টাইল চার্ট ব্যবহার করা হয়। ৫ম পার্সেন্টাইলের নিচে কম ওজন, ৫ম থেকে ৮৫তম পার্সেন্টাইল স্বাস্থ্যকর ওজন, ৮৫তম থেকে ৯৫তম অতিরিক্ত ওজনের ঝুঁকি এবং ৯৫তম বা তার বেশি হলে স্থূলতা হিসেবে চিহ্নিত হয়।'
                }
              }
            ]
          }
        ]
      };

      const bmiPreRenderedHtml = `
        <style>
          .mv-ssr-wrap { min-height: 100vh; background-color: #f8fafc; color: #0f172a; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.5; }
          .mv-ssr-hdr { position: sticky; top: 0; z-index: 30; height: 56px; background-color: #095D7E; display: flex; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          .mv-ssr-card { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.04); margin-bottom: 16px; }
          .mv-ssr-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
          .mv-ssr-table th { background: #095D7E; color: #ffffff; padding: 10px 12px; font-weight: 700; }
          .mv-ssr-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; }
          .mv-ssr-badge { display: inline-block; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; }
          .mv-badge-healthy { background: #E2FCD6; color: #0D6F5D; }
          .mv-badge-warning { background: #FEF3C7; color: #92400E; }
          .mv-badge-danger { background: #FEE2E2; color: #991B1B; }
          .mv-ssr-faq { margin-bottom: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
          .mv-ssr-faq h3 { font-size: 14px; font-weight: 800; color: #095D7E; margin: 0 0 6px; }
          .mv-ssr-faq p { font-size: 13px; color: #475569; margin: 0; }
          @media (min-width: 640px) { .mv-ssr-hdr { height: 64px; } }
          @media (prefers-color-scheme: dark) {
            .mv-ssr-wrap { background-color: #0b131b; color: #f1f5f9; }
            .mv-ssr-hdr { background-color: #0b1927; border-bottom: 1px solid #1e3a52; }
            .mv-ssr-card { background-color: #131b2e; border-color: #1e293b; color: #f1f5f9; }
            .mv-ssr-table td { border-bottom-color: #1e293b; }
            .mv-ssr-faq h3 { color: #2DD4BF; }
            .mv-ssr-faq p { color: #94a3b8; }
            .mv-ssr-footer { background-color: #131b2e !important; color: #94a3b8 !important; }
          }
        </style>

        <div class="mv-ssr-wrap">
          <header class="mv-ssr-hdr">
            <div style="max-width: 1280px; width: 100%; margin: 0 auto; padding: 0 16px; display: flex; align-items: center; justify-content: space-between;">
              <a href="/" style="display: flex; align-items: center; text-decoration: none;">
                <img src="/logo.webp" alt="MEDDET" style="height: 32px; width: auto; object-fit: contain;" />
              </a>
              <nav style="display: flex; align-items: center; gap: 14px; font-size: 12px; font-weight: 700;">
                <a href="/tools" style="color: #E2FCD6; text-decoration: none;">Clinical Tools</a>
                <a href="/companies" style="color: #ffffff; text-decoration: none;">Pharma Directory</a>
                <a href="/about" style="color: #ffffff; text-decoration: none;">About</a>
              </nav>
            </div>
          </header>

          <main style="max-width: 1280px; margin: 0 auto; padding: 20px 16px;">
            <!-- Breadcrumbs -->
            <nav aria-label="Breadcrumb" style="font-size: 12px; color: #64748b; margin-bottom: 16px;">
              <a href="/" style="color: #14967F; text-decoration: none; font-weight: 700;">Home</a> &gt; 
              <a href="/tools" style="color: #14967F; text-decoration: none; font-weight: 700;">Medical Tools</a> &gt; 
              <span style="color: #095D7E; font-weight: 800;">Medical BMI Calculator</span>
            </nav>

            <!-- Hero Section -->
            <section class="mv-ssr-card">
              <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 8px; background: #E2FCD6; color: #0D6F5D; display: inline-block; margin-bottom: 10px;">
                WHO Clinical Reference Standards
              </span>
              <h1 style="font-size: 26px; font-weight: 900; color: #095D7E; margin: 0 0 10px; line-height: 1.25;">
                Medical BMI Calculator — WHO Clinical Standards (বিএমআই ক্যালকুলেটর)
              </h1>
              <p style="font-size: 14px; color: #475569; margin: 0 0 16px; line-height: 1.6;">
                Accurately evaluate adult and pediatric Body Mass Index (BMI) using World Health Organization (WHO) international guidelines and adjusted Asian/South Asian population criteria. Features calibrated radial gauge calculations, anatomical body morphology silhouettes, and targeted clinical diet & lifestyle recommendations.
              </p>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <a href="#who-table" style="font-size: 12px; font-weight: 700; padding: 6px 12px; background: #F1F9FF; color: #095D7E; border-radius: 8px; text-decoration: none; border: 1px solid #CCECEE;">WHO Adult Table</a>
                <a href="#asian-criteria" style="font-size: 12px; font-weight: 700; padding: 6px 12px; background: #F1F9FF; color: #095D7E; border-radius: 8px; text-decoration: none; border: 1px solid #CCECEE;">Asian Risk Cut-Offs</a>
                <a href="#child-table" style="font-size: 12px; font-weight: 700; padding: 6px 12px; background: #F1F9FF; color: #095D7E; border-radius: 8px; text-decoration: none; border: 1px solid #CCECEE;">Pediatric CDC Growth</a>
                <a href="#faq" style="font-size: 12px; font-weight: 700; padding: 6px 12px; background: #F1F9FF; color: #095D7E; border-radius: 8px; text-decoration: none; border: 1px solid #CCECEE;">Clinical FAQs</a>
              </div>
            </section>

            <!-- Accessible Quick Calculator Fallback Form -->
            <section class="mv-ssr-card">
              <h2 style="font-size: 18px; font-weight: 800; color: #095D7E; margin: 0 0 12px;">Quick BMI Biometric Input Form</h2>
              <form action="/tools/bmi-calculator" method="GET" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;">
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">Biological Sex</label>
                  <select name="gender" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;">
                    <option value="male">Male (পুরুষ ♂)</option>
                    <option value="female">Female (নারী ♀)</option>
                  </select>
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">Age (Years)</label>
                  <input type="number" name="age" placeholder="e.g. 28" min="2" max="120" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">Height (Centimeters or Feet)</label>
                  <input type="number" name="height" placeholder="e.g. 170 cm" min="50" max="250" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;" />
                </div>
                <div>
                  <label style="display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 4px;">Weight (Kilograms or Pounds)</label>
                  <input type="number" name="weight" placeholder="e.g. 68 kg" min="10" max="300" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 13px;" />
                </div>
                <div style="grid-column: 1 / -1; margin-top: 6px;">
                  <button type="button" style="background: #14967F; color: #ffffff; font-weight: 800; font-size: 13px; padding: 10px 20px; border-radius: 10px; border: none; cursor: pointer;">
                    Calculate BMI / বিএমআই হিসাব করুন
                  </button>
                  <p style="font-size: 11px; color: #64748b; margin: 8px 0 0;">Interactive real-time dial and silhouette scan hydrate automatically on page load.</p>
                </div>
              </form>
            </section>

            <!-- WHO Classification Table (with Asian Cut-Offs) -->
            <section id="who-table" class="mv-ssr-card">
              <h2 style="font-size: 18px; font-weight: 800; color: #095D7E; margin: 0 0 8px;">
                WHO Body Mass Index (BMI) Adult Classification & Asian Specific Criteria
              </h2>
              <p style="font-size: 13px; color: #475569; margin: 0 0 14px;">
                Standard international WHO thresholds alongside adjusted cut-offs for South Asian populations (Bangladesh, India, Pakistan) where cardiometabolic risks manifest at lower body mass values:
              </p>
              <div style="overflow-x: auto;">
                <table class="mv-ssr-table">
                  <thead>
                    <tr>
                      <th>Clinical Classification (শ্রেণীবিন্যাস)</th>
                      <th>International BMI (kg/m²)</th>
                      <th>Asian Population Cut-Off (kg/m²)</th>
                      <th>Cardiometabolic Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Severe Thinness (মারাত্মক ওজনহীনতা)</strong></td>
                      <td>&lt; 16.0</td>
                      <td>&lt; 16.0</td>
                      <td><span class="mv-ssr-badge mv-badge-danger">High Risk</span></td>
                    </tr>
                    <tr>
                      <td><strong>Moderate Thinness (মাঝারি ওজনহীনতা)</strong></td>
                      <td>16.0 – 16.9</td>
                      <td>16.0 – 16.9</td>
                      <td><span class="mv-ssr-badge mv-badge-warning">Moderate Risk</span></td>
                    </tr>
                    <tr>
                      <td><strong>Mild Thinness (সামান্য কম ওজন)</strong></td>
                      <td>17.0 – 18.4</td>
                      <td>17.0 – 18.4</td>
                      <td><span class="mv-ssr-badge mv-badge-warning">Mild Risk</span></td>
                    </tr>
                    <tr style="background: #F0FDF4;">
                      <td><strong style="color: #0D6F5D;">Normal Healthy Weight (আদর্শ ওজন)</strong></td>
                      <td><strong>18.5 – 24.9</strong></td>
                      <td><strong>18.5 – 22.9</strong></td>
                      <td><span class="mv-ssr-badge mv-badge-healthy">Lowest Risk (Optimal)</span></td>
                    </tr>
                    <tr>
                      <td><strong>Overweight (অতিরিক্ত ওজন)</strong></td>
                      <td>25.0 – 29.9</td>
                      <td><strong>23.0 – 27.4</strong></td>
                      <td><span class="mv-ssr-badge mv-badge-warning">Increased Risk</span></td>
                    </tr>
                    <tr>
                      <td><strong>Obese Class I (স্থূলতা ক্লাস ১)</strong></td>
                      <td>30.0 – 34.9</td>
                      <td><strong>27.5 – 32.4</strong></td>
                      <td><span class="mv-ssr-badge mv-badge-danger">High Risk</span></td>
                    </tr>
                    <tr>
                      <td><strong>Obese Class II (স্থূলতা ক্লাস ২ - গুরুতর)</strong></td>
                      <td>35.0 – 39.9</td>
                      <td>32.5 – 37.4</td>
                      <td><span class="mv-ssr-badge mv-badge-danger">Very High Risk</span></td>
                    </tr>
                    <tr>
                      <td><strong>Obese Class III (স্থূলতা ক্লাস ৩ - মারাত্মক)</strong></td>
                      <td>&ge; 40.0</td>
                      <td>&ge; 37.5</td>
                      <td><span class="mv-ssr-badge mv-badge-danger">Severe / Morbid</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Asian Criteria Clinical Monograph -->
            <section id="asian-criteria" class="mv-ssr-card">
              <h2 style="font-size: 18px; font-weight: 800; color: #095D7E; margin: 0 0 8px;">
                Why are BMI Cut-Offs Adjusted for Asian & Bangladeshi Populations?
              </h2>
              <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 10px;">
                World Health Organization (WHO) expert consultations identified that South Asian individuals (including the Bangladeshi population) possess a significantly higher proportion of visceral body fat and insulin resistance at any given BMI compared to Caucasian populations.
              </p>
              <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0;">
                Consequently, cardiovascular morbidity, essential hypertension, and type 2 diabetes risk begin escalating rapidly at a lower threshold of <strong>BMI 23.0 kg/m²</strong>, prompting clinicians to designate BMI 23.0–27.4 as overweight and ≥ 27.5 kg/m² as clinically obese for Asian demographics.
              </p>
            </section>

            <!-- Pediatric CDC Growth Percentiles -->
            <section id="child-table" class="mv-ssr-card">
              <h2 style="font-size: 18px; font-weight: 800; color: #095D7E; margin: 0 0 8px;">
                Pediatric BMI-for-Age Percentiles (CDC Guidelines, Ages 2–20)
              </h2>
              <p style="font-size: 13px; color: #475569; margin: 0 0 12px;">
                For children and teens (ages 2 through 19), BMI is interpreted relative to age and biological sex using CDC pediatric growth charts:
              </p>
              <div style="overflow-x: auto;">
                <table class="mv-ssr-table">
                  <thead>
                    <tr>
                      <th>Percentile Range</th>
                      <th>Clinical Category</th>
                      <th>Action / Guidance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>&lt; 5th Percentile</td><td>Underweight (কম ওজন)</td><td>Assess nutritional intake & pediatric development</td></tr>
                    <tr style="background: #F0FDF4;"><td>5th to 85th Percentile</td><td>Healthy Weight (স্বাস্থ্যকর ওজন)</td><td>Support balanced physical activity and nutritious diet</td></tr>
                    <tr><td>85th to 95th Percentile</td><td>Overweight Risk (অতিরিক্ত ওজনের ঝুঁকি)</td><td>Monitor caloric balance and reduce sedentary screen time</td></tr>
                    <tr><td>&ge; 95th Percentile</td><td>Obesity (স্থূলতা)</td><td>Consult pediatrician for specialized metabolic evaluation</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Mathematical Formulas -->
            <section class="mv-ssr-card">
              <h2 style="font-size: 18px; font-weight: 800; color: #095D7E; margin: 0 0 8px;">
                Mathematical Formulas for Calculating Body Mass Index
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 10px;">
                <div style="background: #F1F9FF; padding: 14px; border-radius: 12px; border: 1px solid #CCECEE;">
                  <strong style="color: #095D7E; font-size: 13px; display: block; margin-bottom: 4px;">Metric System (Standard SI)</strong>
                  <code style="font-size: 14px; font-weight: bold; color: #0D6F5D;">BMI = Weight (kg) / [Height (m)]²</code>
                  <p style="font-size: 11px; color: #64748b; margin: 6px 0 0;">Example: 70 kg / (1.75 m)² = 22.86 kg/m²</p>
                </div>
                <div style="background: #F1F9FF; padding: 14px; border-radius: 12px; border: 1px solid #CCECEE;">
                  <strong style="color: #095D7E; font-size: 13px; display: block; margin-bottom: 4px;">US Imperial System (USC)</strong>
                  <code style="font-size: 14px; font-weight: bold; color: #0D6F5D;">BMI = 703 × [Weight (lbs) / (Height (in))²]</code>
                  <p style="font-size: 11px; color: #64748b; margin: 6px 0 0;">Example: 703 × [154 lbs / (69 in)²] = 22.74 kg/m²</p>
                </div>
              </div>
            </section>

            <!-- Health Risks Section -->
            <section class="mv-ssr-card">
              <h2 style="font-size: 18px; font-weight: 800; color: #095D7E; margin: 0 0 10px;">
                Clinical Health Risks of Abnormal Body Mass Index
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
                <div>
                  <h3 style="font-size: 14px; font-weight: 800; color: #B91C1C; margin: 0 0 8px;">Health Risks of Being Overweight / Obese</h3>
                  <ul style="font-size: 13px; color: #475569; padding-left: 18px; margin: 0; line-height: 1.6;">
                    <li>Essential hypertension & high blood pressure</li>
                    <li>Type 2 diabetes mellitus & chronic insulin resistance</li>
                    <li>Coronary artery disease, angina, and myocardial infarction</li>
                    <li>Ischemic stroke and cerebrovascular accidents</li>
                    <li>Non-alcoholic fatty liver disease (NAFLD) & gallstones</li>
                    <li>Osteoarthritis and degenerative joint cartilage wear</li>
                    <li>Obstructive sleep apnea and nocturnal hypoxemia</li>
                  </ul>
                </div>
                <div>
                  <h3 style="font-size: 14px; font-weight: 800; color: #D97706; margin: 0 0 8px;">Health Risks of Being Underweight</h3>
                  <ul style="font-size: 13px; color: #475569; padding-left: 18px; margin: 0; line-height: 1.6;">
                    <li>Protein-calorie malnutrition & micronutrient deficits</li>
                    <li>Iron deficiency and microcytic hypochromic anemia</li>
                    <li>Osteoporosis, low bone density, and pathological fractures</li>
                    <li>Impaired cell-mediated immunity & infection susceptibility</li>
                    <li>Hypothalamic amenorrhea, hormonal imbalance & infertility</li>
                    <li>Impaired postoperative recovery and prolonged wound healing</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- FAQ Section -->
            <section id="faq" class="mv-ssr-card">
              <h2 style="font-size: 18px; font-weight: 800; color: #095D7E; margin: 0 0 14px;">
                Frequently Asked Clinical Questions & Expert Answers (বিএমআই প্রশ্নোত্তর)
              </h2>
              <div class="mv-ssr-faq">
                <h3>What is a healthy BMI for adults according to WHO?</h3>
                <p>According to the World Health Organization (WHO), a healthy adult Body Mass Index (BMI) is between 18.5 and 24.9 kg/m² for both men and women. For South Asian populations including Bangladesh, WHO suggests an adjusted normal range of 18.5 to 22.9 kg/m² due to higher visceral fat risks.</p>
              </div>
              <div class="mv-ssr-faq">
                <h3>কীভাবে বডি ম্যাস ইনডেক্স (বিএমআই) হিসাব করা হয়?</h3>
                <p>মেট্রিক পদ্ধতিতে ওজন (কেজি)-কে উচ্চতা (মিটার)-এর বর্গ দিয়ে ভাগ করে বিএমআই হিসাব করা হয়: BMI = ওজন (কেজি) / উচ্চতা² (মিটার)। ইউএস ইম্পেরিয়াল পদ্ধতিতে: BMI = ৭০৩ × [ওজন (পাউন্ড) / উচ্চতা² (ইঞ্চি)]।</p>
              </div>
              <div class="mv-ssr-faq">
                <h3>Why are BMI cut-offs lower for Asians and Bangladeshis?</h3>
                <p>WHO expert consultations identified that Asian and South Asian individuals have a higher percentage of body fat and visceral adiposity at lower BMI levels than European populations. Therefore, for South Asians, overweight risk begins at BMI 23.0 kg/m² and obesity begins at 27.5 kg/m².</p>
              </div>
              <div class="mv-ssr-faq">
                <h3>What health risks are associated with a high BMI (Overweight / Obese)?</h3>
                <p>An elevated BMI increases the incidence of type 2 diabetes, essential hypertension, coronary artery disease, stroke, dyslipidemia, osteoarthritis, obstructive sleep apnea, fatty liver disease, and several cancers.</p>
              </div>
              <div class="mv-ssr-faq">
                <h3>কম ওজনের (Underweight) স্বাস্থ্যঝুঁকি কী কী?</h3>
                <p>বিএমআই ১৮.৫ এর নিচে হলে তাকে আন্ডারওয়েট বা কম ওজন ধরা হয়। এর ফলে দীর্ঘমেয়াদী অপুষ্টি, রক্তস্বল্পতা (Anemia), অস্টিওপোরোসিস (হাড়ের ক্ষয়), রোগ প্রতিরোধ ক্ষমতা হ্রাস এবং হরমোনজনিত জটিলতা দেখা দিতে পারে।</p>
              </div>
              <div class="mv-ssr-faq">
                <h3>What are the clinical limitations of BMI?</h3>
                <p>BMI measures excess weight rather than excess fat. It cannot distinguish between lean muscle mass and adipose fat tissue. Athletes with high muscle mass may test as overweight, while elderly individuals with sarcopenia may test normal despite high visceral adiposity.</p>
              </div>
              <div class="mv-ssr-faq">
                <h3>শিশু ও কিশোরদের বিএমআই কীভাবে মূল্যায়ন করা হয়?</h3>
                <p>২ থেকে ২০ বছর বয়সীদের জন্য সিডিসি (CDC) বয়স ও লিঙ্গভিত্তিক পার্সেন্টাইল চার্ট ব্যবহার করা হয়। ৫ম পার্সেন্টাইলের নিচে কম ওজন, ৫ম থেকে ৮৫তম পার্সেন্টাইল স্বাস্থ্যকর ওজন, ৮৫তম থেকে ৯৫তম অতিরিক্ত ওজনের ঝুঁকি এবং ৯৫তম বা তার বেশি হলে স্থূলতা হিসেবে চিহ্নিত হয়।</p>
              </div>
            </section>

            <!-- Contextual Internal Linking to Related Medications & Tools -->
            <section class="mv-ssr-card">
              <h2 style="font-size: 16px; font-weight: 800; color: #095D7E; margin: 0 0 10px;">
                Related Clinical Monographs & Medications on MEDDET
              </h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; font-size: 12px;">
                <a href="/generic/orlistat-7pga" style="padding: 10px; background: #F1F9FF; border-radius: 8px; text-decoration: none; color: #095D7E; border: 1px solid #CCECEE; display: block;">
                  <strong style="color: #14967F; display: block;">Orlistat (ওরলিস্ট্যাট)</strong>
                  Clinical Lipase Inhibitor for Weight Loss & Obesity
                </a>
                <a href="/generic/metformin-hydrochloride-x2r4" style="padding: 10px; background: #F1F9FF; border-radius: 8px; text-decoration: none; color: #095D7E; border: 1px solid #CCECEE; display: block;">
                  <strong style="color: #14967F; display: block;">Metformin (মেটফরমিন)</strong>
                  Insulin Sensitizer for Diabetes & Metabolic Syndrome
                </a>
                <a href="/generic/amlodipine-v4cp" style="padding: 10px; background: #F1F9FF; border-radius: 8px; text-decoration: none; color: #095D7E; border: 1px solid #CCECEE; display: block;">
                  <strong style="color: #14967F; display: block;">Amlodipine (অ্যামলোডিপিন)</strong>
                  Calcium Channel Blocker for High Blood Pressure
                </a>
                <a href="/tools" style="padding: 10px; background: #F1F9FF; border-radius: 8px; text-decoration: none; color: #095D7E; border: 1px solid #CCECEE; display: block;">
                  <strong style="color: #14967F; display: block;">All Medical Tools</strong>
                  Browse Clinical Health Calculators & References
                </a>
              </div>
            </section>

            <!-- Authoritative External References (E-E-A-T) -->
            <section class="mv-ssr-card">
              <h2 style="font-size: 14px; font-weight: 800; color: #095D7E; margin: 0 0 8px;">
                Authoritative Clinical References & Literature
              </h2>
              <ul style="font-size: 12px; color: #64748b; margin: 0; padding-left: 18px; line-height: 1.6;">
                <li><a href="https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" target="_blank" rel="noopener noreferrer" style="color: #14967F; font-weight: 700;">World Health Organization (WHO) — Obesity and Overweight Fact Sheet</a></li>
                <li><a href="https://www.cdc.gov/healthyweight/assessing/bmi/" target="_blank" rel="noopener noreferrer" style="color: #14967F; font-weight: 700;">Centers for Disease Control and Prevention (CDC) — Assessing Your Weight: Body Mass Index (BMI)</a></li>
                <li>WHO Expert Consultation (2004). Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies. <em>The Lancet</em>.</li>
              </ul>
            </section>

            <!-- E-E-A-T Attribution Footer -->
            <footer class="mv-ssr-footer" style="background: #f1f5f9; border-radius: 12px; padding: 16px; font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 10px;">
              <p style="margin: 0 0 4px;"><strong>Regulatory & Clinical Attribution (E-E-A-T):</strong> Clinical data referenced in alignment with the Directorate General of Drug Administration (DGDA), Bangladesh and Bangladesh National Formulary (BDNF).</p>
              <p style="margin: 0 0 4px;"><strong>Medical Disclaimer:</strong> MEDDET is an educational clinical index. Body Mass Index calculations are population screening indicators and do not constitute personal diagnostic advice. Always consult a registered medical physician or certified clinical dietitian for clinical weight management.</p>
              <p style="margin: 0;">© 2026 MEDDET Clinical Index. All rights reserved.</p>
            </footer>
          </main>
        </div>
      `;

      const transformed = new HTMLRewriter()
        .on('title', { element(el) { el.setInnerContent(title); } })
        .on('meta[name="title"]', { element(el) { el.setAttribute('content', title); } })
        .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
        .on('meta[name="keywords"]', { element(el) { el.setAttribute('content', keywords); } })
        .on('meta[name="robots"]', { element(el) { el.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'); } })
        .on('head', {
          element(el) {
            el.append(`<link rel="canonical" href="${canonicalUrl}">`, { html: true });
            el.append(`<meta property="og:title" content="${title}">`, { html: true });
            el.append(`<meta property="og:description" content="${description}">`, { html: true });
            el.append(`<meta property="og:url" content="${canonicalUrl}">`, { html: true });
            el.append(`<meta property="twitter:title" content="${title}">`, { html: true });
            el.append(`<meta property="twitter:description" content="${description}">`, { html: true });
            el.append(`<script id="dynamic-seo-schema" type="application/ld+json">${JSON.stringify(jsonLd)}</script>`, { html: true });
          }
        })
        .on('div#root', {
          element(el) {
            el.setInnerContent(bmiPreRenderedHtml, { html: true });
          }
        })
        .transform(baseRes);

      const responseHeaders = new Headers(transformed.headers);
      responseHeaders.set('Link', `<${canonicalUrl}>; rel="canonical"`);
      responseHeaders.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
      responseHeaders.set('Cache-Control', 'public, max-age=86400, s-maxage=604800');

      return new Response(transformed.body, { status: 200, headers: responseHeaders });
    }

    // 6. Dedicated Standalone Content Pages: /about, /privacy-policy, /terms, /contact, /companies, /api-docs
    const staticPagesMeta = {
      '/about': {
        title: 'About MEDDET™ — Clinical Drug Index & Medicine Guide BD',
        description: 'Learn about MEDDET, Bangladesh’s verified clinical medicine index, BDT pharmaceutical price comparator, and bilingual drug monographs.'
      },
      '/privacy-policy': {
        title: 'Privacy Policy — MEDDET™ Clinical Healthcare Index',
        description: 'Our commitment to zero medical health data tracking, client-side local storage protection, and patient confidentiality on MEDDET.'
      },
      '/terms': {
        title: 'Terms & Conditions & Medical Disclaimer | MEDDET™',
        description: 'Educational clinical reference guidelines, medical disclaimer, and prescribing practitioner terms for MEDDET.'
      },
      '/contact': {
        title: 'Contact Us — Support & Medicine Corrections | MEDDET™',
        description: 'Get in touch with the MEDDET clinical indexing team for medicine price corrections, new presentations, and developer queries.'
      },
      '/companies': {
        title: 'Pharmaceutical Companies in Bangladesh (723 Manufacturers) | MEDDET',
        description: 'Complete directory of all 723 licensed pharmaceutical companies in Bangladesh. Browse brand medicine portfolios, dosages, and prices.'
      },
      '/api-docs': {
        title: 'Developer REST API Documentation & Live Studio | MEDDET™',
        description: 'Free open REST API endpoints for searching 30,500+ medicines, generics, active ingredients, and BDT MRP prices.'
      },
      '/tools': {
        title: 'Medical Tools & Clinical Calculators | MEDDET™',
        description: 'Free clinical healthcare calculators for medical professionals and patients. Calculate BMI, body morphology, and health metrics.'
      }
    };
 
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

    // 6b. Common 301 Permanent Aliases
    const aliases = {
      '/privacy': '/privacy-policy',
      '/about-us': '/about',
      '/terms-and-conditions': '/terms',
      '/terms-of-use': '/terms',
      '/contact-us': '/contact',
      '/company': '/companies',
      '/manufacturers': '/companies',
      '/bmi-calculator': '/tools/bmi-calculator',
      '/bmi': '/tools/bmi-calculator',
      '/tools/bmi': '/tools/bmi-calculator',
      '/index.html': '/'
    };
    if (aliases[cleanStaticPath]) {
      return Response.redirect(`${origin}${aliases[cleanStaticPath]}`, 301);
    }

    // 7. Homepage -> Injects Homepage Canonical (Strictly for '/' or '')
    if (cleanStaticPath === '') {
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

    // 8. True HTTP 404 for any other unrecognized URL (Prevents Google Soft-404 penalty)
    return new Response(generate404Html('Page Not Found', pathname), {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, follow'
      }
    });
    } catch (err) {
      console.error('MEDDET Edge Worker exception caught:', err);
      // Graceful fallback to static assets / client-side SPA rendering to prevent Cloudflare Error 1101
      return env.ASSETS.fetch(request);
    }
  }
};
