import { describe, it, expect } from 'vitest';
import { TBA } from '../src/data/tba';
import { priceLabel, hoursRows, telHref, whatsappHref, mailHref } from '../src/lib/format';

describe('priceLabel', () => {
  it('formats a number with unit', () => expect(priceLabel(38, 'kg')).toBe('$38.00 / kg'));
  it('shows call for price when TBA', () => expect(priceLabel(TBA, 'kg')).toBe('Call for price'));
});

describe('hoursRows', () => {
  it('placeholder when TBA', () =>
    expect(hoursRows(TBA)).toEqual([{ days: 'Opening hours', open: 'Coming soon' }]));
  it('passes real rows through', () =>
    expect(hoursRows([{ days: 'Mon–Fri', open: '9am–7pm' }])).toEqual([{ days: 'Mon–Fri', open: '9am–7pm' }]));
});

describe('contact links', () => {
  it('tel strips spaces', () => expect(telHref('+61 2 9000 0000')).toBe('tel:+61290000000'));
  it('tel null when TBA', () => expect(telHref(TBA)).toBeNull());
  it('whatsapp encodes text', () =>
    expect(whatsappHref('61400000000', 'Hi there')).toBe('https://wa.me/61400000000?text=Hi%20there'));
  it('whatsapp strips non-digits', () => expect(whatsappHref('+61 400 000 000')).toBe('https://wa.me/61400000000'));
  it('whatsapp null when TBA', () => expect(whatsappHref(TBA)).toBeNull());
  it('mail', () => expect(mailHref('a@b.com')).toBe('mailto:a@b.com'));
  it('mail null when TBA', () => expect(mailHref(TBA)).toBeNull());
});
