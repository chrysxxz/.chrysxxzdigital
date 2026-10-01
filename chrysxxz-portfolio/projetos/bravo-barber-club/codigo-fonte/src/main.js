/** BRAVO Barber Club — aplicação (site + agendamento + cliente + painel) */
import { parseRoute } from './core/router.js';
import { SiteView } from './views/site.js';
import { BookingView, mountBooking } from './views/booking.js';
import { ClientView, mountClient } from './views/client.js';
import { AdminView, mountAdmin } from './views/admin.js';
import { ICONS } from './ui/icons.js';

const root = document.getElementById('app');
let cleanup = null;

function DemoBar(view) {
  const L = [['site', '#/', 'Site', 'globe'], ['client', '#/cliente', 'Cliente', 'user'], ['admin', '#/painel', 'Painel', 'grid']];
  const on = view === 'booking' ? 'site' : view;
  return `<div class="demobar" role="navigation" aria-label="Alternar experiência da demonstração">
    <span class="demobar__lbl"><i></i>Demo<span class="demobar__long"> · Ecossistema BRAVO</span></span>
    <div class="demobar__seg">${L.map(([id, href, l, ic]) => `<a href="${href}" class="${on === id ? 'is-on' : ''}">${ICONS[ic]}<span>${l}</span></a>`).join('')}</div>
    <span class="demobar__by">Chrysxxz Digital</span>
  </div>`;
}

function render() {
  if (cleanup) { cleanup(); cleanup = null; }
  const r = parseRoute();
  document.documentElement.dataset.view = r.view;
  document.body.style.overflow = '';
  let html = '';
  if (r.view === 'booking') html = BookingView(r.params);
  else if (r.view === 'client') html = ClientView();
  else if (r.view === 'admin') html = AdminView(r.tab);
  else html = SiteView();
  root.innerHTML = DemoBar(r.view) + html;

  if (r.view === 'booking') mountBooking();
  if (r.view === 'client') cleanup = mountClient();
  if (r.view === 'admin') cleanup = mountAdmin();
  const siteOff = r.view === 'site' || r.view === 'client' ? mountSiteChrome() : null;
  if (siteOff) { const prev = cleanup; cleanup = () => { prev && prev(); siteOff(); }; }

  if (r.view === 'site' && r.section) {
    const el = document.getElementById(r.section);
    requestAnimationFrame(() => el ? el.scrollIntoView({ behavior: 'smooth' }) : scrollTo(0, 0));
  } else scrollTo(0, 0);
  requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
}

/** Header, menu mobile, reveal e CTA fixo do site. */
function mountSiteChrome() {
  const hdr = document.getElementById('hdr'), burger = document.getElementById('burger');
  const onScroll = () => { hdr && hdr.classList.toggle('is-solid', scrollY > 30); const s = document.getElementById('stickycta'); if (s) s.classList.toggle('is-on', scrollY > innerHeight * 0.7 && innerHeight + scrollY < document.body.scrollHeight - 260); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const setMenu = (open) => { document.documentElement.classList.toggle('menu-open', open); burger && burger.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; };
  burger && burger.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
  document.querySelectorAll('#mnav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  const els = [...document.querySelectorAll('.reveal')];
  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    els.forEach((e) => io.observe(e));
  } else els.forEach((e) => e.classList.add('in'));
  let t; const sweep = () => els.forEach((e) => { if (e.getBoundingClientRect().top < innerHeight) e.classList.add('in'); });
  const onS = () => { clearTimeout(t); t = setTimeout(sweep, 150); };
  addEventListener('scroll', onS, { passive: true });
  return () => { removeEventListener('scroll', onScroll); removeEventListener('scroll', onS); io && io.disconnect(); setMenu(false); };
}

addEventListener('hashchange', render);
render();
