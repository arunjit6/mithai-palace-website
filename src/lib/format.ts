import { isTBA, type Maybe } from '../data/tba';
import type { HoursRow, Site } from '../data/site';

const aud = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

export const priceLabel = (price: Maybe<number>, unit: string): string =>
  isTBA(price) ? 'Call for price' : `${aud.format(price)} / ${unit}`;

export const hoursRows = (hours: Site['hours']): HoursRow[] =>
  isTBA(hours) ? [{ days: 'Opening hours', open: 'Coming soon' }] : hours;

export const telHref = (phone: Maybe<string>): string | null =>
  isTBA(phone) ? null : `tel:${phone.replace(/[^\d+]/g, '')}`;

export const whatsappHref = (num: Maybe<string>, text?: string): string | null => {
  if (isTBA(num)) return null;
  const base = `https://wa.me/${num.replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
};

export const mailHref = (email: Maybe<string>): string | null => (isTBA(email) ? null : `mailto:${email}`);

export const fullAddress = (site: Site): string => {
  const { line1, suburb, state, postcode } = site.address;
  return `${line1}, ${suburb} ${state}${isTBA(postcode) ? '' : ` ${postcode}`}`;
};

const mapQuery = (site: Site) => encodeURIComponent(`${site.name}, ${fullAddress(site)}`);

export const mapEmbedUrl = (site: Site): string => `https://maps.google.com/maps?q=${mapQuery(site)}&output=embed`;

export const mapLinkUrl = (site: Site): string => `https://www.google.com/maps/search/?api=1&query=${mapQuery(site)}`;
