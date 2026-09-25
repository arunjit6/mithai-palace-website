import { it, expect } from 'vitest';
import { menu, featuredItems } from '../src/data/menu';
import { festivals, boxSizes } from '../src/data/boxes';

it('menu has the five agreed categories', () =>
  expect(menu.map(c => c.id)).toEqual(['barfi', 'ladoo', 'halwa', 'milk-sweets', 'namkeen']));

it('every category has items', () => menu.forEach(c => expect(c.items.length).toBeGreaterThan(0)));

it('has 6–8 featured items', () => {
  const n = featuredItems().length;
  expect(n).toBeGreaterThanOrEqual(6);
  expect(n).toBeLessThanOrEqual(8);
});

it('has three box sizes', () => expect(boxSizes.map(b => b.weight)).toEqual(['250 g', '500 g', '1 kg']));

it('has the agreed festivals', () =>
  expect(festivals.map(f => f.id)).toEqual(['diwali', 'eid', 'raksha-bandhan', 'weddings']));
