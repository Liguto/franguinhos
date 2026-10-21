const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');
const dirs = fs.readdirSync(gamesDir).filter(f => fs.statSync(path.join(gamesDir, f)).isDirectory());

let totalChanged = 0;

for (const slug of dirs) {
  const indexPath = path.join(gamesDir, slug, 'index.html');
  if (!fs.existsSync(indexPath)) continue;

  let content = fs.readFileSync(indexPath, 'utf8');
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

  // 4. Correção CSS de #kl.out para desativar pointer-events e display
  if (content.includes('id="kl"') || content.includes("id='kl'")) {
    const klOutRegex = /#kl\.out\s*\{[^}]*\}/i;
    const targetKlOut = '#kl.out{opacity:0 !important;visibility:hidden !important;pointer-events:none !important;display:none !important;}';
    
    if (klOutRegex.test(content)) {
      const match = content.match(klOutRegex)[0];
      if (match !== targetKlOut) {
        content = content.replace(klOutRegex, targetKlOut);
        changed = true;
      }
    } else {
      // Inserir após #kl se existir ou antes de </style>
      if (/#kl\s*\{[^}]*\}/i.test(content)) {
        content = content.replace(/(#kl\s*\{[^}]*\})/i, `$1\n${targetKlOut}`);
      } else {
        content = content.replace(/<\/style>/i, `${targetKlOut}\n</style>`);
      }
      changed = true;
    }
  }

  // 5. KruujLoader lifecycle & supressão de iframe
  // Para jogos com KruujLoader.start (exceto kruuj-defense e kruuj-neon-blocks que já foram customizados)
  if (slug !== 'kruuj-defense' && slug !== 'kruuj-neon-blocks' && (content.includes('id="kl"') || content.includes("id='kl'"))) {
    // Verificar se já possui verificação de iframe
    if (!content.includes('window.self !== window.top')) {
      // Procurar bloco de script com KruujLoader.start
      const klScriptRegex = /<script>[\s\S]*?KruujLoader\.start[\s\S]*?<\/script>/i;
      
      // Extrair gameName se existir
      let gameName = slug;
      const gnMatch = content.match(/gameName:\s*['"`]([^'"`]+)['"`]/);
      if (gnMatch) gameName = gnMatch[1];
      
      const newKlScript = `<script>
// KruujLoader fornecido centralmente via /sdk/v1/kruuj-loader.js
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
    try {
      if (typeof KruujLoader !== 'undefined') {
        KruujLoader.start({
          gameName: '${gameName}',
          tagline: (typeof tD !== 'undefined' && tD.tagline ? tD.tagline : (typeof tG !== 'undefined' && tG.tagline ? tG.tagline : 'Prepare os fones, a coruja já está chegando.')),
          tips: (typeof tD !== 'undefined' && tD.tips ? tD.tips : (typeof tG !== 'undefined' && tG.tips ? tG.tips : ['Divirta-se com os jogos oficiais da KRUUJ Studio!'])),
          splash: 2000,
          minTime: 2400,
          onComplete: () => {
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
        });
        setTimeout(() => {
          if (typeof KruujLoader !== 'undefined' && KruujLoader.finish) KruujLoader.finish();
          setTimeout(() => {
            if (kl) {
              kl.classList.add('out');
              kl.style.display = 'none';
              kl.style.pointerEvents = 'none';
            }
          }, 500);
        }, 2400);
      } else {
        if (kl) {
          kl.classList.add('out');
          kl.style.display = 'none';
          kl.style.pointerEvents = 'none';
        }
        try { window.parent.postMessage({ type: 'game_loaded', gameSlug: '${slug}' }, '*'); } catch(e){}
      }
    } catch(e) {
      if (kl) {
        kl.classList.add('out');
        kl.style.display = 'none';
        kl.style.pointerEvents = 'none';
      }
      try { window.parent.postMessage({ type: 'game_loaded', gameSlug: '${slug}' }, '*'); } catch(err){}
    }
  }
});
</script>`;

      if (klScriptRegex.test(content)) {
        content = content.replace(klScriptRegex, newKlScript);
        changed = true;
      }
    }
  }

  // 6. Garantir game_loaded e gameLoadingFinished para jogos sem loader (ex: math-run, memory-match, etc.)
  if (!content.includes('game_loaded') || !content.includes('gameLoadingFinished')) {
    if (!content.includes(`postMessage({ type: 'game_loaded', gameSlug: '${slug}' }`)) {
      const bridgeScript = `
<script>
/* KRUUJ-PROC-001 Lifecycle Bridge */
window.addEventListener('DOMContentLoaded', () => {
  try { window.parent.postMessage({ type: 'game_loaded', gameSlug: '${slug}' }, '*'); } catch(e){}
  if (window.KruujSDK && typeof window.KruujSDK.gameLoadingFinished === 'function') {
    try { window.KruujSDK.gameLoadingFinished(); } catch(e){}
  }
});
</script>`;
      content = content.replace(/<\/body>/i, `${bridgeScript}\n</body>`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`[OK] Padronizado: ${slug}`);
    totalChanged++;
  } else {
    console.log(`[SKIP] Já em conformidade: ${slug}`);
  }
}

console.log(`\nConcluído! Total de jogos modificados: ${totalChanged}`);
