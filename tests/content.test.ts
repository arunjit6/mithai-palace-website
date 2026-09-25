import { it, expect } from 'vitest';
import { site } from '../src/data/site';
import { festivalBanner, boxSizes } from '../src/data/boxes';
import { menu } from '../src/data/menu';
import { reviews, googleReviewsUrl } from '../src/data/reviews';
import { showReviews, visibleAnnouncement } from '../src/lib/content';
import { TBA } from '../src/data/tba';

it('announcement is ready but switched off', () => {
  expect(site.announcement.active).toBe(false);
  expect(site.announcement.text).toMatch(/Diwali/);
  expect(visibleAnnouncement(site.announcement)).toBeNull();
  expect(visibleAnnouncement({ ...site.announcement, active: true })?.text).toMatch(/Diwali/);
});

it('festival banner is ready but switched off', () => {
  expect(festivalBanner.active).toBe(false);
  expect(festivalBanner.festivalId).toBe('diwali');
});

it('every box has a "for whom" guide', () =>
  boxSizes.forEach(b => expect(b.forWhom.length).toBeGreaterThan(3)));

it('badges use the allowed labels only', () => {
  const allowed = ['Best seller', 'New', 'Festival special'];
  menu.flatMap(c => c.items).forEach(i => { if (i.badge) expect(allowed).toContain(i.badge); });
});

it('reviews stay hidden until real ones exist', () => {
  expect(reviews).toEqual([]);
  expect(showReviews([], TBA)).toBe(false);
  expect(showReviews([], 'https://g.page/r/x')).toBe(true);
  expect(showReviews([{ name: 'A', date: 'Oct 2026', text: 'Lovely' }], TBA)).toBe(true);
  expect(googleReviewsUrl).toBe(TBA);
});
