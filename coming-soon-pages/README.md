# Coming Soon Pages Site

This folder is a standalone static site intended for a separate Cloudflare Pages project and its own domain or subdomain.

## Deploy As A Separate Cloudflare Pages Project

Use this folder as its own Pages app, not the existing Worker app.

- Project type: Cloudflare Pages
- Root directory: `coming-soon-pages`
- Build command: leave blank
  If the dashboard requires a command, use `exit 0`.
- Build output directory: `.`

That matches Cloudflare's current Pages guidance for static sites without a framework: use the directory containing the final files as the root, and do not run a framework build.

## Custom Domain

After the Pages project is created, add a custom domain in the Cloudflare dashboard:

1. Go to `Workers & Pages`
2. Open the new Pages project
3. Open `Custom domains`
4. Select `Set up a domain`

Cloudflare's current Pages docs:

- Custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Build configuration: https://developers.cloudflare.com/pages/configuration/build-configuration/

## Files

- `index.html`: the full-screen coming soon page
- `fonts/`: local StarCity font files copied from the main site so this Pages project is self-contained
