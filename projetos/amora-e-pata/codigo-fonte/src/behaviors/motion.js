/** Parallax discreto no hero e visibilidade do CTA fixo. */
export function initMotion() {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frame = document.querySelector('.hero__ph img');
  if (frame && !reduce) {
    let tick = false;
    addEventListener('scroll', () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const y = Math.min(scrollY, innerHeight);
        frame.style.transform = `translate3d(0, ${(y * 0.08).toFixed(1)}px, 0) scale(1.06)`;
      });
    }, { passive: true });
  }

  // CTA fixo: aparece depois do hero, some na seção de agendamento e no rodapé
  const fcta = document.getElementById('fcta');
  const heroCtas = document.querySelector('.hero__ctas');
  const book = document.getElementById('agendamento');
  const footer = document.querySelector('.ftr');
  if (!fcta || !('IntersectionObserver' in window)) return;
  const state = { hero: true, book: false, foot: false };
  const apply = () => fcta.classList.toggle('is-on', !state.hero && !state.book && !state.foot);
  const watch = (el, key) => el && new IntersectionObserver(([en]) => { state[key] = en.isIntersecting; apply(); }).observe(el);
  watch(heroCtas, 'hero'); watch(book, 'book'); watch(footer, 'foot');
}
