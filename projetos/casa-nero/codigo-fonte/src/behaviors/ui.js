/** Interações gerais: header, menu mobile, reveal, hero, carrossel, abas e prévia de pratos. */
import { findDish } from '../data/menu.js';
import { Plate } from '../ui/plate.js';
import { openStatus } from '../core/utils.js';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;

export function initChrome() {
  const hdr = document.getElementById('hdr'), burger = document.getElementById('burger'), mnav = document.getElementById('mnav');
  const mbar = document.getElementById('mbar'), hero = document.getElementById('top'), res = document.getElementById('reservas');
  const onScroll = () => {
    hdr.classList.toggle('is-solid', scrollY > 40);
    hdr.classList.toggle('is-light', scrollY > hero.offsetHeight - 80);
    const r = res.getBoundingClientRect();
    mbar.classList.toggle('is-on', scrollY > hero.offsetHeight * 0.6 && !(r.top < innerHeight && r.bottom > 0));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = (open) => { root.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', String(open)); mnav.setAttribute('aria-hidden', String(!open)); document.body.style.overflow = open ? 'hidden' : ''; };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 980) setMenu(false); });
}

export function initReveal() {
  const els = [...document.querySelectorAll('.reveal')];
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
  els.forEach((e) => io.observe(e));
  let t; addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(() => els.forEach((e) => { if (e.getBoundingClientRect().top < innerHeight) e.classList.add('in'); }), 140); }, { passive: true });
}

/** Prato do hero gira levemente com a rolagem; status "aberto agora" se atualiza. */
export function initHero() {
  const spin = document.querySelector('.hero__spin'); const hero = document.getElementById('top');
  if (spin && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => { tick = false; const y = Math.min(scrollY, hero.offsetHeight); spin.style.transform = `rotate(${(y * 0.06).toFixed(2)}deg) translateY(${(y * 0.12).toFixed(1)}px)`; });
    }, { passive: true });
  }
  setInterval(() => { const el = document.getElementById('liveStatus'); if (!el) return; const s = openStatus(); el.lastChild.textContent = s.text; el.classList.toggle('is-open', s.open); }, 60000);
}

export function initFeatured() {
  const track = document.getElementById('featTrack'); if (!track) return;
  const cards = [...track.children]; const count = document.getElementById('featCount');
  const pos = (k) => cards[k].offsetLeft - cards[0].offsetLeft;
  const current = () => { let best = 0; cards.forEach((c, k) => { if (Math.abs(pos(k) - track.scrollLeft) < Math.abs(pos(best) - track.scrollLeft)) best = k; }); return best; };
  const goTo = (i) => { i = Math.max(0, Math.min(cards.length - 1, i)); track.scrollTo({ left: pos(i), behavior: reduce ? 'auto' : 'smooth' }); };
  document.querySelectorAll('[data-feat]').forEach((b) => b.addEventListener('click', () => goTo(current() + +b.dataset.feat)));
  let t; track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(() => { count.textContent = `${String(current() + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`; }, 60); }, { passive: true });
  track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current() + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current() - 1); } });
  // arrastar com o mouse no desktop
  let down = false, sx = 0, sl = 0, moved = false;
  track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-drag'); });
  addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { if (!down) return; down = false; track.classList.remove('is-drag'); if (moved) goTo(current() + (track.scrollLeft > sl ? 1 : 0)); });
}

export function initMenu() {
  const tabs = [...document.querySelectorAll('.tab')], ink = document.getElementById('tabInk');
  const place = (t) => { ink.style.width = t.offsetWidth + 'px'; ink.style.transform = `translateX(${t.offsetLeft}px)`; };
  const select = (t, focus) => {
    tabs.forEach((x) => { const on = x === t; x.classList.toggle('is-on', on); x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1;
      const p = document.getElementById('panel-' + x.dataset.tab); p.hidden = !on; p.classList.toggle('is-on', on); });
    place(t); if (focus) t.focus();
    const bar = t.parentElement; bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  };
  tabs.forEach((t, i) => {
    t.tabIndex = i === 0 ? 0 : -1;
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', (e) => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { e.preventDefault(); select(tabs[(i + d + tabs.length) % tabs.length], true); } });
  });
  requestAnimationFrame(() => place(tabs[0])); addEventListener('resize', () => place(tabs.find((t) => t.classList.contains('is-on'))));
  document.fonts && document.fonts.ready.then(() => place(tabs.find((t) => t.classList.contains('is-on'))));

  // Prévia do prato: segue o cursor no desktop; no toque, expande dentro do item
  const peek = document.getElementById('peek'); const cache = {};
  const art = (id) => cache[id] || (cache[id] = Plate(findDish(id).plate, { label: '' }));
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.item[data-dish]').forEach((it) => {
    if (fine) {
      it.addEventListener('mouseenter', () => { peek.innerHTML = art(it.dataset.dish); peek.classList.add('is-on'); });
      it.addEventListener('mouseleave', () => peek.classList.remove('is-on'));
      it.addEventListener('mousemove', (e) => { peek.style.transform = `translate(${e.clientX + 24}px, ${e.clientY - 110}px)`; });
    } else {
      const toggle = () => { const open = it.classList.toggle('is-open'); if (open && !it.querySelector('.item__art')) it.insertAdjacentHTML('beforeend', `<div class="item__art">${art(it.dataset.dish)}</div>`); };
      it.addEventListener('click', toggle);
      it.addEventListener('keydown', (e) => { if (e.key === 'Enter') toggle(); });
    }
  });
  if (fine) document.querySelectorAll('.item[data-dish]').forEach((it) => it.addEventListener('focus', () => { const r = it.getBoundingClientRect(); peek.innerHTML = art(it.dataset.dish); peek.style.transform = `translate(${r.right - 240}px, ${r.top - 60}px)`; peek.classList.add('is-on'); }));
  document.querySelectorAll('.item[data-dish]').forEach((it) => it.addEventListener('blur', () => peek.classList.remove('is-on')));
  document.querySelectorAll('[data-occasion]').forEach((a) => a.addEventListener('click', () => { const s = document.querySelector('select[name="occasion"]'); if (s) s.value = a.dataset.occasion; }));
}
