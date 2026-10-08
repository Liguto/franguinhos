import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth';
import { syncDatabaseWithCatalog } from '../catalogSync';

const router = Router();

// Função auxiliar para mapear dados do banco SQLite para o tipo Game do Shared
function mapDatabaseGameToShared(dbGame: any) {
  return {
    ...dbGame,
    subcategories: dbGame.subcategories ? dbGame.subcategories.split(',') : [],
    tags: dbGame.tags ? dbGame.tags.split(',') : [],
    controls: {
      mouse: dbGame.mouse,
      teclado: dbGame.teclado,
      toque: dbGame.toque,
      gamepad: dbGame.gamepad
    }
  };
}

// GET /api/games - Listar todos os jogos publicados
router.get('/', async (req, res) => {
  const { category, tag, search, orientation, ageRating } = req.query;

  try {
    // Sincroniza jogos novos no Supabase sob demanda
    await syncDatabaseWithCatalog();

    const whereClause: any = {
      statusEditorial: 'publicado'
    };

    if (category) {
      whereClause.category = String(category);
    }

    if (orientation) {
      whereClause.orientation = String(orientation);
    }

    if (ageRating) {
      whereClause.ageRating = String(ageRating);
    }

    const dbGames = await prisma.game.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    let games = dbGames.map(mapDatabaseGameToShared);

    // Filtros manuais na memória para campos de texto livre se necessário
    if (tag) {
      const tagStr = String(tag).toLowerCase();
      games = games.filter(g => g.tags.some((t: string) => t.toLowerCase() === tagStr));
    }

    if (search) {
      const searchStr = String(search).toLowerCase();
      games = games.filter(g => 
        g.title.toLowerCase().includes(searchStr) || 
        g.description.toLowerCase().includes(searchStr) ||
        g.tags.some((t: string) => t.toLowerCase().includes(searchStr))
      );
    }

    return res.json(games);
  } catch (error) {
    console.error('Erro ao listar jogos:', error);
    return res.status(500).json({ error: 'Erro interno ao carregar catálogo.' });
  }
});

// GET /api/games/categories - Listar categorias existentes de jogos publicados
router.get('/categories', async (req, res) => {
  try {
    const categories = await prisma.game.findMany({
      where: { statusEditorial: 'publicado' },
      select: { category: true },
      distinct: ['category']
    });
    return res.json(categories.map(c => c.category));
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return res.status(500).json({ error: 'Erro ao carregar categorias.' });
  }
});

// GET /api/games/slug/:slug - Buscar jogo individual por slug
router.get('/slug/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const dbGame = await prisma.game.findUnique({
      where: { slug }
    });

    if (!dbGame) {
      return res.status(404).json({ error: 'Jogo não encontrado.' });
    }

    // Mesmo que não esteja publicado, só admins podem visualizar
    // (Por simplicidade no MVP, na área pública só permitimos publicados)
    if (dbGame.statusEditorial !== 'publicado') {
      return res.status(403).json({ error: 'Este jogo ainda não está publicamente disponível.' });
    }

    const game = mapDatabaseGameToShared(dbGame);
    return res.json(game);
  } catch (error) {
    console.error('Erro ao buscar jogo:', error);
    return res.status(500).json({ error: 'Erro ao carregar jogo.' });
  }
});

// GET /api/games/favorites - Obter jogos favoritos do usuário autenticado
router.get('/favorites', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        game: true
      }
    });

    const games = favorites
      .filter(f => f.game.statusEditorial === 'publicado')
      .map(f => mapDatabaseGameToShared(f.game));

    return res.json(games);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return res.status(500).json({ error: 'Erro ao carregar favoritos.' });
  }
});

// POST /api/games/:id/favorite - Favoritar ou desfavoritar jogo
router.post('/:id/favorite', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const gameId = req.params.id;

  try {
    const game = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado.' });
    }

    // Verificar se já é favorito
    const existingFav = await prisma.favorite.findUnique({
      where: {
        userId_gameId: {
          userId,
          gameId
        }
      }
    });

    if (existingFav) {
      // Remover dos favoritos
      await prisma.favorite.delete({
        where: { id: existingFav.id }
      });
      return res.json({ favorited: false, message: 'Jogo removido dos favoritos.' });
    } else {
      // Adicionar aos favoritos
      await prisma.favorite.create({
        data: {
          userId,
          gameId
        }
      });
      return res.json({ favorited: true, message: 'Jogo adicionado aos favoritos.' });
    }
  } catch (error) {
    console.error('Erro ao alternar favorito:', error);
    return res.status(500).json({ error: 'Erro ao processar favorito.' });
  }
});

export default router;
export { router as gamesRouter };
export { mapDatabaseGameToShared };
