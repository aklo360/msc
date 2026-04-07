import {adminQuery} from './admin-client.js';
import {ART_EXHIBITIONS} from './data/art-exhibitions.js';
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

export async function seedArt(
  imageMap: Map<string, {featuredGid: string | null; imageGids: string[]}>,
) {
  log('Seeding art exhibitions...');

  for (const ex of ART_EXHIBITIONS) {
    const images = ex.folder ? imageMap.get(ex.folder) : undefined;

    const fields: {key: string; value: string}[] = [
      {key: 'title', value: ex.title},
      {key: 'type', value: ex.type},
      {key: 'venue', value: ex.venue},
      {key: 'location', value: ex.location},
      {key: 'date_range', value: ex.dateRange},
      {key: 'series_tag', value: ex.seriesTag},
    ];

    if (ex.description) {
      fields.push({key: 'description', value: ex.description});
    }
    if (ex.body) {
      fields.push({key: 'body', value: ex.body});
    }

    if (images?.featuredGid) {
      fields.push({key: 'featured_image', value: images.featuredGid});
    }
    if (images?.imageGids?.length) {
      fields.push({
        key: 'images',
        value: JSON.stringify(images.imageGids),
      });
    }

    try {
      const result = await adminQuery(CREATE_METAOBJECT, {
        metaobject: {
          type: 'art_exhibition',
          handle: ex.handle,
          fields,
        },
      });

      const {metaobject, userErrors} = result.metaobjectCreate;
      if (userErrors?.length) {
        const exists = userErrors.some((e: any) =>
          e.message?.includes('already exists'),
        );
        if (exists) {
          log(`  ⚠ "${ex.title}" already exists — skipping`);
          continue;
        }
        console.error(`  ✗ "${ex.title}":`, userErrors);
      } else {
        log(`  ✓ "${ex.title}" → ${metaobject.handle}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed "${ex.title}":`, err);
    }
  }

  log('Done seeding art.');
}
