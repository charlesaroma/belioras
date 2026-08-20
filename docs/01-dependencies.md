# 01 — Dependencies & Config

## Install

```
npm install tailwindcss @tailwindcss/vite react-router-dom motion lucide-react clsx tailwind-merge react-hook-form
```

(Let's avoid introducing zod unless user asks; react-hook-form only.)

## Vite Config

`vite.config.js`: add `@tailwindcss/vite` plugin.

## index.css

- Keep current Tailwind v4 `@import "tailwindcss"` + `@theme` palette (gold/brown/champagne/umber/ivory/espresso).
- Add:
  - Google Fonts import: Playfair Display (display serif) + Inter (body) via `@import url(...)` at top.
  - `--font-display` / `--font-sans` tokens.
  - Base layer: body font-sans, bg-ivory-50, text-espresso; `font-display` utility class.
  - Component classes used app-wide (defined once, reused everywhere):
    - `.btn` variants: `btn-primary` (gold), `btn-ghost` (espresso outline), `btn-dark` (espresso), `btn-light` (ivory), sizes `btn-sm/md/lg`.
    - `.card` (ivory bg, umber border, rounded, soft shadow).
    - `.input`, `.label`, `.select` base styles.
    - `.chip` (selected/active bg-gold-100).
    - `.status-chip` (map: pending/paid/shipped/delivered/cancelled/refunded → tinted bg + dot).
  - Reveal/entrance animation utilities (`animate-fade-up`, `animate-fade-in`) using transform/opacity only.
  - Reduced motion media query disabling animations.

## Acceptance

- [ ] `npm run dev` starts, page renders without template assets.
- [ ] `vite build` clean.
- [ ] `@font-face`/Google fonts load in dev.
- [ ] No tailwind.config.js added (v4 CSS-first).