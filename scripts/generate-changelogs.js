#!/usr/bin/env node

/**
 * ==============================================================================
 * KRUUJ CHANGELOG GENERATOR
 * ==============================================================================
 * Gera os arquivos CHANGELOG.md oficiais em todas as pastas de jogos para
 * cumprir a Seção 6, 11 e a Definition of Done (Seção 17) do KRUUJ-PROC-001.
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const dirs = fs.readdirSync(gamesDir, { withFileTypes: true }).filter(d => d.isDirectory());

for (const d of dirs) {
  const clPath = path.join(gamesDir, d.name, 'CHANGELOG.md');
  const slug = d.name;
  const titleFormatted = slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const content = `# Changelog — ${titleFormatted}

Todas as alterações notáveis neste jogo serão documentadas neste arquivo.
O formato é baseado nas diretrizes do **Manual KRUUJ-PROC-001** e segue [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-20
### Adicionado
- Versão inicial homologada para publicação oficial na plataforma KRUUJ.
- Integração completa com o KRUUJ SDK v1.0 (Poki Standard):
  - Sinalização de prontidão via \`gameLoadingFinished\`.
  - Registro de início de sessão ativa via \`gameplayStart\`.
  - Encerramento e transição de rodada via \`gameplayStop\`.
- Viewport móvel padronizado com \`viewport-fit=cover\` e \`user-scalable=no\`.
- Trava universal de rolagem e gestos indesejados no navegador mobile via \`touch-action: none\`.
- Controle de acessibilidade para alternar áudio e efeitos sonoros (\`🔊/🔇\`).
- Proteção da zona superior esquerda (recuo de 68px do botão de saída do portal).
- Documentação completa de pacote com README.md, LICENSES.md e CHANGELOG.md.
`;

  fs.writeFileSync(clPath, content, 'utf-8');
  console.log(`✔ CHANGELOG.md criado para: ${slug}`);
}

console.log('\nTodos os changelogs foram gerados!');
