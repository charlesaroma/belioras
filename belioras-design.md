# Belioras

Editorial, exclusive, quietly luxurious.

## Overview

Belioras is a design system built for a premium fashion boutique, where the interface behaves like a print editorial rather than a storefront. It pairs a high-contrast display serif with a neutral, exacting sans, and lets a single warm gold carry almost all of the personality. Whitespace is used as a signal of scarcity and craft — nothing crowds, nothing shouts. Every surface should feel like the inside of a boutique bag: dark, considered, and lined in gold foil.

## Colors

- **Primary** (#D9B166): Beliora Gold — CTAs, links, key actions, premium highlights, icons
- **Secondary** (#734B1A): Heritage Brown — secondary surfaces, typography on gold, supporting structure
- **Accent I** (#F2D680): Champagne Gold — promotional banners, hover/interactive highlights, editorial callouts
- **Accent II** (#592202): Burnt Umber — seasonal campaigns, deep editorial accents, used sparingly
- **Base / White** (#F2F2F2): Soft Ivory — page background, cards, whitespace
- **Base / Deep** (#120700): Deep Espresso — typography, footer, luxury dark-mode surfaces
- **Success** (#166534)
- **Warning** (#CA8A04)
- **Error** (#B91C1C)
- **Info** (#0E7490)

**Color hierarchy:** 60% Primary Gold · 25% Heritage Brown · 10% Accent colors · 5% Neutrals. The accent colors support the primary palette — they should never replace it.

### Full scale

| Step | Beliora Gold | Heritage Brown | Champagne Gold | Burnt Umber | Soft Ivory |
|---|---|---|---|---|---|
| 50 | #FBF7F0 | #F1EDE8 | #FEFBF2 | #EEE9E6 | #FEFEFE |
| 100 | #F3E7D0 | #D4C7B8 | #FBF2D8 | #CCBAB1 | #FBFBFB |
| 200 | #EEDBB9 | #BFAC96 | #F9ECC5 | #B3998B | #F9F9F9 |
| 300 | #E6CB98 | #A18666 | #F6E4AA | #906B55 | #F6F6F6 |
| 400 | #E1C185 | #8F6F48 | #F5DE99 | #7A4E35 | #F5F5F5 |
| 500 | #D9B166 | #734B1A | #F2D680 | #592202 | #F2F2F2 |
| 600 | #C5A15D | #694418 | #DCC374 | #511F02 | #DCDCDC |
| 700 | #9A7E48 | #523512 | #AC985B | #3F1801 | #ACACAC |
| 800 | #776138 | #3F290E | #857646 | #311301 | #858585 |
| 900 | #5B4A2B | #30200B | #665A36 | #250E01 | #666666 |

Use the 500 step as the reference token in components; lighter steps (50–300) for tints/backgrounds, darker steps (600–900) for text-on-light and hover/active states.

## Typography

- **Display Font**: Didot (editorial serif — 18th-century French origin, high thick/thin contrast, precise geometry)
- **Interface Font**: Helvetica Neue (Swiss sans — clarity, balance, timeless neutrality)
- **Mono Font**: Fira Code

Didot is reserved for moments that should feel exclusive and editorial: hero headlines, campaign titles, collection names. It should always carry generous letter spacing and ample surrounding whitespace so each headline commands attention on its own. Helvetica Neue is the functional counterpart — it should stay clean and highly legible across navigation, product names, pricing, filters, forms, checkout, and all other interface text. Usability and elegance should feel in perfect balance; Helvetica Neue never competes with Didot for attention.

- **Display**: Didot 40px regular, 1.15 line height, 0.03em tracking. Hero banners, campaign moments.
- **Headline**: Didot 30px regular, 1.25 line height, 0.02em tracking. Collection names, page titles.
- **Subhead**: Didot 22px regular, 1.35 line height, 0.01em tracking. Section headers, editorial card titles.
- **Body Large**: Helvetica Neue 18px regular, 1.6 line height, 0.01em tracking. Product descriptions, editorial copy.
- **Body**: Helvetica Neue 16px regular, 1.6 line height. Default paragraph text, navigation.
- **Body Small**: Helvetica Neue 14px regular, 1.5 line height. Secondary info, product metadata.
- **Caption**: Helvetica Neue 12px medium, 1.4 line height, 0.03em tracking. Fabric/material labels, size guides.
- **Overline**: Helvetica Neue 11px semibold, 1.5 line height, 0.12em tracking, uppercase. Category labels, "New Arrival" / "Limited" badges.
- **Code**: Fira Code 14px regular, 1.6 line height. Order numbers, SKUs.

## Spacing

- **Base unit:** 8px
- **Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- **Component padding (small):** 8px 14px
- **Component padding (medium):** 12px 20px
- **Component padding (large):** 18px 32px
- **Section spacing (mobile):** 56px
- **Section spacing (tablet):** 80px
- **Section spacing (desktop):** 128px

Belioras runs roomier than a typical commerce system — treat the desktop section spacing as a floor, not a ceiling, especially around hero and campaign moments.

## Border Radius

- **None** (0px): Dividers, full-bleed campaign imagery, editorial photography
- **Small** (2px): Chips, tags, small controls — kept nearly square for a tailored feel
- **Medium** (4px): Buttons, inputs, default containers
- **Large** (6px): Product cards, modals — subtle, never rounded enough to feel playful
- **XL** (8px): Hero sections, promotional banners
- **Full** (9999px): Avatars, circular badges only

Belioras keeps radii tight throughout — this is a tailored, structured system, not a soft one. Reserve GreenLeaf-style generous rounding for nothing in this brand.

## Elevation

**Philosophy:** Quiet depth. Shadows are permitted but stay soft and warm-toned (never cool gray) — depth should read as a shift in light, not a UI trick. Gold hairline borders reinforce structure on light surfaces.

- **Subtle**: 0 1px 2px rgba(18, 7, 0, 0.06)
- **Medium**: 0 4px 12px rgba(18, 7, 0, 0.10)
- **Large**: 0 12px 32px rgba(18, 7, 0, 0.14)
- **Overlay**: background #120700 at 55% for scrim (deeper than typical — the boutique feels dim and intentional behind a modal)

**Special:** Featured/campaign cards use a 1px #D9B166 (Beliora Gold, 40% opacity) border in addition to elevation, for the "gold foil edge" signature.

## Components

### Buttons
- **Primary**: #120700 fill, #F2D680 text, no border, 4px corners. Helvetica Neue 600, 0.04em tracking, uppercase. Hover: #D9B166 fill, #120700 text. Active: #3F290E fill.
- **Secondary**: transparent, #120700 text, 1px #120700 border, 4px corners. Hover background: #FBF7F0.
- **Ghost**: transparent, #734B1A text, no border. Hover background: #F1EDE8.
- **Destructive**: #B91C1C fill, #FFFFFF text, no border. Hover: #991B1B.
- **Sizes**: Small 32px / Medium 44px / Large 52px height
- **Disabled**: 40% opacity, disabled cursor

Belioras inverts the usual pattern: the primary button is dark (espresso), with gold as the accent text/hover color — echoing foil-stamped packaging rather than a filled "action color" block.

### Cards
- **Default**: #FEFEFE fill, 1px #EEE9E6 border, 6px corners, no shadow at rest. 20px padding. Hover: shadow Medium + border-color #D9B166.
- **Elevated / Featured**: #FEFEFE fill, 1px #D9B166 at 40% border, 6px corners, shadow Medium at rest. 28px padding. Hover: shadow Large.

### Inputs
- **Text Input**: #FFFFFF fill, 1px #CCBAB1 border, #120700 text, 4px corners. #906B55 placeholder, 14px/16px padding, 48px tall. Focus: border-color #734B1A, outline 2px #D9B166 at 25%. Error: border-color #B91C1C. Disabled: background #F1EDE8, 60% opacity.
- **Label**: Helvetica Neue 500, 13px, uppercase, 0.06em tracking, color #120700, bottom margin 8px
- **Helper text**: Helvetica Neue 400, 12px, color #7A4E35

### Chips
- **Filter Chip**: #F1EDE8 fill, #523512 text, 1px #CCBAB1 border, 2px corners. Helvetica Neue 500 12px, uppercase. 6px/14px padding. Selected: background #120700, text #F2D680, border-color #120700. Hover: border-color #D9B166.
- **Status Chip**: background #F5DE99, text #592202 — new arrival; background #F1EDE8, text #523512 — in stock; background #FEF9C3, text #CA8A04 — low stock / limited; background #FEE2E2, text #B91C1C — sold out.

### Lists
- **Default List Item**: Helvetica Neue 400 15px. 56px tall, 14px/20px padding, 1px #EEE9E6 divider, 20px icon, 14px gap before text. Hover: background #FBF7F0. Selected: background #F1EDE8, left border 2px #D9B166.

### Checkboxes
18px, 1.5px #CCBAB1 border, 2px corners. Checked: background #120700, border-color #120700, checkmark #F2D680. Indeterminate: background #120700, dash #F2D680. Disabled: 40% opacity. Labels in Helvetica Neue 400 15px, 10px gap.

### Radio Buttons
18px, 1.5px #CCBAB1 border. Selected: border-color #120700, inner dot #D9B166 (8px). Disabled: 40% opacity. Labels in Helvetica Neue 400 15px, 10px gap.

### Tooltips
#120700 fill, #F2D680 text, 2px corners. Helvetica Neue 400 12px. 8px/12px padding, 220px max width, 5px arrow, 250ms delay, top (default) position.

## Do's and Don'ts

1. **Do** reserve Didot exclusively for headline-scale moments — hero copy, collection names, campaign titles. Never set body copy, buttons, or UI chrome in Didot.
2. **Do** let Beliora Gold #D9B166 carry roughly 60% of the palette's visual weight; Heritage Brown #734B1A follows at ~25%.
3. **Do** give Didot headlines generous letter spacing and surrounding whitespace — the type should command attention on its own, not compete with dense layout.
4. **Don't** round corners past 8px anywhere except avatars/circular badges — Belioras is tailored and structured, not soft.
5. **Don't** use cool-gray shadows; every shadow token is warm-toned off the Deep Espresso base.
6. **Do** use the dark-fill/gold-text button pattern for primary actions — it is the brand's signature reversal of the usual "colored fill" convention.
7. **Don't** use pure black #000000 — always use Deep Espresso #120700 for maximum-contrast text and dark surfaces.
8. **Do** keep photography editorial: natural light, minimal cropping, no neon or oversaturated post-processing.
9. **Don't** crowd product grids — treat the desktop 128px section spacing as a floor; scarcity of layout reinforces perceived exclusivity.
10. **Do** use Champagne Gold #F2D680 and Burnt Umber #592202 sparingly, as true accents (~10% combined) — they should punctuate, not anchor, any screen.