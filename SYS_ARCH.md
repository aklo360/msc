# MSC Website System Architecture

## Overview

Mr. StarCity's site is a Shopify Hydrogen storefront deployed to Cloudflare Workers. The codebase uses React Router 7 file-based routing, Vite, Tailwind CSS v4, and a CSS-variable-driven design system derived from Pedro's Figma file `2aEx7jFVcQtskizayX2qUv`.

Current state:
- All 7 section pages are built with real content data from the Notion source of truth.
- Layout, navigation, and design system are production-ready.
- Shopify Storefront wiring is scaffolded but running against mock data until live credentials are provided.
- Deployed to Cloudflare Workers at `https://msc-staging.aklo.workers.dev`.

## Runtime Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Shopify Hydrogen | 2025.7.0 |
| Router | React Router | 7.9.2 |
| Runtime | Cloudflare Workers | — |
| Bundler | Vite | 6.4.1 |
| Styling | Tailwind CSS v4 + CSS custom properties | — |
| Data | Hydrogen context + Storefront GraphQL | mock.shop |
| Deploy | Wrangler | 4.45.2 |

### Fonts

| Font | Weights | Status |
|------|---------|--------|
| StarCity | Medium (500), Bold (700) | Installed (`public/fonts/`) |
| ABC Diatype | Regular (400), Medium (500), Bold (700), Heavy (800) | Pending from Pedro |
| ABC Otto Variable | Light (300) | Pending from Pedro |

## Repository Layout

```text
website/
├── app/
│   ├── assets/
│   │   └── favicon.svg
│   ├── components/
│   │   ├── Header.tsx          # NavBar — MSC SVG logo + desktop/mobile nav
│   │   ├── Footer.tsx          # Black bg, SVG watermark, accent color
│   │   ├── PageLayout.tsx      # Header + main + Footer + Aside wrappers
│   │   ├── HomeHero.tsx        # Home stacked section links with color cycling
│   │   ├── SectionHero.tsx     # Section hero (1120px, centered title, accent)
│   │   ├── GalleryCard.tsx     # Art/editorial grid card (15:10 aspect)
│   │   ├── ShopCard.tsx        # Product card (912:607 aspect)
│   │   ├── ArtMenu.tsx         # Filter bar (series/articles + grid/list toggle)
│   │   ├── SubscribeForm.tsx   # Email subscribe (Big Bless page)
│   │   └── [scaffold]          # Aside, CartMain, Product*, Search*, etc.
│   ├── graphql/
│   │   └── customer-account/   # 5 customer GraphQL queries/mutations
│   ├── lib/
│   │   ├── context.ts          # Hydrogen router context factory
│   │   ├── fragments.ts        # Shared GraphQL fragments
│   │   └── [scaffold]          # orderFilters, redirect, search, session, variants
│   ├── routes/
│   │   ├── _index.tsx          # Home — HomeHero with accent color cycling
│   │   ├── art._index.tsx      # Art — 22 real exhibitions (grid/list view)
│   │   ├── art.$handle.tsx     # Art detail — placeholder layout
│   │   ├── music.tsx           # Music — placeholder embeds
│   │   ├── projects._index.tsx # Projects — 3 projects with real links
│   │   ├── shop._index.tsx     # Shop — placeholder products
│   │   ├── editorial.tsx       # Editorial — 20 real press articles (list/grid)
│   │   ├── big-bless.tsx       # Big Bless — bio + photos + social + subscribe
│   │   └── [scaffold]          # cart, account, collections, products, search, etc.
│   ├── styles/
│   │   ├── app.css             # Design system: @font-face, CSS vars, overscroll fix
│   │   ├── tailwind.css        # Tailwind v4 @theme with MSC color tokens
│   │   └── reset.css           # Box-sizing reset
│   └── root.tsx                # Layout shell (stylesheets, meta, PageLayout)
├── public/
│   ├── fonts/                  # StarCity-Medium.woff2, StarCity-Bold.woff2
│   ├── icons/                  # icon-search.svg, icon-profile.svg, icon-cart.svg
│   ├── images/art/             # (empty — awaiting real photos)
│   └── og-image.svg
├── server.ts                   # CF Workers fetch handler
├── vite.config.ts              # Vite + Hydrogen + Tailwind + React Router plugins
└── react-router.config.ts      # Hydrogen preset for React Router
```

## Layout Architecture

`root.tsx` renders `<html>` and `<body>` with stylesheet links. `PageLayout.tsx` composes:
- `Header` — sticky top-0, accent-colored background
- `<main>` — routed page content
- `Footer` — black background, MSC SVG watermark

Cross-frame accent color coordination uses the `--active-accent` CSS custom property, set by `HomeHero` on hover and consumed by `Header` and `Footer`.

### Overscroll Prevention

Both `html` and `body` have `overscroll-behavior: none`. The `html` element has `background-color: black` and `body` has `background-color: black` — the page content background (#EDEDED) is applied by the PageLayout wrapper div. This ensures no white flash above header or below footer during overscroll.

## Design System

All tokens live in `app/styles/app.css` as CSS custom properties.

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-accent-01` | #F46060 | Default/Primary |
| `--color-accent-art` | #FF9E70 | Art section |
| `--color-accent-music` | #FFD770 | Music section |
| `--color-accent-projects` | #92D073 | Projects section |
| `--color-accent-shop` | #73B9D0 | Shop section |
| `--color-accent-bless` | #D073A5 | Big Bless / Editorial |
| `--color-black` | #000000 | Text, footer bg |
| `--color-neutral-01` | #7F7F7F | Secondary text |
| `--color-neutral-02` | #D2D2D2 | Borders, dividers |
| `--color-neutral-03` | #EDEDED | Page background |
| `--color-white` | #FFFFFF | Cards, tag pills |

### Typography

| Family | CSS Var | Usage | Features |
|--------|---------|-------|----------|
| StarCity | `--font-display` | Hero titles, logo | `'dlig' 1` |
| ABC Diatype | `--font-body` | Body, nav, links | `'salt' 1` |
| ABC Otto Variable | `--font-quote` | Quotes, H4 | `'salt' 1` |

### Layout Constants

| Token | Desktop | Mobile |
|-------|---------|--------|
| Horizontal padding | 60px | 20px |
| Hero height | 1120px | 852px |
| Nav height | 10vh | 10vh |
| Border radius | 10px | 10px |
| Pill radius | 20px | 20px |
| Hamburger breakpoint | — | < 1024px (lg) |

## Brand-Specific Components

### Header (`Header.tsx`)

Custom sticky nav, not stock Hydrogen:
- **MSC Logo**: 3 separate inline SVGs in a flex container, each with `preserveAspectRatio="none"`. Letters physically stretch/compress on hover via `flexGrow` transitions — creates a variable-width font effect where non-hovered letters expand to fill freed space.
- **ViewBox tiling**: M(0-151), S(151-287), C(287-418.6) — no CSS gap, inter-letter spacing absorbed into viewBoxes to eliminate hover dead zones.
- **Desktop** (≥1024px): Logo + 6 nav links + 3 custom brand icons (eye/starburst, mascot, flower/star)
- **Mobile** (<1024px): Logo + hamburger → dropdown with rounded corners
- Background: `var(--active-accent, var(--color-accent-art))` — inherits from HomeHero hover state
- Custom brand icons inlined as React SVG components with `currentColor`

### Footer (`Footer.tsx`)

- Black background, no rounded corners
- Giant "MSC" watermark: inline SVG paths split into top/bottom halves, colored with section accent
- Text positioned at `top: 38%` within the watermark container
- Height: 390px mobile / 800px desktop
- `accentColor` prop for per-section theming

### HomeHero (`HomeHero.tsx`)

- Stacked NavLink items: Art, Music, Projects, MSC Shop, Editorial, Big Bless
- Font size: `clamp(40px, 15.5vw, 128px)` with `whitespace-nowrap`
- Hover interaction: hovered item scales up (1.12) + bold (700), others scale down (0.92) + fade (0.5)
- Sets `--active-accent` CSS variable on `document.documentElement` for Header/Footer color sync
- Background color transitions on hover to match each section's accent

### ArtMenu (`ArtMenu.tsx`)

- Filter bar: 100px tall, horizontal layout
- Left: filter pill button with configurable `filterLabel` prop (defaults "All Series", editorial passes "All Articles")
- Right: grid/list toggle icons + sort icon
- Active view mode highlighted with black bg / white icon

## Route Architecture

### Pages with Real Data

| Route | Content | Data Source |
|-------|---------|-------------|
| `/` | HomeHero with 6 section links | Static |
| `/art` | 22 real exhibitions (2019–2025) | Notion |
| `/editorial` | 20 real press articles with external URLs | Notion |
| `/projects` | 3 projects with real external links | Notion |

### Pages with Placeholder Content

| Route | What's Placeholder |
|-------|-------------------|
| `/art/:handle` | Lorem ipsum text, grey image boxes |
| `/music` | "Coming soon", grey embed placeholders |
| `/shop` | 8 fake products with made-up prices |
| `/big-bless` | Lorem ipsum bio text, grey photo boxes |

### List/Grid View Pattern

Both `art._index.tsx` and `editorial.tsx` share the same dual-view pattern:
- **Grid view**: 2-col `GalleryCard` grid (`max-lg:grid-cols-1`)
- **List view**: Tabular rows with CSS Grid columns, `truncate min-w-0 max-w-full` on all text cells, `gap-x-[20px]` between columns
- Art defaults to grid, Editorial defaults to list
- Art list: 6 columns (title, type, place, location, date, tag pill)
- Editorial list: 5 columns (title, source, category, date, tag pill)
- Mobile list: 2-line stacked layout (title + tag on line 1, metadata on line 2)
- External links (editorial) use `<a target="_blank">`, internal links (art) use `<Link prefetch="intent">`

## Data Flow

- `server.ts` creates the Cloudflare Worker request pipeline
- `app/lib/context.ts` creates the Hydrogen router context
- Shopify queries are scaffolded through Hydrogen conventions and shared fragments
- All section content currently uses hardcoded data arrays (not Shopify API)
- Shop products will switch to Storefront API when credentials are provided

## Deployment

```bash
npm run build        # shopify hydrogen build --codegen
npx wrangler deploy  # deploys to CF Workers
```

- **Staging**: https://msc-staging.aklo.workers.dev
- **Production**: TBD (pending domain setup)
- Worker name: `msc-staging`

## Known Constraints

- Missing font files from Pedro (ABC Diatype, ABC Otto Variable)
- `ProductItem.tsx` has a codegen-related TS error until Shopify store is connected
- Shop products are fake data — will be replaced when Storefront API is wired
- Art detail, projects, big-bless, music pages have lorem ipsum and grey placeholder images
- Footer watermark is inline SVG paths — Figma uses a mask image approach
- Per-route Footer accent color not yet wired (hardcoded #FF9E70 in PageLayout)

## Implementation Notes

- Inline styles for custom brand typography (Tailwind utilities too coarse for variable fonts)
- `prefetch="intent"` on all internal `NavLink`s
- SVG icons use `currentColor` for centralized color shifts
- Hamburger breakpoint at `lg` (1024px) — iPad gets mobile layout
- `overscroll-behavior: none` on html/body prevents rubber-band scroll revealing wrong bg color
