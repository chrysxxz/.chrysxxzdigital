/** Componentes de interface compartilhados pelo site, cliente e painel. */
import { ICONS } from './icons.js';
import { findStatus, STATUS_FLOW } from '../data/catalog.js';
import { esc } from '../core/utils.js';

export const Logo = ({ sub = true, cls = '' } = {}) =>
  `<span class="logo ${cls}"><span class="logo__mark">B</span><span class="logo__txt"><b>BRAVO</b>${sub ? '<small>Barber Club</small>' : ''}</span></span>`;

export const StatusBadge = (id) => { const s = findStatus(id); return `<span class="badge badge--${id}"><i></i>${esc(s ? s.label : id)}</span>`; };

/** Linha do tempo do status (usada na área do cliente e no painel). */
export function StatusTrack(status, { compact = false } = {}) {
  if (status === 'cancelado') return `<div class="track track--cancel">${StatusBadge('cancelado')}<span>${esc(findStatus('cancelado').hint)}</span></div>`;
  const idx = STATUS_FLOW.indexOf(status);
  return `<ol class="track ${compact ? 'track--compact' : ''}">${STATUS_FLOW.map((id, i) =>
    `<li class="track__step ${i < idx ? 'is-done' : ''} ${i === idx ? 'is-now' : ''}"><span class="track__dot">${i < idx ? ICONS.check : ''}</span><span class="track__lbl">${esc(findStatus(id).label)}</span></li>`).join('')}</ol>`;
}

/**
 * Espaço de fotografia com direção de arte.
 * As páginas publicadas não carregam imagens externas; aqui entram as fotos reais
 * da barbearia (troque por <img src="..."> quando houver o material).
 */
export const PhotoSlot = ({ label, icon = 'scissors', cls = '', big = '' }) =>
  `<figure class="photo ${cls}"><span class="photo__crop" aria-hidden="true"></span>${big ? `<span class="photo__big">${esc(big)}</span>` : `<span class="photo__ic">${ICONS[icon] || ''}</span>`}<figcaption>${esc(label)}</figcaption></figure>`;

/* ---------- Toasts ---------- */
let toastBox;
export function toast(msg, { icon = 'bell', tone = '' } = {}) {
  if (!toastBox) { toastBox = document.createElement('div'); toastBox.className = 'toasts'; toastBox.setAttribute('aria-live', 'polite'); document.body.appendChild(toastBox); }
  const t = document.createElement('div');
  t.className = `toast ${tone}`; t.innerHTML = `<span class="toast__ic">${ICONS[icon] || ''}</span><span>${msg}</span>`;
  toastBox.appendChild(t);
  requestAnimationFrame(() => t.classList.add('is-in'));
  setTimeout(() => { t.classList.remove('is-in'); setTimeout(() => t.remove(), 400); }, 4200);
}
