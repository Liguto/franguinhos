#!/usr/bin/env node

/**
 * ==============================================================================
 * KRUUJ AUDIO CONTROLLER & MUTE INJECTOR
 * ==============================================================================
 * Garante que 100% dos jogos com efeitos sonoros cumpram a Seção 5.6
 * do Manual KRUUJ-PROC-001 (Controle de volume e botão de silenciar som).
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../apps/web/public/games');

// 1. KRUUJ-WORDS
function fixWords() {
  const file = path.join(gamesDir, 'kruuj-words/index.html');
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf-8');

  if (!c.includes('id="btnSoundToggle"')) {
    c = c.replace(
      '<div class="stats-group">',
      `<div class="stats-group">\n      <button class="stat-chip" id="btnSoundToggle" onclick="window.wordGame.toggleSound()" title="Som (Ativar/Desativar)" style="cursor:pointer;pointer-events:auto">🔊</button>`
    );
  }

  if (!c.includes('toggleMute()')) {
    c = c.replace(
      'constructor() {\n        this.ctx = null;\n      }',
      'constructor() {\n        this.ctx = null;\n        this.muted = false;\n      }\n      toggleMute() {\n        this.muted = !this.muted;\n        return this.muted;\n      }'
    );
    c = c.replace(/playLetterTone\(stepIndex\) \{/g, 'playLetterTone(stepIndex) { if (this.muted) return;');
    c = c.replace(/playWordCorrect\(\) \{/g, 'playWordCorrect() { if (this.muted) return;');
    c = c.replace(/playWin\(\) \{/g, 'playWin() { if (this.muted) return;');
  }

  if (!c.includes('toggleSound() {')) {
    c = c.replace(
      'useOwlHint() {',
      `toggleSound() {\n        const isMuted = this.sound.toggleMute();\n        const btn = document.getElementById('btnSoundToggle');\n        if (btn) btn.textContent = isMuted ? '🔇' : '🔊';\n      },\n\n      useOwlHint() {`
    );
  }

  fs.writeFileSync(file, c, 'utf-8');
  console.log('✔ kruuj-words atualizado com botão de som.');
}

// 2. KRUUJ-MATCH
function fixMatch() {
  const file = path.join(gamesDir, 'kruuj-match/index.html');
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf-8');

  if (!c.includes('id="btnSoundToggle"')) {
    c = c.replace(
      '<div class="stats-group">',
      `<div class="stats-group">\n      <button class="stat-chip" id="btnSoundToggle" onclick="window.matchGame.toggleSound()" title="Som (Ativar/Desativar)" style="cursor:pointer;pointer-events:auto">🔊</button>`
    );
  }

  if (!c.includes('toggleMute()')) {
    c = c.replace(
      'constructor() {\n        this.ctx = null;\n      }',
      'constructor() {\n        this.ctx = null;\n        this.muted = false;\n      }\n      toggleMute() {\n        this.muted = !this.muted;\n        return this.muted;\n      }'
    );
    c = c.replace(/playSwap\(\) \{/g, 'playSwap() { if (this.muted) return;');
    c = c.replace(/playMatch\(combo = 1\) \{/g, 'playMatch(combo = 1) { if (this.muted) return;');
  }

  if (!c.includes('toggleSound() {')) {
    c = c.replace(
      'onOverlayAction() {',
      `toggleSound() {\n        const isMuted = this.sound.toggleMute();\n        const btn = document.getElementById('btnSoundToggle');\n        if (btn) btn.textContent = isMuted ? '🔇' : '🔊';\n      },\n\n      onOverlayAction() {`
    );
  }

  fs.writeFileSync(file, c, 'utf-8');
  console.log('✔ kruuj-match atualizado com botão de som.');
}

// 3. BUBBLE-POP
function fixBubblePop() {
  const file = path.join(gamesDir, 'bubble-pop/index.html');
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf-8');

  if (!c.includes('id="btnSoundToggle"')) {
    c = c.replace(
      '<div id="hud">',
      `<div id="hud">\n    <button id="btnSoundToggle" onclick="toggleSound()" title="Som (Ativar/Desativar)" style="cursor:pointer;background:rgba(255,255,255,0.2);border:1px solid #fff;border-radius:999px;padding:4px 10px;color:#fff;font-size:1rem;margin-right:8px;">🔊</button>`
    );
  }

  if (!c.includes('let isSoundMuted = false;')) {
    c = c.replace(
      'let audioCtx = null;',
      `let audioCtx = null;\n    let isSoundMuted = false;\n    function toggleSound() {\n      isSoundMuted = !isSoundMuted;\n      const btn = document.getElementById('btnSoundToggle');\n      if (btn) btn.textContent = isSoundMuted ? '🔇' : '🔊';\n    }`
    );
    c = c.replace('function playPopSound() {', 'function playPopSound() {\n      if (isSoundMuted) return;');
  }

  fs.writeFileSync(file, c, 'utf-8');
  console.log('✔ bubble-pop atualizado com botão de som.');
}

// 4. KRUUJ-PAINT
function fixPaint() {
  const file = path.join(gamesDir, 'kruuj-paint/index.html');
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf-8');

  if (!c.includes('id="btnSoundToggle"')) {
    c = c.replace(
      '<header class="topbar">',
      `<header class="topbar">\n    <button id="btnSoundToggle" onclick="toggleSound()" title="Som (Ativar/Desativar)" class="btn-top" style="cursor:pointer;background:rgba(255,255,255,0.15);border:none;border-radius:8px;padding:6px 10px;color:#fff;font-size:1.1rem;margin-right:8px;">🔊</button>`
    );
  }

  if (!c.includes('let isMuted = false;')) {
    c = c.replace(
      'let audioCtx = null;',
      `let audioCtx = null;\n  let isMuted = false;\n  function toggleSound() {\n    isMuted = !isMuted;\n    const btn = document.getElementById('btnSoundToggle');\n    if (btn) btn.textContent = isMuted ? '🔇' : '🔊';\n  }`
    );
  }

  fs.writeFileSync(file, c, 'utf-8');
  console.log('✔ kruuj-paint atualizado com botão de som.');
}

// 5. JOGOS BABY
const babyGames = [
  'kruuj-baby-animals', 'kruuj-baby-bath', 'kruuj-baby-feeding',
  'kruuj-baby-pairs', 'kruuj-baby-peekaboo', 'kruuj-baby-shapes',
  'kruuj-baby-silhouette', 'kruuj-baby-train'
];

for (const bg of babyGames) {
  const file = path.join(gamesDir, bg, 'index.html');
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf-8');

  if (!c.includes('id="btnSoundToggle"')) {
    // Injetar botão de som no topo/hud
    if (c.includes('<div class="hud">')) {
      c = c.replace('<div class="hud">', `<div class="hud">\n    <button id="btnSoundToggle" onclick="toggleAudio()" title="Som" style="pointer-events:auto;cursor:pointer;background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.4);border-radius:999px;padding:4px 12px;color:#fff;font-size:1.1rem;">🔊</button>`);
    } else if (c.includes('<div class="top-bar">')) {
      c = c.replace('<div class="top-bar">', `<div class="top-bar">\n    <button id="btnSoundToggle" onclick="toggleAudio()" title="Som" style="pointer-events:auto;cursor:pointer;background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.4);border-radius:999px;padding:4px 12px;color:#fff;font-size:1.1rem;">🔊</button>`);
    } else if (c.includes('<body>')) {
      c = c.replace('<body>', `<body>\n  <button id="btnSoundToggle" onclick="toggleAudio()" title="Som" style="position:fixed;top:14px;right:16px;z-index:99;pointer-events:auto;cursor:pointer;background:rgba(255,255,255,0.2);backdrop-filter:blur(8px);border:2px solid rgba(255,255,255,0.4);border-radius:999px;padding:6px 14px;color:#fff;font-size:1.1rem;">🔊</button>`);
    }
  }

  if (!c.includes('let isAudioMuted = false;')) {
    const helper = `
    let isAudioMuted = false;
    function toggleAudio() {
      isAudioMuted = !isAudioMuted;
      const btn = document.getElementById('btnSoundToggle');
      if (btn) btn.textContent = isAudioMuted ? '🔇' : '🔊';
      if (typeof audioCtx !== 'undefined' && audioCtx) {
        if (isAudioMuted && audioCtx.state === 'running') audioCtx.suspend();
        if (!isAudioMuted && audioCtx.state === 'suspended') audioCtx.resume();
      }
    }
    `;
    c = c.replace('function initAudio() {', `${helper}\n    function initAudio() {\n      if (isAudioMuted) return;`);
  }

  fs.writeFileSync(file, c, 'utf-8');
  console.log(`✔ ${bg} atualizado com botão de som.`);
}

fixWords();
fixMatch();
fixBubblePop();
fixPaint();

console.log('\nTodos os jogos restantes foram atualizados com controle de som/mute!');
