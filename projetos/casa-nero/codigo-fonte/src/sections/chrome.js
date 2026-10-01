/** Header, menu mobile, rodapé e barra fixa do celular. */
import { RESTAURANT } from '../data/restaurant.js';
import { ICONS } from '../ui/icons.js';
import { esc } from '../core/utils.js';

export const NAV = [['casa', 'A casa'], ['menu', 'Menu'], ['experiencia', 'Experiência'], ['galeria', 'Galeria'], ['visite', 'Visite']];
export const waHref = (msg = `Olá, ${RESTAURANT.name}! Gostaria de uma informação.`) => `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(msg)}`;

export function Header() {
  return `<header class="hdr" id="hdr">
    <div class="wrap hdr__in">
      <a class="wordmark" href="#top" aria-label="${esc(RESTAURANT.name)}, início"><span>Casa</span><b>Nero</b></a>
      <nav class="hdr__nav" aria-label="Principal">${NAV.map(([id, l]) => `<a href="#${id}">${l}</a>`).join('')}</nav>
      <div class="hdr__act">
        <a class="btn btn--ember btn--sm hdr__cta" href="#reservas">Reservar mesa</a>
        <button class="burger" id="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="mnav"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mnav" id="mnav" aria-hidden="true">
    <nav aria-label="Menu">${NAV.map(([id, l], i) => `<a href="#${id}" style="--i:${i}"><em>0${i + 1}</em>${l}</a>`).join('')}</nav>
    <div class="mnav__foot">
      <a class="btn btn--ember btn--lg btn--block" href="#reservas">Reservar mesa ${ICONS.arrow}</a>
      <a class="btn btn--line btn--lg btn--block" href="${waHref()}" target="_blank" rel="noopener">${ICONS.whatsapp} WhatsApp</a>
    </div>
  </div>`;
}

export function Footer() {
  return `<footer class="ftr">
    <div class="wrap">
      <div class="ftr__grid">
        <div><p class="ftr__lead">Fogo, estação<br>e tempo.</p></div>
        <nav aria-label="Rodapé"><h4>Navegue</h4>${NAV.map(([id, l]) => `<a href="#${id}">${l}</a>`).join('')}<a href="#reservas">Reservas</a></nav>
        <div><h4>Contato</h4><a href="${waHref()}" target="_blank" rel="noopener">WhatsApp ${esc(RESTAURANT.whatsappDisplay)}</a><a href="https://www.instagram.com/" target="_blank" rel="noopener">${esc(RESTAURANT.instagram)}</a><p>${esc(RESTAURANT.address)}<br>${esc(RESTAURANT.district)}</p></div>
      </div>
      <p class="ftr__word" aria-hidden="true">NERO</p>
      <div class="ftr__bot"><span>© ${new Date().getFullYear()} ${esc(RESTAURANT.name)}</span><span>${esc(RESTAURANT.demo.notice)} Desenvolvido por <b>${esc(RESTAURANT.demo.credit)}</b>.</span></div>
    </div>
  </footer>
  <div class="mbar" id="mbar">
    <a class="btn btn--ember btn--lg" href="#reservas">Reservar mesa</a>
    <a class="mbar__wa" href="${waHref()}" target="_blank" rel="noopener" aria-label="Falar pelo WhatsApp">${ICONS.whatsapp}</a>
  </div>`;
}
