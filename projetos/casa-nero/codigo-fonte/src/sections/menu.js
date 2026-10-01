import { CATEGORIES, DISHES, TASTING } from '../data/menu.js';
import { ICONS } from '../ui/icons.js';
import { esc, brl } from '../core/utils.js';

const TAGS = { V: 'Vegetariano', SG: 'Sem glúten', VG: 'Vegano' };

export function Menu() {
  return `<section class="sec menu" id="menu">
    <div class="wrap">
      <div class="menu__top">
        <div class="reveal"><p class="mono">03 · Menu</p><h2 class="h2">À la carte</h2></div>
        <p class="menu__legend reveal">${Object.entries(TAGS).map(([k, v]) => `<span><abbr title="${v}">${k}</abbr> ${v}</span>`).join('')}</p>
      </div>
      <div class="tabs reveal" role="tablist" aria-label="Categorias do menu">
        ${CATEGORIES.map((c, i) => `<button type="button" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0}" class="tab ${i === 0 ? 'is-on' : ''}" data-tab="${c.id}">${esc(c.label)}</button>`).join('')}
        <span class="tabs__ink" id="tabInk"></span>
      </div>
      <div class="menu__grid">
        <div class="menu__panels">
          ${CATEGORIES.map((c, i) => `<div class="panel ${i === 0 ? 'is-on' : ''}" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" ${i === 0 ? '' : 'hidden'}>
            <p class="panel__note">${esc(c.note)}</p>
            <ul class="items">${DISHES.filter((d) => d.cat === c.id).map((d) => `<li class="item" ${d.noPlate ? '' : `data-dish="${d.id}"`} tabindex="0">
              <div class="item__row"><h3>${esc(d.name)}</h3><span class="item__dots" aria-hidden="true"></span><b>${brl(d.price)}</b></div>
              <p>${esc(d.desc)}${d.tags.length ? ` <span class="item__tags">${d.tags.map((t) => `<abbr title="${TAGS[t]}">${t}</abbr>`).join('')}</span>` : ''}</p>
            </li>`).join('')}</ul>
          </div>`).join('')}
        </div>
        <aside class="tasting reveal" id="menu-degustacao">
          <p class="mono">Menu degustação</p>
          <h3>${esc(TASTING.name)}</h3>
          <ol>${TASTING.courses.map((c) => `<li>${esc(c)}</li>`).join('')}</ol>
          <div class="tasting__price"><div><b>${brl(TASTING.price)}</b><small>por pessoa</small></div><div><b>+ ${brl(TASTING.pairing)}</b><small>harmonização</small></div></div>
          <p class="tasting__days">${ICONS.clock} ${esc(TASTING.days)} · reserva recomendada</p>
          <a class="btn btn--ember btn--block" href="#reservas" data-occasion="Menu degustação">Reservar o degustação ${ICONS.arrow}</a>
        </aside>
      </div>
      <p class="menu__fine">Cardápio fictício para demonstração. Preços em reais, serviço opcional de 10%.</p>
    </div>
    <div class="peek" id="peek" aria-hidden="true"></div>
  </section>`;
}
