import { it, expect } from 'vitest';
import { slug, findPhoto } from '../src/lib/photos';

it('slugs names for photo files', () => {
  expect(slug('Kaju Katli')).toBe('kaju-katli');
  expect(slug('Namkeen & Snacks')).toBe('namkeen-snacks');
  expect(slug('  Milk Cake ')).toBe('milk-cake');
});

it('returns undefined when no photo has been added', () => {
  expect(findPhoto('hero-that-does-not-exist')).toBeUndefined();
});
