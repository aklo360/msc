/**
 * Update existing metaobject entries with image references.
 * Run after `seed` if entries were created without images.
 *
 * Usage: npx tsx scripts/seed/update-images.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {adminQuery} from './admin-client.js';
import {uploadAllImages} from './upload-images.js';
import {ART_EXHIBITIONS} from './data/art-exhibitions.js';
import {PROJECTS} from './data/projects.js';
import {log} from './utils.js';

const SOURCE_ROOT = process.env.MSC_SOURCE_ROOT;
if (!SOURCE_ROOT) {
  throw new Error('MSC_SOURCE_ROOT is required for image uploads.');
}

const ART_DIR = path.join(SOURCE_ROOT, '1_Art');
const PROJECTS_DIR = path.join(SOURCE_ROOT, '3_Projects');

const UPDATE_METAOBJECT = `
  mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject {
        id
        handle
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const LIST_METAOBJECTS = `
  query ListMetaobjects($type: String!, $first: Int!, $after: String) {
    metaobjects(type: $type, first: $first, after: $after) {
      nodes {
        id
        handle
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

async function buildHandleMap(type: string): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  let after: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const result = await adminQuery(LIST_METAOBJECTS, {
      type,
      first: 50,
      after,
    });
    for (const node of result.metaobjects.nodes) {
      map.set(node.handle, node.id);
    }
    hasNext = result.metaobjects.pageInfo.hasNextPage;
    after = result.metaobjects.pageInfo.endCursor;
  }

  return map;
}

function getSubfolders(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, {withFileTypes: true})
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

async function main() {
  log('Uploading images...');
  const artFolders = getSubfolders(ART_DIR);
  const projectFolders = getSubfolders(PROJECTS_DIR);

  const featuredOverrides = new Map<string, string>([
    ['2025_When We Bloom_FREVO', 'download (5).jpeg'],
  ]);

  const galleryFirstOverrides = new Map<string, string>([
    ['2025_When We Bloom_FREVO', 'f7d41bb4fae1fa7c722c50bb0c91aa71bedc24a7.jpg'],
  ]);

  const galleryLastOverrides = new Map<string, string>([
    ['2025_When We Bloom_FREVO', 'dca56e68ba2c2160b9bf722588cd2e88b120c851.jpg'],
  ]);

  const imageMap = await uploadAllImages(
    [
      {baseDir: ART_DIR, folders: artFolders},
      {baseDir: PROJECTS_DIR, folders: projectFolders},
    ],
    featuredOverrides,
    galleryFirstOverrides,
    galleryLastOverrides,
  );

  log(`Image map: ${imageMap.size} folders`);

  // Build handle→id maps
  log('Building handle maps...');
  const artHandleMap = await buildHandleMap('art_exhibition');
  const projectHandleMap = await buildHandleMap('project');
  log(`  Art: ${artHandleMap.size} entries, Projects: ${projectHandleMap.size} entries`);

  // Update art exhibitions
  log('Updating art exhibitions with images...');
  for (const ex of ART_EXHIBITIONS) {
    if (!ex.folder) continue;
    const images = imageMap.get(ex.folder);
    if (!images?.featuredGid && !images?.imageGids?.length) continue;

    const id = artHandleMap.get(ex.handle);
    if (!id) {
      log(`  ⚠ "${ex.title}" (${ex.handle}) not found — skipping`);
      continue;
    }

    try {
      const fields: {key: string; value: string}[] = [];
      if (images.featuredGid) {
        fields.push({key: 'featured_image', value: images.featuredGid});
      }
      if (images.imageGids.length) {
        fields.push({
          key: 'images',
          value: JSON.stringify(images.imageGids),
        });
      }

      await adminQuery(UPDATE_METAOBJECT, {
        id,
        metaobject: {fields},
      });
      log(`  ✓ "${ex.title}" — ${images.imageGids.length} images`);
    } catch (err) {
      console.error(`  ✗ "${ex.title}":`, err);
    }
  }

  // Update projects
  log('Updating projects with images...');
  for (const proj of PROJECTS) {
    if (!proj.folder) continue;
    const images = imageMap.get(proj.folder);
    if (!images?.featuredGid && !images?.imageGids?.length) continue;

    const id = projectHandleMap.get(proj.handle);
    if (!id) {
      log(`  ⚠ "${proj.title}" (${proj.handle}) not found — skipping`);
      continue;
    }

    try {
      const fields: {key: string; value: string}[] = [];
      if (images.featuredGid) {
        fields.push({key: 'featured_image', value: images.featuredGid});
      }
      if (images.imageGids.length) {
        fields.push({
          key: 'images',
          value: JSON.stringify(images.imageGids),
        });
      }

      await adminQuery(UPDATE_METAOBJECT, {
        id,
        metaobject: {fields},
      });
      log(`  ✓ "${proj.title}" — ${images.imageGids.length} images`);
    } catch (err) {
      console.error(`  ✗ "${proj.title}":`, err);
    }
  }

  log('✓ Image update complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
