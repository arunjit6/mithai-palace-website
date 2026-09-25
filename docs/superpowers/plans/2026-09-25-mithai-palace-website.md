# Mithai Palace Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Mithai Palace showcase website (6 pages + 404) in Astro + Tailwind, styled per `DESIGN.md`, with all business content in editable data files and every unknown fact shown as an honest placeholder.

**Architecture:** Static Astro site. Brand tokens live once in `src/styles/global.css` (Tailwind v4 `@theme`). Business content lives in typed data files under `src/data/`; pure helpers in `src/lib/` (unit-tested with Vitest) turn data into display strings, links and JSON-LD. Pages compose small, single-purpose `.astro` components. A post-build test checks every route exists and contains its key content.

**Tech Stack:** Node 24, Astro 7.x, Tailwind CSS 4.x via `@tailwindcss/vite`, `@astrojs/sitemap`, `@astrojs/check`, Vitest, Google Fonts (Cinzel, Cormorant Garamond, Inter).

**Spec:** `docs/superpowers/specs/2026-09-25-mithai-palace-website-design.md` · Brand: `DESIGN.md`

## Global Constraints

- Project root: `C:\Users\arun_\Desktop\Mithai Palace Website` (Astro project lives at the root, next to `DESIGN.md`).
- Showcase + enquiries only: no cart, checkout, payments, CMS. Hosting/deploy is **out of scope for now** (owner request 2026-09-25).
- Never invent facts. Unknown values use the literal `TBA` (exported const) and render as a friendly placeholder ("Call for price", "Hours coming soon", …). `npm run placeholders` lists every remaining `TBA`.
- Colours only from DESIGN.md tokens: cream `#FDF8EC`, ivory `#F6EDD8`, maroon `#6E0C16`, maroon-light `#8E1A24`, gold `#B08A4C` (decoration only), gold-deep `#7A5C24`, ink `#2A1A14`, ink-soft `#5C4A40`. No pure white/black.
- Fonts: Cinzel (display/eyebrow), Cormorant Garamond (H3/taglines), Inter (body/UI). Max three fonts.
- Mobile-first; no horizontal scroll at 375px; WCAG AA contrast; visible focus; `prefers-reduced-motion` respected; no auto-advancing carousels.
- Address shown as "Shop 12, 87–91 Railway Road, North Mulgrave NSW" and flagged unconfirmed in `site.ts`.
- Commit after each task; messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## File Structure

```
astro.config.mjs            Astro + Tailwind vite plugin + sitemap
package.json                scripts: dev, build, preview, check, test, placeholders
vitest.config.ts
public/
  logo.webp                 original logo (copied from brand/)
  favicon.svg               petal motif
  robots.txt
src/
  styles/global.css         Tailwind import, @theme tokens, base + component classes
  data/
    tba.ts                  TBA const + isTBA()
    site.ts                 business facts (name, address, phone, hours, socials, formEndpoint, promises)
    menu.ts                 categories + items
    boxes.ts                gift box sizes + festivals
  lib/
    format.ts               priceLabel(), hoursRows(), telHref(), whatsappHref(), mailHref()
    seo.ts                  localBusinessJsonLd()
  components/
    PetalMark.astro         four-petal SVG (sizes)
    ArchFrame.astro         scalloped Mughal-arch SVG frame around a slot
    PetalDivider.astro      hairline + petal + hairline
    SectionHeading.astro    eyebrow + H2 + optional italic line
    Button.astro            primary / secondary link-button
    CtaButtons.astro        Call / WhatsApp / Enquiry group (hides TBA channels)
    PlaceholderImage.astro  ivory panel + petal + label
    SweetCard.astro
    BoxCard.astro
    PromiseStrip.astro
    VisitUs.astro           address, hours, map
    EnquiryForm.astro
    Header.astro            sticky, mobile menu
    Footer.astro
  layouts/Layout.astro      <head>, fonts, SEO meta, JSON-LD, skip link, header/footer
  pages/
    index.astro  menu.astro  gift-boxes.astro  catering.astro
    about.astro  contact.astro  404.astro
scripts/placeholders.mjs    lists TBA occurrences in src/data
tests/
  format.test.ts  seo.test.ts  data.test.ts  build.test.ts
README.md
```

---

### Task 1: Scaffold Astro + Tailwind with brand tokens

**Files:** Create project files at root (via `npm create astro`), `astro.config.mjs`, `src/styles/global.css`, `vitest.config.ts`, `public/logo.webp`, `.gitignore`

**Produces:** Tailwind utilities `bg-cream bg-ivory text-maroon bg-maroon text-maroon-light border-gold text-gold-deep text-ink text-ink-soft font-display font-serif font-sans`; component classes `.eyebrow .container-site .section .card`.

- [ ] **Step 1:** Scaffold into a temp dir and move into root (root isn't empty):
  `npm create astro@latest -- _scaffold --template minimal --no-install --no-git --skip-houston -y` then move contents of `_scaffold/` to root (keep existing `DESIGN.md`, `brand/`, `docs/`), delete `_scaffold`.
- [ ] **Step 2:** `npm install` then `npm install tailwindcss @tailwindcss/vite @astrojs/sitemap` and `npm install -D vitest @astrojs/check typescript`.
- [ ] **Step 3:** `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://mithaipalace.example', // replace with real domain at launch
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 4:** `src/styles/global.css`:

```css
@import "tailwindcss";

@theme {
  --color-cream: #FDF8EC;
  --color-ivory: #F6EDD8;
  --color-maroon: #6E0C16;
  --color-maroon-light: #8E1A24;
  --color-gold: #B08A4C;
  --color-gold-deep: #7A5C24;
  --color-ink: #2A1A14;
  --color-ink-soft: #5C4A40;
  --font-display: "Cinzel", Georgia, serif;
  --font-serif: "Cormorant Garamond", Georgia, serif;
  --font-sans: "Inter", system-ui, sans-serif;
}

@layer base {
  html { background: var(--color-cream); color: var(--color-ink); scroll-behavior: smooth; }
  body { font-family: var(--font-sans); line-height: 1.65; }
  h1, h2 { font-family: var(--font-display); color: var(--color-maroon); letter-spacing: .02em; line-height: 1.15; }
  h3 { font-family: var(--font-serif); font-weight: 600; color: var(--color-maroon); }
  :focus-visible { outline: 2px solid var(--color-maroon); outline-offset: 3px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; } }
}

@layer components {
  .container-site { max-width: 1200px; margin-inline: auto; padding-inline: 1rem; }
  @media (min-width: 768px) { .container-site { padding-inline: 2rem; } }
  .section { padding-block: 4rem; }
  @media (min-width: 1024px) { .section { padding-block: 6rem; } }
  .eyebrow { font-family: var(--font-display); font-size: .8rem; letter-spacing: .25em; text-transform: uppercase; color: var(--color-gold-deep); font-weight: 500; }
  .card { background: var(--color-ivory); border: 1px solid var(--color-gold); border-radius: 6px; transition: transform .2s ease-out, box-shadow .2s ease-out; }
  .card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgb(110 12 22 / .08); }
}
```

- [ ] **Step 5:** `vitest.config.ts`: `export default { test: { include: ['tests/**/*.test.ts'] } }` (use `defineConfig` from `vitest/config`). Add scripts: `"test": "vitest run"`, `"check": "astro check"`, `"placeholders": "node scripts/placeholders.mjs"`.
- [ ] **Step 6:** Copy `brand/logo-original.webp` → `public/logo.webp`. Replace `src/pages/index.astro` with a stub importing `global.css` showing `<h1 class="text-maroon">Mithai Palace</h1>`.
- [ ] **Step 7:** Run `npm run build` → expect success and `dist/index.html` present. Commit "chore: scaffold Astro + Tailwind with brand tokens".

### Task 2: Data files + helpers (TDD)

**Files:** Create `src/data/tba.ts`, `src/data/site.ts`, `src/data/menu.ts`, `src/data/boxes.ts`, `src/lib/format.ts`, `src/lib/seo.ts`, `scripts/placeholders.mjs`; Test `tests/format.test.ts`, `tests/seo.test.ts`, `tests/data.test.ts`

**Produces:**
- `TBA: 'TBA'`, `type Maybe<T> = T | typeof TBA`, `isTBA(v: unknown): v is 'TBA'`
- `site: Site` with `name, tagline, address {line1, suburb, state, postcode: Maybe<string>, confirmed: boolean}, phone: Maybe<string>, whatsapp: Maybe<string> (intl digits), email: Maybe<string>, hours: Maybe<{days: string; open: string}[]>, socials: {label; url}[], mapQuery: string, formEndpoint: Maybe<string>, promises: {title; text; confirmed: boolean}[]`
- `menu: MenuCategory[]` = `{ id, name, blurb, items: MenuItem[] }`, `MenuItem = { name, description, price: Maybe<number>, unit: 'kg' | 'piece' | '500 g' | 'box', featured?: boolean, image?: string }`; `featuredItems(): MenuItem[]`
- `boxSizes: BoxSize[]` = `{ name, weight, serves, price: Maybe<number> }`; `festivals: Festival[]` = `{ id, name, blurb, active: boolean }`
- `priceLabel(price: Maybe<number>, unit: string): string` → `"$38.00 / kg"` or `"Call for price"`
- `hoursRows(hours: Site['hours']): {days: string; open: string}[]` → `[{days:'Opening hours', open:'Coming soon'}]` when TBA
- `telHref(phone: Maybe<string>): string | null` (strips spaces → `tel:+61…`), `whatsappHref(num: Maybe<string>, text?: string): string | null` (`https://wa.me/<digits>?text=…`), `mailHref(email: Maybe<string>): string | null`
- `fullAddress(site): string`, `mapEmbedUrl(site): string` (`https://maps.google.com/maps?q=<encoded>&output=embed`)
- `localBusinessJsonLd(site, url: string): object` — `@type: "Bakery"`, omits telephone/email/openingHours when TBA.

- [ ] **Step 1: Write failing tests** `tests/format.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { TBA } from '../src/data/tba';
import { priceLabel, hoursRows, telHref, whatsappHref, mailHref } from '../src/lib/format';

describe('priceLabel', () => {
  it('formats a number with unit', () => expect(priceLabel(38, 'kg')).toBe('$38.00 / kg'));
  it('shows call for price when TBA', () => expect(priceLabel(TBA, 'kg')).toBe('Call for price'));
});
describe('hoursRows', () => {
  it('placeholder when TBA', () => expect(hoursRows(TBA)).toEqual([{ days: 'Opening hours', open: 'Coming soon' }]));
  it('passes real rows through', () => expect(hoursRows([{ days: 'Mon–Fri', open: '9am–7pm' }])).toEqual([{ days: 'Mon–Fri', open: '9am–7pm' }]));
});
describe('contact links', () => {
  it('tel strips spaces', () => expect(telHref('+61 2 9000 0000')).toBe('tel:+61290000000'));
  it('tel null when TBA', () => expect(telHref(TBA)).toBeNull());
  it('whatsapp encodes text', () => expect(whatsappHref('61400000000', 'Hi there')).toBe('https://wa.me/61400000000?text=Hi%20there'));
  it('whatsapp null when TBA', () => expect(whatsappHref(TBA)).toBeNull());
  it('mail', () => expect(mailHref('a@b.com')).toBe('mailto:a@b.com'));
  it('mail null when TBA', () => expect(mailHref(TBA)).toBeNull());
});
```

`tests/seo.test.ts`:

```ts
import { it, expect } from 'vitest';
import { site } from '../src/data/site';
import { localBusinessJsonLd } from '../src/lib/seo';

it('builds Bakery JSON-LD without TBA fields', () => {
  const ld = localBusinessJsonLd({ ...site, phone: 'TBA', email: 'TBA', hours: 'TBA' }, 'https://x.test/');
  expect(ld['@type']).toBe('Bakery');
  expect(ld.name).toBe('Mithai Palace');
  expect(ld.address.streetAddress).toContain('Railway Road');
  expect(ld).not.toHaveProperty('telephone');
  expect(ld).not.toHaveProperty('email');
  expect(JSON.stringify(ld)).not.toContain('TBA');
});
it('includes telephone when known', () => {
  const ld = localBusinessJsonLd({ ...site, phone: '+61 2 9000 0000' }, 'https://x.test/');
  expect(ld.telephone).toBe('+61 2 9000 0000');
});
```

`tests/data.test.ts`:

```ts
import { it, expect } from 'vitest';
import { menu, featuredItems } from '../src/data/menu';
import { festivals, boxSizes } from '../src/data/boxes';

it('menu has the five agreed categories', () =>
  expect(menu.map(c => c.id)).toEqual(['barfi', 'ladoo', 'halwa', 'milk-sweets', 'namkeen']));
it('every category has items', () => menu.forEach(c => expect(c.items.length).toBeGreaterThan(0)));
it('6–8 featured items', () => { const n = featuredItems().length; expect(n).toBeGreaterThanOrEqual(6); expect(n).toBeLessThanOrEqual(8); });
it('three box sizes', () => expect(boxSizes.map(b => b.weight)).toEqual(['250 g', '500 g', '1 kg']));
it('festivals present', () => expect(festivals.map(f => f.id)).toEqual(['diwali', 'eid', 'raksha-bandhan', 'weddings']));
```

- [ ] **Step 2:** `npm test` → FAIL (modules missing).
- [ ] **Step 3: Implement** data files with placeholder values (`price: TBA` everywhere; phone/whatsapp/email/hours/postcode/formEndpoint `TBA`; `address.confirmed: false`; promises `Made fresh in our kitchen` / `Traditional family recipes` / `Gift boxes for every occasion` / `Catering for events` all `confirmed: false` except none — render only claims that are plausible for any sweet shop and flag with `confirmed`). Menu items (names are standard mithai, descriptions factual about the sweet, not the shop):
  - barfi: Kaju Katli★, Plain Milk Barfi, Pista Barfi, Coconut Barfi, Besan Barfi
  - ladoo: Motichoor Ladoo★, Besan Ladoo★, Coconut Ladoo, Dry Fruit Ladoo
  - halwa: Gajar Halwa★, Moong Dal Halwa, Sooji Halwa
  - milk-sweets: Gulab Jamun★, Rasgulla★, Rasmalai★, Kalakand, Milk Cake
  - namkeen: Samosa, Kachori, Mixture (Namkeen), Bhujia
  (★ = featured → 8). `featuredItems = () => menu.flatMap(c => c.items).filter(i => i.featured)`.
  Implement `format.ts` and `seo.ts` per the Produces signatures. `scripts/placeholders.mjs`: read every file in `src/data`, print `file:line` for lines containing `TBA` (excluding `tba.ts`) plus `confirmed: false`, exit 0.
- [ ] **Step 4:** `npm test` → all PASS. `npm run placeholders` prints a list.
- [ ] **Step 5:** Commit "feat: content data files and formatting/SEO helpers".

### Task 3: Brand components + layout shell

**Files:** Create `src/components/{PetalMark,ArchFrame,PetalDivider,SectionHeading,Button,CtaButtons,PlaceholderImage,Header,Footer}.astro`, `src/layouts/Layout.astro`, `public/favicon.svg`, `public/robots.txt`

**Interfaces:**
- `PetalMark` props `{ size?: number; class?: string }` — inline SVG: four maroon teardrop petals rotated 0/90/180/270 around centre, each with gold stroke, gold centre dot; `aria-hidden`.
- `ArchFrame` props `{ class?: string }` — wraps `<slot/>` in a div clipped with an SVG `clipPath` (objectBoundingBox) of the scalloped arch (pointed top, two scallops each side, straight sides), plus an absolutely positioned SVG outline of the same path in gold (1.5px) and an inner maroon hairline.
- `PetalDivider` — `<div role="presentation">` flex: gold 1px line · small gold dot · PetalMark 28 · dot · line.
- `SectionHeading` props `{ eyebrow: string; title: string; lead?: string; align?: 'center'|'left' }`.
- `Button` props `{ href: string; variant?: 'primary'|'secondary'; class?: string }` — styles per DESIGN.md §4.
- `CtaButtons` props `{ enquiryLabel?: string; align? }` — renders Call (if `telHref`), WhatsApp (if `whatsappHref`), and always "Send an order enquiry" → `/contact`. When phone is TBA, shows secondary "Visit us" → `/#visit` instead of Call.
- `PlaceholderImage` props `{ label: string; aspect?: string }` — ivory panel, faint gold diagonal lattice (CSS repeating-linear-gradient at 6% opacity), PetalMark, Cormorant italic label, `role="img" aria-label="Photo coming soon: {label}"`.
- `Layout` props `{ title: string; description: string }` — sets `<title>{title} | Mithai Palace</title>` (home: "Mithai Palace — Traditionally Sweet"), meta description, OG tags (image `/logo.webp`), canonical, preconnect + Google Fonts link (Cinzel 500–700, Cormorant Garamond 500/600 + italic, Inter 400–600), JSON-LD script, skip link, Header, `<main id="main">`, Footer.
- `Header`: sticky cream bar; left logo lockup (small cropped logo image 44px tall + "MITHAI PALACE" Cinzel maroon, "Traditionally Sweet" eyebrow on ≥sm); nav links Home/Menu/Gift Boxes/Catering/About/Contact with `aria-current` on active; maroon "Order enquiry" Button; mobile `<button aria-expanded aria-controls>` toggling a full-width cream panel (tiny inline script); gold hairline shows when `scrollY > 8` (class toggle).
- `Footer`: maroon bg, cream text: logo name + tagline, address (+ "address to be confirmed" note when `!confirmed`), hours via `hoursRows`, contact links (only non-TBA), quick links, socials (if any), © year.

- [ ] **Step 1:** Implement components & layout; wire stub home page through Layout.
- [ ] **Step 2:** `npm run build` passes; `npm run check` has 0 errors.
- [ ] **Step 3:** Run dev server, screenshot at 375px and 1280px: header, mobile menu open, footer. Fix any overflow.
- [ ] **Step 4:** Commit "feat: brand components and site layout".

### Task 4: Home page

**Files:** Create `src/components/{SweetCard,BoxCard,PromiseStrip,VisitUs}.astro`; Modify `src/pages/index.astro`

**Interfaces:** `SweetCard {item: MenuItem}` (PlaceholderImage when no image, name h3, description, `priceLabel`). `BoxCard {box: BoxSize}`. `PromiseStrip {promises}` (4 columns ≥lg, 2 ≥sm; gold line icons: leaf/hands/gift/users as inline SVG). `VisitUs` (id="visit": address, hours, CtaButtons, lazy Google map iframe with title).

Sections in order: **Hero** (cream, two-column ≥lg: left eyebrow "Indian Sweet House · North Mulgrave", H1 "Traditionally Sweet", Cormorant lead "Handcrafted mithai and festive gift boxes, made the way families have made them for generations.", CtaButtons; right: ArchFrame containing the logo image on ivory) → PromiseStrip → PetalDivider → **Featured sweets** (SectionHeading "From our kitchen" / "Favourite Sweets", 4-col grid of featuredItems, "See the full menu" secondary button) → **Festival boxes** (ivory band, SectionHeading "For every celebration" / "Gift Boxes", 3 BoxCards, active festival chips, button → /gift-boxes) → **Catering teaser** (maroon band, cream text, "Weddings, parties & corporate gifting", button "Request a quote" → /contact?type=catering) → **Story teaser** (ArchFrame PlaceholderImage "Our kitchen" + text + link /about) → VisitUs.

- [ ] **Step 1:** Implement; **Step 2:** build + check pass; **Step 3:** screenshot 375 / 768 / 1280, fix issues; **Step 4:** commit "feat: home page".

### Task 5: Menu and Gift Boxes pages

**Files:** Create `src/pages/menu.astro`, `src/pages/gift-boxes.astro`

- Menu: page hero (eyebrow "Our Menu", H1 "Sweets & Savouries", lead + note "Prices are per kg unless stated. Call us for today's selection."), sticky horizontal category jump bar (scrollable on phone, anchors `#barfi`…), one section per category (SectionHeading with category blurb, SweetCard grid), closing CtaButtons.
- Gift boxes: hero; box sizes grid (BoxCards with serves text); "Festival specials" — one alternating row per **active** festival (ArchFrame PlaceholderImage + name + blurb + CtaButtons with enquiryLabel "Enquire about {festival}"); custom box note ("Build your own box — choose any sweets from the menu").
- [ ] Build + check pass; screenshots 375/1280; commit "feat: menu and gift boxes pages".

### Task 6: Catering, About, Contact, 404 pages + enquiry form

**Files:** Create `src/components/EnquiryForm.astro`, `src/pages/{catering,about,contact,404}.astro`

- `EnquiryForm`: `<form method="POST" action={formEndpoint or '#'}>` fields: name*, phone*, email, enquiry type select (Order / Gift boxes / Catering / Corporate / Other; preselect from `?type=` via tiny script), date needed (date input), pickup or delivery (radio), items/message* (textarea), hidden honeypot `_gotcha`. Labels above fields, required marked with text "(required)". When `formEndpoint` is TBA: render form disabled-submit with a visible notice "Online enquiries open soon — please call or WhatsApp us" and CtaButtons, and `submit` handler prevents send. Native validation + `aria-describedby` errors.
- Catering: hero; 4 service cards (Weddings & engagements, Parties & celebrations, Corporate gifting, Bulk & festival orders); "How it works" 3 steps (Enquire → We plan the menu and quote → Fresh on the day); CTA to `/contact?type=catering`.
- About: hero; story in ArchFrame + text (placeholder copy clearly written as editable, no fake years/names: "Mithai Palace brings the sweets of Indian celebrations to North Mulgrave…"); "How we make our sweets" 3 points (milk reduced slowly, sweets finished by hand, made in small batches — worded as intentions to confirm, listed in placeholders report via `confirmed:false` in `site.promises`-like `about.ts`? → keep text in page, add `<!-- CONFIRM -->` markers counted by placeholders script).
- Contact: two columns ≥lg: EnquiryForm | contact card (CtaButtons, address, hours) ; VisitUs map below.
- 404: centered PetalMark, H1 "This page has melted away", links Home / Menu.
- [ ] Build + check pass; screenshots; test form keyboard flow; commit "feat: catering, about, contact and 404 pages".

### Task 7: Build test, SEO assets, README, final review

**Files:** Create `tests/build.test.ts`, `public/robots.txt`, `README.md`; Modify `scripts/placeholders.mjs` (also count `CONFIRM` markers in `src/pages`)

`tests/build.test.ts` (runs against `dist/`, requires `npm run build` first; skip suite with message if dist missing):

```ts
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const pages: Record<string, string[]> = {
  'index.html': ['Traditionally Sweet', 'Favourite Sweets', 'Gift Boxes'],
  'menu/index.html': ['Kaju Katli', 'Gulab Jamun', 'Samosa'],
  'gift-boxes/index.html': ['500 g', 'Diwali'],
  'catering/index.html': ['Weddings'],
  'about/index.html': ['North Mulgrave'],
  'contact/index.html': ['name="name"', 'Railway Road'],
  '404.html': ['melted away'],
};
describe.skipIf(!existsSync('dist'))('built site', () => {
  for (const [file, needles] of Object.entries(pages)) {
    it(`${file} has key content`, () => {
      const html = readFileSync(`dist/${file}`, 'utf8');
      for (const n of needles) expect(html).toContain(n);
      expect(html).not.toMatch(/>\s*TBA\s*</);
      expect(html).toContain('application/ld+json');
    });
  }
  it('sitemap generated', () => expect(existsSync('dist/sitemap-index.xml')).toBe(true));
});
```

README: what the site is; `npm install`, `npm run dev` (http://localhost:4321), `npm run build`, `npm test`; **How to edit**: shop details in `src/data/site.ts`, prices in `src/data/menu.ts`, boxes/festivals in `src/data/boxes.ts` (toggle `active`), photos go in `public/images/` and set `image: '/images/x.jpg'`; `npm run placeholders` = pre-launch checklist; brand rules → DESIGN.md; hosting: "to be decided".

- [ ] **Step 1:** Write test; `npm run build && npm test` → all PASS (fix failures).
- [ ] **Step 2:** Full visual review of all 7 routes at 375 and 1280 in the browser; fix issues; verify no horizontal scroll (`document.documentElement.scrollWidth <= innerWidth`).
- [ ] **Step 3:** Write README; `npm run placeholders` output pasted into README "Before launch" section.
- [ ] **Step 4:** Commit "test: build checks, README and SEO assets".
