/**
 * Build: empacota os módulos ES em um único HTML (cada módulo com escopo próprio),
 * com CSS embutido. Saída: dist/index.html (publicável e abre com dois cliques).
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const order = [], seen = new Set();
async function visit(file) {
  if (seen.has(file)) return; seen.add(file);
  const code = await readFile(file, 'utf8');
  for (const m of code.matchAll(/^import .* from '(.+)';$/gm)) await visit(resolve(dirname(file), m[1]));
  order.push({ file, code });
}
await visit(resolve(root, 'src/main.js'));

const mods = order.map(({ file, code }) => {
  const id = relative(root, file);
  const exports = [];
  let body = code.replace(/^import \{([^}]+)\} from '(.+)';$/gm, (_, names, from) => {
    const dep = relative(root, resolve(dirname(file), from));
    const list = names.split(',').map((s) => s.trim()).filter(Boolean).map((s) => s.replace(/\s+as\s+/, ': '));
    return `const { ${list.join(', ')} } = __m[${JSON.stringify(dep)}];`;
  });
  body = body.replace(/^export (async function|function|const|let|class) ([A-Za-z0-9_$]+)/gm, (_, kind, name) => { exports.push(name); return `${kind} ${name}`; });
  if (/^(import|export) /m.test(body)) throw new Error('Import/export não suportado em ' + id);
  return `__m[${JSON.stringify(id)}] = (function () {\n${body}\nreturn { ${exports.join(', ')} };\n})();`;
});
const js = `(function () {\n"use strict";\nconst __m = {};\n${mods.join('\n\n')}\n})();`.replace(/<\/script/gi, '<\\/script');
const css = (await Promise.all(['base', 'sections'].map((f) => readFile(resolve(root, `src/styles/${f}.css`), 'utf8')))).join('\n');
const fav = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#141312"/><circle cx="32" cy="32" r="18" fill="#eee9e0"/><circle cx="32" cy="32" r="11" fill="none" stroke="#141312" stroke-width="1.5"/><circle cx="36" cy="29" r="4" fill="#b5461f"/></svg>`;
let html = await readFile(resolve(root, 'index.template.html'), 'utf8');
html = html.replace('<!--STYLES-->', `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(fav)}">\n<style>\n${css}\n</style>`)
  .replace('<!--SCRIPT-->', `<script>\n${js}\n</script>`);
await mkdir(resolve(root, 'dist'), { recursive: true });
await writeFile(resolve(root, 'dist/index.html'), html);
console.log(`✓ dist/index.html (${(html.length / 1024).toFixed(0)} KB, ${order.length} módulos)`);
