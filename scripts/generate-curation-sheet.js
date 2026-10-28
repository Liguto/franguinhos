const fs = require('fs');
const path = require('path');

const catalogPath = path.resolve(__dirname, 'catalog_data.json');
const games = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

// 1. CSV (Padrão Excel/Sheets com BOM UTF-8 e separador ;)
const csvHeader = [
  'ID',
  'Titulo',
  'Slug',
  'Categoria',
  'Subcategorias',
  'Faixa_Etaria',
  'Orientacao',
  'Toque_Mobile',
  'Teclado',
  'Mouse',
  'Status_Tecnico',
  'Status_Editorial',
  'Status_Arte_Icone',
  'Status_Arte_Banner',
  'Potencial_Monetizacao',
  'Nota_Curadoria_1_a_5',
  'Decisao_Curadoria',
  'Descricao_Resumida'
].join(';');

const csvRows = games.map((g, idx) => {
  const iconPath = path.resolve(__dirname, '../apps/web/public', g.iconUrl.replace(/^\//, ''));
  const bannerPath = path.resolve(__dirname, '../apps/web/public', g.bannerUrl.replace(/^\//, ''));
  
  const hasCustomIcon = fs.existsSync(iconPath) ? 'Existente' : 'Pendente (Gerar)';
  const hasCustomBanner = fs.existsSync(bannerPath) ? 'Existente' : 'Pendente (Gerar)';
  
  let monetizacao = 'Intersticial (90s)';
  if (g.category === 'Bebês') monetizacao = 'Livre de Anúncios (Kids Safe)';
  else if (g.category === 'Arcade' || g.category === 'Ação' || g.slug === 'kruuj-defense') monetizacao = 'Rewarded Break + Intersticial';
  
  let decisaoDefault = 'Aprovado para Catálogo';
  if (['kruuj-overdrive', 'kruuj-defense', 'kruuj-orbit', 'rocket-rise', 'kruuj-neon-blocks'].includes(g.slug)) {
    decisaoDefault = 'Destaque Mosaico Bento (2x2 ou 2x1)';
  }

  return [
    idx + 1,
    `"${g.title}"`,
    g.slug,
    g.category,
    `"${g.subcategories}"`,
    g.ageRating,
    g.orientation,
    g.toque ? 'Sim' : 'Não',
    g.teclado ? 'Sim' : 'Não',
    g.mouse ? 'Sim' : 'Não',
    g.statusTechnical,
    g.statusEditorial,
    hasCustomIcon,
    hasCustomBanner,
    `"${monetizacao}"`,
    '', // Para preenchimento de nota
    `"${decisaoDefault}"`,
    `"${g.description.replace(/"/g, "'")}"`
  ].join(';');
});

const csvContent = '\uFEFF' + [csvHeader, ...csvRows].join('\r\n');
fs.writeFileSync(path.resolve(__dirname, '../knowledge/PLANILHA_CURADORIA_JOGOS_KRUUJ.csv'), csvContent, 'utf8');

// 2. Markdown Report
let mdContent = `# 📋 Planilha de Curadoria do Catálogo — KRUUJ Studio\n\n`;
mdContent += `> **Data de Atualização:** Outubro de 2026  \n`;
mdContent += `> **Total de Títulos:** ${games.length} Jogos Homologados  \n`;
mdContent += `> **Formato de Exportação:** Disponível em CSV (\`knowledge/PLANILHA_CURADORIA_JOGOS_KRUUJ.csv\`) para Google Sheets e Excel.\n\n`;

mdContent += `## 🎯 Critérios de Curadoria Poki-Grade\n`;
mdContent += `1. **Engajamento Inicial (C2P - Conversion to Play):** O jogo carrega em < 3 segundos sem travas ou tela preta.\n`;
mdContent += `2. **Ergonomia Mobile (100vw × 100dvh):** Controles táteis fáceis, margem segura de 68px respeitada no cabeçalho e botão de saída sempre acessível.\n`;
mdContent += `3. **Qualidade Visual (Padrão Overdrive):** Ícone 3D em alta resolução (1024×1024) e Banner cinematográfico (1920×1080).\n`;
mdContent += `4. **Monetização & Segurança:** Intersticiais com cooldown de 90s, anúncios com recompensa para vidas extras/boosts e Modo Bebês 100% livre de publicidade (COPPA/LGPD).\n\n`;

mdContent += `## 📊 Tabela Mestra de Curadoria dos 36 Jogos\n\n`;
mdContent += `| # | Título | Slug | Categoria | Orientação | Controles | Status Arte | Monetização | Decisão / Destaque |\n`;
mdContent += `| :-: | :--- | :--- | :--- | :---: | :---: | :---: | :--- | :--- |\n`;

games.forEach((g, idx) => {
  const iconPath = path.resolve(__dirname, '../apps/web/public', g.iconUrl.replace(/^\//, ''));
  const bannerPath = path.resolve(__dirname, '../apps/web/public', g.bannerUrl.replace(/^\//, ''));
  const artStatus = (fs.existsSync(iconPath) && fs.existsSync(bannerPath)) ? '🟢 Completa' : '🟡 Gerar';

  let monetizacao = 'Intersticial (90s)';
  if (g.category === 'Bebês') monetizacao = 'Kids Safe (Sem Ads)';
  else if (g.category === 'Arcade' || g.category === 'Ação' || g.slug === 'kruuj-defense') monetizacao = 'Rewarded + Intersticial';

  let destaque = 'Catálogo (1x1)';
  if (['kruuj-overdrive', 'kruuj-orbit'].includes(g.slug)) destaque = 'Viral Hero (2x2)';
  else if (['kruuj-defense', 'kruuj-match', 'kruuj-penalty'].includes(g.slug)) destaque = 'Em Alta (2x1)';

  mdContent += `| ${idx + 1} | **${g.title}** | \`${g.slug}\` | ${g.category} | ${g.orientation} | ${g.toque ? '📱 Touch' : '⌨️ Desktop'} | ${artStatus} | ${monetizacao} | **${destaque}** |\n`;
});

fs.writeFileSync(path.resolve(__dirname, '../knowledge/PLANILHA_CURADORIA_JOGOS_KRUUJ.md'), mdContent, 'utf8');

console.log('Arquivos CSV e Markdown de curadoria gerados com sucesso!');
