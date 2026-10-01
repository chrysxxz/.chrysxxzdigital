/** Fade-up ao entrar na viewport. Cada elemento é revelado uma única vez. */
export function initReveal(root = document) {
  const els = [...root.querySelectorAll('[data-reveal]')];
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  els.forEach((e) => io.observe(e));
  // segurança para rolagem muito rápida
  let t;
  const sweep = () => els.forEach((e) => { if (!e.classList.contains('in') && e.getBoundingClientRect().top < innerHeight) e.classList.add('in'); });
  addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(sweep, 150); }, { passive: true });
}
