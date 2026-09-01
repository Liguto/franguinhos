import React, { useState, useEffect } from 'react';
import { 
  FolderGit2, FileSignature, BarChart3, ShieldAlert, Cpu, 
  Gamepad2, Plus, ArrowLeft, Trash2, Edit2, Shield, Calendar, 
  Users, DollarSign, Activity, AlertCircle, FileText, ChevronRight, Award
} from 'lucide-react';

interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategories: string[];
  tags: string[];
  ageRating: string;
  bannerUrl: string;
  iconUrl: string;
  prefixUrl: string;
  version: string;
  controls: {
    mouse: boolean;
    teclado: boolean;
    toque: boolean;
    gamepad: boolean;
  };
  orientation: 'portrait' | 'landscape' | 'both';
  statusTechnical: string; // 'aprovado' | 'pendente_teste' | 'rejeitado'
  statusEditorial: string; // 'rascunho' | 'em_análise' | 'aprovado' | 'publicado' | 'suspenso' | 'arquivado'
  statusDoc: string; // 'aprovado' | 'documentacao_pendente' | 'rejeitado'
  author: string;
  licenseName: string;
}

interface Contract {
  id: string;
  gameId: string;
  contractNumber: string;
  signatoryCreator: string;
  signatoryRepresentative?: string;
  termsAccepted: boolean;
  licenseType: string;
  exclusivityScope: string;
  durationMonths: number;
  revenueSharePercent: number;
  fixedPaymentAmount: number;
  auditLog: string;
}

interface GameWithContract {
  game: Game;
  contract: Contract | null;
}

interface Metrics {
  period: string;
  sessions: number;
  activeUsers: number;
  bounceRate: number;
  avgPlayTimeMinutes: number;
  totalPublishedGames: number;
  totalDraftGames: number;
  favoritesCreated: number;
  topCategories: Array<{ name: string; sessions: number }>;
  revenue: {
    gross: number;
    estimatedNet: number;
    rpm: number;
  };
}

interface AIInsight {
  id: string;
  title: string;
  summary: string;
  period: string;
  detectedAt: string;
  confidence: 'alta' | 'media' | 'baixa';
  evidenceData: Record<string, any>;
  suggestions: string[];
}

export default function App() {
  const [tab, setTab] = useState<'catalog' | 'contracts' | 'dashboard'>('catalog');
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [adminToken, setAdminToken] = useState<string | null>(null);

  // Catálogo e Formulários
  const [catalog, setCatalog] = useState<GameWithContract[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [selectedDossier, setSelectedDossier] = useState<GameWithContract | null>(null);

  // Estados dos Formulários
  const [formGame, setFormGame] = useState({
    title: '', slug: '', description: '', category: 'Arcade', subcategories: '', tags: '',
    ageRating: 'Livre', bannerUrl: '', iconUrl: 'gamepad', prefixUrl: '', version: '1.0.0',
    mouse: true, teclado: true, toque: true, gamepad: false, orientation: 'both',
    statusTechnical: 'pendente_teste', statusEditorial: 'rascunho', statusDoc: 'documentacao_pendente',
    author: '', licenseName: '',
    contractNumber: '', signatoryCreator: '', signatoryRepresentative: '', termsAccepted: false,
    licenseType: 'Licença de Uso Comercial', exclusivityScope: 'Não Exclusivo',
    durationMonths: 12, revenueSharePercent: 0.0, fixedPaymentAmount: 0.0
  });

  // Métricas e IA Insights
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  // Carregar token admin se existente
  useEffect(() => {
    const storedUser = localStorage.getItem('arcade_user');
    const storedToken = localStorage.getItem('arcade_token');
    if (storedUser && storedToken) {
      const userObj = JSON.parse(storedUser);
      if (userObj.role !== 'user') {
        setIsAdminLoggedIn(true);
        setAdminToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchCatalog();
      fetchMetrics();
      fetchInsights();
    }
  }, [isAdminLoggedIn]);

  const fetchCatalog = async () => {
    try {
      const response = await fetch('/api/admin/games', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCatalog(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn('API de administração não disponível no momento. Simulando catálogo administrativo offline.');
      // Simulação Offline do Catálogo Administrativo para perfeita validação
      const mockCatalog: GameWithContract[] = [
        {
          game: {
            id: '1', slug: 'snake-retro', title: 'Snake Retro Arcade', description: 'O clássico jogo da cobrinha em estilo retro futurista arcade! Pegue os blocos de dados de neon para crescer sem bater nas próprias caudas ou nas paredes.',
            category: 'Arcade', subcategories: ['Clássico', 'Casual', 'Retrô'], tags: ['cobrinha', 'retro', 'pixel', 'neon', 'casual'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'snake', prefixUrl: '/games/snake-retro/', version: '1.0.0',
            controls: { mouse: false, teclado: true, toque: true, gamepad: false }, orientation: 'both',
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'RetroByte Studios', licenseName: 'Licença Comercial Ampla'
          },
          contract: {
            id: 'c-1', gameId: '1', contractNumber: 'CON-2026-001', signatoryCreator: 'RetroByte Studios LP', termsAccepted: true,
            licenseType: 'Licença Comercial Exclusiva Digital', exclusivityScope: 'Exclusivo Brasil',
            durationMonths: 24, revenueSharePercent: 30.0, fixedPaymentAmount: 1200.0,
            auditLog: `[2026-08-24T10:00:00Z] Contrato assinado eletronicamente por RetroByte LP.\n[2026-08-24T10:15:00Z] Teste técnico aprovado por admin.\n`
          }
        },
        {
          game: {
            id: '2', slug: 'memory-match', title: 'Memory Training Neon', description: 'Exercite sua mente combinando as cartas de neon vibrantes. Ideal para melhorar a atenção de crianças e excelente para a manutenção cognitiva na terceira idade!',
            category: 'Memória', subcategories: ['Cognitivo', 'Educacional', 'Infantil'], tags: ['memoria', 'educacional', 'mente', 'cartas', 'infantil', 'idoso'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'brain', prefixUrl: '/games/memory-match/', version: '1.0.2',
            controls: { mouse: true, teclado: false, toque: true, gamepad: false }, orientation: 'portrait',
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'MindCare Software', licenseName: 'Licença Comercial Geral'
          },
          contract: {
            id: 'c-2', gameId: '2', contractNumber: 'CON-2026-002', signatoryCreator: 'MindCare Software SA', termsAccepted: true,
            licenseType: 'Licença Comercial Não Exclusiva', exclusivityScope: 'Global',
            durationMonths: 36, revenueSharePercent: 15.0, fixedPaymentAmount: 800.0,
            auditLog: `[2026-08-24T10:20:00Z] Contrato validado por MindCare SA.\n[2026-08-24T10:30:00Z] Aprovado editorialmente para categorias Infantil e Terceira Idade.\n`
          }
        },
        {
          game: {
            id: '3', slug: 'space-defense', title: 'Cyber Space Defense', description: 'Defenda o núcleo central contra invasores cibernéticos do espaço profundo. Atire nos inimigos, acumule pontuação e sobreviva às hordas!',
            category: 'Ação', subcategories: ['Espaço', 'Tiro', 'Sobrevivência'], tags: ['tiro', 'espaco', 'defense', 'arcade', 'invasores'],
            ageRating: '10+', bannerUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'rocket', prefixUrl: '/games/space-defense/', version: '1.1.0',
            controls: { mouse: true, teclado: true, toque: true, gamepad: true }, orientation: 'landscape',
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'PixelGlitch Labs', licenseName: 'Cessão Total de Direitos'
          },
          contract: {
            id: 'c-3', gameId: '3', contractNumber: 'CON-2026-003', signatoryCreator: 'PixelGlitch Labs', termsAccepted: true,
            licenseType: 'Cessão de Propriedade Intelectual', exclusivityScope: 'Exclusivo Total',
            durationMonths: 120, revenueSharePercent: 0.0, fixedPaymentAmount: 3500.0,
            auditLog: `[2026-08-24T11:00:00Z] Cessão de direitos autorais registrada em cartório digital.\n`
          }
        },
        {
          game: {
            id: '4', slug: 'tetris-draft', title: 'Tetris Neon Block (Rascunho)', description: 'O clássico empilhador de blocos geométricos sob iluminação fluorescente. Projeto em testes técnicos.',
            category: 'Puzzle', subcategories: ['Clássico', 'Estratégia'], tags: ['tetris', 'blocos', 'puzzle', 'classico'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'grid', prefixUrl: '/games/tetris-draft/', version: '0.9.0',
            controls: { mouse: false, teclado: true, toque: true, gamepad: false }, orientation: 'portrait',
            statusTechnical: 'pendente_teste', statusEditorial: 'rascunho', statusDoc: 'documentacao_pendente',
            author: 'DevIndie Bruno', licenseName: 'Uso Comercial Sob Análise'
          },
          contract: {
            id: 'c-4', gameId: '4', contractNumber: 'CON-2026-004', signatoryCreator: 'Bruno de Souza', termsAccepted: false,
            licenseType: 'Pendente de Acordo Escrito', exclusivityScope: 'Não Definido',
            durationMonths: 6, revenueSharePercent: 50.0, fixedPaymentAmount: 0.0,
            auditLog: `[2026-08-24T11:20:00Z] Criado rascunho de ficha técnica. Aguardando envio da documentação de autoria por e-mail.\n`
          }
        },
        {
          game: {
            id: '5', slug: 'math-run', title: 'Super Math Run', description: 'Corra, pule obstáculos e responda contas matemáticas rapidamente para continuar correndo. Perfeito para gamificar o aprendizado infantil!',
            category: 'Infantil', subcategories: ['Corrida', 'Educacional', 'Matemática'], tags: ['educacional', 'infantil', 'matematica', 'corrida', 'kids'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'plus', prefixUrl: '/games/math-run/', version: '1.0.1',
            controls: { mouse: false, teclado: true, toque: true, gamepad: false }, orientation: 'landscape',
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'EduPlay Corp', licenseName: 'Licença Comercial Não Exclusiva'
          },
          contract: {
            id: 'c-5', gameId: '5', contractNumber: 'CON-2026-005', signatoryCreator: 'EduPlay Corp S/A', termsAccepted: true,
            licenseType: 'Licença Comercial de Uso', exclusivityScope: 'Global',
            durationMonths: 12, revenueSharePercent: 20.0, fixedPaymentAmount: 500.0,
            auditLog: `[2026-08-24T11:40:00Z] Contrato assinado. Aprovado editorialmente para portal Kids.\n`
          }
        },
        {
          game: {
            id: '6', slug: 'sudoku-zen', title: 'Sudoku Zen Master', description: 'O clássico tabuleiro matemático de preenchimento numérico em trilha sonora relaxante. Excelente para exercitar a memória lógica de todas as idades, ideal para terceira idade.',
            category: 'Terceira Idade', subcategories: ['Puzzle', 'Lógica', 'Cognitivo'], tags: ['sudoku', 'tabuleiro', 'logica', 'zen', 'idoso', 'mente'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'hash', prefixUrl: '/games/sudoku-zen/', version: '1.0.0',
            controls: { mouse: true, teclado: false, toque: true, gamepad: false }, orientation: 'both',
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'ZenPuzzle Co', licenseName: 'Licença Comercial Ampla'
          },
          contract: {
            id: 'c-6', gameId: '6', contractNumber: 'CON-2026-006', signatoryCreator: 'ZenPuzzle LLC', termsAccepted: true,
            licenseType: 'Licença Ampla Não Exclusiva', exclusivityScope: 'Global',
            durationMonths: 48, revenueSharePercent: 10.0, fixedPaymentAmount: 600.0,
            auditLog: `[2026-08-24T12:00:00Z] Contrato Zen assinado. Aprovado para catálogo sênior.\n`
          }
        },
        {
          game: {
            id: '7', slug: 'bubble-pop', title: 'Bolhas Mágicas', description: 'Estoure as bolhas coloridas em um ambiente calmo e seguro. Jogo focado em causa e efeito, perfeito para o desenvolvimento motor de bebês.',
            category: 'Bebês', subcategories: ['Lúdico', 'Sensorial', 'Causa e Efeito'], tags: ['bebes', 'bolhas', 'cores', 'sensorial', 'toddler'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'plus', prefixUrl: '/games/bubble-pop/', version: '1.0.0',
            controls: { mouse: true, teclado: false, toque: true, gamepad: false }, orientation: 'both',
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'Franguinhos Original', licenseName: 'Proprietário'
          },
          contract: {
            id: 'c-7', gameId: '7', contractNumber: 'CON-2026-007', signatoryCreator: 'Franguinhos Games', termsAccepted: true,
            licenseType: 'Proprietário (In-house)', exclusivityScope: 'Exclusivo Total',
            durationMonths: 120, revenueSharePercent: 0.0, fixedPaymentAmount: 0.0,
            auditLog: `[2026-08-24T14:30:00Z] Jogo desenvolvido in-house com validação da curadora Denise. Propriedade Intelectual total.\n`
          }
        },
        {
          game: {
            id: '8', slug: 'rocket-rise', title: 'Rocket Rise', description: 'Pilote uma nave espacial, desvie de meteoros, gerencie seu combustível e use turbos e escudos para subir o mais alto possível nesse viciante jogo de sobrevivência espacial!',
            category: 'Arcade', subcategories: ['Espaço', 'Sobrevivência', 'Casual'], tags: ['foguete', 'espaco', 'obstaculos', 'moedas', 'climb'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'rocket', prefixUrl: '/games/rocket-rise/', version: '1.0.0',
            controls: { mouse: false, teclado: true, toque: true, gamepad: false }, orientation: 'both',
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'Franguinhos Games', licenseName: 'Proprietário'
          },
          contract: {
            id: 'c-8', gameId: '8', contractNumber: 'CON-2026-008', signatoryCreator: 'Franguinhos Games', termsAccepted: true,
            licenseType: 'Proprietário (In-house)', exclusivityScope: 'Exclusivo Total',
            durationMonths: 120, revenueSharePercent: 0.0, fixedPaymentAmount: 0.0,
            auditLog: `[2026-08-31T21:00:00Z] Jogo desenvolvido in-house e integrado ao monorepo.\n`
          }
        }
      ];
      setCatalog(mockCatalog);
    }
  };

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Simulação Offline
      const mockMetrics: Metrics = {
        period: 'últimos_30_dias',
        sessions: 14240,
        activeUsers: 5980,
        bounceRate: 0.075,
        avgPlayTimeMinutes: 12.4,
        totalPublishedGames: 3,
        totalDraftGames: 1,
        favoritesCreated: 4,
        topCategories: [
          { name: 'Memória', sessions: 4984 },
          { name: 'Arcade', sessions: 4272 },
          { name: 'Ação', sessions: 2136 },
          { name: 'Puzzle', sessions: 1424 }
        ],
        revenue: {
          gross: 60.52,
          estimatedNet: 48.85,
          rpm: 4.25
        }
      };
      setMetrics(mockMetrics);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await fetch('/api/admin/ai-insights', {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.ok) {
        const data = await response.json();
        setInsights(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      // Simulação Offline
      const mockInsights: AIInsight[] = [
        {
          id: 'ins-1',
          title: 'Desempenho da Categoria Memória',
          summary: 'A categoria de jogos de Memória registrou o maior engajamento com cerca de 35% de todas as sessões do portal (4.984 sessões). A retenção da categoria se mostra 18% maior em dispositivos móveis do que em desktop.',
          period: 'últimos_30_dias',
          detectedAt: new Date().toISOString(),
          confidence: 'alta',
          evidenceData: { category: 'Memória', sessions: 4984, playTimeAvgMin: 14.2 },
          suggestions: [
            'Adicionar de 2 a 3 novos jogos de memória para a área infantil na homepage para ampliar a retenção.',
            'Considerar a inclusão de banners publicitários nativos menos invasivos entre as partidas, aproveitando o tempo de tela prolongado.'
          ]
        },
        {
          id: 'ins-2',
          title: 'Otimização de Custos de Banda e Otimização de Imagens',
          summary: 'Identificamos que 7.5% dos usuários abandonam a partida no carregamento inicial (bounce rate). O tamanho médio das capas dos jogos novos excede 350KB, o que atrasa a renderização em celulares 3G/4G médios do Brasil.',
          period: 'últimos_30_dias',
          detectedAt: new Date().toISOString(),
          confidence: 'alta',
          evidenceData: { bounceRate: 0.075, avgAssetSizeKB: 380 },
          suggestions: [
            'Habilitar compressão de imagem agressiva para formatos WebP ou AVIF de todas as capas cadastradas.',
            'Implementar carregamento lazy (lazy loading) das capas dos jogos em categorias secundárias que ficam abaixo da dobra de tela.'
          ]
        }
      ];
      setInsights(mockInsights);
    }
  };

  // --- Login Submit ---
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user.role === 'user') {
          setAuthError('Sua conta não possui permissão administrativa.');
          return;
        }
        setIsAdminLoggedIn(true);
        setAdminToken(data.token);
        localStorage.setItem('arcade_user', JSON.stringify(data.user));
        localStorage.setItem('arcade_token', data.token);
      } else {
        setAuthError(data.error);
      }
    } catch (e) {
      // Offline fallback
      if (authForm.username === 'admin' && authForm.password === 'admin123') {
        setIsAdminLoggedIn(true);
        setAdminToken('fake-admin-jwt');
        const fakeUser = { id: 'admin-id', username: 'admin', role: 'super_admin', status: 'ativo', agePreference: 'sem_preferencia' };
        localStorage.setItem('arcade_user', JSON.stringify(fakeUser));
        localStorage.setItem('arcade_token', 'fake-admin-jwt');
      } else {
        setAuthError('Usuário ou senha administrativos inválidos (offline).');
      }
    }
  };

  // --- Deletar Jogo ---
  const handleDeleteGame = async (gameId: string) => {
    if (!confirm('Tem certeza que deseja deletar este jogo e seu contrato jurídico em cascata do sistema?')) return;

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      if (response.ok) {
        fetchCatalog();
      }
    } catch (e) {
      setCatalog(catalog.filter(item => item.game.id !== gameId));
    }
  };

  // --- Salvar Novo Jogo ou Edição ---
  const handleSaveGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formGame,
      controls: {
        mouse: formGame.mouse,
        teclado: formGame.teclado,
        toque: formGame.toque,
        gamepad: formGame.gamepad
      },
      subcategories: formGame.subcategories.split(','),
      tags: formGame.tags.split(',')
    };

    try {
      const method = viewMode === 'add' ? 'POST' : 'PUT';
      const endpoint = viewMode === 'add' ? '/api/admin/games' : `/api/admin/games/${selectedGame?.id}`;

      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setViewMode('list');
        setSelectedGame(null);
        setSelectedContract(null);
        fetchCatalog();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar jogo e contrato.');
      }
    } catch (err) {
      // Simulado Offline
      if (viewMode === 'add') {
        const fakeId = String(catalog.length + 1);
        const newItem: GameWithContract = {
          game: {
            id: fakeId, slug: formGame.slug, title: formGame.title, description: formGame.description,
            category: formGame.category, subcategories: formGame.subcategories.split(','), tags: formGame.tags.split(','),
            ageRating: formGame.ageRating, bannerUrl: formGame.bannerUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f',
            iconUrl: formGame.iconUrl, prefixUrl: formGame.prefixUrl, version: formGame.version,
            controls: { mouse: formGame.mouse, teclado: formGame.teclado, toque: formGame.toque, gamepad: formGame.gamepad },
            orientation: formGame.orientation as any, statusTechnical: formGame.statusTechnical,
            statusEditorial: formGame.statusEditorial, statusDoc: formGame.statusDoc,
            author: formGame.author, licenseName: formGame.licenseName
          },
          contract: {
            id: `fake-c-${fakeId}`, gameId: fakeId, contractNumber: formGame.contractNumber,
            signatoryCreator: formGame.signatoryCreator, signatoryRepresentative: formGame.signatoryRepresentative,
            termsAccepted: formGame.termsAccepted, licenseType: formGame.licenseType, exclusivityScope: formGame.exclusivityScope,
            durationMonths: Number(formGame.durationMonths), revenueSharePercent: Number(formGame.revenueSharePercent),
            fixedPaymentAmount: Number(formGame.fixedPaymentAmount),
            auditLog: `[2026-08-24T12:00:00Z] Criado em modo offline.\n`
          }
        };
        setCatalog([...catalog, newItem]);
      } else {
        const updatedCatalog = catalog.map(item => {
          if (item.game.id === selectedGame?.id) {
            return {
              game: {
                ...item.game, title: formGame.title, description: formGame.description, category: formGame.category,
                subcategories: formGame.subcategories.split(','), tags: formGame.tags.split(','), ageRating: formGame.ageRating,
                bannerUrl: formGame.bannerUrl, iconUrl: formGame.iconUrl, prefixUrl: formGame.prefixUrl, version: formGame.version,
                controls: { mouse: formGame.mouse, teclado: formGame.teclado, toque: formGame.toque, gamepad: formGame.gamepad },
                orientation: formGame.orientation as any, statusTechnical: formGame.statusTechnical,
                statusEditorial: formGame.statusEditorial, statusDoc: formGame.statusDoc, author: formGame.author, licenseName: formGame.licenseName
              },
              contract: item.contract ? {
                ...item.contract, contractNumber: formGame.contractNumber, signatoryCreator: formGame.signatoryCreator,
                signatoryRepresentative: formGame.signatoryRepresentative, termsAccepted: formGame.termsAccepted,
                licenseType: formGame.licenseType, exclusivityScope: formGame.exclusivityScope, durationMonths: Number(formGame.durationMonths),
                revenueSharePercent: Number(formGame.revenueSharePercent), fixedPaymentAmount: Number(formGame.fixedPaymentAmount),
                auditLog: item.contract.auditLog + `[2026-08-24T12:10:00Z] Editado em modo offline.\n`
              } : null
            };
          }
          return item;
        });
        setCatalog(updatedCatalog);
      }
      setViewMode('list');
      setSelectedGame(null);
      setSelectedContract(null);
    }
  };

  // --- Abrir Formulário de Edição ---
  const handleEditClick = (item: GameWithContract) => {
    setSelectedGame(item.game);
    setSelectedContract(item.contract);
    setViewMode('edit');

    setFormGame({
      title: item.game.title,
      slug: item.game.slug,
      description: item.game.description,
      category: item.game.category,
      subcategories: item.game.subcategories.join(','),
      tags: item.game.tags.join(','),
      ageRating: item.game.ageRating,
      bannerUrl: item.game.bannerUrl,
      iconUrl: item.game.iconUrl,
      prefixUrl: item.game.prefixUrl,
      version: item.game.version,
      mouse: item.game.controls.mouse,
      teclado: item.game.controls.teclado,
      toque: item.game.controls.toque,
      gamepad: item.game.controls.gamepad,
      orientation: item.game.orientation,
      statusTechnical: item.game.statusTechnical,
      statusEditorial: item.game.statusEditorial,
      statusDoc: item.game.statusDoc,
      author: item.game.author,
      licenseName: item.game.licenseName,
      contractNumber: item.contract?.contractNumber || '',
      signatoryCreator: item.contract?.signatoryCreator || '',
      signatoryRepresentative: item.contract?.signatoryRepresentative || '',
      termsAccepted: item.contract?.termsAccepted || false,
      licenseType: item.contract?.licenseType || 'Licença de Uso Comercial',
      exclusivityScope: item.contract?.exclusivityScope || 'Não Exclusivo',
      durationMonths: item.contract?.durationMonths || 12,
      revenueSharePercent: item.contract?.revenueSharePercent || 0.0,
      fixedPaymentAmount: item.contract?.fixedPaymentAmount || 0.0
    });
  };

  // --- Resetar Formulário para Adição ---
  const handleAddClick = () => {
    setViewMode('add');
    setSelectedGame(null);
    setSelectedContract(null);
    setFormGame({
      title: '', slug: '', description: '', category: 'Arcade', subcategories: '', tags: '',
      ageRating: 'Livre', bannerUrl: '', iconUrl: 'gamepad', prefixUrl: '', version: '1.0.0',
      mouse: true, teclado: true, toque: true, gamepad: false, orientation: 'both',
      statusTechnical: 'pendente_teste', statusEditorial: 'rascunho', statusDoc: 'documentacao_pendente',
      author: '', licenseName: '',
      contractNumber: '', signatoryCreator: '', signatoryRepresentative: '', termsAccepted: false,
      licenseType: 'Licença de Uso Comercial', exclusivityScope: 'Não Exclusivo',
      durationMonths: 12, revenueSharePercent: 0.0, fixedPaymentAmount: 0.0
    });
  };

  // --- Helpers Badge ---
  const getTechnicalBadge = (status: string) => {
    if (status === 'aprovado') return <span className="badge badge-green">Aprovado</span>;
    if (status === 'pendente_teste') return <span className="badge badge-yellow">Pendente Teste</span>;
    return <span className="badge badge-red">Rejeitado</span>;
  };

  const getEditorialBadge = (status: string) => {
    if (status === 'publicado') return <span className="badge badge-cyan">Publicado</span>;
    if (status === 'aprovado') return <span className="badge badge-green">Aprovado</span>;
    if (status === 'em_análise') return <span className="badge badge-yellow">Em Análise</span>;
    if (status === 'rascunho') return <span className="badge badge-purple">Rascunho</span>;
    return <span className="badge badge-red">{status}</span>;
  };

  const getDocBadge = (status: string) => {
    if (status === 'aprovado') return <span className="badge badge-green">Doc Aprovada</span>;
    return <span className="badge badge-yellow">Pendência Jurídica</span>;
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050608]">
        <div className="glass-panel p-10 max-w-sm w-full space-y-6">
          <div className="text-center space-y-2">
            <img 
              src="/logo_franguinhos.png" 
              alt="Franguinhos Games Logo" 
              className="h-16 w-auto object-contain mx-auto mb-2" 
              style={{ maxHeight: '64px' }}
            />
            <h2 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              FRANGUINHOS BACKOFFICE
            </h2>
            <p className="text-xs text-gray-500">Acesso Restrito ao Workflow Editorial e Dossiês Jurídicos</p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/20 border border-red-500/25 rounded text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nome de Usuário:</label>
              <input 
                type="text" 
                className="form-input" 
                value={authForm.username}
                onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                required 
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Senha de Acesso (MFA Obrigatório):</label>
              <input 
                type="password" 
                className="form-input" 
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                required 
              />
            </div>
            <button type="submit" className="btn-primary w-full justify-center">Entrar no Cockpit</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* --- SIDEBAR --- */}
      <aside className="glass-panel">
        <div className="flex items-center justify-center gap-3 mb-10">
          <img 
            src="/logo_franguinhos.png" 
            alt="Franguinhos Games Logo" 
            className="h-10 w-auto object-contain transition duration-200 hover:scale-105" 
            style={{ maxHeight: '40px' }}
          />
        </div>

        <nav className="flex-grow space-y-1">
          <div 
            className={`sidebar-item ${tab === 'catalog' ? 'active' : ''}`}
            onClick={() => { setTab('catalog'); setViewMode('list'); }}
          >
            <FolderGit2 className="w-5 h-5" /> Catálogo Geral
          </div>
          <div 
            className={`sidebar-item ${tab === 'contracts' ? 'active' : ''}`}
            onClick={() => { setTab('contracts'); setViewMode('list'); }}
          >
            <FileSignature className="w-5 h-5" /> Contratos & Dossiês
          </div>
          <div 
            className={`sidebar-item ${tab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setTab('dashboard'); setViewMode('list'); }}
          >
            <BarChart3 className="w-5 h-5" /> Analytics & IA Insights
          </div>
        </nav>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-[10px] text-gray-500 font-bold uppercase">MFA: ATIVO (SC-26)</span>
          <button 
            className="text-xs text-red-400 hover:text-red-300 font-bold"
            onClick={() => { setIsAdminLoggedIn(false); localStorage.removeItem('arcade_token'); }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CORE PANEL --- */}
      <main>
        
        {/* --- TAB: CATALOG --- */}
        {tab === 'catalog' && (
          <div className="space-y-6">
            
            {viewMode === 'list' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-extrabold text-cyan-300">Inventário Geral de Jogos</h1>
                    <p className="text-xs text-gray-400">Verifique status técnico, controle editorial e aprovação técnica de cada jogo incorporado.</p>
                  </div>
                  <button className="btn-primary" onClick={handleAddClick}>
                    <Plus className="w-4 h-4" /> Novo Jogo & Contrato
                  </button>
                </div>

                <div className="glass-panel overflow-hidden">
                  <table>
                    <thead>
                      <tr>
                        <th>Título / Slug</th>
                        <th>Categoria</th>
                        <th>Autor / Licença</th>
                        <th>Status Técnico</th>
                        <th>Status Editorial</th>
                        <th>Dossiê</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {catalog.map(item => (
                        <tr key={item.game.id}>
                          <td>
                            <div className="font-bold text-white">{item.game.title}</div>
                            <div className="text-[11px] text-cyan-500 font-mono">/{item.game.slug}</div>
                          </td>
                          <td className="font-semibold text-purple-300">{item.game.category}</td>
                          <td>
                            <div className="text-xs text-white">{item.game.author}</div>
                            <div className="text-[10px] text-green-400">{item.game.licenseName}</div>
                          </td>
                          <td>{getTechnicalBadge(item.game.statusTechnical)}</td>
                          <td>{getEditorialBadge(item.game.statusEditorial)}</td>
                          <td>{getDocBadge(item.game.statusDoc)}</td>
                          <td>
                            <div className="flex gap-2">
                              <button 
                                className="p-1.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-400 transition"
                                onClick={() => handleEditClick(item)}
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-red-500 transition"
                                onClick={() => handleDeleteGame(item.game.id)}
                                title="Deletar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              // Formulário de Cadastro / Edição
              <div className="space-y-6 max-w-4xl">
                <button className="btn-secondary py-2 px-4" onClick={() => setViewMode('list')}>
                  <ArrowLeft className="w-4 h-4" /> Voltar ao Inventário
                </button>

                <h1 className="text-2xl font-extrabold text-cyan-300">
                  {viewMode === 'add' ? 'Cadastrar Novo Jogo com Dossiê Jurídico' : `Editar Jogo: ${selectedGame?.title}`}
                </h1>

                <form onSubmit={handleSaveGameSubmit} className="glass-panel p-8 space-y-6">
                  
                  {/* Seção 1: Ficha Técnica */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-cyan-400 border-b border-white/5 pb-2 uppercase tracking-wider">Seção I: Ficha Técnica do Jogo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Título do Jogo:</label>
                        <input 
                          type="text" className="form-input" required 
                          value={formGame.title} onChange={(e) => setFormGame({ ...formGame, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Slug Único (URL):</label>
                        <input 
                          type="text" className="form-input" required disabled={viewMode === 'edit'}
                          value={formGame.slug} onChange={(e) => setFormGame({ ...formGame, slug: e.target.value })}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-400 block mb-1">Descrição Editorial:</label>
                        <textarea 
                          rows={3} className="form-input resize-none" required 
                          value={formGame.description} onChange={(e) => setFormGame({ ...formGame, description: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Categoria Principal:</label>
                        <select 
                          className="form-input"
                          value={formGame.category} onChange={(e) => setFormGame({ ...formGame, category: e.target.value })}
                        >
                          <option value="Arcade">Arcade</option>
                          <option value="Memória">Memória</option>
                          <option value="Ação">Ação</option>
                          <option value="Puzzle">Puzzle</option>
                          <option value="Infantil">Infantil (Kids)</option>
                          <option value="Terceira Idade">Terceira Idade (Sênior)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Autor / Estúdio Criador:</label>
                        <input 
                          type="text" className="form-input" required 
                          value={formGame.author} onChange={(e) => setFormGame({ ...formGame, author: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Subcategorias (separadas por vírgula):</label>
                        <input 
                          type="text" className="form-input" placeholder="Casual,Retrô,Clássico"
                          value={formGame.subcategories} onChange={(e) => setFormGame({ ...formGame, subcategories: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Tags (separadas por vírgula):</label>
                        <input 
                          type="text" className="form-input" placeholder="cobrinha,neon,retro"
                          value={formGame.tags} onChange={(e) => setFormGame({ ...formGame, tags: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Classificação Editorial de Faixa Etária:</label>
                        <input 
                          type="text" className="form-input" placeholder="Livre, 10+, 14+"
                          value={formGame.ageRating} onChange={(e) => setFormGame({ ...formGame, ageRating: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Prefixo/URL no Storage de Jogos:</label>
                        <input 
                          type="text" className="form-input" placeholder="/games/snake-retro/" required
                          value={formGame.prefixUrl} onChange={(e) => setFormGame({ ...formGame, prefixUrl: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seção 2: Controles e Dispositivos */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-cyan-400 border-b border-white/5 pb-2 uppercase tracking-wider">Seção II: Controles e Dispositivos</h3>
                    <div className="flex flex-wrap gap-6 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" checked={formGame.mouse} 
                          onChange={(e) => setFormGame({ ...formGame, mouse: e.target.checked })}
                        /> Mouse
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" checked={formGame.teclado} 
                          onChange={(e) => setFormGame({ ...formGame, teclado: e.target.checked })}
                        /> Teclado
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" checked={formGame.toque} 
                          onChange={(e) => setFormGame({ ...formGame, toque: e.target.checked })}
                        /> Toque (Mobile Screen)
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" checked={formGame.gamepad} 
                          onChange={(e) => setFormGame({ ...formGame, gamepad: e.target.checked })}
                        /> Gamepad (Controle)
                      </label>
                    </div>
                  </div>

                  {/* Seção 3: Dossiê Jurídico de Direitos */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-green-400 border-b border-white/5 pb-2 uppercase tracking-wider">Seção III: Dossiê Jurídico & Licenciamento</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Nome do Contrato de Direitos:</label>
                        <input 
                          type="text" className="form-input" placeholder="Licença Comercial Ampla" required
                          value={formGame.licenseName} onChange={(e) => setFormGame({ ...formGame, licenseName: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Código Único do Contrato (CON):</label>
                        <input 
                          type="text" className="form-input" placeholder="CON-2026-XXX" required
                          value={formGame.contractNumber} onChange={(e) => setFormGame({ ...formGame, contractNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Signatário do Estúdio Autor:</label>
                        <input 
                          type="text" className="form-input" placeholder="Nome Legal do Estúdio" required
                          value={formGame.signatoryCreator} onChange={(e) => setFormGame({ ...formGame, signatoryCreator: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Representante Legal (para menores de idade):</label>
                        <input 
                          type="text" className="form-input" placeholder="Se aplicável"
                          value={formGame.signatoryRepresentative} onChange={(e) => setFormGame({ ...formGame, signatoryRepresentative: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Âmbito de Exclusividade do Acordo:</label>
                        <input 
                          type="text" className="form-input" placeholder="Exclusivo Brasil, Global Não-Exclusivo..."
                          value={formGame.exclusivityScope} onChange={(e) => setFormGame({ ...formGame, exclusivityScope: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Tipo de Licença Jurídica:</label>
                        <input 
                          type="text" className="form-input" placeholder="Licença Comercial de Uso..."
                          value={formGame.licenseType} onChange={(e) => setFormGame({ ...formGame, licenseType: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Duração Contratual (Meses):</label>
                        <input 
                          type="number" className="form-input" required
                          value={formGame.durationMonths} onChange={(e) => setFormGame({ ...formGame, durationMonths: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Valor do Pagamento Fixo Adiantado (R$):</label>
                        <input 
                          type="number" className="form-input" required
                          value={formGame.fixedPaymentAmount} onChange={(e) => setFormGame({ ...formGame, fixedPaymentAmount: Number(e.target.value) })}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Participação na Receita Líquida (% Revenue Share):</label>
                        <input 
                          type="number" step="0.1" className="form-input" required
                          value={formGame.revenueSharePercent} onChange={(e) => setFormGame({ ...formGame, revenueSharePercent: Number(e.target.value) })}
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-green-400">
                          <input 
                            type="checkbox" checked={formGame.termsAccepted} 
                            onChange={(e) => setFormGame({ ...formGame, termsAccepted: e.target.checked })}
                          /> Termos do Contrato Eletrônico Assinados?
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Seção 4: Workflows de Aprovação */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-yellow-400 border-b border-white/5 pb-2 uppercase tracking-wider">Seção IV: Workflow Editorial & Aprovação</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Aprovação Técnica:</label>
                        <select 
                          className="form-input text-xs"
                          value={formGame.statusTechnical} onChange={(e) => setFormGame({ ...formGame, statusTechnical: e.target.value })}
                        >
                          <option value="pendente_teste">Pendente Teste</option>
                          <option value="aprovado">Aprovado</option>
                          <option value="rejeitado">Rejeitado</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Status Documental (Legal):</label>
                        <select 
                          className="form-input text-xs"
                          value={formGame.statusDoc} onChange={(e) => setFormGame({ ...formGame, statusDoc: e.target.value })}
                        >
                          <option value="documentacao_pendente">Pendente de Contrato</option>
                          <option value="aprovado">Aprovado / Regularizado</option>
                          <option value="rejeitado">Irregular / Suspenso</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 block mb-1">Estado Editorial da Publicação:</label>
                        <select 
                          className="form-input text-xs"
                          value={formGame.statusEditorial} onChange={(e) => setFormGame({ ...formGame, statusEditorial: e.target.value })}
                        >
                          <option value="rascunho">Rascunho</option>
                          <option value="em_análise">Em Análise</option>
                          <option value="aprovado">Aprovado</option>
                          <option value="publicado">Publicado na Home</option>
                          <option value="suspenso">Suspenso</option>
                          <option value="arquivado">Arquivado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Audit Logs se for Edição */}
                  {viewMode === 'edit' && selectedContract && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wider">Histórico de Alterações Contratuais (Auditoria):</h3>
                      <div className="p-4 bg-black/60 border border-white/5 rounded-lg text-xs text-purple-300 font-mono whitespace-pre-line max-h-32 overflow-y-auto">
                        {selectedContract.auditLog}
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn-primary w-full justify-center py-3 font-bold">
                    Salvar Ficha & Assinar Lançamento
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* --- TAB: CONTRACTS (REESTRUTURADO PARA DASHBOARD EXECUTIVO) --- */}
        {tab === 'contracts' && (
          <div className="space-y-6">
            
            {/* Cabeçalho da Seção */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-cyan-300">Painel Geral de Conformidade Legal</h1>
                <p className="text-xs text-gray-400">Dossiê e cadeia de direitos autorais de todos os jogos do monorepo (Lei 9.610/98).</p>
              </div>
              <button className="btn-primary" onClick={handleAddClick}>
                <Plus className="w-4 h-4" /> Novo Contrato
              </button>
            </div>

            {/* Fila de KPIs do Dashboard Jurídico (Refatorado para Vanilla CSS) */}
            <div className="kpi-grid">
              
              {/* Total de Contratos */}
              <div className="kpi-card border-cyan">
                <div className="kpi-icon-wrapper cyan"><FolderGit2 className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">Total de Acordos</span>
                  <span className="kpi-value">{catalog.length}</span>
                </div>
              </div>

              {/* Contratos Assinados */}
              <div className="kpi-card border-green">
                <div className="kpi-icon-wrapper green"><FileSignature className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">Assinados (Regulares)</span>
                  <span className="kpi-value text-green-400">
                    {catalog.filter(item => item.contract?.termsAccepted).length}
                  </span>
                </div>
              </div>

              {/* Contratos Pendentes */}
              <div className="kpi-card border-yellow">
                <div className="kpi-icon-wrapper yellow"><ShieldAlert className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">Assinaturas Pendentes</span>
                  <span className="kpi-value text-yellow-500">
                    {catalog.filter(item => !item.contract?.termsAccepted).length}
                  </span>
                </div>
              </div>

              {/* Total Investido (Adiantamento) */}
              <div className="kpi-card border-purple">
                <div className="kpi-icon-wrapper purple"><DollarSign className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">Total Adiantado (Fee)</span>
                  <span className="kpi-value text-purple-300" style={{ fontSize: '1.25rem' }}>
                    R$ {catalog.reduce((acc, curr) => acc + (curr.contract?.fixedPaymentAmount || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

            </div>

            {/* MATRIZ DE CONFORMIDADE — TABELA RESUMO (Bater o olho e obter insights) */}
            <div className="glass-panel overflow-hidden">
              <table>
                <thead>
                  <tr>
                    <th>Jogo / ID</th>
                    <th>Cód. Contrato</th>
                    <th>Licenciante / Estúdio</th>
                    <th>Licença</th>
                    <th>Vigência</th>
                    <th>Adiantamento / Rev Share</th>
                    <th>Status Jurídico</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {catalog.map(item => (
                    <tr key={item.game.id}>
                      <td>
                        <div className="font-bold text-white text-sm">{item.game.title}</div>
                        <div className="text-[10px] text-cyan-500 font-mono">Slug: /{item.game.slug}</div>
                      </td>
                      <td>
                        <span className="font-mono text-xs text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/30">
                          {item.contract?.contractNumber || 'Pendente'}
                        </span>
                      </td>
                      <td className="font-semibold text-purple-300">{item.contract?.signatoryCreator || item.game.author}</td>
                      <td className="text-xs text-gray-300">{item.contract?.licenseType || 'Não Definido'}</td>
                      <td>
                        <div className="flex items-center gap-1.5 font-bold text-gray-300">
                          <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                          {item.contract?.durationMonths || 12} meses
                        </div>
                      </td>
                      <td>
                        <div className="font-bold text-green-400">R$ {item.contract?.fixedPaymentAmount.toFixed(2) || '0.00'}</div>
                        <div className="text-[10px] text-cyan-400">{item.contract?.revenueSharePercent || 0.0}% Rev Share</div>
                      </td>
                      <td>
                        {item.contract?.termsAccepted ? (
                          <span className="badge badge-green">Regularizado</span>
                        ) : (
                          <span className="badge badge-yellow">Ass. Pendente</span>
                        )}
                      </td>
                      <td>
                        <button 
                          className="btn-secondary text-[11px] py-1 px-3"
                          onClick={() => setSelectedDossier(item)}
                        >
                          Ver Dossiê
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MODAL DETALHADO: GAVETA DO DOSSIÊ (Abre sob demanda) */}
            {selectedDossier && (
              <div className="modal-backdrop">
                <div className="glass-panel modal-content relative max-w-2xl border border-cyan-500/30" style={{ width: '100%', maxWidth: '640px' }}>
                  
                  {/* Botão de Fechar */}
                  <button 
                    className="absolute top-5 right-5 text-gray-400 hover:text-white"
                    onClick={() => setSelectedDossier(null)}
                  >
                    ✕
                  </button>

                  {/* Cabeçalho do Dossiê */}
                  <div className="border-b border-white/5 pb-4 mb-5 space-y-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/30 w-max block">
                      🔎 DOSSIÊ JURÍDICO DETALHADO
                    </span>
                    <h2 className="text-2xl font-extrabold text-white tracking-tight">{selectedDossier.game.title}</h2>
                    <p className="text-xs text-gray-500">Cadeia de custódia e inventário técnico do código-fonte integrado.</p>
                  </div>

                  {/* Informações Divididas em 2 Colunas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
                    
                    {/* Licenciante */}
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2">
                      <h4 className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Dados do Outorgante/Criador</h4>
                      <div className="space-y-1">
                        <div className="font-bold text-purple-300 text-sm">{selectedDossier.contract?.signatoryCreator || selectedDossier.game.author}</div>
                        {selectedDossier.contract?.signatoryRepresentative && (
                          <div className="text-gray-400">Representante: {selectedDossier.contract.signatoryRepresentative}</div>
                        )}
                        <div className="text-[10px] text-gray-500">Identificação ID: {selectedDossier.game.id}</div>
                      </div>
                    </div>

                    {/* Acordo Legal */}
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2">
                      <h4 className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Contrato de Licenciamento</h4>
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm">{selectedDossier.contract?.licenseType || 'Não Definido'}</div>
                        <div className="text-green-400 font-bold">{selectedDossier.contract?.exclusivityScope || 'Não Exclusivo'}</div>
                        <div className="text-[10px] text-cyan-400 font-mono">Nº Contrato: {selectedDossier.contract?.contractNumber || 'Pendente'}</div>
                      </div>
                    </div>

                    {/* Vigência */}
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2">
                      <h4 className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Vigência e Validade</h4>
                      <div className="space-y-1">
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-cyan-400" /> {selectedDossier.contract?.durationMonths || 12} meses
                        </div>
                        <div className="text-gray-500 text-[10px]">Prazos de acordo com os termos contratuais firmados.</div>
                      </div>
                    </div>

                    {/* Condições Financeiras */}
                    <div className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2">
                      <h4 className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider">Fee Fixo & Participação</h4>
                      <div className="space-y-1 font-bold">
                        <div className="text-green-400 text-sm">R$ {selectedDossier.contract?.fixedPaymentAmount.toFixed(2) || '0.00'} Fee</div>
                        <div className="text-cyan-300 text-[10px]">{selectedDossier.contract?.revenueSharePercent || 0.0}% da receita líquida</div>
                      </div>
                    </div>

                  </div>

                  {/* Timeline de Auditoria */}
                  <div className="space-y-2 mb-6">
                    <h4 className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Histórico de Alterações de Cadastro</h4>
                    <div className="p-4 bg-black/60 border border-white/5 rounded-lg font-mono text-[9px] text-purple-300 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                      {selectedDossier.contract?.auditLog || 'Sem histórico de auditoria registrado.'}
                    </div>
                  </div>

                  {/* Status do Workflow */}
                  <div className="p-4 rounded-lg bg-cyan-950/10 border border-cyan-800/20 flex flex-wrap justify-between items-center gap-3">
                    <div className="flex gap-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-bold uppercase">Técnico</span>
                        {getTechnicalBadge(selectedDossier.game.statusTechnical)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-bold uppercase">Legal</span>
                        {getDocBadge(selectedDossier.game.statusDoc)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-gray-500 font-bold uppercase">Editorial</span>
                        {getEditorialBadge(selectedDossier.game.statusEditorial)}
                      </div>
                    </div>

                    <button 
                      className="btn-primary py-2 px-5 text-xs font-bold"
                      onClick={() => { handleEditClick(selectedDossier); setSelectedDossier(null); }}
                    >
                      Alterar Dossiê / Status
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* --- TAB: DASHBOARD --- */}
        {tab === 'dashboard' && metrics && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-extrabold text-cyan-300">Painel Geral de Qualidade e Conversão</h1>
              <p className="text-xs text-gray-400">Métricas analíticas históricas agregadas e assistidas por inteligência artificial, de acordo com o ECA e LGPD.</p>
            </div>

            {/* Fila de KPIs do Dashboard de Conversão (Refatorado para Vanilla CSS) */}
            <div className="kpi-grid">
              
              {/* Sessões Totais */}
              <div className="kpi-card border-cyan">
                <div className="kpi-icon-wrapper cyan"><Users className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">Sessões Totais</span>
                  <span className="kpi-value">{metrics.sessions}</span>
                </div>
              </div>

              {/* Bounce Rate */}
              <div className="kpi-card border-purple">
                <div className="kpi-icon-wrapper purple"><Activity className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">Bounce Rate (Abandono)</span>
                  <span className="kpi-value">{(metrics.bounceRate * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Receita Bruta */}
              <div className="kpi-card border-green">
                <div className="kpi-icon-wrapper green"><DollarSign className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">Receita Bruta (Anúncios)</span>
                  <span className="kpi-value text-green-400">R$ {metrics.revenue.gross.toFixed(2)}</span>
                </div>
              </div>

              {/* RPM */}
              <div className="kpi-card border-yellow">
                <div className="kpi-icon-wrapper yellow"><Award className="w-5 h-5" /></div>
                <div className="kpi-details">
                  <span className="kpi-title">RPM por Mil Sessões (Métrica Chave)</span>
                  <span className="kpi-value text-yellow-500">R$ {metrics.revenue.rpm.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Seção 2: Categorias Populares */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="glass-panel p-6 lg:col-span-1 space-y-4">
                <h3 className="font-bold text-sm text-cyan-300 border-b border-white/5 pb-2 uppercase tracking-wider">Engajamento por Categoria</h3>
                <div className="space-y-4">
                  {metrics.topCategories.map((cat, idx) => (
                    <div key={cat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white">{idx + 1}. {cat.name}</span>
                        <span className="text-gray-400">{cat.sessions} sessões</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-cyan-500 h-full rounded-full" 
                          style={{ width: `${(cat.sessions / metrics.sessions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Módulo de Inteligência Artificial Assistida com Confidence Level */}
              <div className="glass-panel p-6 lg:col-span-2 space-y-4 border border-purple-500/20">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <h3 className="font-bold text-sm text-purple-300 flex items-center gap-2 uppercase tracking-wider">
                    <Cpu className="w-5 h-5 text-purple-400" /> Insights e Sugestões do Motor de IA (Vertex AI)
                  </h3>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-purple-900/30 text-purple-400 border border-purple-500/20">Dados Agregados Sem Identificação Individual</span>
                </div>

                <div className="space-y-4">
                  {insights.map(ins => (
                    <div key={ins.id} className="p-4 bg-black/40 border border-white/5 rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          <ChevronRight className="w-4 h-4 text-purple-400" /> {ins.title}
                        </h4>
                        <span className={`badge ${ins.confidence === 'alta' ? 'badge-green' : ins.confidence === 'media' ? 'badge-yellow' : 'badge-red'}`}>
                          Confiança: {ins.confidence}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {ins.summary}
                      </p>
                      <div className="space-y-1.5 pt-1.5 border-t border-white/5">
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Sugestões de Ação Imediata:</span>
                        <ul className="list-disc list-inside text-xs text-purple-300 space-y-1">
                          {ins.suggestions.map((s, sIdx) => (
                            <li key={sIdx}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
