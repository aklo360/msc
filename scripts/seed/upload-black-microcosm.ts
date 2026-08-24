/**
 * Upload Black Voices, Black Microcosm images, set featured image, and order gallery.
 *
 * Uploads 20 JPGs from the exhibition folder (skipping already-uploaded ones),
 * sets a featured_image, and orders the remaining as gallery.
 *
 * Usage: npx tsx scripts/seed/upload-black-microcosm.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {adminQuery} from './admin-client.js';
import {log, sleep, getImageFiles} from './utils.js';

const HANDLE = 'black-microcosm';
const TYPE = 'art_exhibition';

const SOURCE_ROOT = process.env.MSC_SOURCE_ROOT;
if (!SOURCE_ROOT) {
  throw new Error('MSC_SOURCE_ROOT is required for image uploads.');
}

const IMG_DIR = path.join(
  SOURCE_ROOT,
  '1_Art',
  'black voices black microcosm',
);

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
  const BATCH_SIZE = 10;
  const allGids: string[] = [];

  for (let i = 0; i < filePaths.length; i += BATCH_SIZE) {
    const batch = filePaths.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(filePaths.length / BATCH_SIZE);
    log(`  Batch ${batchNum}/${totalBatches} (${batch.length} files)...`);

    const input = batch.map((fp) => ({
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
    for (let j = 0; j < batch.length; j++) {
      const buf = fs.readFileSync(batch[j]);
      const res = await fetch(stagedTargets[j].url, {
        method: 'PUT',
        headers: {'Content-Type': 'image/jpeg'},
        body: buf,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`PUT failed for ${path.basename(batch[j])}: ${text}`);
      }
      log(`  ↑ ${path.basename(batch[j])}`);
    }

    // Create Shopify file records
    const files = stagedTargets.map((t: any, j: number) => ({
      alt: stemOf(path.basename(batch[j])),
      contentType: 'IMAGE' as const,
      originalSource: t.resourceUrl,
    }));
    const createResult = await adminQuery(FILE_CREATE, {files});
    if (createResult.fileCreate.userErrors?.length) {
      console.error('File create errors:', createResult.fileCreate.userErrors);
    }
    const gids = (createResult.fileCreate.files || []).map((f: any) => f.id);
    allGids.push(...gids);

    log(`  ✓ Batch ${batchNum} uploaded`);

    // Rate limit between batches
    if (i + BATCH_SIZE < filePaths.length) {
      await sleep(2000);
    }
  }

  return allGids;
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

  // 2. Gather existing image GIDs
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

  // 3. Get all images from the folder
  const allImages = getImageFiles(IMG_DIR);
  if (allImages.length === 0) {
    log(`⚠ No images found in ${IMG_DIR}`);
    return;
  }
  log(`Found ${allImages.length} images in folder`);

  // 4. Determine which files still need uploading
  const toUpload: string[] = [];
  for (const fp of allImages) {
    const stem = stemOf(path.basename(fp));
    if (!altToGid.has(stem)) {
      toUpload.push(fp);
    } else {
      log(`  already uploaded: ${path.basename(fp)}`);
    }
  }

  // 5. Upload missing files
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
    log('All images already uploaded');
  }

  // 6. Build final assignment: featured (first alphabetically) + gallery (rest)
  const allFilenames = allImages.map((fp) => path.basename(fp));
  const featuredFilename = allFilenames[0]; // getImageFiles sorts alphabetically
  const featuredStem = stemOf(featuredFilename);
  const featuredGid = altToGid.get(featuredStem);

  if (!featuredGid) {
    log(`⚠ Cannot find GID for featured: "${featuredStem}"`);
    log('Available alts:');
    for (const [alt, gid] of altToGid) log(`  "${alt}" → ${gid}`);
    return;
  }

  const galleryGids: string[] = [];
  for (const filename of allFilenames) {
    const stem = stemOf(filename);
    const gid = altToGid.get(stem);
    if (gid && gid !== featuredGid) {
      galleryGids.push(gid);
    } else if (!gid) {
      log(`  ⚠ Missing gallery image: "${stem}"`);
    }
  }

  log(`Featured: "${featuredFilename}" → ${featuredGid}`);
  log(`Gallery: ${galleryGids.length} images`);

  // 7. Update metaobject
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
