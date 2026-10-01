/**
 * CASA NERO — DADOS DO RESTAURANTE
 * ------------------------------------------------------------
 * PROJETO DEMONSTRATIVO / FICTÍCIO (portfólio Chrysxxz Digital).
 * Nome, endereço, telefone, horários e cardápio são inventados.
 * Para um cliente real, altere apenas este arquivo e menu.js.
 */
export const RESTAURANT = {
  name: 'Casa Nero',
  kind: 'Cozinha contemporânea',
  tagline: 'Fogo, estação e tempo.',
  city: 'Curitiba',
  state: 'PR',
  address: 'Alameda das Brasas, 000',         // fictício
  district: 'Centro · Curitiba, PR',
  zip: '80000-000',
  whatsapp: '5541900000000',                   // fictício
  whatsappDisplay: '(41) 90000-0000',
  instagram: '@casanero.demo',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Curitiba%2C+PR',
  chef: 'Chef Helena Duarte',                  // personagem fictícia
  // 0 = domingo … 6 = sábado. Turnos em minutos (fechamento 24h = 1440).
  hours: {
    0: [[12 * 60, 16 * 60]],
    1: [],
    2: [[19 * 60, 23 * 60]],
    3: [[19 * 60, 23 * 60]],
    4: [[19 * 60, 23 * 60]],
    5: [[19 * 60, 24 * 60]],
    6: [[12 * 60, 15 * 60 + 30], [19 * 60, 24 * 60]],
  },
  hoursLabel: [
    ['Segunda', 'Fechado'],
    ['Terça a quinta', '19h – 23h'],
    ['Sexta', '19h – 00h'],
    ['Sábado', '12h – 15h30 · 19h – 00h'],
    ['Domingo', '12h – 16h'],
  ],
  reservation: {
    windowDays: 30,
    maxParty: 10,
    tablesPerSlot: 5,            // capacidade simulada por horário
    lastSeatingBeforeClose: 90,  // última reserva X min antes de fechar
    areas: [
      { id: 'salao', label: 'Salão', hint: 'Mesas amplas, luz baixa' },
      { id: 'balcao', label: 'Balcão do chef', hint: 'De frente para a brasa · até 4 pessoas', max: 4 },
      { id: 'varanda', label: 'Varanda', hint: 'Ao ar livre, com aquecedores' },
    ],
    occasions: ['Nenhuma', 'Aniversário', 'Encontro', 'Negócios', 'Comemoração'],
  },
  demo: {
    notice: 'Projeto demonstrativo. Casa Nero é um restaurante fictício criado para o portfólio da Chrysxxz Digital.',
    credit: 'Chrysxxz Digital',
  },
};
