"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../prisma");
const router = (0, express_1.Router)();
exports.analyticsRouter = router;
// POST /api/analytics/event - Ingerir um evento de analítica minimizado
router.post('/event', async (req, res) => {
    const { eventType, sessionId, userId, deviceType, browser, consentGiven, gameId, gameSlug, durationSeconds, placementId, adType, campaignId } = req.body;
    if (!eventType || !sessionId || !deviceType || !browser) {
        return res.status(400).json({ error: 'Campos essenciais do evento ausentes.' });
    }
    try {
        // Se o consentimento não for dado, podemos registrar de forma anônima ou não registrar.
        // De acordo com LGPD / ANPD, se não houver consentimento, não guardamos identificadores persistentes.
        const event = await prisma_1.prisma.analyticsEvent.create({
            data: {
                eventType,
                sessionId: consentGiven ? sessionId : 'anonymous',
                userId: consentGiven ? (userId || null) : null,
                deviceType,
                browser,
                consentGiven: consentGiven ?? false,
                gameId: gameId || null,
                gameSlug: gameSlug || null,
                durationSeconds: durationSeconds ? Number(durationSeconds) : null,
                placementId: placementId || null,
                adType: adType || null,
                campaignId: campaignId || null
            }
        });
        return res.status(201).json({ success: true, eventId: event.id });
    }
    catch (error) {
        console.error('Erro ao registrar evento analytics:', error);
        // Retornamos 201 de qualquer forma para o frontend não quebrar por causa de analytics,
        // mas logamos internamente para diagnóstico.
        return res.status(201).json({ success: true, note: 'Gravado com degradação' });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.js.map