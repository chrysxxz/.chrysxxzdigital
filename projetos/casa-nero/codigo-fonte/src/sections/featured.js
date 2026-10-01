import { DISHES } from '../data/menu.js';
import { Plate } from '../ui/plate.js';
import { ICONS } from '../ui/icons.js';
import { esc, brl } from '../core/utils.js';

export function Featured() {
  const list = DISHES.filter((d) => d.featured);
  return `<section class="sec feat" id="destaques" aria-label="Pratos em destaque">
    <div class="wrap feat__top">
      <div class="reveal"><p class="mono">02 · Da estação</p><h2 class="h2">Pratos que contam<br>a nossa cozinha.</h2></div>
      <div class="feat__nav reveal"><span class="mono" id="featCount">01 / ${String(list.length).padStart(2, '0')}</span><button type="button" class="round" data-feat="-1" aria-label="Prato anterior">${ICONS.chevL}</button><button type="button" class="round" data-feat="1" aria-label="Próximo prato">${ICONS.chevR}</button></div>
    </div>
    <div class="feat__track" id="featTrack" tabindex="0" aria-label="Carrossel de pratos">
      ${list.map((d, i) => `<article class="dish">
        <div class="dish__plate"><div class="dish__disc"></div>${Plate(d.plate, { label: `Ilustração: ${d.name}` })}</div>
        <div class="dish__body">
          <p class="mono">${String(i + 1).padStart(2, '0')} · ${esc({ entradas: 'Entrada', principais: 'Principal', sobremesas: 'Sobremesa' }[d.cat])}</p>
          <h3>${esc(d.name)}</h3>
          <p class="dish__story">${esc(d.story)}</p>
          <p class="dish__row"><span>${esc(d.desc)}</span><b>${brl(d.price)}</b></p>
        </div>
      </article>`).join('')}
    </div>
  </section>`;
}
