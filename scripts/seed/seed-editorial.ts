import {adminQuery} from './admin-client.js';
import {EDITORIAL_ENTRIES} from './data/editorial.js';
import {log} from './utils.js';

const CREATE_METAOBJECT = `
  mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
    metaobjectCreate(metaobject: $metaobject) {
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

export async function seedEditorial() {
  log('Seeding editorial entries...');

  for (const entry of EDITORIAL_ENTRIES) {
    const fields: {key: string; value: string}[] = [
      {key: 'title', value: entry.title},
      {key: 'source', value: entry.source},
      {key: 'category', value: entry.category},
      {key: 'date', value: entry.date},
      {key: 'tag', value: entry.tag},
      {key: 'external_url', value: entry.externalUrl},
    ];

    try {
      const result = await adminQuery(CREATE_METAOBJECT, {
        metaobject: {
          type: 'editorial',
          handle: entry.handle,
          fields,
        },
      });

      const {metaobject, userErrors} = result.metaobjectCreate;
      if (userErrors?.length) {
        const exists = userErrors.some((e: any) =>
          e.message?.includes('already exists'),
        );
        if (exists) {
          log(`  ⚠ "${entry.title}" already exists — skipping`);
          continue;
        }
        console.error(`  ✗ "${entry.title}":`, userErrors);
      } else {
        log(`  ✓ "${entry.title}" → ${metaobject.handle}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed "${entry.title}":`, err);
    }
  }

  log('Done seeding editorial.');
}
