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

function getMedicineCanonicalPath(med) {
  return `/medicine/${getMedicineCanonicalSlug(med)}`;
}

function getGenericCanonicalSlug(gen) {
  const baseSlug = slugify(gen.name) || 'generic';
  return `${baseSlug}-${gen.id}`;
}

function getGenericCanonicalPath(gen) {
  return `/generic/${getGenericCanonicalSlug(gen)}`;
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

function parseGenericIdFromSlug(slugOrPath) {
  if (!slugOrPath) return null;
  const clean = slugOrPath.split('?')[0].replace(/^\/generic\//, '').replace(/\/$/, '');
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
  <title>404 — ${resourceType} Not Found | MedVhai</title>
  <meta name="robots" content="noindex, follow">
  <link rel="canonical" href="${SITE_BASE_URL}/">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #F1F9FF; color: #095D7E; margin: 0; padding: 40px 20px; display: flex; align-items: center; justify-content: center; min-height: 80vh; text-align: center; }
    .card { background: #fff; padding: 40px 30px; border-radius: 20px; border: 1px solid #CCECEE; box-shadow: 0 10px 25px rgba(9,93,126,0.08); max-width: 480px; width: 100%; }
    h1 { font-size: 32px; margin: 0 0 10px; color: #095D7E; }
    p { font-size: 15px; color: #555; line-height: 1.5; margin: 0 0 24px; }
    .btn { display: inline-block; background: #14967F; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 14px; transition: background 0.2s; }
    .btn:hover { background: #0E7563; }
  </style>
</head>
<body>
  <div class="card">
    <h1>404 Not Found</h1>
    <p>We could not find any ${resourceType.toLowerCase()} record matching "<strong>${identifier}</strong>". It may have been discontinued or the URL is invalid.</p>
    <a href="${SITE_BASE_URL}/" class="btn">Return to MedVhai Index</a>
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

      // Canonical URL Normalization: If requested with mismatched slug, 301 to exact canonical slug
      if (pathname !== canonicalPath) {
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

      if (pathname !== canonicalPath) {
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
