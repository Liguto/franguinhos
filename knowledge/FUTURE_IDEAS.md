# 💡 Backlog de Inovação e Visão de Futuro — Franguinhos Games

O portal Franguinhos Games atingiu a conclusão do seu MVP, estabelecendo o padrão ouro em **Impacto Social, Acessibilidade Cognitiva e Redução de Danos**. As ideias outrora visionárias já foram integradas à base principal do projeto.

---

## ✅ Features Sociais e de Inclusão (Implementadas no MVP)

- [x] **Modo Bebês (0-4 anos):** Ambiente de "redução de danos" focado em causa e efeito (Jogo: *Bolhas Mágicas*).
- [x] **Zero Anúncios Infantis:** Publicidade destruída em nível de código (React) no Modo Bebês para evitar cliques erráticos e fugas da página.
- [x] **Kiosk Mode Lockscreen:** Expansão absoluta de tela utilizando Fullscreen API acoplado à *Screen Wake Lock API* (tela não apaga).
- [x] **Cadeado de Segurança (Parent Gate):** Trava matemática que impede a saída do jogo e acesso indesejado ao resto do aparelho pelos bebês.
- [x] **Modo Neurodivergente (TEA):** Chave de interface dedicada (Toggle) que elimina imediatamente o sensory overload visual (desfoques, cores neon, gradientes flutuantes), mantendo o design do portal seguro para autistas (curadoria padrão 'Denise, mãe do José').

---

## 🚀 ROADMAP: Ideias Futuras para o Core de Negócios e Produto

Agora que a base e os diferenciais sociais estão operantes, os próximos passos visam tracionar a aquisição, a retenção em longo prazo e a expansão de infraestrutura:

### 1. Sistema de Contas Premium "Ad-Free" e Nuvem
* **O que é:** Uma assinatura (ex: R$ 4,90/mês) processada via Stripe ou Mercado Pago, atrelada à conta do usuário.
* **Benefícios:** Remove globalmente todos os Ad Slots do site (não apenas nos modos Bebês) e passa a salvar o progresso dos jogos, high-scores e lista de favoritos no banco de dados na Nuvem (PostgreSQL) ao invés do cache LocalStorage do navegador.

### 2. Push Notifications via PWA (Retenção Ativa)
* **O que é:** Integrar o portal à Web Push API.
* **Uso Tático:** Quando um usuário autoriza, o portal pode enviar notificações diretamente para o celular dele de forma gratuita e offline (Ex: "João bateu seu recorde no Sudoku! Venha recuperar a coroa."). Substitui agressivamente a necessidade de E-mail Marketing.

### 3. Integrações e Patrocínios B2B Diretos
* **Oportunidade Comercial:** Aproveitar a arquitetura do "Modo Bebês" e "Modo TEA" para vender licenciamento do portal para clínicas de psicopedagogia, escolas e hospitais.
* **Execução:** Substituir a marca Franguinhos Games no Header pela logo da instituição de saúde ou escola parceira, ofertando a eles um "App Seguro de Ensino" White-label sem precisar manter servidores.

### 4. Leaderboards Globais e Sincronismo Multiplayer
* **Evolução Técnica:** Subir uma camada de WebSockets (Socket.io) ou integração com Firebase Realtime Database na API Node.js.
* **Funcionalidade:** Mostrar no card de cada jogo, além do número de "Likes", o Rank Global em tempo real dos 3 maiores pontuadores do dia, estimulando competição e dobrando o tempo de tela do usuário comum.