# Changelog — Kruuj Baby Bath

Todas as alterações notáveis neste jogo serão documentadas neste arquivo.
O formato é baseado nas diretrizes do **Manual KRUUJ-PROC-001** e segue [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-20
### Adicionado
- Versão inicial homologada para publicação oficial na plataforma KRUUJ.
- Integração completa com o KRUUJ SDK v1.0 (Poki Standard):
  - Sinalização de prontidão via `gameLoadingFinished`.
  - Registro de início de sessão ativa via `gameplayStart`.
  - Encerramento e transição de rodada via `gameplayStop`.
- Viewport móvel padronizado com `viewport-fit=cover` e `user-scalable=no`.
- Trava universal de rolagem e gestos indesejados no navegador mobile via `touch-action: none`.
- Controle de acessibilidade para alternar áudio e efeitos sonoros (`🔊/🔇`).
- Proteção da zona superior esquerda (recuo de 68px do botão de saída do portal).
- Documentação completa de pacote com README.md, LICENSES.md e CHANGELOG.md.
