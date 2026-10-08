# Arceuz

Ferramentas de marketing e conteúdo para pequenos negócios, profissionais autônomos e marcas em construção. Identidade visual em preto, branco e laranja, com a logo original da Arceuz.

## Acessar

- Aplicativo com login: https://arceuz-marketing.contamateusfortnite.chatgpt.site
- A página pública para GitHub Pages fica na pasta `docs/`. Consulte [GITHUB-PAGES.md](GITHUB-PAGES.md) para publicar e atualizar.

## Recursos

- Página pública com apresentação das ferramentas, exemplos interativos e perguntas frequentes.
- Painel individual com autenticação pela conta do ChatGPT.
- Modelos de conteúdo, calendário editorial, campanhas, modelos de mensagens e biblioteca pessoal.
- Assistente de IA com interface pronta; as respostas dependem de configurar a chave do provedor no servidor.

O GitHub Pages hospeda apenas a página pública. Os botões de acesso abrem o aplicativo hospedado, onde ficam a autenticação, as APIs e os dados privados. Conteúdos e campanhas não são publicados automaticamente nas redes sociais.

## Desenvolvimento

Use Node.js 22.13 ou superior e a versão do pnpm indicada no `package.json`.

```sh
pnpm install --frozen-lockfile
pnpm run build:pages
```

O comando acima gera a página pública em `docs/`. O aplicativo completo usa React, Vinext, Tailwind, componentes shadcn e Cloudflare D1; seus arquivos permanecem em `app/`, `lib/`, `db/` e `drizzle/`.

A autenticação do aplicativo depende do ambiente Sites, que valida e encaminha a identidade do usuário. Não hospede as APIs em um ambiente que aceite esses cabeçalhos diretamente de visitantes sem implementar uma autenticação adequada. Não inclua arquivos `.env`, tokens ou chaves de API no repositório. `.env.example` contém somente exemplos vazios.
