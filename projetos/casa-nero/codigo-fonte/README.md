# Casa Nero — Site Institucional + Experiência Digital

> **PROJETO DEMONSTRATIVO / FICTÍCIO** — portfólio da **Chrysxxz Digital**.
> Casa Nero, a Chef Helena Duarte, endereço, telefone, horários, cardápio e preços são inventados.
> Não representa nenhum restaurante real.

## O que tem
- Hero com prato ilustrado que gira com a rolagem e título com efeito de inversão
- A casa (manifesto), pratos em destaque (carrossel), menu à la carte com abas e prévia do prato,
  menu degustação, roteiro da noite, espaços, galeria editorial, reservas e localização/horários
- Status "aberto agora" calculado pelos horários reais da configuração
- Reserva funcional (demo): pessoas → data → horário → espaço → dados → confirmação + envio pelo WhatsApp
- Versão mobile própria: barra fixa "Reservar + WhatsApp", menu em tela cheia, prévia do prato por toque

## Estrutura
```
src/data/restaurant.js   ← dados do restaurante (contato, endereço, horários, regras de reserva)
src/data/menu.js         ← cardápio, pratos em destaque, menu degustação e "receitas visuais"
src/ui/plate.js          ← gerador das ilustrações de pratos em SVG
src/services/reservations.js ← "API" de reservas (localStorage; trocar por fetch() num backend real)
src/sections/*.js        ← uma seção por arquivo
src/behaviors/*.js       ← interações (menu, carrossel, reserva, reveal)
src/styles/*.css         ← sistema visual
```

## Imagens
As prévias publicadas não carregam fotos externas; por isso os pratos são **ilustrações SVG** geradas
por dados. Num projeto real, troque `Plate(...)` por `<img>` com a fotografia gastronômica do cliente.

## Build
`npm run build` → `dist/index.html` (arquivo único, abre direto no navegador).
