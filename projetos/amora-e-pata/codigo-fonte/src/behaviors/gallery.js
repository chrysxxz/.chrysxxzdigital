import { imgUrl } from '../data/images.js';

/** Filtros da galeria + lightbox (teclado, toque e foco acessíveis). */
export function initGallery() {
  const gal = document.getElementById('gal');
  if (!gal) return;
  const data = JSON.parse(document.getElementById('galData').textContent);
  const items = [...gal.querySelectorAll('.gal__item')];
  const filters = [...document.querySelectorAll('.filter')];

  filters.forEach((btn) => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach((b) => { const on = b === btn; b.classList.toggle('is-on', on); b.setAttribute('aria-selected', String(on)); });
    gal.classList.add('is-switching');
    setTimeout(() => {
      items.forEach((it) => { it.hidden = !(f === 'todos' || it.dataset.tag === f); });
      gal.dataset.filter = f;
      requestAnimationFrame(() => gal.classList.remove('is-switching'));
    }, 220);
  }));

  // Lightbox
  const lb = document.getElementById('lb');
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCap');
  const ct = document.getElementById('lbCt');
  let list = [], cur = 0, lastFocus = null;
  const show = (i) => {
    cur = (i + list.length) % list.length;
    const d = data[list[cur]];
    img.classList.remove('is-in');
    img.onload = () => img.classList.add('is-in');
    img.src = imgUrl(d.src, Math.min(1800, Math.round(innerWidth * devicePixelRatio)));
    img.alt = d.alt; cap.textContent = d.caption; ct.textContent = `${cur + 1} / ${list.length}`;
  };
  const open = (idx) => {
    list = items.filter((it) => !it.hidden).map((it) => +it.dataset.i);
    lastFocus = document.activeElement;
    lb.hidden = false; requestAnimationFrame(() => lb.classList.add('is-open'));
    document.documentElement.classList.add('lb-open'); document.body.style.overflow = 'hidden';
    show(list.indexOf(idx)); lb.querySelector('.lb__x').focus();
  };
  const close = () => {
    lb.classList.remove('is-open'); document.documentElement.classList.remove('lb-open'); document.body.style.overflow = '';
    setTimeout(() => { lb.hidden = true; }, 300); lastFocus?.focus();
  };
  items.forEach((it) => it.addEventListener('click', () => open(+it.dataset.i)));
  lb.querySelector('.lb__x').addEventListener('click', close);
  lb.querySelector('.lb__pv').addEventListener('click', () => show(cur - 1));
  lb.querySelector('.lb__nx').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
  addEventListener('keydown', (e) => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
    if (e.key === 'Tab') { // mantém o foco dentro do lightbox
      const f = [...lb.querySelectorAll('button')]; const i = f.indexOf(document.activeElement);
      e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  let x0 = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); x0 = null; });
}
