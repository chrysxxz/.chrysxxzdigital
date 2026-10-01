import { services } from '../data/content.js';
import { SectionHeading } from '../components/SectionHeading.js';
import { ServiceCard } from '../components/ServiceCard.js';

export function Services() {
  return `<section class="sec services" id="servicos" aria-label="Serviços">
    <div class="wrap">
      <div class="services__top">
        ${SectionHeading({ index: '01', eyebrow: 'Serviços', title: services.title, text: services.intro })}
        <p class="services__hint" aria-hidden="true">Deslize para ver todos</p>
      </div>
    </div>
    <div class="services__track" data-track>
      <div class="wrap services__grid">
        ${services.items.map((s, i) => ServiceCard(s, i, services.cta)).join('')}
      </div>
    </div>
  </section>`;
}
