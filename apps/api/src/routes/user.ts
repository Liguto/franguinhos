import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';

const router = Router();

// ============================================================================
// 1. SALVAMENTO E SINCRONIZAÇÃO DE PROGRESSO EM NUVEM (CLOUD SAVE STATES)
// ============================================================================

// GET /api/user/progress/:gameSlug - Obter o save state do jogo para o usuário logado
router.get('/progress/:gameSlug', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { gameSlug } = req.params;

  try {
    const progress = await prisma.userGameProgress.findUnique({
      where: {
        userId_gameSlug: {
          userId,
          gameSlug
        }
      }
    });

    if (!progress) {
      return res.json({ found: false, saveData: null });
    }

    let parsedData = null;
    try {
      parsedData = JSON.parse(progress.saveData);
    } catch (e) {
      parsedData = progress.saveData;
    }

    return res.json({
      found: true,
      gameSlug: progress.gameSlug,
      saveData: parsedData,
      score: progress.score,
      updatedAt: progress.updatedAt
    });
  } catch (error) {
    console.error('Erro ao buscar progresso do jogo:', error);
    return res.status(500).json({ error: 'Erro ao carregar progresso da nuvem.' });
  }
});

// POST /api/user/progress/:gameSlug - Salvar ou atualizar o progresso do jogo na nuvem
router.post('/progress/:gameSlug', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { gameSlug } = req.params;
  const { saveData, score = 0 } = req.body;

  if (!saveData) {
    return res.status(400).json({ error: 'saveData é obrigatório.' });
  }

  const serialized = typeof saveData === 'string' ? saveData : JSON.stringify(saveData);

  try {
    const progress = await prisma.userGameProgress.upsert({
      where: {
        userId_gameSlug: {
          userId,
          gameSlug
        }
      },
      update: {
        saveData: serialized,
        score: Number(score) || 0,
        updatedAt: new Date()
      },
      create: {
        userId,
        gameSlug,
        saveData: serialized,
        score: Number(score) || 0
      }
    });

    return res.json({ success: true, progress });
  } catch (error) {
    console.error('Erro ao salvar progresso em nuvem:', error);
    return res.status(500).json({ error: 'Erro ao salvar progresso no banco de dados.' });
  }
});

// ============================================================================
// 2. HISTÓRICO DE PARTIDAS DO USUÁRIO ENTRE DISPOSITIVOS
// ============================================================================

// GET /api/user/history - Buscar histórico de jogos jogados recentemente pelo usuário
router.get('/history', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const history = await prisma.userPlayHistory.findMany({
      where: { userId },
      orderBy: { lastPlayed: 'desc' },
      take: 20
    });

    return res.json(history);
  } catch (error) {
    console.error('Erro ao buscar histórico do usuário:', error);
    return res.status(500).json({ error: 'Erro ao carregar histórico.' });
  }
});

// POST /api/user/history - Registrar ou atualizar jogo no histórico
router.post('/history', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { gameSlug, gameTitle = '', score = 0 } = req.body;

  if (!gameSlug) {
    return res.status(400).json({ error: 'gameSlug é obrigatório.' });
  }

  try {
    const entry = await prisma.userPlayHistory.upsert({
      where: {
        userId_gameSlug: {
          userId,
          gameSlug
        }
      },
      update: {
        gameTitle: gameTitle || undefined,
        score: Number(score) || 0,
        lastPlayed: new Date()
      },
      create: {
        userId,
        gameSlug,
        gameTitle: gameTitle || gameSlug,
        score: Number(score) || 0,
        lastPlayed: new Date()
      }
    });

    return res.json({ success: true, entry });
  } catch (error) {
    console.error('Erro ao registrar histórico:', error);
    return res.status(500).json({ error: 'Erro ao atualizar histórico.' });
  }
});

// ============================================================================
// 3. FAVORITOS UNIFICADOS DO USUÁRIO
// ============================================================================

// GET /api/user/favorites - Retornar lista completa de IDs e slugs favoritados
router.get('/favorites', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { game: true }
    });

    return res.json(favorites.map(f => ({
      favoriteId: f.id,
      gameId: f.gameId,
      gameSlug: f.game.slug,
      title: f.game.title,
      bannerUrl: f.game.bannerUrl,
      category: f.game.category
    })));
  } catch (error) {
    console.error('Erro ao buscar favoritos do usuário:', error);
    return res.status(500).json({ error: 'Erro ao carregar favoritos.' });
  }
});

// POST /api/user/favorites/:gameIdOrSlug - Favoritar ou desfavoritar (aceita ID ou slug)
router.post('/favorites/:gameIdOrSlug', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { gameIdOrSlug } = req.params;

  try {
    // Busca jogo por ID ou slug
    let game = await prisma.game.findFirst({
      where: {
        OR: [
          { id: gameIdOrSlug },
          { slug: gameIdOrSlug }
        ]
      }
    });

    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado no catálogo.' });
    }

    const existingFav = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId: game.id
        }
      }
    });

    if (existingFav) {
      await prisma.favorite.delete({
        where: { id: existingFav.id }
      });
      return res.json({ favorited: false, gameId: game.id, gameSlug: game.slug });
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          gameId: game.id
        }
      });
      return res.json({ favorited: true, gameId: game.id, gameSlug: game.slug });
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    return res.status(500).json({ error: 'Erro ao salvar favorito.' });
  }
});

export const userRouter = router;
