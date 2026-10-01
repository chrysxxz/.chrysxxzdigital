/**
 * RESERVAS — camada de "API" (demonstração com localStorage).
 * Para um backend real, reimplemente estas funções com fetch()
 * mantendo as assinaturas: getSlots(), createReservation(), listMine().
 */
import { RESTAURANT } from '../data/restaurant.js';
import { dateKey, parseKey, addDays, nowMin, onlyDigits } from '../core/utils.js';

const KEY = 'casanero.reservas.v1';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return MEM; } };
const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { MEM = list; } };
let MEM = [];

/** Ocupação simulada e estável (mesmo dia/horário → mesma ocupação). */
function simulatedTaken(date, time) {
  let h = 2166136261; for (const ch of date + time) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const wdN = parseKey(date).getDay(), weekend = wdN === 5 || wdN === 6;
  const peak = time >= 20 * 60 && time <= 21 * 60 ? 2 : 0;
  return Math.min(RESTAURANT.reservation.tablesPerSlot, ((h >>> 0) % 3) + (weekend ? 1 : 0) + peak);
}

export function openDays() {
  const out = [];
  for (let i = 0; i < RESTAURANT.reservation.windowDays; i++) {
    const d = addDays(new Date(), i), k = dateKey(d);
    out.push({ key: k, date: d, open: (RESTAURANT.hours[d.getDay()] || []).length > 0 && getSlots(k, 2).some((s) => s.left > 0) });
  }
  return out;
}

/** Horários de um dia: [{ time, shift, left }] */
export function getSlots(date, party = 2) {
  const shifts = RESTAURANT.hours[parseKey(date).getDay()] || [];
  const mine = read().filter((r) => r.date === date);
  const isToday = date === dateKey(new Date()), now = nowMin();
  const out = [];
  shifts.forEach(([a, b]) => {
    for (let t = a; t <= b - RESTAURANT.reservation.lastSeatingBeforeClose; t += 30) {
      if (isToday && t < now + 60) continue;
      const taken = simulatedTaken(date, String(t)) + mine.filter((r) => r.time === t).length + (party >= 7 ? 1 : 0);
      out.push({ time: t, shift: a < 17 * 60 ? 'Almoço' : 'Jantar', left: Math.max(0, RESTAURANT.reservation.tablesPerSlot - taken) });
    }
  });
  return out;
}

export function createReservation(data) {
  const slot = getSlots(data.date, data.party).find((s) => s.time === data.time);
  if (!slot || slot.left <= 0) throw new Error('Este horário acabou de esgotar. Escolha outro, por favor.');
  const r = { ...data, phone: onlyDigits(data.phone), id: 'r' + Date.now().toString(36), code: 'NERO-' + String(Date.now()).slice(-4), status: 'Solicitada', createdAt: Date.now() };
  const list = read(); list.push(r); write(list);
  return r;
}
export const listMine = () => read().sort((a, b) => b.createdAt - a.createdAt);
export function cancelReservation(id) { write(read().filter((r) => r.id !== id)); }
