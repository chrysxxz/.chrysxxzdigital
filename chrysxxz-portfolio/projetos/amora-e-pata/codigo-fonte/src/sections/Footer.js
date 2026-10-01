import { nav } from '../data/content.js';
import { config } from '../data/config.js';
import { Logo } from '../components/Logo.js';
import { waLink } from '../lib/whatsapp.js';
import { esc } from '../lib/html.js';

export function Footer() {
  const c = config.contact;
  const year = new Date().getFullYear();
  return `<footer class="ftr">
    <div class="wrap">
      <div class="ftr__top">
        <div class="ftr__brand">
          ${Logo({ size: 'lg' })}
          <p class="ftr__tag">${esc(config.brand.tagline)}</p>
        </div>
        <nav class="ftr__col" aria-label="Rodapé">
          <h4>Navegue</h4>
          <ul>${nav.map((n) => `<li><a href="#${n.id}">${esc(n.label)}</a></li>`).join('')}</ul>
        </nav>
        <div class="ftr__col">
          <h4>Fale com a gente</h4>
          <ul>
            <li><a href="${c.instagramUrl}" target="_blank" rel="noopener">Instagram</a></li>
            <li><a href="${waLink()}" target="_blank" rel="noopener" data-wa>WhatsApp</a></li>
            <li><a href="${config.address.mapsUrl}" target="_blank" rel="noopener">Google Maps</a></li>
          </ul>
        </div>
      </div>
      <div class="ftr__bot">
        <span>© ${year} ${esc(config.brand.name)} · ${esc(config.address.city)}, ${esc(config.address.state)}</span>
        ${config.demo.enabled ? `<span class="ftr__demo">${esc(config.demo.note)} Desenvolvido por <b>${esc(config.demo.credit)}</b>.</span>` : ''}
      </div>
    </div>
  </footer>`;
}
