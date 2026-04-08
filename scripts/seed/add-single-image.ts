/**
 * Swap featured image for a metaobject entry (no re-upload needed).
 * Finds the image GID by alt text match, sets it as featured_image,
 * and reorders the images list.
 *
 * Usage: npx tsx scripts/seed/add-single-image.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {adminQuery} from './admin-client.js';
import {log} from './utils.js';

const GET_METAOBJECT = `
  query GetMetaobject($type: String!, $first: Int!) {
    metaobjects(type: $type, first: $first) {
      nodes { id handle fields { key value } }
    }
  }
`;

const GET_FILES = `
  query GetFiles($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on MediaImage { id alt image { url } }
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

async function main() {
  const HANDLE = 'loverboy-x-billionaire-boys-club';
  const TYPE = 'project';
  const NEW_FEATURED_ALT = 'd02d9ec2d71bcb1e36d0d0b20576423c1730fc8c';
  /** Desired gallery order (by alt text / filename stem) */
  const GALLERY_ORDER = [
    'ecabc88c2298fd3e4e4b8727c8e91fd10c25dacc',
    '787e72fb64c27150460eadda074ffb87adde2863',
    '23653a30c5e6bef3e7cc46f9e143a8a9c1b3d9ed',
    '6c1de2089a0a4dac3dce1144851c35d7eedd6e16',
    'e89d1a01ce237a989a235f71e7b124756c63c835',
  ];

  // 1. Find metaobject
  const result = await adminQuery(GET_METAOBJECT, {type: TYPE, first: 50});
  const obj = result.metaobjects.nodes.find((n: any) => n.handle === HANDLE);
  if (!obj) { log(`⚠ "${HANDLE}" not found`); return; }
  log(`Found "${HANDLE}" — ${obj.id}`);

  // 2. Get all image GIDs (featured + gallery)
  const imagesField = obj.fields.find((f: any) => f.key === 'images');
  const featuredField = obj.fields.find((f: any) => f.key === 'featured_image');
  const imageGids: string[] = imagesField?.value ? JSON.parse(imagesField.value) : [];
  const allGids = [...imageGids];
  if (featuredField?.value && !allGids.includes(featuredField.value)) {
    allGids.push(featuredField.value);
  }

  // 3. Resolve GIDs to alt text
  const filesResult = await adminQuery(GET_FILES, {ids: allGids});
  const altToGid = new Map<string, string>();
  for (const node of filesResult.nodes) {
    if (node?.id && node?.alt) {
      altToGid.set(node.alt, node.id);
      log(`  ${node.alt} → ${node.id}`);
    }
  }

  // 4. Find new featured GID
  const newFeaturedGid = altToGid.get(NEW_FEATURED_ALT);
  if (!newFeaturedGid) { log(`⚠ Featured alt "${NEW_FEATURED_ALT}" not found`); return; }
  log(`New featured: ${newFeaturedGid}`);

  // 5. Build reordered gallery (excluding new featured)
  const newGids: string[] = [];
  const used = new Set<string>([newFeaturedGid]);
  for (const alt of GALLERY_ORDER) {
    const gid = altToGid.get(alt);
    if (gid && !used.has(gid)) {
      newGids.push(gid);
      used.add(gid);
    } else if (!gid) {
      log(`  ⚠ "${alt}" not found`);
    }
  }
  // Append any remaining
  for (const gid of allGids) {
    if (!used.has(gid)) { newGids.push(gid); used.add(gid); }
  }

  log(`Gallery: ${newGids.length} images`);

  // 6. Update
  await adminQuery(UPDATE_METAOBJECT, {
    id: obj.id,
    metaobject: {
      fields: [
        {key: 'featured_image', value: newFeaturedGid},
        {key: 'images', value: JSON.stringify(newGids)},
      ],
    },
  });
  log(`✓ Updated "${HANDLE}" — featured swapped, gallery reordered`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
