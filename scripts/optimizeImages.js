import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ICONS_DIR = path.resolve('public/icons');
const PUBLIC_DIR = path.resolve('public');

async function optimizeIcons() {
  console.log('🖼️  Optimizing dosage form icons (512x512 → 64x64 WebP)...');
  const files = fs.readdirSync(ICONS_DIR).filter(f => f.endsWith('.png'));
  
  for (const file of files) {
    const inputPath = path.join(ICONS_DIR, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(ICONS_DIR, outputName);
    
    try {
      await sharp(inputPath)
        .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);
      
      const origSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      const savings = ((1 - newSize / origSize) * 100).toFixed(1);
      console.log(`  ✅ ${file} (${(origSize/1024).toFixed(1)} KB) → ${outputName} (${(newSize/1024).toFixed(1)} KB) — ${savings}% smaller`);
    } catch (err) {
      console.error(`  ❌ Failed: ${file}`, err.message);
    }
  }
}

async function optimizeBackground() {
  console.log('\n🏥 Optimizing medical-bg.png → medical-bg.webp...');
  const inputPath = path.join(PUBLIC_DIR, 'medical-bg.png');
  const outputPath = path.join(PUBLIC_DIR, 'medical-bg.webp');
  
  if (!fs.existsSync(inputPath)) {
    console.log('  ⚠️  medical-bg.png not found, skipping.');
    return;
  }

  try {
    await sharp(inputPath)
      .webp({ quality: 75, effort: 6 })
      .toFile(outputPath);
    
    const origSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`  ✅ medical-bg.png (${(origSize/1024).toFixed(1)} KB) → medical-bg.webp (${(newSize/1024).toFixed(1)} KB) — ${savings}% smaller`);
  } catch (err) {
    console.error('  ❌ Failed:', err.message);
  }
}

async function optimizeLogo() {
  console.log('\n🎨 Optimizing logo.png → logo.webp...');
  const inputPath = path.join(PUBLIC_DIR, 'logo.png');
  const outputPath = path.join(PUBLIC_DIR, 'logo.webp');
  
  if (!fs.existsSync(inputPath)) {
    console.log('  ⚠️  logo.png not found, skipping.');
    return;
  }

  try {
    await sharp(inputPath)
      .resize(400, undefined, { fit: 'inside' })
      .webp({ quality: 85, effort: 6 })
      .toFile(outputPath);
    
    const origSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`  ✅ logo.png (${(origSize/1024).toFixed(1)} KB) → logo.webp (${(newSize/1024).toFixed(1)} KB) — ${savings}% smaller`);
  } catch (err) {
    console.error('  ❌ Failed:', err.message);
  }
}

async function optimizeHeroBg() {
  console.log('\n🌟 Optimizing hero-bg.jpg → hero-bg.webp...');
  const inputPath = path.join(PUBLIC_DIR, 'hero-bg.jpg');
  const outputPath = path.join(PUBLIC_DIR, 'hero-bg.webp');
  
  if (!fs.existsSync(inputPath)) {
    console.log('  ⚠️  hero-bg.jpg not found, skipping.');
    return;
  }

  try {
    await sharp(inputPath)
      .resize(1600, undefined, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);
    
    const origSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((1 - newSize / origSize) * 100).toFixed(1);
    console.log(`  ✅ hero-bg.jpg (${(origSize/1024).toFixed(1)} KB) → hero-bg.webp (${(newSize/1024).toFixed(1)} KB) — ${savings}% smaller`);
  } catch (err) {
    console.error('  ❌ Failed:', err.message);
  }
}

async function main() {
  console.log('=== MEDDET Image Optimization Pipeline ===\n');
  await optimizeIcons();
  await optimizeBackground();
  await optimizeLogo();
  await optimizeHeroBg();
  console.log('\n✨ Image optimization complete!');
}

main().catch(console.error);
