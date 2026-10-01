import { testimonials } from '../data/content.js';
import { esc } from '../lib/html.js';

export function Testimonials() {
  return `<section class="sec tst" aria-labelledby="tst-t">
    <div class="wrap">
      <div class="tst__top" data-reveal>
        <h2 class="tst__title" id="tst-t">${esc(testimonials.title)}</h2>
        <p class="tst__note">${esc(testimonials.note)}</p>
      </div>
      <div class="tst__grid">
        ${testimonials.items.map((t, i) => `<figure class="quote" data-reveal style="--d:${0.1 * i}s">
          <span class="quote__mark" aria-hidden="true">“</span>
          <blockquote>${esc(t.text)}</blockquote>
          <figcaption><b>${esc(t.author)}</b><span>${esc(t.pet)}</span></figcaption>
        </figure>`).join('')}
      </div>
    </div>
  </section>`;
}
