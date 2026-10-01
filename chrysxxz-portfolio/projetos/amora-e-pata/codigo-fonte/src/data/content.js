/**
 * CONTEÚDO DO SITE
 * Textos, serviços, galeria e depoimentos. Nenhum dado de contato aqui:
 * contatos ficam em config.js.
 */
export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'servicos', label: 'Serviços' },
  { id: 'cuidados', label: 'Cuidados' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'agendamento', label: 'Agendamento' },
  { id: 'contato', label: 'Contato' },
];

export const hero = {
  eyebrow: 'Banho e tosa em Curitiba',
  title: ['Seu pet merece', 'cuidado de verdade.'],
  subtitle:
    'Banho, tosa e cuidados pensados para deixar cada visita mais tranquila, segura e especial.',
  primary: 'Agendar atendimento',
  secondary: 'Conhecer nossos cuidados',
  note: 'Atendimento com hora marcada',
};

export const trust = {
  title: 'Cuidado que começa antes do banho.',
  text:
    'Cada animal tem seu jeito, seu ritmo e suas sensibilidades. Antes de qualquer procedimento, conversamos com o tutor, observamos o pet e ajustamos o atendimento a ele, e não o contrário.',
  items: [
    {
      icon: 'person',
      title: 'Atendimento individual',
      text: 'Um pet por vez na mesa, com tempo para ele se acostumar ao ambiente e às mãos de quem cuida.',
    },
    {
      icon: 'home',
      title: 'Ambiente acolhedor',
      text: 'Espaço limpo, silencioso e organizado, pensado para reduzir o estresse da visita.',
    },
    {
      icon: 'hand',
      title: 'Profissionais cuidadosos',
      text: 'Manuseio gentil, atenção a sinais de desconforto e respeito aos limites de cada animal.',
    },
  ],
};

export const services = {
  title: 'Cuidados para cada momento',
  intro:
    'Do banho da semana a cuidados específicos para pele, pelagem e idade, cada serviço é adaptado ao porte e ao temperamento do seu pet.',
  cta: 'Quero saber mais',
  items: [
    {
      id: 'banho',
      name: 'Banho',
      image: 'bath',
      text: 'Produtos adequados ao tipo de pele e pelagem, secagem cuidadosa e escovação.',
      tags: ['Todos os portes', 'Cães e gatos'],
    },
    {
      id: 'tosa',
      name: 'Tosa',
      image: 'grooming',
      text: 'Tosa higiênica, na tesoura ou na máquina, respeitando o padrão e o conforto do pet.',
      tags: ['Tesoura', 'Máquina'],
    },
    {
      id: 'banho-tosa',
      name: 'Banho + Tosa',
      image: 'brushing',
      text: 'O cuidado completo em uma única visita, do banho ao acabamento final.',
      tags: ['Mais pedido'],
    },
    {
      id: 'higiene',
      name: 'Higiene',
      image: 'drying',
      text: 'Corte de unhas, limpeza de ouvidos e higiene das áreas sensíveis.',
      tags: ['Rápido'],
    },
    {
      id: 'especiais',
      name: 'Cuidados especiais',
      image: 'cat',
      text: 'Atenção extra para gatos, filhotes, idosos e pets mais sensíveis.',
      tags: ['Sob consulta'],
    },
  ],
};

export const experience = {
  eyebrow: 'Como cuidamos',
  title: 'Mais do que estética.',
  text:
    'Nosso trabalho é cuidar do seu pet com atenção aos detalhes. Da chegada ao momento em que ele volta para casa, cada etapa foi pensada para tornar a experiência mais tranquila.',
  image: 'cuddle',
  imageSecondary: 'towel',
  steps: [
    { title: 'Recepção', text: 'Conversa com o tutor e um momento para o pet reconhecer o espaço.' },
    { title: 'Higiene', text: 'Banho com produtos adequados e água na temperatura certa.' },
    { title: 'Cuidado', text: 'Escovação, tosa e detalhes feitos com calma, no tempo do pet.' },
    { title: 'Finalização', text: 'Secagem, acabamento e um aviso para o tutor quando estiver pronto.' },
  ],
};

export const gallery = {
  title: 'Momentos de cuidado',
  intro: 'Uma seleção de registros que traduzem o dia a dia de banho, tosa e carinho.',
  filters: [
    { id: 'todos', label: 'Todos' },
    { id: 'banho', label: 'Banho' },
    { id: 'tosa', label: 'Tosa' },
    { id: 'momentos', label: 'Momentos' },
  ],
  // shape: tall | wide | square | big  → proporções diferentes na composição
  items: [
    { image: 'towel', tag: 'banho', shape: 'tall', caption: 'Depois do banho' },
    { image: 'grooming', tag: 'tosa', shape: 'big', caption: 'Acabamento na tesoura' },
    { image: 'bandana', tag: 'momentos', shape: 'square', caption: 'Pronto para voltar pra casa' },
    { image: 'tub', tag: 'banho', shape: 'wide', caption: 'Hora do banho' },
    { image: 'cat', tag: 'momentos', shape: 'tall', caption: 'Gatos também são bem-vindos' },
    { image: 'poodle', tag: 'tosa', shape: 'square', caption: 'Tosa no padrão da raça' },
    { image: 'brushing', tag: 'tosa', shape: 'wide', caption: 'Escovação com calma' },
    { image: 'puppy', tag: 'momentos', shape: 'square', caption: 'Primeira visita' },
    { image: 'tubTowel', tag: 'banho', shape: 'square', caption: 'Toalha quentinha' },
  ],
};

export const beforeAfter = {
  title: 'Um cuidado que você consegue ver.',
  text: 'Arraste para comparar o durante e o resultado final de um atendimento.',
  labels: { before: 'Antes', after: 'Depois' },
  caption: 'Imagens demonstrativas.',
};

export const testimonials = {
  title: 'O que os tutores sentem',
  note: 'Depoimentos demonstrativos',
  items: [
    { text: 'Meu cachorro sempre volta tranquilo e muito bem cuidado. Dá para perceber o carinho em cada detalhe.', author: 'M. S.', pet: 'tutora do Theo' },
    { text: 'Finalmente encontrei um lugar onde consigo deixar meu pet sem preocupação.', author: 'R. A.', pet: 'tutor da Nina' },
    { text: 'O atendimento é próximo, cuidadoso e muito organizado.', author: 'C. L.', pet: 'tutora do Pipoca' },
  ],
};

export const booking = {
  title: 'Vamos cuidar do próximo banho?',
  text: 'Escolha o serviço, conte um pouco sobre o seu pet e nós respondemos pelo WhatsApp para combinar o melhor horário.',
  options: ['Banho', 'Tosa', 'Banho + Tosa', 'Outro atendimento'],
  sizes: ['Pequeno', 'Médio', 'Grande'],
  cta: 'Agendar pelo WhatsApp',
};

export const location = {
  title: 'Estamos perto de você.',
  text: 'Um espaço de bairro, fácil de chegar, com atendimento por hora marcada.',
};
