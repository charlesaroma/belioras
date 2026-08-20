# 00 — Code Conventions

Binding rules for every file in this project.

## 1. Split Rule (JSX)

- **Max ~250 lines per JSX file.** If a file exceeds it, split.
- Page-level splits **must** go in the page's own `sections/` folder.
  Example: `src/pages/1.home/` keeps `home.jsx` only; every block becomes `src/pages/1.home/sections/Hero.jsx`, `FeaturedCategories.jsx`, ...
- Shared/layout splits go in `src/components/layout/` or `src/components/storefront/`.
- Checkout page: `src/pages/checkout/sections/` (CheckoutSteps, ContactForm, ShippingForm, PaymentForm, OrderSummary, SuccessView).
- Dashboard modules: `src/Dashboard/` per-module folders; large module bodies split into `sections/` or `components/` inside the module folder.
- Navbar: `src/components/layout/navbar/` — index.jsx (shell) + AnnouncementBar, SearchBar, MegaMenu, NavLinks, NavActions, CartDrawer, MobileMenu.

## 2. Comment Style

- Simple, minimal, title case, **no dashes**, no decoration:

```jsx
{/* Hero Section */}
<section className="...">...</section>
```

- One-line file-top comment only when the file's purpose isn't obvious from the name.
- No `//`, no `---`, no ASCII art, no inline commentary on logic.

## 3. Imports & Exports

- Default export for page files; named exports for shared components where the kit prefers.

## 4. Styling

- Tailwind v4 utility classes only. Theme tokens from `index.css`.
- No arbitrary hex values inside components.
- Color-name → hex map lives in `src/utils/constants.js` (used by swatches only).
- Hover states: `transition-colors duration-200` + color/shadow change — never scale transforms that shift layout.
- `cursor-pointer` on all clickable elements.
- Focus: visible focus ring on every interactive element (`focus-visible:ring-2 ring-gold-500` etc.).

## 5. Accessibility (minimum bar)

- Icon-only buttons: `aria-label`.
- All images: descriptive `alt`.
- All form inputs: `<label htmlFor>`.
- Color never the only indicator (text + shape + icon).
- Touch targets ≥ 44x44px.
- `prefers-reduced-motion` respected (Motion `useReducedMotion`).
- Keyboard: mega menu & drawers close on Escape; focus moves sensibly.

## 6. Data Flow (Backend-Ready)

- `src/data/*.json` — mock data only (never import directly in components).
- `src/services/*` — async wrappers (Promise + `mockDelay`).
- `src/hooks/useAsyncData.js` — standardized loading/error/data.
- Components render skeletons while `loading`, EmptyState when no data.

## 7. Currency

- `utils/formatCurrency.js` formats per CurrencyContext currency (EUR default, USD, GBP) — always via the utility, never inline.

## 8. File Naming

- JSX: `PascalCase.jsx` for components (e.g., `SearchBar.jsx`), `kebab-case.jsx` for pages (existing `login.jsx`, `faq.jsx`).
- Keep existing lowercase page files as they are (PRD naming).