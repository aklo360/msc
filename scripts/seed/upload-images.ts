import * as fs from 'fs';
import * as path from 'path';
import {adminQuery} from './admin-client.js';
import {getImageFiles, sleep, log} from './utils.js';

const STAGED_UPLOADS_CREATE = `
  mutation StagedUploadsCreate($input: [StagedUploadInput!]!) {
    stagedUploadsCreate(input: $input) {
      stagedTargets {
        url
        resourceUrl
        parameters {
          name
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const FILE_CREATE = `
  mutation FileCreate($files: [FileCreateInput!]!) {
    fileCreate(files: $files) {
      files {
        id
        alt
        ... on MediaImage {
          image {
            url
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const FILE_QUERY = `
  query FileQuery($query: String!) {
    files(first: 10, query: $query) {
      nodes {
        id
        ... on MediaImage {
          image {
            url
          }
          fileStatus
        }
      }
    }
  }
`;

interface UploadResult {
  /** Maps local file path → Shopify file GID */
  fileGids: Map<string, string>;
}

async function stagedUpload(
  filePaths: string[],
): Promise<{url: string; resourceUrl: string; params: {name: string; value: string}[]}[]> {
  const input = filePaths.map((fp) => {
    const ext = path.extname(fp).toLowerCase();
    const mimeType =
      ext === '.png'
        ? 'image/png'
        : ext === '.webp'
          ? 'image/webp'
          : 'image/jpeg';
    return {
      filename: path.basename(fp),
      mimeType,
      resource: 'IMAGE' as const,
      fileSize: String(fs.statSync(fp).size),
      httpMethod: 'PUT' as const,
    };
  });

  const result = await adminQuery(STAGED_UPLOADS_CREATE, {input});
  const {stagedTargets, userErrors} = result.stagedUploadsCreate;
  if (userErrors?.length) {
    throw new Error(`Staged upload errors: ${JSON.stringify(userErrors)}`);
  }
  return stagedTargets.map((t: any) => ({
    url: t.url,
    resourceUrl: t.resourceUrl,
    params: t.parameters,
  }));
}

async function putFile(
  localPath: string,
  target: {url: string; params: {name: string; value: string}[]},
): Promise<void> {
  const ext = path.extname(localPath).toLowerCase();
  const mimeType =
    ext === '.png'
      ? 'image/png'
      : ext === '.webp'
        ? 'image/webp'
        : 'image/jpeg';

  const fileBuffer = fs.readFileSync(localPath);

  // PUT method: send raw file body directly to the signed URL
  const res = await fetch(target.url, {
    method: 'PUT',
    headers: {'Content-Type': mimeType},
    body: fileBuffer,
  });

  if (!res.ok && res.status !== 200) {
    const text = await res.text();
    throw new Error(`PUT failed for ${path.basename(localPath)} (${res.status}): ${text}`);
  }
}

async function createFiles(
  resourceUrls: string[],
  filenames: string[],
): Promise<string[]> {
  const files = resourceUrls.map((url, i) => ({
    alt: filenames[i].replace(/\.[^.]+$/, '').replace(/[_-]/g, ' '),
    contentType: 'IMAGE' as const,
    originalSource: url,
  }));

  const result = await adminQuery(FILE_CREATE, {files});
  const {files: createdFiles, userErrors} = result.fileCreate;
  if (userErrors?.length) {
    console.error('File create errors:', userErrors);
  }
  return (createdFiles || []).map((f: any) => f.id);
}

async function waitForFiles(fileGids: string[]): Promise<void> {
  const maxAttempts = 30;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let allReady = true;
    for (const gid of fileGids) {
      const numericId = gid.split('/').pop();
      const result = await adminQuery(FILE_QUERY, {
        query: `id:${numericId}`,
      });
      const file = result.files?.nodes?.[0];
      if (!file || file.fileStatus !== 'READY') {
        allReady = false;
        break;
      }
    }
    if (allReady) return;
    await sleep(2000);
  }
  log('⚠ Some files may not be READY yet — continuing anyway');
}

/**
 * Upload all images from a set of directories.
 * Returns a map: folder name → {featuredGid, imageGids[]}
 *
 * @param featuredOverrides - Map of folder name → filename to use as featured image
 *   (instead of the default first-alphabetically)
 */
export async function uploadAllImages(
  baseDirs: {baseDir: string; folders: string[]}[],
  featuredOverrides?: Map<string, string>,
  /** filename to place first in the gallery images list */
  galleryFirstOverrides?: Map<string, string>,
  /** filename to place last in the gallery images list */
  galleryLastOverrides?: Map<string, string>,
): Promise<
  Map<string, {featuredGid: string | null; imageGids: string[]}>
> {
  const resultMap = new Map<
    string,
    {featuredGid: string | null; imageGids: string[]}
  >();

  // Collect all files to upload with their folder association
  const allFiles: {folder: string; filePath: string; isFeatured: boolean}[] = [];

  for (const {baseDir, folders} of baseDirs) {
    for (const folder of folders) {
      const dirPath = path.join(baseDir, folder);
      const images = getImageFiles(dirPath);
      if (images.length === 0) {
        log(`  ⚠ No images in "${folder}" — skipping`);
        resultMap.set(folder, {featuredGid: null, imageGids: []});
        continue;
      }
      images.forEach((fp, i) => {
        allFiles.push({folder, filePath: fp, isFeatured: i === 0});
      });
    }
  }

  log(`Total images to upload: ${allFiles.length}`);

  // Process in batches of 10
  const BATCH_SIZE = 10;
  const fileGidMap = new Map<string, string>(); // filePath → GID

  for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
    const batch = allFiles.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(allFiles.length / BATCH_SIZE);
    log(`  Batch ${batchNum}/${totalBatches} (${batch.length} files)...`);

    try {
      // 1. Create staged uploads
      const targets = await stagedUpload(batch.map((b) => b.filePath));

      // 2. Upload files to S3
      for (let j = 0; j < batch.length; j++) {
        await putFile(batch[j].filePath, targets[j]);
      }

      // 3. Create file records in Shopify
      const resourceUrls = targets.map((t) => t.resourceUrl);
      const filenames = batch.map((b) => path.basename(b.filePath));
      const gids = await createFiles(resourceUrls, filenames);

      // 4. Map GIDs back
      for (let j = 0; j < batch.length; j++) {
        if (gids[j]) {
          fileGidMap.set(batch[j].filePath, gids[j]);
        }
      }

      log(`  ✓ Batch ${batchNum} uploaded`);
    } catch (err) {
      console.error(`  ✗ Batch ${batchNum} failed:`, err);
    }

    // Rate limit between batches
    if (i + BATCH_SIZE < allFiles.length) {
      await sleep(2000);
    }
  }

  // Wait for all files to be processed
  const allGids = Array.from(fileGidMap.values());
  if (allGids.length > 0) {
    log('Waiting for files to process...');
    await waitForFiles(allGids);
    log('✓ All files ready');
  }

  // Build result map: folder → {featuredGid, imageGids}
  for (const {baseDir, folders} of baseDirs) {
    for (const folder of folders) {
      const dirPath = path.join(baseDir, folder);
      const images = getImageFiles(dirPath);
      if (images.length === 0) continue;

      const overrideFile = featuredOverrides?.get(folder);
      const featuredPath = overrideFile
        ? images.find((fp) => path.basename(fp) === overrideFile) || images[0]
        : images[0];
      const featuredGid = fileGidMap.get(featuredPath) || null;
      let imageGids = images
        .map((fp) => fileGidMap.get(fp))
        .filter((g): g is string => !!g);

      // Move a specific image to position 0 if override exists
      const firstFile = galleryFirstOverrides?.get(folder);
      if (firstFile) {
        const firstPath = images.find((fp) => path.basename(fp) === firstFile);
        if (firstPath) {
          const firstGid = fileGidMap.get(firstPath);
          if (firstGid) {
            imageGids = [firstGid, ...imageGids.filter((g) => g !== firstGid)];
          }
        }
      }

      // Move a specific image to last position if override exists
      const lastFile = galleryLastOverrides?.get(folder);
      if (lastFile) {
        const lastPath = images.find((fp) => path.basename(fp) === lastFile);
        if (lastPath) {
          const lastGid = fileGidMap.get(lastPath);
          if (lastGid) {
            imageGids = [...imageGids.filter((g) => g !== lastGid), lastGid];
          }
        }
      }

      resultMap.set(folder, {featuredGid, imageGids});
    }
  }

  return resultMap;
}
