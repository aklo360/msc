/**
 * Upload a single image and assign it to a metaobject entry.
 * Usage: npx tsx scripts/seed/add-single-image.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {adminQuery} from './admin-client.js';
import {uploadAllImages} from './upload-images.js';
import {log} from './utils.js';

const UPDATE_METAOBJECT = `
  mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject { id handle }
      userErrors { field message }
    }
  }
`;

const LIST_METAOBJECTS = `
  query ListMetaobjects($type: String!, $first: Int!, $after: String) {
    metaobjects(type: $type, first: $first, after: $after) {
      nodes { id handle }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

async function findMetaobject(type: string, handle: string): Promise<string | null> {
  let after: string | null = null;
  let hasNext = true;
  while (hasNext) {
    const result = await adminQuery(LIST_METAOBJECTS, {type, first: 50, after});
    const node = result.metaobjects.nodes.find((n: any) => n.handle === handle);
    if (node) return node.id;
    hasNext = result.metaobjects.pageInfo.hasNextPage;
    after = result.metaobjects.pageInfo.endCursor;
  }
  return null;
}

async function main() {
  const FOLDER = '2021_Black Voices';
  const BASE_DIR = '/Users/aklo/Downloads/MSC Website/1_Art';
  const HANDLE = 'black-voices-friend';
  const TYPE = 'art_exhibition';

  log(`Uploading images for "${FOLDER}"...`);
  const featuredOverrides = new Map([[FOLDER, 'download (5).jpg']]);
  const imageMap = await uploadAllImages([
    {baseDir: BASE_DIR, folders: [FOLDER]},
  ], featuredOverrides);

  const images = imageMap.get(FOLDER);
  if (!images?.featuredGid && !images?.imageGids?.length) {
    log('No images uploaded — exiting');
    return;
  }

  log(`Uploaded: featured=${!!images.featuredGid}, gallery=${images.imageGids.length}`);

  const id = await findMetaobject(TYPE, HANDLE);
  if (!id) {
    log(`⚠ "${HANDLE}" not found`);
    return;
  }

  const fields: {key: string; value: string}[] = [];
  if (images.featuredGid) {
    fields.push({key: 'featured_image', value: images.featuredGid});
  }
  if (images.imageGids.length) {
    fields.push({key: 'images', value: JSON.stringify(images.imageGids)});
  }

  await adminQuery(UPDATE_METAOBJECT, {id, metaobject: {fields}});
  log(`✓ Updated "${HANDLE}" with ${images.imageGids.length} images`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
