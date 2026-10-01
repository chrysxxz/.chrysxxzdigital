/** Pequenos utilitários para montar HTML a partir de dados (funcionam no navegador e no Node). */
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ESC[c]);

/** Template tag: `html\`...\`` junta arrays e ignora null/false. */
export function html(strings, ...values) {
  return strings.reduce((out, str, i) => {
    let v = values[i - 1];
    if (Array.isArray(v)) v = v.join('');
    if (v === null || v === undefined || v === false) v = '';
    return out + v + str;
  });
}
