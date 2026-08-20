# 05 — UI Kit (Phase 3)

All in `src/components/ui/`, composed with `cn()` and palette tokens. Every component: a11y, focus ring, cursor-pointer, reduced-motion-safe.

| Component | Notes |
|---|---|
| `Button.jsx` | variants: primary (gold bg, espresso text), dark (espresso bg, ivory text), ghost (espresso border), light (ivory bg, espresso border); sizes sm/md/lg; `loading` state (spinner + disabled); asChild for Link |
| `Input.jsx` | label, error, prefix/suffix slots? only \*suffix\* (search icon, currency). error text-red role=alert |
| `Select.jsx` | styled native select + custom chevron (filter/sort use) |
| `QuantitySelector.jsx` | - / count / +, 44px targets, clamps to stock, aria-label "Decrease/Increase quantity" |
| `Modal.jsx` | centered dialog: Escape, click-outside, focus trap, `role="dialog"`, close btn; used by forms/success |
| `Drawer.jsx` | left/right variants (props: side, open, onClose, title); used by CartDrawer, MobileMenu, chat panel, mobile filters; overlay + Esc |
| `Accordion.jsx` | used in PDP details + FAQ; button + `aria-expanded`, `aria-controls`, chevron rotate, AnimatePresence height animation |
| `RatingStars.jsx` | lucide star fill, fraction support, size prop, aria-label "Rated 4.5 of 5" |
| `Badge.jsx` | sale (gold), new (espresso), bestseller (champagne), "Low stock", "Back in stock" |
| `Skeleton.jsx` | shimmer placeholder (used with useAsyncData loading) |
| `EmptyState.jsx` | icon + title + copy + optional CTA button |
| `TrustBadges.jsx` | 3-4 row: secure payment, free returns 14 days, genuine products, VAT included (icons, small text) |
| `Breadcrumbs.jsx` | Home / Shop / Dresses / Product (aria-label="Breadcrumb", last = current) |
| `Swatch.jsx` | color dot button: ring when selected; aria-label = color name; from constants hex map |
| `SizeSwatch.jsx` | size chip button (S/M/L), disabled when out of stock; aria-pressed |
| `SwatchGroup.jsx` | fieldset + legend, keyboard arrow navigation, one selected at a time, aria-pressed per option |
| `SectionHeader.jsx` | eyebrow (tracking-widest uppercase gold), title (font-display), optional link "View all →" (used across home sections) |
| `Newsletter.jsx` | inline form (used footer + home), success toast, no pre-ticked |
| `Announcement.jsx` | rotating message bar (used in navbar row 1; may live in navbar/) |

## Acceptance

- [ ] Every kit component passes: focus-visible ring, ≥44px hit area, cursor-pointer.
- [ ] Button loading disables + shows spinner; no layout shift on hover.
- [ ] Drawer/Modal trap focus and restore on close.
- [ ] SwatchGroup keyboard arrows work; disabled sizes still visible (strikethrough) and not clickable.
- [ ] Skeleton matches card proportions (no CLS).