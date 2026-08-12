const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const dbDir = path.join(rootDir, 'database');
const outDir = path.join(rootDir, 'src', 'data', 'generated');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Loading database files...');
const companiesRaw = JSON.parse(fs.readFileSync(path.join(dbDir, 't_company_name.json'), 'utf8'));
const genericsRaw = JSON.parse(fs.readFileSync(path.join(dbDir, 't_drug_generic.json'), 'utf8'));
const brandsRaw = JSON.parse(fs.readFileSync(path.join(dbDir, 't_drug_brand.json'), 'utf8'));
const notesRaw = JSON.parse(fs.readFileSync(path.join(dbDir, 't_drug_note.json'), 'utf8'));

// 1. Process Companies
const compMap = new Map();
const companies = [];

companiesRaw.forEach(c => {
  const id = Number(c.company_id);
  const name = (c.company_name || '').trim();
  if (id && name) {
    compMap.set(id, name);
    companies.push({ id, name, brandCount: 0 });
  }
});

// Sort companies by name
companies.sort((a, b) => a.name.localeCompare(b.name));

// 2. Process Generics
const genericsMap = new Map();
const generics = genericsRaw.map(g => {
  const id = Number(g.generic_id);
  const record = {
    id,
    name: (g.generic_name || '').trim(),
    nameBn: (g.generic_name_bangla || '').trim(),
    indication: (g.indication || '').trim(),
    indicationBn: (g.indication_bangla || '').trim(),
    dose: (g.dose || '').trim(),
    doseBn: (g.dose_bangla || '').trim(),
    sideEffect: (g.side_effect || '').trim(),
    sideEffectBn: (g.side_effect_bangla || '').trim(),
    contraIndication: (g.contra_indication || '').trim(),
    contraIndicationBn: (g.contra_indication_bangla || '').trim(),
    precaution: (g.precaution || '').trim(),
    precautionBn: (g.precaution_bangla || '').trim(),
    pregnancyCategory: (g.pregnancy_category || '').trim(),
    pregnancyCategoryBn: (g.pregnancy_category_bangla || '').trim(),
    overdose: (g.overdose || '').trim(),
    overdoseBn: (g.overdose_bangla || '').trim()
  };
  genericsMap.set(id, record);
  return record;
});

// 3. Process Dosage Form Notes
const dosageNotes = {};
notesRaw.forEach(n => {
  if (n.form && n.note) {
    const key = n.form.trim().toLowerCase();
    if (!dosageNotes[key]) {
      dosageNotes[key] = {
        form: n.form.trim(),
        note: n.note.trim(),
        noteBn: (n.note_bangla || '').trim()
      };
    }
  }
});

// 4. Process Brands
const companyBrandCounts = new Map();

const brands = brandsRaw.map(b => {
  const brandId = Number(b.brand_id);
  const companyId = Number(b.company_id);
  const genericId = Number(b.generic_id);
  const companyName = compMap.get(companyId) || 'Unknown Manufacturer';
  const genericObj = genericsMap.get(genericId);
  const genericName = genericObj ? genericObj.name : '';
  const genericNameBn = genericObj ? genericObj.nameBn : '';
  const mrp = parseFloat(b.price) || 0;
  const sellingPrice = parseFloat((mrp * 0.90).toFixed(2)); // 10% store discount

  // Track brand count per company
  companyBrandCounts.set(companyId, (companyBrandCounts.get(companyId) || 0) + 1);

  return {
    id: brandId,
    name: (b.brand_name || '').trim(),
    companyId,
    company: companyName,
    genericId,
    genericName,
    genericNameBn,
    form: (b.form || '').trim(),
    strength: (b.strength || '').trim(),
    packSize: (b.packsize || '').trim(),
    mrp,
    sellingPrice,
    discountPercentage: 10
  };
});

// Update company brand counts
companies.forEach(c => {
  c.brandCount = companyBrandCounts.get(c.id) || 0;
});

console.log(`Writing datasets to ${outDir}...`);
fs.writeFileSync(path.join(outDir, 'companies.json'), JSON.stringify(companies));
fs.writeFileSync(path.join(outDir, 'generics.json'), JSON.stringify(generics));
fs.writeFileSync(path.join(outDir, 'brands.json'), JSON.stringify(brands));
fs.writeFileSync(path.join(outDir, 'dosageNotes.json'), JSON.stringify(dosageNotes));

console.log('✅ Database processing complete!');
console.log(`- Companies: ${companies.length}`);
console.log(`- Generics: ${generics.length}`);
console.log(`- Brands: ${brands.length}`);
console.log(`- Dosage Form Notes: ${Object.keys(dosageNotes).length}`);
