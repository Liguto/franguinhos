# Portal de Jogos HTML5 — Guia de Arquitetura e Execução

Este guia descreve a estrutura do monorepo, as convenções adotadas no projeto e os comandos para iniciar o desenvolvimento e homologação local.

## 📁 Estrutura do Monorepo

```text
portal-jogos/
  apps/
    api/         # Backend Express + TS + Prisma Client (SQLite local, PG em prod) - Porta 4000
    web/         # Portal público de jogos (React + Vite + TS + Vanilla CSS) - Porta 3000
    admin/       # Cockpit Administrativo e Workflow Jurídico (React + Vite + TS) - Porta 3001
  packages/
    shared/      # Tipos, interfaces de domínio, DTOs de eventos e agregações de IA compartilhados
  package.json   # Configuração de NPM Workspaces globais
  tsconfig.json  # Configuração de TypeScript centralizada
```

---

## 🚀 Como Executar o Projeto Localmente

Siga o passo a passo abaixo para inicializar o ambiente de desenvolvimento.

### 1. Instalar as Dependências Globais
Execute o comando abaixo na raiz do projeto para instalar todas as dependências de todos os workspaces de uma única vez:
```bash
npm install
```

### 2. Inicializar o Banco de Dados (Prisma + SQLite)
Navegue até a pasta da API, gere as tabelas locais no arquivo `dev.db` e popule o banco de dados com os jogos, usuários administrativos e eventos analíticos iniciais:
```bash
# Gerar Prisma Client
npm run prisma:generate

# Executar as migrações locais no SQLite
npm run prisma:migrate

# Executar o seed script para popular o banco de dados
npm run prisma:seed
```

### 3. Rodar em Modo de Desenvolvimento (Live Reload)
Você pode rodar todos os serviços em paralelo de forma extremamente conveniente a partir da raiz:
```bash
# Rodar todos os serviços juntos (API, Web e Admin)
npm run dev

# Ou rodar serviços específicos:
npm run dev:api     # Inicia a API na porta 4000
npm run dev:web     # Inicia o Portal na porta 3000
npm run dev:admin   # Inicia o Cockpit na porta 3001
```

### 4. Credenciais de Teste Geradas no Seed
- **Painel Administrativo:**
  - **URL:** http://localhost:3001
  - **Usuário:** `admin`
  - **Senha:** `admin123` (Possui papel `super_admin`)
- **Portal Público:**
  - **URL:** http://localhost:3000
  - Permite jogar sem conta.
  - Para testar favoritos e login, registre um novo usuário ou use `admin` / `admin123`.

---

## 🔒 Princípios e Diretrizes de Segurança e Privacidade

1. **Minimização de Dados (LGPD):** Não solicitamos e-mail ou telefone para criação de contas comuns. A recuperação de contas é feita por frases ou códigos de segurança gerados uma única vez.
2. **Curadoria de IdadeProfiling-Free:** Não inferimos a idade real do visitante por comportamento. A homepage exibe jogos com base em escolhas de preferência expressas declaradas pelo usuário (Modo Geral, Modo Infantil, Modo Sênior).
3. **Isolamento de Segurança de Jogos:** Todos os jogos de terceiros devem ser executados em subdomínios separados (em produção) e incorporados usando iframes estritamente isolados com a sandbox especificada:
   ```html
   <iframe src="..." sandbox="allow-scripts allow-same-origin allow-forms" allow="fullscreen; autoplay" allowfullscreen></iframe>
   ```
4. **Segurança de Dados para IA:** Nunca envie dados de sessões individuais ou dados pessoais brutos de jogadores para motores de inteligência artificial. Compile agregações analíticas diárias e envie apenas métricas agregadas neutras com o nível de confiança exigido.

---

## 🔧 Validação e Rollback

- **Compilação Completa:** `npm run build` compila todos os pacotes e garante integridade estrita de tipagem.
- **Rollback de Jogos:** O diretório de cada jogo no Cloud Storage é versionado (ex: `/games/snake-v1/index.html`). O rollback técnico é feito instantaneamente editando o campo `prefixUrl` da ficha técnica do jogo no Cockpit Admin.

---

## 🤖 Subagentes Especializados do Projeto (Gemini CLI)

O repositório conta com subagentes especializados configurados em `.gemini/agents/` para manter 100% do contexto vivo entre sessões:

### 1. `@kruuj-game-engineer` (`.gemini/agents/kruuj-game-engineer.md`)
- **Foco:** Criação de novos jogos em HTML5 Canvas, WebAudio, física de colisão, mecânicas arcade, telas de carregamento `KruujLoader`, responsividade mobile fullscreen (desvio de 68px do botão Poki) e integração de catálogo no portal (`App.tsx` e `catalogSync.ts`).
- **Como invocar no chat:** `@kruuj-game-engineer crie um novo jogo de tiro cósmico...` ou peça alterações de gameplay.

### 2. `@kruuj-business-architect` (`.gemini/agents/kruuj-business-architect.md`)
- **Foco:** Consultoria de produto, expansão do portal KRUUJ, alinhamento com o White Paper v1.0, 7 verticais de públicos (Parent Gate para bebês, Sênior 60+, Kids), modelos de monetização (Rewarded Ads, Pre-roll) e governança jurídica LGPD/ECA.
- **Como invocar no chat:** `@kruuj-business-architect como podemos aumentar a retenção da vertical infantil...` ou dúvidas de roadmap.

