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

## Passo 2: Preparando o Código para a Nuvem (Faça na sua máquina)

No seu editor de código (VS Code), você precisa fazer 2 alterações antes de dar o próximo *Git Push*:

### 2.1 - Atualizar o Prisma para PostgreSQL
Abra o arquivo `apps/api/prisma/schema.prisma` e altere o bloco inicial para:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2.2 - Criar a ponte (Proxy) para o Frontend
Na nuvem, o frontend precisa saber onde a API está.
Na pasta `apps/web/`, crie um arquivo chamado **`vercel.json`** e cole este código dentro:
```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://franguinhos-api.onrender.com/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
*(Nota: O link `franguinhos-api.onrender.com` é um exemplo, usaremos o link real que a Render te der no Passo 3).*

**Após fazer essas 2 alterações, faça o commit e push para o GitHub:**
```bash
git add .
git commit -m "chore: prepara app para deploy no Supabase e Render"
git push -u origin main
```

---

## Passo 3: Subindo o Backend / API (Render)
1. Acesse [Render.com](https://render.com/) e crie uma conta com o GitHub.
2. Clique em **"New +"** e escolha **"Web Service"**.
3. Conecte o seu repositório `franguinhos`.
4. Preencha as configurações assim:
   * **Name:** `franguinhos-api` (ou similar)
   * **Root Directory:** `apps/api`
   * **Environment:** `Node`
   * **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`
   * **Start Command:** `npm start`
5. Role para baixo, clique em **Advanced (Environment Variables)** e adicione:
   * Key: `DATABASE_URL` | Value: *(Cole a URL do Supabase do Passo 1, lembrando de substituir `[YOUR-PASSWORD]` pela senha que você criou).*
6. Clique em **Create Web Service** e espere compilar. Copie a URL que ele gerar lá em cima (ex: `https://franguinhos-api-xyz.onrender.com`).
   * *Volte no seu arquivo `vercel.json` no PC, coloque essa URL exata na linha "destination" e faça um novo git push.*

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