/** FLUXO DE AGENDAMENTO: serviço → barbeiro → data → horário → confirmação */
import { BUSINESS } from '../data/business.js';
import { SERVICES, BARBERS, findService, findBarber } from '../data/catalog.js';
import { ICONS } from '../ui/icons.js';
import { Logo, StatusBadge, toast } from '../ui/components.js';
import { getAvailability, isDayOpen, createBooking, getCurrentClient } from '../services/bookingService.js';
import { esc, brl, fmtDur, fmtTime, fmtDateLong, dateKey, addDays, parseKey, wdShort, monShort, todayKey, fmtPhone, onlyDigits, firstName } from '../core/utils.js';

const STEPS = ['Serviço', 'Barbeiro', 'Data', 'Horário', 'Confirmar'];
let S = null; // estado do fluxo

export function BookingView(params) {
  const me = getCurrentClient() || {};
  S = { step: 0, serviceId: null, barberId: null, date: null, start: null, name: me.name || '', phone: me.phone ? fmtPhone(me.phone) : '', done: null, error: '' };
  if (params.servico && findService(params.servico)) { S.serviceId = params.servico; S.step = 1; }
  if (params.barbeiro && findBarber(params.barbeiro)) { S.barberId = params.barbeiro; if (!S.serviceId) S.step = 0; }
  if (S.serviceId && S.barberId) S.step = 2;
  if (params.data && S.serviceId) { S.date = params.data; S.barberId = S.barberId || 'any'; S.step = 3; }
  return `<div class="bk" id="bk">
    <header class="bk__top">
      <div class="wrap bk__topin">
        <a href="#/" class="bk__back" aria-label="Voltar ao site">${ICONS.back}<span>Site</span></a>
        <a href="#/" class="bk__logo">${Logo({ sub: false })}</a>
        <a href="#/cliente" class="bk__me">${ICONS.user}<span>Minha agenda</span></a>
      </div>
    </header>
    <div class="wrap bk__grid" id="bkBody"></div>
  </div>`;
}

export function mountBooking() {
  const body = document.getElementById('bkBody');
  if (!body) return;
  render();

  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const { act, v } = t.dataset;
    if (act === 'service') { S.serviceId = v; S.start = null; next(); }
    if (act === 'barber') { S.barberId = v; S.start = null; next(); }
    if (act === 'date') { S.date = v; S.start = null; next(); }
    if (act === 'slot') { S.start = +v; next(); }
    if (act === 'goto') { S.step = +v; S.error = ''; render(true); }
    if (act === 'back') { S.step = Math.max(0, S.step - 1); S.error = ''; render(true); }
    if (act === 'next') next();
    if (act === 'again') { S = { ...S, step: 0, serviceId: null, barberId: null, date: null, start: null, done: null }; render(true); }
  });
  body.addEventListener('input', (e) => {
    if (e.target.name === 'phone') { const pos = e.target.value.length; e.target.value = fmtPhone(e.target.value); if (pos) e.target.setSelectionRange(e.target.value.length, e.target.value.length); }
    if (e.target.name === 'name' || e.target.name === 'phone') { S[e.target.name] = e.target.value; const btn = body.querySelector('button[type="submit"]'); if (btn) btn.disabled = !valid(); }
  });
  body.addEventListener('submit', (e) => { e.preventDefault(); confirm(); });
}

const valid = () => S.name.trim().length >= 2 && onlyDigits(S.phone).length >= 10;
function next() { S.error = ''; if (S.step < 4) S.step++; render(true); }

function confirm() {
  if (!valid()) { S.error = 'Informe seu nome e um telefone com DDD.'; render(); return; }
  try {
    const b = createBooking({ serviceId: S.serviceId, barberId: S.barberId, date: S.date, start: S.start, client: { name: S.name, phone: S.phone } });
    S.done = b; render(true);
    toast(`Agendamento <b>${esc(b.code)}</b> criado. A barbearia já recebeu.`, { icon: 'check', tone: 'ok' });
  } catch (err) { S.error = err.message; S.step = 3; S.start = null; render(true); }
}

function render(scroll) {
  const body = document.getElementById('bkBody'); if (!body) return;
  body.innerHTML = S.done ? Done(S.done) : `${Steps()}<section class="bk__main" aria-live="polite">${Step()}</section>${Summary()}`;
  body.querySelector('.bk__main, .done')?.classList.add('is-in');
  if (scroll) scrollTo({ top: 0, behavior: 'smooth' });
  const f = body.querySelector('input[name="name"]'); if (f && !S.name) f.focus({ preventScroll: true });
}

function Steps() {
  return `<ol class="steps" aria-label="Etapas">${STEPS.map((l, i) => {
    const can = i < S.step;
    return `<li class="${i === S.step ? 'is-now' : ''} ${i < S.step ? 'is-done' : ''}">${can ? `<button type="button" data-act="goto" data-v="${i}">` : '<span>'}<i>${i < S.step ? ICONS.check : i + 1}</i><em>${l}</em>${can ? '</button>' : '</span>'}</li>`;
  }).join('')}</ol>`;
}

const Head = (title, sub) => `<div class="bk__head">${S.step > 0 ? `<button class="linkbtn" type="button" data-act="back">${ICONS.back} Voltar</button>` : ''}<h1 class="bk__title">${title}</h1>${sub ? `<p class="bk__sub">${sub}</p>` : ''}</div>`;

function Step() {
  const svc = findService(S.serviceId);
  if (S.step === 0) return `${Head('Qual serviço você quer?', 'Preço fixo e duração estimada. Você paga na barbearia.')}
    <div class="opts">${SERVICES.map((s) => `<button type="button" class="opt ${S.serviceId === s.id ? 'is-sel' : ''}" data-act="service" data-v="${s.id}">
      <span class="opt__ic">${ICONS[s.icon]}</span>
      <span class="opt__main"><b>${esc(s.name)}${s.featured ? ' <em class="tag">Mais pedido</em>' : ''}</b><small>${esc(s.desc)}</small></span>
      <span class="opt__side"><b>${brl(s.price)}</b><small>${fmtDur(s.duration)}</small></span>
    </button>`).join('')}</div>`;

  if (S.step === 1) return `${Head('Com quem você quer cortar?', `${esc(svc.name)} · ${fmtDur(svc.duration)}`)}
    <div class="opts opts--barbers">
      <button type="button" class="opt opt--any ${S.barberId === 'any' ? 'is-sel' : ''}" data-act="barber" data-v="any">
        <span class="avatar avatar--any">${ICONS.users}</span>
        <span class="opt__main"><b>Sem preferência</b><small>Mostramos o primeiro barbeiro livre em cada horário.</small></span>
        <span class="opt__side">${ICONS.arrow}</span>
      </button>
      ${BARBERS.map((b) => `<button type="button" class="opt ${S.barberId === b.id ? 'is-sel' : ''}" data-act="barber" data-v="${b.id}">
        <span class="avatar" style="--tone:${b.tone}">${b.initials}</span>
        <span class="opt__main"><b>${esc(b.name)}</b><small>${esc(b.specialty)}</small></span>
        <span class="opt__side">${ICONS.arrow}</span>
      </button>`).join('')}
    </div>`;

  if (S.step === 2) {
    const days = Array.from({ length: BUSINESS.bookingWindowDays }, (_, i) => dateKey(addDays(new Date(), i)));
    return `${Head('Escolha o dia', S.barberId === 'any' ? 'Qualquer barbeiro' : `Agenda de ${esc(findBarber(S.barberId).name)}`)}
      <div class="days">${days.map((k) => {
        const d = parseKey(k); const open = isDayOpen(k, S.barberId);
        const n = open ? getAvailability({ date: k, serviceId: S.serviceId, barberId: S.barberId }).length : 0;
        const state = !open ? 'Fechado' : n === 0 ? 'Lotado' : n <= 6 ? `${n} horários` : 'Disponível';
        return `<button type="button" class="day ${S.date === k ? 'is-sel' : ''} ${n <= 6 && n > 0 ? 'is-few' : ''}" data-act="date" data-v="${k}" ${n ? '' : 'disabled'}>
          <small>${k === todayKey() ? 'Hoje' : wdShort(d)}</small><b>${d.getDate()}</b><small>${monShort(d)}</small><em>${state}</em></button>`;
      }).join('')}</div>`;
  }

  if (S.step === 3) {
    const slots = getAvailability({ date: S.date, serviceId: S.serviceId, barberId: S.barberId });
    const groups = [['Manhã', 0, 720], ['Tarde', 720, 1080], ['Noite', 1080, 1440]].map(([l, a, z]) => [l, slots.filter((s) => s.start >= a && s.start < z)]).filter(([, l]) => l.length);
    return `${Head('Escolha o horário', `${esc(fmtDateLong(S.date))} · horários com tempo livre para o serviço completo`)}
      ${S.error ? `<p class="alert">${esc(S.error)}</p>` : ''}
      ${groups.length ? groups.map(([l, list]) => `<div class="slots"><h3>${l}</h3><div class="slots__grid">${list.map((s) =>
        `<button type="button" class="slot ${S.start === s.start ? 'is-sel' : ''}" data-act="slot" data-v="${s.start}">${fmtTime(s.start)}</button>`).join('')}</div></div>`).join('')
      : `<div class="empty">${ICONS.cal}<p>Não há mais horários livres neste dia.</p><button class="btn btn--line btn--sm" type="button" data-act="back">Escolher outro dia</button></div>`}`;
  }

  // Confirmar
  const b = S.barberId === 'any' ? null : findBarber(S.barberId);
  return `${Head('Confirme seu horário', 'Falta pouco. Usamos seu telefone para você acompanhar o atendimento.')}
    <form class="confirm" novalidate>
      <div class="confirm__card">
        <div class="confirm__when"><span>${esc(fmtDateLong(S.date))}</span><b>${fmtTime(S.start)}</b><small>até ${fmtTime(S.start + svc.duration)}</small></div>
        <dl class="confirm__list">
          <div><dt>Serviço</dt><dd>${esc(svc.name)}</dd></div>
          <div><dt>Barbeiro</dt><dd>${b ? esc(b.name) : 'Primeiro disponível'}</dd></div>
          <div><dt>Duração</dt><dd>${fmtDur(svc.duration)}</dd></div>
          <div class="is-total"><dt>Total</dt><dd>${brl(svc.price)}</dd></div>
        </dl>
      </div>
      <div class="fields">
        <label class="field"><span>Seu nome</span><input name="name" autocomplete="name" value="${esc(S.name)}" placeholder="Como devemos te chamar?" maxlength="60"></label>
        <label class="field"><span>Telefone (WhatsApp)</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" value="${esc(S.phone)}" placeholder="(41) 90000-0000"></label>
      </div>
      ${S.error ? `<p class="alert">${esc(S.error)}</p>` : ''}
      <button class="btn btn--brass btn--lg btn--block" type="submit" ${valid() ? '' : 'disabled'}>Confirmar agendamento ${ICONS.check}</button>
      <p class="fine">Pagamento na barbearia. Você pode cancelar pela sua agenda até o horário marcado.</p>
    </form>`;
}

function Summary() {
  const svc = findService(S.serviceId), b = S.barberId && S.barberId !== 'any' ? findBarber(S.barberId) : null;
  const row = (ic, l, v, step) => `<div class="sum__row ${v ? '' : 'is-empty'}"><span class="sum__ic">${ICONS[ic]}</span><span><small>${l}</small><b>${v || '—'}</b></span>${v && step < S.step ? `<button type="button" class="linkbtn" data-act="goto" data-v="${step}">Alterar</button>` : ''}</div>`;
  const canNext = [S.serviceId, S.barberId, S.date, S.start !== null ? 1 : null][S.step];
  return `<aside class="sum" aria-label="Resumo">
    <p class="sum__title">Seu agendamento</p>
    ${row('scissors', 'Serviço', svc && `${esc(svc.name)} · ${fmtDur(svc.duration)}`, 0)}
    ${row('user', 'Barbeiro', S.barberId && (b ? esc(b.name) : 'Sem preferência'), 1)}
    ${row('cal', 'Data', S.date && esc(fmtDateLong(S.date)), 2)}
    ${row('clock', 'Horário', S.start !== null && S.start !== undefined ? fmtTime(S.start) : '', 3)}
    <div class="sum__total"><span>Total</span><b>${svc ? brl(svc.price) : 'R$ 0'}</b></div>
    ${S.step < 4 ? `<button class="btn btn--brass btn--block sum__next" type="button" data-act="next" ${canNext ? '' : 'disabled'}>Continuar ${ICONS.arrow}</button>` : ''}
  </aside>`;
}

function Done(b) {
  const svc = findService(b.serviceId), barber = findBarber(b.barberId);
  return `<section class="done">
    <div class="done__mark" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div>
    <p class="kicker">Agendamento ${esc(b.code)}</p>
    <h1 class="done__title">Tudo certo, ${esc(firstName(b.client.name))}.</h1>
    <p class="done__sub">Seu pedido chegou à barbearia. Assim que ${esc(firstName(barber.name))} confirmar, o status muda na sua agenda.</p>
    <div class="done__card">
      <div class="done__when"><b>${fmtTime(b.start)}</b><span>${esc(fmtDateLong(b.date))}</span></div>
      <dl><div><dt>Serviço</dt><dd>${esc(svc.name)}</dd></div><div><dt>Barbeiro</dt><dd>${esc(barber.name)}</dd></div><div><dt>Valor</dt><dd>${brl(b.price)}</dd></div><div><dt>Status</dt><dd>${StatusBadge(b.status)}</dd></div></dl>
    </div>
    <div class="done__ctas">
      <a class="btn btn--brass btn--lg" href="#/cliente">Acompanhar na minha agenda ${ICONS.arrow}</a>
      <a class="btn btn--line btn--lg" href="#/painel">Ver no painel da barbearia</a>
    </div>
    <p class="fine">Demonstração: abra o painel para confirmar este horário e veja o status mudar na área do cliente.</p>
  </section>`;
}
