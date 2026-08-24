"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.authRouter = router;
// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, password, agePreference } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e senha são obrigatórios.' });
    }
    if (username.length < 3) {
        return res.status(400).json({ error: 'O username deve ter pelo menos 3 caracteres.' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
    }
    try {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { username }
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Este nome de usuário já está em uso.' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // Primeiro usuário se torna super_admin automaticamente para testes do MVP
        const userCount = await prisma_1.prisma.user.count();
        const role = userCount === 0 ? 'super_admin' : 'user';
        const newUser = await prisma_1.prisma.user.create({
            data: {
                username,
                passwordHash,
                role,
                status: 'ativo',
                agePreference: agePreference || 'sem_preferencia'
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, username: newUser.username, role: newUser.role }, auth_1.JWT_SECRET, { expiresIn: '7d' });
        const userDto = {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
            status: newUser.status,
            agePreference: newUser.agePreference,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt
        };
        return res.status(201).json({ user: userDto, token });
    }
    catch (error) {
        console.error('Erro no registro:', error);
        return res.status(500).json({ error: 'Erro interno ao processar o registro.' });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username e senha são obrigatórios.' });
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { username }
        });
        if (!user) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
        }
        if (user.status === 'suspenso') {
            return res.status(403).json({ error: 'Esta conta foi suspensa temporariamente.' });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username, role: user.role }, auth_1.JWT_SECRET, { expiresIn: '7d' });
        const userDto = {
            id: user.id,
            username: user.username,
            role: user.role,
            status: user.status,
            agePreference: user.agePreference,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        return res.json({ user: userDto, token });
    }
    catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno ao processar o login.' });
    }
});
// GET /api/auth/me
router.get('/me', auth_1.requireAuth, async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Não autenticado.' });
    }
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: req.user.id }
        });
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        const userDto = {
            id: user.id,
            username: user.username,
            role: user.role,
            status: user.status,
            agePreference: user.agePreference,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        return res.json({ user: userDto });
    }
    catch (error) {
        console.error('Erro no perfil:', error);
        return res.status(500).json({ error: 'Erro interno ao recuperar perfil.' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map