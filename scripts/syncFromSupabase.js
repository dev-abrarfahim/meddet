import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const envPath = path.join(ROOT_DIR, '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://sqeaheehcnlxldtkimrd.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || 'sb_secret_bQqECQ8nnqRaCiZhaI0ZdA_1BtXb4Tp';

const PUBLIC_DATA_DIR = path.join(ROOT_DIR, 'public', 'data');
const GENERATED_DATA_DIR = path.join(ROOT_DIR, 'src', 'data', 'generated');

async function fetchAllFromTable(tableName) {
  let allRows = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;

    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Range': `${from}-${to}`
      }
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch ${tableName}: HTTP ${res.status} - ${errText}`);
    }

    const data = await res.json();
    if (!data || data.length === 0) break;
    allRows = allRows.concat(data);
    if (data.length < pageSize) break;
    page++;
    process.stdout.write(`\rFetching ${tableName}... ${allRows.length} rows loaded`);
  }
  console.log(`\r\x1b[32m✔ Loaded ${allRows.length} rows from ${tableName}\x1b[0m`);
  return allRows;
}

async function runSync() {
  console.log('Connecting to Supabase at:', SUPABASE_URL);
  const startTime = Date.now();

  try {
    const [companiesRaw, genericsRaw, medicinesRaw] = await Promise.all([
      fetchAllFromTable('companies'),
      fetchAllFromTable('generics'),
      fetchAllFromTable('medicines')
    ]);

    const companies = companiesRaw.map(c => ({
      id: Number(c.id),
      name: (c.name || '').trim(),
      brandCount: Number(c.brand_count || 0),
      rank: c.rank ? Number(c.rank) : undefined
    })).sort((a, b) => a.name.localeCompare(b.name));

    const generics = genericsRaw.map(g => ({
      id: Number(g.id),
      name: (g.name || '').trim(),
      nameBn: (g.name_bn || '').trim(),
      indication: (g.indication || '').trim(),
      indicationBn: (g.indication_bn || '').trim(),
      dose: (g.dose || '').trim(),
      doseBn: (g.dose_bn || '').trim(),
      sideEffect: (g.side_effect || '').trim(),
      sideEffectBn: (g.side_effect_bn || '').trim(),
      contraIndication: (g.contra_indication || '').trim(),
      contraIndicationBn: (g.contra_indication_bn || '').trim(),
      precaution: (g.precaution || '').trim(),
      precautionBn: (g.precaution_bn || '').trim(),
      pregnancyCategory: (g.pregnancy_category || '').trim(),
      pregnancyCategoryBn: (g.pregnancy_category_bn || '').trim(),
      overdose: (g.overdose || '').trim(),
      overdoseBn: (g.overdose_bn || '').trim()
    })).sort((a, b) => a.id - b.id);

    const brands = medicinesRaw.map(m => {
      const mrp = Number(m.mrp || 0);
      const sellingPrice = Number(m.selling_price || (mrp * 0.90).toFixed(2));
      return {
        id: Number(m.id),
        name: (m.name || '').trim(),
        companyId: Number(m.company_id || 0),
        company: (m.company || '').trim(),
        genericId: Number(m.generic_id || 0),
        genericName: (m.generic_name || '').trim(),
        genericNameBn: (m.generic_name_bn || '').trim(),
        form: (m.form || '').trim(),
        strength: (m.strength || '').trim(),
        packSize: (m.pack_size || '').trim(),
        mrp,
        sellingPrice,
        discountPercentage: Number(m.discount_percentage || 10)
      };
    }).sort((a, b) => a.id - b.id);

    const companyBrandCounts = new Map();
    brands.forEach(b => {
      companyBrandCounts.set(b.companyId, (companyBrandCounts.get(b.companyId) || 0) + 1);
    });
    companies.forEach(c => {
      c.brandCount = companyBrandCounts.get(c.id) || 0;
    });

    const targetDirs = [PUBLIC_DATA_DIR, GENERATED_DATA_DIR];
    for (const dir of targetDirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, 'companies.json'), JSON.stringify(companies));
      fs.writeFileSync(path.join(dir, 'generics.json'), JSON.stringify(generics));
      fs.writeFileSync(path.join(dir, 'brands.json'), JSON.stringify(brands));
    }

    console.log(`\n🎉 Database successfully synced from Supabase in ${((Date.now() - startTime) / 1000).toFixed(1)}s!`);
    console.log(`- Total Medicines: ${brands.length}`);
    console.log(`- Total Generics: ${generics.length}`);
    console.log(`- Total Companies: ${companies.length}`);

  } catch (err) {
    console.error('\n❌ Supabase Sync failed:', err);
    process.exit(1);
  }
}

runSync();
