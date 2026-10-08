import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { REAL_14_GAMES } from '../src/catalogSync';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeação do banco de dados (Apenas os 14 Jogos Físicos Reais)...');

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

  // 3. Criar os 14 Jogos Oficiais Reais do Catálogo KRUUJ
  for (const g of REAL_14_GAMES) {
    const { contractNumber, ...gameData } = g;
    const game = await prisma.game.create({
      data: {
        ...gameData,
        publishedAt: new Date(),
      }
    });

    await prisma.contract.create({
      data: {
        contractNumber,
        signatoryCreator: 'KRUUJ Studio S/A',
        termsAccepted: true,
        licenseType: 'Proprietário In-house',
        exclusivityScope: 'Exclusivo Total',
        durationMonths: 120,
        revenueSharePercent: 0.0,
        fixedPaymentAmount: 0.0,
        auditLog: `[${new Date().toISOString()}] Jogo ${g.title} (${g.slug}) homologado.\n`,
        gameId: game.id
      }
    });
  }

  // 4. Criar Favoritos Iniciais
  const seededGames = await prisma.game.findMany();
  const snakeGame = seededGames.find(g => g.slug === 'snake-retro');
  const memoryGame = seededGames.find(g => g.slug === 'memory-match');
  const rocketGame = seededGames.find(g => g.slug === 'rocket-rise');

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

  if (rocketGame) {
    await prisma.favorite.create({
      data: {
        userId: player1.id,
        gameId: rocketGame.id
      }
    });
  }

  // 5. Ingerir eventos iniciais de analytics para popular dashboard
  console.log('📊 Semeando eventos de analítica históricos...');
  const events = [
    { eventType: 'page_view', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome' },
    { eventType: 'page_view', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari' },
    { eventType: 'game_start', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome', gameSlug: 'rocket-rise' },
    { eventType: 'game_loaded', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome', gameSlug: 'rocket-rise' },
    { eventType: 'game_start', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', gameSlug: 'bubble-pop' },
    { eventType: 'game_loaded', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', gameSlug: 'bubble-pop' },
    { eventType: 'ad_impression', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', placementId: 'banner_home', adType: 'display' }
  ];

  for (const ev of events) {
    await prisma.analyticsEvent.create({
      data: {
        ...ev,
        timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
      }
    });
  }

  console.log(`✅ Semeação concluída com sucesso! Total de jogos reais cadastrados: ${REAL_14_GAMES.length}`);
}

main()
  .catch((e) => {
    console.error('Erro na semeação do banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
