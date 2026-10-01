/**
 * IMAGENS
 * ------------------------------------------------------------
 * Todas as fotografias do site ficam centralizadas aqui.
 * Fonte: Unsplash (licença Unsplash — uso livre, crédito opcional).
 * Para substituir por fotos reais do cliente, troque apenas `src`
 * (pode ser uma URL externa ou um caminho local, ex: 'assets/banho.jpg').
 *
 * `pos` define o enquadramento (object-position) de cada foto.
 */
const U = (id) => `https://images.unsplash.com/${id}`;

export const images = {
  hero: {
    src: U('photo-1581887936036-3f4f7f0b6679'),
    alt: 'Cachorro de pelo longo marrom enrolado em uma toalha depois do banho',
    pos: '50% 40%',
    credit: 'Jamie Street / Unsplash',
  },
  bath: {
    src: U('photo-1597603413826-cd1c06b05222'),
    alt: 'Cachorro pequeno de pelo longo recebendo banho com espuma',
    pos: '50% 45%',
    credit: 'benjamin lehman / Unsplash',
  },
  grooming: {
    src: U('photo-1719464454959-9cf304ef4774'),
    alt: 'Cachorro pequeno branco tendo o pelo aparado com tesoura',
    pos: '50% 40%',
    credit: 'Buddy AN / Unsplash',
  },
  brushing: {
    src: U('photo-1528846104175-4fd300ee59da'),
    alt: 'Profissional escovando com cuidado o pelo de um cachorro',
    pos: '50% 50%',
    credit: 'Александр Гросс / Unsplash',
  },
  drying: {
    src: U('photo-1625321171045-1fea4ac688e9'),
    alt: 'Profissional com secador preparando a finalização do atendimento',
    pos: '50% 35%',
    credit: 'J. Balla Photography / Unsplash',
  },
  cat: {
    src: U('photo-1625279138876-8910c2af9a30'),
    alt: 'Gato de pelo longo branco e marrom no colo de uma pessoa',
    pos: '50% 40%',
    credit: 'Reba Spike / Unsplash',
  },
  cuddle: {
    src: U('photo-1675430426271-d74b542f21e4'),
    alt: 'Mulher segurando com carinho um cachorro pequeno branco enrolado em uma manta',
    pos: '50% 40%',
    credit: 'benjamin lehman / Unsplash',
  },
  bandana: {
    src: U('photo-1678153188688-0dc45722708a'),
    alt: 'Cachorro pequeno marrom e branco usando uma bandana verde',
    pos: '50% 35%',
    credit: 'Karsten Winegeart / Unsplash',
  },
  towel: {
    src: U('photo-1611173622933-91942d394b04'),
    alt: 'Lulu da Pomerânia marrom enrolado em uma toalha após o banho',
    pos: '50% 40%',
    credit: 'Hayffield L / Unsplash',
  },
  tub: {
    src: U('photo-1583534778255-5d67d3dcf95d'),
    alt: 'Dachshund marrom sentado em uma banheira branca',
    pos: '50% 50%',
    credit: 'Zak Neilson / Unsplash',
  },
  tubTowel: {
    src: U('photo-1647002380358-fc70ed2f04e0'),
    alt: 'Cachorro sentado em uma banheira ao lado de uma toalha',
    pos: '50% 50%',
    credit: 'Ayla Verschueren / Unsplash',
  },
  poodle: {
    src: U('photo-1625277743460-43716b93507a'),
    alt: 'Poodle preto com pelo bem aparado',
    pos: '50% 35%',
    credit: 'Reba Spike / Unsplash',
  },
  puppy: {
    src: U('photo-1608138498574-e5dab4c0ca52'),
    alt: 'Filhote de golden retriever em retrato de perto',
    pos: '50% 40%',
    credit: 'Linoleum Creative Collective / Unsplash',
  },
  smallTowel: {
    src: U('photo-1592887302112-b87aca16ad2c'),
    alt: 'Cachorro pequeno de pelo longo branco e marrom enrolado em uma toalha',
    pos: '50% 40%',
    credit: 'Fernando Andrade / Unsplash',
  },
  portrait: {
    src: U('photo-1576033008321-bc748ab54838'),
    alt: 'Cachorro marrom de pelagem média em retrato',
    pos: '50% 35%',
    credit: 'Kristin Brown / Unsplash',
  },
  // Antes e depois (imagens demonstrativas)
  before: {
    src: U('photo-1597603413826-cd1c06b05222'),
    alt: 'Demonstração: cachorro durante o banho, antes da finalização',
    pos: '50% 45%',
    credit: 'benjamin lehman / Unsplash',
  },
  after: {
    src: U('photo-1592887302112-b87aca16ad2c'),
    alt: 'Demonstração: cachorro finalizado e seco após o atendimento',
    pos: '50% 40%',
    credit: 'Fernando Andrade / Unsplash',
  },
};

/** Monta a URL otimizada (Unsplash CDN aceita w/q/fm/fit). Caminhos locais são mantidos. */
export function imgUrl(src, w = 1200, q = 72) {
  if (!/^https:\/\/images\.unsplash\.com\//.test(src)) return src;
  return `${src}?auto=format&fit=crop&w=${w}&q=${q}`;
}
