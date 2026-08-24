import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authMiddleware } from './middleware/auth';
import { authRouter } from './routes/auth';
import { gamesRouter } from './routes/games';
import { adminRouter } from './routes/admin';
import { analyticsRouter } from './routes/analytics';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Configurar CORS para permitir acessos locais do portal e do admin
app.use(cors({
  origin: '*', // Em produção, restringir para os domínios reais
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Injetar middleware global de autenticação
app.use(authMiddleware);

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
app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/analytics', analyticsRouter);

// Handler global de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro global não tratado:', err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor da API rodando com sucesso em http://localhost:${PORT}`);
  console.log(`   Health check disponível em http://localhost:${PORT}/health`);
});
