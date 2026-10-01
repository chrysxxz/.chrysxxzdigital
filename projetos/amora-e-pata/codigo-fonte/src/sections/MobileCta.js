import { WhatsAppButton } from '../components/Button.js';

/** CTA fixo: barra inferior no celular, botão flutuante no desktop. */
export function MobileCta() {
  return `<div class="fcta" id="fcta">${WhatsAppButton({ label: 'Agendar pelo WhatsApp', cls: 'btn--block fcta__btn' })}</div>`;
}
