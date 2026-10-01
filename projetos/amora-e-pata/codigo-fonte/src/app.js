/** Composição da página (função pura: roda no navegador e no build com Node). */
import { Header } from './sections/Header.js';
import { Hero } from './sections/Hero.js';
import { Trust } from './sections/Trust.js';
import { Services } from './sections/Services.js';
import { Experience } from './sections/Experience.js';
import { Gallery } from './sections/Gallery.js';
import { BeforeAfter } from './sections/BeforeAfter.js';
import { Testimonials } from './sections/Testimonials.js';
import { Booking } from './sections/Booking.js';
import { Location } from './sections/Location.js';
import { Footer } from './sections/Footer.js';
import { MobileCta } from './sections/MobileCta.js';

export function renderApp() {
  return [
    '<a class="skip" href="#main">Pular para o conteúdo</a>',
    Header(),
    '<main id="main">',
    Hero(), Trust(), Services(), Experience(), Gallery(), BeforeAfter(), Testimonials(), Booking(), Location(),
    '</main>',
    Footer(),
    MobileCta(),
  ].join('\n');
}
