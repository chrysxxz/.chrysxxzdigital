import { config } from '../data/config.js';
import { images, imgUrl } from '../data/images.js';

/** Schema.org PetStore (subtipo de LocalBusiness) gerado a partir da configuração. */
export function localBusinessSchema() {
  const { brand, site, contact, address, hours } = config;
  return {
    '@context': 'https://schema.org',
    '@type': 'PetStore',
    name: brand.name,
    description: site.description,
    url: site.url,
    image: imgUrl(images.hero.src, 1200),
    telephone: `+${contact.whatsapp}`,
    email: contact.email,
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.state,
      postalCode: address.zip,
      addressCountry: address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: address.geo.lat, longitude: address.geo.lng },
    openingHours: hours.map((h) => h.schema).filter(Boolean),
    sameAs: [contact.instagramUrl],
  };
}
