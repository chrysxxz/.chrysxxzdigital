# Amora & Pata — Pet Shop, Banho e Tosa (projeto demonstrativo)

Site de demonstração criado para o portfólio da **Chrysxxz Digital**.
Amora & Pata é uma marca **fictícia**: nome, endereço, telefone, horários e depoimentos são de demonstração.

## Como rodar

Requer Node.js 18+.

```
npm install
npm run dev        # abre em http://localhost:3000 (versão de desenvolvimento)
npm run build      # gera a pasta dist/ pronta para publicar
npm run preview    # build + abre a versão final em http://localhost:4000
```

> Para só visualizar, dê dois cliques em **`abrir-site.html`** (versão em arquivo único,
> não precisa de Node). O `index.html` da raiz é a versão de desenvolvimento e, se aberto
> com dois cliques, redireciona automaticamente para o `abrir-site.html`.

## Publicar

Rode `npm run build` e envie **a pasta `dist/`** para qualquer hospedagem estática
(Netlify Drop, Vercel, GitHub Pages, Hostinger, cPanel). A pasta `dist/` deste ZIP já vem gerada
e contém um único `index.html` com CSS e JavaScript embutidos.

No build, o HTML é pré-renderizado (bom para SEO), CSS e JS são embutidos em um único arquivo
e o schema LocalBusiness/PetStore é inserido no `<head>`.

## Estrutura

```
index.html                 casca da página (meta tags, SEO, Open Graph)
src/
  data/
    config.js              ← DADOS DA EMPRESA (telefone, WhatsApp, endereço, horários, links)
    images.js              ← TODAS AS FOTOS (URLs, textos alternativos, enquadramento, créditos)
    content.js             ← textos, serviços, galeria, depoimentos, opções de agendamento
  components/              peças reutilizáveis (Picture, Button, ServiceCard, Logo, ícones…)
  sections/                uma seção por arquivo (Hero, Trust, Services, Gallery, Booking…)
  behaviors/               interações (menu, reveal, galeria/lightbox, antes/depois, agendamento)
  lib/                     WhatsApp, SEO (schema) e utilitários
  styles/                  tokens.css (cores/tipografia), base, componentes, seções
  app.js                   monta a página a partir das seções
  main.js                  ponto de entrada no navegador
scripts/build.mjs          build estático
public/favicon.svg
```

## Adaptar para um cliente real

1. `src/data/config.js`: nome, WhatsApp (só dígitos com 55 + DDD), endereço, horários, Instagram, Maps, domínio.
   Mude `phoneIsDemo` e `demo.enabled` para `false`.
2. `src/data/images.js`: troque as URLs pelas fotos do cliente (URL externa ou caminho local, ex. `public/fotos/banho.jpg`).
3. `src/data/content.js`: textos, serviços, depoimentos reais (com autorização).
4. `index.html`: título, descrição, `og:image`, canonical e remova `<meta name="robots" content="noindex">`.
5. Mapa: `src/sections/Location.js` usa um mapa ilustrativo em SVG; pode ser trocado por um iframe do Google Maps.

## Imagens

Fotos do Unsplash (licença Unsplash, uso gratuito). Os créditos estão em `src/data/images.js`.
Elas são carregadas do CDN do Unsplash com tamanho responsivo (`srcset`) e lazy loading.
Se alguma foto não carregar, o espaço mostra um placeholder da marca, sem quebrar o layout.
As fotos do "antes e depois" são **demonstrativas** e não mostram o mesmo animal.

## Acessibilidade e SEO

HTML semântico, `alt` em todas as imagens, navegação por teclado (menu, galeria, lightbox,
comparador com input range), foco visível, respeito a `prefers-reduced-motion`, title, description,
Open Graph e schema.org PetStore.
