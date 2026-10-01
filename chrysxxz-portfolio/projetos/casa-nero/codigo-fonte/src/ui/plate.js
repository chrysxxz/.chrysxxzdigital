/**
 * ILUSTRAÇÕES DE PRATOS (vista de cima) — SVG gerado por dados.
 * ------------------------------------------------------------
 * As prévias publicadas não carregam fotos externas, então cada prato é
 * desenhado a partir de uma "receita visual" em menu.js.
 * No projeto real, substitua <Plate/> por <img src="foto-do-prato.jpg">.
 */
let UID = 0;
function rng(seed) { let s = seed | 0 || 1; return () => { s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const f = (n) => Math.round(n * 100) / 100;
const rad = (d) => (d * Math.PI) / 180;
const P = (r, a) => [100 + r * Math.cos(rad(a)), 100 + r * Math.sin(rad(a))];
function shade(hex, amt) { const n = parseInt(hex.slice(1), 16); const c = [16, 8, 0].map((s) => Math.max(0, Math.min(255, ((n >> s) & 255) + amt))); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); }

const PLATES = {
  porcelain: { r: 80, well: 56, rim: ['#f7f4ee', '#e4ded3'], wellC: ['#faf8f3', '#ece7de'] },
  cream: { r: 80, well: 54, rim: ['#efe6d6', '#d9ccb6'], wellC: ['#f3ebdd', '#e2d6c2'] },
  stone: { r: 78, well: 58, rim: ['#34312e', '#242220'], wellC: ['#2f2c29', '#262422'], speck: true },
  clay: { r: 78, well: 56, rim: ['#b56a4c', '#8f4c33'], wellC: ['#e9dfd0', '#d9ccb8'] },
  bowl: { r: 72, well: 52, rim: ['#f2eee7', '#d8d1c5'], wellC: ['#d9d2c6', '#f4f0e9'], bowl: true },
};

export function Plate(spec, { cls = '', label = '' } = {}) {
  const id = 'p' + (++UID);
  const R = rng(spec.seed || 7);
  const pl = PLATES[spec.plate || 'porcelain'];
  const defs = [];
  const out = [];
  const grad = (stops, type = 'radial', attrs = '') => {
    const gid = `${id}g${defs.length}`;
    defs.push(`<${type}Gradient id="${gid}" ${attrs}>${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join('')}</${type}Gradient>`);
    return `url(#${gid})`;
  };

  // sombra e prato
  out.push(`<circle cx="106" cy="110" r="${pl.r + 8}" fill="${grad([[0.72, '#000', 0.45], [1, '#000', 0]])}"/>`);
  out.push(`<circle cx="100" cy="100" r="${pl.r}" fill="${grad([[0, pl.rim[0]], [0.85, pl.rim[0]], [1, pl.rim[1]]], 'radial', 'cx=".42" cy=".38" r=".7"')}"/>`);
  if (pl.speck) for (let i = 0; i < 120; i++) { const [x, y] = P(R() * pl.r * 0.98, R() * 360); out.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.3 + R() * 0.7)}" fill="#6b645c" opacity="${f(0.25 + R() * 0.4)}"/>`); }
  out.push(`<circle cx="100" cy="100" r="${pl.well}" fill="${grad(pl.bowl ? [[0, pl.wellC[1]], [0.75, pl.wellC[1]], [1, pl.wellC[0]]] : [[0, pl.wellC[0]], [1, pl.wellC[1]]], 'radial', 'cx=".45" cy=".42"')}"/>`);
  out.push(`<circle cx="100" cy="100" r="${pl.well}" fill="none" stroke="#000" stroke-opacity="${pl.speck ? 0.35 : 0.06}" stroke-width="1.2"/>`);
  out.push(`<path d="M${P(pl.r - 3, 200).map(f)} A${pl.r - 3} ${pl.r - 3} 0 0 1 ${P(pl.r - 3, 290).map(f)}" fill="none" stroke="#fff" stroke-opacity="${pl.speck ? 0.12 : 0.7}" stroke-width="1.6" stroke-linecap="round"/>`);

  for (const el of spec.items || []) out.push(EL[el.t](el, R, grad));

  return `<svg class="plate ${cls}" viewBox="0 0 200 200" role="img" aria-label="${label || 'Ilustração do prato'}"><defs>${defs.join('')}</defs>${out.join('')}</svg>`;
}

const EL = {
  /* pincelada de molho em arco, afinando nas pontas */
  swoosh({ c, r = 36, a0 = 200, a1 = 320, w = 12, gloss = true }, R, grad) {
    const n = 28, top = [], bot = [];
    for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + (a1 - a0) * t, ww = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.7) * (0.85 + 0.3 * Math.sin(t * 9)); top.push(P(r + ww, a)); bot.push(P(r - ww, a)); }
    const d = 'M' + top.map((p) => p.map(f).join(',')).join(' L') + ' L' + bot.reverse().map((p) => p.map(f).join(',')).join(' L') + 'Z';
    const fill = grad([[0, shade(c, 25)], [1, shade(c, -25)]], 'linear', 'x1="0" y1="0" x2="1" y2="1"');
    let s = `<path d="${d}" fill="${fill}"/>`;
    if (gloss) { const g = []; for (let i = 3; i <= n - 6; i++) g.push(P(r + w * 0.18, a0 + ((a1 - a0) * i) / n)); s += `<path d="M${g.map((p) => p.map(f).join(',')).join(' L')}" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".9" stroke-linecap="round"/>`; }
    return s;
  },
  /* pontos de molho/purê */
  dots({ c, n = 6, r = 40, a0 = 20, a1 = 140, s = [2, 5] }, R, grad) {
    let o = '';
    for (let i = 0; i < n; i++) { const a = a0 + ((a1 - a0) * i) / Math.max(1, n - 1), rr = s[0] + (s[1] - s[0]) * (0.5 + 0.5 * Math.sin(i * 1.7)); const [x, y] = P(r + (R() - 0.5) * 4, a); o += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="${grad([[0, shade(c, 30)], [1, c]], 'radial', 'cx=".35" cy=".3"')}"/><circle cx="${f(x - rr * 0.3)}" cy="${f(y - rr * 0.35)}" r="${f(rr * 0.25)}" fill="#fff" opacity=".55"/>`; }
    return o;
  },
  /* poça de molho brilhante */
  pool({ c, x = 100, y = 100, rx = 30, ry = 26, rot = 0 }, R, grad) {
    return `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${grad([[0, shade(c, 18)], [0.8, c], [1, shade(c, -20)]], 'radial', 'cx=".4" cy=".35"')}"/><ellipse cx="${x - rx * 0.35}" cy="${y - ry * 0.45}" rx="${rx * 0.35}" ry="${ry * 0.12}" fill="#fff" opacity=".22"/></g>`;
  },
  /* proteína selada (retângulo arredondado) com marcas de grelha */
  protein({ c = '#6b3a24', inner = '#c98b6b', x = 100, y = 100, w = 44, h = 26, rot = -12, grill = true, r = 8 }, R, grad) {
    const fill = grad([[0, shade(c, 30)], [0.45, c], [1, shade(c, -30)]], 'linear', 'x1="0" y1="0" x2="1" y2="1"');
    let s = `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - w / 2 + 2}" y="${y - h / 2 + 3}" width="${w}" height="${h}" rx="${r}" fill="#000" opacity=".22"/><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
    s += `<rect x="${x - w / 2 + 3}" y="${y - h / 2 + 3}" width="${w - 6}" height="${h - 6}" rx="${r - 2}" fill="none" stroke="${inner}" stroke-opacity=".35" stroke-width="1"/>`;
    if (grill) for (let i = -2; i <= 2; i++) s += `<path d="M${x + i * 8 - 5},${y - h / 2 + 3} L${x + i * 8 + 5},${y + h / 2 - 3}" stroke="#1d0f08" stroke-opacity=".55" stroke-width="2.2" stroke-linecap="round"/>`;
    s += `<path d="M${x - w / 2 + r},${y - h / 2 + 2.5} L${x + w / 2 - r},${y - h / 2 + 2.5}" stroke="#fff" stroke-opacity=".3" stroke-width="1.2" stroke-linecap="round"/></g>`;
    return s;
  },
  /* discos: vieiras, nhoques, tartar moldado */
  discs({ c, list = [[100, 100, 12]], sear = true, top = null }, R, grad) {
    return list.map(([x, y, r]) => {
      let s = `<circle cx="${x + 1.5}" cy="${y + 2.5}" r="${r}" fill="#000" opacity=".2"/><circle cx="${x}" cy="${y}" r="${r}" fill="${grad([[0, shade(c, 28)], [0.7, c], [1, shade(c, -25)]], 'radial', 'cx=".38" cy=".34"')}"/>`;
      if (sear) s += `<circle cx="${x}" cy="${y}" r="${r * 0.62}" fill="${grad([[0, '#8a5a2b', 0.9], [1, '#c48a4a', 0.2]], 'radial')}"/>`;
      if (top) s += `<circle cx="${x}" cy="${y}" r="${r * 0.55}" fill="${top}"/>`;
      s += `<ellipse cx="${x - r * 0.35}" cy="${y - r * 0.4}" rx="${r * 0.28}" ry="${r * 0.14}" fill="#fff" opacity=".35" transform="rotate(-30 ${x - r * 0.35} ${y - r * 0.4})"/>`;
      return s;
    }).join('');
  },
  /* quenelle (sorvete, creme, purê) */
  quenelle({ c = '#f1e6cc', x = 100, y = 100, l = 26, w = 13, rot = -25 }, R, grad) {
    const d = `M${x - l / 2},${y} C${x - l / 4},${y - w / 2 - 2} ${x + l / 4},${y - w / 2 - 2} ${x + l / 2},${y} C${x + l / 4},${y + w / 2 + 2} ${x - l / 4},${y + w / 2 + 2} ${x - l / 2},${y}Z`;
    return `<g transform="rotate(${rot} ${x} ${y})"><path d="${d}" fill="#000" opacity=".18" transform="translate(1.5 2.5)"/><path d="${d}" fill="${grad([[0, shade(c, 18)], [0.7, c], [1, shade(c, -22)]], 'radial', 'cx=".4" cy=".35"')}"/><path d="M${x - l / 3},${y - w / 5} C${x - l / 8},${y - w / 2.4} ${x + l / 6},${y - w / 2.4} ${x + l / 3},${y - w / 6}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1" stroke-linecap="round"/><path d="M${x - l / 2.6},${y + 1} C${x},${y - 1} ${x + l / 5},${y + 2} ${x + l / 2.6},${y}" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="1"/></g>`;
  },
  /* fatias finas sobrepostas (beterraba, rabanete, pera) */
  slices({ c, ring = null, n = 5, x = 100, y = 100, r = 11, spread = 16, a0 = 0 }, R, grad) {
    let s = '';
    for (let i = 0; i < n; i++) { const a = rad(a0 + (360 / n) * i), cx = x + Math.cos(a) * spread, cy = y + Math.sin(a) * spread;
      s += `<circle cx="${f(cx + 1)}" cy="${f(cy + 1.5)}" r="${r}" fill="#000" opacity=".12"/><circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${grad([[0, shade(c, 22)], [1, c]], 'radial', 'cx=".4" cy=".35"')}" opacity=".96"/>`;
      if (ring) s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r * 0.7}" fill="none" stroke="${ring}" stroke-width="1.2" opacity=".6"/>`; }
    return s;
  },
  /* grãos (arroz negro, farofa) formando um monte */
  grains({ c = '#1d1a19', x = 100, y = 100, r = 30, n = 180, gl = '#8b8580' }, R) {
    let s = `<circle cx="${x + 2}" cy="${y + 3}" r="${r}" fill="#000" opacity=".22"/><circle cx="${x}" cy="${y}" r="${r * 0.98}" fill="${c}"/>`;
    for (let i = 0; i < n; i++) { const a = R() * 360, d = Math.sqrt(R()) * r * 0.95; const [px, py] = [x + Math.cos(rad(a)) * d, y + Math.sin(rad(a)) * d];
      s += `<ellipse cx="${f(px)}" cy="${f(py)}" rx="2.1" ry="0.9" transform="rotate(${f(R() * 180)} ${f(px)} ${f(py)})" fill="${shade(c, 10 + R() * 25)}"/>`;
      if (R() < 0.18) s += `<ellipse cx="${f(px)}" cy="${f(py - 0.3)}" rx="1" ry=".3" fill="${gl}" opacity=".7"/>`; }
    return s;
  },
  /* anéis (lula) */
  rings({ list, c = '#f3ede1' }, R) {
    return list.map(([x, y, rx, ry, rot]) => `<ellipse cx="${x + 1}" cy="${y + 2}" rx="${rx}" ry="${ry}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="3.2" transform="rotate(${rot} ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="${c}" stroke-width="3.2" transform="rotate(${rot} ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="none" stroke="#6b3a24" stroke-opacity=".4" stroke-width="1" stroke-dasharray="2 4" transform="rotate(${rot} ${x} ${y})"/>`).join('');
  },
  /* micro-folhas */
  leaves({ x = 100, y = 100, n = 7, spread = 14, c = ['#4f6b35', '#6f8a45', '#3c552a'], size = 1 }, R) {
    let s = '';
    for (let i = 0; i < n; i++) { const px = x + (R() - 0.5) * spread * 2, py = y + (R() - 0.5) * spread * 2, rot = R() * 360, col = c[i % c.length], L = (3 + R() * 2.5) * size;
      s += `<g transform="rotate(${f(rot)} ${f(px)} ${f(py)})"><path d="M${f(px - L)},${f(py)} Q${f(px)},${f(py - L * 0.55)} ${f(px + L)},${f(py)} Q${f(px)},${f(py + L * 0.55)} ${f(px - L)},${f(py)}Z" fill="${col}"/><path d="M${f(px - L * 0.8)},${f(py)} L${f(px + L * 0.8)},${f(py)}" stroke="#000" stroke-opacity=".2" stroke-width=".35"/></g>`; }
    return s;
  },
  /* flores comestíveis */
  flowers({ list, c = '#e9b3c4', core = '#f2cf5b' }) {
    return list.map(([x, y, r = 2.4]) => { let s = ''; for (let i = 0; i < 5; i++) { const a = rad(i * 72); s += `<circle cx="${f(x + Math.cos(a) * r)}" cy="${f(y + Math.sin(a) * r)}" r="${f(r * 0.75)}" fill="${c}"/>`; } return s + `<circle cx="${x}" cy="${y}" r="${f(r * 0.45)}" fill="${core}"/>`; }).join('');
  },
  /* farelo/crocante */
  crumble({ x = 100, y = 100, n = 26, spread = 18, c = '#a8743f' }, R) {
    let s = ''; for (let i = 0; i < n; i++) { const px = x + (R() - 0.5) * spread * 2, py = y + (R() - 0.5) * spread; s += `<rect x="${f(px)}" y="${f(py)}" width="${f(1 + R() * 2.2)}" height="${f(1 + R() * 1.8)}" rx=".6" transform="rotate(${f(R() * 90)} ${f(px)} ${f(py)})" fill="${shade(c, Math.round((R() - 0.5) * 50))}"/>`; } return s;
  },
  /* gotas de azeite */
  oil({ list, c = '#c9a227' }) {
    return list.map(([x, y, r = 1.8]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".85"/><circle cx="${x - r * 0.3}" cy="${y - r * 0.3}" r="${r * 0.35}" fill="#fff" opacity=".7"/>`).join('');
  },
  /* flocos de sal */
  salt({ x = 100, y = 100, n = 14, spread = 20 }, R) {
    let s = ''; for (let i = 0; i < n; i++) { const px = x + (R() - 0.5) * spread * 2, py = y + (R() - 0.5) * spread * 2; s += `<rect x="${f(px)}" y="${f(py)}" width="1.4" height="1.4" transform="rotate(${f(R() * 90)} ${f(px)} ${f(py)})" fill="#fff" opacity=".9"/>`; } return s;
  },
  /* folha grande (bananeira) sob o peixe */
  leaf({ x = 100, y = 100, l = 110, w = 50, rot = -20, c = '#35502c' }, R, grad) {
    const d = `M${x - l / 2},${y} C${x - l / 4},${y - w / 2} ${x + l / 4},${y - w / 2} ${x + l / 2},${y} C${x + l / 4},${y + w / 2} ${x - l / 4},${y + w / 2} ${x - l / 2},${y}Z`;
    let s = `<g transform="rotate(${rot} ${x} ${y})"><path d="${d}" fill="${grad([[0, shade(c, 25)], [1, shade(c, -15)]], 'linear', 'x1="0" y1="0" x2="0" y2="1"')}"/><path d="M${x - l / 2 + 4},${y} L${x + l / 2 - 4},${y}" stroke="#a9c28a" stroke-opacity=".5" stroke-width="1"/>`;
    for (let i = -4; i <= 4; i++) s += `<path d="M${x + i * 11},${y} L${x + i * 11 + 9},${y - w / 2 + 6}" stroke="#a9c28a" stroke-opacity=".18" stroke-width=".6"/><path d="M${x + i * 11},${y} L${x + i * 11 + 9},${y + w / 2 - 6}" stroke="#000" stroke-opacity=".12" stroke-width=".6"/>`;
    return s + '</g>';
  },
  /* fatia (pão, torta): miolo + casca no arco */
  wedge({ x = 100, y = 100, r = 34, a0 = -30, a1 = 30, c = '#9c6632', crumb = '#ead7b2' }, R) {
    const A = (a) => [f(x + Math.cos(rad(a)) * r), f(y + Math.sin(rad(a)) * r)];
    const [x1, y1] = A(a0), [x2, y2] = A(a1);
    let s = `<path d="M${x + 2},${y + 3} L${x1 + 2},${y1 + 3} A${r} ${r} 0 0 1 ${x2 + 2},${y2 + 3}Z" fill="#000" opacity=".2"/><path d="M${x},${y} L${x1},${y1} A${r} ${r} 0 0 1 ${x2},${y2}Z" fill="${crumb}"/>`;
    for (let i = 0; i < 18; i++) { const a = a0 + (a1 - a0) * (0.1 + R() * 0.8), d = (0.15 + R() * 0.7) * r; s += `<ellipse cx="${f(x + Math.cos(rad(a)) * d)}" cy="${f(y + Math.sin(rad(a)) * d)}" rx="${f(0.7 + R() * 1.6)}" ry="${f(0.5 + R())}" fill="${shade(crumb, -45)}" opacity=".45"/>`; }
    s += `<path d="M${x1},${y1} A${r} ${r} 0 0 1 ${x2},${y2}" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><path d="M${x},${y} L${x1},${y1} M${x},${y} L${x2},${y2}" stroke="${shade(crumb, -25)}" stroke-width=".8"/>`;
    return s;
  },
};
