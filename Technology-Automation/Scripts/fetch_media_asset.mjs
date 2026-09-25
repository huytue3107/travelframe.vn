#!/usr/bin/env node
/**
 * Media Asset Fetcher — Pexels API & Stock Asset Management
 * Part of TravelFrame Company OS (Technology-Automation)
 * 
 * Usage:
 *   node Technology-Automation/Scripts/fetch_media_asset.mjs search "hanoi street food" --per-page 5
 *   node Technology-Automation/Scripts/fetch_media_asset.mjs download <photoId> --dest Creative-Production/Assets/Stock
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load .env manually if process.env.PEXELS_API_KEY is not already set
function loadEnv() {
  if (process.env.PEXELS_API_KEY) return;
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

const API_KEY = process.env.PEXELS_API_KEY;

if (!API_KEY) {
  console.error('Error: PEXELS_API_KEY not found in environment or .env file.');
  process.exit(1);
}

const args = process.argv.slice(2);
const command = args[0] || 'help';

function parseFlags(rawArgs) {
  const flags = {};
  for (let i = 0; i < rawArgs.length; i++) {
    if (rawArgs[i].startsWith('--')) {
      const key = rawArgs[i].slice(2);
      const nextVal = rawArgs[i + 1];
      if (nextVal && !nextVal.startsWith('--')) {
        flags[key] = nextVal;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

async function searchPexels(query, options = {}) {
  const perPage = options['per-page'] || options.count || 5;
  const orientation = options.orientation || ''; // landscape, portrait, square
  const page = options.page || 1;

  let url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`;
  if (orientation) {
    url += `&orientation=${encodeURIComponent(orientation)}`;
  }

  const res = await fetch(url, {
    headers: { Authorization: API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  }

  return await res.json();
}

async function downloadPhoto(photoId, destDir = 'Creative-Production/Assets/Stock') {
  const url = `https://api.pexels.com/v1/photos/${photoId}`;
  const res = await fetch(url, {
    headers: { Authorization: API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch photo #${photoId}: ${res.status} ${res.statusText}`);
  }

  const photo = await res.json();
  const downloadUrl = photo.src.large2x || photo.src.large || photo.src.original;

  const targetDir = path.resolve(process.cwd(), destDir);
  fs.mkdirSync(targetDir, { recursive: true });

  const safePhotographer = (photo.photographer || 'photographer').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const filename = `pexels-${photo.id}-${safePhotographer}.jpg`;
  const filePath = path.join(targetDir, filename);

  const imgRes = await fetch(downloadUrl);
  if (!imgRes.ok) throw new Error(`Failed to download image file: ${imgRes.status}`);

  const buffer = Buffer.from(await imgRes.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  // Write attribution metadata JSON
  const metaPath = path.join(targetDir, `pexels-${photo.id}.json`);
  const metaData = {
    id: photo.id,
    width: photo.width,
    height: photo.height,
    url: photo.url,
    photographer: photo.photographer,
    photographer_url: photo.photographer_url,
    alt: photo.alt || '',
    local_file: filename,
    downloaded_at: new Date().toISOString(),
    attribution: `Photo by ${photo.photographer} on Pexels (${photo.url})`,
    markdown: `![${photo.alt || 'TravelFrame Hanoi'}](./${filename})\n*Photo: ${photo.photographer} / Pexels*`
  };
  fs.writeFileSync(metaPath, JSON.stringify(metaData, null, 2), 'utf8');

  return { filePath, metaPath, metaData };
}

async function main() {
  const flags = parseFlags(args);

  if (command === 'search') {
    const query = args[1] && !args[1].startsWith('--') ? args[1] : 'hanoi vietnam';
    console.log(`Searching Pexels for: "${query}"...`);
    const data = await searchPexels(query, flags);
    console.log(`Found ${data.total_results} results (showing ${data.photos?.length}):\n`);

    if (flags.json) {
      console.log(JSON.stringify(data.photos, null, 2));
      return;
    }

    data.photos?.forEach((p, idx) => {
      console.log(`[${idx + 1}] ID: ${p.id}`);
      console.log(`    Alt: "${p.alt || 'No description'}"`);
      console.log(`    Photographer: ${p.photographer} (${p.photographer_url})`);
      console.log(`    Dimensions: ${p.width}x${p.height}`);
      console.log(`    Preview URL: ${p.src.medium}`);
      console.log(`    Large URL: ${p.src.large}`);
      console.log(`    Download command: node Technology-Automation/Scripts/fetch_media_asset.mjs download ${p.id}\n`);
    });
  } else if (command === 'download') {
    const photoId = args[1];
    if (!photoId || isNaN(photoId)) {
      console.error('Usage: node fetch_media_asset.mjs download <photoId> [--dest <path>]');
      process.exit(1);
    }
    const dest = flags.dest || 'Creative-Production/Assets/Stock';
    console.log(`Downloading photo #${photoId} to ${dest}...`);
    const result = await downloadPhoto(photoId, dest);
    console.log(`Successfully downloaded!`);
    console.log(`- Image: ${result.filePath}`);
    console.log(`- Metadata: ${result.metaPath}`);
    console.log(`- Markdown embed:`);
    console.log(`  ${result.metaData.markdown}`);
  } else {
    console.log(`TravelFrame Media Asset Tool (Pexels API)
Commands:
  search <query> [--per-page N] [--orientation landscape|portrait|square] [--json]
    Search for stock travel photos matching keywords.
    Example: node Technology-Automation/Scripts/fetch_media_asset.mjs search "hanoi egg coffee" --per-page 3

  download <photoId> [--dest <path>]
    Download high-resolution image with metadata attribution.
    Example: node Technology-Automation/Scripts/fetch_media_asset.mjs download 28005557 --dest Creative-Production/Assets/Stock
`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
