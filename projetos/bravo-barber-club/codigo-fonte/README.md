# BRAVO Barber Club — ecossistema de agendamento (projeto conceitual)

Projeto de portfólio da **Chrysxxz Digital**. Marca, contatos, clientes e agendamentos são fictícios.

## Experiências (mesma aplicação, rotas por hash)
- `#/` site público · `#/agendar` fluxo de agendamento · `#/cliente` área do cliente · `#/painel` painel da barbearia
- A barra "Demo" no topo alterna entre Site, Cliente e Painel.

## Como os dados funcionam
- `src/data/business.js` — dados da barbearia (endereço, horários, regras de agenda)
- `src/data/catalog.js` — serviços, barbeiros e status
- `src/services/bookingService.js` — "API" de agendamentos (disponibilidade, criar, alterar status).
  Hoje usa `localStorage`; para um backend real, reimplemente as funções com `fetch()` mantendo as assinaturas.
- `src/services/seed.js` — agenda demonstrativa gerada em relação ao horário atual.
- Painel e área do cliente se atualizam em tempo real, inclusive entre abas (evento `storage`).

## Build
`npm run build` gera `dist/index.html` (arquivo único com CSS e JS embutidos).
