/**
 * Adaptador de persistência.
 * Hoje: localStorage (com fallback em memória).
 * Amanhã: troque por chamadas HTTP sem mexer nas telas.
 */
const MEM = {};
export const storage = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return key in MEM ? MEM[key] : fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { MEM[key] = value; }
  },
  remove(key) { try { localStorage.removeItem(key); } catch (e) { delete MEM[key]; } },
};
