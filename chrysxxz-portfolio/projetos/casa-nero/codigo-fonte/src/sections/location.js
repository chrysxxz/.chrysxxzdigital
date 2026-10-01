import { RESTAURANT } from '../data/restaurant.js';
import { ICONS } from '../ui/icons.js';
import { waHref } from './chrome.js';
import { esc, openStatus } from '../core/utils.js';

export function Location() {
  const today = new Date().getDay();
  const rowDay = [1, [2, 3, 4], 5, 6, 0];
  const st = openStatus();
  return `<section class="sec visit" id="visite">
    <div class="wrap visit__grid">
      <div class="visit__info">
        <p class="mono reveal">07 · Visite</p>
        <h2 class="h2 reveal">Alameda das<br>Brasas, 000.</h2>
        <p class="visit__addr reveal">${esc(RESTAURANT.district)} · CEP ${esc(RESTAURANT.zip)}<br><small>Endereço fictício para demonstração</small></p>
        <div class="visit__status reveal"><span class="status ${st.open ? 'is-open' : ''}"><i></i>${esc(st.text)}</span></div>
        <dl class="hours reveal">${RESTAURANT.hoursLabel.map(([d, h], i) => { const days = [].concat(rowDay[i]); return `<div class="${days.includes(today) ? 'is-today' : ''}"><dt>${esc(d)}${days.includes(today) ? ' <em>hoje</em>' : ''}</dt><dd>${esc(h)}</dd></div>`; }).join('')}</dl>
        <div class="visit__ctas reveal">
          <a class="btn btn--ember" href="#reservas">Reservar mesa ${ICONS.arrow}</a>
          <a class="btn btn--line-l" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp} ${esc(RESTAURANT.whatsappDisplay)}</a>
          <a class="btn btn--line-l" href="${RESTAURANT.mapsUrl}" target="_blank" rel="noopener">${ICONS.pin} Como chegar</a>
        </div>
      </div>
      <div class="map reveal" aria-label="Mapa ilustrativo">
        <svg viewBox="0 0 500 560" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="500" height="560" fill="#1b1917"/>
          <g fill="none" stroke="#35312d" stroke-linecap="round"><path d="M-10 250 C 120 230, 260 290, 520 240" stroke-width="18"/><path d="M230 -10 L 270 580" stroke-width="14"/><path d="M-10 90 L 520 130" stroke-width="6"/><path d="M-10 420 L 520 470" stroke-width="6"/><path d="M90 -10 L 60 580" stroke-width="4"/><path d="M400 -10 L 430 580" stroke-width="4"/><path d="M-10 340 L 520 320" stroke-width="3"/></g>
          <g fill="#23201d"><rect x="300" y="300" width="90" height="100" rx="8"/><rect x="110" y="120" width="100" height="90" rx="8"/><circle cx="360" cy="170" r="42"/></g>
          <g transform="translate(262 246)"><circle r="46" fill="#b5461f" opacity=".12"/><circle r="22" fill="#b5461f" opacity=".25"/><circle r="8" fill="#b5461f"/></g>
          <text x="282" y="236" fill="#eee9e0" font-family="IBM Plex Mono, monospace" font-size="12" letter-spacing="2">CASA NERO</text>
        </svg>
        <span class="map__tag mono">Mapa ilustrativo</span>
      </div>
    </div>
  </section>`;
}
