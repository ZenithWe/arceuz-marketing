# Arceuz no GitHub Pages

A pasta `docs/` contém a página pública da Arceuz, com o mesmo conteúdo e identidade visual da versão hospedada.

- Publicação: branch `main`, pasta `/docs` nas configurações de Pages.
- Endereço esperado: `https://zenithwe.github.io/arceuz-marketing/` (só estará ativo após habilitar o Pages).
- O botão de entrada direciona para o aplicativo em `https://arceuz-marketing.contamateusfortnite.chatgpt.site/entrar`.
- Login, banco de dados, conteúdos privados e a API de IA continuam no aplicativo hospedado. GitHub Pages serve somente arquivos estáticos.
- O assistente continua marcado como “Em preparação” nesta versão, pois a geração ainda depende de ativação.

## Atualizar a página pública

Instale as dependências usando a versão do pnpm definida no `package.json` e execute:

```sh
pnpm run build:pages
```

O exportador reutiliza `app/page.tsx`, `app/public-experience.tsx`, os componentes, o estilo e a logo originais. Ele gera o HTML já renderizado e o JavaScript para as abas e perguntas frequentes. Faça commit da pasta `docs/` atualizada.

Nenhuma chave de API ou banco de dados deve ser incluída no repositório.
