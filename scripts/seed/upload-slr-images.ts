/**
 * Upload SLR pendant images, set featured image, and order gallery.
 *
 * Uploads 7 selected images from the SLR folder (skipping already-uploaded ones),
 * sets the 3-pendants hero as featured_image, and orders the remaining 6 as gallery.
 *
 * Usage: npx tsx scripts/seed/upload-slr-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {adminQuery} from './admin-client.js';
import {log, sleep} from './utils.js';

const HANDLE = 'loverboy-x-slr-pendant';
const TYPE = 'project';

const SOURCE_ROOT = process.env.MSC_SOURCE_ROOT;
if (!SOURCE_ROOT) {
  throw new Error('MSC_SOURCE_ROOT is required for image uploads.');
}

const SLR_DIR = path.join(
  SOURCE_ROOT,
  '3_Projects',
  'SLR x Mr.StarCity Jewelry Collab',
);

/** Featured image filename */
const FEATURED_FILE = '94d9c9aeec1cf24d7bdad7ff2a7468d28ee97b71.jpg';

/** Gallery order (filenames, after featured is excluded) */
const GALLERY_ORDER = [
  'b48fd6de04d53b7b03c4a30373eb72d003578b00.jpg',
  'c87eba7ca99b0aca124f877c76f4c708753b7f08.jpg',
  '337929646_2439568719529816_5704981438881874985_n.jpg',
  'ba8c7d3144834422f9eb4751974ad6a9dbe4645a.jpg',
  'd0adb73bdf751248fceef62a27d306605a2a69b1.jpg',
  '94e814629ae316533d0e9cc124cc79d6debb933f.jpg',
];

const ALL_FILES = [FEATURED_FILE, ...GALLERY_ORDER];

// ── GraphQL ──────────────────────────────────────────

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

const STAGED_UPLOADS_CREATE = `
  mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters { name value }
      }
      userErrors { field message }
    }
  }
`;

const FILE_CREATE = `
  mutation FileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files { id alt ... on MediaImage { image { url } } }
      userErrors { field message }
    }
  }
`;

const FILE_QUERY = `
  query FileQuery($query: String!) {
    files(first: 10, query: $query) {
      nodes { id ... on MediaImage { image { url } fileStatus } }
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

// ── Helpers ──────────────────────────────────────────

function stemOf(filename: string): string {
  return filename.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
}

async function uploadFiles(filePaths: string[]): Promise<string[]> {
  const input = filePaths.map((fp) => ({
    filename: path.basename(fp),
    mimeType: 'image/jpeg',
    resource: 'IMAGE' as const,
    fileSize: String(fs.statSync(fp).size),
    httpMethod: 'PUT' as const,
  }));

  const result = await adminQuery(STAGED_UPLOADS_CREATE, {input});
  const {stagedTargets, userErrors} = result.stagedUploadsCreate;
  if (userErrors?.length) throw new Error(JSON.stringify(userErrors));

  // PUT files to S3
  for (let i = 0; i < filePaths.length; i++) {
    const buf = fs.readFileSync(filePaths[i]);
    const res = await fetch(stagedTargets[i].url, {
      method: 'PUT',
      headers: {'Content-Type': 'image/jpeg'},
      body: buf,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PUT failed for ${path.basename(filePaths[i])}: ${text}`);
    }
    log(`  ↑ ${path.basename(filePaths[i])}`);
  }

  // Create Shopify file records
  const files = stagedTargets.map((t: any, i: number) => ({
    alt: stemOf(path.basename(filePaths[i])),
    contentType: 'IMAGE' as const,
    originalSource: t.resourceUrl,
  }));
  const createResult = await adminQuery(FILE_CREATE, {files});
  if (createResult.fileCreate.userErrors?.length) {
    console.error('File create errors:', createResult.fileCreate.userErrors);
  }
  return (createResult.fileCreate.files || []).map((f: any) => f.id);
}

async function waitForFiles(gids: string[]): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt++) {
    let allReady = true;
    for (const gid of gids) {
      const numId = gid.split('/').pop();
      const result = await adminQuery(FILE_QUERY, {query: `id:${numId}`});
      const file = result.files?.nodes?.[0];
      if (!file || file.fileStatus !== 'READY') {
        allReady = false;
        break;
      }
    }
    if (allReady) return;
    await sleep(2000);
  }
  log('⚠ Some files may not be READY — continuing');
}

// ── Main ─────────────────────────────────────────────

async function main() {
  // 1. Find metaobject
  const result = await adminQuery(GET_METAOBJECT, {type: TYPE, first: 50});
  const obj = result.metaobjects.nodes.find(
    (n: any) => n.handle === HANDLE,
  );
  if (!obj) {
    log(`⚠ "${HANDLE}" not found`);
    return;
  }
  log(`Found "${HANDLE}" — ${obj.id}`);

  // 2. Gather existing image GIDs and resolve their alt text
  const imagesField = obj.fields.find((f: any) => f.key === 'images');
  const featuredField = obj.fields.find(
    (f: any) => f.key === 'featured_image',
  );
  const existingGalleryGids: string[] = imagesField?.value
    ? JSON.parse(imagesField.value)
    : [];
  const existingFeaturedGid = featuredField?.value || '';

  const allExistingGids = [...existingGalleryGids];
  if (existingFeaturedGid && !allExistingGids.includes(existingFeaturedGid)) {
    allExistingGids.push(existingFeaturedGid);
  }

  // Map: alt text stem → GID (for already-uploaded images)
  const altToGid = new Map<string, string>();
  if (allExistingGids.length > 0) {
    const filesResult = await adminQuery(GET_FILES, {ids: allExistingGids});
    for (const node of filesResult.nodes) {
      if (node?.id && node?.alt) {
        altToGid.set(node.alt, node.id);
        log(`  existing: "${node.alt}" → ${node.id}`);
      }
    }
  }

  // 3. Determine which of our 7 files still need uploading
  const toUpload: string[] = [];
  for (const filename of ALL_FILES) {
    const stem = stemOf(filename);
    if (!altToGid.has(stem)) {
      const fp = path.join(SLR_DIR, filename);
      if (fs.existsSync(fp)) {
        toUpload.push(fp);
      } else {
        log(`  ⚠ File not found: ${fp}`);
      }
    } else {
      log(`  already uploaded: ${filename}`);
    }
  }

  // 4. Upload missing files
  if (toUpload.length > 0) {
    log(`Uploading ${toUpload.length} new images...`);
    const newGids = await uploadFiles(toUpload);
    log(`Waiting for ${newGids.length} files to process...`);
    await waitForFiles(newGids);

    // Resolve new GIDs to alt text
    const newFilesResult = await adminQuery(GET_FILES, {ids: newGids});
    for (const node of newFilesResult.nodes) {
      if (node?.id && node?.alt) {
        altToGid.set(node.alt, node.id);
        log(`  uploaded: "${node.alt}" → ${node.id}`);
      }
    }
  } else {
    log('All 7 images already uploaded');
  }

  // 5. Build final assignment: featured + ordered gallery
  const featuredStem = stemOf(FEATURED_FILE);
  const featuredGid = altToGid.get(featuredStem);
  if (!featuredGid) {
    log(`⚠ Cannot find GID for featured: "${featuredStem}"`);
    log('Available alts:');
    for (const [alt, gid] of altToGid) log(`  "${alt}" → ${gid}`);
    return;
  }

  const galleryGids: string[] = [];
  for (const filename of GALLERY_ORDER) {
    const stem = stemOf(filename);
    const gid = altToGid.get(stem);
    if (gid && gid !== featuredGid) {
      galleryGids.push(gid);
    } else if (!gid) {
      log(`  ⚠ Missing gallery image: "${stem}"`);
    }
  }

  log(`Featured: ${featuredGid}`);
  log(`Gallery: ${galleryGids.length} images`);

  // 6. Update metaobject
  await adminQuery(UPDATE_METAOBJECT, {
    id: obj.id,
    metaobject: {
      fields: [
        {key: 'featured_image', value: featuredGid},
        {key: 'images', value: JSON.stringify(galleryGids)},
      ],
    },
  });
  log(`✓ Updated "${HANDLE}" — featured + ${galleryGids.length} gallery images`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
