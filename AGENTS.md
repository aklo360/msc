# MSC Project

Before substantive work, read `ARCHITECTURE.md` completely. It is the
canonical project map and routes deeper technical context on demand.

- This is the private Mr. StarCity Shopify Hydrogen storefront.
- Treat `.env*`, Shopify credentials, and Cloudflare credentials as secrets;
  never read, print, log, or commit their values.
- Preserve the existing repository structure and make the smallest durable
  change required by the task.
- `ARCHITECTURE.md` is the sole architecture source; the legacy `SYS_ARCH.md`
  system is deprecated.
- Do not deploy, push, publish, or change external access without explicit
  approval for that exact action.
