import { it, expect } from 'vitest';
import { menu, featuredItems } from '../src/data/menu';
import { festivals, boxSizes } from '../src/data/boxes';

it('menu has the seven agreed categories', () =>
  expect(menu.map(c => c.id)).toEqual([
    'kaju-katli', 'kaju-creations', 'gourmet-bites', 'classic-sweets', 'milk-syrup-sweets', 'wholesome-treats', 'namkeen',
  ]));

it('every category has items', () => menu.forEach(c => expect(c.items.length).toBeGreaterThan(0)));

it('has all 25 products', () => expect(menu.flatMap(c => c.items).length).toBe(25));

it('has 6–8 featured items', () => {
  const n = featuredItems().length;
  expect(n).toBeGreaterThanOrEqual(6);
  expect(n).toBeLessThanOrEqual(8);
});

it('drops trademarked names', () => {
  const names = menu.flatMap(c => c.items).map(i => i.name);
  expect(names).not.toContain('Kaju Nutella Crunch');
  expect(names).not.toContain('Kaju Briscoff');
  expect(names).toContain('Kaju Hazelnut Chocolate Crunch');
  expect(names).toContain('Kaju Caramel Biscuit');
});

it('does not claim "sugar free" until confirmed', () => {
  const text = menu.flatMap(c => c.items).map(i => i.name + ' ' + i.description).join(' ');
  expect(text.toLowerCase()).not.toContain('sugar free');
  expect(text.toLowerCase()).not.toContain('sugar-free');
});

it('has three box sizes', () => expect(boxSizes.map(b => b.weight)).toEqual(['250 g', '500 g', '1 kg']));

it('has the agreed festivals', () =>
  expect(festivals.map(f => f.id)).toEqual(['diwali', 'eid', 'raksha-bandhan', 'weddings']));
