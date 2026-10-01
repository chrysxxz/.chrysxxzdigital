import { icons } from './icons.js';
import { waLink } from '../lib/whatsapp.js';
import { esc } from '../lib/html.js';

/** Botão/link padrão. variant: primary | ghost | light | text */
export function Button({ label, href, variant = 'primary', icon, cls = '', attrs = '' }) {
  const ext = /^https?:/.test(href) ? ' target="_blank" rel="noopener"' : '';
  const ic = icon ? icons[icon] : '';
  return `<a class="btn btn--${variant} ${cls}" href="${esc(href)}"${ext} ${attrs}><span class="btn__label">${esc(label)}</span>${ic ? `<span class="btn__icon">${ic}</span>` : ''}</a>`;
}

/** Botão de WhatsApp com mensagem pronta. */
export const WhatsAppButton = ({ label, message, variant = 'primary', cls = '' }) =>
  Button({ label, href: waLink(message), variant, icon: 'whatsapp', cls, attrs: 'data-wa' });
