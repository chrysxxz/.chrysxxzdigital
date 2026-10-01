/** Utilidades: datas, moeda, HTML. */
const ESC_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ESC_MAP[c]);
export const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
export const pad2 = (n) => String(n).padStart(2, '0');

export const dateKey = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
export const parseKey = (k) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const todayKey = () => dateKey(new Date());
export const nowMin = () => { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
export const fmtTime = (m) => `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`;
export const fmtDur = (m) => (m >= 60 ? `${Math.floor(m / 60)}h${m % 60 ? pad2(m % 60) : ''}` : `${m} min`);

const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const WD_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MON = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const wdShort = (d) => WD_SHORT[d.getDay()];
export const monShort = (d) => MON[d.getMonth()];
export function fmtDateLong(k) {
  const d = parseKey(k), t = todayKey(), tm = dateKey(addDays(new Date(), 1));
  const base = `${WD[d.getDay()]}, ${d.getDate()} de ${MON[d.getMonth()]}`;
  if (k === t) return `Hoje, ${d.getDate()} de ${MON[d.getMonth()]}`;
  if (k === tm) return `Amanhã, ${d.getDate()} de ${MON[d.getMonth()]}`;
  return base.charAt(0).toUpperCase() + base.slice(1);
}
export const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();
export const firstName = (n = '') => n.trim().split(/\s+/)[0] || '';
export const onlyDigits = (s = '') => s.replace(/\D/g, '');
export function fmtPhone(s = '') {
  const d = onlyDigits(s).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}
