/**
 * MedVhai Automatic IndexNow Batch Submitter
 * Submits all 33,000+ canonical medicine URLs to Microsoft Bing / IndexNow
 * Protocol: https://www.indexnow.org/documentation
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'medvhai.heliox.workers.dev';
const API_KEY = '5711ad7c2b904d059ece59ef8e77bf90';
const KEY_LOCATION = `https://${HOST}/${API_KEY}.txt`;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

function extractUrlsFromXml(xmlContent) {
  const urlRegex = /<loc>(https:\/\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(xmlContent)) !== null) {
    const rawUrl = match[1].replace(/&amp;/g, '&');
    urls.push(rawUrl);
  }
  return urls;
}

function getAllCanonicalUrls() {
  const rootSitemap = path.join(PUBLIC_DIR, 'sitemap.xml');
  const sitemapsDir = path.join(PUBLIC_DIR, 'sitemaps');
  let allUrls = [];

  if (fs.existsSync(sitemapsDir)) {
    const files = fs.readdirSync(sitemapsDir).filter(f => f.endsWith('.xml'));
    for (const f of files) {
      const content = fs.readFileSync(path.join(sitemapsDir, f), 'utf-8');
      allUrls = allUrls.concat(extractUrlsFromXml(content));
    }
  } else if (fs.existsSync(rootSitemap)) {
    const content = fs.readFileSync(rootSitemap, 'utf-8');
    allUrls = extractUrlsFromXml(content);
  }

  // Deduplicate and filter out sitemap indexes themselves
  const cleanUrls = Array.from(new Set(allUrls)).filter(u => !u.endsWith('.xml'));
  return cleanUrls;
}

function postIndexNowBatch(batch, batchNumber, totalBatches, endpoint = 'api.indexnow.org') {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: HOST,
      key: API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch
    });

    const options = {
      hostname: endpoint,
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    console.log(`[Batch ${batchNumber}/${totalBatches}] Submitting ${batch.length} canonical URLs to ${endpoint}...`);

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ [Batch ${batchNumber}/${totalBatches}] Success (${endpoint})! Status: ${res.statusCode} (${batch.length} URLs queued for indexing)`);
          resolve({ status: res.statusCode, count: batch.length });
        } else {
          console.warn(`⚠️ [Batch ${batchNumber}/${totalBatches}] (${endpoint}) Response Status: ${res.statusCode} ${responseBody}`);
          resolve({ status: res.statusCode, response: responseBody, count: batch.length });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ [Batch ${batchNumber}/${totalBatches}] (${endpoint}) Error:`, err.message);
      resolve({ error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('📖 Extracting canonical URLs from sitemap suite...');
  const allUrls = getAllCanonicalUrls();
  console.log(`Found ${allUrls.length.toLocaleString()} total clean canonical URLs to submit.\n`);

  const BATCH_SIZE = 10000;
  const totalBatches = Math.ceil(allUrls.length / BATCH_SIZE);

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    try {
      await postIndexNowBatch(batch, batchNumber, totalBatches);
      if (i + BATCH_SIZE < allUrls.length) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (e) {
      console.error(`Failed to submit batch ${batchNumber}:`, e.message);
    }
  }

  console.log('\n🎉 All canonical URLs submitted to IndexNow!');
}

run();
