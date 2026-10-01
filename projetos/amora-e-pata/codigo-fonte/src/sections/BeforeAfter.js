import { beforeAfter } from '../data/content.js';
import { SectionHeading } from '../components/SectionHeading.js';
import { Picture } from '../components/Picture.js';
import { esc } from '../lib/html.js';

export function BeforeAfter() {
  return `<section class="sec ba" aria-label="Antes e depois">
    <div class="wrap">
      ${SectionHeading({ index: '04', eyebrow: 'Resultado', title: beforeAfter.title, text: beforeAfter.text, align: 'center' })}
      <figure class="ba__fig" data-reveal="scale">
        <div class="ba__box" id="ba" style="--pos:50%">
          ${Picture('after', { cls: 'ba__img ba__after', sizes: '(max-width: 900px) 100vw, 1000px' })}
          ${Picture('before', { cls: 'ba__img ba__before', sizes: '(max-width: 900px) 100vw, 1000px' })}
          <span class="ba__label ba__label--b">${esc(beforeAfter.labels.before)}</span>
          <span class="ba__label ba__label--a">${esc(beforeAfter.labels.after)}</span>
          <span class="ba__handle" aria-hidden="true"><span class="ba__knob"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/></svg></span></span>
          <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Comparar antes e depois">
        </div>
        <figcaption class="ba__cap">${esc(beforeAfter.caption)}</figcaption>
      </figure>
    </div>
  </section>`;
}
