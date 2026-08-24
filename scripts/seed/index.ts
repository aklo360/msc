/**
 * MSC CMS Seed Script
 *
 * Usage:
 *   npx tsx scripts/seed/index.ts                  # Run all steps
 *   npx tsx scripts/seed/index.ts definitions       # Only create definitions
 *   npx tsx scripts/seed/index.ts upload             # Only upload images
 *   npx tsx scripts/seed/index.ts seed               # Only create entries (no upload)
 *   npx tsx scripts/seed/index.ts editorial          # Only seed editorial
 *
 * Requires .env with:
 *   PUBLIC_STORE_DOMAIN, SHOPIFY_ADMIN_CLIENT_ID, SHOPIFY_ADMIN_CLIENT_SECRET
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import {fileURLToPath} from 'url';

// Load .env from website root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {createDefinitions} from './create-definitions.js';
import {uploadAllImages} from './upload-images.js';
import {seedArt} from './seed-art.js';
import {seedProjects} from './seed-projects.js';
import {seedEditorial} from './seed-editorial.js';
import {seedMusic} from './seed-music.js';
import {log} from './utils.js';

import * as fs from 'fs';

function getSourceDirectories() {
  const sourceRoot = process.env.MSC_SOURCE_ROOT;
  if (!sourceRoot) {
    throw new Error('MSC_SOURCE_ROOT is required for image uploads.');
  }

  return {
    artDir: path.join(sourceRoot, '1_Art'),
    projectsDir: path.join(sourceRoot, '3_Projects'),
  };
}

function getSubfolders(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

async function main() {
  const step = process.argv[2] || 'all';
  log(`MSC CMS Seed — step: ${step}`);

  if (step === 'all' || step === 'definitions') {
    await createDefinitions();
    if (step === 'definitions') return;
  }

  let imageMap = new Map<
    string,
    {featuredGid: string | null; imageGids: string[]}
  >();

  if (step === 'all' || step === 'upload') {
    const {artDir, projectsDir} = getSourceDirectories();
    const artFolders = getSubfolders(artDir);
    const projectFolders = getSubfolders(projectsDir);

    imageMap = await uploadAllImages([
      {baseDir: artDir, folders: artFolders},
      {baseDir: projectsDir, folders: projectFolders},
    ]);

    log(`Image map: ${imageMap.size} folders processed`);
    if (step === 'upload') return;
  }

  if (step === 'all' || step === 'seed' || step === 'art') {
    await seedArt(imageMap);
  }

  if (step === 'all' || step === 'seed' || step === 'projects') {
    await seedProjects(imageMap);
  }

  if (step === 'all' || step === 'seed' || step === 'editorial') {
    await seedEditorial();
  }

  if (step === 'all' || step === 'seed' || step === 'music') {
    await seedMusic();
  }

  log('✓ Seed complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
