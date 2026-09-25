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
  expect(ld).not.toHaveProperty('openingHours');
  expect(JSON.stringify(ld)).not.toContain('TBA');
});

it('includes telephone when known', () => {
  const ld = localBusinessJsonLd({ ...site, phone: '+61 2 9000 0000' }, 'https://x.test/');
  expect(ld.telephone).toBe('+61 2 9000 0000');
});
