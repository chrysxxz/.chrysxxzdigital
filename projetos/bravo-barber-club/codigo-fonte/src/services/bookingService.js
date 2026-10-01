/**
 * SERVIÇO DE AGENDAMENTOS — camada de "API".
 * Todas as telas falam SOMENTE com este módulo. Para conectar um backend real,
 * reimplemente estas funções com fetch() mantendo as mesmas assinaturas.
 *
 *   GET    /bookings?date=YYYY-MM-DD      → listBookings({ date })
 *   GET    /availability?...               → getAvailability(...)
 *   POST   /bookings                       → createBooking(data)
 *   PATCH  /bookings/:id/status            → updateStatus(id, status)
 */
import { storage } from './storage.js';
import { buildSeed } from './seed.js';
import { BUSINESS } from '../data/business.js';
import { BARBERS, findService, STATUS_FLOW } from '../data/catalog.js';
import { parseKey, todayKey, nowMin, uid, onlyDigits } from '../core/utils.js';

const KEY = 'bravo.bookings.v1';
const ME_KEY = 'bravo.client.v1';
const bus = new EventTarget();

function load() {
  let data = storage.get(KEY);
  if (!data || !Array.isArray(data.bookings)) { data = { seededAt: Date.now(), bookings: buildSeed() }; storage.set(KEY, data); }
  return data;
}
function save(data, detail) { storage.set(KEY, data); bus.dispatchEvent(new CustomEvent('change', { detail })); }

// Sincroniza entre abas (cliente numa aba, painel em outra)
try {
  addEventListener('storage', (e) => {
    if (e.key === KEY) bus.dispatchEvent(new CustomEvent('change', { detail: { type: 'external' } }));
    if (e.key === ME_KEY) bus.dispatchEvent(new CustomEvent('me', {}));
  });
} catch (e) { /* ambiente sem window */ }

export const onBookingsChange = (fn) => { const h = (e) => fn(e.detail || {}); bus.addEventListener('change', h); return () => bus.removeEventListener('change', h); };

export function listBookings({ date, phone } = {}) {
  let list = load().bookings;
  if (date) list = list.filter((b) => b.date === date);
  if (phone) list = list.filter((b) => onlyDigits(b.client.phone) === onlyDigits(phone));
  return list.slice().sort((a, b) => (a.date === b.date ? a.start - b.start : a.date < b.date ? -1 : 1));
}
export const getBooking = (id) => load().bookings.find((b) => b.id === id) || null;

/** Horários livres de um barbeiro num dia, para um serviço. */
function freeSlotsFor(barber, date, duration, bookings) {
  const d = parseKey(date), wd = d.getDay(), hours = BUSINESS.hours[wd];
  if (!hours || !barber.days.includes(wd)) return [];
  const busy = bookings.filter((b) => b.barberId === barber.id && b.date === date && b.status !== 'cancelado');
  const isToday = date === todayKey(), min = isToday ? nowMin() + BUSINESS.minNotice : 0;
  const out = [];
  for (let t = hours[0]; t + duration <= hours[1]; t += BUSINESS.slotStep) {
    if (t < min) continue;
    if (busy.some((b) => t < b.start + b.duration && b.start < t + duration)) continue;
    out.push(t);
  }
  return out;
}

/** Disponibilidade: [{ start, barbers: [ids] }]. barberId = 'any' para "sem preferência". */
export function getAvailability({ date, serviceId, barberId = 'any' }) {
  const svc = findService(serviceId); if (!svc) return [];
  const bookings = load().bookings;
  const pool = barberId === 'any' ? BARBERS : BARBERS.filter((b) => b.id === barberId);
  const map = new Map();
  pool.forEach((b) => freeSlotsFor(b, date, svc.duration, bookings).forEach((t) => { if (!map.has(t)) map.set(t, []); map.get(t).push(b.id); }));
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([start, barbers]) => ({ start, barbers }));
}
export const isDayOpen = (date, barberId = 'any') => {
  const wd = parseKey(date).getDay();
  if (!BUSINESS.hours[wd]) return false;
  return barberId === 'any' ? BARBERS.some((b) => b.days.includes(wd)) : BARBERS.find((b) => b.id === barberId).days.includes(wd);
};

export function createBooking({ serviceId, barberId, date, start, client }) {
  const svc = findService(serviceId);
  const slot = getAvailability({ date, serviceId, barberId }).find((s) => s.start === start);
  if (!slot) throw new Error('Esse horário acabou de ser ocupado. Escolha outro, por favor.');
  const chosen = barberId === 'any' ? slot.barbers[Math.floor(Math.random() * slot.barbers.length)] : barberId;
  const at = Date.now();
  const booking = {
    id: 'b_' + uid() + at.toString(36), code: 'BRV-' + String(at).slice(-4),
    serviceId, barberId: chosen, date, start, duration: svc.duration, price: svc.price,
    client: { name: client.name.trim(), phone: onlyDigits(client.phone) },
    status: 'agendado', source: 'site', createdAt: at, updatedAt: at, history: [{ status: 'agendado', at }],
  };
  const data = load(); data.bookings.push(booking); save(data, { type: 'created', id: booking.id });
  setCurrentClient(booking.client);
  return booking;
}

export function updateStatus(id, status, by = 'painel') {
  const data = load(); const b = data.bookings.find((x) => x.id === id); if (!b || b.status === status) return b;
  b.status = status; b.updatedAt = Date.now(); b.history.push({ status, at: b.updatedAt, by });
  save(data, { type: 'status', id, status, by });
  return b;
}
export const nextStatus = (status) => { const i = STATUS_FLOW.indexOf(status); return i >= 0 && i < STATUS_FLOW.length - 1 ? STATUS_FLOW[i + 1] : null; };

export function resetDemo() { storage.set(KEY, { seededAt: Date.now(), bookings: buildSeed() }); storage.remove(ME_KEY); bus.dispatchEvent(new CustomEvent('change', { detail: { type: 'reset' } })); }

/* ---------- "Sessão" do cliente (demo: identificado pelo telefone) ---------- */
export const getCurrentClient = () => storage.get(ME_KEY);
export function setCurrentClient(client) { storage.set(ME_KEY, client); bus.dispatchEvent(new CustomEvent('me', {})); }
export function clearCurrentClient() { storage.remove(ME_KEY); bus.dispatchEvent(new CustomEvent('me', {})); }
export const onClientChange = (fn) => { bus.addEventListener('me', fn); return () => bus.removeEventListener('me', fn); };

/** Cliente demonstrativo: o próximo atendimento em aberto da agenda. */
export function demoClient() {
  const open = listBookings().filter((b) => ['agendado', 'confirmado', 'chegou'].includes(b.status) && b.source === 'seed');
  const today = todayKey(), now = nowMin();
  const pick = open.find((b) => b.date > today || b.start > now) || open[0];
  return pick ? pick.client : null;
}
