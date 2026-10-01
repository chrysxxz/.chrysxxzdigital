/** Header sólido ao rolar, menu mobile animado e link ativo. */
export function initHeader() {
  const root = document.documentElement;
  const hdr = document.getElementById('hdr');
  const burger = document.getElementById('burger');
  const mnav = document.getElementById('mnav');
  const onScroll = () => hdr.classList.toggle('is-solid', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const setMenu = (open) => {
    root.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mnav.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 960 && root.classList.contains('menu-open')) setMenu(false); });

  const links = [...document.querySelectorAll('.hdr__nav a')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-on', a.hash === '#' + en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach((a) => { const s = document.querySelector(a.hash); if (s) io.observe(s); });
  }
}
