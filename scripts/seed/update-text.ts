/**
 * Update existing metaobject entries with text fields (description, body).
 * Run after initial seed to add text content to entries.
 *
 * Usage: npx tsx scripts/seed/update-text.ts
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path: path.resolve(__dirname, '../../.env')});

import {adminQuery} from './admin-client.js';
import {ART_EXHIBITIONS} from './data/art-exhibitions.js';
import {PROJECTS} from './data/projects.js';
import {log} from './utils.js';

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

const DEFAULT_DESCRIPTION = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at enim quis ante tristique fringilla vitae non turpis. Sed ac sagittis nibh. Nunc imperdiet neque pretium risus porttitor, nec congue massa rhoncus. Aliquam porttitor efficitur nunc at volutpat. Cras nisl orci, condimentum nec nibh et, viverra venenatis purus. Suspendisse massa est, convallis vel posuere sed, ullamcorper faucibus nibh. Quisque ut sollicitudin tellus. Aliquam eros volutpat. Sed elementum nisi non sapien malesuada, sed rhoncus dolor scelerisque. Etiam laoreet velit vel nibh blandit ullamcorper.';

async function main() {
  log('Building handle maps...');
  const artHandleMap = await buildHandleMap('art_exhibition');
  log(`  Art: ${artHandleMap.size} entries`);

  log('Updating art exhibitions with text fields...');
  for (const ex of ART_EXHIBITIONS) {
    const description = ex.description || DEFAULT_DESCRIPTION;
    const fields: {key: string; value: string}[] = [
      {key: 'description', value: description},
    ];
    if (ex.body) {
      fields.push({key: 'body', value: ex.body});
    }

    const id = artHandleMap.get(ex.handle);
    if (!id) {
      log(`  ⚠ "${ex.title}" (${ex.handle}) not found — skipping`);
      continue;
    }

    try {
      await adminQuery(UPDATE_METAOBJECT, {
        id,
        metaobject: {fields},
      });
      log(`  ✓ "${ex.title}" — updated ${fields.map((f) => f.key).join(', ')}`);
    } catch (err) {
      console.error(`  ✗ "${ex.title}":`, err);
    }
  }

  // Update projects
  log('Building project handle map...');
  const projectHandleMap = await buildHandleMap('project');
  log(`  Projects: ${projectHandleMap.size} entries`);

  log('Updating projects with text fields...');
  for (const proj of PROJECTS) {
    const description = proj.description || DEFAULT_DESCRIPTION;
    const fields: {key: string; value: string}[] = [
      {key: 'description', value: description},
    ];
    if (proj.body) {
      fields.push({key: 'body', value: proj.body});
    }

    const id = projectHandleMap.get(proj.handle);
    if (!id) {
      log(`  ⚠ "${proj.title}" (${proj.handle}) not found — skipping`);
      continue;
    }

    try {
      await adminQuery(UPDATE_METAOBJECT, {
        id,
        metaobject: {fields},
      });
      log(`  ✓ "${proj.title}" — updated ${fields.map((f) => f.key).join(', ')}`);
    } catch (err) {
      console.error(`  ✗ "${proj.title}":`, err);
    }
  }

  log('✓ Text update complete!');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
