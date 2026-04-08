/**
 * One-off: Fix broken editorial external_url values in Shopify metaobjects.
 * Also update the Garden of Love entry's URL.
 *
 * Run: npx tsx scripts/seed/fix-editorial-urls.ts
 */
import {adminQuery} from './admin-client.js';
import {log} from './utils.js';

const URL_FIXES: Record<string, string> = {
  'david-mr-starcity-white-exhibits-at-frevo':
    'https://www.seegreatart.art/david-mr-starcity-white-with-exhibition-at-michelin-starred-nyc-restaurant/',
  'mr-starcity-unites-poetry-performance-and-painting':
    'https://artcurrently.com/mr-starcity-at-the-pit-los-angeles',
  'garden-of-love-the-pit-la':
    'https://www.the-pit.la/david-mr-starcity-white',
  'art-fair-philippines-2024-10-must-sees':
    'https://www.gmanetwork.com/news/lifestyle/artandculture/897684/art-fair-philippines-2024-here-are-10-must-sees-for-a-worthwhile-visit/story/',
  '10-questions-with-david-mr-starcity-white':
    'https://beyondthestreets.com/blogs/articles/beyond-the-streets-on-paper-10-questions-with-david-mr-starcity-white',
};

const LIST_QUERY = `
  query ListEditorial($first: Int!, $after: String) {
    metaobjects(type: "editorial", first: $first, after: $after) {
      nodes { id handle }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const UPDATE_MUTATION = `
  mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
    metaobjectUpdate(id: $id, metaobject: $metaobject) {
      metaobject { id handle }
      userErrors { field message }
    }
  }
`;

async function main() {
  // Collect all editorial metaobjects
  const all: Array<{id: string; handle: string}> = [];
  let after: string | null = null;
  while (true) {
    const result: any = await adminQuery(LIST_QUERY, {first: 50, after});
    all.push(...result.metaobjects.nodes);
    if (!result.metaobjects.pageInfo.hasNextPage) break;
    after = result.metaobjects.pageInfo.endCursor;
  }
  log(`Found ${all.length} editorial metaobjects`);

  for (const [handle, newUrl] of Object.entries(URL_FIXES)) {
    const node = all.find((n) => n.handle === handle);
    if (!node) {
      log(`⚠ Not found: ${handle}`);
      continue;
    }

    const result: any = await adminQuery(UPDATE_MUTATION, {
      id: node.id,
      metaobject: {
        fields: [{key: 'external_url', value: newUrl}],
      },
    });

    if (result.metaobjectUpdate.userErrors?.length) {
      console.error(`✗ ${handle}:`, result.metaobjectUpdate.userErrors);
    } else {
      log(`✓ ${handle} → ${newUrl.substring(0, 80)}`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
