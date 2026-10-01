import { config } from '../data/config.js';

/** Link do WhatsApp da empresa com mensagem pronta. */
export function waLink(message = config.whatsappMessages.default) {
  return `https://wa.me/${config.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

/** Mensagem do formulário de agendamento. */
export function bookingMessage({ service, petName, size, period }) {
  const lines = [`Olá, ${config.brand.name}! Gostaria de agendar um atendimento.`];
  if (service) lines.push(`• Serviço: ${service}`);
  if (petName) lines.push(`• Nome do pet: ${petName}`);
  if (size) lines.push(`• Porte: ${size}`);
  if (period) lines.push(`• Melhor período: ${period}`);
  lines.push('Quais horários vocês têm disponíveis?');
  return lines.join('\n');
}
