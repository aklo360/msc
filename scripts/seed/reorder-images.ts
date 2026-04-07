/**
 * Reorder images for a specific metaobject entry.
 * Reads current image GIDs + alt texts, reorders by desired filename order, updates.
 *
 * Usage: npx tsx scripts/seed/reorder-images.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {adminQuery} from './admin-client.js';
import {log} from './utils.js';

const GET_METAOBJECT = `
  query GetMetaobject($type: String!, $first: Int!, $after: String) {
    metaobjects(type: $type, first: $first, after: $after) {
      nodes {
        id
        handle
        fields {
          key
          value
        }
      }
    }
  }
`;

const GET_FILES = `
  query GetFiles($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on MediaImage {
        id
        alt
        image {
          url
        }
      }
    }
  }
`;

const UPDATE_METAOBJECT = `
  mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject { id handle }
      userErrors { field message }
    }
  }
`;

interface ImageOrder {
  handle: string;
  type: string;
  /** Filenames in desired order. Images not listed are appended alphabetically. */
  order: string[];
}

const REORDERS: ImageOrder[] = [
  {
    handle: 'when-we-bloom',
    type: 'art_exhibition',
    order: [
      'f7d41bb4fae1fa7c722c50bb0c91aa71bedc24a7.jpg',
      '4da90f56f7a46cd020827902d8d89c18e8aa7a68.jpg',
      '862ef130bca43b0361f4dac223a233c282ea12b8.jpg',
      '22d184e1f7b86776f6d01d19a124616c44313d4a.jpg',
      '4283a7564b9009f25b2a21fdb67aa5d0f1d68b17.jpg',
      'c46f20d523b35e449ba0b180add3aaee811ce609.jpg',
      '21c298d2fff910349f1576af18530892865ade15.jpg',
      '7f17d193e859b58f566cb8644585ab23d163bd5e.jpg',
    ],
  },
];

/** Filename that must always be last */
const FORCE_LAST: Record<string, string> = {
  'when-we-bloom': 'dca56e68ba2c2160b9bf722588cd2e88b120c851',
};

async function main() {
  for (const entry of REORDERS) {
    log(`Reordering images for "${entry.handle}"...`);

    // 1. Find the metaobject
    const result = await adminQuery(GET_METAOBJECT, {
      type: entry.type,
      first: 50,
    });
    const obj = result.metaobjects.nodes.find(
      (n: any) => n.handle === entry.handle,
    );
    if (!obj) {
      log(`  ⚠ "${entry.handle}" not found — skipping`);
      continue;
    }

    // 2. Get current image GIDs
    const imagesField = obj.fields.find((f: any) => f.key === 'images');
    if (!imagesField?.value) {
      log(`  ⚠ No images field — skipping`);
      continue;
    }
    const currentGids: string[] = JSON.parse(imagesField.value);
    log(`  Current: ${currentGids.length} images`);

    // 3. Resolve GIDs to alt texts (filenames)
    const filesResult = await adminQuery(GET_FILES, {ids: currentGids});
    const altToGid = new Map<string, string>();
    for (const node of filesResult.nodes) {
      if (node?.id && node?.alt) {
        altToGid.set(node.alt, node.id);
      }
    }

    // 4. Build new order
    const newGids: string[] = [];
    const used = new Set<string>();

    // First: explicitly ordered images
    for (const filename of entry.order) {
      const alt = filename.replace(/\.[^.]+$/, '');
      const gid = altToGid.get(alt);
      if (gid) {
        newGids.push(gid);
        used.add(gid);
      } else {
        log(`  ⚠ "${filename}" not found in current images`);
      }
    }

    // Middle: remaining images in their current order (excluding force-last)
    const forceLast = FORCE_LAST[entry.handle];
    let lastGid: string | null = null;
    for (const gid of currentGids) {
      if (used.has(gid)) continue;
      const node = filesResult.nodes.find((n: any) => n?.id === gid);
      if (forceLast && node?.alt === forceLast) {
        lastGid = gid;
        continue;
      }
      newGids.push(gid);
      used.add(gid);
    }

    // Last: force-last image
    if (lastGid) {
      newGids.push(lastGid);
    }

    log(`  Reordered: ${newGids.length} images`);
    log(`  First: ${filesResult.nodes.find((n: any) => n?.id === newGids[0])?.alt}`);
    log(`  Last: ${filesResult.nodes.find((n: any) => n?.id === newGids[newGids.length - 1])?.alt}`);

    // 5. Update the metaobject
    await adminQuery(UPDATE_METAOBJECT, {
      id: obj.id,
      metaobject: {
        fields: [{key: 'images', value: JSON.stringify(newGids)}],
      },
    });
    log(`  ✓ Updated "${entry.handle}"`);
  }

  log('✓ Reorder complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
