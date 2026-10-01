import { trust } from '../data/content.js';
import { icons } from '../components/icons.js';
import { esc } from '../lib/html.js';

export function Trust() {
  return `<section class="sec trust" aria-labelledby="trust-t">
    <div class="wrap trust__grid">
      <div class="trust__head" data-reveal>
        <h2 class="trust__title" id="trust-t">${esc(trust.title)}</h2>
        <p class="trust__text">${esc(trust.text)}</p>
      </div>
      <ul class="trust__list">
        ${trust.items.map((it, i) => `<li class="trust__item" data-reveal style="--d:${0.08 * i}s">
          <span class="trust__ic">${icons[it.icon]}</span>
          <h3>${esc(it.title)}</h3>
          <p>${esc(it.text)}</p>
        </li>`).join('')}
      </ul>
    </div>
  </section>`;
}
