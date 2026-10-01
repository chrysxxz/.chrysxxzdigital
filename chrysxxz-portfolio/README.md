# Chrysxxz Digital · Portfólio

Site do portfólio da Chrysxxz Digital, pronto para o **GitHub Pages**. É um site estático: não precisa de build, servidor nem instalação.

## Estrutura

```
index.html              portfólio (página principal)
.nojekyll               evita o processamento Jekyll do GitHub Pages
projetos/
  amora-e-pata/         index.html + codigo-fonte/
  bravo-barber-club/    index.html + LEIA-ME.txt + codigo-fonte/
  casa-nero/            index.html + LEIA-ME.txt + codigo-fonte/
  delicatto/            index.html
  dashboard-casa-nero/  index.html
  novale-planilha/      index.html (visualizador) + planilha .xlsx original
```

Cada projeto fica isolado na sua pasta e é aberto em um `<iframe>` de tela cheia dentro do portfólio. Por isso o CSS e o JavaScript de um projeto não interferem nos outros nem no portfólio. O visitante nunca sai do domínio.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub (por exemplo `chrysxxz-portfolio`).
2. Envie **o conteúdo desta pasta** para o repositório, de modo que `index.html` fique na raiz (não dentro de outra pasta). O arquivo `.nojekyll` também precisa ir.
3. No repositório, abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch `main` e a pasta `/ (root)` e clique em **Save**.
5. Em alguns minutos o site fica em `https://SEU-USUARIO.github.io/chrysxxz-portfolio/`.

Todos os caminhos são relativos, então funciona tanto em `usuario.github.io/repositorio/` quanto em domínio próprio.

## Como adicionar ou trocar um projeto

1. Coloque os arquivos em `projetos/nome-do-projeto/`, com um `index.html` na raiz da pasta.
2. No `index.html` do portfólio, procure a lista `const P=[` (no final do arquivo) e acrescente um item. O campo `u` recebe o caminho: `u:'projetos/nome-do-projeto/index.html'`.

## Observações

- **Projetos demonstrativos.** Nomes, dados, preços e contatos dos projetos são fictícios e estão indicados no portfólio.
- **Internet necessária para alguns recursos.** Fontes (Google Fonts) e as fotos do Amora & Pata (Unsplash) são carregadas da internet, como nos projetos originais.
- **Links de WhatsApp e Instagram** dentro dos projetos foram mantidos como desenvolvidos e abrem em nova aba.
- **Dados salvos no navegador.** Bravo Barber Club e Casa Nero guardam reservas de demonstração no `localStorage`, com chaves separadas (`bravo.*` e `casanero.*`).
- **Planilha NOVALE.** O Excel não roda no navegador, então `novale-planilha/index.html` mostra as abas, os indicadores e os gráficos da planilha, e oferece o `.xlsx` original para download.
- **Chrysxxz CRM.** Ainda não há arquivos do projeto: o card abre uma demonstração simulada, criada só para o portfólio. Para trocá-lo pelo projeto real, siga "Como adicionar ou trocar um projeto".
