# Mithai Palace Website — Design Spec

Date: 2026-09-25 · Status: approved in chat, pending written review

## Goal

A professional, fast, phone-friendly showcase website for **Mithai Palace**
("Traditionally Sweet"), an Indian sweet shop in North Mulgrave NSW, that makes
customers want to visit, call, WhatsApp, or send an order enquiry. Look and feel
follows `DESIGN.md` (derived from the logo). Reference for structure: puredesi.shop.

## Non-goals

- No online cart, checkout, or payments (can be added later).
- No CMS or admin login; content is edited in data files.
- No invented facts. Prices, hours, contact details, reviews, "since" year and
  dietary claims stay as clearly marked placeholders until the owner supplies them.

## Business facts (current)

- Name: Mithai Palace · Tagline: Traditionally Sweet
- Address (unconfirmed): Shop 12, 87–91 Railway Road, North Mulgrave NSW
- Contact details, hours: TBA → placeholders

## Pages

| Route | Page | Content |
|---|---|---|
| `/` | Home | Arch hero with logo + tagline + Call / Order enquiry CTAs; promise strip; featured sweets (6–8); festival gift boxes teaser; catering teaser; story teaser; Visit us (map, address, hours) |
| `/menu` | Menu | Categories: Barfi, Ladoo, Halwa, Milk sweets, Namkeen & snacks. Card per item: name, description, price + unit, photo/placeholder. Category jump links. |
| `/gift-boxes` | Gift boxes & festivals | Box sizes (250 g / 500 g / 1 kg); festival sections (Diwali, Eid, Raksha Bandhan, weddings & baby showers) each with an `active` flag |
| `/catering` | Catering & events | Weddings, parties, corporate gifting, bulk orders; Request a quote CTA → contact form with type preselected |
| `/about` | About | Family/shop story (placeholder copy), how sweets are made |
| `/contact` | Contact & order enquiry | Form (name, phone, email, date needed, items, pickup/delivery, message); WhatsApp / call / email buttons; Google Map embed; hours |
| `/404` | Not found | On-brand message + links home/menu |

Shared: header (logo, nav, Order enquiry button, mobile menu), footer (address, hours, contact, links, socials).

## Architecture

- **Astro** (static output) + **Tailwind CSS v4** via the Vite plugin. Brand tokens from DESIGN.md defined once in `src/styles/global.css` (`@theme`).
- Fonts: Cinzel, Cormorant Garamond, Inter from Google Fonts.
- Content as typed data files, the only place owners need to edit:
  - `src/data/site.ts` — name, tagline, address, phone, WhatsApp, email, hours, socials, map URL, form endpoint.
  - `src/data/menu.ts` — categories and items (name, description, price, unit, image?, featured?).
  - `src/data/boxes.ts` — gift box sizes and festival sections (with `active`).
- Placeholders are values wrapped by a single `TBA` marker (e.g. `"TBA"`), rendered visibly as "Coming soon" / "Call for price" so nothing false is shown, and listed by a `npm run check:placeholders` script before launch.
- Components: `Layout`, `Header`, `Footer`, `ArchFrame`, `PetalDivider`, `SectionHeading`, `SweetCard`, `BoxCard`, `CtaButtons`, `PromiseStrip`, `VisitUs`, `EnquiryForm`, `PlaceholderImage`.
- Brand assets: `public/logo.webp` (original), SVG arch outline and petal motif redrawn as inline SVG components; favicon from the petal.
- Enquiry form: plain HTML POST to a Formspree endpoint set in `site.ts`; until set, the submit shows a note to call/WhatsApp instead (no silent failure). Client-side required-field validation + honeypot.
- SEO: per-page title/description, Open Graph image (logo), `LocalBusiness`/`Bakery` JSON-LD from `site.ts`, sitemap via `@astrojs/sitemap`, `robots.txt`.

## Accessibility & quality

- WCAG AA contrast (tokens pre-checked in DESIGN.md), semantic landmarks, skip link, visible focus rings, alt text, keyboard-usable mobile menu, `prefers-reduced-motion`.
- Mobile-first; tested at 375px, 768px, 1280px.
- Verification: `astro check` + `astro build` pass; visual check of every page in the browser at phone and desktop widths; placeholder report generated.

## Deliverables in `Desktop\Mithai Palace Website`

`DESIGN.md`, `brand/` (original logo), `docs/` (this spec + plan), Astro project, `README.md`
(preview, edit prices/hours, connect Formspree, deploy to Netlify, add domain). Git repo initialised with commits per step.

## Open items for the owner

Confirm address + postcode; phone, WhatsApp, email; opening hours; menu items and prices;
which promises are true (vegetarian, no preservatives, made daily…); story/"since" year; photos; social links; domain name.
