# Mithai Palace — DESIGN.md

> Brand style guide for the Mithai Palace website. Derived from the logo
> (`brand/logo-original.webp`). Written in the same shape as the files in
> awesome-claude-design, so it can also be uploaded to Claude Design.

## 1. Visual theme & atmosphere

A boutique Indian sweet house: **regal, warm, festive, uncluttered**. Think of a
palace gateway in maroon and gold on ivory paper. Generous cream space, fine gold
hairlines, and one maroon accent per view. Never loud, neon, or discount-store busy.
Photography of mithai does the colour work; the chrome stays quiet.

Keywords: Mughal arch · gold leaf · ivory · hand-made · celebration · trust.

## 2. Colour palette

Surfaces, text and accents follow the sindhisweets.com palette (sampled from their site,
2026-09-25); maroon and gold come from the Mithai Palace logo.

| Token | Hex | Role | Contrast on page bg |
|---|---|---|---|
| `cream` | `#FAF2EA` | Page background (blush) | — |
| `ivory` | `#F8E6DD` | Panels, cards, hero, promise box (peach) | — |
| `blush` | `#F2CBC0` | Soft buttons ("Enquire", like "Add to bag") | — |
| `ink` | `#2B2A29` | Headings and body text | 12.9 : 1 |
| `ink-soft` | `#6B6460` | Secondary text, captions | 5.2 : 1 |
| `crimson` | `#AB0218` | Icons, eyebrows, prices, tab underline | 6.9 : 1 |
| `maroon` | `#6E0C16` | Primary buttons, logo wordmark, footer, ribbon | 11.0 : 1 |
| `maroon-light` | `#8E1A24` | Button hover, links | 8.4 : 1 |
| `gold` | `#B08A4C` | Decoration only: hairlines, dividers, petal outline | 3.0 : 1 (non-text) |
| `gold-deep` | `#7A5C24` | Logo lockup tagline | 5.6 : 1 |

Rules
- Gold is never used for body text; use `crimson` for small accent text.
- On maroon backgrounds, text is `cream`.
- One primary (maroon) button per section; secondary buttons are outlined; "Enquire" uses the soft `blush` fill.
- The logo is shown as supplied, with no arch frame around it (owner request, 2026-09-25).

## 3. Typography

| Role | Font | Weight / style | Notes |
|---|---|---|---|
| Display & H1/H2 | **Cinzel** | 600–700, uppercase by nature | Mirrors the "MITHAI" wordmark. Letter-spacing `0.02em`. |
| Eyebrow / small caps | **Cinzel** | 500, `0.25em` tracking, 0.8rem | Mirrors "PALACE" and "TRADITIONALLY SWEET". gold-deep. |
| H3, pull quotes, taglines | **Cormorant Garamond** | 500–600, italic for flourishes | Elegant, readable at 1.25rem+. |
| Body, UI, prices | **Inter** | 400 / 500 / 600 | 1rem–1.125rem, line-height 1.65. Tabular numbers for prices. |

Scale (mobile → desktop): H1 2.25rem → 3.75rem · H2 1.75rem → 2.5rem · H3 1.375rem → 1.75rem · body 1rem → 1.0625rem.

All fonts from Google Fonts, `display=swap`.

## 4. Components

**Buttons** — pill-free: 4px radius, 0.75rem × 1.5rem padding, Inter 600, `0.04em` tracking, uppercase small text.
- Primary: maroon fill, cream text; hover maroon-light, 1px gold inner ring.
- Secondary: transparent, 1.5px maroon border, maroon text; hover ivory fill.
- WhatsApp/Call buttons follow primary/secondary, with an icon on the left.

**Cards (sweet / gift box)** — ivory fill, 1px gold border, 6px radius, image on top
(4:3), name in Cormorant 600, one-line description in ink-soft, price in gold-deep Inter 600.
Hover: lift 2px + soft warm shadow `0 8px 24px rgb(110 12 22 / 0.08)`.

**Arch frame** — the logo's scalloped Mughal arch as an SVG mask/clip. Used for the hero
image, the "Our story" photo, and festival banners. Always with a thin gold outline.

**Petal divider** — the four-petal flower (maroon petals, gold outline) centred between two
gold hairlines. Used between major sections. Max one per screen.

**Eyebrow + heading** — every section starts with a Cinzel eyebrow in gold-deep (e.g. "FROM OUR KITCHEN")
over a Cinzel H2 in maroon, optionally a Cormorant italic line beneath.

**Header** — cream, logo lockup (arch icon + "MITHAI PALACE") left, nav right, maroon "Order enquiry" button.
Mobile: hamburger opens a full-height cream panel. Sticky with a gold hairline bottom border after scroll.

**Footer** — maroon background, cream text, gold dividers: address, hours, contact, quick links, socials.

**Promise strip** — 3–4 items with gold line icons and short Cinzel labels on an ivory band.

**Forms** — labels above fields, Inter; fields cream fill, 1px `ink-soft/40` border, focus 2px maroon ring.
Errors in maroon-light with text, never colour alone.

## 5. Layout

- Mobile-first. Content max-width 1200px; text blocks max 65ch.
- Section vertical padding: 4rem mobile, 6rem desktop. Alternate cream / ivory bands.
- Grid: 1 column mobile, 2 at 640px, 3 at 1024px, 4 for small product cards at 1280px.
- 16px side gutter on phones, no horizontal scroll.

## 6. Depth & motion

- Flat, paper-like. Shadows only on hover and on the sticky header.
- Motion: 150–250ms ease-out fades/lifts. Respect `prefers-reduced-motion`. No parallax, no carousels that auto-advance.

## 7. Imagery

- Warm, natural-light close-ups of mithai on brass thalis, banana leaf, or ivory cloth.
- Until real photos exist, use tasteful placeholders: ivory panel with the petal motif and the sweet's name.
- Logo used as supplied; never recoloured, stretched, or placed on busy photos.

## 8. Do / Don't

Do: lots of cream space · gold as a hairline · maroon for emphasis · real photos · honest claims.
Don't: gradients on text · gold text on cream below 24px · more than three fonts · stock clip-art diyas ·
invented reviews, prices, or dietary claims.
