"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./middleware/auth");
const auth_2 = require("./routes/auth");
const games_1 = require("./routes/games");
const admin_1 = require("./routes/admin");
const analytics_1 = require("./routes/analytics");
// Carregar variáveis de ambiente
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Configurar CORS para permitir acessos locais do portal e do admin
app.use((0, cors_1.default)({
    origin: '*', // Em produção, restringir para os domínios reais
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
// Injetar middleware global de autenticação
app.use(auth_1.authMiddleware);
// Rota de Health Check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date(),
        service: 'Portal de Jogos API',
        version: '1.0.0'
    });
});
// Registrar rotas da API
app.use('/api/auth', auth_2.authRouter);
app.use('/api/games', games_1.gamesRouter);
app.use('/api/admin', admin_1.adminRouter);
app.use('/api/analytics', analytics_1.analyticsRouter);
// Handler global de erros
app.use((err, req, res, next) => {
    console.error('Erro global não tratado:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor da API rodando com sucesso em http://localhost:${PORT}`);
    console.log(`   Health check disponível em http://localhost:${PORT}/health`);
});
//# sourceMappingURL=index.js.map