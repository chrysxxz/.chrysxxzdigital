import { nav } from '../data/content.js';
import { Logo } from '../components/Logo.js';
import { WhatsAppButton } from '../components/Button.js';
import { config } from '../data/config.js';
import { esc } from '../lib/html.js';

export function Header() {
  const links = nav.filter((n) => n.id !== 'inicio');
  return `<header class="hdr" id="hdr">
    <div class="wrap hdr__in">
      <a class="hdr__logo" href="#inicio" aria-label="${esc(config.brand.name)}, início">${Logo({ size: 'sm' })}</a>
      <nav class="hdr__nav" aria-label="Principal">
        ${links.map((n) => `<a href="#${n.id}">${esc(n.label)}</a>`).join('')}
      </nav>
      <div class="hdr__actions">
        ${WhatsAppButton({ label: 'Agendar', variant: 'primary', cls: 'btn--sm hdr__cta' })}
        <button class="burger" id="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mnav">
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>
  <div class="mnav" id="mnav" aria-hidden="true">
    <nav class="mnav__links" aria-label="Menu">
      ${nav.map((n, i) => `<a href="#${n.id}" style="--i:${i}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(n.label)}</a>`).join('')}
    </nav>
    <div class="mnav__foot">
      ${WhatsAppButton({ label: 'Agendar pelo WhatsApp', cls: 'btn--block btn--lg' })}
      <p>${esc(config.address.city)}, ${esc(config.address.state)} · ${esc(config.hours[0].days)}, ${esc(config.hours[0].time)}</p>
    </div>
  </div>`;
}
