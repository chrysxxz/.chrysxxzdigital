import { RESTAURANT } from '../data/restaurant.js';
import { findDish, TASTING } from '../data/menu.js';
import { Plate } from '../ui/plate.js';
import { ICONS } from '../ui/icons.js';
import { esc, brl, openStatus } from '../core/utils.js';

export function Hero() {
  const st = openStatus();
  return `<section class="hero" id="top">
    <div class="hero__plate" id="heroPlate" aria-hidden="true">
      <div class="hero__spin">${Plate(findDish('arroz').plate, { label: '' })}</div>
    </div>
    <div class="wrap hero__in">
      <div class="hero__meta hero-in" style="--d:.05s">
        <span class="status ${st.open ? 'is-open' : ''}" id="liveStatus"><i></i>${esc(st.text)}</span>
        <span class="mono">${esc(RESTAURANT.kind)} · ${esc(RESTAURANT.city)}</span>
      </div>
      <h1 class="hero__title">
        <span class="ln"><span style="--d:.1s">Cozinha de fogo,</span></span>
        <span class="ln"><span style="--d:.2s">estação <i>&amp;</i> tempo.</span></span>
      </h1>
      <div class="hero__foot hero-in" style="--d:.5s">
        <p class="hero__sub">Um restaurante pequeno, de luz baixa e brasa acesa. O menu muda com o que chega dos produtores da região.</p>
        <div class="hero__ctas">
          <a class="btn btn--ember btn--lg" href="#reservas">Reservar mesa ${ICONS.arrow}</a>
          <a class="btn btn--line-l btn--lg" href="#menu">Ver o menu</a>
        </div>
      </div>
      <a class="hero__tasting hero-in" style="--d:.7s" href="#menu-degustacao"><span class="mono">Menu degustação</span><b>${esc(TASTING.name)}</b><span>${brl(TASTING.price)} · ${esc(TASTING.days.toLowerCase())}</span>${ICONS.arrowUR}</a>
    </div>
  </section>`;
}
