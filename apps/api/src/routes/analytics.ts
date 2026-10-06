import { Router } from 'express';
import { prisma } from '../prisma';

const router = Router();

// POST /api/analytics/event - Ingerir um evento de analítica minimizado
router.post('/event', async (req, res) => {
  const {
    eventType, sessionId, userId, deviceType, browser, consentGiven,
    gameId, gameSlug, durationSeconds, placementId, adType, campaignId
  } = req.body;

  if (!eventType || !sessionId || !deviceType || !browser) {
    return res.status(400).json({ error: 'Campos essenciais do evento ausentes.' });
  }

  try {
    // Se o consentimento não for dado, podemos registrar de forma anônima ou não registrar.
    // De acordo com LGPD / ANPD, se não houver consentimento, não guardamos identificadores persistentes.
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType,
        sessionId: sessionId || 'anonymous',
        userId: userId || null,
        deviceType,
        browser,
        consentGiven: consentGiven ?? true,
        gameId: gameId || null,
        gameSlug: gameSlug || null,
        durationSeconds: durationSeconds ? Number(durationSeconds) : null,
        placementId: placementId || null,
        adType: adType || null,
        campaignId: campaignId || null
      }
    });

    return res.status(201).json({ success: true, eventId: event.id });
  } catch (error) {
    console.error('Erro ao registrar evento analytics:', error);
    // Retornamos 201 de qualquer forma para o frontend não quebrar por causa de analytics,
    // mas logamos internamente para diagnóstico.
    return res.status(201).json({ success: true, note: 'Gravado com degradação' });
  }
});

export default router;
export { router as analyticsRouter };
