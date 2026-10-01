import { hero } from '../data/content.js';
import { config } from '../data/config.js';
import { Picture } from '../components/Picture.js';
import { WhatsAppButton, Button } from '../components/Button.js';
import { icons } from '../components/icons.js';
import { esc } from '../lib/html.js';

export function Hero() {
  const h = config.hours[0];
  return `<section class="hero" id="inicio">
    <div class="wrap hero__grid">
      <div class="hero__copy">
        <p class="eyebrow hero__in" style="--d:.05s"><span class="dot"></span>${esc(hero.eyebrow)}</p>
        <h1 class="hero__title">
          <span class="ln"><span style="--d:.12s">${esc(hero.title[0])}</span></span>
          <span class="ln"><em style="--d:.24s">${esc(hero.title[1])}</em></span>
        </h1>
        <p class="hero__sub hero__in" style="--d:.42s">${esc(hero.subtitle)}</p>
        <div class="hero__ctas hero__in" style="--d:.55s">
          ${WhatsAppButton({ label: hero.primary, cls: 'btn--lg' })}
          ${Button({ label: hero.secondary, href: '#servicos', variant: 'ghost', icon: 'arrowDown', cls: 'btn--lg' })}
        </div>
        <ul class="hero__meta hero__in" style="--d:.7s">
          <li>${icons.clock}<span>${esc(hero.note)}</span></li>
          <li>${icons.pin}<span>${esc(config.address.city)}, ${esc(config.address.state)}</span></li>
        </ul>
      </div>
      <div class="hero__visual">
        <div class="hero__frame" id="heroFrame">
          ${Picture('hero', { eager: true, cls: 'hero__ph', sizes: '(max-width: 900px) 100vw, 56vw' })}
        </div>
        <div class="hero__card hero__in" style="--d:.9s">
          <span class="hero__card-ic">${icons.clock}</span>
          <span><b>${esc(h.days)}</b><small>${esc(h.time)} · sábados até ${esc(config.hours[1].time.split(' às ')[1] || '')}</small></span>
        </div>
      </div>
    </div>
  </section>`;
}
