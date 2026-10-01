import { booking } from '../data/content.js';
import { config } from '../data/config.js';
import { icons } from '../components/icons.js';
import { waLink, bookingMessage } from '../lib/whatsapp.js';
import { esc } from '../lib/html.js';

const chips = (name, list, checkedIdx = -1) =>
  list.map((o, i) => `<label class="chip"><input type="radio" name="${name}" value="${esc(o)}"${i === checkedIdx ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('');

export function Booking() {
  const initial = bookingMessage({ service: booking.options[0] });
  return `<section class="sec book" id="agendamento" aria-labelledby="book-t">
    <div class="wrap book__grid">
      <div class="book__copy" data-reveal>
        <p class="eyebrow eyebrow--light"><span class="sh__idx">05</span>Agendamento</p>
        <h2 class="book__title" id="book-t">${esc(booking.title)}</h2>
        <p class="book__text">${esc(booking.text)}</p>
        <ul class="book__perks">
          <li>${icons.check}Resposta pelo WhatsApp</li>
          <li>${icons.check}Horário combinado com você</li>
          <li>${icons.check}Sem cadastro</li>
        </ul>
      </div>
      <form class="book__form" id="bookForm" data-reveal="scale" novalidate>
        <fieldset>
          <legend>Qual atendimento?</legend>
          <div class="chips">${chips('service', booking.options, 0)}</div>
        </fieldset>
        <div class="book__row">
          <label class="field"><span>Nome do pet <small>(opcional)</small></span><input name="petName" type="text" autocomplete="off" maxlength="40" placeholder="Ex.: Amora"></label>
          <label class="field"><span>Melhor período</span>
            <select name="period"><option value="">Sem preferência</option><option>Manhã</option><option>Tarde</option><option>Sábado</option></select>
          </label>
        </div>
        <fieldset>
          <legend>Porte</legend>
          <div class="chips chips--sm">${chips('size', booking.sizes)}</div>
        </fieldset>
        <div class="book__preview" aria-live="polite">
          <span class="book__preview-lbl">Mensagem que será enviada</span>
          <p id="bookPreview">${esc(initial).replace(/\n/g, '<br>')}</p>
        </div>
        <a class="btn btn--primary btn--lg btn--block" id="bookBtn" href="${waLink(initial)}" target="_blank" rel="noopener" data-wa><span class="btn__label">${esc(booking.cta)}</span><span class="btn__icon">${icons.whatsapp}</span></a>
        <p class="book__fine">WhatsApp ${esc(config.contact.whatsappDisplay)}${config.contact.phoneIsDemo ? ' · número fictício de demonstração' : ''}</p>
      </form>
    </div>
  </section>`;
}
