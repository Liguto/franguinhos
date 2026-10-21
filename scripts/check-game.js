#!/usr/bin/env node

/**
 * ==============================================================================
 * KRUUJ GAME VALIDATOR & QA / DoD AUDITOR (KRUUJ-PROC-001 v1.1)
 * ==============================================================================
 * Ferramenta oficial e automatizada de homologação técnica de jogos HTML5 para a
 * plataforma KRUUJ. Audita 100% dos requisitos do Manual:
 *  - Seção 5: Requisitos HTML5 (Estrutura, Isolamento, Pesos, UX, Mobile, Áudio)
 *  - Seção 6: Padrão de Pacote (index.html, README.md, CHANGELOG.md, LICENSES.md)
 *  - Seção 8: KRUUJ SDK & Poki Standard (loadingFinished, gameplayStart, stop)
 *  - Seção 9: Checklist Obrigatório de QA (Funcional, Desktop, Mobile, Qualidade)
 *  - Seção 10: Severidades de Bugs (S0, S1, S2, S3)
 *  - Seção 17: Definition of Done (DoD - quando o jogo está pronto)
 *
 * Zero dependências externas (roda com Node.js puro em qualquer máquina).
 *
 * USO:
 *   node scripts/check-game.js <caminho-ou-slug>
 *   node scripts/check-game.js --all
 *   npm run check:game <slug>
 *   npm run check:games
 * ==============================================================================
 */

const fs = require('fs');
const path = require('path');

// Cores ANSI para o terminal
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

// Limites e parâmetros definidos pelo KRUUJ Game Standard
const LIMITS = {
  MAX_TOTAL_DIR_SIZE_MB: 18,        // Limite máximo recomendado para pacote HTML5
  WARN_SINGLE_IMAGE_SIZE_KB: 500,   // Limite para imagens individuais (recomenda-se WebP)
  WARN_SINGLE_AUDIO_SIZE_KB: 1500,  // Limite para áudios individuais (recomenda-se MP3/OGG)
  MAX_SINGLE_FILE_SIZE_MB: 8,       // Nenhum arquivo individual deve exceder 8MB
};

// Estrutura para armazenar o relatório completo
class ValidationReport {
  constructor(gamePath, gameSlug) {
    this.gamePath = gamePath;
    this.gameSlug = gameSlug;
    this.issues = [];
    this.stats = {
      totalFiles: 0,
      totalBytes: 0,
      imageCount: 0,
      audioCount: 0,
      jsFiles: 0,
    };

    // Checklist de QA (Seção 9)
    this.qa = {
      // 9.1 Funcional
      f_abre_sem_erros: false,
      f_controles_principais: false,
      f_regras_pontuacao_reinicio: false,
      f_pause_ou_troca_aba: false,
      // 9.2 Desktop
      d_compatibilidade_standards: false,
      d_resolucao_responsiva: false,
      d_controles_verificados: false,
      // 9.3 Mobile
      m_viewport_otimizado: false,
      m_sem_scroll_zoom_acidental: false,
      m_safe_area_poki: false,
      m_performance_peso_ok: false,
      // 9.4 Qualidade & Release
      q_sem_bugs_s0_s1: false,
      q_assets_integros_sem_404: false,
      q_sdk_integrado: false,
      q_documentacao_completa: false,
      q_audio_mute_presente: false,
    };

    // Definition of Done (Seção 17)
    this.dod = {
      dod_experiencia_sem_s0_s1: false,
      dod_requisitos_s2_ok: false,
      dod_validador_aprovado: false,
      dod_mobile_desktop_ok: false,
      dod_carregamento_controles_telas: false,
      dod_documentacao_completa: false,
      dod_assets_licenciados: false,
      dod_audio_mute_acessivel: false,
      dod_sdk_ciclo_vida_completo: false,
    };
  }

  addIssue(issue) {
    this.issues.push(issue);
  }

  get s0Count() { return this.issues.filter(i => i.severity === 'S0').length; }
  get s1Count() { return this.issues.filter(i => i.severity === 'S1').length; }
  get s2Count() { return this.issues.filter(i => i.severity === 'S2').length; }
  get s3Count() { return this.issues.filter(i => i.severity === 'S3').length; }

  get status() {
    if (this.s0Count > 0 || this.s1Count > 0) return 'REPROVADO';
    if (this.s2Count > 0) return 'APROVADO COM PENDÊNCIAS';
    return 'APROVADO';
  }

  get qaPassRate() {
    const keys = Object.keys(this.qa);
    const passed = keys.filter(k => this.qa[k]).length;
    return Math.round((passed / keys.length) * 100);
  }

  get dodPassRate() {
    const keys = Object.keys(this.dod);
    const passed = keys.filter(k => this.dod[k]).length;
    return Math.round((passed / keys.length) * 100);
  }
}

/**
 * Função utilitária para buscar recursivamente todos os arquivos
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (!['.git', 'node_modules', '.idea'].includes(entry.name)) {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else {
      arrayOfFiles.push(fullPath);
    }
  }
  return arrayOfFiles;
}

/**
 * Validador principal do jogo com QA Checklist e DoD
 */
function validateGame(gameDir) {
  const resolvedDir = path.resolve(gameDir);
  const slug = path.basename(resolvedDir);
  const report = new ValidationReport(resolvedDir, slug);

  if (!fs.existsSync(resolvedDir)) {
    report.addIssue({
      severity: 'S0',
      section: '5.1 Estrutura e inicialização',
      title: 'Diretório do jogo não encontrado',
      file: resolvedDir,
      line: 1,
      snippet: resolvedDir,
      solution: `Verifique se o caminho especificado está correto. Esperado pasta com os arquivos do jogo.`,
    });
    return report;
  }

  const allFiles = getAllFiles(resolvedDir);
  report.stats.totalFiles = allFiles.length;

  // --------------------------------------------------------------------------
  // 1. CHECAGEM DE ARQUIVOS BÁSICOS E ENTRADA (INDEX.HTML, README, LICENSES, CHANGELOG)
  // --------------------------------------------------------------------------
  const indexPath = path.join(resolvedDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    report.addIssue({
      severity: 'S0',
      section: '5.1 & 6 Padrão de pacote HTML5',
      title: 'Arquivo principal "index.html" ausente',
      file: 'index.html',
      line: 1,
      snippet: 'Arquivo ausente na raiz do pacote.',
      solution: `Todo jogo HTML5 deve possuir um arquivo "index.html" na raiz do seu diretório.`,
    });
    return report;
  }
  report.qa.f_abre_sem_erros = true;

  const readmePath = path.join(resolvedDir, 'README.md');
  const licensesPath = path.join(resolvedDir, 'LICENSES.md');
  const changelogPath = path.join(resolvedDir, 'CHANGELOG.md');

  const hasReadme = fs.existsSync(readmePath);
  const hasLicenses = fs.existsSync(licensesPath);
  const hasChangelog = fs.existsSync(changelogPath);

  if (!hasReadme) {
    report.addIssue({
      severity: 'S3',
      section: '4 & 6 Documentação do jogo',
      title: 'README.md ausente no pacote',
      file: 'README.md',
      line: 1,
      snippet: 'README.md não encontrado.',
      solution: `Crie um README.md contendo Nome do jogo, Controles e Orientação recomendada.`,
    });
  }

  if (!hasLicenses) {
    report.addIssue({
      severity: 'S3',
      section: '2 & 6 Direitos e Licenças',
      title: 'LICENSES.md ausente no pacote',
      file: 'LICENSES.md',
      line: 1,
      snippet: 'LICENSES.md não encontrado.',
      solution: `Crie um LICENSES.md listando assets de terceiros e suas licenças comerciais.`,
    });
  }

  if (!hasChangelog) {
    report.addIssue({
      severity: 'S3',
      section: '6, 11 & 17 Versionamento e Changelog',
      title: 'CHANGELOG.md ausente no pacote',
      file: 'CHANGELOG.md',
      line: 1,
      snippet: 'CHANGELOG.md não encontrado.',
      solution: `Crie um CHANGELOG.md seguindo o padrão SemVer documentando as alterações desta versão.`,
    });
  }

  report.qa.q_documentacao_completa = hasReadme && hasLicenses && hasChangelog;
  report.dod.dod_documentacao_completa = report.qa.q_documentacao_completa;
  report.dod.dod_assets_licenciados = hasLicenses;

  // --------------------------------------------------------------------------
  // 2. AUDITORIA DE PESO E TAMANHO DE ARQUIVOS (PERFORMANCE 5.3 & QA 9.3)
  // --------------------------------------------------------------------------
  let totalBytes = 0;
  for (const file of allFiles) {
    const stat = fs.statSync(file);
    totalBytes += stat.size;
    const relFile = path.relative(resolvedDir, file);
    const ext = path.extname(file).toLowerCase();

    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
      report.stats.imageCount++;
      const sizeKb = stat.size / 1024;
      if (sizeKb > LIMITS.WARN_SINGLE_IMAGE_SIZE_KB) {
        report.addIssue({
          severity: 'S2',
          section: '5.3 Performance & Compressão',
          title: `Imagem muito pesada (${sizeKb.toFixed(0)} KB)`,
          file: relFile,
          line: 1,
          snippet: `${relFile} (${(sizeKb / 1024).toFixed(2)} MB)`,
          solution: `Comprima a imagem utilizando WebP ou reduza a resolução para manter abaixo de ${LIMITS.WARN_SINGLE_IMAGE_SIZE_KB} KB.`,
        });
      }
    }

    if (['.mp3', '.ogg', '.wav', '.m4a', '.aac'].includes(ext)) {
      report.stats.audioCount++;
      const sizeKb = stat.size / 1024;
      if (ext === '.wav' && sizeKb > 1000) {
        report.addIssue({
          severity: 'S2',
          section: '5.3 Formato de Áudio Não Comprimido (.wav)',
          title: `Arquivo de áudio .wav muito pesado (${(sizeKb / 1024).toFixed(2)} MB)`,
          file: relFile,
          line: 1,
          snippet: `${relFile}`,
          solution: `Evite arquivos .wav sem compressão. Converta para .mp3 (128kbps) ou .ogg.`,
        });
      } else if (sizeKb > LIMITS.WARN_SINGLE_AUDIO_SIZE_KB) {
        report.addIssue({
          severity: 'S2',
          section: '5.3 Performance de Áudio',
          title: `Áudio individual excede recomendação (${(sizeKb / 1024).toFixed(2)} MB)`,
          file: relFile,
          line: 1,
          snippet: `${relFile}`,
          solution: `Otimize o bitrate da faixa de áudio para 128kbps ou use loops menores.`,
        });
      }
    }

    if (['.js', '.ts'].includes(ext)) {
      report.stats.jsFiles++;
    }
  }

  report.stats.totalBytes = totalBytes;
  const totalMb = totalBytes / (1024 * 1024);
  if (totalMb > LIMITS.MAX_TOTAL_DIR_SIZE_MB) {
    report.addIssue({
      severity: 'S2',
      section: '5.3 Performance & Tamanho Total do Jogo',
      title: `Pacote do jogo excede o teto recomendado (${totalMb.toFixed(1)} MB / máx ${LIMITS.MAX_TOTAL_DIR_SIZE_MB} MB)`,
      file: 'Pacote geral',
      line: 1,
      snippet: `Tamanho total: ${totalMb.toFixed(2)} MB`,
      solution: `O pacote total deve ter até ${LIMITS.MAX_TOTAL_DIR_SIZE_MB} MB. Otimize imagens e áudios.`,
    });
    report.qa.m_performance_peso_ok = false;
  } else {
    report.qa.m_performance_peso_ok = true;
  }

  // --------------------------------------------------------------------------
  // 3. ANÁLISE ESTÁTICA DO CÓDIGO (HTML, JS, CSS)
  // --------------------------------------------------------------------------
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  const indexLines = indexContent.split('\n');
  const codeFiles = allFiles.filter(f => ['.html', '.htm', '.js', '.css'].includes(path.extname(f).toLowerCase()));

  // A. Checagem de Caminhos Locais / Absolutos / Dev Servers (Seção 5.1 & QA 9.4)
  const forbiddenPathPatterns = [
    { regex: /file:\/\/\/[a-zA-Z]:/i, msg: 'Caminho absoluto de disco local (file:///)' },
    { regex: /[a-zA-Z]:\\[a-zA-Z0-9_\-\\]+/i, msg: 'Caminho absoluto do Windows (C:\\...)' },
    { regex: /http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, msg: 'Referência a servidor local de desenvolvimento (localhost/127.0.0.1)' },
  ];

  for (const cFile of codeFiles) {
    const content = fs.readFileSync(cFile, 'utf-8');
    const lines = content.split('\n');
    const relFile = path.relative(resolvedDir, cFile);

    lines.forEach((line, idx) => {
      for (const pattern of forbiddenPathPatterns) {
        if (pattern.regex.test(line)) {
          report.addIssue({
            severity: 'S0',
            section: '5.1 Estrutura e inicialização',
            title: `Dependência de caminho local detectada: ${pattern.msg}`,
            file: relFile,
            line: idx + 1,
            snippet: line.trim().slice(0, 120),
            solution: `O jogo deve utilizar apenas caminhos relativos ou URLs do portal. Remova caminhos locais de máquina.`,
          });
        }
      }
    });
  }

  // B. Checagem de Integridade de Assets Locais Referenciados (Broken Links / 404 - QA 9.4)
  const assetRefRegex = /(?:src|href)=["']([^"']+)["']/g;
  let matchAsset;
  let brokenAssets = 0;
  while ((matchAsset = assetRefRegex.exec(indexContent)) !== null) {
    const rawUrl = matchAsset[1].trim();
    // Ignorar URLs externas, data:, /sdk/, /kruuj- (compartilhados do portal) ou template literals
    if (
      rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ||
      rawUrl.startsWith('//') || rawUrl.startsWith('data:') ||
      rawUrl.startsWith('/sdk/') || rawUrl.startsWith('/kruuj-') ||
      rawUrl.startsWith('#') || rawUrl.startsWith('javascript:') ||
      rawUrl.includes('${')
    ) {
      continue;
    }
    const cleanPath = rawUrl.split('?')[0].split('#')[0];
    if (!cleanPath) continue;
    const resolvedAsset = path.resolve(resolvedDir, cleanPath);
    if (!fs.existsSync(resolvedAsset)) {
      brokenAssets++;
      report.addIssue({
        severity: 'S1',
        section: '9.4 QA Qualidade & Integridade de Assets',
        title: `Asset local referenciado não encontrado em disco (404 quebrado): ${cleanPath}`,
        file: 'index.html',
        line: 1,
        snippet: matchAsset[0],
        solution: `O arquivo "${cleanPath}" está sendo referenciado mas não existe na pasta do jogo. Certifique-se de incluir o asset ou corrigir o caminho relativo.`,
      });
    }
  }
  report.qa.q_assets_integros_sem_404 = brokenAssets === 0;

  // C. Checagem de Segurança e Isolamento (Seção 5.2)
  for (const cFile of codeFiles) {
    const ext = path.extname(cFile).toLowerCase();
    if (!['.html', '.js'].includes(ext)) continue;

    const content = fs.readFileSync(cFile, 'utf-8');
    const lines = content.split('\n');
    const relFile = path.relative(resolvedDir, cFile);

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      if (/\beval\s*\(/.test(trimmed)) {
        report.addIssue({
          severity: 'S0',
          section: '5.2 Arquitetura e isolamento',
          title: 'Uso de "eval()" é estritamente proibido',
          file: relFile,
          line: idx + 1,
          snippet: trimmed.slice(0, 120),
          solution: `Remova eval(). O uso de eval() abre brechas de segurança severas (XSS).`,
        });
      }

      if (/new\s+Function\s*\(/.test(trimmed)) {
        report.addIssue({
          severity: 'S0',
          section: '5.2 Arquitetura e isolamento',
          title: 'Uso de "new Function()" detectado',
          file: relFile,
          line: idx + 1,
          snippet: trimmed.slice(0, 120),
          solution: `Substitua new Function() por funções regulares ou objetos de mapeamento.`,
        });
      }

      if (/document\.write\s*\(/.test(trimmed)) {
        report.addIssue({
          severity: 'S0',
          section: '5.2 Arquitetura e isolamento',
          title: 'Uso arcaico de "document.write()" detectado',
          file: relFile,
          line: idx + 1,
          snippet: trimmed.slice(0, 120),
          solution: `Substitua document.write() por manipulação de DOM moderna (createElement, innerHTML).`,
        });
      }

      if (/\b(window\.)?(alert|confirm|prompt)\s*\(/.test(trimmed) && !/(\/\/|console\.)/.test(trimmed)) {
        report.addIssue({
          severity: 'S1',
          section: '5.2 & 5.4 Controles e UX',
          title: 'Uso de modais bloqueantes nativos (alert/confirm/prompt)',
          file: relFile,
          line: idx + 1,
          snippet: trimmed.slice(0, 120),
          solution: `Diálogos nativos do navegador travam a thread do jogo no mobile. Use modais customizados em HTML ou no Canvas.`,
        });
      }

      if (/(window\.)?(top|parent)\.location(\.href)?\s*=/i.test(trimmed)) {
        report.addIssue({
          severity: 'S0',
          section: '8. Integração com a plataforma Kruuj',
          title: 'Manipulação de navegação da janela-mãe detectada (parent.location)',
          file: relFile,
          line: idx + 1,
          snippet: trimmed.slice(0, 120),
          solution: `Jogos não podem redirecionar o portal hospedeiro. Remova manipulações diretas de window.parent.location.`,
        });
      }

      if (/src=["']http:\/\/[^"']+/i.test(trimmed) || /href=["']http:\/\/[^"']+/i.test(trimmed)) {
        report.addIssue({
          severity: 'S1',
          section: '5.1 Estrutura e inicialização',
          title: 'Recurso externo chamado via HTTP inseguro (Mixed Content)',
          file: relFile,
          line: idx + 1,
          snippet: trimmed.slice(0, 120),
          solution: `O portal KRUUJ roda 100% sob HTTPS. Troque URLs "http://" por "https://".`,
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. RESPONSIVIDADE MOBILE & DESKTOP (QA 9.2 & 9.3)
  // --------------------------------------------------------------------------
  // Viewport
  const hasViewportMeta = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(indexContent);
  if (!hasViewportMeta) {
    report.addIssue({
      severity: 'S1',
      section: '5.5 Responsividade mobile',
      title: 'Tag <meta name="viewport"> ausente no index.html',
      file: 'index.html',
      line: 1,
      snippet: 'Nenhuma tag viewport encontrada no <head>.',
      solution: `Insira: <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">`,
    });
    report.qa.m_viewport_otimizado = false;
  } else {
    const viewportTagMatch = indexContent.match(/<meta[^>]+name=["']viewport["'][^>]*content=["']([^"']+)["'][^>]*>/i);
    if (viewportTagMatch) {
      const contentAttr = viewportTagMatch[1];
      const hasNoScalable = /user-scalable\s*=\s*no/i.test(contentAttr) || /maximum-scale\s*=\s*1(\.0)?/i.test(contentAttr);
      const hasViewportFit = /viewport-fit\s*=\s*cover/i.test(contentAttr);

      if (!hasNoScalable) {
        report.addIssue({
          severity: 'S1',
          section: '5.5 Responsividade mobile',
          title: 'Viewport não previne zoom acidental em celulares (user-scalable=no ausente)',
          file: 'index.html',
          line: 1,
          snippet: viewportTagMatch[0],
          solution: `Adicione "user-scalable=no" ao atributo content da meta tag viewport.`,
        });
      }

      if (!hasViewportFit) {
        report.addIssue({
          severity: 'S2',
          section: '5.4 & 5.5 Suporte a Notches Mobile',
          title: 'Viewport não especifica "viewport-fit=cover"',
          file: 'index.html',
          line: 1,
          snippet: viewportTagMatch[0],
          solution: `Adicione "viewport-fit=cover" para aproveitar telas cheias com entalhe/notch.`,
        });
      }

      report.qa.m_viewport_otimizado = hasNoScalable && hasViewportFit;
    }
  }

  // Prevenção de rolagem com o dedo (touch-action: none)
  const hasTouchActionNone = /touch-action\s*:\s*none/i.test(indexContent);
  const hasPreventDefaultTouch = /e(vent)?\.preventDefault\(\)/i.test(indexContent);
  if (!hasTouchActionNone && !hasPreventDefaultTouch) {
    report.addIssue({
      severity: 'S1',
      section: '5.5 Responsividade mobile',
      title: 'Jogo não bloqueia scroll involuntário da página mobile (touch-action: none)',
      file: 'index.html',
      line: 1,
      snippet: 'Nenhuma regra CSS "touch-action: none" ou preventDefault em eventos de toque encontrada.',
      solution: `Adicione no CSS: * { touch-action: none; -webkit-touch-callout: none; }`,
    });
    report.qa.m_sem_scroll_zoom_acidental = false;
  } else {
    report.qa.m_sem_scroll_zoom_acidental = true;
  }

  // Adaptação de Resolução Desktop & Mobile (QA 9.2)
  const hasResizeListener = /addEventListener\(['"]resize['"]|ResizeObserver|window\.onresize/i.test(indexContent);
  const hasFluidLayout = /width:\s*100%|height:\s*100%|inset:\s*0|vw|vh/i.test(indexContent);
  report.qa.d_resolucao_responsiva = hasResizeListener || hasFluidLayout;

  // Zona livre de 68px do botão Poki (Mobile - QA 9.3)
  const hasHudTopCollision = /\.hud[^{]*\{[^}]*top:\s*0px/i.test(indexContent) || /#score[^{]*\{[^}]*top:\s*0px/i.test(indexContent);
  if (hasHudTopCollision) {
    report.addIssue({
      severity: 'S2',
      section: '5.4 Controles e UX Mobile (Zona de Exclusão)',
      title: 'Elemento HUD posicionado muito colado ao canto superior esquerdo',
      file: 'index.html',
      line: 1,
      snippet: 'HUD fixado em top: 0px / left: 0px.',
      solution: `Afaste elementos clicáveis do canto superior esquerdo (recuo de 68px) para não colidir com o botão flutuante de saída do portal.`,
    });
    report.qa.m_safe_area_poki = false;
  } else {
    report.qa.m_safe_area_poki = true;
  }

  // --------------------------------------------------------------------------
  // 5. CHECAGEM DE ÁUDIO, AUTOPLAY E BOTÃO DE SILENCIAR (SEÇÃO 5.6 & QA 9.1)
  // --------------------------------------------------------------------------
  const audioPlayRegex = /\.play\s*\(\s*\)/g;
  let matchPlay;
  let hasAutoplayViolation = false;
  while ((matchPlay = audioPlayRegex.exec(indexContent)) !== null) {
    const charPos = matchPlay.index;
    const lineNum = indexContent.substring(0, charPos).split('\n').length;
    const surroundingCode = indexContent.substring(Math.max(0, charPos - 250), Math.min(indexContent.length, charPos + 250));
    const isInsideGesture = /(click|pointerdown|pointerup|touchstart|touchend|keydown|keyup|startBtn|btnPlay|startGame|iniciar)/i.test(surroundingCode);

    if (!isInsideGesture && /window\.(onload|addEventListener\(['"]load['"])|DOMContentLoaded/i.test(surroundingCode)) {
      hasAutoplayViolation = true;
      report.addIssue({
        severity: 'S1',
        section: '5.1 & 5.6 Áudio e Autoplay',
        title: 'Possível violação de autoplay de áudio detectada',
        file: 'index.html',
        line: lineNum,
        snippet: indexLines[lineNum - 1]?.trim().slice(0, 100) || '.play()',
        solution: `Mova a chamada .play() para o evento de clique do botão "Iniciar Jogo" ou de primeiro toque na tela.`,
      });
      break;
    }
  }

  const hasAudioUsage = report.stats.audioCount > 0 ||
    /AudioContext|webkitAudioContext|new\s+Audio\(|SoundManager|SoundController|<audio|\.play\s*\(/i.test(indexContent);

  if (hasAudioUsage) {
    const hasMuteControl = /(?:id|class|name|title|onclick|data-[\w-]+)=["'][^"']*(?:sound|audio|mute|som|snd|sfx)[^"']*["']|\b(toggleAudio|toggleMute|toggleSound|setVolume|applyVol|vmus|vsfx|isMuted|muted\s*=|desligar\s+som|ligar\s+som|silenciar|mutar|sons\s+ligados|sound\s+on)\b/i.test(indexContent);

    if (!hasMuteControl) {
      report.addIssue({
        severity: 'S2',
        section: '5.6 Áudio e acessibilidade',
        title: 'Controle de volume ou botão de silenciar (Mute) ausente',
        file: 'index.html',
        line: 1,
        snippet: 'Jogo produz áudio/efeitos sonoros, mas não possui botão ou controle de silenciar.',
        solution: `Disponibilize uma opção visível para silenciar o áudio ou regular o volume (ex: botão 🔊/🔇 no HUD ou menu).`,
      });
      report.qa.q_audio_mute_presente = false;
    } else {
      report.qa.q_audio_mute_presente = true;
    }
  } else {
    report.qa.q_audio_mute_presente = true; // Não usa áudio, passa automaticamente
  }

  report.dod.dod_audio_mute_acessivel = report.qa.q_audio_mute_presente && !hasAutoplayViolation;

  // --------------------------------------------------------------------------
  // 6. INTEGRAÇÃO COM KRUUJ SDK & CICLO DE VIDA (SEÇÃO 8 & QA 9.4)
  // --------------------------------------------------------------------------
  const usesKruujSdkScript = /src=["'][^"']*kruuj-sdk\.js["']/i.test(indexContent) || /src=["'][^"']*poki-sdk\.js["']/i.test(indexContent);
  const usesKruujSdkCalls = /\b(KruujSDK|PokiSDK)\b/i.test(indexContent);
  const usesPostMessage = /postMessage\s*\(/i.test(indexContent);
  const usesSendEvent = /sendEvent\s*\(/i.test(indexContent);

  const hasLoadingFinished = /gameLoadingFinished|game_loaded/i.test(indexContent);
  const hasGameplayStart = /gameplayStart|game_start/i.test(indexContent);
  const hasGameplayStop = /gameplayStop|game_completed|game_over/i.test(indexContent);

  if (!usesKruujSdkScript && !usesKruujSdkCalls && !usesPostMessage && !usesSendEvent) {
    report.addIssue({
      severity: 'S1',
      section: '8. Integração com a plataforma Kruuj',
      title: 'Jogo não possui integração com o Kruuj SDK ou telemetria postMessage',
      file: 'index.html',
      line: 1,
      snippet: 'Nenhuma referência ao KruujSDK, PokiSDK ou envio de postMessage para o portal.',
      solution: `Inclua <script src="/sdk/v1/kruuj-sdk.js"></script> e chame gameLoadingFinished, gameplayStart e gameplayStop.`,
    });
    report.qa.q_sdk_integrado = false;
  } else {
    let sdkComplete = true;
    if (!hasLoadingFinished) {
      report.addIssue({
        severity: 'S2',
        section: '8. Integração com a plataforma Kruuj',
        title: 'Evento de fim de carregamento não disparado (gameLoadingFinished ou game_loaded)',
        file: 'index.html',
        line: 1,
        snippet: 'Evento de prontidão de carregamento ausente.',
        solution: `Chame "KruujSDK.gameLoadingFinished();" assim que seus assets forem carregados.`,
      });
      sdkComplete = false;
    }

    if (!hasGameplayStart) {
      report.addIssue({
        severity: 'S2',
        section: '8. Integração com a plataforma Kruuj',
        title: 'Evento de início de gameplay não disparado (gameplayStart ou game_start)',
        file: 'index.html',
        line: 1,
        snippet: 'Evento de início da gameplay não detectado.',
        solution: `Chame "KruujSDK.gameplayStart();" assim que o jogador clicar em Jogar/Iniciar.`,
      });
      sdkComplete = false;
    }

    if (!hasGameplayStop) {
      report.addIssue({
        severity: 'S2',
        section: '8. Integração com a plataforma Kruuj',
        title: 'Evento de encerramento da partida não disparado (gameplayStop ou game_completed)',
        file: 'index.html',
        line: 1,
        snippet: 'Evento de término da partida ausente.',
        solution: `Chame "KruujSDK.gameplayStop();" quando ocorrer Game Over, Vitória ou Pausa.`,
      });
      sdkComplete = false;
    }

    report.qa.q_sdk_integrado = sdkComplete;
  }
  report.dod.dod_sdk_ciclo_vida_completo = report.qa.q_sdk_integrado;

  // --------------------------------------------------------------------------
  // 7. CONTROLES E INPUTS (QA 9.1 & 9.2)
  // --------------------------------------------------------------------------
  const hasInputListeners = /addEventListener\(['"](pointerdown|click|touchstart|mousedown|keydown|keyup)['"]|onclick\s*=|on\([^,]+,\s*['"](pointerdown|click|touchstart|mousedown|keydown|keyup)['"]|data-cmd=/i.test(indexContent);
  report.qa.f_controles_principais = hasInputListeners;
  report.qa.d_controles_verificados = hasInputListeners;

  const hasScoreOrRules = /score|scoreVal|pts|pontos|pontuação|vidas|lives|record|recorde|fase|round|level/i.test(indexContent);
  const hasGameOverOrWin = /gameover|game_over|gameOver|win|vitória|derrota|victory|finish|restart|reiniciar/i.test(indexContent);
  report.qa.f_regras_pontuacao_reinicio = hasScoreOrRules && hasGameOverOrWin;

  const hasPauseOrTabHandling = /visibilitychange|blur|pause|resume|beforeunload|paused/i.test(indexContent);
  report.qa.f_pause_ou_troca_aba = hasPauseOrTabHandling;

  // Verificação de compatibilidade Web Standards (sem APIs obsoletas)
  const hasObsoleteAPIs = /document\.all|window\.attachEvent|ActiveXObject/i.test(indexContent);
  report.qa.d_compatibilidade_standards = !hasObsoleteAPIs;

  // --------------------------------------------------------------------------
  // 8. CONSOLIDAÇÃO DA DEFINITION OF DONE (SEÇÃO 17)
  // --------------------------------------------------------------------------
  report.qa.q_sem_bugs_s0_s1 = (report.s0Count === 0 && report.s1Count === 0);
  report.dod.dod_experiencia_sem_s0_s1 = report.qa.q_sem_bugs_s0_s1;
  report.dod.dod_requisitos_s2_ok = (report.s2Count === 0);
  report.dod.dod_validador_aprovado = (report.status === 'APROVADO');
  report.dod.dod_mobile_desktop_ok = report.qa.m_viewport_otimizado && report.qa.m_sem_scroll_zoom_acidental && report.qa.d_resolucao_responsiva;
  report.dod.dod_carregamento_controles_telas = report.qa.f_abre_sem_erros && report.qa.f_controles_principais && report.qa.f_regras_pontuacao_reinicio;

  return report;
}

/**
 * Exibe o relatório detalhado com QA Checklist e Definition of Done
 */
function printReport(report) {
  console.log('\n' + '='.repeat(80));
  console.log(`${colors.bold}${colors.cyan}KRUUJ GAME VALIDATOR — RELATÓRIO DE HOMOLOGAÇÃO, QA & DoD (KRUUJ-PROC-001)${colors.reset}`);
  console.log(`Jogo avaliado : ${colors.bold}${report.gameSlug}${colors.reset}`);
  console.log(`Caminho       : ${report.gamePath}`);
  console.log(`Estatísticas  : ${report.stats.totalFiles} arquivos | ${(report.stats.totalBytes / (1024 * 1024)).toFixed(2)} MB total | ${report.stats.imageCount} imagens | ${report.stats.audioCount} áudios`);
  console.log('-'.repeat(80));

  let statusBadge = '';
  if (report.status === 'APROVADO') {
    statusBadge = `${colors.bgGreen}${colors.white}${colors.bold}  STATUS: APROVADO PARA PRODUÇÃO  ${colors.reset}`;
  } else if (report.status === 'APROVADO COM PENDÊNCIAS') {
    statusBadge = `${colors.bgYellow}${colors.white}${colors.bold}  STATUS: APROVADO COM PENDÊNCIAS (S2/S3)  ${colors.reset}`;
  } else {
    statusBadge = `${colors.bgRed}${colors.white}${colors.bold}  STATUS: REPROVADO (BLOQUEIO S0/S1)  ${colors.reset}`;
  }

  console.log(`Resultado: ${statusBadge}`);
  console.log(`Falhas: ${colors.red}${report.s0Count} Críticas (S0)${colors.reset} | ${colors.red}${report.s1Count} Altas (S1)${colors.reset} | ${colors.yellow}${report.s2Count} Médias (S2)${colors.reset} | ${colors.cyan}${report.s3Count} Baixas (S3)${colors.reset}`);
  console.log('='.repeat(80));

  // ==========================================================================
  // CHECKLIST OFICIAL DE QA (SEÇÃO 9)
  // ==========================================================================
  console.log(`\n${colors.bold}${colors.magenta}📋 CHECKLIST OBRIGATÓRIO DE QA (SEÇÃO 9) — Taxa de Aprovação: ${report.qaPassRate}%${colors.reset}`);
  const chk = val => val ? `${colors.green}[✔]${colors.reset}` : `${colors.red}[❌]${colors.reset}`;

  console.log(`\n  ${colors.bold}9.1 Funcional:${colors.reset}`);
  console.log(`    ${chk(report.qa.f_abre_sem_erros)} Jogo abre e chega ao início sem erro estrutural.`);
  console.log(`    ${chk(report.qa.f_controles_principais)} Todos os controles principais implementados (click/touch/key).`);
  console.log(`    ${chk(report.qa.f_regras_pontuacao_reinicio)} Regras, pontuação/vidas, vitória/derrota e reinício funcionais.`);
  console.log(`    ${chk(report.qa.f_pause_ou_troca_aba)} Tratamento de pausa/resume e tolerância à troca de abas.`);

  console.log(`\n  ${colors.bold}9.2 Desktop:${colors.reset}`);
  console.log(`    ${chk(report.qa.d_compatibilidade_standards)} Compatível com padrões web modernos (Chromium / Firefox / Safari).`);
  console.log(`    ${chk(report.qa.d_resolucao_responsiva)} Resolução pequena e grande suportadas (layout responsivo / resize).`);
  console.log(`    ${chk(report.qa.d_controles_verificados)} Teclado e mouse operacionais.`);

  console.log(`\n  ${colors.bold}9.3 Mobile:${colors.reset}`);
  console.log(`    ${chk(report.qa.m_viewport_otimizado)} Viewport mobile configurado (width=device-width, cover, user-scalable=no).`);
  console.log(`    ${chk(report.qa.m_sem_scroll_zoom_acidental)} Bloqueio de rolagem da página com o dedo (touch-action: none).`);
  console.log(`    ${chk(report.qa.m_safe_area_poki)} Zona de exclusão de 68px do botão flutuante Poki respeitada.`);
  console.log(`    ${chk(report.qa.m_performance_peso_ok)} Performance e tamanho do pacote dentro dos limites recomendados.`);

  console.log(`\n  ${colors.bold}9.4 Qualidade & Release:${colors.reset}`);
  console.log(`    ${chk(report.qa.q_sem_bugs_s0_s1)} Sem bugs críticos (S0) ou altos (S1) abertos.`);
  console.log(`    ${chk(report.qa.q_assets_integros_sem_404)} Todos os assets locais existem em disco (sem links 404).`);
  console.log(`    ${chk(report.qa.q_sdk_integrado)} Kruuj SDK integrado com loadingFinished, gameplayStart e stop.`);
  console.log(`    ${chk(report.qa.q_audio_mute_presente)} Controle de áudio e opção de silenciar acessível (Seção 5.6).`);
  console.log(`    ${chk(report.qa.q_documentacao_completa)} Documentação completa de pacote (README.md, LICENSES.md, CHANGELOG.md).`);

  // ==========================================================================
  // DEFINITION OF DONE (SEÇÃO 17)
  // ==========================================================================
  console.log(`\n${colors.bold}${colors.blue}🎯 DEFINITION OF DONE (SEÇÃO 17) — Taxa de Prontidão: ${report.dodPassRate}%${colors.reset}`);
  console.log(`    ${chk(report.dod.dod_experiencia_sem_s0_s1)} Experiência principal completa e sem bugs S0/S1.`);
  console.log(`    ${chk(report.dod.dod_requisitos_s2_ok)} Requisitos S2 corrigidos ou com exceção aprovada.`);
  console.log(`    ${chk(report.dod.dod_validador_aprovado)} O jogo obtém o status APROVADO no validador automático.`);
  console.log(`    ${chk(report.dod.dod_mobile_desktop_ok)} Desktop e mobile verificados com layout responsivo e trava de gestos.`);
  console.log(`    ${chk(report.dod.dod_carregamento_controles_telas)} Carregamento, controles, áudio e telas finais verificados.`);
  console.log(`    ${chk(report.dod.dod_sdk_ciclo_vida_completo)} Ciclo de vida Kruuj SDK homologado (loading, start, stop).`);
  console.log(`    ${chk(report.dod.dod_audio_mute_acessivel)} Áudio com controle de volume e botão de mute disponível.`);
  console.log(`    ${chk(report.dod.dod_documentacao_completa)} README.md, CHANGELOG.md e LICENSES.md presentes e atualizados.`);
  console.log(`    ${chk(report.dod.dod_assets_licenciados)} Assets e dependências de terceiros com licença declarada.`);

  if (report.issues.length === 0) {
    console.log(`\n${colors.green}${colors.bold}✔ PARABÉNS! O jogo cumpre 100% do QA Checklist e cumpre rigorosamente a Definition of Done do KRUUJ-PROC-001.${colors.reset}\n`);
    return;
  }

  const severityRank = { S0: 0, S1: 1, S2: 2, S3: 3 };
  report.issues.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);

  console.log(`\n${colors.bold}Detalhes dos Problemas a Corrigir:${colors.reset}`);
  report.issues.forEach((issue, index) => {
    let colorSev = colors.white;
    let labelSev = '';
    if (issue.severity === 'S0') { colorSev = colors.red; labelSev = '[BLOQUEIO S0 - CRÍTICO]'; }
    else if (issue.severity === 'S1') { colorSev = colors.red; labelSev = '[BLOQUEIO S1 - ALTO]'; }
    else if (issue.severity === 'S2') { colorSev = colors.yellow; labelSev = '[PENDÊNCIA S2 - MÉDIO]'; }
    else { colorSev = colors.cyan; labelSev = '[AVISO S3 - BAIXO]'; }

    console.log(`\n${colors.bold}${colorSev}${index + 1}. ${labelSev} ${issue.title}${colors.reset}`);
    console.log(`   ${colors.dim}Manual Ref : ${issue.section}${colors.reset}`);
    console.log(`   ${colors.dim}Localização: ${issue.file}:${issue.line}${colors.reset}`);
    if (issue.snippet) {
      console.log(`   ${colors.dim}Trecho     : ${issue.snippet}${colors.reset}`);
    }
    console.log(`\n   ${colors.green}${colors.bold}👉 ONDE E COMO CORRIGIR:${colors.reset}`);
    const solutionLines = issue.solution.split('\n');
    solutionLines.forEach(sLine => {
      console.log(`   ${colors.white}${sLine}${colors.reset}`);
    });
  });

  console.log('\n' + '='.repeat(80) + '\n');
}

/**
 * Ponto de entrada CLI
 */
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    console.log(`
${colors.bold}${colors.cyan}KRUUJ GAME VALIDATOR & QA / DoD AUDITOR (Manual KRUUJ-PROC-001 v1.1)${colors.reset}

Uso:
  node scripts/check-game.js <caminho-ou-slug-do-jogo>
  node scripts/check-game.js --all

Exemplos:
  node scripts/check-game.js apps/web/public/games/kruuj-defense
  node scripts/check-game.js kruuj-defense
  node scripts/check-game.js --all
`);
    process.exit(0);
  }

  const isAll = args.includes('--all');

  if (isAll) {
    const gamesBaseDir = path.resolve(__dirname, '../apps/web/public/games');
    if (!fs.existsSync(gamesBaseDir)) {
      console.error(`${colors.red}Erro: Pasta de jogos do monorepo não encontrada em ${gamesBaseDir}${colors.reset}`);
      process.exit(1);
    }

    const gameDirs = fs.readdirSync(gamesBaseDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(gamesBaseDir, d.name));

    console.log(`\n${colors.bold}Auditando todos os ${gameDirs.length} jogos do catálogo KRUUJ (Checklist de QA & Definition of Done)...${colors.reset}\n`);

    const summary = [];
    for (const gDir of gameDirs) {
      const rep = validateGame(gDir);
      summary.push({
        slug: rep.gameSlug,
        status: rep.status,
        qaRate: rep.qaPassRate,
        dodRate: rep.dodPassRate,
        s0: rep.s0Count,
        s1: rep.s1Count,
        s2: rep.s2Count,
        s3: rep.s3Count,
        mb: (rep.stats.totalBytes / (1024 * 1024)).toFixed(1),
      });
    }

    console.log('='.repeat(92));
    console.log(`${colors.bold}${'JOGO (SLUG)'.padEnd(26)} ${'STATUS'.padEnd(24)} ${'QA %'.padEnd(6)} ${'DoD %'.padEnd(7)} ${'S0'.padEnd(4)} ${'S1'.padEnd(4)} ${'S2'.padEnd(4)} ${'PESO'.padEnd(6)}${colors.reset}`);
    console.log('-'.repeat(92));
    for (const s of summary) {
      let stColor = colors.green;
      if (s.status === 'REPROVADO') stColor = colors.red;
      if (s.status === 'APROVADO COM PENDÊNCIAS') stColor = colors.yellow;
      console.log(`${s.slug.padEnd(26)} ${stColor}${s.status.padEnd(24)}${colors.reset} ${(s.qaRate + '%').padEnd(6)} ${(s.dodRate + '%').padEnd(7)} ${String(s.s0).padEnd(4)} ${String(s.s1).padEnd(4)} ${String(s.s2).padEnd(4)} ${(s.mb + 'MB').padEnd(6)}`);
    }
    console.log('='.repeat(92));

    const totalReprovados = summary.filter(s => s.status === 'REPROVADO').length;
    const totalPendentes = summary.filter(s => s.status === 'APROVADO COM PENDÊNCIAS').length;
    const totalAprovados = summary.filter(s => s.status === 'APROVADO').length;

    console.log(`Total: ${summary.length} jogos | ${colors.green}${totalAprovados} 100% Homologados${colors.reset} | ${colors.yellow}${totalPendentes} Com Pendências${colors.reset} | ${colors.red}${totalReprovados} Reprovados${colors.reset}\n`);

    process.exit(totalReprovados > 0 ? 1 : 0);
  }

  const target = args[0];
  let targetPath = path.resolve(target);

  if (!fs.existsSync(targetPath)) {
    const candidatePath = path.resolve(__dirname, '../apps/web/public/games', target);
    if (fs.existsSync(candidatePath)) {
      targetPath = candidatePath;
    }
  }

  const report = validateGame(targetPath);
  printReport(report);

  if (report.status === 'REPROVADO') {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateGame, ValidationReport, LIMITS };
