import { BUSINESS } from '../data/business.js';
import { SERVICES, BARBERS, findService } from '../data/catalog.js';
import { dateKey, addDays, todayKey, nowMin, uid, parseKey } from '../core/utils.js';

/**
 * Próximo dia de funcionamento a partir de `from`.
 * Hoje só conta se ainda faltar pelo menos 1h para fechar (demo sempre "viva").
 */
export function nextOpenDay(from = new Date()) {
  const base = dateKey(from) === todayKey() ? new Date() : from;
  for (let i = 0; i < 8; i++) {
    const d = addDays(base, i), h = BUSINESS.hours[d.getDay()];
    if (!h) continue;
    if (i === 0 && dateKey(d) === todayKey() && nowMin() > h[1] - 60) continue;
    return dateKey(d);
  }
  return dateKey(from);
}

const NAMES = ['João Silva', 'Lucas Andrade', 'Pedro Rocha', 'Gabriel Nunes', 'Thiago Martins', 'André Souza', 'Bruno Carvalho', 'Felipe Araújo', 'Rodrigo Pires', 'Caio Mendes', 'Vinícius Lopes', 'Eduardo Reis', 'Marcelo Tavares', 'Henrique Dias'];
const PLAN = [ // [barbeiro, serviço, horário em minutos]
  ['rafael', 'corte', 9 * 60], ['rafael', 'corte-barba', 10 * 60], ['rafael', 'corte', 11 * 60 + 30], ['rafael', 'corte', 14 * 60], ['rafael', 'corte-barba', 15 * 60 + 30], ['rafael', 'corte', 17 * 60 + 15],
  ['matheus', 'barba', 9 * 60 + 30], ['matheus', 'corte-barba', 10 * 60 + 15], ['matheus', 'barba', 14 * 60 + 45], ['matheus', 'sobrancelha', 15 * 60 + 30], ['matheus', 'corte', 16 * 60 + 30], ['matheus', 'barba', 18 * 60],
  ['diego', 'degrade', 10 * 60], ['diego', 'degrade', 13 * 60 + 30], ['diego', 'pezinho', 14 * 60 + 30], ['diego', 'corte', 16 * 60], ['diego', 'degrade', 17 * 60 + 30],
];

function phoneFor(i) { return `4199${String(1000000 + i * 7919).slice(-7)}`; }

/** Gera agendamentos demonstrativos relativos ao horário atual. */
export function buildSeed() {
  const day = nextOpenDay();
  const isToday = day === todayKey();
  const now = nowMin();
  const [, close] = BUSINESS.hours[parseKey(day).getDay()];
  const bookings = [];
  PLAN.forEach(([barberId, serviceId, start], i) => {
    const barber = BARBERS.find((b) => b.id === barberId);
    if (!barber.days.includes(parseKey(day).getDay())) return;
    const svc = findService(serviceId);
    if (start + svc.duration > close) return;
    let status;
    if (!isToday) status = i % 3 === 0 ? 'agendado' : 'confirmado';
    else if (start + svc.duration <= now) status = 'finalizado';
    else if (start <= now) status = 'atendimento';
    else if (start - now <= 30) status = 'chegou';
    else status = i % 4 === 0 ? 'agendado' : 'confirmado';
    if (i === 11) status = 'cancelado';
    bookings.push(makeBooking({ i, day, barberId, serviceId, start, status }));
  });
  // alguns horários no dia seguinte aberto
  const next = nextOpenDay(addDays(parseKey(day), 1));
  [['rafael', 'corte', 10 * 60], ['diego', 'degrade', 11 * 60], ['matheus', 'corte-barba', 15 * 60]].forEach(([barberId, serviceId, start], j) => {
    if (BARBERS.find((b) => b.id === barberId).days.includes(parseKey(next).getDay()))
      bookings.push(makeBooking({ i: 20 + j, day: next, barberId, serviceId, start, status: j === 1 ? 'agendado' : 'confirmado' }));
  });
  return bookings;
}

function makeBooking({ i, day, barberId, serviceId, start, status }) {
  const svc = findService(serviceId);
  const at = Date.now() - (30 - i) * 3600e3;
  return {
    id: 'b_' + uid() + i, code: 'BRV-' + (1100 + i * 37),
    serviceId, barberId, date: day, start, duration: svc.duration, price: svc.price,
    client: { name: NAMES[i % NAMES.length], phone: phoneFor(i) },
    status, source: 'seed', createdAt: at, updatedAt: at,
    history: [{ status, at }],
  };
}
