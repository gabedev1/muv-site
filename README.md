# MUV — Apresentação & Assistente de Estudos com IA

Projeto front-end em Next.js que apresenta o trabalho do MUV (feira de ciências) e inclui uma página de chat para conversação com uma IA. Visual moderno inspirado no design do Gemini, com Header fixo, área de apresentação, página "Sobre / Integrantes", página do projeto e chat com interface estilizada.

## Recursos

- Layout com Header fixo, logo e navegação (Home / Sobre / Grupo / Redes).
- Página principal com hero estilizado e CTA para iniciar conversa com a IA.
- Página "Sobre" com cards dos integrantes e efeito de hover com preenchimento líquido.
- Página do projeto com seções, objetivos e badges de tecnologia.
- Página de Chat (use client) com área de mensagens, envio, estado de carregamento e design responsivo.
- CSS Modules e global styles para variáveis CSS ( :root ) e tipografia.
- Imagens/ativos esperados em /public.

## Estrutura principal (resumida)

- app/
  - page.jsx — página inicial
  - layout.jsx — root layout (importar globals.css aqui)
  - components/
    - Header.jsx, Header.module.css
  - chat/
    - page.jsx, chat.module.css
  - sobre/
    - page.jsx, sobre.module.css
  - projeto/
    - page.jsx, projeto.module.css
- public/ — imagens e fontes públicas
- app/style/page.module.css — estilos da home (ou use globals.css)
- README.md — este arquivo

## Pré-requisitos

- Node.js 16+ (recomendado)
- npm / yarn / pnpm

## Executando localmente

1. Instale dependências:
   npm install

   # ou

   yarn

2. Inicie o servidor de desenvolvimento:
   npm run dev

   # ou

   yarn dev

3. Abra http://localhost:3000

## Variáveis de ambiente (chat/IA)

Se a página de chat usa um serviço de IA (ex.: OpenAI) via rota de API/servidor, adicione as credenciais em `.env.local` na raiz do projeto. Exemplo:

```
OPENAI_API_KEY=sk-...
```

- Se você expor alguma chave no front-end, use prefixos adequados (ex.: NEXT*PUBLIC*) apenas quando intencional. Ideal: chamadas à API com chave em backend (API routes / server functions).

## Dicas comuns

- :root não funciona em CSS Modules diretamente. Coloque variáveis globais em `app/globals.css` e importe em `app/layout.jsx`, ou use `:global(:root)` no módulo.
- Fonts: prefira `next/font` (app router) ou importe Google Fonts em `globals.css`. Reinicie o dev server se não carregar.
- Imagens do fundo e logo devem ficar em `/public` e serem referenciadas como `/nome-arquivo.ext`.

## Build & Deploy

Build:

```
npm run build
npm run start
```

Deploy recomendado: Vercel (suporte nativo a Next.js). Configure variáveis de ambiente no painel do provedor.

## Personalização rápida

- Cores: ajuste variáveis em `globals.css` (ou :root).
- Troque `/public/logo.png` pela sua logo.
- Ajuste o caminho da imagem de fundo em `chat.module.css` e `projeto.module.css`.

## Licença & Créditos

Projeto criado para demonstração do grupo (feira de ciências). Use e modifique conforme necessidade — adicione uma licença no repositório quando desejar compartilhar publicamente.

Se quiser, atualizo o README com instruções específicas sobre a integração do backend/rota de chat que você estiver usando (ex.: exemplo de API route para OpenAI).
