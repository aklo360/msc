import {adminQuery} from './admin-client.js';
import {log} from './utils.js';

const LIST = `query { metaobjects(type: "editorial", first: 50) { nodes { id handle } } }`;
const DELETE = `mutation D($id: ID!) { metaobjectDelete(id: $id) { deletedId userErrors { message } } }`;

async function main() {
  const r: any = await adminQuery(LIST, {});
  const n = r.metaobjects.nodes.find((x: any) => x.handle === 'interview-david-mr-starcity-white');
  if (!n) { log('Not found — already deleted'); return; }
  const d: any = await adminQuery(DELETE, { id: n.id });
  log(d.metaobjectDelete.userErrors?.length ? 'FAIL' : `✓ Deleted ${d.metaobjectDelete.deletedId}`);
}
main();
