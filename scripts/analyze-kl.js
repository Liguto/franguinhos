const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const dirs = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());

console.log('=== ANÁLISE DE #kl E SUPRESSÃO IFRAME ===');
for (const slug of dirs) {
  const p = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(p)) continue;
  const c = fs.readFileSync(p, 'utf8');

  const hasKl = c.includes('id="kl"') || c.includes("id='kl'");
  if (hasKl) {
    const klOutMatch = c.match(/#kl\.out\s*\{[^}]+\}/i);
    const klOutDef = klOutMatch ? klOutMatch[0] : 'AUSENTE';
    const hasIframeSuppression = /self\s*!==\s*top/.test(c) && /kl/.test(c);
    const hasPostMessage = /postMessage\s*\(\s*\{\s*type:\s*['"]game_loaded['"]/i.test(c);
    console.log(`${slug.padEnd(25)} | klOut: ${klOutDef.padEnd(65)} | ifrSup: ${hasIframeSuppression} | postMsg: ${hasPostMessage}`);
  } else {
    console.log(`${slug.padEnd(25)} | SEM #kl`);
  }
}
