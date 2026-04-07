import {adminQuery} from './admin-client.js';
import {PROJECTS} from './data/projects.js';
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

export async function seedProjects(
  imageMap: Map<string, {featuredGid: string | null; imageGids: string[]}>,
) {
  log('Seeding projects...');

  for (const proj of PROJECTS) {
    const images = proj.folder ? imageMap.get(proj.folder) : undefined;

    const fields: {key: string; value: string}[] = [
      {key: 'title', value: proj.title},
      {key: 'category', value: proj.category},
      {key: 'collaborator', value: proj.collaborator},
      {key: 'location', value: proj.location},
      {key: 'year', value: proj.year},
      {key: 'series_tag', value: proj.seriesTag},
      {key: 'links', value: JSON.stringify(proj.links)},
    ];

    if (proj.inquiryEmail) {
      fields.push({key: 'inquiry_email', value: proj.inquiryEmail});
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
          type: 'project',
          handle: proj.handle,
          fields,
        },
      });

      const {metaobject, userErrors} = result.metaobjectCreate;
      if (userErrors?.length) {
        const exists = userErrors.some((e: any) =>
          e.message?.includes('already exists'),
        );
        if (exists) {
          log(`  ⚠ "${proj.title}" already exists — skipping`);
          continue;
        }
        console.error(`  ✗ "${proj.title}":`, userErrors);
      } else {
        log(`  ✓ "${proj.title}" → ${metaobject.handle}`);
      }
    } catch (err) {
      console.error(`  ✗ Failed "${proj.title}":`, err);
    }
  }

  log('Done seeding projects.');
}
