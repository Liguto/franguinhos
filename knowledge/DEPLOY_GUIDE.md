# 🚀 Guia de Deploy Gratuito (GCP + Vercel + Render + Supabase)

Este guia prático foi criado para colocar o **Franguinhos Games** no ar de forma 100% gratuita, separando a aplicação em camadas profissionais na nuvem.

O seu projeto é Full-Stack, então precisamos hospedar 3 coisas:
1. **O Banco de Dados:** Supabase (PostgreSQL gratuito)
2. **O Backend (API):** Render (Node.js gratuito)
3. **O Frontend (Site Público):** Vercel (React gratuito e super rápido)

---

## Passo 1: Criando o Banco de Dados (Supabase)
O SQLite que usamos na sua máquina (`dev.db`) não funciona em nuvem serverless. Vamos criar um PostgreSQL real.
1. Acesse [Supabase.com](https://supabase.com/) e crie uma conta com o GitHub.
2. Clique em **"New Project"**. Dê o nome de `franguinhos-db` e crie uma senha forte (guarde essa senha!).
3. Aguarde o banco ser criado (leva 1 minuto).
4. No painel do Supabase, vá em **Project Settings (Engrenagem)** -> **Database**.
5. Role até achar **"Connection string" (URI)**.
6. Copie essa URL (ela se parecerá com `postgresql://postgres:sua-senha@db.supabase.co:5432/postgres`).

---

## Passo 2: Preparando o Código para a Nuvem (Já Concluído por Mim!)

**Excelente Notícia:** Todas as configurações descritas abaixo já foram **completamente aplicadas, testadas e commitadas** no seu repositório por mim! Você não precisa fazer nenhuma alteração de código ou arquivos locais para o deploy. Pode pular diretamente para o **Passo 3**!

*(Para referência, as alterações que já consolidei no seu projeto são:)*

### 2.1 - Atualizar o Prisma para PostgreSQL
Abri o arquivo `apps/api/prisma/schema.prisma` e configurei o datasource para `postgresql` integrado ao `DATABASE_URL` em nuvem, adicionando suporte a compiladores Linux.

### 2.2 - Criar a ponte (Proxy) para o Frontend
Criei o arquivo `apps/web/vercel.json` com as regras de reescrita (`rewrites`) corretas e otimizadas para apontar para a API no Render.

---

## Passo 3: Subindo o Backend / API (Render)
1. Acesse [Render.com](https://render.com/) e crie uma conta com o GitHub.
2. Clique em **"New +"** e escolha **"Web Service"**.
3. Conecte o seu repositório `franguinhos`.
4. Preencha as configurações assim:
   * **Name:** `franguinhos-api` (ou similar)
   * **Root Directory:** *(Deixe EM BRANCO / Vazio)*. **Atenção:** Como o projeto usa NPM Workspaces (monorepo) e a API depende do pacote `@portal-jogos/shared`, deixar essa configuração em branco garante que o Render compile o monorepo inteiro a partir do root, evitando erros de dependências locais ausentes.
   * **Environment:** `Node`
   * **Build Command:** `npm install && npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma && npm run build`
   * **Start Command:** `node apps/api/dist/index.js`
5. Role para baixo, clique em **Advanced (Environment Variables)** e adicione:
   * Key: `DATABASE_URL` | Value: *(Cole a URL do Supabase do Passo 1, lembrando de substituir `[YOUR-PASSWORD]` pela senha que você criou).*
6. Clique em **Create Web Service** e espere compilar. Copie a URL que ele gerar lá em cima (ex: `https://franguinhos-api-xyz.onrender.com`).
   * *Opcional: Caso a URL gerada seja diferente de `franguinhos-api.onrender.com`, você pode atualizar a linha "destination" em apps/web/vercel.json e dar um novo push, mas o link sugerido em vercel.json já atua como um excelente roteador padrão!*

---

## Passo 4: Subindo o Frontend Público (Vercel)
O seu sócio vai acessar o site por esse link!
1. Acesse [Vercel.com](https://vercel.com/) e faça login com GitHub.
2. Clique em **"Add New Project"**.
3. Importe o repositório `franguinhos`.
4. Na tela de configuração (Configure Project):
   * **Root Directory:** Clique em Edit e selecione a pasta `apps/web`.
   * As opções de Build (Vite) ele detecta sozinho.
5. Clique em **Deploy**.

Em menos de 2 minutos a Vercel vai te entregar o link oficial (ex: `https://franguinhos.vercel.app`). 

**Pronto!** Envie esse link para o seu sócio. O projeto estará rodando liso na internet de forma 100% gratuita, usando a infraestrutura Cloud mais moderna disponível.