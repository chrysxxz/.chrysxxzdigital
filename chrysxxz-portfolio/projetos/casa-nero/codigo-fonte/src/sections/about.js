import { RESTAURANT } from '../data/restaurant.js';
import { ICONS } from '../ui/icons.js';
import { esc } from '../core/utils.js';

const PILLARS = [
  ['flame', 'Fogo', 'Brasa de lenha de acácia e forno a lenha. Quase tudo passa pelo fogo antes de chegar à mesa.'],
  ['leaf', 'Estação', 'Um menu curto, que muda com a colheita de pequenos produtores dos arredores de Curitiba.'],
  ['hourglass', 'Tempo', 'Fermentações, cozimentos longos e um serviço que não apressa ninguém.'],
];

export function About() {
  return `<section class="sec about" id="casa">
    <div class="wrap about__grid">
      <p class="mono about__k reveal">01 · A casa</p>
      <div class="about__main">
        <h2 class="about__lead reveal">Vinte e oito lugares, uma cozinha aberta e a convicção de que <em>jantar bem</em> é uma forma de tempo bem gasto.</h2>
        <div class="about__cols reveal">
          <p>A Casa Nero ocupa um sobrado antigo no centro da cidade. A cozinha fica à vista, a brasa nunca apaga e o salão foi pensado para conversas longas: mesas afastadas, luz baixa e música em volume de fundo.</p>
          <p>À frente do fogão está a ${esc(RESTAURANT.chef)}, que construiu o menu a partir de três ideias simples. Ingrediente bom, fogo bem controlado e paciência. O resto é detalhe, e é nos detalhes que a casa se dedica.</p>
          <p class="about__sign"><span>${esc(RESTAURANT.chef)}</span><small>Chef e sócia · personagem fictícia</small></p>
        </div>
      </div>
      <ol class="pillars">${PILLARS.map(([ic, t, d], i) => `<li class="reveal" style="--d:${i * 0.08}s"><span class="mono">0${i + 1}</span>${ICONS[ic]}<h3>${t}</h3><p>${d}</p></li>`).join('')}</ol>
    </div>
  </section>`;
}
