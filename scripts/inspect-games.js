const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const dirs = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());

const results = [];
for (const slug of dirs) {
  const p = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(p)) continue;
  const content = fs.readFileSync(p, 'utf8');

  const hasKl = content.includes('id="kl"') || content.includes("id='kl'");
  const klOutMatch = content.match(/#kl\.out\s*\{([^}]+)\}/i);
  const klOutRules = klOutMatch ? klOutMatch[1] : null;
  const klOutHasPointerEvents = klOutRules ? /pointer-events\s*:\s*none/i.test(klOutRules) : false;
  const klOutHasDisplayNone = klOutRules ? /display\s*:\s*none/i.test(klOutRules) : false;

  const hasIframeCheck = /window\.self\s*!==\s*window\.top|self\s*!==\s*top/.test(content);
  const hasPostMessageLoaded = /postMessage\s*\(\s*\{\s*type:\s*['"]game_loaded['"]/i.test(content);

  // Procurar regras CSS com 68px ou 74px
  const paddingMatches = [];
  const regex68 = /([^{};/@]+)\{([^}]*(?:68px|74px)[^}]*)\}/gi;
  let m;
  while ((m = regex68.exec(content)) !== null) {
    paddingMatches.push({
      selector: m[1].trim().replace(/\s+/g, ' '),
      rule: m[2].trim().replace(/\s+/g, ' ')
    });
  }

  // Verificar overflow e altura no body/html/:root
  const bodyStyleMatch = content.match(/body\s*\{([^}]+)\}/i);
  const bodyStyle = bodyStyleMatch ? bodyStyleMatch[1].trim() : '';

  results.push({
    slug,
    hasKl,
    klOutRules,
    klOutHasPointerEvents,
    klOutHasDisplayNone,
    hasIframeCheck,
    hasPostMessageLoaded,
    paddingMatches,
    bodyStyle: bodyStyle.slice(0, 100)
  });
}

console.log(JSON.stringify(results, null, 2));
