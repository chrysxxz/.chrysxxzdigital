import { location } from '../data/content.js';
import { config } from '../data/config.js';
import { SectionHeading } from '../components/SectionHeading.js';
import { Button, WhatsAppButton } from '../components/Button.js';
import { icons } from '../components/icons.js';
import { esc } from '../lib/html.js';

/** Mapa estilizado (SVG ilustrativo). Troque por um iframe do Google Maps no projeto real. */
const StylizedMap = () => `<svg class="map__svg" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <rect width="600" height="460" fill="var(--map-bg)"/>
  <path d="M-20 330 C 120 300, 180 360, 300 330 S 520 250, 640 290" stroke="var(--map-water)" stroke-width="26" fill="none" stroke-linecap="round"/>
  <g fill="var(--map-park)"><rect x="60" y="60" width="130" height="90" rx="14"/><circle cx="470" cy="380" r="60"/></g>
  <g stroke="var(--map-road)" stroke-linecap="round" fill="none">
    <path d="M0 200 H600" stroke-width="14"/><path d="M250 0 V460" stroke-width="14"/>
    <path d="M0 110 L600 60" stroke-width="7"/><path d="M420 0 L360 460" stroke-width="7"/>
    <path d="M0 400 L260 200" stroke-width="7"/><path d="M120 0 V460" stroke-width="4"/>
    <path d="M0 270 H600" stroke-width="4"/><path d="M520 0 V460" stroke-width="4"/><path d="M0 30 H600" stroke-width="4"/>
  </g>
  <g class="map__pin" transform="translate(300 200)">
    <circle r="38" fill="var(--terra)" opacity=".14"><animate attributeName="r" values="18;44;18" dur="3.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".3;0;.3" dur="3.2s" repeatCount="indefinite"/></circle>
    <path d="M0 6 C -14 -10 -16 -18 -16 -24 A16 16 0 0 1 16 -24 C 16 -18 14 -10 0 6Z" fill="var(--ink)"/>
    <circle cy="-24" r="5.5" fill="var(--cream)"/>
  </g>
</svg>`;

export function Location() {
  const a = config.address;
  return `<section class="sec loc" id="contato" aria-label="Localização e contato">
    <div class="wrap">
      ${SectionHeading({ index: '06', eyebrow: 'Localização', title: location.title, text: location.text })}
      <div class="loc__grid">
        <div class="map" data-reveal="scale">
          ${StylizedMap()}
          <div class="map__card">
            <b>${esc(config.brand.name)}</b>
            <span>${esc(a.street)} · ${esc(a.district)}</span>
            <span>${esc(a.city)}, ${esc(a.state)} · ${esc(a.zip)}</span>
          </div>
          <span class="map__demo">Mapa ilustrativo · endereço fictício</span>
        </div>
        <div class="loc__info">
          <div class="info" data-reveal>
            <h3>${icons.clock}Horários</h3>
            <dl class="hours">${config.hours.map((h) => `<div><dt>${esc(h.days)}</dt><dd>${esc(h.time)}</dd></div>`).join('')}</dl>
          </div>
          <div class="info" data-reveal style="--d:.08s">
            <h3>${icons.pin}Endereço</h3>
            <p>${esc(a.street)}<br>${esc(a.district)} · ${esc(a.city)}, ${esc(a.state)}</p>
          </div>
          <div class="info info--links" data-reveal style="--d:.16s">
            ${WhatsAppButton({ label: `WhatsApp ${config.contact.whatsappDisplay}`, cls: 'btn--block' })}
            <div class="info__pair">
              ${Button({ label: 'Instagram', href: config.contact.instagramUrl, variant: 'ghost', icon: 'instagram' })}
              ${Button({ label: 'Google Maps', href: a.mapsUrl, variant: 'ghost', icon: 'map' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
