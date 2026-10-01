import { RESTAURANT } from '../data/restaurant.js';
import { esc } from '../core/utils.js';

const EVENING = [
  ['19h00', 'Chegada', 'Você é recebido pelo nome. Um vermute da casa espera no balcão enquanto a mesa termina de ser posta.'],
  ['19h30', 'Pão e brasa', 'O pão de fermentação natural chega quente, com manteiga noisette. A brasa já está no ponto.'],
  ['20h00', 'Os tempos', 'Pratos pequenos e precisos, servidos no ritmo da mesa. A sommelière acompanha cada escolha.'],
  ['22h00', 'Doce e café', 'Sobremesa, café coado na hora e nenhuma pressa para pedir a conta.'],
];

export function Experience() {
  return `<section class="sec exp" id="experiencia">
    <div class="wrap exp__grid">
      <div class="exp__side">
        <p class="mono reveal">04 · Experiência</p>
        <h2 class="h2 reveal">Uma noite<br>na Casa Nero.</h2>
        <p class="exp__txt reveal">Jantar aqui é um roteiro sem pressa. Este é o ritmo de uma noite comum de terça a sábado.</p>
      </div>
      <ol class="evening">${EVENING.map(([t, h, d], i) => `<li class="reveal" style="--d:${i * 0.06}s"><span class="evening__t">${t}</span><div><h3>${h}</h3><p>${d}</p></div></li>`).join('')}</ol>
    </div>
    <div class="wrap spaces">
      ${RESTAURANT.reservation.areas.map((a, i) => `<article class="space space--${a.id} reveal" style="--d:${i * 0.08}s">
        <div class="space__art" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="space__body"><p class="mono">Espaço 0${i + 1}</p><h3>${esc(a.label)}</h3><p>${esc(a.hint)}</p></div>
      </article>`).join('')}
    </div>
  </section>`;
}
