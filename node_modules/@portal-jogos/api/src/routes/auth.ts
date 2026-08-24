import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { AuthenticatedRequest, requireAuth, JWT_SECRET } from '../middleware/auth';

const router = Router();

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
    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Este nome de usuário já está em uso.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Primeiro usuário se torna super_admin automaticamente para testes do MVP
    const userCount = await prisma.user.count();
    const role = userCount === 0 ? 'super_admin' : 'user';

    const newUser = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role,
        status: 'ativo',
        agePreference: agePreference || 'sem_preferencia'
      }
    });

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
  } catch (error) {
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
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    if (user.status === 'suspenso') {
      return res.status(403).json({ error: 'Esta conta foi suspensa temporariamente.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ error: 'Erro interno ao processar o login.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  try {
    const user = await prisma.user.findUnique({
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
  } catch (error) {
    console.error('Erro no perfil:', error);
    return res.status(500).json({ error: 'Erro interno ao recuperar perfil.' });
  }
});

export default router;
export { router as authRouter };
