import { findDish } from '../data/menu.js';
import { Plate } from '../ui/plate.js';

/** Galeria editorial: pratos ilustrados, recortes em close e citações. */
const TILES = [
  { dish: 'bochecha', cls: 'g-a', bg: '#e8e1d5', cap: 'Bochecha 12 horas' },
  { quote: 'O menu é curto de propósito. Prefiro fazer dez pratos muito bem do que trinta mais ou menos.', who: 'Chef Helena Duarte', cls: 'g-b' },
  { dish: 'vieiras', cls: 'g-c', bg: '#1d1b19', cap: 'Vieiras · close', zoom: 1.9 },
  { dish: 'burrata', cls: 'g-d', bg: '#b5461f', cap: 'Burrata e tomates' },
  { dish: 'pera', cls: 'g-e', bg: '#d9d2c5', cap: 'Pera ao vinho' },
  { dish: 'nhoque', cls: 'g-f', bg: '#2a2724', cap: 'Nhoque de cabotiá · close', zoom: 1.7 },
  { quote: 'Brasa acesa das 16h até a última mesa.', who: 'Cozinha', cls: 'g-g', dark: true },
  { dish: 'peixe', cls: 'g-h', bg: '#e8e1d5', cap: 'Peixe na folha' },
];

export function Gallery() {
  return `<section class="sec gal" id="galeria">
    <div class="wrap">
      <div class="gal__top reveal"><p class="mono">05 · Galeria</p><h2 class="h2">Da cozinha<br>para a mesa.</h2><p class="gal__note">Ilustrações editoriais dos pratos da casa. No projeto real, este espaço recebe a fotografia gastronômica.</p></div>
      <div class="gal__grid">
        ${TILES.map((t) => t.quote
          ? `<figure class="gt gt--quote ${t.cls} ${t.dark ? 'is-dark' : ''} reveal"><blockquote>“${t.quote}”</blockquote><figcaption class="mono">${t.who}</figcaption></figure>`
          : `<figure class="gt ${t.cls} reveal" style="--bg:${t.bg}"><div class="gt__art" style="--z:${t.zoom || 1}">${Plate(findDish(t.dish).plate, { label: `Ilustração: ${t.cap}` })}</div><figcaption class="mono">${t.cap}</figcaption></figure>`).join('')}
      </div>
    </div>
  </section>`;
}
