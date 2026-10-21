const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const slugs = [
  'bubble-pop',
  'kruuj-baby-shapes',
  'kruuj-defense',
  'kruuj-dominio',
  'kruuj-overdrive',
  'kruuj-penalty',
  'kruuj-solitaire',
  'kruujdoku',
  'kruujio',
  'rocket-rise',
  'math-run',
  'memory-match',
  'snake-retro',
  'space-defense',
  'sudoku-zen'
];

for (const slug of slugs) {
  const p = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(p)) continue;
  const c = fs.readFileSync(p, 'utf8');

  // Buscar seletores que parecem top, hud, header, stats, score, bar
  const headerMatches = [];
  const regex = /(#[a-zA-Z0-9_\-]+|\.[a-zA-Z0-9_\-]+)\s*\{[^}]*(?:position\s*:\s*(?:absolute|fixed)[^}]*(?:top\s*:\s*0|top\s*:\s*[0-9]+px)|padding-top|display\s*:\s*flex[^}]*justify-content)[^}]*\}/gi;
  let m;
  while ((m = regex.exec(c)) !== null) {
    if (/top|hud|header|bar|score|stat|nav/i.test(m[1])) {
      headerMatches.push(m[0].replace(/\s+/g, ' ').slice(0, 100));
    }
  }

  console.log(`[${slug}] matches:`, headerMatches.slice(0, 3));
}
