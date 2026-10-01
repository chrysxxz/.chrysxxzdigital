import { Picture } from './Picture.js';
import { icons } from './icons.js';
import { waLink } from '../lib/whatsapp.js';
import { config } from '../data/config.js';
import { esc } from '../lib/html.js';

export function ServiceCard(s, i, cta) {
  const msg = config.whatsappMessages.service(s.name.toLowerCase());
  return `<article class="svc" data-reveal style="--d:${i * 0.06}s">
    <a class="svc__link" href="${waLink(msg)}" target="_blank" rel="noopener" data-wa aria-label="${esc(cta)}: ${esc(s.name)}">
      ${Picture(s.image, { cls: 'svc__ph', sizes: '(max-width: 700px) 86vw, (max-width: 1100px) 45vw, 30vw', widths: [480, 800, 1100] })}
      <div class="svc__body">
        <p class="svc__num">${String(i + 1).padStart(2, '0')}</p>
        <h3 class="svc__name">${esc(s.name)}</h3>
        <p class="svc__text">${esc(s.text)}</p>
        <ul class="svc__tags">${s.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        <span class="svc__cta">${esc(cta)} ${icons.arrow}</span>
      </div>
    </a>
  </article>`;
}
