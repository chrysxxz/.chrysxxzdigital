/**
 * CASA NERO — site demonstrativo (portfólio Chrysxxz Digital).
 * Monta a página e liga as interações.
 */
import { Header, Footer } from './sections/chrome.js';
import { Hero } from './sections/hero.js';
import { About } from './sections/about.js';
import { Featured } from './sections/featured.js';
import { Menu } from './sections/menu.js';
import { Experience } from './sections/experience.js';
import { Gallery } from './sections/gallery.js';
import { Reservation } from './sections/reservation.js';
import { Location } from './sections/location.js';
import { initChrome, initReveal, initHero, initFeatured, initMenu } from './behaviors/ui.js';
import { initBooking } from './behaviors/booking.js';

document.getElementById('app').innerHTML = [
  '<a class="skip" href="#main">Pular para o conteúdo</a>', Header(), '<main id="main">',
  Hero(), About(), Featured(), Menu(), Experience(), Gallery(), Reservation(), Location(),
  '</main>', Footer(),
].join('\n');

initChrome(); initReveal(); initHero(); initFeatured(); initMenu(); initBooking();
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add('is-ready')));
