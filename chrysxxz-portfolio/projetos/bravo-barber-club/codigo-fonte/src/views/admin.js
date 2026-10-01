/** PAINEL DA BARBEARIA (demonstrativo) */
import { BUSINESS } from '../data/business.js';
import { SERVICES, BARBERS, STATUSES, findService, findBarber, findStatus } from '../data/catalog.js';
import { ICONS } from '../ui/icons.js';
import { Logo, StatusBadge, StatusTrack, toast } from '../ui/components.js';
import { listBookings, updateStatus, nextStatus, onBookingsChange, resetDemo, getBooking } from '../services/bookingService.js';
import { nextOpenDay } from '../services/seed.js';
import { esc, brl, fmtDur, fmtTime, fmtDateLong, todayKey, nowMin, parseKey, addDays, dateKey, fmtPhone, firstName, onlyDigits } from '../core/utils.js';

const TABS = [['hoje', 'Agenda do dia', 'cal'], ['clientes', 'Clientes', 'users'], ['barbeiros', 'Barbeiros', 'scissors'], ['servicos', 'Serviços', 'list']];
const A = { tab: 'hoje', date: null, barber: 'all', open: null, known: null, fresh: new Set() };

export function AdminView(tab) {
  A.tab = TABS.some((t) => t[0] === tab) ? tab : 'hoje';
  if (!A.date) A.date = nextOpenDay();
  return `<div class="adm">
    <aside class="adm__side">
      <a href="#/painel" class="adm__brand">${Logo({ sub: false })}<span>Painel</span></a>
      <nav class="adm__nav" aria-label="Painel">${TABS.map(([id, l, ic]) => `<a href="#/painel/${id}" class="${A.tab === id ? 'is-on' : ''}">${ICONS[ic]}<span>${l}</span></a>`).join('')}</nav>
      <div class="adm__sidefoot">
        <a href="#/">${ICONS.globe}<span>Ver site</span></a>
        <a href="#/cliente">${ICONS.user}<span>Área do cliente</span></a>
        <button type="button" data-act="reset">${ICONS.refresh}<span>Reiniciar demo</span></button>
      </div>
    </aside>
    <main class="adm__main" id="admBody"></main>
    <div class="drawer" id="drawer" aria-hidden="true"><div class="drawer__bg" data-act="close"></div><div class="drawer__panel" role="dialog" aria-modal="true" aria-label="Detalhes do atendimento" id="drawerPanel"></div></div>
  </div>`;
}

export function mountAdmin() {
  const root = document.querySelector('.adm'); if (!root) return () => {};
  A.known = new Set(listBookings().map((b) => b.id));
  // novos agendamentos do site ainda não confirmados ficam destacados
  listBookings().filter((b) => b.source === 'site' && b.status === 'agendado').forEach((b) => A.fresh.add(b.id));
  render();
  const off = onBookingsChange((d) => {
    const all = listBookings();
    all.forEach((b) => { if (!A.known.has(b.id)) { A.fresh.add(b.id); if (b.source === 'site') toast(`<b>Novo agendamento</b> · ${esc(firstName(b.client.name))}, ${esc(findService(b.serviceId).name)}, ${fmtTime(b.start)}`, { icon: 'bell' }); } });
    A.known = new Set(all.map((b) => b.id));
    if (d.type === 'status' && d.by === 'cliente') { const b = getBooking(d.id); if (b) toast(`${esc(firstName(b.client.name))} atualizou: <b>${esc(findStatus(b.status).label)}</b>`, { icon: 'user' }); }
    render(); if (A.open) openDrawer(A.open);
  });
  const tick = setInterval(() => { const n = document.getElementById('nowLine'); if (n) placeNow(); }, 60000);

  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const { act, v, id } = t.dataset;
    if (act === 'day') { A.date = v === 'today' ? nextOpenDay() : dateKey(addDays(parseKey(A.date), +v)); render(); }
    if (act === 'barber') { A.barber = v; render(); }
    if (act === 'open') openDrawer(id);
    if (act === 'close') closeDrawer();
    if (act === 'status') { setStatus(id, v); }
    if (act === 'reset') { if (t.dataset.confirm !== '1') { t.dataset.confirm = '1'; t.querySelector('span').textContent = 'Confirmar reinício'; setTimeout(() => { if (t.isConnected) { t.dataset.confirm = ''; t.querySelector('span').textContent = 'Reiniciar demo'; } }, 3000); return; } resetDemo(); A.date = nextOpenDay(); A.fresh.clear(); toast('Dados demonstrativos restaurados.', { icon: 'refresh' }); }
  });
  root.addEventListener('change', (e) => { if (e.target.matches('select[data-status]')) setStatus(e.target.dataset.status, e.target.value); });
  const esc2 = (e) => { if (e.key === 'Escape') closeDrawer(); };
  addEventListener('keydown', esc2);
  return () => { off(); clearInterval(tick); removeEventListener('keydown', esc2); };
}

function setStatus(id, status) {
  const b = updateStatus(id, status, 'painel'); A.fresh.delete(id);
  toast(`${esc(firstName(b.client.name))} → <b>${esc(findStatus(status).label)}</b>. O cliente já vê a atualização.`, { icon: 'check', tone: 'ok' });
}

/* ---------------- render ---------------- */
function render() {
  const body = document.getElementById('admBody'); if (!body) return;
  const sc = body.querySelector('.tl__scroll'); const keep = sc ? sc.scrollTop : null;
  body.innerHTML = { hoje: Today, clientes: Clients, barbeiros: Barbers, servicos: Services }[A.tab]();
  const sc2 = body.querySelector('.tl__scroll');
  if (sc2) { if (keep !== null) sc2.scrollTop = keep; else autoScroll(sc2); placeNow(); }
}

const Top = (title, sub, extra = '') => `<header class="adm__top"><div><p class="kicker">${sub}</p><h1 class="adm__title">${title}</h1></div><div class="adm__topact">${extra}<span class="live"><span class="live-dot"></span>Ao vivo</span><a class="btn btn--brass btn--sm" href="#/agendar">+ Agendamento</a></div></header>`;

function dayStats(list) {
  const valid = list.filter((b) => b.status !== 'cancelado');
  return {
    total: valid.length,
    inHouse: list.filter((b) => ['chegou', 'atendimento'].includes(b.status)).length,
    done: list.filter((b) => b.status === 'finalizado'),
    expected: valid.reduce((s, b) => s + b.price, 0),
    cancel: list.length - valid.length,
    pending: list.filter((b) => b.status === 'agendado').length,
  };
}

function Today() {
  const list = listBookings({ date: A.date });
  const st = dayStats(list);
  const realized = st.done.reduce((s, b) => s + b.price, 0);
  const filtered = A.barber === 'all' ? list : list.filter((b) => b.barberId === A.barber);
  const isToday = A.date === todayKey(), now = nowMin();
  const upcoming = filtered.filter((b) => !['finalizado', 'cancelado'].includes(b.status) && (!isToday || b.start + b.duration > now || ['chegou', 'atendimento'].includes(b.status)));
  const dateNav = `<div class="datenav"><button type="button" data-act="day" data-v="-1" aria-label="Dia anterior">${ICONS.chevL}</button><button type="button" class="datenav__today" data-act="day" data-v="today">${esc(fmtDateLong(A.date))}</button><button type="button" data-act="day" data-v="1" aria-label="Próximo dia">${ICONS.chevR}</button></div>`;
  const open = BUSINESS.hours[parseKey(A.date).getDay()];
  return `${Top('Agenda do dia', 'Painel da barbearia · dados demonstrativos', dateNav)}
  <section class="kpis">
    ${Kpi('Atendimentos', st.total, `${st.pending ? `${st.pending} aguardando confirmação` : 'todos confirmados'}`, 'cal')}
    ${Kpi('Na casa agora', st.inHouse, 'chegaram ou estão na cadeira', 'users')}
    ${Kpi('Faturamento realizado', brl(realized), `${st.done.length} finalizados`, 'cash')}
    ${Kpi('Previsto no dia', brl(st.expected), `${st.cancel} cancelado${st.cancel === 1 ? '' : 's'}`, 'cash')}
  </section>
  <div class="filters" role="group" aria-label="Filtrar por barbeiro">
    <button type="button" class="${A.barber === 'all' ? 'is-on' : ''}" data-act="barber" data-v="all">Todos</button>
    ${BARBERS.map((b) => `<button type="button" class="${A.barber === b.id ? 'is-on' : ''}" data-act="barber" data-v="${b.id}"><span class="avatar avatar--xs" style="--tone:${b.tone}">${b.initials}</span>${esc(firstName(b.name))}</button>`).join('')}
  </div>
  ${!open ? `<div class="empty empty--big">${ICONS.cal}<h2>Barbearia fechada neste dia</h2><button class="btn btn--line" type="button" data-act="day" data-v="1">Ver próximo dia</button></div>` : `
  <div class="today">
    <section class="card tl" aria-label="Agenda visual">
      <div class="card__head"><h2>Agenda visual</h2><div class="legend">${STATUSES.map((s) => `<span class="legend__i legend--${s.id}"><i></i>${s.label}</span>`).join('')}</div></div>
      ${Timeline(filtered, open)}
    </section>
    <section class="card up" aria-label="Próximos horários">
      <div class="card__head"><h2>Próximos horários</h2><span class="count">${upcoming.length}</span></div>
      <div class="up__list">${upcoming.length ? upcoming.map(UpRow).join('') : `<p class="muted pad">Nenhum horário pendente.</p>`}</div>
    </section>
  </div>
  <section class="card daylist" aria-label="Lista do dia">
    <div class="card__head"><h2>Todos os horários do dia</h2><span class="count">${filtered.length}</span></div>
    <div class="dl">${filtered.map(DayRow).join('') || '<p class="muted pad">Sem agendamentos.</p>'}</div>
  </section>`}`;
}

const Kpi = (label, value, sub, ic) => `<div class="kpi"><span class="kpi__ic">${ICONS[ic]}</span><p class="kpi__l">${label}</p><p class="kpi__v">${value}</p><p class="kpi__s">${sub}</p></div>`;

const PPM = 1.6; // pixels por minuto
function Timeline(list, [open, close]) {
  const cols = A.barber === 'all' ? BARBERS : BARBERS.filter((b) => b.id === A.barber);
  const hours = []; for (let h = Math.floor(open / 60); h <= Math.ceil(close / 60); h++) hours.push(h);
  const H = (close - open) * PPM;
  return `<div class="tl__scroll" data-open="${open}">
    <div class="tl__grid" style="--cols:${cols.length};--h:${H}px">
      <div class="tl__heads"><span></span>${cols.map((b) => `<span class="tl__head"><span class="avatar avatar--sm" style="--tone:${b.tone}">${b.initials}</span><b>${esc(firstName(b.name))}</b><small>${list.filter((x) => x.barberId === b.id && x.status !== 'cancelado').length} horários</small></span>`).join('')}</div>
      <div class="tl__body">
        <div class="tl__gutter">${hours.map((h) => `<span style="top:${(h * 60 - open) * PPM}px">${String(h).padStart(2, '0')}:00</span>`).join('')}</div>
        ${cols.map((b) => `<div class="tl__col">${hours.map((h) => `<i class="tl__line" style="top:${(h * 60 - open) * PPM}px"></i>`).join('')}
          ${list.filter((x) => x.barberId === b.id).map((x) => {
            const s = findService(x.serviceId);
            return `<button type="button" class="blk blk--${x.status} ${x.duration <= 30 ? 'is-short' : ''} ${A.fresh.has(x.id) ? 'is-new' : ''}" style="top:${(x.start - open) * PPM}px;height:${Math.max(x.duration * PPM - 3, 22)}px" data-act="open" data-id="${x.id}">
              <span class="blk__t">${fmtTime(x.start)}${A.fresh.has(x.id) ? ' <em>Novo</em>' : ''}</span><b>${esc(x.client.name)}</b><small>${esc(s.name)} · ${esc(findStatus(x.status).label)}</small></button>`;
          }).join('')}
        </div>`).join('')}
        <div class="tl__now" id="nowLine" hidden><span></span></div>
      </div>
    </div>
  </div>`;
}
function placeNow() {
  const line = document.getElementById('nowLine'), sc = document.querySelector('.tl__scroll'); if (!line || !sc) return;
  const open = +sc.dataset.open, m = nowMin();
  const [o, c] = BUSINESS.hours[parseKey(A.date).getDay()] || [0, 0];
  if (A.date !== todayKey() || m < o || m > c) { line.hidden = true; return; }
  line.hidden = false; line.style.top = `${(m - open) * PPM}px`; line.querySelector('span').textContent = fmtTime(m);
}
function autoScroll(sc) { const open = +sc.dataset.open; const m = A.date === todayKey() ? nowMin() : open; sc.scrollTop = Math.max(0, (m - open) * PPM - 80); }

const UpRow = (b) => {
  const s = findService(b.serviceId), br = findBarber(b.barberId), nx = nextStatus(b.status);
  return `<div class="up__row ${A.fresh.has(b.id) ? 'is-new' : ''}">
    <button type="button" class="up__main" data-act="open" data-id="${b.id}"><span class="up__time">${fmtTime(b.start)}</span><span><b>${esc(b.client.name)}</b><small>${esc(s.name)} · ${esc(firstName(br.name))}</small></span></button>
    <span class="up__side">${StatusBadge(b.status)}${nx ? `<button type="button" class="adv" data-act="status" data-id="${b.id}" data-v="${nx}" title="Avançar para ${esc(findStatus(nx).label)}">${esc(findStatus(nx).label)} ${ICONS.arrow}</button>` : ''}</span>
  </div>`;
};

const DayRow = (b) => {
  const s = findService(b.serviceId), br = findBarber(b.barberId);
  return `<div class="dl__row ${A.fresh.has(b.id) ? 'is-new' : ''}">
    <button type="button" class="dl__main" data-act="open" data-id="${b.id}">
      <span class="dl__time">${fmtTime(b.start)}</span>
      <span class="dl__who"><b>${esc(b.client.name)}</b><small>${esc(s.name)} · ${fmtDur(b.duration)}</small></span>
      <span class="dl__barber"><span class="avatar avatar--xs" style="--tone:${br.tone}">${br.initials}</span>${esc(firstName(br.name))}</span>
      <span class="dl__price">${brl(b.price)}</span>
    </button>
    <label class="sel"><span class="sr">Status de ${esc(b.client.name)}</span><select data-status="${b.id}" class="sel--${b.status}">${STATUSES.map((x) => `<option value="${x.id}" ${x.id === b.status ? 'selected' : ''}>${x.label}</option>`).join('')}</select></label>
  </div>`;
};

/* ---------------- drawer ---------------- */
function openDrawer(id) {
  const b = getBooking(id); if (!b) return;
  A.open = id;
  const s = findService(b.serviceId), br = findBarber(b.barberId), nx = nextStatus(b.status);
  const visits = listBookings({ phone: b.client.phone }).filter((x) => x.status === 'finalizado').length;
  document.getElementById('drawerPanel').innerHTML = `
    <div class="dr__head"><div><p class="kicker">${esc(b.code)} · ${b.source === 'site' ? 'Agendado pelo site' : 'Agenda'}</p><h2>${esc(b.client.name)}</h2><p class="muted">${fmtPhone(b.client.phone)} · ${visits} visita${visits === 1 ? '' : 's'} finalizada${visits === 1 ? '' : 's'}</p></div><button type="button" class="iconbtn" data-act="close" aria-label="Fechar">${ICONS.x}</button></div>
    <div class="dr__when"><b>${fmtTime(b.start)}–${fmtTime(b.start + b.duration)}</b><span>${esc(fmtDateLong(b.date))}</span></div>
    <dl class="dr__info"><div><dt>Serviço</dt><dd>${esc(s.name)}</dd></div><div><dt>Barbeiro</dt><dd>${esc(br.name)}</dd></div><div><dt>Valor</dt><dd>${brl(b.price)}</dd></div></dl>
    ${StatusTrack(b.status, { compact: true })}
    ${nx ? `<button type="button" class="btn btn--brass btn--lg btn--block" data-act="status" data-id="${b.id}" data-v="${nx}">Avançar para “${esc(findStatus(nx).label)}” ${ICONS.arrow}</button>` : ''}
    <p class="dr__lbl">Alterar status</p>
    <div class="stbtns">${STATUSES.map((x) => `<button type="button" class="stbtn stbtn--${x.id} ${x.id === b.status ? 'is-on' : ''}" data-act="status" data-id="${b.id}" data-v="${x.id}" aria-pressed="${x.id === b.status}"><i></i>${x.label}</button>`).join('')}</div>
    <p class="dr__lbl">Histórico</p>
    <ol class="hist">${b.history.slice().reverse().map((h) => `<li><b>${esc(findStatus(h.status).label)}</b><small>${new Date(h.at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}${h.by ? ` · ${h.by === 'cliente' ? 'pelo cliente' : 'pelo painel'}` : ''}</small></li>`).join('')}</ol>`;
  const d = document.getElementById('drawer'); d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  A.open = null; const d = document.getElementById('drawer'); if (!d) return;
  d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
}

/* ---------------- outras abas ---------------- */
function Clients() {
  const map = new Map();
  listBookings().forEach((b) => {
    const k = onlyDigits(b.client.phone);
    const c = map.get(k) || { name: b.client.name, phone: k, visits: 0, spent: 0, last: null, next: null };
    if (b.status === 'finalizado') { c.visits++; c.spent += b.price; c.last = b; }
    if (['agendado', 'confirmado', 'chegou', 'atendimento'].includes(b.status) && !c.next) c.next = b;
    map.set(k, c);
  });
  const rows = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  return `${Top('Clientes', `${rows.length} clientes na base demonstrativa`)}
    <section class="card"><div class="table" role="table">
      <div class="table__h" role="row"><span>Cliente</span><span>Telefone</span><span>Próximo horário</span><span>Visitas</span><span>Total gasto</span></div>
      ${rows.map((c) => `<div class="table__r" role="row"><span class="t-name"><span class="avatar avatar--sm">${esc(c.name.split(' ').map((p) => p[0]).slice(0, 2).join(''))}</span><b>${esc(c.name)}</b></span><span class="muted">${fmtPhone(c.phone)}</span><span>${c.next ? `${esc(fmtDateLong(c.next.date))} · ${fmtTime(c.next.start)}` : '<span class="muted">—</span>'}</span><span>${c.visits}</span><span>${brl(c.spent)}</span></div>`).join('')}
    </div></section>`;
}

function Barbers() {
  const day = A.date || nextOpenDay();
  const list = listBookings({ date: day }).filter((b) => b.status !== 'cancelado');
  const [o, c] = BUSINESS.hours[parseKey(day).getDay()] || [0, 1];
  return `${Top('Barbeiros', `Ocupação em ${esc(fmtDateLong(day))}`)}
    <div class="bcards">${BARBERS.map((b) => {
      const mine = list.filter((x) => x.barberId === b.id);
      const works = b.days.includes(parseKey(day).getDay());
      const occ = works ? Math.min(100, Math.round((mine.reduce((s, x) => s + x.duration, 0) / (c - o)) * 100)) : 0;
      const now = mine.find((x) => x.status === 'atendimento');
      const nx = mine.find((x) => ['agendado', 'confirmado', 'chegou'].includes(x.status));
      return `<article class="card bcard">
        <div class="bcard__top"><span class="avatar avatar--lg" style="--tone:${b.tone}">${b.initials}</span><div><h2>${esc(b.name)}</h2><p class="muted">${esc(b.specialty)}</p></div></div>
        <div class="meter"><span style="width:${occ}%"></span></div><p class="meter__l"><b>${works ? `${occ}%` : 'Folga'}</b> ${works ? 'da agenda ocupada' : 'neste dia'}</p>
        <dl class="bcard__dl"><div><dt>Atendimentos</dt><dd>${mine.length}</dd></div><div><dt>Receita prevista</dt><dd>${brl(mine.reduce((s, x) => s + x.price, 0))}</dd></div></dl>
        <p class="bcard__now">${now ? `${StatusBadge('atendimento')} ${esc(now.client.name)}` : nx ? `<span class="muted">Próximo:</span> ${fmtTime(nx.start)} · ${esc(nx.client.name)}` : '<span class="muted">Sem próximos horários</span>'}</p>
      </article>`;
    }).join('')}</div>`;
}

function Services() {
  const day = A.date || nextOpenDay();
  const list = listBookings({ date: day }).filter((b) => b.status !== 'cancelado');
  return `${Top('Serviços', `Desempenho em ${esc(fmtDateLong(day))}`)}
    <section class="card"><div class="table table--svc" role="table">
      <div class="table__h" role="row"><span>Serviço</span><span>Preço</span><span>Duração</span><span>Agendados</span><span>Receita prevista</span></div>
      ${SERVICES.map((s) => { const n = list.filter((b) => b.serviceId === s.id).length; return `<div class="table__r" role="row"><span class="t-name"><span class="svcic">${ICONS[s.icon]}</span><b>${esc(s.name)}</b></span><span>${brl(s.price)}</span><span class="muted">${fmtDur(s.duration)}</span><span>${n}</span><span>${brl(n * s.price)}</span></div>`; }).join('')}
    </div></section>`;
}
