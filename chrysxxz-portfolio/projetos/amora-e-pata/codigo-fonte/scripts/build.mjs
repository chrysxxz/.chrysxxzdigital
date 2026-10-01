/**
 * Build estático.
 * Gera dist/index.html em UM ÚNICO arquivo (CSS e JS embutidos, HTML pré-renderizado).
 * Funciona publicado em qualquer hospedagem e também aberto com dois cliques no computador.
 * Uso: npm run build
 */
import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderApp } from '../src/app.js';
import { localBusinessSchema } from '../src/lib/seo.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

// 1) CSS em um único bloco
const css = (await Promise.all(['tokens', 'base', 'components', 'sections'].map((p) => readFile(resolve(root, `src/styles/${p}.css`), 'utf8')))).join('\n');

// 2) JS: empacota os módulos (ordem de dependência) em um script clássico
const order = [], seen = new Set();
async function visit(file) {
  if (seen.has(file)) return; seen.add(file);
  const code = await readFile(file, 'utf8');
  for (const m of code.matchAll(/^import .* from '(.+)';$/gm)) await visit(resolve(dirname(file), m[1]));
  order.push({ file, code });
}
await visit(resolve(root, 'src/main.js'));
const bundle = order.map(({ file, code }) =>
  `// ${relative(root, file)}\n` + code.replace(/^import .* from '.+';$/gm, '').replace(/^export /gm, '')
).join('\n');
const js = `(function(){\n"use strict";\n${bundle}\n})();`.replace(/<\/script/gi, '<\\/script');

// 3) HTML pré-renderizado
let html = await readFile(resolve(root, 'index.html'), 'utf8');
html = html
  .replace(/^.*location\.replace\('abrir-site\.html'\);\n/m, '')
  .replace('<link rel="stylesheet" href="src/styles/main.css">', `<style>\n${css}\n</style>`)
  .replace('<div id="app"></div>', `<div id="app" data-prerendered="1">\n${renderApp()}\n</div>`)
  .replace('<script type="module" src="src/main.js"></script>', `<script>\n${js}\n</script>`)
  .replace('</head>', `  <script type="application/ld+json" id="ld-business">${JSON.stringify(localBusinessSchema())}</script>\n</head>`);
const fav = await readFile(resolve(root, 'public/favicon.svg'), 'utf8');
html = html.replace('href="public/favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(fav)}"`);

await writeFile(resolve(dist, 'index.html'), html);
await writeFile(resolve(root, 'abrir-site.html'), html); // atalho: abrir com dois cliques
console.log('✓ dist/index.html e abrir-site.html gerados (arquivo único)');
