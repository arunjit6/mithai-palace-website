# Mithai Palace Website

Showcase website for **Mithai Palace** ("Traditionally Sweet"), an Indian sweet shop
in North Mulgrave, NSW. Built with [Astro](https://astro.build) and Tailwind CSS, styled
by [`DESIGN.md`](DESIGN.md), the brand guide derived from the logo.

Pages: Home · Menu · Gift Boxes & Festivals · Catering & Events · About · Contact / Order enquiry · 404.
There is no online checkout. Customers call, WhatsApp, visit, or send an enquiry.

## Run it on your computer

You need [Node.js](https://nodejs.org) 22 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:4321. Pages reload as you edit.

| Command | What it does |
|---|---|
| `npm run dev` | Local preview while editing |
| `npm run build` | Builds the finished site into `dist/` |
| `npm run preview` | Serves the built `dist/` folder |
| `npm run verify` | Type check + build + all tests (run before publishing) |
| `npm run placeholders` | Lists every fact still waiting for real information |

## How to edit the content

You do not need to touch the page designs. Everything the shop changes lives in `src/data/`:

| What | File | Notes |
|---|---|---|
| Address, phone, WhatsApp, email, hours, social links, enquiry form | `src/data/site.ts` | Replace each `TBA` with the real value. Set `address.confirmed: true` once the address is checked. |
| Sweets and prices | `src/data/menu.ts` | `price: TBA` shows "Call for price"; `price: 38` shows "$38.00 / kg". `featured: true` puts an item on the home page (keep 8). |
| Gift boxes and festivals | `src/data/boxes.ts` | Switch a festival on or off with `active: true / false`. |
| "Why us" promises (home page strip) | `src/data/site.ts` → `promises` | Change the wording to what is true for the shop, then set `confirmed: true`. |
| Story text | `src/pages/about.astro`, `src/pages/index.astro` | Look for the `CONFIRM` comments. |
| Announcement bar (top of every page) | `src/data/site.ts` → `announcement` | Ready with a Diwali message. Set `active: true` to show it. |
| Festival banner (home page) | `src/data/boxes.ts` → `festivalBanner` | Ready for Diwali (Sunday 8 November). Fill in `orderBy`, then set `active: true`. |
| Labels on sweets | `src/data/menu.ts` → `badge` | `'Best seller'`, `'New'` or `'Festival special'`. Remove a badge by deleting it. |
| Box guide ("for whom?") | `src/data/boxes.ts` → `forWhom` | Short phrase shown on each gift box. |
| Customer reviews | `src/data/reviews.ts` | Paste real reviews (name, month, text) and/or the Google reviews link. The section stays hidden until then. |

**Examples** (in `src/data/site.ts`):

```ts
phone: '+61 2 9000 0000',
whatsapp: '61400000000',          // international format, no + or spaces needed
email: 'hello@mithaipalace.com.au',
hours: [
  { days: 'Mon – Fri', open: '9am – 7pm' },
  { days: 'Sat – Sun', open: '9am – 8pm' },
],
socials: [{ label: 'Instagram', url: 'https://instagram.com/…' }],
```

Anything left as `TBA` is hidden or shown as a polite placeholder ("Coming soon", "Call for price"),
so the site never shows a wrong phone number or price.

### Photos

Drop photos into `src/assets/photos/` and they replace the matching stand-in automatically.
No code changes are needed. The file name decides where a photo appears:

| File name (.jpg, .png or .webp) | Where it appears |
|---|---|
| `hero` | Big banner at the top of the home page (at least 1600 px wide) |
| `gifting` | Gift banner on the home page |
| `story` | "Our story" panel on the home page |
| `category-barfi`, `category-ladoo`, `category-halwa`, `category-milk-sweets`, `category-namkeen` | Category cards |
| `sweet-kaju-katli`, `sweet-gulab-jamun`, … | Each sweet (its name in lower case, spaces become dashes) |

Until then each space shows an on-brand maroon or ivory stand-in.

### Enquiry form

The form works once it has somewhere to send messages. The easiest free option is
[Formspree](https://formspree.io): create a form, copy its URL (like `https://formspree.io/f/abcdwxyz`)
and set `formEndpoint` in `src/data/site.ts`. Until then the form explains that online enquiries
open soon.

## Before launch

`npm run placeholders` prints the full list (37 items right now). In short:

- [ ] Confirm the address and add the postcode
- [ ] Phone, WhatsApp, email
- [ ] Opening hours
- [ ] Prices for menu items and gift boxes (and check the menu list itself)
- [ ] Which promises are true (made fresh, traditional recipes, etc.)
- [ ] The owner's own story for the About and Home pages
- [ ] Photos of the sweets, the shop and the family
- [ ] Social media links
- [ ] Formspree form URL
- [ ] Real domain name: update `site` in `astro.config.mjs` and `public/robots.txt`

## Project layout

```
DESIGN.md                 brand guide (colours, fonts, components)
brand/                    original logo file
docs/superpowers/         design spec and build plan
public/brand/             logo cut-outs used on the site
src/data/                 ← all editable content
src/components/           building blocks (arch frame, cards, header, footer…)
src/pages/                one file per page
src/styles/global.css     brand colours and fonts (Tailwind @theme)
tests/                    automated checks
```

## Hosting

Not decided yet. The site builds to plain files in `dist/`, so it can go on Netlify,
Vercel, Cloudflare Pages or any web host.
