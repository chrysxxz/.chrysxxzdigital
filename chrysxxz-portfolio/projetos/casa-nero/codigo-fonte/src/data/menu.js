/**
 * CARDÁPIO FICTÍCIO (demonstração) + "receitas visuais" das ilustrações.
 * tags: V = vegetariano · SG = sem glúten · VG = vegano
 */
export const CATEGORIES = [
  { id: 'entradas', label: 'Entradas', note: 'Para dividir, ou não.' },
  { id: 'principais', label: 'Principais', note: 'Brasa, forno a lenha e panela de ferro.' },
  { id: 'sobremesas', label: 'Sobremesas', note: 'Doce na medida certa.' },
  { id: 'bar', label: 'Bar & adega', note: 'Vinhos de pequenos produtores e coquetéis autorais.' },
];

export const DISHES = [
  { id: 'pao', cat: 'entradas', name: 'Pão de fermentação natural', desc: 'Manteiga noisette, flor de sal e mel de bracatinga.', price: 28, tags: ['V'],
    plate: { plate: 'stone', seed: 3, items: [{ t: 'wedge', x: 92, y: 98, r: 46, a0: -40, a1: 40 }, { t: 'wedge', x: 88, y: 104, r: 40, a0: 150, a1: 205 }, { t: 'quenelle', x: 128, y: 128, l: 24, w: 12, c: '#e9c77e', rot: 20 }, { t: 'salt', x: 128, y: 128, n: 8, spread: 8 }] } },
  { id: 'beterraba', cat: 'entradas', name: 'Tartar de beterraba defumada', desc: 'Coalhada fresca, avelã tostada e folhas da horta.', price: 48, tags: ['V', 'SG'], featured: true,
    story: 'A beterraba passa 6 horas na brasa antes de ser picada à faca. Chega à mesa com coalhada da casa e avelãs tostadas na hora.',
    plate: { plate: 'porcelain', seed: 11, items: [{ t: 'swoosh', c: '#e6d8bd', r: 34, a0: 150, a1: 330, w: 16, gloss: false }, { t: 'discs', c: '#7a1631', list: [[100, 100, 20]], sear: false }, { t: 'crumble', x: 100, y: 99, n: 30, spread: 14, c: '#b27a42' }, { t: 'dots', c: '#5a0f24', n: 5, r: 38, a0: 20, a1: 120, s: [1.6, 3.4] }, { t: 'leaves', x: 104, y: 94, n: 8, spread: 10 }] } },
  { id: 'vieiras', cat: 'entradas', name: 'Vieiras na brasa', desc: 'Milho tostado, manteiga de missô e pipoca de trigo sarraceno.', price: 72, tags: ['SG'], featured: true,
    story: 'Seladas por segundos sobre carvão de acácia, as vieiras encontram o doce do milho e o salgado profundo do missô.',
    plate: { plate: 'stone', seed: 5, items: [{ t: 'pool', c: '#e7c46a', x: 100, y: 100, rx: 34, ry: 30 }, { t: 'discs', c: '#f1e2c8', list: [[86, 90, 12], [114, 92, 12], [100, 116, 12]] }, { t: 'crumble', x: 100, y: 103, n: 20, spread: 22, c: '#e5b64c' }, { t: 'leaves', x: 100, y: 100, n: 6, spread: 18, c: ['#6f8a45', '#8aa35a'] }] } },
  { id: 'burrata', cat: 'entradas', name: 'Burrata e tomates de estação', desc: 'Óleo de manjericão, pão torrado e pimenta-do-reino moída na hora.', price: 56, tags: ['V'],
    plate: { plate: 'cream', seed: 21, items: [{ t: 'slices', c: '#c9372c', ring: '#f4b3a6', n: 6, r: 11, spread: 25 }, { t: 'discs', c: '#f6f1e6', list: [[100, 100, 19]], sear: false }, { t: 'oil', list: [[96, 94, 2.2], [108, 104, 1.6], [90, 106, 1.4], [120, 88, 1.8]], c: '#5d8a2f' }, { t: 'leaves', x: 104, y: 96, n: 5, spread: 8, c: ['#3f7a2a', '#5a9a38'], size: 1.3 }] } },
  { id: 'arroz', cat: 'principais', name: 'Arroz negro e lula na brasa', desc: 'Tinta de lula, aioli de alho assado e limão-cravo.', price: 98, tags: [], featured: true,
    story: 'O prato que abriu a casa. Arroz cozido lentamente em caldo de peixe e tinta de lula, finalizado com anéis de lula direto da brasa.',
    plate: { plate: 'porcelain', seed: 31, items: [{ t: 'grains', x: 100, y: 100, r: 40, n: 220 }, { t: 'rings', list: [[92, 90, 8, 6, 20], [112, 96, 7, 5, -30], [100, 112, 8, 6, 60]] }, { t: 'dots', c: '#f1e6c8', n: 5, r: 26, a0: 200, a1: 330, s: [2, 3.6] }, { t: 'leaves', x: 104, y: 100, n: 7, spread: 16, c: ['#6f8a45', '#8aa35a'] }] } },
  { id: 'bochecha', cat: 'principais', name: 'Bochecha de boi 12 horas', desc: 'Purê de aipim com manteiga queimada e jus de vinho tinto.', price: 118, tags: ['SG'], featured: true,
    story: 'Doze horas de cozimento em vinho tinto até desmanchar no garfo. Servida sobre um purê de aipim sedoso e o próprio jus reduzido.',
    plate: { plate: 'clay', seed: 41, items: [{ t: 'swoosh', c: '#f0e2c3', r: 26, a0: 120, a1: 390, w: 20, gloss: false }, { t: 'pool', c: '#4a1d14', x: 104, y: 100, rx: 20, ry: 17 }, { t: 'protein', c: '#4a2317', inner: '#9c5a3a', x: 102, y: 98, w: 34, h: 26, rot: -18, grill: false, r: 11 }, { t: 'leaves', x: 104, y: 92, n: 5, spread: 7, c: ['#7b9a4a', '#5f7f36'] }] } },
  { id: 'peixe', cat: 'principais', name: 'Peixe do dia na folha', desc: 'Assado em folha de bananeira, beurre blanc de maracujá e farofa de castanha.', price: 112, tags: ['SG'],
    plate: { plate: 'stone', seed: 51, items: [{ t: 'leaf', x: 100, y: 100, l: 120, w: 58, rot: -22 }, { t: 'protein', c: '#e8d3b2', inner: '#fff', x: 100, y: 100, w: 52, h: 26, rot: -22, grill: false, r: 10 }, { t: 'dots', c: '#e9b53c', n: 6, r: 40, a0: 30, a1: 150, s: [1.8, 3.2] }, { t: 'crumble', x: 102, y: 100, n: 22, spread: 16, c: '#c79a5a' }] } },
  { id: 'nhoque', cat: 'principais', name: 'Nhoque de cabotiá', desc: 'Manteiga de sálvia, parmesão 24 meses e sementes tostadas.', price: 84, tags: ['V'],
    plate: { plate: 'bowl', seed: 61, items: [{ t: 'pool', c: '#d9a04b', x: 100, y: 100, rx: 34, ry: 32 }, { t: 'discs', c: '#e8943a', list: [[86, 90, 7], [100, 86, 7], [114, 92, 7], [90, 106, 7], [106, 104, 7], [100, 118, 7], [118, 110, 6.5]], sear: false }, { t: 'leaves', x: 100, y: 100, n: 5, spread: 20, c: ['#556b3a', '#6f8458'], size: 1.4 }, { t: 'salt', x: 100, y: 100, n: 20, spread: 22 }] } },
  { id: 'pato', cat: 'principais', name: 'Pato, cereja preta e cenoura', desc: 'Peito de pato maturado, cenouras glaceadas no mel e redução de cereja.', price: 126, tags: ['SG'],
    plate: { plate: 'porcelain', seed: 71, items: [{ t: 'swoosh', c: '#3d0f1a', r: 36, a0: 170, a1: 300, w: 10 }, { t: 'protein', c: '#7a2a22', inner: '#e29486', x: 96, y: 104, w: 30, h: 13, rot: -35, grill: false, r: 6 }, { t: 'protein', c: '#7a2a22', inner: '#e29486', x: 106, y: 110, w: 30, h: 13, rot: -35, grill: false, r: 6 }, { t: 'protein', c: '#7a2a22', inner: '#e29486', x: 116, y: 116, w: 28, h: 12, rot: -35, grill: false, r: 6 }, { t: 'dots', c: '#e07a2e', n: 4, r: 30, a0: 20, a1: 110, s: [3, 4] }, { t: 'leaves', x: 104, y: 98, n: 5, spread: 8 }] } },
  { id: 'chocolate', cat: 'sobremesas', name: 'Chocolate 70%, azeite e sal', desc: 'Ganache aerada, crocante de cacau e azeite extravirgem.', price: 42, tags: ['V'], featured: true,
    story: 'Uma sobremesa de três ingredientes principais e nenhuma pressa. O azeite e a flor de sal fazem o chocolate parecer ainda mais profundo.',
    plate: { plate: 'stone', seed: 81, items: [{ t: 'quenelle', c: '#3a2016', x: 96, y: 98, l: 56, w: 26, rot: -30 }, { t: 'crumble', x: 114, y: 112, n: 26, spread: 12, c: '#2a1a12' }, { t: 'oil', list: [[118, 90, 2.4], [124, 96, 1.6], [84, 116, 1.8]], c: '#b8a03a' }, { t: 'salt', x: 98, y: 96, n: 10, spread: 12 }] } },
  { id: 'pera', cat: 'sobremesas', name: 'Pera ao vinho', desc: 'Sorvete de baunilha do cerrado e calda do próprio cozimento.', price: 38, tags: ['V', 'SG'],
    plate: { plate: 'porcelain', seed: 91, items: [{ t: 'pool', c: '#5a1629', x: 98, y: 102, rx: 30, ry: 26 }, { t: 'slices', c: '#8a2440', ring: '#e9b8a0', n: 5, r: 10, spread: 14, x: 96, y: 102 }, { t: 'quenelle', c: '#f5ecd6', x: 124, y: 86, l: 24, w: 12, rot: 30 }, { t: 'flowers', list: [[82, 84, 2.2], [118, 118, 2]] }] } },
  { id: 'tapioca', cat: 'sobremesas', name: 'Pudim de tapioca', desc: 'Coco queimado, calda de rapadura e flor de sal.', price: 36, tags: ['SG'],
    plate: { plate: 'cream', seed: 101, items: [{ t: 'pool', c: '#8a4a1c', x: 100, y: 100, rx: 36, ry: 34 }, { t: 'discs', c: '#f1e8d6', list: [[100, 100, 22]], sear: false }, { t: 'crumble', x: 100, y: 96, n: 26, spread: 12, c: '#6e4323' }] } },
  { id: 'vinho', cat: 'bar', name: 'Vinho natural em taça', desc: 'Seleção rotativa de pequenos produtores do Sul.', price: 38, tags: [], noPlate: true },
  { id: 'nero', cat: 'bar', name: 'Coquetel Nero', desc: 'Vermute da casa, café coado, casca de laranja queimada.', price: 42, tags: [], noPlate: true },
  { id: 'jardim', cat: 'bar', name: 'Jardim (sem álcool)', desc: 'Kombucha de hibisco, manjericão e limão-cravo.', price: 28, tags: ['VG'], noPlate: true },
  { id: 'harmonizacao', cat: 'bar', name: 'Harmonização do menu degustação', desc: 'Cinco taças escolhidas pela sommelière para os sete tempos.', price: 180, tags: [], noPlate: true },
];

export const TASTING = {
  name: 'Sete tempos',
  price: 290,
  pairing: 180,
  days: 'Terça a quinta, jantar',
  courses: ['Pão e manteiga noisette', 'Beterraba na brasa', 'Vieira, milho e missô', 'Arroz negro', 'Bochecha 12 horas', 'Pré-sobremesa cítrica', 'Chocolate, azeite e sal'],
};

export const findDish = (id) => DISHES.find((d) => d.id === id);
