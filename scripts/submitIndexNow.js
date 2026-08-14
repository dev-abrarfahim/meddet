/**
 * MedVhai Automatic IndexNow Batch Submitter
 * Submits all 33,000+ medicine URLs from sitemap.xml to Microsoft Bing / IndexNow
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
const SITEMAP_PATH = path.join(__dirname, '..', 'public', 'sitemap.xml');

function extractUrlsFromSitemap(xmlContent) {
  const urlRegex = /<loc>(https:\/\/[^<]+)<\/loc>/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(xmlContent)) !== null) {
    // Unescape XML entities like &amp; to &
    urls.push(match[1].replace(/&amp;/g, '&'));
  }
  return urls;
}

function postIndexNowBatch(batch, batchNumber, totalBatches) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      host: HOST,
      key: API_KEY,
      keyLocation: KEY_LOCATION,
      urlList: batch
    });

    const options = {
      hostname: 'api.indexnow.org',
      port: 443,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    console.log(`[Batch ${batchNumber}/${totalBatches}] Submitting ${batch.length} URLs to IndexNow...`);

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 202) {
          console.log(`✅ [Batch ${batchNumber}/${totalBatches}] Success! Status: ${res.statusCode} (${batch.length} URLs queued for indexing)`);
          resolve({ status: res.statusCode, count: batch.length });
        } else {
          console.error(`⚠️ [Batch ${batchNumber}/${totalBatches}] Response Status: ${res.statusCode} ${responseBody}`);
          resolve({ status: res.statusCode, response: responseBody, count: batch.length });
        }
      });
    });

    req.on('error', (err) => {
      console.error(`❌ [Batch ${batchNumber}/${totalBatches}] Error:`, err.message);
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log('📖 Reading sitemap.xml...');
  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error(`Error: sitemap.xml not found at ${SITEMAP_PATH}`);
    process.exit(1);
  }

  const xmlContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const allUrls = extractUrlsFromSitemap(xmlContent);
  console.log(`Found ${allUrls.length.toLocaleString()} total URLs to index.\n`);

  const BATCH_SIZE = 10000;
  const totalBatches = Math.ceil(allUrls.length / BATCH_SIZE);

  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    const batch = allUrls.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    try {
      await postIndexNowBatch(batch, batchNumber, totalBatches);
      // Wait 1.5 seconds between batches
      if (i + BATCH_SIZE < allUrls.length) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    } catch (e) {
      console.error(`Failed to submit batch ${batchNumber}:`, e.message);
    }
  }

  console.log('\n🎉 All URLs successfully submitted to IndexNow!');
}

run();
