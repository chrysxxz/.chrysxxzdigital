/** Comparador antes/depois: input range acessível + arraste em toda a área. */
export function initBeforeAfter() {
  const box = document.getElementById('ba');
  if (!box) return;
  const range = box.querySelector('.ba__range');
  const set = (v) => { v = Math.max(0, Math.min(100, v)); box.style.setProperty('--pos', v + '%'); range.value = v; };
  range.addEventListener('input', () => set(+range.value));
  let drag = false;
  const fromEvent = (e) => { const r = box.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
  box.addEventListener('pointerdown', (e) => { drag = true; box.setPointerCapture(e.pointerId); fromEvent(e); });
  box.addEventListener('pointermove', (e) => { if (drag) fromEvent(e); });
  box.addEventListener('pointerup', () => { drag = false; });
  box.addEventListener('pointercancel', () => { drag = false; });
  // pequena "dica" de movimento quando aparece na tela
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return; io.disconnect();
      box.classList.add('is-hint'); set(62);
      setTimeout(() => set(40), 550); setTimeout(() => { set(50); box.classList.remove('is-hint'); }, 1100);
    }, { threshold: 0.6 });
    io.observe(box);
  }
}
