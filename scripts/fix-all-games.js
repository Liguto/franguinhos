#!/usr/bin/env node

/**
 * ==============================================================================
 * KRUUJ GAME FIXER & STANDARDIZER (V2)
 * ==============================================================================
 * Aplica correções cirúrgicas e universais nos 36 jogos:
 *  - Viewport padrão
 *  - Touch-action: none
 *  - Injeção padronizada de KruujSDK (loadingFinished, gameplayStart, gameplayStop)
 *  - Tratamento resiliente de quebras de linha Windows (\r\n)
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const dirs = fs.readdirSync(gamesDir, { withFileTypes: true }).filter(d => d.isDirectory());

for (const d of dirs) {
  const slug = d.name;
  const gamePath = path.join(gamesDir, slug);
  const indexPath = path.join(gamePath, 'index.html');
  if (!fs.existsSync(indexPath)) continue;

  let content = fs.readFileSync(indexPath, 'utf-8');
  let changed = false;

  // 1. Viewport universal
  const correctViewport = '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">';
  const viewportRegex = /<meta[^>]+name=["']viewport["'][^>]*>/i;
  if (viewportRegex.test(content)) {
    const cur = content.match(viewportRegex)[0];
    if (cur !== correctViewport) {
      content = content.replace(viewportRegex, correctViewport);
      changed = true;
    }
  }

  // 2. Trava de Scroll (touch-action: none)
  if (!content.includes('touch-action: none') && !content.includes('touch-action:none')) {
    content = content.replace(/touch-action:\s*manipulation/g, 'touch-action: none');
    if (!content.includes('touch-action: none')) {
      content = content.replace(/<\/style>/i, `  * { touch-action: none; -webkit-touch-callout: none; }\n</style>`);
    }
    changed = true;
  }

  // 3. Garantir Kruuj SDK script tag no head
  if (!content.includes('kruuj-sdk.js') && !content.includes('poki-sdk.js')) {
    content = content.replace(/<head>/i, `<head>\n  <script src="/sdk/v1/kruuj-sdk.js"></script>`);
    changed = true;
  }

  // 4. Injeção universal dos 3 eventos de ciclo de vida Kruuj SDK se algum estiver faltando
  const needsStart = !content.includes('gameplayStart') && !content.includes('game_start');
  const needsStop = !content.includes('gameplayStop') && !content.includes('game_completed') && !content.includes('game_over');
  const needsLoading = !content.includes('gameLoadingFinished') && !content.includes('game_loaded');

  if (needsStart || needsStop || needsLoading) {
    const sdkBridge = `
<script>
/* KRUUJ-PROC-001 SDK Lifecycle Bridge */
window.addEventListener('DOMContentLoaded', () => {
  if (window.KruujSDK) {
    window.KruujSDK.init().then(() => {
      window.KruujSDK.gameLoadingFinished();
    });
  }
});
window.addEventListener('pointerdown', () => {
  if (window.KruujSDK) window.KruujSDK.gameplayStart();
}, { once: true });
window.addEventListener('beforeunload', () => {
  if (window.KruujSDK) window.KruujSDK.gameplayStop();
});
function kruujOnGameOver() {
  if (window.KruujSDK) window.KruujSDK.gameplayStop();
}
</script>
`;
    // Inserir antes de </body> ou no final do arquivo
    if (/<\/body>/i.test(content)) {
      content = content.replace(/<\/body>/i, `${sdkBridge}\n</body>`);
    } else {
      content += sdkBridge;
    }
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(indexPath, content, 'utf-8');
    console.log(`✔ Jogo ajustado: ${slug}`);
  }
}

console.log('\nAjustes aplicados!');
