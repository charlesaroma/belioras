# 09 — QA & Polish (Phase 6)

## Assets

- Replace `public/favicon.svg` with gold "B" monogram (espresso rounded square, gold serif B) — brand mark.
- Delete template assets: `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/hero.png` (used only by template code).
- Add `public/img/*.svg` product placeholder art (elegant monochrome line illustrations: dress silhouettes, hair bundles, bag, belt, scarf, jewelry) — referenced by `data/*.json` `images[]`.
- `icons.svg` (bluesky/discord/github) removed or replaced with brand social icons via lucide (no external dependency needed).

## Accessibility audit (walkthrough)

- [ ] Tab order matches visual order on home + shop.
- [ ] Every interactive element focusable with visible ring; no focus traps except Drawer/Modal (which trap + restore).
- [ ] Icon-only buttons have aria-label; images have alt; color never sole indicator.
- [ ] Form labels all linked; errors `role="alert"`.
- [ ] Announcements/toasts in `aria-live`.
- [ ] Mega menu + drawers: Escape, click-outside, `aria-expanded` correct.
- [ ] `prefers-reduced-motion`: no long animations; Motion `useReducedMotion` gates reveals.
- [ ] Screen reader sanity: headings hierarchy (one h1 per page), landmarks (header/nav/main/footer).

## Responsive pass

- [ ] 375px: no horizontal scroll; nav row 2 collapses (search icon → modal), promo text truncates, grids 2-col, drawer full width.
- [ ] 768px: 3-col grids, sidebar facets become drawer.
- [ ] 1024px: navbar mega menu works, 4-col grids.
- [ ] 1440px max width container `max-w-7xl` consistent.
- [ ] Fixed navbars don't cover content (padding).

## Performance

- [ ] Bundle: react/react-dom only heavy deps; verify build output warning-free.
- [ ] List virtualization not needed (≤ 100 items) — fine.
- [ ] Images lazy below fold (`loading="lazy"`).

## Lint & Build

- [ ] `npx eslint .` clean (config exists) — fix warnings.
- [ ] `npx vite build` clean, no console leaks in prod bundle (`console.log` stripped in built code not required but check sources).
- [ ] Dev server no errors on all routes (walk through home, shop+filter combos, PDP, search, checkout flow incl. coupon, auth login/signup/forgot, dashboard all modules, legal pages, FAQ, contact).

## DocsFinal

- [ ] Update `docs/README.md` tracker: all phases done.
- [ ] `00-09` acceptance checkboxes ticked.

## Handoff notes

- JSON mock data location + services swap path documented at top of `docs/02-data-layer.md`.
- Note: dashboard CRUD persists in-memory only (module-level store) — survives until page refresh.