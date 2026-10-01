/** ÁREA DO CLIENTE: próximo agendamento + status ao vivo */
import { findService, findBarber, findStatus } from '../data/catalog.js';
import { BUSINESS } from '../data/business.js';
import { ICONS } from '../ui/icons.js';
import { StatusBadge, StatusTrack, toast } from '../ui/components.js';
import { SiteHeader, SiteFooter } from './site.js';
import { listBookings, getCurrentClient, setCurrentClient, clearCurrentClient, demoClient, updateStatus, onBookingsChange, onClientChange } from '../services/bookingService.js';
import { esc, brl, fmtDur, fmtTime, fmtDateLong, todayKey, nowMin, firstName, fmtPhone, onlyDigits } from '../core/utils.js';

const OPEN = ['agendado', 'confirmado', 'chegou', 'atendimento'];
let lastStatus = {};

export function ClientView() {
  return `${SiteHeader('client')}<main class="cl"><div class="wrap" id="clBody"></div></main>${SiteFooter()}`;
}

export function mountClient() {
  const body = document.getElementById('clBody'); if (!body) return () => {};
  lastStatus = {};
  render();
  const off1 = onBookingsChange((d) => {
    const me = getCurrentClient();
    if (me && d.id) {
      const b = listBookings({ phone: me.phone }).find((x) => x.id === d.id);
      if (b && d.type === 'status' && d.by !== 'cliente') toast(`Seu atendimento agora está <b>${esc(findStatus(b.status).label)}</b>.`, { icon: 'bell' });
    }
    render(true);
  });
  const off2 = onClientChange(() => render());
  // relógio: atualiza contagem regressiva a cada 30s
  const timer = setInterval(() => { const el = document.getElementById('clCountdown'); if (el) el.textContent = countdown(el.dataset.date, +el.dataset.start); }, 30000);

  body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    if (t.dataset.act === 'demo') { const c = demoClient(); if (c) setCurrentClient(c); }
    if (t.dataset.act === 'logout') clearCurrentClient();
    if (t.dataset.act === 'cancel') {
      if (t.dataset.confirm !== '1') { t.dataset.confirm = '1'; t.innerHTML = 'Toque de novo para cancelar'; t.classList.add('is-warn'); setTimeout(() => { if (t.isConnected) { t.dataset.confirm = ''; t.innerHTML = 'Cancelar horário'; t.classList.remove('is-warn'); } }, 3500); return; }
      updateStatus(t.dataset.id, 'cancelado', 'cliente'); toast('Horário cancelado. A barbearia foi avisada.', { icon: 'x' });
    }
    if (t.dataset.act === 'checkin') { updateStatus(t.dataset.id, 'chegou', 'cliente'); toast('Check-in feito. Seu barbeiro já sabe que você chegou.', { icon: 'check', tone: 'ok' }); }
  });
  body.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = onlyDigits(new FormData(e.target).get('phone') || '');
    const found = listBookings({ phone })[0];
    if (!found) { const p = body.querySelector('.login__err'); p.textContent = 'Não encontramos agendamentos para este telefone.'; return; }
    setCurrentClient(found.client);
  });
  body.addEventListener('input', (e) => { if (e.target.name === 'phone') e.target.value = fmtPhone(e.target.value); });
  return () => { off1(); off2(); clearInterval(timer); };
}

function countdown(date, start) {
  const t = todayKey();
  if (date !== t) return 'Seu próximo horário';
  const diff = start - nowMin();
  if (diff <= 0) return 'Agora';
  if (diff < 60) return `Em ${diff} min`;
  return `Em ${Math.floor(diff / 60)}h${diff % 60 ? String(diff % 60).padStart(2, '0') : ''}`;
}

function render(fromChange) {
  const body = document.getElementById('clBody'); if (!body) return;
  const me = getCurrentClient();
  if (!me) { body.innerHTML = Login(); return; }
  const all = listBookings({ phone: me.phone });
  const today = todayKey(), now = nowMin();
  const upcoming = all.filter((b) => OPEN.includes(b.status) && (b.date > today || (b.date === today && b.start + b.duration >= now - 30) || ['chegou', 'atendimento'].includes(b.status)));
  const next = upcoming[0];
  const others = upcoming.slice(1);
  const past = all.filter((b) => !upcoming.includes(b)).reverse();
  body.innerHTML = `
    <header class="cl__head">
      <div><p class="kicker">Área do cliente</p><h1 class="cl__title">Olá, ${esc(firstName(me.name))}.</h1></div>
      <div class="cl__live"><span class="live-dot"></span>Sincronizado com a barbearia <button class="linkbtn" data-act="logout" type="button">Sair</button></div>
    </header>
    ${next ? NextCard(next, fromChange && lastStatus[next.id] && lastStatus[next.id] !== next.status) : `<div class="empty empty--big">${ICONS.cal}<h2>Nenhum horário marcado</h2><p>Que tal reservar sua próxima cadeira?</p><a class="btn btn--brass btn--lg" href="#/agendar">Agendar horário ${ICONS.arrow}</a></div>`}
    ${others.length ? `<section class="cl__sec"><h2 class="h3">Próximos horários</h2><div class="rows">${others.map(Row).join('')}</div></section>` : ''}
    ${past.length ? `<section class="cl__sec"><h2 class="h3">Histórico</h2><div class="rows">${past.map(Row).join('')}</div></section>` : ''}
    <p class="fine cl__fine">Demonstração: altere o status deste atendimento no <a href="#/painel">painel da barbearia</a> e acompanhe a mudança aqui.</p>`;
  all.forEach((b) => { lastStatus[b.id] = b.status; });
}

function NextCard(b, changed) {
  const svc = findService(b.serviceId), barber = findBarber(b.barberId), st = findStatus(b.status);
  const canCancel = ['agendado', 'confirmado'].includes(b.status);
  const canCheckin = b.status === 'confirmado' && b.date === todayKey() && b.start - nowMin() <= 60;
  return `<article class="next ${changed ? 'is-changed' : ''}">
    <div class="next__top">
      <div class="next__when">
        <p class="next__cd" id="clCountdown" data-date="${b.date}" data-start="${b.start}">${esc(countdown(b.date, b.start))}</p>
        <p class="next__time">${fmtTime(b.start)}</p>
        <p class="next__date">${esc(fmtDateLong(b.date))}</p>
      </div>
      <div class="next__status">${StatusBadge(b.status)}<p>${esc(st.hint)}</p></div>
    </div>
    ${StatusTrack(b.status)}
    <dl class="next__info">
      <div><dt>${ICONS.scissors}Serviço</dt><dd>${esc(svc.name)} <small>${fmtDur(svc.duration)}</small></dd></div>
      <div><dt>${ICONS.user}Barbeiro</dt><dd>${esc(barber.name)}</dd></div>
      <div><dt>${ICONS.cash}Valor</dt><dd>${brl(b.price)} <small>na barbearia</small></dd></div>
      <div><dt>${ICONS.pin}Local</dt><dd>${esc(BUSINESS.address)}</dd></div>
    </dl>
    <div class="next__acts">
      ${canCheckin ? `<button class="btn btn--brass" type="button" data-act="checkin" data-id="${b.id}">${ICONS.check} Cheguei na barbearia</button>` : ''}
      ${canCancel ? `<button class="btn btn--line" type="button" data-act="cancel" data-id="${b.id}">Cancelar horário</button>` : ''}
      <a class="btn btn--line" href="#/agendar?servico=${b.serviceId}&barbeiro=${b.barberId}">Agendar outro</a>
      <span class="next__code">Código ${esc(b.code)}</span>
    </div>
  </article>`;
}

const Row = (b) => {
  const svc = findService(b.serviceId), barber = findBarber(b.barberId);
  return `<div class="row"><span class="row__time"><b>${fmtTime(b.start)}</b><small>${esc(fmtDateLong(b.date))}</small></span><span class="row__main"><b>${esc(svc.name)}</b><small>com ${esc(barber.name)} · ${brl(b.price)}</small></span>${StatusBadge(b.status)}</div>`;
};

function Login() {
  return `<section class="login">
    <p class="kicker">Área do cliente</p>
    <h1 class="cl__title">Acompanhe seu horário.</h1>
    <p class="login__txt">Veja seu próximo agendamento e o status do atendimento em tempo real: da confirmação até a hora em que você senta na cadeira.</p>
    <form class="login__form" novalidate>
      <label class="field"><span>Telefone usado no agendamento</span><input name="phone" type="tel" inputmode="tel" placeholder="(41) 90000-0000" autocomplete="tel"></label>
      <button class="btn btn--brass btn--lg" type="submit">Ver minha agenda ${ICONS.arrow}</button>
      <p class="login__err" role="alert"></p>
    </form>
    <div class="login__alt">
      <button class="btn btn--line" type="button" data-act="demo">${ICONS.user} Entrar como cliente demonstrativo</button>
      <a class="btn btn--line" href="#/agendar">Fazer um agendamento</a>
    </div>
  </section>`;
}
