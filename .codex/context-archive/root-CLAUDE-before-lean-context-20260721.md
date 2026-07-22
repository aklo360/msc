# MSC Website — Development Context

## Quick Start

```bash
cd ~/projects/msc/website
npm run dev          # http://localhost:3000 (mock Shopify data)
npm run build        # production build
npm run typecheck    # react-router typegen && tsc --noEmit
```

## Architecture

Shopify Hydrogen 2025.7.0 storefront running on Cloudflare Workers. React Router 7.9.2 file-based routing. Tailwind CSS v4 + CSS custom properties for the design system. All design tokens verified against Pedro's Figma (file key: `2aEx7jFVcQtskizayX2qUv`).

## File Structure

```
website/
├── public/
│   ├── fonts/              # StarCity-Medium.woff2, StarCity-Bold.woff2
│   │                       # (ABC Diatype + ABC Otto still needed from Pedro)
│   └── icons/              # Brand SVG icons from Figma (search, profile, cart)
├── app/
│   ├── styles/
│   │   ├── app.css         # Design system: @font-face, CSS vars, scaffold styles
│   │   ├── tailwind.css    # Tailwind v4 @theme with MSC color tokens
│   │   └── reset.css       # Box-sizing reset
│   ├── components/
│   │   ├── Header.tsx      # NavBar — desktop + mobile, custom brand icons
│   │   ├── Footer.tsx      # Black bg, rounded-t, MSC watermark, accent color
│   │   ├── PageLayout.tsx  # Header + main + Footer + Aside wrappers
│   │   ├── HomeHero.tsx    # Home page stacked section links (Art, Music, etc.)
│   │   ├── SectionHero.tsx # Section page hero (1120px, centered title, accent overlay)
│   │   ├── GalleryCard.tsx # Art grid card (15:10 aspect, title + tag)
│   │   ├── ShopCard.tsx    # Product card (912:607 aspect, title + price + tag)
│   │   ├── ArtMenu.tsx     # Art filter bar (series tags + grid/list toggle)
│   │   ├── SubscribeForm.tsx # Email subscribe (Big Bless page)
│   │   ├── Aside.tsx       # Scaffold: slide-out panel (cart/search)
│   │   ├── CartMain.tsx    # Scaffold: cart contents
│   │   └── ...             # Other scaffold components (Product*, Search*, etc.)
│   ├── routes/
│   │   ├── _index.tsx      # Home — HomeHero with Art accent
│   │   ├── art._index.tsx  # Art grid — SectionHero + ArtMenu + GalleryCard grid
│   │   ├── art.$handle.tsx # Art detail — "When We Bloom" placeholder
│   │   ├── music.tsx       # Music — placeholder embeds (Spotify, YouTube)
│   │   ├── projects._index.tsx # Projects — 3 placeholder projects
│   │   ├── shop._index.tsx # Shop — ShopCard grid with ShopMenu
│   │   ├── editorial.tsx   # Editorial — press link list
│   │   ├── big-bless.tsx   # Big Bless — bio + photos + social + subscribe
│   │   └── ...             # Scaffold routes (cart, account, collections, etc.)
│   ├── lib/
│   │   ├── fragments.ts    # Shared GraphQL fragments
│   │   └── context.ts      # Hydrogen router context factory
│   └── root.tsx            # Layout shell (stylesheets, PageLayout, Analytics)
├── server.ts               # CF Workers fetch handler
├── vite.config.ts          # Vite + Hydrogen + Tailwind + React Router plugins
└── react-router.config.ts  # Hydrogen preset for React Router
```

## Design System

All tokens live in `app/styles/app.css` as CSS custom properties.

### Colors
- **Accents:** `--color-accent-art` (#FF9E70), `-music` (#FFD770), `-projects` (#92D073), `-shop` (#73B9D0), `-bless` (#D073A5), `-01` (#F46060)
- **Neutrals:** `--color-black` (#000), `-neutral-01` (#7F7F7F), `-02` (#D2D2D2), `-03` (#EDEDED, page bg), `-white` (#FFF)

### Typography
- `--font-display`: StarCity (500 Medium, 700 Bold) — hero titles, logo. Feature: `'dlig' 1`
- `--font-body`: ABC Diatype (400, 500, 700, 800) — body, nav, links. Feature: `'salt' 1`
- `--font-quote`: ABC Otto Variable (300 Light) — quotes, H4

### Layout
- `--padding-x: 60px` / `--padding-x-mobile: 20px`
- `--hero-height: 1120px` / `--hero-height-mobile: 852px`
- `--nav-height: 117px`
- `--border-radius: 10px` / `--border-radius-lg: 20px`

## Conventions

- **Inline styles for fonts** — use `style={{fontFamily: 'var(--font-body)', ...}}` not Tailwind font classes (custom fonts don't map to Tailwind utilities)
- **Accent color per section** — each section page defines its accent color constant and passes it to SectionHero/Footer
- **Tags** — pill shape: `rounded-[20px] p-[10px] uppercase`. 18px in filter bars, 14px on cards
- **NavLink** — always use `prefetch="intent"` for internal links
- **SVG icons** — use `currentColor` for stroke/fill to inherit text color
- **No Shopify data yet** — shop products are placeholder. Don't wire up Storefront API until store domain + token are provided
- **Real data on art/editorial/projects** — exhibitions, press articles, and project links are from the Notion source of truth
- **External links** — editorial press links use `<a target="_blank">`, art uses `<Link prefetch="intent">`
- **ArtMenu `filterLabel`** — defaults to "All Series", editorial passes "All Articles"
- **List view truncation** — all text cells use `truncate min-w-0 max-w-full` with `gap-x-[20px]`

## Nav Icons

The three header icons are NOT standard search/profile/cart. They are Pedro's custom brand icons:
- **Search** = eye/starburst with radiating lines (icon-search.svg)
- **Profile** = MSC mascot face in a circle (icon-profile.svg)
- **Cart** = flower/star with petals (icon-cart.svg)

These are inlined as React SVG components in `Header.tsx`.

## Fonts Status

| Font | Status | Location |
|------|--------|----------|
| StarCity Medium | Installed | `public/fonts/StarCity-Medium.woff2` |
| StarCity Bold | Installed | `public/fonts/StarCity-Bold.woff2` |
| ABC Diatype (4 weights) | Missing | Need from Pedro |
| ABC Otto Variable Light | Missing | Need from Pedro |

## Deployment

- **Staging**: https://msc-staging.aklo.workers.dev (Cloudflare Workers, worker name: `msc-staging`)
- **Production**: TBD (pending domain setup)
- Deploy: `npm run build && npx wrangler deploy`

## Current Data State

| Page | Data Status |
|------|-------------|
| Art index | 22 real exhibitions from Notion (2019–2025) |
| Editorial | 20 real press articles with external URLs |
| Projects | 3 projects with real links (NYC Parks, stupidDOPE, Hypebeast, BBC, Dropbox) |
| Art detail | Placeholder (lorem ipsum + grey boxes) |
| Music | Placeholder ("coming soon" + grey embeds) |
| Shop | Placeholder (8 fake products) |
| Big Bless | Placeholder (lorem ipsum bio + grey photos) |

## Known Issues

- `ProductItem.tsx` has a pre-existing TS error (`RecommendedProductFragment` not in codegen) — harmless, will resolve when Shopify store is connected
- Footer MSC watermark is inline SVG paths — Figma uses a mask image approach
- No `.env` with Shopify credentials — using mock.shop by default
- Per-route Footer accent color not yet wired (hardcoded #FF9E70 in PageLayout)
- Hamburger nav breakpoint is `lg` (1024px) — iPad gets mobile layout
