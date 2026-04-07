/**
 * Shopify Admin API client using client credentials OAuth.
 * Token expires after 24h — we fetch a fresh one each script run.
 */

let cachedToken: string | null = null;

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing env var: ${key}`);
  return val;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const storeDomain = getEnv('PUBLIC_STORE_DOMAIN');
  const clientId = getEnv('SHOPIFY_ADMIN_CLIENT_ID');
  const clientSecret = getEnv('SHOPIFY_ADMIN_CLIENT_SECRET');

  const res = await fetch(
    `https://${storeDomain}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get access token (${res.status}): ${text}`);
  }

  const data = (await res.json()) as {access_token: string};
  cachedToken = data.access_token;
  console.log('✓ Obtained Admin API access token');
  return cachedToken;
}

export async function adminQuery<T = any>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const storeDomain = getEnv('PUBLIC_STORE_DOMAIN');
  const token = await getAccessToken();
  const res = await fetch(
    `https://${storeDomain}/admin/api/2025-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token,
      },
      body: JSON.stringify({query, variables}),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Admin API error (${res.status}): ${text}`);
  }

  const json = (await res.json()) as {data?: T; errors?: any[]};
  if (json.errors?.length) {
    throw new Error(
      `GraphQL errors: ${JSON.stringify(json.errors, null, 2)}`,
    );
  }
  return json.data as T;
}
