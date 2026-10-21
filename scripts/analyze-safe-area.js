const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const dirs = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());

console.log('=== ANÁLISE DE SAFE AREA 68px/74px E LAYOUT ===\n');

for (const slug of dirs) {
  const p = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(p)) continue;
  const c = fs.readFileSync(p, 'utf8');

  // Buscar todas as regras CSS com 68px ou 74px
  const regex = /([^{};/@\n\r]+)\{([^}]*(?:68px|74px)[^}]*)\}/gi;
  let m;
  const matches = [];
  while ((m = regex.exec(c)) !== null) {
    matches.push({
      selector: m[1].trim().replace(/\s+/g, ' '),
      rule: m[2].trim().replace(/\s+/g, ' ')
    });
  }

  // Buscar estilo de body, html, ou container principal
  const bodyMatch = c.match(/body\s*\{([^}]+)\}/i);
  const htmlMatch = c.match(/html\s*\{([^}]+)\}/i);
  const containerMatch = c.match(/(?:#game-container|#app|\.game-container|#canvas-container|\.wrap|#game)\s*\{([^}]+)\}/i);

  console.log(`[${slug}]`);
  if (matches.length > 0) {
    matches.forEach(item => {
      console.log(`   Safe Area rule: "${item.selector}" => ${item.rule}`);
    });
  } else {
    console.log(`   (Sem regras explícitas de 68px/74px)`);
  }
  if (bodyMatch) {
    const b = bodyMatch[1].replace(/\s+/g, ' ').trim();
    console.log(`   body: ${b.slice(0, 90)}...`);
  }
  console.log('');
}
