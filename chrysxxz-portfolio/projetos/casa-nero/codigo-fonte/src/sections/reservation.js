import { RESTAURANT } from '../data/restaurant.js';
import { ICONS } from '../ui/icons.js';
import { esc } from '../core/utils.js';

export function Reservation() {
  const r = RESTAURANT.reservation;
  return `<section class="sec res" id="reservas">
    <div class="wrap res__grid">
      <div class="res__intro">
        <p class="mono reveal">06 · Reservas</p>
        <h2 class="h2 reveal">Reserve<br>sua mesa.</h2>
        <p class="res__txt reveal">Escolha a data, o horário e quantas pessoas vêm com você. Confirmamos em seguida pelo WhatsApp.</p>
        <ul class="res__notes reveal">
          <li>${ICONS.clock}Tolerância de 15 minutos</li>
          <li>${ICONS.users}Grupos acima de ${r.maxParty}: fale com a gente</li>
          <li>${ICONS.whatsapp}Dúvidas? <a href="https://wa.me/${RESTAURANT.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
      <form class="book reveal" id="book" novalidate>
        <div class="book__step">
          <p class="book__lbl"><span>1</span>Quantas pessoas?</p>
          <div class="stepper" role="group" aria-label="Número de pessoas">
            <button type="button" data-party="-1" aria-label="Menos uma pessoa">${ICONS.minus}</button>
            <output id="party" aria-live="polite">2</output><span id="partyLbl">pessoas</span>
            <button type="button" data-party="1" aria-label="Mais uma pessoa">${ICONS.plus}</button>
          </div>
        </div>
        <div class="book__step">
          <p class="book__lbl"><span>2</span>Qual dia?</p>
          <div class="dates" id="dates" role="listbox" aria-label="Datas disponíveis"></div>
        </div>
        <div class="book__step">
          <p class="book__lbl"><span>3</span>Qual horário?</p>
          <div class="times" id="times"></div>
        </div>
        <div class="book__step">
          <p class="book__lbl"><span>4</span>Onde prefere sentar?</p>
          <div class="areas" id="areas">${r.areas.map((a, i) => `<label class="area"><input type="radio" name="area" value="${a.id}" ${i === 0 ? 'checked' : ''} ${a.max ? `data-max="${a.max}"` : ''}><span><b>${esc(a.label)}</b><small>${esc(a.hint)}</small></span></label>`).join('')}</div>
        </div>
        <div class="book__step book__who">
          <p class="book__lbl"><span>5</span>Seus dados</p>
          <div class="fields">
            <label class="field"><span>Nome</span><input name="name" autocomplete="name" maxlength="60" placeholder="Nome para a reserva"></label>
            <label class="field"><span>WhatsApp</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(41) 90000-0000"></label>
            <label class="field"><span>Ocasião</span><select name="occasion">${r.occasions.map((o) => `<option>${esc(o)}</option>`).join('')}<option>Menu degustação</option></select></label>
            <label class="field"><span>Observações <small>(alergias, pedidos)</small></span><input name="notes" maxlength="140" placeholder="Opcional"></label>
          </div>
        </div>
        <div class="book__sum" id="bookSum"></div>
        <p class="alert" id="bookErr" role="alert" hidden></p>
        <button class="btn btn--ember btn--lg btn--block" type="submit" id="bookBtn" disabled>Solicitar reserva ${ICONS.arrow}</button>
        <p class="fine">Demonstração: nenhuma reserva real é feita. Os dados ficam só neste navegador.</p>
      </form>
    </div>
    <div class="modal" id="modal" aria-hidden="true"><div class="modal__bg" data-close></div><div class="modal__card" role="dialog" aria-modal="true" aria-labelledby="modalT" id="modalCard"></div></div>
  </section>`;
}
