/**
 * DADOS DA BARBEARIA (fictícios — projeto conceitual)
 * Centralize aqui nome, contato, endereço e horários.
 */
export const BUSINESS = {
  name: 'BRAVO Barber Club',
  short: 'BRAVO',
  tagline: 'Barber Club',
  city: 'Curitiba',
  state: 'PR',
  address: 'Rua dos Alfaiates, 000 · Centro',   // endereço fictício
  zip: '80000-000',
  whatsapp: '5541900000000',                       // número fictício
  whatsappDisplay: '(41) 90000-0000',
  instagram: '@bravobarberclub.demo',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Curitiba%2C+PR',
  // 0 = domingo … 6 = sábado. null = fechado. Horários em minutos desde 00:00.
  hours: {
    0: null,
    1: [9 * 60, 20 * 60], 2: [9 * 60, 20 * 60], 3: [9 * 60, 20 * 60],
    4: [9 * 60, 20 * 60], 5: [9 * 60, 20 * 60],
    6: [9 * 60, 18 * 60],
  },
  hoursLabel: [
    { days: 'Segunda a sexta', time: '09h às 20h' },
    { days: 'Sábado', time: '09h às 18h' },
    { days: 'Domingo', time: 'Fechado' },
  ],
  slotStep: 15,          // intervalo da grade de horários (min)
  minNotice: 20,         // antecedência mínima para agendar hoje (min)
  bookingWindowDays: 14, // quantos dias à frente aparecem no agendamento
};
