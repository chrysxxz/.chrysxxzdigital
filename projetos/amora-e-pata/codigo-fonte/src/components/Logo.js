import { config } from '../data/config.js';
import { esc } from '../lib/html.js';

/** Logotipo textual: "Amora & Pata" com o "&" em itálico terracota. */
export function Logo({ size = 'md', sub = true } = {}) {
  const [a, b] = config.brand.nameParts;
  return `<span class="logo logo--${size}">
    <span class="logo__word">${esc(a)} <em>&amp;</em> ${esc(b)}</span>
    ${sub ? `<span class="logo__sub">banho · tosa · cuidado</span>` : ''}
  </span>`;
}
