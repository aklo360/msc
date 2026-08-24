# MSC Architecture

Status: Canonical
Last verified: 2026-08-24

## Purpose And Boundary

MSC is the private Mr. StarCity Shopify Hydrogen storefront. This repository
owns the storefront application, project-owned media, Shopify content tooling,
the internal Dark Room treatment workspace, and Cloudflare Worker
configuration. Shopify and Cloudflare own runtime data and infrastructure;
their credentials and mutable live state are not repository-owned truth.

## Authority Order

Use the narrow authority that matches the question:

1. Deployed production behavior: `https://mrstarcity.com/`, verified directly
   before relying on it.
2. Staging behavior: `https://msc-staging.aklo.workers.dev/`, verified directly
   before relying on it.
3. Local implementation behavior: the current checkout and uncommitted diff.
4. Exact historical implementation: Git commits and remote-tracking branches.
5. Chronology only: `CHANGELOG.md`; it is not current-state authority.

The upstream Hydrogen `README.md`, legacy provider context, and archived
transcripts are not architecture sources.

## Runtime Architecture

The app is server-rendered Shopify Hydrogen 2025.7.0 on React 18 and React
Router 7.9.2. Vite 6 and Tailwind CSS 4 build a Cloudflare Worker bundle.

The request path is:

`server.ts` -> Hydrogen request context -> React Router server build -> route
loader/action -> streamed response from `app/entry.server.tsx`.

- `server.ts` creates the Worker request handler, commits pending session
  cookies, and delegates application 404s to Shopify storefront redirects.
- `app/lib/context.ts` creates the Storefront, Customer Account, cart, cache,
  session, and locale context. `SESSION_SECRET` is required at runtime.
- `app/root.tsx` loads header data critically and cart, login, and footer data
  non-critically, then provides Hydrogen analytics and the global layout.
- `app/entry.server.tsx` owns the nonce-based Content Security Policy. External
  media frames must be allowlisted there; route-level iframe attributes cannot
  override CSP.
- `app/lib/session.ts` uses an HTTP-only, same-site cookie session.

## Storefront And Content Architecture

Runtime content does not come from Notion or mock arrays:

- `/art` and `/art/:handle` query Shopify `art_exhibition` Metaobjects.
- `/music` queries `music_entry` Metaobjects and uses the approved Spotify
  track as the empty-data fallback.
- `/projects` queries Shopify `project` Metaobjects.
- `/editorial` queries Shopify `editorial` Metaobjects.
- `/shop` queries the Shopify collection with handle `frontpage`; collection
  membership controls storefront visibility.
- Product detail, recommendations, cart, checkout handoff, search, collections,
  policies, blogs, pages, and customer account routes use Hydrogen Storefront or
  Customer Account APIs.
- `/big-bless` is project-owned editorial copy and static media; its subscribe
  form creates a marketing-accepted Shopify customer and treats an existing
  account as already subscribed.
- `scripts/seed/` owns Metaobject definitions, entries, and media-upload tooling.
  Those scripts mutate Shopify and require explicit authorization before use.

## Interface System

The current font system is:

- StarCity Medium and Bold for the display face.
- DM Sans Variable for body, navigation, and commerce UI.
- Crimson Pro Variable for quotes and editorial accents.

All four files are served from `public/fonts/`. ABC Diatype and ABC Otto are
obsolete pre-June references and must not appear in active application code.

The MSC palette and layout tokens live in `app/styles/app.css`. Six section
accents map one-to-one to Art, Music, Projects, Shop, Editorial, and Big Bless.
The neutral system is black, `#7F7F7F`, `#D2D2D2`, `#EDEDED`, and white.
Desktop horizontal padding is 60px, mobile padding is 20px, and the mobile nav
breakpoint is 1024px. `HomeHero`, `Header`, and `Footer` coordinate the active
accent through `--active-accent`.

Project-owned hero videos live under `public/videos/<section>/page-bg.mp4`.
Editorial and Big Bless media live under `public/images/`. The internal Dark
Room route and its source material are isolated under `app/routes/dark-room-deck.tsx`
and `treatments/dark-room/`.

## Repository Topology

- `app/`: routes, components, Hydrogen context, GraphQL fragments, utilities,
  and the design system.
- `public/`: runtime fonts, icons, page media, and social image.
- `scripts/seed/`: Shopify Metaobject definition, upload, and entry tools.
- `guides/`: project-specific operational guidance.
- `coming-soon-pages/`: self-contained historical holding-page project.
- `treatments/dark-room/`: Dark Room source, savepoints, production notes, and
  generated creative outputs.
- `server.ts`: Cloudflare Worker entrypoint.
- `vite.config.ts`, `react-router.config.ts`, `wrangler.toml`: build, router, and
  Worker configuration.

## Deployed Baseline And Branch State

AKLO designated `https://msc-staging.aklo.workers.dev/` as the latest deployed
storefront on 2026-08-24. Direct checks returned `200` for `/`, `/art`,
`/music`, `/projects`, `/shop`, `/editorial`, `/big-bless`, and `/cart`; `/account`
returned its expected redirect. StarCity, DM Sans, and Crimson Pro font assets
all returned `200`. `/dark-room-deck` returned `404` and is not part of that
deployment.

The deployed CSS uses DM Sans and Crimson Pro and the deployed interface shows
the Pedro storefront pass. On 2026-08-24, Cloudflare Worker version
`14f82db7-42ee-4308-9462-3060565c33c9` deployed an isolated release candidate
based on that storefront baseline. It adds the approved Spotify fallback and
CSP frame sources, international phone normalization, the right-aligned home
mobile menu, and the single-image Shop card. `/dark-room-deck` remains `404`.
The immediately preceding rollback version is
`7e546dde-b48c-4d52-963d-81488bb1d1e0`.

Cloudflare Worker version `88ffbc33-9882-4a47-8d4b-24f7dfa11b11` became the
production release on 2026-08-24. It added iOS background-video playback
retries and mobile fast-start sources, selectively served VP9 WebM sources,
viewport-height and measured-width containment for the home hero navigation,
and the corrected mobile Shop product metadata layout. That release was
superseded after it exposed a homepage autoplay and blend-treatment regression.

Cloudflare Worker version `c2294e7a-d91c-46be-873b-ce19e497092d` is the verified
corrective release checkpoint from 2026-08-24. It restores the approved homepage treatment
of full-opacity grayscale video with a separate `hard-light` accent overlay and
restores automatic homepage video cycling. Muted inline playback is retried on
desktop and mobile lifecycle events, and the smaller VP9 WebM variants remain
preferred with MP4 compatibility fallbacks. Live desktop and mobile browser
checks confirmed active playback and the expected source selection. The known
good code rollback is version `14f82db7-42ee-4308-9462-3060565c33c9`. The
internal Dark Room route returns `200`; AKLO explicitly accepted that state on
2026-08-24.

On 2026-08-24, Cloudflare Worker routes cut production traffic for
`mrstarcity.com/*` and `www.mrstarcity.com/*` over to that verified Worker
version. Both production hostnames and the staging hostname return the MSC
storefront. The existing proxied apex and `www` CNAME records still target
`msc-coming-soon.pages.dev` as the rollback origin; removing the two Worker
routes restores that origin without a DNS propagation wait. The unrelated
Google verification record was not changed.

Source history was divergent before this release was promoted:

- `origin/pedro-feedback-r1`: `8e3960606d38`, including the deployed storefront
  font and Pedro feedback work;
- `main` now owns the reviewed production release tree; the Pedro branch remains
  a divergent historical reference and must not be deployed directly.

The production release source is the `main` commit containing this record.
Confirm the active Cloudflare version at runtime rather than treating a recorded
version identifier as mutable-state authority. Future deployment work must
review the release diff, target identity, and rollback path before publication.

## Identity, Deployment, And Privacy

- GitHub repository: private `aklo360/msc`.
- Default branch: `main`.
- Deployment platform: Cloudflare Workers.
- Configured Worker target: `msc-staging`.

No commit, push, deployment, publication, credential change, content seed, or
external access change is implied by local development. Environment files,
Shopify credentials, Cloudflare credentials, and session secrets must never be
read into logs or committed.

## Standard Commands And Verification

```bash
npm ci
npm run dev
npm run lint
npm run typecheck
npm run build
```

Use focused checks first, then the build. Repository-wide typecheck currently
has pre-existing errors in `HomeHero.tsx`, `ProductItem.tsx`, and
`api.subscribe.tsx`; distinguish those from regressions introduced by a change.
Browser verification is required for iframe/CSP behavior because static markup
alone cannot prove an external frame loads.

Generated dependencies and build output are derived state. Preserve dirty and
untracked work, and verify live services immediately before making any claim
about their current behavior.
