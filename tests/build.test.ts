// Checks the built site in dist/. Run `npm run build` first (or `npm run verify`).
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

const pages: Record<string, string[]> = {
  'index.html': ['Handcrafted Indian Sweets', 'Sweets by Category', 'href="/menu#ladoo"', 'Favourite Sweets', 'Festival special',
    'Festival Orders', 'Which box, for whom?', 'For neighbours', 'Sweets for Every Occasion', 'Visit the Shop'],
  'menu/index.html': ['Kaju Katli', 'Gulab Jamun', 'Samosa', 'id="namkeen"'],
  'gift-boxes/index.html': ['500 g', 'Diwali', 'Raksha Bandhan'],
  'catering/index.html': ['Weddings &amp; Engagements', '/contact?type=catering'],
  'about/index.html': ['North Mulgrave', 'How We Make Our Sweets'],
  'contact/index.html': ['name="name"', 'name="phone"', 'name="_gotcha"', 'Railway Road'],
  '404.html': ['Melted Away'],
};

describe.skipIf(!existsSync('dist'))('built site', () => {
  for (const [file, needles] of Object.entries(pages)) {
    it(`${file} has its key content`, () => {
      const html = readFileSync(`dist/${file}`, 'utf8');
      for (const n of needles) expect(html).toContain(n);
      expect(html, 'raw TBA leaked into the page').not.toMatch(/>\s*TBA\s*</);
      expect(html).toContain('application/ld+json');
      expect(html).toMatch(/<title>[^<]*Mithai Palace[^<]*<\/title>/);
      expect(html).toContain('<meta name="description"');
    });
  }

  it('every internal link points to a built page', () => {
    const built = new Set(['/', ...Object.keys(pages).map(f => '/' + f.replace(/(index)?\.html$/, '').replace(/\/$/, ''))]);
    for (const file of Object.keys(pages)) {
      const html = readFileSync(`dist/${file}`, 'utf8');
      for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
        if (/\.(webp|svg|xml|css|js|png|jpg)$/.test(href) || href.startsWith('/_astro')) continue;
        expect(built.has(href.replace(/\/$/, '') || '/'), `${file} links to missing ${href}`).toBe(true);
      }
    }
  });

  it('switched-off and empty sections stay hidden', () => {
    const home = readFileSync('dist/index.html', 'utf8');
    expect(home).not.toContain('aria-label="Announcement"');
    expect(home).not.toContain('id="festival-banner"');
    expect(home).not.toContain('Sweet Words from Our Customers');
  });

  it('generates a sitemap', () => expect(existsSync('dist/sitemap-index.xml')).toBe(true));
});
