const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');

// 1. Jogos com "if (window.self === window.top)"
const vintageGames = [
  'kruuj-golden-memory',
  'kruuj-jigsaw-gallery',
  'kruuj-master-dominoes',
  'kruuj-word-search',
  'kruuj-zen-crosswords'
];

for (const slug of vintageGames) {
  const p = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');

  // Substituir o bloco if (window.self === window.top)
  const oldPattern = /if\s*\(\s*window\.self\s*===\s*window\.top\s*\)\s*\{[\s\S]*?clearInterval\(interval\);[\s\S]*?\}\s*,\s*150\s*\);\s*\}/;

  const newCode = `const isIframe = (window.self !== window.top);
      const kl = document.getElementById('kl');
      if (isIframe) {
        if (kl) {
          kl.classList.add('out');
          kl.style.display = 'none';
          kl.style.pointerEvents = 'none';
        }
        try { window.parent.postMessage({ type: 'game_loaded', gameSlug: '${slug}' }, '*'); } catch(e){}
        if (window.KruujSDK && typeof window.KruujSDK.gameLoadingFinished === 'function') {
          try { window.KruujSDK.gameLoadingFinished(); } catch(e){}
        }
      } else {
        let p = 0;
        const fill = document.getElementById('kl-fill');
        const pct = document.getElementById('kl-pct');
        const interval = setInterval(() => {
          p += 25;
          if (fill) fill.style.width = p + '%';
          if (pct) pct.textContent = p + '%';
          if (p >= 100) {
            clearInterval(interval);
            if (kl) {
              kl.classList.add('out');
              kl.style.display = 'none';
              kl.style.pointerEvents = 'none';
            }
            try { window.parent.postMessage({ type: 'game_loaded', gameSlug: '${slug}' }, '*'); } catch(e){}
            if (window.KruujSDK && typeof window.KruujSDK.gameLoadingFinished === 'function') {
              try { window.KruujSDK.gameLoadingFinished(); } catch(e){}
            }
          }
        }, 120);
      }`;

  if (oldPattern.test(html)) {
    html = html.replace(oldPattern, newCode);
    fs.writeFileSync(p, html, 'utf8');
    console.log(`[VINTAGE FIXED] ${slug}`);
  } else {
    console.log(`[VINTAGE PATTERN NOT MATCHED] ${slug}`);
  }
}

// 2. Jogos Baby com #kl órfão sem script de dismiss
const babyGames = [
  'kruuj-baby-feeding',
  'kruuj-baby-pairs',
  'kruuj-baby-silhouette'
];

for (const slug of babyGames) {
  const p = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');

  const dismissScript = `
<script>
/* KruujLoader Dismiss & Iframe Bridge */
window.addEventListener('DOMContentLoaded', () => {
  const isIframe = (window.self !== window.top);
  const kl = document.getElementById('kl');
  if (isIframe) {
    if (kl) {
      kl.classList.add('out');
      kl.style.display = 'none';
      kl.style.pointerEvents = 'none';
    }
    try { window.parent.postMessage({ type: 'game_loaded', gameSlug: '${slug}' }, '*'); } catch(e){}
    if (window.KruujSDK && typeof window.KruujSDK.gameLoadingFinished === 'function') {
      try { window.KruujSDK.gameLoadingFinished(); } catch(e){}
    }
  } else {
    setTimeout(() => {
      if (kl) {
        kl.classList.add('out');
        kl.style.display = 'none';
        kl.style.pointerEvents = 'none';
      }
      try { window.parent.postMessage({ type: 'game_loaded', gameSlug: '${slug}' }, '*'); } catch(e){}
      if (window.KruujSDK && typeof window.KruujSDK.gameLoadingFinished === 'function') {
        try { window.KruujSDK.gameLoadingFinished(); } catch(e){}
      }
    }, 1800);
  }
});
</script>
`;

  // Inserir antes de </body>
  html = html.replace(/<\/body>/i, `${dismissScript}\n</body>`);
  fs.writeFileSync(p, html, 'utf8');
  console.log(`[BABY LOADER FIXED] ${slug}`);
}
