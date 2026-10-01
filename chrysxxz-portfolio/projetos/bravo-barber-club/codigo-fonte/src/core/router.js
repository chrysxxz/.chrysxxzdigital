/**
 * Roteador por hash. Rotas:
 *   #/                 site      (#/servicos, #/barbeiros … rolam até a seção)
 *   #/agendar?...      agendamento
 *   #/cliente          área do cliente
 *   #/painel[/aba]     painel da barbearia
 */
export function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs = ''] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  const params = Object.fromEntries(new URLSearchParams(qs));
  const top = parts[0] || '';
  if (top === 'agendar') return { view: 'booking', params };
  if (top === 'cliente') return { view: 'client', params };
  if (top === 'painel') return { view: 'admin', tab: parts[1] || 'hoje', params };
  return { view: 'site', section: top || null, params };
}
export const go = (hash) => { if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = hash; };
