# KRUUJ | PROCESSO 001
# MANUAL DE DESENVOLVIMENTO E PUBLICAÇÃO DE JOGOS
**Padrões para HTML5, Unity e Godot**  
*Da ideia à publicação: um processo para produzir rápido, sem abrir mão da qualidade Kruuj.*  
**Versão 1.1 | Outubro de 2026 | Uso interno e parceiros externos**

---

## 1. Propósito e regra central
Este manual estabelece o processo oficial para conceber, desenvolver, testar, empacotar e publicar jogos na plataforma Kruuj. Seu objetivo é aumentar a velocidade de produção sem sacrificar estabilidade, qualidade visual, experiência mobile, segurança ou reputação da plataforma.

> **REGRA DE OURO:** Nenhum jogo entra em produção pública apenas porque “abre” ou porque o desenvolvimento parece concluído. Todo jogo deve passar pelo checklist de qualidade, funcionar nos dispositivos-alvo, ter uma versão identificável e ser aprovado pelo validador automático (`scripts/check-game.js`).

O processo vale inicialmente para jogos produzidos pela Kruuj Studio e será a base de adaptação futura para estúdios parceiros e Kruuj Students.

---

## 2. Escopo e princípios
- **Priorizar jogos que iniciem rapidamente**, sejam compreensíveis sem explicação longa e tenham um ciclo de jogo claro.
- **Projetar para navegador desde o início**; mobile não é uma adaptação opcional feita no fim.
- **Manter cada jogo isolado**: erros, áudio, estado ou CSS de um jogo não devem quebrar a plataforma nem outros jogos.
- **Preferir escopo pequeno e finalizado** a muitos jogos publicados com defeitos.
- **Não publicar código/build sem responsável**, versão, instruções de controle, thumbnail e testes registrados.
- **Usar bibliotecas, imagens, fontes, músicas e efeitos sonoros** com licença compatível e documentada (`LICENSES.md`).

---

## 3. Fluxo oficial de produção
- **P0 — Proposta:** Registrar nome provisório, gênero, público, mecânica principal, diferencial, referência visual e estimativa de escopo. Confirmar que a ideia é suficientemente distinta e viável.
- **P1 — Mini-GDD e escopo:** Definir core loop, condição de vitória/derrota, controles, duração típica, progressão, telas necessárias e o que fica fora da primeira versão.
- **P2 — Protótipo jogável:** Validar a mecânica central com arte provisória. O objetivo é provar diversão e viabilidade, não polir.
- **P3 — Vertical slice:** Produzir um trecho representativo com arte, áudio, interface, controles, carregamento e desempenho próximos do final.
- **P4 — Produção:** Construir conteúdo restante, menus, pausa/reinício, estados de vitória/derrota, tratamento de erros e ajustes de acessibilidade.
- **P5 — QA interno:** Executar testes funcionais, responsividade, compatibilidade, performance, áudio, segurança e regressão. Registrar bugs.
- **P6 — Candidato a release (RC):** Congelar escopo, atribuir versão, gerar build limpa e executar checklist final em desktop e mobile.
- **P7 — Publicação controlada:** Publicar primeiro em ambiente de teste/staging ou em acesso limitado. Confirmar telemetria básica e ausência de falhas críticas.
- **P8 — Release e monitoramento:** Publicar para todos, registrar versão e data, monitorar erros/feedback e manter plano de rollback.

---

## 4. Documento mínimo de cada jogo
Cada jogo deve ter uma página de projeto no Notion ou documentação equivalente com os seguintes itens:
- **ID único** (ex.: `KJ-001`), nome, responsável e estado atual.
- **Mini-GDD:** conceito, público, core loop, controles, condições de vitória/derrota e duração esperada.
- **Plataformas suportadas**, orientação preferida, navegadores-alvo e requisitos mínimos.
- **Lista de funcionalidades** incluídas e explicitamente excluídas do MVP do jogo.
- **Inventário de assets** e licenças/fontes (`LICENSES.md`).
- **Link do repositório**, instruções para executar localmente e procedimento de build/exportação (`README.md`).
- **Versão atual**, changelog, bugs conhecidos e resultado do último QA.
- **Thumbnail, ícone**, título público, descrição curta e instruções de controle.

---

## 5. Requisitos gerais para jogos HTML5

### 5.1 Estrutura e inicialização
- O jogo deve abrir por uma URL de staging e funcionar por HTTPS no ambiente final.
- Entregar uma build autocontida e reproduzível; não depender de caminhos locais, arquivos do computador do desenvolvedor (`file:///`, `C:\`, `localhost`) ou servidores temporários.
- Usar caminhos relativos para assets quando apropriado; verificar maiúsculas/minúsculas nos nomes dos arquivos, pois servidores Linux diferenciam capitalização.
- Não iniciar áudio automaticamente antes de uma interação do usuário. Exibir botão/ação clara para começar e habilitar áudio.
- Mostrar estado de carregamento quando houver download/preparação perceptível; evitar telas de loading que nunca terminam.
- Se algum recurso essencial falhar, apresentar mensagem recuperável em vez de tela branca.

### 5.2 Arquitetura e isolamento
- Todo o conteúdo do jogo deve ficar dentro do contêiner/player definido pela plataforma (`<iframe>`).
- Evitar CSS global que afete a página hospedeira; prefixar classes ou usar módulos/escopo.
- Não sobrescrever window/document handlers da plataforma sem necessidade. Remover listeners e timers ao encerrar/reiniciar cenas.
- **Não usar `eval`**, `new Function`, `document.write`, scripts remotos desconhecidos ou dependências sem avaliação.
- Proibido uso de diálogos bloqueantes nativos (`alert()`, `confirm()`, `prompt()`) que travam o loop do navegador mobile.
- Não manipular ou redirecionar a janela hospedeira (`window.parent.location` ou `window.top.location`).
- Não armazenar dados pessoais desnecessários. Qualquer analytics deve seguir a política de privacidade da plataforma (LGPD).
- Se o jogo usa iframe, documentar permissões necessárias e aplicar apenas as permissões estritamente exigidas.

### 5.3 Performance e Limites Numéricos
- Carregar primeiro o essencial e adiar recursos não necessários ao início.
- Comprimir imagens e áudio; usar formatos modernos (WebP, MP3 128kbps, OGG) e manter fallback quando necessário.
- Evitar loops de jogo que criem objetos, listeners ou elementos DOM a cada frame sem limpeza.
- Controlar partículas, física, animações e efeitos para dispositivos de menor desempenho.
- Usar delta time ou mecanismo equivalente para que a simulação não dependa de FPS fixo.
- Monitorar consumo de memória, travamentos e tempo de carregamento em dispositivo real, não apenas no computador de desenvolvimento.

#### Tabela de Limites Técnicos Homologados:
| Recurso / Métrica | Limite Recomendado | Teto Máximo Permitido | Ação em caso de estouro |
| :--- | :--- | :--- | :--- |
| **Peso Total do Pacote** | $\le 10\text{ MB}$ | $18\text{ MB}$ (HTML5) / $25\text{ MB}$ (Unity/Godot) | Bloqueio S2 / Otimização obrigatória |
| **Imagens Individuais** | $\le 250\text{ KB}$ | $500\text{ KB}$ | Converter para WebP ou reduzir resolução |
| **Áudios Individuais** | $\le 800\text{ KB}$ | $1.5\text{ MB}$ | Comprimir bitrate para 128kbps (proibido .wav não comprimido) |
| **Tempo de Loading (C2P)**| $\le 2.5\text{ s}$ | $4.0\text{ s}$ | Adiar assets secundários e otimizar bundle |

### 5.4 Controles e UX
- Exibir controles na tela inicial ou em uma dica curta dentro do jogo.
- Oferecer teclado e mouse quando fizer sentido; jogos de toque devem ter controles touch reais, não apenas teclas simuladas.
- Botões touch devem ser grandes (mínimo $44 \times 44\text{px}$), separados e posicionados fora das áreas cobertas pelos dedos; evitar depender de hover.
- Respeitar safe areas em celulares com notch e manter botões importantes afastados das bordas.
- **Zona de Exclusão do Botão Poki (Mobile):** No celular, o portal KRUUJ projeta um botão flutuante de retorno no canto superior esquerdo (`top: 14px, left: 16px`). Elementos vitais do HUD (pontuação, botões de ação ou vidas) devem manter uma distância de segurança de **68px** desse canto para evitar toques acidentais.
- Permitir pausar, reiniciar e voltar ao catálogo quando aplicável; combinar com o contrato de integração da plataforma.
- Evitar texto minúsculo, alvos de toque estreitos e informações importantes apenas por cor.

### 5.5 Responsividade mobile
> **REQUISITO DE RELEASE:** Testar em pelo menos um telefone real, além de emulação/responsividade do navegador. Uma tela que “cabe” no celular ainda pode ter controles inutilizáveis.

- Definir comportamento para portrait, landscape ou responsivo; não deixar a orientação ao acaso.
- Tag viewport obrigatória e blindada:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
  ```
- Bloquear rolagem acidental da página com o dedo no CSS:
  ```css
  * {
    touch-action: none;
    -webkit-touch-callout: none;
    user-select: none;
  }
  ```
- Usar layout fluido e escala proporcional; evitar dimensões fixas que cortem HUD, menus ou botões.
- Testar telas estreitas, telas altas, mudança de orientação e teclado virtual, quando aplicável.
- Verificar que modais, pause, game over e telas de vitória também se adaptam ao mobile.
- Testar toque contínuo, múltiplos toques quando necessários e comportamento ao alternar de app/aba.

### 5.6 Áudio e acessibilidade
- Disponibilizar controle de volume e opção de silenciar quando houver áudio contínuo.
- Respeitar as restrições de autoplay dos navegadores (áudio só toca após interação do usuário).
- Não comunicar estado somente por som; usar também sinais visuais.
- Manter contraste suficiente, legibilidade e feedback visual para ações importantes.
- Evitar flashes rápidos ou efeitos visuais que possam causar desconforto ou convulsões.

---

## 6. Padrão de pacote HTML5
A entrega deve conter um pacote organizado e instruções claras de execução:

```text
game-kj-001/
├── index.html        # Ponto de entrada obrigatório
├── README.md         # Ficha técnica, controles, orientação e instruções
├── CHANGELOG.md      # Histórico de alterações e versões
├── LICENSES.md       # Declaração de dependências e assets de terceiros
├── assets/           # Diretório de mídias (quando não inline)
│   ├── images/
│   ├── audio/
│   └── fonts/
├── src/              # Código-fonte (se houver etapa de build)
└── build/            # Artefatos compilados (se aplicável)
```

- **`README.md` deve informar:** nome/ID, versão, controles, orientação, navegadores testados, como executar, como gerar a build e limitações conhecidas.
- **`LICENSES.md` deve listar:** todos os assets e dependências de terceiros e suas respectivas licenças comerciais/autorizações.

---

## 7. Regras para engines: Unity e Godot

### 7.1 Quando usar Unity
Use Unity quando o jogo justificar o peso e a complexidade da engine: 3D, física/sistemas mais elaborados, ferramentas específicas ou uma equipe já produtiva nela. Para um microgame 2D simples, compare o custo de build, carregamento e manutenção antes de escolher.
- Exportar para Web/WebGL usando uma versão LTS aprovada pela equipe, sempre que possível.
- Configurar canvas/resolução para adaptar-se ao contêiner e evitar dimensões fixas que cortem a interface.
- Testar compressão (Brotli/Gzip), memória, tamanho de build e tempo de carregamento; builds Unity para web podem ser significativamente maiores que HTML5 leve.
- Validar teclado, mouse e touch em dispositivos reais; não assumir que uma interação feita para desktop funcionará no celular.
- Não depender de funcionalidades nativas que não existam no build Web.
- Entregar os arquivos completos exportados, instruções de build, versão da Unity, configurações relevantes e projeto-fonte no repositório.

### 7.2 Quando usar Godot
Godot é uma opção para jogos 2D e 3D quando a equipe deseja uma engine integrada e fluxo de exportação web. A escolha entre renderer, versão e recursos deve ser validada com um protótipo cedo, antes de investir no jogo inteiro.
- Exportar para Web com templates correspondentes à versão usada e documentar a versão exata do Godot.
- Testar a build em HTTPS e nos navegadores-alvo; verificar requisitos de threading/headers se o projeto depender deles.
- Preferir recursos e plugins comprovadamente compatíveis com exportação web.
- Conferir carregamento de fontes, áudio, input, resolução, fullscreen e retorno ao foco depois de trocar de aba.
- Entregar projeto-fonte, exportação completa, instruções e lista de plugins/add-ons com licenças.

### 7.3 Regra comum para Unity/Godot
A engine não é aprovação automática. A build exportada precisa cumprir os mesmos critérios de qualidade, responsividade, desempenho, segurança e integração de qualquer jogo HTML5.
- Não enviar apenas o executável de Windows/macOS/Linux; a entrega principal para a plataforma deve ser a versão web acordada.
- Não publicar build de desenvolvimento com console, overlays, debug menus ou logs sensíveis.
- Testar no domínio/ambiente de staging da Kruuj, pois comportamento local pode diferir do servidor.
- Se o jogo não atingir o desempenho ou o tempo de carregamento aceitável, otimizar ou reavaliar a engine/escopo.

---

## 8. Integração com a plataforma Kruuj (KRUUJ SDK)
Todos os jogos são executados dentro de contêineres protegidos no portal. O canal oficial de comunicação é o **KRUUJ SDK**, que é **100% retrocompatível com a API da Poki** (`window.PokiSDK = window.KruujSDK`).

### 8.1 Inclusão do SDK
No `<head>` do arquivo `index.html`:
```html
<script src="/sdk/v1/kruuj-sdk.js"></script>
```

### 8.2 Ciclo de Vida Obrigatório
1. **Inicialização e Prontidão de Carga:**
   Assim que o jogo inicializar o canvas e terminar de carregar os assets:
   ```javascript
   KruujSDK.init().then(() => {
       KruujSDK.gameLoadingFinished(); // Libera a tela de loading do portal
   });
   ```
2. **Início da Gameplay Ativa:**
   Quando o jogador clica em "Jogar", passa pelo menu ou inicia a partida:
   ```javascript
   KruujSDK.gameplayStart();
   ```
3. **Pausa, Game Over ou Retorno ao Menu:**
   Quando o jogador perde, vence, pausa ou retorna à tela inicial:
   ```javascript
   KruujSDK.gameplayStop();
   ```

### 8.3 Monetização e Comerciais (Opcional)
- **Comerciais Intersticiais (em transições de fase ou reinícios):**
  ```javascript
  KruujSDK.commercialBreak(() => {
      // Pausar sons do jogo enquanto o comercial toca
  });
  ```
- **Vídeo Recompensado (para reviver ou dobrar moedas, voluntário):**
  ```javascript
  KruujSDK.rewardedBreak(() => {
      // Pausar sons
  }).then((assistiuCompleto) => {
      if (assistiuCompleto) {
          darRecompensa();
      }
  });
  ```

### 8.4 Diretrizes de Integração
- Não inventar nomes de APIs ou mensagens. Usar apenas o SDK oficial fornecido.
- Não manipular navegação, abrir pop-ups ou redirecionar o usuário sem ação clara.
- Não colocar anúncios próprios, rastreadores ou coleta de dados sem aprovação explícita.
- Quando houver pontuação/ranking, validar dados no servidor; não confiar em dados brutos do cliente.
- Ter fallback funcional: se o SDK não responder, o jogo deve continuar jogável normalmente.

---

## 9. QA: checklist obrigatório

### 9.1 Funcional
- [ ] O jogo abre e chega ao menu/início sem erro.
- [ ] Todos os controles principais funcionam.
- [ ] Regras, pontuação, vitória/derrota e reinício funcionam.
- [ ] Não há softlocks, telas vazias ou caminhos sem saída.
- [ ] Pause/resume e mudança de aba não quebram o jogo.
- [ ] Links e botões fazem o que prometem.

### 9.2 Desktop
- [ ] Testado em navegador Chromium (Chrome/Edge/Opera ou equivalente aprovado).
- [ ] Testado em Firefox ou outro segundo navegador quando compatível.
- [ ] Resolução pequena e grande verificadas.
- [ ] Teclado, mouse, fullscreen e áudio verificados quando aplicáveis.

### 9.3 Mobile
- [ ] Testado em pelo menos um aparelho Android real e, quando fizer parte do público-alvo, iPhone/iPad real.
- [ ] Orientação e rotação comportam-se corretamente.
- [ ] Botões e controles podem ser usados sem toques acidentais.
- [ ] HUD, menus e telas finais não ficam cortados.
- [ ] Não há scroll/zoom involuntário durante a jogabilidade.
- [ ] Performance e aquecimento/bateria são aceitáveis para a duração prevista.

### 9.4 Qualidade e release
- [ ] Sem bugs críticos ou altos abertos.
- [ ] Sem assets ausentes, erros repetidos no console ou áudio quebrado.
- [ ] Tempo de carregamento e tamanho da build registrados e dentro dos limites.
- [ ] Thumbnail, ícone, título, descrição e controles estão prontos.
- [ ] Licenças de assets e dependências foram verificadas.
- [ ] Versão, changelog, build e responsável estão registrados.
- [ ] Build final foi testada no staging da Kruuj e validada pelo `scripts/check-game.js`.

---

## 10. Severidade de bugs e bloqueio de publicação

| Severidade | Exemplos | Regra de Bloqueio |
| :--- | :--- | :--- |
| **S0 — Crítico** | Não abre, trava, crash, vazamento de janela, risco de segurança/dados, uso de `eval()` | **Bloqueia release;** corrigir imediatamente. |
| **S1 — Alto** | Progressão impossível, controles essenciais falham, mobile inutilizável, zoom quebrado, áudio autoplay violado | **Bloqueia release.** |
| **S2 — Médio** | Bug contornável, UI parcialmente ruim, áudio secundário falha, falta de evento do SDK, peso de asset elevado | Corrigir antes do release, salvo exceção aprovada e registrada. |
| **S3 — Baixo** | Detalhe visual menor, texto pequeno, melhoria não essencial, README/LICENSES pendente | Pode entrar no backlog com responsável e prazo. |

Qualquer exceção a S1/S2 deve ser aprovada pelo responsável do produto e documentada com impacto, workaround e plano de correção. Nunca esconder bugs conhecidos.

---

## 11. Versionamento, publicação e rollback
- Usar versionamento semântico quando apropriado: `MAJOR.MINOR.PATCH` (ex.: `1.2.0`).
- Manter changelog com mudanças, correções e problemas conhecidos.
- Não sobrescrever silenciosamente uma build publicada sem registrar a versão.
- Guardar a última build estável para rollback instantâneo.
- Após publicar, fazer smoke test no site real: abrir, iniciar, jogar, pausar/reiniciar e sair.
- Se aparecer bug crítico, retirar temporariamente o jogo ou reverter para a build estável e registrar incidente.

---

## 12. Publicação: ficha de submissão
- [ ] ID e nome do jogo definidos.
- [ ] Responsável e contato interno definidos.
- [ ] Build web completa anexada ou vinculada.
- [ ] Link do repositório e instruções de build disponíveis.
- [ ] Thumbnail/ícone no padrão da plataforma.
- [ ] Descrição curta e controles revisados.
- [ ] Plataformas e orientação declaradas.
- [ ] Checklist QA preenchido com data e testador.
- [ ] Lista de bugs conhecidos aprovada.
- [ ] Direitos e licenças verificados.
- [ ] Versão e changelog preenchidos.
- [ ] Aprovação final registrada via validador automático (`check-game.js`).

---

## 13. Responsabilidades e aprovação

| Papel | Responsabilidade Principal |
| :--- | :--- |
| **Game Developer** | Implementar, manter build, corrigir bugs, documentar e executar testes locais com o validador. |
| **QA / Testador** | Executar checklist independente, registrar passos para reproduzir bugs e classificar severidade. |
| **Responsável pelo jogo** | Confirmar escopo, conteúdo, qualidade final e materiais de publicação. |
| **Responsável pela plataforma** | Validar integração, comportamento no player/staging, conformidade com SDK e segurança. |
| **Release owner** | Autorizar publicação, registrar versão e garantir rollback disponível. |

Em equipe pequena, uma pessoa pode acumular funções, mas o checklist deve ser executado de forma explícita. Sempre que possível, alguém diferente do desenvolvedor faz a última rodada de QA.

---

## 14. Métricas de qualidade
Começar com poucas métricas e registrar dados por jogo:
- Taxa de sucesso de carregamento.
- Tempo de carregamento percebido.
- Erros/crashes reportados.
- Percentual de sessões mobile sem falhas.
- Taxa de conclusão ou duração da sessão, quando houver instrumentação aprovada.
- Feedback dos jogadores e bugs por versão.

Não usar métricas como substituto do QA. Um jogo popular também pode ter defeitos; um jogo com poucas sessões ainda precisa cumprir os padrões.

---

## 15. Processo para parceiros e Kruuj Students
Este processo interno pode ser convertido em um guia externo. Para terceiros, manter os requisitos de build, responsividade, licenças, QA e submissão, adicionando termos de publicação e regras comerciais.
- Enviar o Kruuj Game Standard antes de iniciar a integração.
- Solicitar build web, fonte/projeto conforme o acordo, instruções e lista de dependências.
- Exigir declaração de autoria e comprovação de direitos sobre assets e música.
- Não prometer publicação automática: toda submissão passa por avaliação técnica e editorial.
- Definir por contrato propriedade intelectual, licença de distribuição, remuneração/revenue share, retirada do jogo, suporte e atualizações.
- Estudantes devem ter autorização para publicar trabalhos acadêmicos e assets de terceiros; a instituição não concede automaticamente todos os direitos.

---

## 16. Template de relatório de QA

```text
JOGO / ID: 
VERSÃO: 
BUILD / URL: 
DATA: 
TESTADO POR: 
DISPOSITIVOS / NAVEGADORES: 

RESULTADO: [ ] APROVADO   [ ] REPROVADO   [ ] APROVADO COM PENDÊNCIAS

[ ] Funcional
[ ] Desktop
[ ] Mobile real
[ ] Performance/carregamento
[ ] Áudio
[ ] Licenças/segurança
[ ] Staging Kruuj
[ ] Validador Automático Aprovado

BUGS ENCONTRADOS:
- ID:
- Severidade (S0/S1/S2/S3):
- Passos para reproduzir:
- Resultado esperado:
- Resultado observado:
- Dispositivo/navegador:
- Evidência:

DECISÃO FINAL:
RESPONSÁVEL PELA APROVAÇÃO:
```

---

## 17. Definition of Done — quando um jogo está pronto
Um jogo só é considerado **PRONTO** quando cumpre todos os itens abaixo, e não quando o desenvolvedor considera que terminou:
- [ ] A experiência principal está completa e sem bugs S0/S1.
- [ ] Os requisitos S2 foram corrigidos ou têm exceção formal aprovada.
- [ ] O jogo obtém o status **APROVADO** no `scripts/check-game.js`.
- [ ] A build web funciona no staging da Kruuj sob HTTPS.
- [ ] Desktop e mobile foram testados em aparelho real conforme o público-alvo.
- [ ] Carregamento, responsividade, controles, áudio e telas finais foram verificados.
- [ ] README, changelog, versão e links técnicos estão atualizados.
- [ ] Assets e dependências têm licença compatível registrada em `LICENSES.md`.
- [ ] Thumbnail, descrição e controles estão prontos.
- [ ] QA foi registrado e a aprovação final foi dada.
- [ ] Existe uma build estável anterior ou plano de rollback.

---

## 18. Controle do documento

| Campo | Valor |
| :--- | :--- |
| **Documento** | KRUUJ-PROC-001 — Manual de Desenvolvimento e Publicação de Jogos |
| **Versão** | 1.1 |
| **Status** | Processo oficial consolidado com Kruuj SDK e Validação Automatizada |
| **Responsável** | Kruuj Studio / Liderança do Projeto |
| **Aplicação** | Jogos HTML5 e jogos exportados para Web por Unity/Godot |
| **Revisão sugerida**| A cada novo ciclo semestral ou evolução de infraestrutura |

---

## 19. Anexo Técnico: Como Executar o Validador de Jogos

### Execução Local para Desenvolvedores Externos:
```bash
node check-game.js ./pasta-do-jogo
```

### Execução no Monorepo KRUUJ:
```bash
# Validar um único jogo:
npm run check:game <slug-do-jogo>

# Validar todo o catálogo do monorepo:
npm run check:games
```
O validador audita automaticamente: entrada `index.html`, isolamento, caminhos relativos, segurança, viewport mobile, prevenção de scroll, ausência de modais bloqueantes, integração com Kruuj SDK e limites de peso.
