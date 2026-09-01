import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeação do banco de dados...');

  // 1. Limpar tabelas existentes
  await prisma.favorite.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});

  console.log('🧹 Banco de dados limpo.');

  // 2. Criar Usuários
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const playerPasswordHash = await bcrypt.hash('player123', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'super_admin',
      status: 'ativo',
      agePreference: 'sem_preferencia'
    }
  });

  const editor = await prisma.user.create({
    data: {
      username: 'editor',
      passwordHash: adminPasswordHash,
      role: 'editor',
      status: 'ativo',
      agePreference: 'sem_preferencia'
    }
  });

  const player1 = await prisma.user.create({
    data: {
      username: 'poki_gamer',
      passwordHash: playerPasswordHash,
      role: 'user',
      status: 'ativo',
      agePreference: 'sem_preferencia'
    }
  });

  const player2 = await prisma.user.create({
    data: {
      username: 'vovo_gamer',
      passwordHash: playerPasswordHash,
      role: 'user',
      status: 'ativo',
      agePreference: 'terceira_idade'
    }
  });

  console.log('👥 Usuários criados com sucesso.');

  // 3. Criar Jogos Semeados
  const gamesToSeed = [
    {
      title: 'Snake Retro Arcade',
      slug: 'snake-retro',
      description: 'O clássico jogo da cobrinha em estilo retro futurista arcade! Pegue os blocos de dados de neon para crescer sem bater nas próprias caudas ou nas paredes.',
      category: 'Arcade',
      subcategories: 'Clássico,Casual,Retrô',
      tags: 'cobrinha,retro,pixel,neon,casual',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'snake', // ícone estilizado por CSS
      prefixUrl: '/games/snake-retro/',
      version: '1.0.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'RetroByte Studios',
      licenseName: 'Licença Comercial Ampla',
      contract: {
        contractNumber: 'CON-2026-001',
        signatoryCreator: 'RetroByte Studios LP',
        termsAccepted: true,
        licenseType: 'Licença Comercial Exclusiva Digital',
        exclusivityScope: 'Exclusivo Brasil',
        durationMonths: 24,
        revenueSharePercent: 30.0,
        fixedPaymentAmount: 1200.0,
        auditLog: `[2026-08-24T10:00:00Z] Contrato assinado eletronicamente por RetroByte LP.\n[2026-08-24T10:15:00Z] Teste técnico aprovado por admin.\n`
      }
    },
    {
      title: 'Memory Training Neon',
      slug: 'memory-match',
      description: 'Exercite sua mente combinando as cartas de neon vibrantes. Ideal para melhorar a atenção de crianças e excelente para a manutenção cognitiva na terceira idade!',
      category: 'Memória',
      subcategories: 'Cognitivo,Educacional,Infantil',
      tags: 'memoria,educacional,mente,cartas,infantil,idoso',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'brain',
      prefixUrl: '/games/memory-match/',
      version: '1.0.2',
      mouse: true,
      teclado: false,
      toque: true,
      gamepad: false,
      orientation: 'portrait',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'MindCare Software',
      licenseName: 'Licença Comercial Geral',
      contract: {
        contractNumber: 'CON-2026-002',
        signatoryCreator: 'MindCare Software SA',
        termsAccepted: true,
        licenseType: 'Licença Comercial Não Exclusiva',
        exclusivityScope: 'Global',
        durationMonths: 36,
        revenueSharePercent: 15.0,
        fixedPaymentAmount: 800.0,
        auditLog: `[2026-08-24T10:20:00Z] Contrato validado por MindCare SA.\n[2026-08-24T10:30:00Z] Aprovado editorialmente para categorias Infantil e Terceira Idade.\n`
      }
    },
    {
      title: 'Cyber Space Defense',
      slug: 'space-defense',
      description: 'Defenda o núcleo central contra invasores cibernéticos do espaço profundo. Atire nos inimigos, acumule pontuação e sobreviva às hordas!',
      category: 'Ação',
      subcategories: 'Espaço,Tiro,Sobrevivência',
      tags: 'tiro,espaco,defense,arcade,invasores',
      ageRating: '10+',
      bannerUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/space-defense/',
      version: '1.1.0',
      mouse: true,
      teclado: true,
      toque: true,
      gamepad: true,
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'PixelGlitch Labs',
      licenseName: 'Cessão Total de Direitos',
      contract: {
        contractNumber: 'CON-2026-003',
        signatoryCreator: 'PixelGlitch Labs',
        termsAccepted: true,
        licenseType: 'Cessão de Propriedade Intelectual',
        exclusivityScope: 'Exclusivo Total',
        durationMonths: 120,
        revenueSharePercent: 0.0,
        fixedPaymentAmount: 3500.0,
        auditLog: `[2026-08-24T11:00:00Z] Cessão de direitos autorais registrada em cartório digital.\n`
      }
    },
    {
      title: 'Tetris Neon Block (Rascunho)',
      slug: 'tetris-draft',
      description: 'O clássico empilhador de blocos geométricos sob iluminação fluorescente. Projeto em testes técnicos.',
      category: 'Puzzle',
      subcategories: 'Clássico,Estratégia',
      tags: 'tetris,blocos,puzzle,classico',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'grid',
      prefixUrl: '/games/tetris-draft/',
      version: '0.9.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'portrait',
      statusTechnical: 'pendente_teste',
      statusEditorial: 'rascunho',
      statusDoc: 'documentacao_pendente',
      author: 'DevIndie Bruno',
      licenseName: 'Uso Comercial Sob Análise',
      contract: {
        contractNumber: 'CON-2026-004',
        signatoryCreator: 'Bruno de Souza',
        termsAccepted: false,
        licenseType: 'Pendente de Acordo Escrito',
        exclusivityScope: 'Não Definido',
        durationMonths: 6,
        revenueSharePercent: 50.0,
        fixedPaymentAmount: 0.0,
        auditLog: `[2026-08-24T11:20:00Z] Criado rascunho de ficha técnica. Aguardando envio da documentação de autoria por e-mail.\n`
      }
    },
    {
      title: 'Super Math Run',
      slug: 'math-run',
      description: 'Jogos de soma e matemática para 8 anos online. Corra, pule obstáculos e responda contas e cálculos rápidos mentalmente para continuar avançando. Aprender nunca foi tão divertido!',
      category: 'Educacional',
      subcategories: 'Corrida,Educacional,Matemática',
      tags: 'educacional,infantil,matematica,corrida,kids',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'plus',
      prefixUrl: '/games/math-run/',
      version: '1.0.1',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'EduPlay Corp',
      licenseName: 'Licença Comercial Não Exclusiva',
      contract: {
        contractNumber: 'CON-2026-005',
        signatoryCreator: 'EduPlay Corp S/A',
        termsAccepted: true,
        licenseType: 'Licença Comercial de Uso',
        exclusivityScope: 'Global',
        durationMonths: 12,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 500.0,
        auditLog: `[2026-08-24T11:40:00Z] Contrato assinado. Aprovado editorialmente para portal Educacional.\n`
      }
    },
    {
      title: 'Sudoku Zen Master',
      slug: 'sudoku-zen',
      description: 'O clássico tabuleiro matemático de preenchimento numérico em trilha sonora relaxante. Excelente para exercitar a memória lógica de todas as idades, ideal para terceira idade.',
      category: 'Terceira Idade',
      subcategories: 'Puzzle,Lógica,Cognitivo',
      tags: 'sudoku,tabuleiro,logica,zen,idoso,mente',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'hash',
      prefixUrl: '/games/sudoku-zen/',
      version: '1.0.0',
      mouse: true,
      teclado: false,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'ZenPuzzle Co',
      licenseName: 'Licença Comercial Ampla',
      contract: {
        contractNumber: 'CON-2026-006',
        signatoryCreator: 'ZenPuzzle LLC',
        termsAccepted: true,
        licenseType: 'Licença Ampla Não Exclusiva',
        exclusivityScope: 'Global',
        durationMonths: 48,
        revenueSharePercent: 10.0,
        fixedPaymentAmount: 600.0,
        auditLog: `[2026-08-24T12:00:00Z] Contrato Zen assinado. Aprovado para catálogo sênior.\n`
      }
    },
    {
      title: 'Bolhas Mágicas',
      slug: 'bubble-pop',
      description: 'Estoure as bolhas coloridas em um ambiente calmo e seguro. Jogo focado em causa e efeito, perfeito para o desenvolvimento motor de bebês e crianças pequenas.',
      category: 'Bebês',
      subcategories: 'Lúdico,Sensorial,Causa e Efeito',
      tags: 'bebes,bolhas,cores,sensorial,toddler',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'plus',
      prefixUrl: '/games/bubble-pop/',
      version: '1.0.0',
      mouse: true,
      teclado: false,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'Franguinhos Original',
      licenseName: 'Proprietário',
      contract: {
        contractNumber: 'CON-2026-007',
        signatoryCreator: 'Franguinhos Games',
        termsAccepted: true,
        licenseType: 'Proprietário (In-house)',
        exclusivityScope: 'Exclusivo Total',
        durationMonths: 120,
        revenueSharePercent: 0.0,
        fixedPaymentAmount: 0.0,
        auditLog: `[2026-08-24T14:30:00Z] Jogo desenvolvido in-house. Propriedade Intelectual total.\n`
      }
    }
  ];

  for (const g of gamesToSeed) {
    const { contract, ...gameData } = g;
    const game = await prisma.game.create({
      data: {
        ...gameData,
        publishedAt: gameData.statusEditorial === 'publicado' ? new Date() : null,
      }
    });

    await prisma.contract.create({
      data: {
        ...contract,
        gameId: game.id
      }
    });
  }

  // 4. Criar Favoritos Iniciais
  const seededGames = await prisma.game.findMany();
  const snakeGame = seededGames.find(g => g.slug === 'snake-retro');
  const memoryGame = seededGames.find(g => g.slug === 'memory-match');

  if (snakeGame) {
    await prisma.favorite.create({
      data: {
        userId: player1.id,
        gameId: snakeGame.id
      }
    });
  }

  if (memoryGame) {
    await prisma.favorite.create({
      data: {
        userId: player2.id,
        gameId: memoryGame.id
      }
    });
  }

  // 5. Ingerir eventos iniciais de analytics para popular dashboard
  console.log('📊 Semeando eventos de analítica históricos...');
  const events = [
    { eventType: 'page_view', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome' },
    { eventType: 'page_view', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari' },
    { eventType: 'game_start', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome', gameSlug: 'snake-retro' },
    { eventType: 'game_loaded', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome', gameSlug: 'snake-retro' },
    { eventType: 'game_start', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', gameSlug: 'memory-match' },
    { eventType: 'game_loaded', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', gameSlug: 'memory-match' },
    { eventType: 'ad_impression', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', placementId: 'banner_home', adType: 'display' }
  ];

  for (const ev of events) {
    await prisma.analyticsEvent.create({
      data: {
        ...ev,
        timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000) // últimos 5 dias
      }
    });
  }

  console.log('✅ Semeação concluída com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro na semeação do banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
