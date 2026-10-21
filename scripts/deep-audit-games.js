const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const dirs = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());

const auditList = [];

for (const slug of dirs) {
  const indexPath = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(indexPath)) continue;

  const content = fs.readFileSync(indexPath, 'utf8');

  // 1. KruujLoader
  const hasKlElement = /id=["']kl["']/.test(content);
  const klOutMatch = content.match(/#kl\.out\s*\{([^}]+)\}/i);
  const klOutRules = klOutMatch ? klOutMatch[1] : '';
  const klOutPointerEvents = /pointer-events\s*:\s*none/i.test(klOutRules);
  const klOutDisplayNone = /display\s*:\s*none/i.test(klOutRules);

  const hasIframeCheck = /window\.self\s*!==\s*window\.top|self\s*!==\s*top/.test(content);
  const hasGameLoadedMessage = /postMessage\s*\(\s*\{[^}]*['"]game_loaded['"]/i.test(content);
  const hasGameLoadingFinished = /gameLoadingFinished/i.test(content);

  // 2. Safe Area Poki 68px / 74px
  const paddingIssues = [];
  const regex68 = /([^{};/@\n]+)\{([^}]*(?:68px|74px)[^}]*)\}/gi;
  let m;
  while ((m = regex68.exec(content)) !== null) {
    const selector = m[1].trim().replace(/\s+/g, ' ');
    const rule = m[2].trim().replace(/\s+/g, ' ');
    // Verificar se o seletor é container global
    const isGlobal = /^(body|html|#app|#game-container|\.game-container|\.container|#game|#wrap|\.wrap|main)$/i.test(selector);
    paddingIssues.push({ selector, rule, isGlobal });
  }

  // 3. Viewport e Overflow
  const viewportMatch = content.match(/<meta[^>]+name=["']viewport["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  const viewportContent = viewportMatch ? viewportMatch[1] : '';
  const hasCover = /viewport-fit\s*=\s*cover/i.test(viewportContent);
  const hasUserScalableNo = /user-scalable\s*=\s*no/i.test(viewportContent);

  const hasTouchActionNone = /touch-action\s*:\s*none/i.test(content);

  // 4. Overlays / Modais potencialmente bloqueantes
  const overlays = [];
  const overlayRegex = /<(div|section)[^>]*(id|class)=["']([^"']*(?:overlay|modal|start-screen|menu-screen|intro|loader)[^"']*)["'][^>]*>/gi;
  let ov;
  while ((ov = overlayRegex.exec(content)) !== null) {
    overlays.push({ tag: ov[1], attr: ov[2], name: ov[3] });
  }

  auditList.push({
    slug,
    hasKlElement,
    klOutPointerEvents,
    klOutDisplayNone,
    hasIframeCheck,
    hasGameLoadedMessage,
    hasGameLoadingFinished,
    paddingIssues,
    hasCover,
    hasUserScalableNo,
    hasTouchActionNone,
    overlayCount: overlays.length,
    overlays: overlays.slice(0, 5)
  });
}

console.log(JSON.stringify(auditList, null, 2));
