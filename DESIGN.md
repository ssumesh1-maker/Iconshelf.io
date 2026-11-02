# Icon Shelf design system

## Context and assumptions

Icon Shelf is a personal icon browsing tool for phone, tablet, laptop and large desktop browsers. Preserve its existing white/pale-gray surfaces, slate icons, violet/mint accents, rounded controls, full-width layout above 1728 CSS px, category filters, personal library and popup workflows. Typography should support scanning a dense catalog rather than resemble a marketing page.

## Typography foundations

- **Family:** locally served Nunito Sans; system UI, Apple system, Segoe UI and sans-serif fallbacks.
- **Real weights:** 400 regular, 600 medium, 700 strong. Synthetic weights are disabled.
- **Units:** `rem` for text and `clamp()` for fluid display sizes. Leave the root font size at the browser default so user text-size preferences are retained.
- **Line heights:** headings 1.2; section/card headings 1.3; controls 1.4; body 1.55; captions 1.45.
- **Tracking:** page/dialog titles −0.025 em; section/card headings −0.015 em; brand −0.04 em; overline labels +0.12 em. Ordinary UI text uses normal tracking.
- **Numbers:** tabular figures for counts, size options and pagination.

### Responsive token mapping

Values below assume the browser's default 16 px root. Widths are CSS viewport widths, not physical device pixels.

| Role / token | Phone ≤640 px | Tablet 641–1100 px | Desktop 1101–1728 px | Large ≥1729 px |
| --- | --- | --- | --- | --- |
| Body / `--type-body` | 14 px | 15 px | 16 px | 18 px |
| UI / `--type-ui` | 13 px | 14 px | 14 px | 16 px |
| Label / `--type-label` | 12 px | 13 px | 13 px | 14 px |
| Caption / `--type-caption` | 11 px | 12 px | 12 px | 13 px |
| Badge / `--type-badge` | 10 px | 11 px | 11 px | 12 px |
| Form field / `--type-field` | 16 px | 16 px | 14 px | 16 px |
| Search / `--type-search` | 16 px | 16 px | 16 px | 18 px |
| Icon name / `--type-icon` | 12 px | 13 px | 13 px | 14 px |
| Compact icon name / `--type-icon-compact` | 11 px | 12 px | 12 px | 13 px |

Fluid tokens run continuously across viewport widths:

| Role | Formula | Range |
| --- | --- | --- |
| Page heading | `clamp(1.5rem, 1.25rem + .8vw, 2.25rem)` | 24–36 px |
| Popup heading | `clamp(1.5rem, 1.25rem + .65vw, 2.125rem)` | 24–34 px |
| Section heading | `clamp(1.125rem, 1rem + .5vw, 1.5rem)` | 18–24 px |
| Pack heading | `clamp(1rem, .9rem + .3vw, 1.25rem)` | 16–20 px |
| Brand | `clamp(1.5rem, 1.25rem + .7vw, 2.25rem)` | 24–36 px |

Navigation follows the UI role except below 400 px, where it uses 12 px, or 11 px at/below 340 px, to keep three clear navigation choices. Navigation can wrap and grow rather than clip if its content needs extra space. This is a constrained shell exception, not a general text-size rule.

## Element decisions

| Element | Where | Why | Applied pattern | Trade-off |
| --- | --- | --- | --- | --- |
| Fluid title | Library and icon popup | Establish hierarchy without abrupt size jumps | Fluid page/dialog tokens, 600–700 weight | Caps on large screens keep the catalog compact |
| Body text | Explanations, empty states, library descriptions | Comfortable reading | Device-scale body token with 1.55 leading | Longer passages can wrap onto more lines |
| Labels and controls | Toolbar, filters, forms and buttons | Consistent scanning and selection | Shared UI/label roles, 600 weight | Small shell navigation has the documented exception |
| Native form text | Search, sort, sizes and folder names | Readable mobile input without automatic focus zoom | 16 px phone/tablet field text | Sort controls reserve enough column width |
| Icon names | Catalog tiles | Keep identity legible in a dense grid | Medium-weight icon token, one-line ellipsis | Complete icon names remain in accessible preview labels |
| Secondary metadata | Licenses, collection names and counts | Improve readability without competing with icon names | Caption token and stronger semantic text colors | Some long collection names truncate in tiles |
| Popup copy | Icon details and save picker | Fit larger text on short screens | Scrolling modal content and reserved notification space | Short screens require vertical scrolling |

## Text colors

| Token | Color | Contrast on white | Contrast on `#f7f7fa` |
| --- | --- | --- | --- |
| Primary | `#394056` | 10.29:1 | 9.62:1 |
| Secondary | `#60677b` | 5.64:1 | 5.27:1 |
| Muted | `#6b7184` | 4.86:1 | 4.55:1 |

These ratios apply to these text/surface pairs, not every color or interaction in the application. Tags and action accents retain their contextual violet treatments.

## Validation and decision log

- Retained the existing local font and palette; added semantic tokens rather than another font or per-screen font declarations.
- Increased the former 8–10 px metadata and labels to the defined roles, with stronger secondary text colors.
- Applied only real installed weights and explicit line heights.
- Retained the existing responsive layout, library storage, exports and tag navigation.
- Verified the responsive browser matrix and personal-library workflows after implementation.
- `npm run test:typography` checks computed font sizes, hierarchy, line heights, font family/weights, mobile form sizes and overflow at 13 viewport widths from 280 to 3840 CSS px.
- Chromium rendering is verified. Physical-device Safari/Firefox rendering and operating-system text settings have not been independently tested; no full accessibility-conformance claim is made.

Implementation: semantic typography section at the end of `public/style.css`.
