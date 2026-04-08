/**
 * One-off script: Delete the duplicate "Garden of Love @ The Pit LA" editorial
 * metaobject (Juxtapoz review, handle: david-mr-starcity-white-garden-of-love-the-pit-la).
 * The remaining "Garden of Love" entry (The Pit LA, handle: garden-of-love-the-pit-la) stays.
 *
 * Run: npx tsx scripts/seed/delete-duplicate-editorial.ts
 */
import {adminQuery} from './admin-client.js';
import {log} from './utils.js';

const HANDLE_TO_DELETE = 'david-mr-starcity-white-garden-of-love-the-pit-la';

const LIST_QUERY = `
  query ListEditorial($first: Int!, $after: String) {
    metaobjects(type: "editorial", first: $first, after: $after) {
      nodes { id handle }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const DELETE_MUTATION = `
  mutation DeleteMetaobject($id: ID!) {
    metaobjectDelete(id: $id) {
      deletedId
      userErrors { field message }
    }
  }
`;

async function main() {
  log(`Looking for editorial metaobject: ${HANDLE_TO_DELETE}`);

  let after: string | null = null;
  while (true) {
    const result: any = await adminQuery(LIST_QUERY, {first: 50, after});
    const node = result.metaobjects.nodes.find(
      (n: any) => n.handle === HANDLE_TO_DELETE,
    );

    if (node) {
      log(`Found: ${node.id}`);
      const del: any = await adminQuery(DELETE_MUTATION, {id: node.id});
      if (del.metaobjectDelete.userErrors?.length) {
        console.error('Delete failed:', del.metaobjectDelete.userErrors);
        process.exit(1);
      }
      log(`Deleted: ${del.metaobjectDelete.deletedId}`);
      return;
    }

    if (!result.metaobjects.pageInfo.hasNextPage) {
      log(`Handle "${HANDLE_TO_DELETE}" not found — may already be deleted`);
      return;
    }
    after = result.metaobjects.pageInfo.endCursor;
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
