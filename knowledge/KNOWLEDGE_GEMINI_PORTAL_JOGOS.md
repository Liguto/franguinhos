# Base de conhecimento — Franguinhos Games

## 1. Visão do Produto
O **Franguinhos Games** é um portal de jogos HTML5 responsivo e progressivo (PWA), focado em desempenho mobile, segurança de sandbox e conformidade absoluta com a LGPD e o Estatuto da Criança e do Adolescente (ECA).

O grande diferencial competitivo desta plataforma é o seu foco em **Acessibilidade Cognitiva e Inclusão**. Diferente de portais de jogos comuns, o Franguinhos Games divide sua curadoria através de Temas Dinâmicos e lógicas de UX estritas para públicos específicos.

## 2. O Escopo do MVP (Concluído)

### Funcionalidades Públicas:
- **Catálogo Unificado:** Filtros por categoria, buscas com Long-Tail SEO dinâmico.
- **PWA Instalável:** Experiência nativa em celulares (App-like).
- **Sistema Offline-First:** Curtidas e favoritos simulados de forma reativa e persistidos localmente (LocalStorage) sem exigir login.
- **Layout Cinema de Gameplay:** O jogo ocupa posição de destaque no topo (100% largura até 1280px), com informações (especificações técnicas, tags, desenvolvedor) e jogos recomendados alocados de forma limpa abaixo dele.

### Monetização Max RPM:
- Saturação estratégica e respeitosa de Ad Slots: Master Top Leaderboard, Native Ads In-Feed injetados matematicamente a cada 4 jogos, e Square Stacks empilhados nas margens laterais de monitores widescreen.

## 3. Os Modos de Acessibilidade e Inclusão (Core Features)

O portal não possui apenas filtros, ele altera sua estrutura física (CSS Variables, DOM e Eventos) para proteger os públicos vulneráveis:

1. **Modo Educacional:**
   - Jogos focados em aprendizado (Ex: *Super Math Run*).
   - Estética construtivista (Azul escolar, verde aprendizado). 
   - Publicidade ativa, mas operando sob diretrizes restritas do ECA (Zero profiling / Não personalizada).

2. **Modo Sênior (Terceira Idade):**
   - Curadoria de puzzles, lógica e memória (Ex: *Sudoku Zen Master*).
   - Estética voltada para alta legibilidade e conforto visual, usando tons quentes (dourados e terracota) em alto contraste, minimizando a fadiga ocular de idosos.

3. **Modo Bebês (Toddler - 0 a 4 anos):**
   - Ambiente de "Redução de Danos" focado em causa e efeito (Ex: *Bolhas Mágicas* in-house).
   - **Zero Anúncios:** Todos os Ad Placements são destruídos fisicamente pelo React para evitar cliques acidentais e saídas indesejadas do site.
   - **Kiosk App & Lockscreen:** Uso da `Fullscreen API` em conjunto com a `Screen Wake Lock API` (a tela não apaga). 
   - **Parent Gate:** A única saída do jogo é um ícone de cadeado isolado. Se acionado, exige do usuário a solução de uma equação matemática aleatória, prendendo o bebê de forma segura e evitando que ele saia do jogo e acesse outras áreas do celular dos pais.

4. **Modo Neurodivergente (Chave TEA):**
   - Um Toggle no cabeçalho aciona o `.theme-tea`.
   - Modifica globalmente a interface, achatando cores para tons pastéis foscos, removendo todos os desfoques (blur), neons, gradientes de fundo e luzes piscantes, criando um ambiente de zero sobrecarga sensorial (zero sensory overload) validado por especialistas (Selo Denise).

## 4. Arquitetura Técnica (Monorepo)

```text
Usuário web/mobile  -->  Cloudflare (CDN / DNS)
        |
        +--> apps/web (React + Vite + Vanilla CSS) -> Porta 3000
        +--> apps/admin (React + Vite Backoffice)  -> Porta 3001
        +--> apps/api (Express + TypeScript)       -> Porta 4000
        |
    (Prisma ORM + SQLite no Dev / PostgreSQL no Prod)
```

## 5. Dossiê Jurídico Administrativo (Backoffice)
Todo o conteúdo do portal é regido por contratos rigorosos. O Cockpit Administrativo exibe os KPIs de negócios (Sessões, RPM, Bounce Rate) e cruza as informações com as matrizes de conformidade, guardando logs de auditoria jurídica sobre a proveniência dos jogos e a aprovação editorial de especialistas para cada nicho.