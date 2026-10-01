import { experience } from '../data/content.js';
import { Picture } from '../components/Picture.js';
import { esc } from '../lib/html.js';

export function Experience() {
  return `<section class="sec exp" id="cuidados" aria-labelledby="exp-t">
    <div class="wrap exp__grid">
      <div class="exp__copy">
        <p class="eyebrow eyebrow--light" data-reveal><span class="sh__idx">02</span>${esc(experience.eyebrow)}</p>
        <h2 class="exp__title" id="exp-t" data-reveal>${esc(experience.title)}</h2>
        <p class="exp__text" data-reveal>${esc(experience.text)}</p>
        <ol class="steps">
          ${experience.steps.map((s, i) => `<li class="step" data-reveal style="--d:${0.08 * i}s">
            <span class="step__n">${String(i + 1).padStart(2, '0')}</span>
            <div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>
          </li>`).join('')}
        </ol>
      </div>
      <div class="exp__media" data-reveal>
        ${Picture(experience.image, { cls: 'exp__ph', sizes: '(max-width: 900px) 100vw, 46vw' })}
        ${Picture(experience.imageSecondary, { cls: 'exp__ph2', sizes: '(max-width: 900px) 40vw, 18vw', widths: [320, 480, 800] })}
      </div>
    </div>
  </section>`;
}
