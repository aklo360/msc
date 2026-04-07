import {adminQuery} from './admin-client.js';
import {DEFINITIONS} from './definitions.js';
import {log} from './utils.js';

const CREATE_DEFINITION = `
  mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
    metaobjectDefinitionCreate(definition: $definition) {
      metaobjectDefinition {
        id
        type
        name
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export async function createDefinitions() {
  log('Creating metaobject definitions...');

  for (const def of DEFINITIONS) {
    log(`  Creating "${def.type}"...`);
    try {
      const result = await adminQuery(CREATE_DEFINITION, {
        definition: {
          type: def.type,
          name: def.name,
          description: def.description,
          access: {storefront: 'PUBLIC_READ'},
          fieldDefinitions: def.fieldDefinitions.map((f) => ({
            key: f.key,
            name: f.name,
            type: f.type,
            description: f.description || undefined,
          })),
        },
      });

      const {metaobjectDefinition, userErrors} =
        result.metaobjectDefinitionCreate;
      if (userErrors?.length) {
        // Check if it's just "already exists"
        const alreadyExists = userErrors.some((e: any) =>
          e.message?.includes('already exists'),
        );
        if (alreadyExists) {
          log(`  ⚠ "${def.type}" already exists — skipping`);
          continue;
        }
        console.error(`  ✗ Errors for "${def.type}":`, userErrors);
      } else {
        log(`  ✓ Created "${def.type}" (${metaobjectDefinition.id})`);
      }
    } catch (err) {
      console.error(`  ✗ Failed to create "${def.type}":`, err);
    }
  }

  log('Done creating definitions.');
}
