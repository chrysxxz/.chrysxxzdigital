/** Utilidades: HTML, moeda, datas e horário de funcionamento. */
import { RESTAURANT } from '../data/restaurant.js';
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ESC_MAP[c]);
export const brl = (n) => 'R$ ' + n.toLocaleString('pt-BR');
export const pad2 = (n) => String(n).padStart(2, '0');
export const fmtTime = (m) => `${pad2(Math.floor(m / 60) % 24)}h${m % 60 ? pad2(m % 60) : ''}`;
export const fmtClock = (m) => `${pad2(Math.floor(m / 60) % 24)}:${pad2(m % 60)}`;
export const dateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MON = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const wd = (d) => WD[d.getDay()];
export const wdShort = (d) => WD[d.getDay()].slice(0, 3);
export const monShort = (d) => MON[d.getMonth()].slice(0, 3);
export function fmtDateLong(k) {
  const d = parseKey(k), t = dateKey(new Date()), tm = dateKey(addDays(new Date(), 1));
  const tail = `${d.getDate()} de ${MON[d.getMonth()]}`;
  if (k === t) return `Hoje, ${tail}`;
  if (k === tm) return `Amanhã, ${tail}`;
  return `${WD[d.getDay()].charAt(0).toUpperCase() + WD[d.getDay()].slice(1)}, ${tail}`;
}
export const onlyDigits = (s = '') => s.replace(/\D/g, '');
export function fmtPhone(s = '') {
  const d = onlyDigits(s).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

/** Status atual: aberto agora? próximo turno? */
export function openStatus(date = new Date()) {
  const m = date.getHours() * 60 + date.getMinutes();
  const today = RESTAURANT.hours[date.getDay()] || [];
  const cur = today.find(([a, b]) => m >= a && m < b);
  if (cur) return { open: true, text: `Aberto agora · cozinha até ${fmtTime(cur[1] - 30)}` };
  const later = today.find(([a]) => a > m);
  if (later) return { open: false, text: `Abre hoje às ${fmtTime(later[0])}` };
  for (let i = 1; i < 8; i++) {
    const d = addDays(date, i), s = RESTAURANT.hours[d.getDay()] || [];
    if (s.length) return { open: false, text: `Abre ${i === 1 ? 'amanhã' : wd(d)} às ${fmtTime(s[0][0])}` };
  }
  return { open: false, text: 'Fechado' };
}
