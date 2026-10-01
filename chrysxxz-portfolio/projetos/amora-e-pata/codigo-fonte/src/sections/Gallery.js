import { gallery } from '../data/content.js';
import { SectionHeading } from '../components/SectionHeading.js';
import { Picture } from '../components/Picture.js';
import { images } from '../data/images.js';
import { esc } from '../lib/html.js';

export function Gallery() {
  return `<section class="sec gallery" id="galeria" aria-label="Galeria">
    <div class="wrap">
      <div class="gallery__top">
        ${SectionHeading({ index: '03', eyebrow: 'Galeria', title: gallery.title, text: gallery.intro })}
        <div class="filters" role="tablist" aria-label="Filtrar galeria" data-reveal>
          ${gallery.filters.map((f, i) => `<button class="filter${i === 0 ? ' is-on' : ''}" type="button" role="tab" aria-selected="${i === 0}" data-filter="${f.id}">${esc(f.label)}</button>`).join('')}
        </div>
      </div>
      <div class="gal" id="gal">
        ${gallery.items.map((it, i) => `<button class="gal__item gal__item--${it.shape}" type="button" data-tag="${it.tag}" data-i="${i}" aria-label="Ampliar foto: ${esc(it.caption)}">
          ${Picture(it.image, { sizes: it.shape === 'big' || it.shape === 'wide' ? '(max-width: 700px) 100vw, 50vw' : '(max-width: 700px) 50vw, 25vw', widths: [400, 700, 1000, 1400] })}
          <span class="gal__cap">${esc(it.caption)}</span>
        </button>`).join('')}
      </div>
    </div>
    <div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Foto ampliada" hidden>
      <figure class="lb__fig"><img id="lbImg" alt=""><figcaption id="lbCap"></figcaption></figure>
      <button class="lb__btn lb__x" type="button" aria-label="Fechar">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6l12 12M18 6L6 18"/></svg>'}</button>
      <button class="lb__btn lb__pv" type="button" aria-label="Foto anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 5l-7 7 7 7"/></svg></button>
      <button class="lb__btn lb__nx" type="button" aria-label="Próxima foto"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5l7 7-7 7"/></svg></button>
      <p class="lb__ct" id="lbCt"></p>
    </div>
    <script type="application/json" id="galData">${JSON.stringify(gallery.items.map((it) => ({ src: images[it.image].src, alt: images[it.image].alt, caption: it.caption, tag: it.tag }))).replace(/</g, '\\u003c')}</script>
  </section>`;
}
