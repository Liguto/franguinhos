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

// POST /api/games/submit - Submissão pública de novos jogos por desenvolvedores
router.post('/submit', async (req, res) => {
  const {
    title,
    author,
    email,
    description,
    category,
    orientation,
    controls,
    zipUrl,
    pixKey,
    checklist
  } = req.body;

  if (!title || !author || !email || !zipUrl) {
    return res.status(400).json({ error: 'Título, autor, e-mail e link do arquivo ZIP são obrigatórios.' });
  }

  // Validação estrita do checklist de monetização futura e direitos
  const isValidChecklist = checklist &&
    checklist.intellectualProperty === true &&
    checklist.nonMonetizedPhaseAcknowledged === true &&
    checklist.futureRevShare70_30Agreed === true &&
    checklist.nonExclusiveLicense === true &&
    checklist.childProtectionAndLgpd === true;

  if (!isValidChecklist) {
    return res.status(400).json({
      error: 'O checklist contratual de monetização futura e conformidade jurídica deve ser aceito integralmente.'
    });
  }

  try {
    // Gerar slug a partir do título
    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!slug) slug = 'game-' + Date.now().toString(36);

    // Verificar se slug já existe
    const slugExists = await prisma.game.findUnique({ where: { slug } });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const contractNumber = 'KRUUJ-DEV-' + Date.now().toString(36).toUpperCase();
    const now = new Date();

    const auditLog = `[${now.toISOString()}] Submissão recebida via KRUUJ for Developers:
- Criador: ${author} <${email}>
- Chave Pix cadastrada para repasses futuros: ${pixKey || 'Não informada'}
- Pacote ZIP do jogo: ${zipUrl}
- Checklist Contratual de Monetização Aceito:
  [X] Propriedade intelectual e autoria legítima declarada
  [X] Ciência de fase atual sem monetização direta
  [X] Concordância irrevogável com Revenue Share 70% Dev / 30% KRUUJ futuro
  [X] Concessão de licença de distribuição web não-exclusiva
  [X] Conformidade com LGPD e proteção à criança (ECA)
Status inicial: Em análise pelos administradores da KRUUJ.\n`;

    const result = await prisma.$transaction(async (tx) => {
      const game = await tx.game.create({
        data: {
          title,
          slug,
          description: description || `Jogo ${title} desenvolvido por ${author}.`,
          category: category || 'Arcade',
          subcategories: category || 'Arcade',
          tags: `${slug},kruuj,indie,games,${author}`,
          ageRating: 'Livre',
          bannerUrl: zipUrl, // Referência inicial do arquivo/pacote enviado
          iconUrl: 'gamepad',
          prefixUrl: `/games/submissions/${slug}/`,
          version: '1.0.0',
          mouse: controls?.mouse ?? true,
          teclado: controls?.teclado ?? true,
          toque: controls?.toque ?? true,
          gamepad: controls?.gamepad ?? false,
          orientation: orientation || 'both',
          statusTechnical: 'pendente_teste',
          statusEditorial: 'em_análise', // Pendente de aprovação dos administradores
          statusDoc: 'documentacao_pendente',
          author,
          licenseName: 'Distribuição Web Não-Exclusiva (RevShare 70/30)'
        }
      });

      const contract = await tx.contract.create({
        data: {
          gameId: game.id,
          contractNumber,
          signatoryCreator: `${author} <${email}>`,
          signatoryRepresentative: 'Administração KRUUJ Studio',
          termsAccepted: true,
          licenseType: 'Distribuição Web Não-Exclusiva (RevShare 70/30)',
          exclusivityScope: 'Não Exclusivo',
          durationMonths: 24,
          revenueSharePercent: 70.0, // 70% Desenvolvedor / 30% KRUUJ
          fixedPaymentAmount: 0.0,
          auditLog
        }
      });

      return { game, contract };
    });

    // Notificação por e-mail para os administradores da KRUUJ
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'contato@kruuj.com';
    console.log(`[KRUUJ Notification] E-mail enviado para ${adminEmail}:
Assunto: [KRUUJ] Nova Submissão de Jogo: "${title}" por ${author}
Protocolo de Contrato: ${contractNumber}
E-mail do Dev: ${email}
Link do ZIP: ${zipUrl}
Chave Pix: ${pixKey || 'Pendente'}
Checklist Contratual: Aceito 100%`);

    return res.status(201).json({
      success: true,
      message: 'Jogo enviado com sucesso para aprovação dos administradores!',
      contractNumber,
      gameId: result.game.id,
      slug: result.game.slug
    });
  } catch (error: any) {
    console.error('Erro ao submeter jogo:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a submissão do jogo.' });
  }
});

export default router;
export { router as gamesRouter };
export { mapDatabaseGameToShared };
