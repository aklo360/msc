# Dark Room Visual Deck v4 Redesign

This is a living execution plan. Keep Progress, Surprises, Decision Log, and Outcomes current while the work is in motion.

## Purpose

Replace the rejected app-like Dark Room deck with a cinematic, editorial 16:9 director's treatment. The new deck must foreground the approved images and the film's emotional logic, retain dependable slide navigation, and remove interface chrome that makes the work feel templated or synthetic.

## Progress

- [x] Recover the original Codex brief and subsequent AKLO corrections from local Codex and Claude history.
- [x] Audit representative frames of the current live deck at desktop size.
- [x] Review every selected Dark Room still at source resolution.
- [x] Rebuild the route as a 10-spread editorial treatment.
- [x] Verify type, cropping, hierarchy, and navigation at desktop and mobile sizes.
- [x] Run targeted lint and a production build.
- [x] Update project state and changelog.

## Surprises and Discoveries

- The live deck contains 14 slides, despite earlier project notes describing a 10-slide target.
- The selected stills are substantially stronger at source resolution than they appear inside the current interface. The main failure is presentation: rounded frames, repeated metadata, giant display type, per-shot HUD labels, and a 14-button bottom rail compete with the photography.
- The local Hydrogen preview currently returns a pre-existing MiniOxygen JSON parsing 503. A standalone local render is therefore the reliable browser-verification path for this redesign.
- The original brief explicitly requested a 16:9 Elegant-like presentation. Later feedback rejected rainbow category tags, oversized titles, trailer controls, cover pills, and app-like styling.

## Decision Log

- Preserve the existing approved stills; redesign their sequencing, crops, and editorial relationships before generating replacements.
- Use ten spreads: cover, premise, visual language, penthouse, memory portal, void, club/bridge, sensory montage, production approach, and final image.
- Restrict the palette to black, photographic white, warm paper, and diegetic darkroom red. No category rainbow.
- Keep keyboard, swipe, click-edge, and `?slide=N` deep-link behavior. Replace the bottom pill rail with a nearly invisible fraction and hairline progress indicator.
- Use StarCity only as a restrained title face. Use ABC Diatype for readable editorial copy.
- Use simple crossfades and respect reduced-motion preferences. Remove Ken Burns, simulated film transport, and darkroom transition overlays.
- Do not alter the locked treatment prose. The deck may excerpt it for hierarchy but does not rewrite the master.

## Outcomes

The route is now a ten-spread editorial treatment with the approved stills presented at cinematic scale. The rejected v3 interface grammar has been removed, navigation has been reduced to invisible edge controls plus a hairline folio, and the production page reflects the latest equipment constraints. The first full browser pass exposed one collision on the memory-portal spread; the inset image was moved into the open upper-right field and the headline was reduced, then a second final desktop pass confirmed the correction.

Verification completed with targeted ESLint, `git diff --check`, and `npm run build`. Chrome rendered all ten slides at 1600×1000, five representative slides at 844×390 mobile landscape, and three at 390×844 mobile portrait. The landscape treatment is legible on phone; portrait preserves the 16:9 canvas and is intended to be rotated for detailed reading. Chrome processes were finite and no headless browser family remained after capture. The local Hydrogen preview's pre-existing MiniOxygen 503 was bypassed with a self-contained local browser bundle. No deployment was performed.

## Context and Orientation

The production route is `app/routes/dark-room-deck.tsx`. The locked written treatment is `treatments/dark-room/TREATMENT.md`. Approved stills are in `public/darkroom/`. Existing exports and screenshots must remain preserved; v4 audit and verification artifacts belong in `treatments/dark-room/outputs/visual-deck-v4-redesign-20260720/`.

The current route already owns the correct full-screen exception through `PageLayout`, and the standalone entry point is `scripts/darkroom-static-entry.tsx`. The redesign should stay self-contained in the route unless a genuinely reusable project-level primitive emerges.

## Plan of Work

First, replace the data model and stylesheet with a deliberately small editorial system: fixed 16:9 canvas, full-bleed image treatments, split spreads, restrained captions, page folios, and one minimal progress line. Then compose ten pages around the story's core contrast between pristine present and contaminated memory. Finally, validate the route in a standalone browser build, adjust image positions and responsive scaling, and record the finished state.

## Concrete Steps

1. Rewrite `app/routes/dark-room-deck.tsx` around ten explicit slide components.
2. Preserve asset-base support so the Aklo Studio standalone export remains possible.
3. Preserve arrow-key, swipe, edge-click, and deep-link navigation with accessible controls.
4. Remove unused transport, rainbow-token, pill, card, Ken Burns, and seam-transition code.
5. Produce versioned desktop and mobile screenshots without overwriting earlier outputs.
6. Run ESLint on the route, `git diff --check`, and `npm run build`.
7. Update `treatments/dark-room/PROJECT.md` and the repo-root `CHANGELOG.md`.

## Validation and Acceptance

The redesign is accepted when:

- the deck is exactly 16:9 and visually coherent at 1600x1000 and a phone-sized viewport;
- all ten pages are reachable by keyboard, swipe, arrow controls, and `?slide=N`;
- no rounded UI cards, colored category tags, fake transport controls, giant bottom rail, or rainbow accents remain;
- the cover has no MSC pill or subtitle and the ending is an image-led final statement rather than “Thank you”;
- the production page includes the current camera/lighting/grip guidance, limits gimbal use to penthouse moves, and includes no dolly track or rain rig;
- targeted lint, whitespace checks, and the production build complete without new errors;
- browser screenshots show legible type and intentional image crops on desktop and mobile.

## Recovery and Idempotence

The redesign modifies one route and project documentation. Existing screenshots and exports stay untouched. New audit renders live in a new versioned output directory. If the route needs to be reverted, the pre-v4 implementation remains available in Git history and the prior output folders remain intact.

## Artifacts

- Implementation: `app/routes/dark-room-deck.tsx`
- Plan: `treatments/dark-room/plans/visual-deck-redesign-v4-20260720.md`
- Before audit: `treatments/dark-room/outputs/visual-deck-v4-redesign-20260720/audit-before/`
- After verification: `treatments/dark-room/outputs/visual-deck-v4-redesign-20260720/after/`

## Dependencies and Interfaces

- React hooks already available in the Hydrogen application.
- Existing `ABC Diatype` and `StarCity` font faces from the MSC stylesheet/standalone shell.
- Existing JPG assets under `public/darkroom/`.
- Browser verification through the standalone React entry and local Chrome when the Hydrogen preview is unavailable.
