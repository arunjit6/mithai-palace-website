import { isTBA } from '../data/tba';
import type { Site } from '../data/site';

/** schema.org LocalBusiness data so search engines can show address and hours. TBA fields are left out. */
export function localBusinessJsonLd(site: Site, url: string) {
  const { line1, suburb, state, postcode } = site.address;
  return {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url,
    image: new URL('/logo.webp', url).href,
    servesCuisine: 'Indian sweets',
    address: {
      '@type': 'PostalAddress',
      streetAddress: line1,
      addressLocality: suburb,
      addressRegion: state,
      addressCountry: 'AU',
      ...(isTBA(postcode) ? {} : { postalCode: postcode }),
    },
    ...(isTBA(site.phone) ? {} : { telephone: site.phone }),
    ...(isTBA(site.email) ? {} : { email: site.email }),
    ...(isTBA(site.hours) ? {} : { openingHours: site.hours.map(h => `${h.days} ${h.open}`) }),
    ...(site.socials.length ? { sameAs: site.socials.map(s => s.url) } : {}),
  };
}
