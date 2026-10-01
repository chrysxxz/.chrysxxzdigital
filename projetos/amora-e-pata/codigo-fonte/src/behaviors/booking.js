import { waLink, bookingMessage } from '../lib/whatsapp.js';

/** Monta a mensagem do WhatsApp em tempo real a partir das escolhas. */
export function initBooking() {
  const form = document.getElementById('bookForm');
  if (!form) return;
  const btn = document.getElementById('bookBtn');
  const preview = document.getElementById('bookPreview');
  const update = () => {
    const fd = new FormData(form);
    const msg = bookingMessage({
      service: fd.get('service'),
      petName: (fd.get('petName') || '').trim(),
      size: fd.get('size'),
      period: fd.get('period'),
    });
    btn.href = waLink(msg);
    preview.textContent = '';
    msg.split('\n').forEach((line, i) => { if (i) preview.appendChild(document.createElement('br')); preview.appendChild(document.createTextNode(line)); });
  };
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  form.addEventListener('submit', (e) => { e.preventDefault(); window.open(btn.href, '_blank', 'noopener'); });
  update();
}
