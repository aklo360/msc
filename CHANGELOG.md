# Changelog

All notable changes to the MSC website are documented here.

---

## 2026-06-09 — Pedro Font Swap To DM Sans / Crimson Pro

- Checked Pedro's latest `Website Design R1` email from June 9, 2026: he recommends replacing the previous sans/serif choices with open-source `DM Sans` and `Crimson Pro`, and notes the updated Figma should be used for sizing/spacing reference.
- Added the downloaded variable font files to `public/fonts/` as `DMSans-Variable.ttf` and `CrimsonPro-Variable.ttf`.
- Updated the design-system font faces and tokens so body/nav text uses DM Sans and editorial/quote text uses Crimson Pro.
- Removed legacy negative heading tracking that was tuned for the old ABC sans metrics.
- Fixed three existing TypeScript blockers surfaced during verification: the home hero idle fallback narrowing, a stale generated `RecommendedProductFragment` import, and an overly strict subscribe error callback type.
- Verified `npm run build` passes with no missing ABC font warnings.
- Verified `npm run typecheck` passes.
- Verified locally in-browser at desktop and 393px mobile widths: DM Sans loads for body/nav, Crimson Pro loads for editorial copy, StarCity still renders hero labels, and checked mobile pages have no horizontal overflow.

---

## 2026-05-24 — Responsive Metaobject Banners

- Added a shared `MetaobjectBannerImage` renderer for Shopify metaobject featured/banner images.
- Fixed art detail banner images so mobile preserves the uploaded image aspect ratio instead of forcing the desktop 1120px hero crop.
- Applied the same responsive banner renderer to project featured images.
- Re-verified metaobject line-break rendering across current rendered description/body paths: art detail, projects, and music still use `MetaobjectText`.
- Verified locally at 393px mobile width: the “Black Voices: Friend of My Mind” banner renders as a normal responsive image (`393x294.75`, `object-fit: contain`) while desktop keeps the 1120px `object-cover` hero.
- Deployed to Cloudflare staging at `https://msc-staging.aklo.workers.dev`, version ID `b1729638-58f0-42d9-a15b-ae4166ef1a52`; verified art and project metaobject banners plus multiline text behavior on staging at 393px mobile width.

---

## 2026-05-22 — Metaobject Mobile Line Break Preservation

- Added a shared `MetaobjectText` renderer for Shopify metaobject plain multi-line text fields.
- Applied newline-preserving rendering to art detail descriptions/bodies, project descriptions/bodies, and music descriptions.
- Verified locally on mobile viewport for the “Black Voices: Friend of My Mind” art detail page; the metaobject description now computes to `white-space: pre-line` with `overflow-wrap: break-word`.
- Deployed to Cloudflare staging at `https://msc-staging.aklo.workers.dev`, version ID `b7845ab2-11d3-474c-9932-c502ed9351d1`; verified the same mobile line-break CSS on staging.

---

## 2026-04-27 — Home Hero Video Hover + Staging Performance

- Hid the desktop/mobile page nav items on the home page only while keeping the three utility icons visible.
- Added per-section home hero hover videos from `public/videos/*/page-bg.mp4`.
- Preserved the original section accent colors by rendering videos grayscale under the color layer with `mix-blend-mode: luminosity` and 50% opacity.
- Kept non-hovered hero links and non-home header nav text fully opaque black.
- Made the home header transparent only on the home page; other page headers remain solid accent color.
- Reverted WebM experiments after AV1/VP9 playback issues; MP4 is the canonical hero video source for all six sections.
- Mounted all hero videos up front and switched from hover-time insertion to idle warmup, using metadata first and `preload="auto"` after browser idle without interrupting the active hover video.
- Avoid calling `video.load()` on the active hover video; it can interrupt `play()` and produce browser errors. Warm inactive videos after idle and track which indexes are already loaded.
- Added Cloudflare `_headers` rules so `/videos/*` caches for 7 days with stale-while-revalidate and hashed `/assets/*` cache immutable for 1 year.
- Compressed `public/videos/big-bless/page-bg.mp4` below Cloudflare Workers static asset limits.
- Pushed and deployed staging to `https://msc-staging.aklo.workers.dev`.
- Staging version IDs: `0c361d7e-5010-4d43-9ba9-8a55840eac01` for hero loading, then `ba66d2eb-481b-4d28-abe8-e1813268da01` for cache headers.
- Migrated legacy project correction notes into this changelog and removed the separate learning-log surface. Future corrections, lessons, and milestones go here only.

---

## 2026-03-31 — Initial Build (Figma R1 → Code)

### Scaffold

- Initialized Shopify Hydrogen 2025.7.0 project (`npx shopify hydrogen init`)
- Tailwind CSS v4 with `@tailwindcss/vite` plugin
- React Router 7.9.2 with file-based routing (`@react-router/fs-routes`)
- CF Workers runtime via `server.ts` fetch handler
- Mock Shopify data (no store connected yet)

### Design System (`app/styles/app.css`)

- 7 `@font-face` declarations: StarCity (Medium, Bold), ABC Diatype (Regular, Medium, Bold, Heavy), ABC Otto Variable (Light)
- CSS custom properties for all Figma-verified tokens: 6 accent colors, 5 neutrals, 3 font families, 9 type scale sizes, layout constants
- Body defaults: ABC Diatype with `'salt' 1` feature, #EDEDED page background
- `.font-display-dlig` utility for StarCity discretionary ligatures
- Tailwind `@theme` block exposing MSC colors as utility classes

### Fonts

- StarCity Medium and Bold woff2 installed in `public/fonts/`
- ABC Diatype and ABC Otto Variable still pending from Pedro

### Components

- **Header.tsx** — NavBar matching Figma `15489:2444`: desktop + mobile variants, MSC logo text, 6 nav links, 3 custom brand SVG icons (eye/starburst, mascot face, flower/star)
- **Footer.tsx** — Figma `15096:4277`: black bg, rounded-t-[20px], MSC watermark text, accent color prop
- **PageLayout.tsx** — Header + main + Footer wrapper with CartAside + SearchAside
- **HomeHero.tsx** — Stacked NavLinks with hover scale/weight interaction
- **SectionHero.tsx** — 1120px hero (852px mobile), centered title, accent color overlay
- **GalleryCard.tsx** — Art grid card: 15:10 aspect, rounded-[10px], hover scale, title + tag
- **ShopCard.tsx** — Product card: 912:607 aspect, title + price + tag
- **ArtMenu.tsx** — Filter bar: series tag pills, grid/list toggle, sort icon
- **SubscribeForm.tsx** — Email input + submit with Klaviyo placeholder

### Routes (7 MSC sections + scaffold)

- All 7 section routes built with placeholder content
- Scaffold routes retained: cart, account, collections, products, search, blogs, policies, sitemap

### Figma Integration

- Installed Figma MCP server for direct design file access
- Extracted specs via `get_design_context` and `get_screenshot` for all major components
- All dimensions, spacing, colors, typography verified against Figma node data

### Brand Icons

- 3 custom nav icons downloaded from Figma as SVGs, converted to inline React components with `currentColor`

---

## 2026-03-31 — Footer Redesign

- Rewrote Footer with inline SVG paths for the MSC watermark (replaced CSS text rendering)
- Split letterforms into top and bottom halves for precise vertical positioning
- Removed `rounded-t-[20px]` border radius
- Footer height: 390px mobile / 800px desktop
- Watermark text positioned at `top: 38%`

---

## 2026-03-31 — Header SVG Logo + Squish Effect

- Replaced text-based MSC logo with inline SVG paths extracted from Figma
- Implemented variable-width letter squish on hover: 3 separate `<svg>` elements in a flex container, each with `preserveAspectRatio="none"`
- Hover squishes the target letter's `flexGrow` while others expand to fill freed space
- Absorbed inter-letter gaps into each SVG's viewBox (M: 0-151, S: 151-287, C: 287-418.6) to eliminate dead zones between letters
- Smooth cubic-bezier transitions on flexGrow

---

## 2026-03-31 — HomeHero Global Color Cycling

- HomeHero hover changes background color to match hovered section's accent
- Sets `--active-accent` CSS variable on `document.documentElement` for Header/Footer sync
- Header background reads `var(--active-accent, var(--color-accent-art))`
- Cleans up CSS variable on unmount

---

## 2026-03-31 — SectionHero Redesign

- Rebuilt SectionHero with accent color overlay and centered title
- Title in StarCity Medium 200px, always black
- Height: 1120px desktop / 852px mobile

---

## 2026-03-31 — Mobile & iPad Responsiveness

- HomeHero font size tuned through multiple iterations → `clamp(40px, 15.5vw, 128px)`
- Added `whitespace-nowrap` to all HomeHero NavLinks (prevents "MSC Shop" / "Big Bless" wrapping)
- Changed hamburger breakpoint from `md` (768px) to `lg` (1024px) across Header, art, editorial
- iPad now uses hamburger menu and mobile list layout
- Mobile list view: 2-line stacked layout (title + tag, then metadata)

---

## 2026-03-31 — Real Data from Notion

Replaced all placeholder data with real content from the Notion source of truth.

### Art Page (`art._index.tsx`)

- 22 real exhibitions (2019–2025): FREVO NYC, The Pit LA, Art Fair Philippines, Salon 94, Tiger Gallery London, CFHILL Stockholm, and more
- SeriesTag: "Solo" or "Group" based on exhibition type

### Editorial Page (`editorial.tsx`)

- 20 real press articles with actual external URLs
- Sources: Heritage Auctions, stupidDOPE (x2), NYC Parks, Cultured Magazine, See Great Art, Art Currently, Juxtapoz (x3), The Pit LA, Vogue Philippines, Esquire Philippines, GMA News, Art+ Magazine, Beyond The Streets, Office Magazine, CFHILL (x2), ArtX
- Links open in new tab (`<a target="_blank">`)

### Projects Page (`projects._index.tsx`)

- King of Hearts: NYC Parks + stupidDOPE links
- Loverboy x BBC: Hypebeast + BBC Official links
- Loverboy x SLR Pendant: Dropbox photo folder + mailto inquiry

---

## 2026-03-31 — Editorial Page Rewrite

- Rewrote to mirror art page structure (SectionHero + ArtMenu + grid/list views)
- Defaults to list view (art defaults to grid)
- ArtMenu shows "All Articles" via new `filterLabel` prop
- 5-column desktop grid: title, source, category, date, tag pill
- External links use `<a>` tags instead of `<Link>`

---

## 2026-03-31 — List View Truncation

- Added `truncate min-w-0 max-w-full` to all text cells in art and editorial desktop list views
- Added `gap-x-[20px]` between grid columns for proper spacing
- Mobile titles also truncate

---

## 2026-03-31 — Overscroll Fix

- Set `body` background to black (was #EDEDED showing during overscroll)
- Added `overscroll-behavior: none` on html + body
- Page content background (#EDEDED) applied by PageLayout wrapper div

---

## 2026-03-31 — Subscribe Button Fix

- Fixed invisible subscribe button on Big Bless page (white on white)
- Changed `border-0` to `border border-black`
- Added hover state: `hover:bg-black hover:text-white`

---

## 2026-03-31 — First Deploy

- Deployed to Cloudflare Workers as `msc-staging`
- Staging URL: https://msc-staging.aklo.workers.dev
- Added OG meta tags (title, description, image) to root.tsx

---

## Not Yet Done

- Shopify store connection (need domain + Storefront API token)
- ABC Diatype and ABC Otto Variable font files (need from Pedro)
- Art detail page real content (currently lorem ipsum + grey boxes)
- Projects page real copy (currently lorem ipsum + grey boxes)
- Big Bless page real bio text and photos
- Music page content (Spotify/YouTube embeds, playlist links)
- Shop products (will come from Shopify when connected)
- Per-route Footer accent color (currently hardcoded in PageLayout)
- Search, Login, Cart page designs (Pedro noted as "still to develop")
- Game-like interactive mechanism on home page
- Related items module, news module
- Production domain setup
