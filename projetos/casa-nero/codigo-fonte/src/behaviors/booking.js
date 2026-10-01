/** Reserva de mesa: pessoas → data → horário → área → dados → confirmação. */
import { RESTAURANT } from '../data/restaurant.js';
import { ICONS } from '../ui/icons.js';
import { openDays, getSlots, createReservation } from '../services/reservations.js';
import { esc, fmtTime, fmtDateLong, wdShort, monShort, fmtPhone, onlyDigits } from '../core/utils.js';

const S = { party: 2, date: null, time: null, area: 'salao' };

export function initBooking() {
  const form = document.getElementById('book'); if (!form) return;
  const dates = document.getElementById('dates'), times = document.getElementById('times'), sum = document.getElementById('bookSum');
  const btn = document.getElementById('bookBtn'), err = document.getElementById('bookErr');
  const days = openDays();
  S.date = (days.find((d) => d.open) || {}).key;

  const renderDates = () => {
    dates.innerHTML = days.map((d) => `<button type="button" role="option" class="date ${d.key === S.date ? 'is-sel' : ''}" data-date="${d.key}" aria-selected="${d.key === S.date}" ${d.open ? '' : 'disabled'}>
      <small>${d.key === days[0].key ? 'hoje' : wdShort(d.date)}</small><b>${d.date.getDate()}</b><small>${monShort(d.date)}</small></button>`).join('');
  };
  const renderTimes = () => {
    const slots = getSlots(S.date, S.party);
    if (S.time !== null && !slots.some((s) => s.time === S.time && s.left > 0)) S.time = null;
    const groups = [...new Set(slots.map((s) => s.shift))];
    times.innerHTML = slots.length ? groups.map((g) => `<div class="times__g"><span class="mono">${g}</span><div>${slots.filter((s) => s.shift === g).map((s) =>
      `<button type="button" class="time ${S.time === s.time ? 'is-sel' : ''} ${s.left === 1 ? 'is-last' : ''}" data-time="${s.time}" ${s.left ? '' : 'disabled'} aria-pressed="${S.time === s.time}">${fmtTime(s.time)}${s.left === 1 ? '<em>última mesa</em>' : s.left === 0 ? '<em>esgotado</em>' : ''}</button>`).join('')}</div></div>`).join('')
      : `<p class="times__empty">Sem horários neste dia. Escolha outra data.</p>`;
  };
  const renderAreas = () => form.querySelectorAll('input[name="area"]').forEach((i) => {
    const max = +i.dataset.max || 99, dis = S.party > max; i.disabled = dis; i.closest('.area').classList.toggle('is-off', dis);
    if (dis && i.checked) { i.checked = false; form.querySelector('input[name="area"]:not([disabled])').checked = true; }
  });
  const valid = () => S.date && S.time !== null && form.elements.name.value.trim().length >= 2 && onlyDigits(form.elements.phone.value).length >= 10;
  const renderSum = () => {
    const area = RESTAURANT.reservation.areas.find((a) => a.id === (form.querySelector('input[name="area"]:checked') || {}).value);
    sum.innerHTML = `<span>${ICONS.users}${S.party} ${S.party === 1 ? 'pessoa' : 'pessoas'}</span><span>${ICONS.cal}${S.date ? esc(fmtDateLong(S.date)) : '—'}</span><span>${ICONS.clock}${S.time !== null ? fmtTime(S.time) : 'escolha um horário'}</span><span>${ICONS.pin}${area ? esc(area.label) : ''}</span>`;
    btn.disabled = !valid();
  };
  const all = () => { renderDates(); renderTimes(); renderAreas(); renderSum(); };
  all();

  form.addEventListener('click', (e) => {
    const p = e.target.closest('[data-party]'), d = e.target.closest('[data-date]'), t = e.target.closest('[data-time]');
    if (p) { S.party = Math.max(1, Math.min(RESTAURANT.reservation.maxParty, S.party + +p.dataset.party)); document.getElementById('party').textContent = S.party; document.getElementById('partyLbl').textContent = S.party === 1 ? 'pessoa' : 'pessoas'; renderTimes(); renderAreas(); renderSum(); }
    if (d) { S.date = d.dataset.date; S.time = null; renderDates(); renderTimes(); renderSum(); }
    if (t) { S.time = +t.dataset.time; renderTimes(); renderSum(); }
  });
  form.addEventListener('input', (e) => { if (e.target.name === 'phone') e.target.value = fmtPhone(e.target.value); err.hidden = true; renderSum(); });
  form.addEventListener('change', renderSum);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!valid()) { err.textContent = 'Escolha um horário e informe nome e WhatsApp com DDD.'; err.hidden = false; return; }
    try {
      const area = form.querySelector('input[name="area"]:checked').value;
      const r = createReservation({ date: S.date, time: S.time, party: S.party, area, name: form.elements.name.value.trim(), phone: form.elements.phone.value, occasion: form.elements.occasion.value, notes: form.elements.notes.value.trim() });
      openModal(r); S.time = null; renderTimes(); renderSum();
    } catch (ex) { err.textContent = ex.message; err.hidden = false; S.time = null; renderTimes(); renderSum(); }
  });

  const modal = document.getElementById('modal');
  modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
}

function openModal(r) {
  const area = RESTAURANT.reservation.areas.find((a) => a.id === r.area);
  const msg = [`Olá, ${RESTAURANT.name}! Acabei de solicitar uma reserva pelo site.`, `• Código: ${r.code}`, `• ${fmtDateLong(r.date)}, ${fmtTime(r.time)}`, `• ${r.party} ${r.party === 1 ? 'pessoa' : 'pessoas'} · ${area.label}`, `• Nome: ${r.name}`,
    r.occasion && r.occasion !== 'Nenhuma' ? `• Ocasião: ${r.occasion}` : '', r.notes ? `• Obs.: ${r.notes}` : '', 'Podem confirmar?'].filter(Boolean).join('\n');
  document.getElementById('modalCard').innerHTML = `
    <button type="button" class="modal__x" data-close aria-label="Fechar">${ICONS.x}</button>
    <div class="modal__mark" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></div>
    <p class="mono">Reserva ${esc(r.code)} · solicitada</p>
    <h3 id="modalT">Até breve, ${esc(r.name.split(' ')[0])}.</h3>
    <dl class="modal__dl">
      <div><dt>Data</dt><dd>${esc(fmtDateLong(r.date))}</dd></div>
      <div><dt>Horário</dt><dd>${fmtTime(r.time)}</dd></div>
      <div><dt>Pessoas</dt><dd>${r.party}</dd></div>
      <div><dt>Espaço</dt><dd>${esc(area.label)}</dd></div>
    </dl>
    <p class="modal__txt">Para concluir, envie a confirmação pelo WhatsApp. A equipe responde confirmando a mesa.</p>
    <a class="btn btn--ember btn--lg btn--block" href="https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ICONS.whatsapp} Enviar pelo WhatsApp</a>
    <button type="button" class="btn btn--line btn--block" data-close>Voltar ao site</button>
    <p class="fine">Demonstração: número de WhatsApp fictício.</p>`;
  const m = document.getElementById('modal'); m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
  setTimeout(() => m.querySelector('.modal__x').focus(), 50);
}
function closeModal() { const m = document.getElementById('modal'); m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; }
