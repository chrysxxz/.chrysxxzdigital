import { esc } from '../lib/html.js';

/** Cabeçalho editorial padrão das seções. */
export function SectionHeading({ index, eyebrow, title, text, align = 'left', cls = '' }) {
  return `<header class="sh sh--${align} ${cls}" data-reveal>
    ${index || eyebrow ? `<p class="sh__eyebrow">${index ? `<span class="sh__idx">${esc(index)}</span>` : ''}${eyebrow ? esc(eyebrow) : ''}</p>` : ''}
    <h2 class="sh__title">${esc(title)}</h2>
    ${text ? `<p class="sh__text">${esc(text)}</p>` : ''}
  </header>`;
}
