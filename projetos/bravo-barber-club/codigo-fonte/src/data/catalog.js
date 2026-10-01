/** SERVIÇOS E BARBEIROS — fonte única para site, agendamento e painel. */
export const SERVICES = [
  { id: 'corte', name: 'Corte Masculino', price: 45, duration: 45, icon: 'scissors', desc: 'Corte na tesoura ou máquina, lavagem e finalização com pomada.' },
  { id: 'barba', name: 'Barba', price: 35, duration: 30, icon: 'razor', desc: 'Toalha quente, navalha e hidratação com óleo de barba.' },
  { id: 'corte-barba', name: 'Corte + Barba', price: 75, duration: 75, icon: 'combo', desc: 'O ritual completo da casa, com toalha quente e acabamento na navalha.', featured: true },
  { id: 'degrade', name: 'Degradê', price: 50, duration: 45, icon: 'fade', desc: 'Transição precisa na máquina, do zero ao comprimento que você escolher.' },
  { id: 'pezinho', name: 'Acabamento', price: 20, duration: 15, icon: 'line', desc: 'Pezinho, contorno e manutenção entre um corte e outro.' },
  { id: 'sobrancelha', name: 'Sobrancelha', price: 15, duration: 15, icon: 'brow', desc: 'Alinhamento discreto na navalha ou pinça.' },
];

export const BARBERS = [
  {
    id: 'rafael', name: 'Rafael Moura', initials: 'RM', role: 'Barbeiro master',
    specialty: 'Cortes clássicos e tesoura', bio: 'Referência da casa em cortes sociais, risca lateral e acabamento na tesoura.',
    days: [1, 2, 3, 4, 5, 6], tone: '#8a6a45',
  },
  {
    id: 'matheus', name: 'Matheus Lima', initials: 'ML', role: 'Barbeiro',
    specialty: 'Barba e navalha', bio: 'Barba desenhada, toalha quente e o ritual completo da navalha.',
    days: [1, 2, 3, 4, 5, 6], tone: '#6e5a48',
  },
  {
    id: 'diego', name: 'Diego Costa', initials: 'DC', role: 'Barbeiro',
    specialty: 'Degradê e cortes modernos', bio: 'Degradês precisos, texturas e cortes com personalidade.',
    days: [2, 3, 4, 5, 6], tone: '#5a4a3c',
  },
];

/** Status do atendimento: ordem do fluxo + metadados visuais. */
export const STATUSES = [
  { id: 'agendado', label: 'Agendado', hint: 'Recebemos seu pedido de horário.' },
  { id: 'confirmado', label: 'Confirmado', hint: 'Seu horário está garantido.' },
  { id: 'chegou', label: 'Cliente chegou', hint: 'Check-in feito. Seu barbeiro já sabe que você está aqui.' },
  { id: 'atendimento', label: 'Em atendimento', hint: 'Relaxe, você está na cadeira.' },
  { id: 'finalizado', label: 'Finalizado', hint: 'Atendimento concluído. Até a próxima!' },
  { id: 'cancelado', label: 'Cancelado', hint: 'Este horário foi cancelado.' },
];
export const STATUS_FLOW = ['agendado', 'confirmado', 'chegou', 'atendimento', 'finalizado'];

export const findService = (id) => SERVICES.find((s) => s.id === id);
export const findBarber = (id) => BARBERS.find((b) => b.id === id);
export const findStatus = (id) => STATUSES.find((s) => s.id === id);
