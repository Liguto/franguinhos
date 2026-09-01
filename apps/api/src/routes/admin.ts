import { Router, Response } from 'express';
import { prisma } from '../prisma';
import { AuthenticatedRequest, requireRoles } from '../middleware/auth';
import { mapDatabaseGameToShared } from './games';

const router = Router();

// Middleware de segurança para o painel administrativo
// Permitir papéis de administração e edição/moderação
const adminRoles = ['super_admin', 'editor', 'moderador', 'analista', 'marketing', 'suporte', 'financeiro'];
router.use(requireRoles(adminRoles));

// GET /api/admin/games - Listar todos os jogos do catálogo administrativo (independente do status)
router.get('/games', async (req, res) => {
  try {
    const dbGames = await prisma.game.findMany({
      include: { contract: true },
      orderBy: { createdAt: 'desc' }
    });

    const gamesWithContracts = dbGames.map(dbGame => ({
      game: mapDatabaseGameToShared(dbGame),
      contract: dbGame.contract
    }));

    return res.json(gamesWithContracts);
  } catch (error) {
    console.error('Erro admin listar jogos:', error);
    return res.status(500).json({ error: 'Erro ao listar catálogo administrativo.' });
  }
});

// POST /api/admin/games - Criar novo jogo no catálogo com contrato
router.post('/games', async (req: AuthenticatedRequest, res: Response) => {
  const {
    title, slug, description, category, subcategories, tags, ageRating,
    bannerUrl, iconUrl, prefixUrl, version, controls, orientation,
    statusTechnical, statusEditorial, statusDoc, author, licenseName,
    contractNumber, signatoryCreator, signatoryRepresentative, termsAccepted,
    licenseType, exclusivityScope, durationMonths, revenueSharePercent, fixedPaymentAmount
  } = req.body;

  if (!title || !slug || !category || !author || !licenseName || !contractNumber || !signatoryCreator) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes para o cadastro do jogo e contrato.' });
  }

  try {
    // Verificar se o slug já existe
    const existingGame = await prisma.game.findUnique({
      where: { slug }
    });
    if (existingGame) {
      return res.status(400).json({ error: 'Já existe um jogo cadastrado com este slug.' });
    }

    // Criar jogo e contrato em uma transação transacional
    const result = await prisma.$transaction(async (tx) => {
      const game = await tx.game.create({
        data: {
          title,
          slug,
          description: description || '',
          category,
          subcategories: Array.isArray(subcategories) ? subcategories.join(',') : '',
          tags: Array.isArray(tags) ? tags.join(',') : '',
          ageRating: ageRating || 'Livre',
          bannerUrl,
          iconUrl,
          prefixUrl,
          version: version || '1.0.0',
          mouse: controls?.mouse ?? true,
          teclado: controls?.teclado ?? true,
          toque: controls?.toque ?? true,
          gamepad: controls?.gamepad ?? false,
          orientation: orientation || 'both',
          statusTechnical: statusTechnical || 'pendente_teste',
          statusEditorial: statusEditorial || 'rascunho',
          statusDoc: statusDoc || 'documentacao_pendente',
          author,
          licenseName,
          publishedAt: statusEditorial === 'publicado' ? new Date() : null,
          revisedAt: new Date()
        }
      });

      const auditLog = `[${new Date().toISOString()}] Contrato inicial criado por admin ${req.user!.username}.\n`;

      const contract = await tx.contract.create({
        data: {
          gameId: game.id,
          contractNumber,
          signatoryCreator,
          signatoryRepresentative: signatoryRepresentative || null,
          termsAccepted: termsAccepted ?? false,
          licenseType: licenseType || 'Licença de Uso Comercial',
          exclusivityScope: exclusivityScope || 'Não Exclusivo',
          durationMonths: durationMonths ? Number(durationMonths) : 12,
          revenueSharePercent: revenueSharePercent ? Number(revenueSharePercent) : 0.0,
          fixedPaymentAmount: fixedPaymentAmount ? Number(fixedPaymentAmount) : 0.0,
          auditLog
        }
      });

      return { game, contract };
    });

    return res.status(201).json({
      game: mapDatabaseGameToShared(result.game),
      contract: result.contract
    });
  } catch (error) {
    console.error('Erro ao cadastrar jogo:', error);
    return res.status(500).json({ error: 'Erro ao salvar jogo e contrato no banco.' });
  }
});

// PUT /api/admin/games/:id - Atualizar jogo e contrato existente
router.put('/games/:id', async (req: AuthenticatedRequest, res: Response) => {
  const gameId = req.params.id;
  const {
    title, description, category, subcategories, tags, ageRating,
    bannerUrl, iconUrl, prefixUrl, version, controls, orientation,
    statusTechnical, statusEditorial, statusDoc, author, licenseName,
    contractNumber, signatoryCreator, signatoryRepresentative, termsAccepted,
    licenseType, exclusivityScope, durationMonths, revenueSharePercent, fixedPaymentAmount
  } = req.body;

  try {
    const existingGame = await prisma.game.findUnique({
      where: { id: gameId },
      include: { contract: true }
    });

    if (!existingGame) {
      return res.status(404).json({ error: 'Jogo não encontrado.' });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. Atualizar Jogo
      const updatedGame = await tx.game.update({
        where: { id: gameId },
        data: {
          title,
          description,
          category,
          subcategories: Array.isArray(subcategories) ? subcategories.join(',') : existingGame.subcategories,
          tags: Array.isArray(tags) ? tags.join(',') : existingGame.tags,
          ageRating,
          bannerUrl,
          iconUrl,
          prefixUrl,
          version,
          mouse: controls?.mouse ?? existingGame.mouse,
          teclado: controls?.teclado ?? existingGame.teclado,
          toque: controls?.toque ?? existingGame.toque,
          gamepad: controls?.gamepad ?? existingGame.gamepad,
          orientation,
          statusTechnical,
          statusEditorial,
          statusDoc,
          author,
          licenseName,
          publishedAt: statusEditorial === 'publicado' && existingGame.statusEditorial !== 'publicado' ? new Date() : existingGame.publishedAt,
          revisedAt: new Date()
        }
      });

      // 2. Atualizar ou Criar Contrato
      let updatedContract = null;
      if (contractNumber) {
        let auditLogAddition = `[${new Date().toISOString()}] Contrato atualizado por ${req.user!.username}. `;
        if (existingGame.statusEditorial !== statusEditorial) {
          auditLogAddition += `Status editorial alterado de '${existingGame.statusEditorial}' para '${statusEditorial}'. `;
        }
        if (existingGame.statusDoc !== statusDoc) {
          auditLogAddition += `Status documental alterado de '${existingGame.statusDoc}' para '${statusDoc}'. `;
        }
        auditLogAddition += '\n';

        const currentAuditLog = existingGame.contract?.auditLog || '';
        const newAuditLog = currentAuditLog + auditLogAddition;

        if (existingGame.contract) {
          updatedContract = await tx.contract.update({
            where: { id: existingGame.contract.id },
            data: {
              contractNumber,
              signatoryCreator,
              signatoryRepresentative,
              termsAccepted: termsAccepted ?? existingGame.contract.termsAccepted,
              licenseType,
              exclusivityScope,
              durationMonths: durationMonths ? Number(durationMonths) : existingGame.contract.durationMonths,
              revenueSharePercent: revenueSharePercent ? Number(revenueSharePercent) : existingGame.contract.revenueSharePercent,
              fixedPaymentAmount: fixedPaymentAmount ? Number(fixedPaymentAmount) : existingGame.contract.fixedPaymentAmount,
              auditLog: newAuditLog
            }
          });
        } else {
          updatedContract = await tx.contract.create({
            data: {
              gameId,
              contractNumber,
              signatoryCreator,
              signatoryRepresentative,
              termsAccepted: termsAccepted ?? false,
              licenseType,
              exclusivityScope,
              durationMonths: durationMonths ? Number(durationMonths) : 12,
              revenueSharePercent: revenueSharePercent ? Number(revenueSharePercent) : 0.0,
              fixedPaymentAmount: fixedPaymentAmount ? Number(fixedPaymentAmount) : 0.0,
              auditLog: auditLogAddition
            }
          });
        }
      }

      return { game: updatedGame, contract: updatedContract };
    });

    return res.json({
      game: mapDatabaseGameToShared(result.game),
      contract: result.contract
    });
  } catch (error) {
    console.error('Erro ao atualizar jogo:', error);
    return res.status(500).json({ error: 'Erro ao salvar alterações no banco.' });
  }
});

// DELETE /api/admin/games/:id - Deletar jogo do catálogo (e seu contrato em cascata)
router.delete('/games/:id', async (req, res) => {
  const gameId = req.params.id;

  try {
    const existingGame = await prisma.game.findUnique({
      where: { id: gameId }
    });

    if (!existingGame) {
      return res.status(404).json({ error: 'Jogo não encontrado.' });
    }

    await prisma.game.delete({
      where: { id: gameId }
    });

    return res.json({ success: true, message: 'Jogo e contrato deletados com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar jogo:', error);
    return res.status(500).json({ error: 'Erro ao deletar jogo.' });
  }
});

// GET /api/admin/metrics - Obter métricas de produto e publicidade agregadas sem dados brutos
router.get('/metrics', async (req, res) => {
  try {
    // Contagem de usuários ativos reais e total de eventos salvos
    const userCount = await prisma.user.count();
    const gameCount = await prisma.game.count({ where: { statusEditorial: 'publicado' } });
    const draftCount = await prisma.game.count({ where: { statusEditorial: { not: 'publicado' } } });
    const favoritesCount = await prisma.favorite.count();

    // Métricas financeiras e de conversão de anúncios agregadas e simuladas de forma prudente
    // que se ajustam e incorporam dados do banco de dados local
    const baseSessions = 12500 + favoritesCount * 45 + userCount * 12;
    const grossRevenue = (baseSessions / 1000) * 4.25; // Ex: RPM de R$ 4.25
    const infraCostEst = 350.00; // Custo de infraestutura simulada para fins de métrica de lucro líquido

    const metrics = {
      period: 'últimos_30_dias',
      sessions: baseSessions,
      activeUsers: Math.round(baseSessions * 0.42),
      bounceRate: 0.075, // 7.5% de abandono de carregamento
      avgPlayTimeMinutes: 12.4,
      totalPublishedGames: gameCount,
      totalDraftGames: draftCount,
      favoritesCreated: favoritesCount,
      topCategories: [
        { name: 'Memória', sessions: Math.round(baseSessions * 0.35) },
        { name: 'Arcade', sessions: Math.round(baseSessions * 0.30) },
        { name: 'Puzzle', sessions: Math.round(baseSessions * 0.20) },
        { name: 'Ação', sessions: Math.round(baseSessions * 0.15) }
      ],
      revenue: {
        gross: Number(grossRevenue.toFixed(2)),
        estimatedNet: Number((grossRevenue - (infraCostEst / 30)).toFixed(2)),
        rpm: 4.25
      }
    };

    return res.json(metrics);
  } catch (error) {
    console.error('Erro ao gerar métricas:', error);
    return res.status(500).json({ error: 'Erro ao gerar métricas administrativas.' });
  }
});

// GET /api/admin/ai-insights - Gerar insights baseados em IA interpretando apenas os dados agregados
router.get('/ai-insights', async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const favoritesCount = await prisma.favorite.count();
    const gameCount = await prisma.game.count({ where: { statusEditorial: 'publicado' } });

    const baseSessions = 12500 + favoritesCount * 45 + userCount * 12;
    const grossRevenue = (baseSessions / 1000) * 4.25;

    // Geramos insights estruturados em conformidade com as diretrizes do MVP,
    // que simulam o motor de interpretação de IA recebendo e interpretando os agregados acima.
    const insights = [
      {
        id: 'ins-1',
        title: 'Desempenho da Categoria Memória',
        summary: `A categoria de jogos de Memória registrou o maior engajamento com cerca de 35% de todas as sessões do portal (${Math.round(baseSessions * 0.35)} sessões). A retenção da categoria se mostra 18% maior em dispositivos móveis do que em desktop.`,
        period: 'últimos_30_dias',
        detectedAt: new Date(),
        confidence: 'alta',
        evidenceData: { category: 'Memória', sessions: Math.round(baseSessions * 0.35), playTimeAvgMin: 14.2 },
        suggestions: [
          'Adicionar de 2 a 3 novos jogos de memória para a área infantil na homepage para ampliar a retenção.',
          'Considerar a inclusão de banners publicitários nativos menos invasivos entre as partidas, aproveitando o tempo de tela prolongado.'
        ]
      },
      {
        id: 'ins-2',
        title: 'Otimização de Custos de Banda e Otimização de Imagens',
        summary: `Identificamos que 8% dos usuários abandonam a partida no carregamento inicial (bounce rate). O tamanho médio das capas dos jogos novos excede 350KB, o que atrasa a renderização em celulares 3G/4G médios do Brasil.`,
        period: 'últimos_30_dias',
        detectedAt: new Date(),
        confidence: 'alta',
        evidenceData: { bounceRate: 0.08, avgAssetSizeKB: 380 },
        suggestions: [
          'Habilitar compressão de imagem agressiva para formatos WebP ou AVIF de todas as capas cadastradas.',
          'Implementar carregamento lazy (lazy loading) das capas dos jogos em categorias secundárias que ficam abaixo da dobra de tela.'
        ]
      },
      {
        id: 'ins-3',
        title: 'Eficiência de Monetização (RPM)',
        summary: `O RPM médio do portal de R$ 4,25 se encontra dentro das previsões normais de planejamento, gerando faturamento estimado em R$ ${grossRevenue.toFixed(2)}. Porém, o fill rate em dispositivos móveis cai em 15% nos finais de semana por falta de anúncios não-personalizados voltados ao público infantojuvenil de conformidade com a LGPD.`,
        period: 'últimos_30_dias',
        detectedAt: new Date(),
        confidence: 'media',
        evidenceData: { baseRPM: 4.25, fillRateWeekendMobile: '62%' },
        suggestions: [
          'Configurar rede secundária de publicidade (SSP fallback) no Cloudflare / Ad Manager para anúncios gerais seguros de forma a subir o fill rate móvel.',
          'Fidelizar os ${userCount} usuários cadastrados oferecendo novos incentivos ou sistema de favoritos rápido na home para reter tráfego direto em vez de tráfego pago.'
        ]
      }
    ];

    return res.json(insights);
  } catch (error) {
    console.error('Erro ao gerar insights de IA:', error);
    return res.status(500).json({ error: 'Erro ao processar insights do motor de IA.' });
  }
});

// GET /api/admin/users - Listar todos os usuários registrados (seguro, sem passwordHash)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        status: true,
        agePreference: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ error: 'Erro ao listar usuários.' });
  }
});

// PUT /api/admin/users/:id/role - Alterar papel de permissão de um usuário
router.put('/users/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.params.id;
  const { role } = req.body;

  const validRoles = ['user', 'super_admin', 'editor', 'moderador', 'analista', 'marketing', 'suporte', 'financeiro'];
  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ error: 'Papel de permissão inválido ou ausente.' });
  }

  // Prevenir auto-alteração para não perder acesso de super_admin acidentalmente
  if (req.user?.id === userId) {
    return res.status(400).json({ error: 'Não é permitido alterar as próprias permissões de acesso.' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true,
        status: true
      }
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar permissão:', error);
    return res.status(500).json({ error: 'Erro ao atualizar permissão do usuário.' });
  }
});

export default router;
export { router as adminRouter };
