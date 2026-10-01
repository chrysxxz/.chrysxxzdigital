import { images, imgUrl } from '../data/images.js';
import { esc } from '../lib/html.js';

/**
 * Imagem responsiva com srcset, lazy loading e fallback elegante.
 * Se a foto falhar ao carregar, o container mostra um placeholder da marca.
 */
export function Picture(key, { sizes = '100vw', eager = false, cls = '', widths = [480, 800, 1200, 1600], alt } = {}) {
  const img = images[key];
  if (!img) return '';
  const srcset = widths.map((w) => `${imgUrl(img.src, w)} ${w}w`).join(', ');
  return `<div class="ph ${cls}"><img src="${imgUrl(img.src, 1200)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt ?? img.alt)}" style="object-position:${img.pos || '50% 50%'}" ${eager ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async" onerror="this.parentNode.classList.add('ph--err')"></div>`;
}
