/**
 * CONFIGURAÇÃO DA EMPRESA
 * ------------------------------------------------------------
 * Todos os dados de contato, endereço, horários e links ficam
 * aqui. Para transformar este projeto em um site real para outro
 * cliente, altere apenas este arquivo (e as imagens em images.js).
 *
 * ATENÇÃO: todos os dados abaixo são FICTÍCIOS (demonstração).
 */
export const config = {
  brand: {
    name: 'Amora & Pata',
    nameParts: ['Amora', 'Pata'],          // usado no logotipo textual
    segment: 'Pet Shop · Banho e Tosa',
    tagline: 'Feito com cuidado para quem cuida de quem ama.',
    foundedNote: 'Pet shop de bairro em Curitiba',
  },

  site: {
    url: 'https://amoraepata.exemplo.com.br', // domínio fictício — troque ao publicar
    locale: 'pt_BR',
    title: 'Amora & Pata · Banho e Tosa em Curitiba',
    description:
      'Banho, tosa e cuidados pensados para deixar cada visita mais tranquila, segura e especial. Pet shop em Curitiba com agendamento pelo WhatsApp.',
  },

  contact: {
    // Número FICTÍCIO de demonstração. Formato internacional, só dígitos.
    whatsapp: '5541900000000',
    whatsappDisplay: '(41) 90000-0000',
    phoneIsDemo: true,
    instagram: 'amoraepata.demo',
    instagramUrl: 'https://www.instagram.com/',
    email: 'contato@amoraepata.exemplo.com.br',
  },

  address: {
    street: 'Rua das Amoreiras, 000',          // endereço FICTÍCIO
    district: 'Bairro Demonstração',
    city: 'Curitiba',
    state: 'PR',
    zip: '80000-000',
    country: 'BR',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Curitiba%2C+PR',
    // ponto aproximado apenas para o schema (centro de Curitiba)
    geo: { lat: -25.4284, lng: -49.2733 },
  },

  hours: [
    { days: 'Segunda a sexta', time: '8h às 18h', schema: 'Mo-Fr 08:00-18:00' },
    { days: 'Sábado', time: '8h às 14h', schema: 'Sa 08:00-14:00' },
    { days: 'Domingo e feriados', time: 'Fechado', schema: null },
  ],

  whatsappMessages: {
    default: 'Olá, Amora & Pata! Gostaria de agendar um atendimento para o meu pet.',
    service: (service) => `Olá, Amora & Pata! Gostaria de saber mais sobre ${service}.`,
  },

  demo: {
    enabled: true,
    credit: 'Chrysxxz Digital',
    note: 'Projeto demonstrativo. Amora & Pata é uma marca fictícia criada para portfólio.',
  },
};
