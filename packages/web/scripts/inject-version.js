#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read version from package.json
const packageJson = require('../package.json');
const version = packageJson.version;

// For date-based versions, add seconds for extra granularity
const now = new Date();
const seconds = now.getUTCSeconds().toString().padStart(2, '0');
const milliseconds = now.getUTCMilliseconds().toString().padStart(3, '0');

// Create full version with extra precision for cache busting
const versionWithTimestamp = `${version}.${seconds}${milliseconds}`;

console.log(`🔄 Injecting date-based version: ${version}`);
console.log(`📅 Full version with cache-busting: ${versionWithTimestamp}`);

// Find all service worker files (there might be multiple with different hashes)
const distDir = path.join(__dirname, '..', 'dist');
const files = fs.readdirSync(distDir);
const swFiles = files.filter(file => file.startsWith('sw.') && file.endsWith('.js'));

if (swFiles.length === 0) {
  console.error('❌ No service worker files found in dist directory');
  console.log('Available files:', files);
  process.exit(1);
}

console.log(`📁 Found ${swFiles.length} service worker file(s): ${swFiles.join(', ')}`);

let totalUpdated = 0;

// Process all service worker files
swFiles.forEach(swFile => {
  const swPath = path.join(distDir, swFile);
  
  // Read the built service worker
  let swContent = fs.readFileSync(swPath, 'utf8');
  
  // Replace the placeholder with the actual version
  const originalContent = swContent;
  swContent = swContent.replace(/__APP_VERSION__/g, versionWithTimestamp);
  
  if (swContent === originalContent) {
    console.warn(`⚠️  No version placeholder found in ${swFile}`);
  } else {
    // Write the updated service worker
    fs.writeFileSync(swPath, swContent);
    console.log(`✅ Version injected into ${swFile}: ${versionWithTimestamp}`);
    totalUpdated++;
  }
});

if (totalUpdated === 0) {
  console.error('❌ No service worker files were updated — version injection failed');
  process.exit(1);
} else {
  console.log(`🎉 Successfully updated ${totalUpdated} service worker file(s)`);
}

// Also create a version info file for debugging
const versionInfo = {
  version: version,
  fullVersion: versionWithTimestamp,
  buildTime: now.toISOString(),
  buildTimeUTC: now.toUTCString(),
  buildTimestamp: now.getTime(),
  packageVersion: packageJson.version,
  versionFormat: 'YYYY.MM.DD.HHMM.SSSSS (date-based)',
  cacheKey: `kairos-v${versionWithTimestamp}`
};

fs.writeFileSync(
  path.join(__dirname, '..', 'dist', 'version.json'),
  JSON.stringify(versionInfo, null, 2)
);

console.log('📝 Created version.json for debugging');