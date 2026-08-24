# Build the Dark Room Visual Treatment Deck in React

This ExecPlan is a living document. The sections `Progress`, `Surprises & Discoveries`, `Decision Log`, and `Outcomes & Retrospective` must be kept up to date as work proceeds.

This plan follows `~/.codex/PLANS.md`. There is no repo-local `PLANS.md`, so the global LLPhant planning standard governs this file.

## Purpose / Big Picture

AKLO wants the locked `Dark Room v1.0` master treatment turned into a polished visual deck that can be reviewed on a browser before real images are selected. After this change, the MSC app will have an internal React route at `/dark-room-deck` that presents the treatment as a 9-page cinematic deck with placeholder image systems, scene summaries, VFX language, and production details. The deck should feel like a modern React/Tailwind/shadcn-style app while using the MSC website's real brand identity: StarCity display type, ABC Diatype body type, black/white/neutral base, Pedro's MSC accent palette, compact rounded media, and flat graphic section bands.

## Progress

- [x] (2026-07-02T00:22:49Z) Created a tracked goal for the Dark Room visual deck work.
- [x] (2026-07-02T00:22:49Z) Read project context, global plan standard, MSC design tokens, the locked treatment, the prior Elegant deck plan/site, and Newsphere visual references.
- [x] (2026-07-02T00:22:49Z) Decided the deck should be an internal MSC route rather than a separate app, so it inherits the active MSC design system without new dependencies.
- [x] (2026-07-02T00:39:00Z) Implemented the `/dark-room-deck` route with 9 visual pages and placeholder image modules.
- [x] (2026-07-02T00:39:00Z) Added route-specific layout behavior so the deck can run full-bleed without the storefront header, footer, cart aside, and search aside.
- [x] (2026-07-02T00:54:00Z) Validated with targeted lint, production build, local HTTP `200`, desktop screenshots, VFX direct-slide screenshot, and explicit 390px mobile Chrome DevTools Protocol metrics.
- [x] (2026-07-02T00:58:00Z) Updated `CHANGELOG.md`, `PROJECT.md`, and this plan with completed outcomes.
- [x] (2026-07-02T01:01:00Z) Committed the verified deck scaffold.
- [x] (2026-07-02T01:25:00Z) Updated the outdoor performance location from Williamsburg Bridge sunset to LES + Chinatown at the base of the Manhattan Bridge in the active treatment and React deck copy.
- [x] (2026-07-02T02:20:00Z) AKLO rejected the scrolling-page scaffold; rebuilt `/dark-room-deck` from scratch as a true 16:9 slide deck using the Elegant deck architecture (fixed 16:9 frame, `container-type: inline-size`, all slide type in `cqw` units, one slide at a time, arrow/swipe/rail navigation, `?slide=N` deep links). Verified with lint, production build, full 10-slide desktop screenshot set, and a narrow-viewport check under `treatments/dark-room/outputs/visual-deck-v2-20260701/`.
- [x] (2026-07-08) Finished the deck as an image-complete trailer previz. Generated the missing iconic stills with `scripts/darkroom-nb2.mjs` (`pro`, 2K, 16:9, reference-chained for exact Mal/Star likeness): `void`, `trap-serve` (v3 after a safety re-roll), `club`, `robes-duo`, `bridge`, `pipe` under `outputs/nb2-20260708/`; reused terrace v6 / foyer v3 / print-01-couch v1 / cover v1. Rebuilt `app/routes/dark-room-deck.tsx` into a flowing 10-shot reel with a darkroom/Polaroid seam transition engine, Ken Burns holds, a synced "Play Trailer" audio mode, and per-world accents. Wired selects into `public/darkroom/`. Verified `npm run build` clean + 11 desktop screenshots in `outputs/visual-deck-v3-20260708/`.

## Surprises & Discoveries

- Observation: The repo's live MSC app is at the workspace root, not under `website/`, even though `CLAUDE.md` still describes a `website/` folder.
  Evidence: `find . -maxdepth 3 -type f` shows `app/`, `package.json`, `vite.config.ts`, and `server.ts` at the repo root; commands against `website/package.json` failed with "No such file or directory".

- Observation: The previous Elegant Beauty deck used an isolated `deck-site/`, but MSC already has a React Router/Hydrogen app with the right fonts and tokens.
  Evidence: the Elegant deck-site plan records an isolated deck-site decision for a Next.js app; this MSC repo has no Next dependency but already has React, React Router, Tailwind v4, StarCity fonts, and MSC CSS variables in `app/styles/app.css`.

- Observation: Local Hydrogen development requires a `SESSION_SECRET` even for this hidden deck route.
  Evidence: The first local dev attempt returned a `SESSION_SECRET environment variable is not set` server error; an ignored local `.env` file with a dummy local dev value let MiniOxygen serve `/dark-room-deck`.

- Observation: Full repo `typecheck` and `lint` are not clean today, but the deck route has no targeted lint failures and the production build succeeds.
  Evidence: `npm run typecheck` fails in existing files `HomeHero.tsx`, `ProductItem.tsx`, and `api.subscribe.tsx`; `npm run lint` fails in existing `metaobjects.ts`, `art.$handle.tsx`, and `scripts/seed/*` parser/project config issues. `npx eslint app/routes/dark-room-deck.tsx app/components/PageLayout.tsx` exits 0, and `npm run build` exits 0.

- Observation: Raw Chrome CLI mobile screenshots can crop a non-emulated layout even when `--window-size=390,844` is passed.
  Evidence: CLI mobile screenshots visually clipped the cover, while an explicit Chrome DevTools Protocol run with mobile metrics reported `innerWidth`, `clientWidth`, `scrollWidth`, and `bodyScrollWidth` all equal to `390`, with no overflow offenders.

## Decision Log

- Decision: Finish the deck as a tight ~10-shot iconic reel, not a 30+ shot beat-by-beat previz.
  Rationale: AKLO capped it at "6-9 tops, 10-12 to be safe — the most iconic moments." So the final reel is 4 reused + 6 new stills = 10, each a hero moment (terrace, foyer, portal, void, trap-serve, club, robes-duo, bridge, pipe, darkroom). The darkroom/Polaroid motif became the transition engine + PLAY-mode audio sync so it reads as a flowing trailer with no hard cuts. Proven likeness technique: `pro` model + reference-chaining Mal's canonical photo plus a prior generated frame. `trap-serve` needed one safety re-roll (dropped explicit drug paraphernalia → dingy room mood) and a second re-roll (removed a nude doorway figure → empty chained door).
  Date/Author: 2026-07-08 / Claude (Fable 5).

- Decision: Rebuild the deck as a true 16:9 slide deck instead of a scrolling page.
  Rationale: AKLO explicitly required the Elegant deck's 16:9 presentation format. The scrolling-page scaffold read as a website, not a treatment deck. The rebuild uses a fixed 16:9 frame with `cqw`-proportional typography so every slide scales like a real presentation, a light-luxury vs dark-room slide duality mirroring the video's thesis, and one MSC accent per scene world. Slide count went from 9 to 10 (added a structure/production slide with a proportional 2:45 timeline band).
  Date/Author: 2026-07-02 / Claude.

- Decision: Size the slide frame with a ResizeObserver and keep arrows in the grid via `visibility: hidden` on narrow screens.
  Rationale: Pure-CSS `min()` sizing was hard to verify across engines, and `display: none` on the arrow buttons removed them from the grid flow, collapsing the frame into a 6px gutter column. Also discovered headless Chrome clamps `--window-size` width to 500px, so true phone-width screenshots require CDP device metrics — a repeat of the v1 finding.
  Date/Author: 2026-07-02 / Claude.

- Decision: Build the first Dark Room deck as a hidden route at `app/routes/dark-room-deck.tsx`, not as a separate nested app.
  Rationale: The user explicitly wants the MSC website and Pedro design system to be the brand bible. A route can use the real fonts, CSS custom properties, Tailwind setup, and build pipeline without installing a new bundler or duplicating design tokens.
  Date/Author: 2026-07-02 / Codex.

- Decision: Make the deck 9 pages total: cover, thesis, scene system, penthouse present, trap-house past, dark-room void, Star/club/LES + Chinatown performance, Polaroid/VFX language, and end card.
  Rationale: The user requested 7-10 pages including cover/end, no full line-by-line breakdown, and all scenes/details with placeholder visual examples. Nine pages gives each core scene enough space while keeping the deck reviewable.
  Date/Author: 2026-07-02 / Codex.

- Decision: Replace the Williamsburg Bridge sunset performance image with LES + Chinatown at the base of the Manhattan Bridge.
  Rationale: AKLO preferred the Manhattan Bridge/LES/Chinatown location as the cleaner outdoor image. This keeps the third scene as a location/performance look while avoiding the removed train/photo-lab storyline.
  Date/Author: 2026-07-02 / Codex.

- Decision: Use abstract placeholder visual modules instead of image search or generated images for the first pass.
  Rationale: The user said not to worry about specific images yet and to build the outline first. Branded placeholders should make image needs obvious without pretending final selects are ready.
  Date/Author: 2026-07-02 / Codex.

- Decision: Make hash links behave like slide targets while leaving the base route scrollable.
  Rationale: Direct browser screenshots and deck review are cleaner when `#cover`, `#vfx`, and other index links render that slide alone at the top. The base `/dark-room-deck` route still renders all 9 sections in sequence for scrolling.
  Date/Author: 2026-07-02 / Codex.

## Outcomes & Retrospective

Built an internal React/Tailwind visual deck route at `/dark-room-deck`, using the locked Dark Room v1.0 treatment as the story source and MSC/Pedro design tokens as the brand system. The deck contains 9 pages: cover, thesis, scene system, penthouse present, trap-house past, dark-room void, Star/club/LES + Chinatown performance, Polaroid/VFX language, and end card. It uses abstract placeholder image modules, MSC accent colors, StarCity display type, compact low-radius panels, and a bottom slide index.

The first pass intentionally does not choose final images. The next creative pass should replace the placeholders with real stills, AI reference frames, production references, or lookbook pulls.

Validation evidence:

- `npx eslint app/routes/dark-room-deck.tsx app/components/PageLayout.tsx` exits 0.
- `npm run build` exits 0; it still warns that missing ABC font files remain unresolved at runtime, matching the existing repo font status.
- `curl http://localhost:3000/dark-room-deck` returns `200` from the local Hydrogen server.
- Desktop cover screenshot: `treatments/dark-room/outputs/visual-deck-20260701/desktop-cover-final.png`.
- Desktop VFX screenshot: `treatments/dark-room/outputs/visual-deck-20260701/desktop-vfx-final.png`.
- Mobile cover screenshot from explicit Chrome DevTools Protocol 390px device metrics: `treatments/dark-room/outputs/visual-deck-20260701/mobile-cover-final.png`.
- Mobile overflow metrics: `innerWidth`, `clientWidth`, `scrollWidth`, and `bodyScrollWidth` all reported `390`, with no overflow offenders.

Known repo-wide exceptions outside this deck:

- `npm run typecheck` currently fails in existing app files unrelated to the deck route.
- `npm run lint` currently fails in existing app/script files unrelated to the deck route.

## Context and Orientation

The MSC app lives at the repository root. It is a Shopify Hydrogen / React Router app using React 18, Tailwind CSS 4, and Cloudflare Workers. File-based routes live in `app/routes/`. The root layout in `app/root.tsx` wraps normal pages in `PageLayout`, and `PageLayout` currently renders the MSC header, main content, and footer. The design system lives in `app/styles/app.css` and `app/styles/tailwind.css`.

The locked treatment source is `treatments/dark-room/TREATMENT.md`. The current locked Google Doc copy is `https://docs.google.com/document/d/10_MIGW4j9whKNsov2Pq1CYf41QyTzPfDX0X_wQ5n34Y/edit?usp=drivesdk`. The key story structure is: Mal's luxury penthouse present is haunted by trap-house memories; the black dark-room void uses a fisheye Hype Williams-style high angle and one hanging bulb; Star enters through the club/opulence section and LES + Chinatown at the base of the Manhattan Bridge remains a clean outdoor performance image; Polaroid freeze frames zoom out into a VFX darkroom/evidence-wall language.

The phrase "placeholder visual" means a designed block that stands in for a future photograph, still frame, or generated image. It should show the intended image type, such as "penthouse terrace sunrise", without using final imagery.

## Plan of Work

First, add a route-specific full-bleed exception in `app/components/PageLayout.tsx`. For `/dark-room-deck`, the app should skip the storefront header, footer, cart aside, and search aside, then render the route content directly. This keeps the deck presentation clean while leaving every other route unchanged.

Next, create `app/routes/dark-room-deck.tsx`. The route should export metadata and a default React component. It should define the 9 page data objects in the same file for now, because this is a self-contained treatment deck and not shared application data. The page should render a fixed/sticky deck navigation rail, slide count, section labels, and 9 full-height sections. It should use the MSC CSS variables directly through Tailwind arbitrary values and inline style only where custom font families are needed.

The deck outline should be:

- Page 01 Cover: `Dark Room`, Manhattan Mal & Mr Star City, official music video treatment, version v1.0, with a large black cinematic placeholder and MSC color accents.
- Page 02 Thesis: success haunted by survival, with a concise synopsis and a three-scene map.
- Page 03 Scene System: the three core scenes and how they intercut, shown as a visual architecture board.
- Page 04 Penthouse Present: terrace sunrise, robe, cigar, mimosa, omelette, watch, shoes, gun, foyer.
- Page 05 Trap-House Past: couch/table portal, scales, baggies, fiends, peephole, liquor, street/rain survival.
- Page 06 Dark-Room Void: fisheye high angle, one bulb, black room, cockroach light hit, montage grammar, performance to camera.
- Page 07 Star / Club / LES + Chinatown: Star entrance, abstract club, champagne, rollies, pedicure/massage luxury, LES + Chinatown at the base of the Manhattan Bridge as clean outdoor performance.
- Page 08 Polaroid / VFX Language: freeze frames, evidence-like Polaroids, clothesline darkroom, zoom in/out transitions, Requiem-inspired montage syntax.
- Page 09 End Card: the emotional and production promise, outstanding image needs, and a clean "next pass: replace placeholders" close.

Finally, update `CHANGELOG.md`, `treatments/dark-room/PROJECT.md` if needed, and this plan. Run validation commands and inspect the result in a browser at desktop and mobile sizes. Commit the finished deck when accepted by local checks.

## Concrete Steps

From the repository root, inspect before editing:

    rg --files -g 'AGENTS.md' -g 'CHANGELOG.md' -g 'CLAUDE.md' -g '.claude/CLAUDE.md' -g '.codex/**' -g 'PROJECT.md'
    sed -n '1,260p' CHANGELOG.md
    sed -n '1,260p' CLAUDE.md
    sed -n '1,220p' treatments/dark-room/PROJECT.md

Then edit:

    app/components/PageLayout.tsx
    app/routes/dark-room-deck.tsx
    CHANGELOG.md
    treatments/dark-room/PROJECT.md
    treatments/dark-room/plans/visual-deck-react.md

Validation commands should be run from the repository root:

    npm run typecheck
    npm run build
    npm run dev

After starting the dev server, open the local URL and verify:

    http://localhost:3000/dark-room-deck

If port 3000 is busy, use the actual port printed by the dev server.

## Validation and Acceptance

The deck is accepted when `/dark-room-deck` renders 9 visually distinct pages, has cover and end pages, uses placeholder visual modules for every scene group, and includes the core treatment details without the full 37-line breakdown. The deck must be mobile-friendly: no overlapping text, no text clipped inside controls, no section labels covering body copy, and placeholder media must keep stable dimensions on desktop and mobile.

Technical checks must pass or have a clearly documented pre-existing exception. `npm run typecheck` should not introduce new type errors. `npm run build` should complete or fail only for documented pre-existing Hydrogen/Shopify issues unrelated to this route. Browser verification must include a desktop screenshot and a mobile screenshot. The visual deck must be readable and nonblank in both.

## Idempotence and Recovery

The route is additive and can be removed by deleting `app/routes/dark-room-deck.tsx` and reverting the route-specific branch in `app/components/PageLayout.tsx`. The implementation does not change deploy commands, credentials, Storefront API wiring, or public navigation. If the route causes a build issue, first revert the route file and layout exception; do not weaken global build settings.

## Artifacts and Notes

Important working references:

- Treatment: `treatments/dark-room/TREATMENT.md`
- MSC tokens: `app/styles/app.css`
- Tailwind theme: `app/styles/tailwind.css`
- Layout wrapper: `app/components/PageLayout.tsx`
- Prior deck plan reference: the Elegant deck-site plan

Planned browser screenshots should be saved under `treatments/dark-room/outputs/visual-deck-20260701/`.

## Interfaces and Dependencies

The route should depend only on React, React Router route conventions, and the existing Tailwind/CSS token setup. Do not install shadcn or other UI packages for this first pass. "shadcn-style" here means disciplined component composition: tight spacing, low-radius panels, restrained borders, clear labels, and modern interactive controls. The primary user-facing interface is the local browser route `/dark-room-deck`.
