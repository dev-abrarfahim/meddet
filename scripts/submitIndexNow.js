import fs from 'fs';
import path from 'path';

const HOST = 'meddet.site';
const KEY = 'b54e8a171900d53d3265ba9ad908ddfb';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const BATCH_SIZE = 10000;

// IndexNow Endpoints (Bing and IndexNow master protocol)
const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow'
];

async function checkKeyDeployment() {
  console.log(`[IndexNow] Verifying key file accessibility at: ${KEY_LOCATION}...`);
  try {
    const res = await fetch(KEY_LOCATION, { method: 'GET' });
    if (res.ok) {
      const text = (await res.text()).trim();
      if (text === KEY) {
        console.log(`[IndexNow] Key file verified successfully on live server (HTTP 200)!`);
        return true;
      }
    }
  } catch (err) {
    // network or unreachable
  }
  return false;
}

function extractUrlsFromSitemaps() {
  const sitemapFiles = [
    'sitemap-core.xml',
    'sitemap-generics.xml',
    'sitemap-medicines-1.xml',
    'sitemap-medicines-2.xml',
    'sitemap-medicines-3.xml'
  ];

  const allUrls = new Set();

  for (const file of sitemapFiles) {
    const filePath = path.resolve('public', file);
    if (!fs.existsSync(filePath)) {
      console.warn(`[IndexNow] File not found: ${filePath}`);
      continue;
    }

    const xml = fs.readFileSync(filePath, 'utf8');
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    let count = 0;
    while ((match = regex.exec(xml)) !== null) {
      const url = match[1].trim();
      if (url) {
        allUrls.add(url);
        count++;
      }
    }
    console.log(`[IndexNow] Read ${count.toLocaleString()} URLs from ${file}`);
  }

  return Array.from(allUrls);
}

async function submitBatch(urls, batchIndex, totalBatches, endpoint) {
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  };

  console.log(`[IndexNow] Sending Batch ${batchIndex}/${totalBatches} (${urls.length.toLocaleString()} URLs) to ${endpoint}...`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.status === 200) {
      console.log(`[IndexNow] SUCCESS (200 OK): Batch ${batchIndex} successfully accepted.`);
      return true;
    } else if (response.status === 202) {
      console.log(`[IndexNow] ACCEPTED (202 Accepted): Batch ${batchIndex} received & queued for crawling.`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[IndexNow] ERROR (${response.status}): ${response.statusText}`, errorText);
      return false;
    }
  } catch (err) {
    console.error(`[IndexNow] Request failed for batch ${batchIndex}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('='.repeat(65));
  console.log('  MEDDET Enterprise IndexNow Instant Submission Pipeline');
  console.log('  Target Engines: Microsoft Bing, Yandex, Seznam, Naver');
  console.log('='.repeat(65));

  const isLive = await checkKeyDeployment();
  if (!isLive) {
    console.warn('\n[!] WARNING: Key file not live yet at: ' + KEY_LOCATION);
    console.log('Before submitting to IndexNow, please deploy your changes:');
    console.log('  1. git add .');
    console.log('  2. git commit -m "feat(seo): add IndexNow verification key"');
    console.log('  3. git push');
    console.log('Wait 1-2 minutes for Cloudflare Pages to build, then re-run:');
    console.log('  npm run indexnow\n');
    console.log('Aborting submission to avoid verification rejection from Bing.');
    return;
  }

  console.log('\n[IndexNow] Extracting canonical URLs from public sitemaps...');
  const urls = extractUrlsFromSitemaps();
  console.log(`[IndexNow] Total unique canonical URLs found: ${urls.length.toLocaleString()}\n`);

  if (urls.length === 0) {
    console.error('[IndexNow] No URLs found to submit. Exiting.');
    return;
  }

  // Chunk URLs into batches of 10,000 (IndexNow API limit)
  const batches = [];
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    batches.push(urls.slice(i, i + BATCH_SIZE));
  }

  console.log(`[IndexNow] Prepared ${batches.length} batches for submission:`);
  batches.forEach((b, idx) => console.log(`  - Batch ${idx + 1}: ${b.length.toLocaleString()} URLs`));
  console.log();

  const targetEndpoint = ENDPOINTS[0]; // https://api.indexnow.org/indexnow
  let successCount = 0;

  for (let i = 0; i < batches.length; i++) {
    const success = await submitBatch(batches[i], i + 1, batches.length, targetEndpoint);
    if (success) successCount++;
    // Delay between batches to respect rate limits
    if (i < batches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n' + '='.repeat(65));
  console.log(`[IndexNow] Complete! ${successCount}/${batches.length} batches successfully submitted to Bing & IndexNow network.`);
  console.log('='.repeat(65));
}

main().catch(err => {
  console.error('[IndexNow] Fatal error:', err);
  process.exit(1);
});
