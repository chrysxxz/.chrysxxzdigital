/**
 * Amora & Pata — ponto de entrada.
 * Em desenvolvimento, a página é montada aqui a partir de /src/data.
 * No build (npm run build), o HTML já vem pré-renderizado (melhor SEO)
 * e este arquivo apenas liga as interações.
 */
import { renderApp } from './app.js';
import { localBusinessSchema } from './lib/seo.js';
import { initReveal } from './behaviors/reveal.js';
import { initHeader } from './behaviors/header.js';
import { initGallery } from './behaviors/gallery.js';
import { initBeforeAfter } from './behaviors/beforeAfter.js';
import { initBooking } from './behaviors/booking.js';
import { initMotion } from './behaviors/motion.js';

const app = document.getElementById('app');
if (!app.dataset.prerendered) app.innerHTML = renderApp();

if (!document.getElementById('ld-business')) {
  const s = document.createElement('script');
  s.type = 'application/ld+json'; s.id = 'ld-business';
  s.textContent = JSON.stringify(localBusinessSchema());
  document.head.appendChild(s);
}

initHeader();
initReveal();
initGallery();
initBeforeAfter();
initBooking();
initMotion();
requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
