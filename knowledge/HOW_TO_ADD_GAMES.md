# Guia de Integração: Como Adicionar Novos Jogos ao Portal 🎮

Este guia documenta o procedimento operacional padrão (SOP) para adicionar, integrar, homologar e publicar novos jogos HTML5 no ecossistema do **Portal de Jogos Franguinhos**. Este processo deve ser seguido à risca para garantir a conformidade jurídica (LGPD e ECA), a correta coleta de métricas analíticas e a integridade de tipagem estrita no monorepo.

---

## 🗺️ Visão Geral do Fluxo de Trabalho

```text
[Passo 1: Arquivos]      ---> [Passo 2: Comunicação]  ---> [Passo 3: Frontend Web]
Criar pasta em web/public     Injetar postMessage           Registrar no mockGames
e salvar index.html           (carregado, início, fim)      e isPhysicalGame no App.tsx

                                                                  |
                                                                  v
[Passo 6: Deploy]        <--- [Passo 5: Admin Panel]  <--- [Passo 4: Semente DB]
Rebuild, Push p/ GitHub       Registrar no mockCatalog      Atualizar seed.ts e
e Recarga Forçada             em apps/admin/src/App.tsx     rodar prisma:seed local
```

---

## 🛠️ Passo a Passo Detalhado

### 1. Preparação dos Arquivos Estáticos do Jogo
Todos os jogos HTML5 rodam de forma estática dentro de diretórios isolados por subdomínios (em produção) ou subpastas públicas do portal.

1. Escolha um **slug único** em minúsculas e separado por hifens (ex: `rocket-climb`).
2. Crie o diretório correspondente em:
   `apps/web/public/games/<slug>/`
3. Salve o arquivo HTML principal do seu jogo como `index.html` dentro dessa pasta.
4. Se o jogo possuir outros recursos (como imagens, sons, scripts ou folhas de estilo separados), salve-os na mesma pasta mantendo os caminhos relativos corretos.

---

### 2. Integração de Comunicação Iframe (`postMessage`)
Para que o portal monitore as partidas, registre curtidas reais e compute agregações analíticas (de conformidade com a LGPD e o ECA), o jogo incorporado deve avisar o portal mãe sobre eventos chave através da API `postMessage`.

Abra o arquivo `apps/web/public/games/<slug>/index.html` do jogo, localize o bloco de scripts e injete as seguintes funções e gatilhos:

#### A. Helper de Comunicação (Declare no início do script)
```javascript
// Enviar mensagens e estatísticas para o portal mãe
function sendEvent(type, data = {}) {
    window.parent.postMessage({ type, gameSlug: '<seu-slug-aqui>', ...data }, '*');
}
```

#### B. Evento de Carregamento Concluído
Dispare este evento assim que o script inicializar e a tela de carregamento do jogo terminar:
```javascript
sendEvent('game_loaded');
```

#### C. Evento de Início de Partida
Injete este gatilho na função responsável por começar a jogabilidade ativa (ex: clique no botão "Jogar", ou após a contagem regressiva):
```javascript
sendEvent('game_start');
```

#### D. Evento de Finalização de Partida (Game Over / Vitória)
Injete este gatilho na função responsável por encerrar a partida (quando as vidas chegam a zero, tempo esgota ou o jogador vence). É vital passar a pontuação inteira (`score`):
```javascript
sendEvent('game_completed', { score: Math.floor(player.score) });
```

---

### 3. Registro no Frontend do Portal (`apps/web`)
Para que o portal reconheça o jogo e evite cair na tela de *"Circuito em Manutenção Editorial"*, precisamos atualizá-lo em dois pontos no arquivo `apps/web/src/App.tsx`:

#### A. Habilitar Código Físico
Localize o helper `isPhysicalGame` (geralmente próximo à linha 680-700) e adicione o slug do seu jogo no array de retorno:
```typescript
const isPhysicalGame = (slug: string) => {
  return ['snake-retro', 'memory-match', 'space-defense', 'sudoku-zen', 'math-run', 'bubble-pop', '<seu-slug-aqui>'].includes(slug);
};
```

#### B. Adicionar ao Banco de Dados Mock Offline (Fallback)
Para que o jogo funcione perfeitamente caso a API esteja lenta ou offline (e para homologação local ultra-rápida), adicione um novo objeto com os metadados do jogo ao array `mockGames` dentro da função `fetchGames()`:
```typescript
{
  id: '8', // ID sequencial único do mock
  slug: '<seu-slug-aqui>',
  title: 'Título Comercial do Jogo',
  description: 'Descrição de SEO do circuito. Explique a jogabilidade, mecânicas e o público-alvo de forma otimizada para buscadores.',
  category: 'Arcade', // Categoria: 'Arcade' | 'Memória' | 'Ação' | 'Puzzle' | 'Bebês' | 'Terceira Idade'
  subcategories: ['Espaço', 'Sobrevivência'],
  tags: ['tag1', 'tag2', 'tag3'],
  ageRating: 'Livre', // Classificação: 'Livre' | '10+' | '14+'
  bannerUrl: 'https://images.unsplash.com/...', // URL de capa real do Unsplash ou assets locais
  iconUrl: 'rocket', // Ícone representativo ou fallback de lucide-react
  prefixUrl: '/games/<seu-slug-aqui>/',
  version: '1.0.0',
  controls: { mouse: false, teclado: true, toque: true, gamepad: false },
  orientation: 'both', // 'portrait' | 'landscape' | 'both'
  statusTechnical: 'aprovado',
  statusEditorial: 'publicado',
  statusDoc: 'aprovado',
  author: 'Nome do Desenvolvedor ou Estúdio',
  licenseName: 'Proprietário' // Ou licença comercial correspondente
}
```

---

### 4. Registro de Licenciamento & Semeação (`apps/api`)
Todos os jogos oficiais devem constar no banco de dados com seus respectivos acordos de licenciamento jurídico e cadeia de direitos autorais para auditoria.

1. Abra o arquivo `apps/api/prisma/seed.ts`.
2. Adicione os dados técnicos e o contrato legal correspondente no array `gamesToSeed`:
```typescript
{
  title: 'Título Comercial do Jogo',
  slug: '<seu-slug-aqui>',
  description: 'Descrição completa para exibição na área detalhada de informações do jogo.',
  category: 'Arcade',
  subcategories: 'Espaço,Sobrevivência,Casual', // Separados por vírgula no banco SQLite
  tags: 'tag1,tag2,tag3',
  ageRating: 'Livre',
  bannerUrl: 'https://images.unsplash.com/...',
  iconUrl: 'rocket',
  prefixUrl: '/games/<seu-slug-aqui>/',
  version: '1.0.0',
  mouse: false,
  teclado: true,
  toque: true,
  gamepad: false,
  orientation: 'both',
  statusTechnical: 'aprovado',
  statusEditorial: 'publicado',
  statusDoc: 'aprovado',
  author: 'Nome do Autor',
  licenseName: 'Proprietário',
  contract: {
    contractNumber: 'CON-2026-XXX', // Código sequencial incremental único
    signatoryCreator: 'Razão Social ou Nome do Criador',
    termsAccepted: true,
    licenseType: 'Proprietário (In-house)',
    exclusivityScope: 'Exclusivo Total',
    durationMonths: 120,
    revenueSharePercent: 0.0,
    fixedPaymentAmount: 0.0,
    auditLog: `[2026-08-31T21:00:00Z] Jogo desenvolvido in-house e integrado ao monorepo.\n`
  }
}
```
3. Aplique as alterações no banco de dados SQLite local executando o seguinte comando a partir da pasta raiz do projeto:
```bash
# Semeia novamente o banco limpando tabelas e inserindo os novos registros
npm run prisma:seed --workspace=@portal-jogos/api
```

---

### 5. Registro no Painel Administrativo (`apps/admin`)
O cockpit de administração também possui um simulador offline de auditoria jurídica e métricas analíticas assistidas por IA.

1. Abra o arquivo `apps/admin/src/App.tsx`.
2. Localize o array `mockCatalog` na função `fetchCatalog()`.
3. Insira o objeto contendo as chaves `game` e `contract` correspondentes:
```typescript
{
  game: {
    id: '8', // ID sequencial único correspondente
    slug: '<seu-slug-aqui>',
    title: 'Título Comercial do Jogo',
    description: 'Descrição curta para a tabela administrativa.',
    category: 'Arcade',
    subcategories: ['Espaço', 'Sobrevivência'],
    tags: ['tag1', 'tag2', 'tag3'],
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/...',
    iconUrl: 'rocket',
    prefixUrl: '/games/<seu-slug-aqui>/',
    version: '1.0.0',
    controls: { mouse: false, teclado: true, toque: true, gamepad: false },
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'Nome do Autor',
    licenseName: 'Proprietário'
  },
  contract: {
    id: 'c-8',
    gameId: '8',
    contractNumber: 'CON-2026-XXX',
    signatoryCreator: 'Nome do Criador',
    termsAccepted: true,
    licenseType: 'Proprietário (In-house)',
    exclusivityScope: 'Exclusivo Total',
    durationMonths: 120,
    revenueSharePercent: 0.0,
    fixedPaymentAmount: 0.0,
    auditLog: `[2026-08-31T21:00:00Z] Criado e homologado no monorepo de jogos.\n`
  }
}
```

---

## 🚀 Homologação, Compilação e Deploy

### A. Validar Compilação do Monorepo
Antes de realizar qualquer commit, execute uma compilação estrita em todos os workspaces na pasta raiz do projeto para validar que nenhuma quebra de tipagem do TypeScript ou do bundler ocorreu:
```bash
npm run build
```
O build de produção dos três aplicativos deve finalizar com 100% de sucesso e zero erros.

### B. Enviar Alterações para Produção (CI/CD)
1. Adicione os arquivos alterados ao Git:
   ```bash
   git add apps/web/public/games/<slug>/index.html apps/web/src/App.tsx apps/api/prisma/seed.ts apps/admin/src/App.tsx
   ```
2. Realize o commit seguindo as convenções de commits semânticos:
   ```bash
   git commit -m "feat(game): adiciona o jogo <Título> ao portal e registra dossiê jurídico de licenciamento"
   ```
3. Envie para o GitHub:
   ```bash
   git push origin main
   ```
4. O GitHub acionará o deploy automático da **Vercel** para os frontends (`apps/web` e `apps/admin`).

### C. Limpar o Cache do Navegador
Devido ao cache agressivo de arquivos de Single Page Applications (SPA), após a conclusão do deploy na Vercel, acesse o portal e execute uma recarga forçada no navegador:
* **No Windows/Linux:** `Ctrl` + `F5` ou `Ctrl` + `Shift` + `R`
* **No Mac:** `Cmd` + `Shift` + `R`
