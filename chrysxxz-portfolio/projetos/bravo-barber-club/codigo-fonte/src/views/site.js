/** SITE PÚBLICO */
import { BUSINESS } from '../data/business.js';
import { SERVICES, BARBERS } from '../data/catalog.js';
import { ICONS } from '../ui/icons.js';
import { Logo, PhotoSlot } from '../ui/components.js';
import { getAvailability } from '../services/bookingService.js';
import { nextOpenDay } from '../services/seed.js';
import { esc, brl, fmtDur, fmtTime, fmtDateLong, todayKey, addDays, dateKey } from '../core/utils.js';

const NAV = [['servicos', 'Serviços'], ['barbeiros', 'Barbeiros'], ['galeria', 'Galeria'], ['sobre', 'Sobre'], ['local', 'Localização']];
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function SiteHeader(active = 'site') {
  return `<header class="hdr" id="hdr">
    <div class="wrap hdr__in">
      <a href="#/" class="hdr__logo" aria-label="${esc(BUSINESS.name)}, início">${Logo()}</a>
      <nav class="hdr__nav" aria-label="Principal">${NAV.map(([id, l]) => `<a href="#/${id}">${l}</a>`).join('')}</nav>
      <div class="hdr__act">
        <a href="#/cliente" class="hdr__me ${active === 'client' ? 'is-on' : ''}">${ICONS.user}<span>Minha agenda</span></a>
        <a href="#/agendar" class="btn btn--brass btn--sm hdr__cta">Agendar horário</a>
        <button class="burger" id="burger" type="button" aria-label="Abrir menu" aria-expanded="false"><span></span><span></span></button>
      </div>
    </div>
  </header>
  <div class="mnav" id="mnav" aria-hidden="true">
    <nav>${NAV.map(([id, l], i) => `<a href="#/${id}" style="--i:${i}">${l}</a>`).join('')}<a href="#/cliente" style="--i:5">Minha agenda</a></nav>
    <a href="#/agendar" class="btn btn--brass btn--lg btn--block">Agendar horário ${ICONS.arrow}</a>
  </div>`;
}

/** Próximo horário livre (conecta o site à agenda real da barbearia). */
function nextFree() {
  for (let i = 0; i < 7; i++) {
    const k = dateKey(addDays(new Date(), i));
    const slots = getAvailability({ date: k, serviceId: 'corte', barberId: 'any' });
    if (slots.length) { const s = slots[0]; return { date: k, start: s.start, barber: BARBERS.find((b) => b.id === s.barbers[0]) }; }
  }
  return null;
}

export function SiteView() {
  const nf = nextFree();
  const today = new Date().getDay();
  return `${SiteHeader()}
  <main id="main">
    <section class="hero" id="inicio">
      <div class="hero__bg" aria-hidden="true"><span>BRAVO</span></div>
      <div class="wrap hero__grid">
        <div class="hero__copy">
          <p class="kicker reveal">Barbearia clássica · ${esc(BUSINESS.city)}</p>
          <h1 class="hero__title">
            <span class="ln"><span>O corte clássico,</span></span>
            <span class="ln"><em>feito sem pressa.</em></span>
          </h1>
          <p class="hero__sub reveal" style="--d:.35s">Tesoura, navalha e toalha quente. Escolha o serviço, o barbeiro e o horário em menos de um minuto, e acompanhe seu atendimento pelo celular.</p>
          <div class="hero__ctas reveal" style="--d:.45s">
            <a href="#/agendar" class="btn btn--brass btn--lg">Agendar horário ${ICONS.arrow}</a>
            <a href="#/servicos" class="btn btn--line btn--lg">Ver serviços</a>
          </div>
          ${nf ? `<a class="nextfree reveal" style="--d:.6s" href="#/agendar?servico=corte&data=${nf.date}">
            <span class="nextfree__pulse" aria-hidden="true"></span>
            <span><small>Próximo horário livre</small><b>${esc(fmtDateLong(nf.date))} · ${fmtTime(nf.start)}</b> com ${esc(nf.barber.name.split(' ')[0])}</span>
            ${ICONS.arrow}
          </a>` : ''}
        </div>
        <div class="hero__media reveal" style="--d:.2s">
          ${PhotoSlot({ label: 'Foto · Cadeira e bancada da casa', icon: 'razor', cls: 'hero__photo' })}
          <div class="hero__card">
            <span class="hero__card-ic">${ICONS.clock}</span>
            <span><b>${esc(BUSINESS.hoursLabel[0].days)}</b><small>${esc(BUSINESS.hoursLabel[0].time)} · Sáb ${esc(BUSINESS.hoursLabel[1].time)}</small></span>
          </div>
        </div>
      </div>
      <ul class="hero__strip wrap" aria-label="Destaques">
        <li>${ICONS.cal}Agenda online 24h</li><li>${ICONS.bell}Status do atendimento em tempo real</li><li>${ICONS.razor}Toalha quente e navalha</li><li>${ICONS.pin}${esc(BUSINESS.city)} · ${esc(BUSINESS.state)}</li>
      </ul>
    </section>

    <section class="sec sec--cream" id="servicos">
      <div class="wrap svc">
        <header class="shead reveal">
          <p class="kicker kicker--ink">01 · Serviços</p>
          <h2 class="h2">A carta da casa.</h2>
          <p class="shead__txt">Preços fixos, duração honesta. Todo serviço inclui lavagem e finalização.</p>
        </header>
        <ul class="menu">
          ${SERVICES.map((s, i) => `<li class="menu__item reveal ${s.featured ? 'is-feat' : ''}" style="--d:${i * 0.05}s">
            <a href="#/agendar?servico=${s.id}" class="menu__link">
              <span class="menu__ic">${ICONS[s.icon]}</span>
              <span class="menu__main">
                <span class="menu__row"><b class="menu__name">${esc(s.name)}</b>${s.featured ? '<em class="menu__tag">Mais pedido</em>' : ''}<span class="menu__dots" aria-hidden="true"></span><b class="menu__price">${brl(s.price)}</b></span>
                <span class="menu__desc">${esc(s.desc)}</span>
              </span>
              <span class="menu__meta"><span class="chip">${ICONS.clock}${fmtDur(s.duration)}</span><span class="menu__go">Agendar ${ICONS.arrow}</span></span>
            </a>
          </li>`).join('')}
        </ul>
      </div>
    </section>

    <section class="sec" id="barbeiros">
      <div class="wrap">
        <header class="shead shead--split reveal">
          <div><p class="kicker">02 · Barbeiros</p><h2 class="h2">Mãos que conhecem o ofício.</h2></div>
          <p class="shead__txt">Escolha quem vai cuidar do seu corte ou deixe a agenda sugerir o primeiro horário livre.</p>
        </header>
        <div class="barbers">
          ${BARBERS.map((b, i) => `<article class="barber reveal" style="--d:${i * 0.08}s">
            ${PhotoSlot({ label: `Retrato · ${b.name}`, big: b.initials, cls: 'barber__photo' })}
            <div class="barber__body">
              <p class="barber__role">${esc(b.role)}</p>
              <h3 class="barber__name">${esc(b.name)}</h3>
              <p class="barber__spec">${esc(b.specialty)}</p>
              <p class="barber__bio">${esc(b.bio)}</p>
              <p class="barber__days">${DAYS.map((d, wd) => `<span class="${b.days.includes(wd) && BUSINESS.hours[wd] ? 'on' : ''} ${wd === today ? 'today' : ''}">${d}</span>`).join('')}</p>
              <a class="btn btn--line btn--block" href="#/agendar?barbeiro=${b.id}">Agendar com ${esc(b.name.split(' ')[0])} ${ICONS.arrow}</a>
            </div>
          </article>`).join('')}
        </div>
      </div>
    </section>

    <section class="sec sec--brown" id="galeria">
      <div class="wrap">
        <header class="shead shead--split reveal">
          <div><p class="kicker">03 · Galeria</p><h2 class="h2">Trabalho que fala por si.</h2></div>
          <p class="shead__txt">Espaço reservado para o portfólio fotográfico da casa: cortes, barbas e o ambiente.</p>
        </header>
        <div class="gal">
          ${[['Degradê navalhado', 'fade', 'g1'], ['Barba com toalha quente', 'razor', 'g2'], ['Risca lateral clássica', 'scissors', 'g3'], ['Ambiente da casa', 'store', 'g4'], ['Acabamento na navalha', 'line', 'g5'], ['Corte + barba', 'combo', 'g6']]
            .map(([l, ic, c], i) => `<div class="gal__it ${c} reveal" style="--d:${i * 0.05}s">${PhotoSlot({ label: `Foto · ${l}`, icon: ic })}</div>`).join('')}
        </div>
      </div>
    </section>

    <section class="sec sec--cream" id="sobre">
      <div class="wrap about">
        <div class="about__quote reveal">
          <p class="kicker kicker--ink">04 · Sobre</p>
          <blockquote>“Barbearia boa é aquela em que você esquece do relógio, porque alguém já cuidou dele por você.”</blockquote>
        </div>
        <div class="about__txt reveal" style="--d:.1s">
          <p>O BRAVO nasceu da vontade de juntar o que a barbearia tradicional tem de melhor, o ritual, a conversa e o acabamento na navalha, com uma agenda que respeita o seu tempo.</p>
          <p>Aqui cada horário é reservado para uma pessoa só. Sem fila, sem espera no sofá: você marca pelo site, acompanha o status pelo celular e senta na cadeira na hora combinada.</p>
          <ul class="pillars">
            <li><b>Hora marcada</b><span>Cada cadeira com a sua agenda, sem encaixes.</span></li>
            <li><b>Ritual completo</b><span>Toalha quente, navalha e finalização sem pressa.</span></li>
            <li><b>Status ao vivo</b><span>Você sabe quando é a sua vez, direto no celular.</span></li>
          </ul>
        </div>
      </div>
    </section>

    <section class="sec" id="local">
      <div class="wrap">
        <header class="shead reveal"><p class="kicker">05 · Localização</p><h2 class="h2">No centro, a poucos passos.</h2></header>
        <div class="loc">
          <div class="map reveal">
            <svg viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="600" height="420" fill="#1b1814"/>
              <g stroke="#2c2721" stroke-linecap="round" fill="none"><path d="M0 190H600" stroke-width="16"/><path d="M270 0V420" stroke-width="16"/><path d="M0 90L600 50" stroke-width="7"/><path d="M430 0L380 420" stroke-width="7"/><path d="M0 360L250 190" stroke-width="7"/><path d="M120 0V420M0 280H600M530 0V420" stroke-width="3"/></g>
              <rect x="60" y="230" width="140" height="90" rx="10" fill="#211e19"/><circle cx="480" cy="330" r="50" fill="#211e19"/>
              <g transform="translate(300 170)"><circle r="30" fill="#c29a5b" opacity=".12"/><circle r="15" fill="#c29a5b" opacity=".25"/><circle r="6" fill="#c29a5b"/></g>
            </svg>
            <div class="map__card"><b>${esc(BUSINESS.name)}</b><span>${esc(BUSINESS.address)}</span><span>${esc(BUSINESS.city)}, ${esc(BUSINESS.state)} · ${esc(BUSINESS.zip)}</span></div>
            <span class="map__demo">Mapa ilustrativo · endereço fictício</span>
          </div>
          <div class="loc__info">
            <div class="box reveal"><h3>${ICONS.clock}Horários</h3><dl class="hours">${BUSINESS.hoursLabel.map((h) => `<div><dt>${esc(h.days)}</dt><dd>${esc(h.time)}</dd></div>`).join('')}</dl></div>
            <div class="box reveal"><h3>${ICONS.pin}Endereço</h3><p>${esc(BUSINESS.address)}<br>${esc(BUSINESS.city)}, ${esc(BUSINESS.state)}</p>
              <div class="box__links"><a class="btn btn--line btn--sm" href="${BUSINESS.mapsUrl}" target="_blank" rel="noopener">Abrir no Maps</a><a class="btn btn--line btn--sm" href="https://wa.me/${BUSINESS.whatsapp}" target="_blank" rel="noopener">${ICONS.whatsapp}WhatsApp</a></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="wrap cta__in reveal">
        <p class="kicker kicker--ink">Agenda aberta</p>
        <h2 class="cta__title">Sua cadeira<br><em>está esperando.</em></h2>
        <a href="#/agendar" class="btn btn--ink btn--lg">Agendar horário ${ICONS.arrow}</a>
      </div>
    </section>
  </main>
  ${SiteFooter()}
  <a href="#/agendar" class="stickycta" id="stickycta">Agendar horário ${ICONS.arrow}</a>`;
}

export function SiteFooter() {
  return `<footer class="ftr">
    <div class="wrap">
      <div class="ftr__top">
        <div>${Logo()}<p class="ftr__tag">Barbearia clássica com agenda online.</p></div>
        <nav aria-label="Rodapé"><h4>Site</h4>${NAV.map(([id, l]) => `<a href="#/${id}">${l}</a>`).join('')}</nav>
        <nav aria-label="Produto"><h4>Agenda</h4><a href="#/agendar">Agendar horário</a><a href="#/cliente">Minha agenda</a><a href="#/painel">Painel da barbearia</a></nav>
        <div><h4>Contato</h4><p>${esc(BUSINESS.whatsappDisplay)}</p><p>${esc(BUSINESS.instagram)}</p><p>${esc(BUSINESS.city)}, ${esc(BUSINESS.state)}</p></div>
      </div>
      <div class="ftr__bot"><span>© ${new Date().getFullYear()} ${esc(BUSINESS.name)}</span><span>Projeto conceitual · marca, contatos e agendamentos fictícios · Desenvolvido por <b>Chrysxxz Digital</b></span></div>
    </div>
  </footer>`;
}
