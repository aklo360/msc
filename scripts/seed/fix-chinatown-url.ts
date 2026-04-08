import {adminQuery} from './admin-client.js';
import {log} from './utils.js';

const LIST = `query { metaobjects(type: "editorial", first: 50) { nodes { id handle } } }`;
const UPDATE = `mutation U($id: ID!, $m: MetaobjectUpdateInput!) { metaobjectUpdate(id: $id, metaobject: $m) { metaobject { id } userErrors { message } } }`;

async function main() {
  const r: any = await adminQuery(LIST, {});
  const n = r.metaobjects.nodes.find((x: any) => x.handle === 'new-years-in-chinatown-with-the-obamas');
  if (!n) { log('Not found'); return; }
  const u: any = await adminQuery(UPDATE, {
    id: n.id,
    m: { fields: [{ key: 'external_url', value: 'https://www.juxtapoz.com/news/studio-time/new-year-s-in-chinatown-with-the-obamas-by-david-mr-starcity-white/' }] },
  });
  log(u.metaobjectUpdate.userErrors?.length ? 'FAIL' : '✓ Updated chinatown URL');
}
main();
