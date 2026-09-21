import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Search, Heart, User, LogIn, LogOut, Info, Shield, 
  Settings, HelpCircle, ArrowLeft, Star, Volume2, ShieldAlert, Sparkles,
  Smartphone, Share2, Award, Zap, Brain, Rocket, Grid, Plus, Hash, X, FileText, Lock, Maximize,
  FolderGit2, FileSignature, BarChart3, Cpu, Trash2, Edit2, Calendar, Users, DollarSign, Activity, AlertCircle, ChevronRight,
  MessageSquare, Send
} from 'lucide-react';

// Interfaces internas
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
  statusTechnical: string;
  statusEditorial: string;
  statusDoc: string;
  author: string;
  licenseName: string;
}

interface UserProfile {
  id: string;
  username: string;
  role: string;
  status: string;
  agePreference: string;
}

export default function App() {
  // --- Estados do Portal ---
  const [view, setView] = useState<'home' | 'playing' | 'favorites' | 'privacy' | 'terms' | 'contact' | 'report' | 'admin'>('home');
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<string[]>(['Tudo', 'Arcade', 'Memória', 'Ação']);
  const [activeCategory, setActiveCategory] = useState<string>('Tudo');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Preferências - 7 Verticais de Públicos Oficiais do KRUUJ (Whitepaper Item 6)
  const [agePreference, setAgePreference] = useState<'geral' | 'educacional' | 'terceira_idade' | 'bebes' | 'family' | 'edu' | 'premium'>('geral');
  
  // UX Audit Upgrades — Estados para Skeletons de Transição e Gamificação Social
  const [isCatalogLoading, setIsCatalogLoading] = useState<boolean>(false);
  const [activeChallengeFriend, setActiveChallengeFriend] = useState<string | null>(null);

  // Efeito de Transição Suave de Catálogo (Flicker-Free Skeletons)
  useEffect(() => {
    setIsCatalogLoading(true);
    const timer = setTimeout(() => {
      setIsCatalogLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery, agePreference]);
  
  // Acessibilidade Cognitiva (Modo TEA / Neurodivergente)
  const [teaMode, setTeaMode] = useState<boolean>(() => {
    return localStorage.getItem('arcade_tea_mode') === 'true';
  });

  // Salva o Modo TEA no disco
  useEffect(() => {
    localStorage.setItem('arcade_tea_mode', String(teaMode));
  }, [teaMode]);
  
  // Controle de Saída de Segurança (Parent Gate - Modo Bebês)
  const [showParentGate, setShowParentGate] = useState<boolean>(false);
  const [parentMath, setParentMath] = useState({ n1: 0, n2: 0, op: '+' });
  const [parentInput, setParentInput] = useState<string>('');
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [accountSubView, setAccountSubView] = useState<'menu' | 'history'>('menu');
  const wakeLockRef = useRef<any>(null);

  // Autenticação
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Favoritos
  const [favorites, setFavorites] = useState<string[]>([]); // Array de IDs de jogos

  // --- Estados do Painel Administrativo Integrado ---
  const [adminTab, setAdminTab] = useState<'contracts' | 'dashboard' | 'users'>('contracts');
  const [adminCatalog, setAdminCatalog] = useState<any[]>([]);
  const [adminViewMode, setAdminViewMode] = useState<'list' | 'add' | 'edit'>('list');
  const [adminSelectedGame, setAdminSelectedGame] = useState<any | null>(null);
  const [adminSelectedContract, setAdminSelectedContract] = useState<any | null>(null);
  const [adminSelectedDossier, setAdminSelectedDossier] = useState<any | null>(null);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);

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

  const [adminMetrics, setAdminMetrics] = useState<any | null>(null);
  const [adminInsights, setAdminInsights] = useState<any[]>([]);

  // Contador de Likes de cada jogo (curtidas reais persistidas localmente)
  const [likesCount, setLikesCount] = useState<Record<string, number>>(() => {
    const storedLikes = localStorage.getItem('arcade_likes_count');
    if (storedLikes) {
      return JSON.parse(storedLikes);
    }
    return {
      '1': 142, // Snake Retro Arcade
      '2': 98,  // Memory Training Neon
      '3': 210, // Cyber Space Defense
      '4': 15,  // Tetris Neon Block
      '5': 84,  // Super Math Run
      '6': 76,  // Sudoku Zen Master
    };
  });

  // Salva os contadores de likes no disco local sempre que alterados
  useEffect(() => {
    localStorage.setItem('arcade_likes_count', JSON.stringify(likesCount));
  }, [likesCount]);



  // Bloquear navegação traseira (Botão Voltar do Android/Browser) no Modo Bebês
  useEffect(() => {
    if (!isScreenLocked) return;

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      if (isScreenLocked) {
        window.history.pushState(null, '', window.location.href);
        alert("O Modo Bebês está ativo! Resolva o cálculo do cadeado de segurança para sair do jogo.");
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isScreenLocked]);

  // Impedir recarregamento acidental
  useEffect(() => {
    if (!isScreenLocked) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "O Modo Bebês está ativo! Tem certeza que deseja sair?";
      return e.returnValue;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isScreenLocked]);

  // Consentimento de Privacidade (LGPD)
  const [consentVersion, setConsentVersion] = useState<string>('v1');
  const [showConsentBanner, setShowConsentBanner] = useState<boolean>(false);
  const [consentOptions, setConsentOptions] = useState({
    essential: true,
    analytics: false,
    advertising: false
  });

  // Publicidade (Pre-game Ad)
  const [showAdOverlay, setShowAdOverlay] = useState<boolean>(false);
  const [adCountdown, setAdCountdown] = useState<number>(3);
  const [isPlayingGame, setIsPlayingGame] = useState<boolean>(false);

  // --- Histórico de Jogos Recentes (Requisito de MVP) ---
  interface RecentPlay {
    id: string;
    timestamp: number;
  }

  const [recentGames, setRecentGames] = useState<RecentPlay[]>([]);

  // Formatador de tempo relativo em português para o histórico de recentes
  const formatRelativeTime = (timestamp: number) => {
    if (!timestamp) return '';
    const diffMs = Date.now() - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  // Efeito para carregar o histórico de jogos recentes de forma isolada (Usuário VIP vs Visitante Anônimo)
  useEffect(() => {
    if (user) {
      // Se houver um usuário conectado, carrega reativamente o seu histórico persistente
      const storedRecents = localStorage.getItem(`recents_${user.username}`);
      if (storedRecents) {
        try {
          const parsed = JSON.parse(storedRecents);
          if (Array.isArray(parsed)) {
            // Normaliza os dados legados: se o item for uma string, converte-o para o novo formato de objeto com timestamp atual!
            const normalized = parsed.map(item => {
              if (typeof item === 'string') {
                return { id: item, timestamp: Date.now() };
              }
              if (item && typeof item === 'object' && item.id) {
                return { id: item.id, timestamp: item.timestamp || Date.now() };
              }
              return null;
            }).filter((item): item is RecentPlay => !!item);
            
            setRecentGames(normalized);
            return;
          }
        } catch (e) {
          setRecentGames([]);
        }
      }
    }
    
    // Se for um visitante anônimo ou se o usuário deslogar, o histórico é resetado para vazio absoluto (Garantia de Privacidade LGPD)
    setRecentGames([]);
  }, [user]);


  // --- Efeitos e Inicialização ---
  useEffect(() => {
    // Carregar dados de Autenticação do LocalStorage
    const storedUser = localStorage.getItem('arcade_user');
    const storedToken = localStorage.getItem('arcade_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }

    // Carregar consentimento de Cookies
    const consent = localStorage.getItem('arcade_consent');
    if (!consent) {
      setShowConsentBanner(true);
    } else {
      setConsentOptions(JSON.parse(consent));
    }

    // Carregar jogos iniciais (Mockados se a API falhar, ou vindos da API)
    fetchGames();
  }, []);

  // --- Injeção de Tema Dinâmico no Root (Body) ---
  useEffect(() => {
    // Reseta as classes antigas
    document.body.className = '';
    
    // Injeta o tema TEA com prioridade máxima de sobreposição
    if (teaMode) {
      document.body.classList.add('theme-tea');
    } else {
      // Injeta os temas editoriais caso o TEA não esteja ativo
      if (agePreference === 'educacional') document.body.classList.add('theme-edu');
      else if (agePreference === 'terceira_idade') document.body.classList.add('theme-senior');
      else if (agePreference === 'bebes') document.body.classList.add('theme-bebes');
    }
  }, [teaMode, agePreference]);

  // --- SEO Dinâmico (Long-Tail SEO Engine) ---
  useEffect(() => {
    let pageTitle = 'KRUUJ — Jogue. Descubra. Conecte.';
    let pageDesc = 'KRUUJ é uma plataforma de descoberta e jogos web responsiva, focada em segurança, acessibilidade e total conformidade com a LGPD e o ECA.';

    if (view === 'playing' && selectedGame) {
      // Long-Tail SEO injetado quando uma página de jogo específica é acessada
      pageTitle = `${selectedGame.title} - Jogar Online Grátis | KRUUJ`;
      pageDesc = selectedGame.description;
    } else if (view === 'home') {
      // Long-Tail SEO para subnichos de categoria editorial
      if (agePreference === 'educacional') {
        pageTitle = 'Jogos Educacionais e Lógicos | KRUUJ Kids';
        pageDesc = 'Os melhores jogos educativos de matemática, memória e lógica para crianças e adolescentes jogarem grátis no KRUUJ Kids.';
      } else if (agePreference === 'terceira_idade') {
        pageTitle = 'Jogos Cognitivos e Memória | KRUUJ 60+';
        pageDesc = 'Jogos gratuitos para estimular a memória de idosos. Sudoku e jogos de lógica fáceis e relaxantes no KRUUJ 60+.';
      }
    }

    document.title = pageTitle;
    
    // Injeta/Atualiza a Meta Tag de Description Dinamicamente para Crawlers
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', pageDesc);
  }, [view, selectedGame, agePreference]);

  useEffect(() => {
    if (user && token) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user, token]);

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      } else {
        throw new Error('Falha ao obter jogos');
      }
    } catch (err) {
      console.warn('API não disponível no momento. Utilizando banco mock offline no frontend.');
      // Banco Mock Offline de conformidade completa com a ficha semeada
      const mockGames: Game[] = [
        {
          id: '1',
          slug: 'snake-retro',
          title: 'Snake Retro Arcade',
          description: 'Jogo da cobrinha neon online grátis para celular e PC! O clássico retro futurista arcade perfeito para passar o tempo. Pegue os blocos de dados sem bater nas paredes.',
          category: 'Arcade',
          subcategories: ['Clássico', 'Casual', 'Retrô'],
          tags: ['cobrinha', 'retro', 'pixel', 'neon', 'casual'],
          ageRating: 'Livre',
          bannerUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=60',
          iconUrl: 'snake',
          prefixUrl: '/games/snake-retro/',
          version: '1.0.0',
          controls: { mouse: false, teclado: true, toque: true, gamepad: false },
          orientation: 'both',
          statusTechnical: 'aprovado',
          statusEditorial: 'publicado',
          statusDoc: 'aprovado',
          author: 'RetroByte Studios',
          licenseName: 'Licença Comercial Ampla'
        },
        {
          id: '2',
          slug: 'memory-match',
          title: 'Memory Training Neon',
          description: 'Jogos gratuitos para estimular a memória de idosos e crianças. Exercite sua mente combinando as cartas de neon vibrantes diretamente no celular sem precisar instalar nada.',
          category: 'Memória',
          subcategories: ['Cognitivo', 'Educacional', 'Infantil'],
          tags: ['memoria', 'educacional', 'mente', 'cartas', 'infantil', 'idoso'],
          ageRating: 'Livre',
          bannerUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&auto=format&fit=crop&q=60',
          iconUrl: 'brain',
          prefixUrl: '/games/memory-match/',
          version: '1.0.2',
          controls: { mouse: true, teclado: false, toque: true, gamepad: false },
          orientation: 'portrait',
          statusTechnical: 'aprovado',
          statusEditorial: 'publicado',
          statusDoc: 'aprovado',
          author: 'MindCare Software',
          licenseName: 'Licença Comercial Geral'
        },
        {
          id: '3',
          slug: 'space-defense',
          title: 'Cyber Space Defense',
          description: 'Jogo de tiro no espaço arcade gratuito. Defenda o núcleo central contra invasores cibernéticos do espaço profundo atirando sem parar! Jogue agora no PC ou mobile.',
          category: 'Ação',
          subcategories: ['Espaço', 'Tiro', 'Sobrevivência'],
          tags: ['tiro', 'espaco', 'defense', 'arcade', 'invasores'],
          ageRating: '10+',
          bannerUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=60',
          iconUrl: 'rocket',
          prefixUrl: '/games/space-defense/',
          version: '1.1.0',
          controls: { mouse: true, teclado: true, toque: true, gamepad: true },
          orientation: 'landscape',
          statusTechnical: 'aprovado',
          statusEditorial: 'publicado',
          statusDoc: 'aprovado',
          author: 'PixelGlitch Labs',
          licenseName: 'Cessão Total de Direitos'
        },
        {
          id: '4',
          slug: 'math-run',
          title: 'Super Math Run',
          description: 'Jogos de soma e matemática para 8 anos online. Corra, pule obstáculos e responda contas e cálculos rápidos mentalmente para continuar avançando. Aprender nunca foi tão divertido!',
          category: 'Educacional',
          subcategories: ['Corrida', 'Educacional', 'Matemática'],
          tags: ['educacional', 'infantil', 'matematica', 'corrida', 'kids'],
          ageRating: 'Livre',
          bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
          iconUrl: 'plus',
          prefixUrl: '/games/math-run/',
          version: '1.0.1',
          controls: { mouse: false, teclado: true, toque: true, gamepad: false },
          orientation: 'landscape',
          statusTechnical: 'aprovado',
          statusEditorial: 'publicado',
          statusDoc: 'aprovado',
          author: 'EduPlay Corp',
          licenseName: 'Licença Comercial Não Exclusiva'
        },
        {
          id: '5',
          slug: 'sudoku-zen',
          title: 'Sudoku Zen Master',
          description: 'Sudoku fácil para celular sem instalar grátis. O clássico tabuleiro matemático de lógica com trilha relaxante, excelente para manter o cérebro da terceira idade ativo.',
          category: 'Terceira Idade',
          subcategories: ['Puzzle', 'Lógica', 'Cognitivo'],
          tags: ['sudoku', 'tabuleiro', 'logica', 'zen', 'idoso', 'mente'],
          ageRating: 'Livre',
          bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
          iconUrl: 'hash',
          prefixUrl: '/games/sudoku-zen/',
          version: '1.0.0',
          controls: { mouse: true, teclado: false, toque: true, gamepad: false },
          orientation: 'both',
          statusTechnical: 'aprovado',
          statusEditorial: 'publicado',
          statusDoc: 'aprovado',
          author: 'ZenPuzzle Co',
          licenseName: 'Licença Comercial Ampla'
        },
        {
          id: '6',
          slug: 'bubble-pop',
          title: 'Bolhas Mágicas',
          description: 'Estoure as bolhas coloridas em um ambiente calmo e seguro. Jogo focado em causa e efeito, perfeito para o desenvolvimento motor de bebês e crianças pequenas.',
          category: 'Bebês',
          subcategories: ['Lúdico', 'Sensorial', 'Causa e Efeito'],
          tags: ['bebes', 'bolhas', 'cores', 'sensorial', 'toddler'],
          ageRating: 'Livre',
          bannerUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=60',
          iconUrl: 'plus',
          prefixUrl: '/games/bubble-pop/',
          version: '1.0.0',
          controls: { mouse: true, teclado: false, toque: true, gamepad: false },
          orientation: 'both',
          statusTechnical: 'aprovado',
          statusEditorial: 'publicado',
          statusDoc: 'aprovado',
          author: 'Franguinhos Original',
          licenseName: 'Proprietário'
        },
        {
          id: '7',
          slug: 'rocket-rise',
          title: 'Rocket Rise',
          description: 'Pilote uma nave espacial, desvie de meteoros, gerencie seu combustível e use turbos e escudos para subir o mais alto possível nesse viciante jogo de sobrevivência espacial!',
          category: 'Arcade',
          subcategories: ['Espaço', 'Sobrevivência', 'Casual'],
          tags: ['foguete', 'espaco', 'obstaculos', 'moedas', 'climb'],
          ageRating: 'Livre',
          bannerUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60',
          iconUrl: 'rocket',
          prefixUrl: '/games/rocket-rise/',
          version: '1.0.0',
          controls: { mouse: false, teclado: true, toque: true, gamepad: false },
          orientation: 'both',
          statusTechnical: 'aprovado',
          statusEditorial: 'publicado',
          statusDoc: 'aprovado',
          author: 'Franguinhos Games',
          licenseName: 'Proprietário'
        }
      ];
      setGames(mockGames);
    }
  };

  // --- Funções do Painel Administrativo Integrado ---
  const fetchAdminCatalog = async () => {
    try {
      const response = await fetch('/api/admin/games', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminCatalog(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn('API de administração offline. Usando catálogo simulado.');
      const mockCatalog = [
        {
          game: {
            id: '1', slug: 'snake-retro', title: 'Snake Retro Arcade', description: 'Jogo da cobrinha neon online grátis para celular e PC!',
            category: 'Arcade', subcategories: ['Clássico', 'Casual', 'Retrô'], tags: ['cobrinha', 'retro', 'pixel', 'neon', 'casual'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'snake', prefixUrl: '/games/snake-retro/', version: '1.0.0',
            controls: { mouse: false, teclado: true, toque: true, gamepad: false }, orientation: 'both' as any,
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'RetroByte Studios', licenseName: 'Licença Comercial Ampla'
          },
          contract: {
            id: 'c-1', gameId: '1', contractNumber: 'CON-2026-001', signatoryCreator: 'RetroByte Studios LP', termsAccepted: true,
            licenseType: 'Licença Comercial Exclusiva Digital', exclusivityScope: 'Exclusivo Brasil',
            durationMonths: 24, revenueSharePercent: 30.0, fixedPaymentAmount: 1200.0,
            auditLog: '[2026-08-24T10:00:00Z] Contrato assinado eletronicamente por RetroByte LP.\n'
          }
        },
        {
          game: {
            id: '2', slug: 'memory-match', title: 'Memory Training Neon', description: 'Exercite sua mente combinando as cartas de neon vibrantes.',
            category: 'Memória', subcategories: ['Cognitivo', 'Educacional', 'Infantil'], tags: ['memoria', 'educacional', 'mente', 'cartas', 'infantil', 'idoso'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'brain', prefixUrl: '/games/memory-match/', version: '1.0.2',
            controls: { mouse: true, teclado: false, toque: true, gamepad: false }, orientation: 'portrait' as any,
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'MindCare Software', licenseName: 'Licença Comercial Geral'
          },
          contract: {
            id: 'c-2', gameId: '2', contractNumber: 'CON-2026-002', signatoryCreator: 'MindCare Software SA', termsAccepted: true,
            licenseType: 'Licença Comercial Não Exclusiva', exclusivityScope: 'Global',
            durationMonths: 36, revenueSharePercent: 15.0, fixedPaymentAmount: 800.0,
            auditLog: '[2026-08-24T10:20:00Z] Contrato validado por MindCare SA.\n'
          }
        },
        {
          game: {
            id: '3', slug: 'space-defense', title: 'Cyber Space Defense', description: 'Defenda o núcleo central contra invasores cibernéticos do espaço profundo.',
            category: 'Ação', subcategories: ['Espaço', 'Tiro', 'Sobrevivência'], tags: ['tiro', 'espaco', 'defense', 'arcade', 'invasores'],
            ageRating: '10+', bannerUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'rocket', prefixUrl: '/games/space-defense/', version: '1.1.0',
            controls: { mouse: true, teclado: true, toque: true, gamepad: true }, orientation: 'landscape' as any,
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'PixelGlitch Labs', licenseName: 'Cessão Total de Direitos'
          },
          contract: {
            id: 'c-3', gameId: '3', contractNumber: 'CON-2026-003', signatoryCreator: 'PixelGlitch Labs', termsAccepted: true,
            licenseType: 'Cessão de Propriedade Intelectual', exclusivityScope: 'Exclusivo Total',
            durationMonths: 120, revenueSharePercent: 0.0, fixedPaymentAmount: 3500.0,
            auditLog: '[2026-08-24T11:00:00Z] Cessão de direitos autorais registrada em cartório digital.\n'
          }
        },
        {
          game: {
            id: '4', slug: 'math-run', title: 'Super Math Run', description: 'Corra, pule obstáculos e responda contas e cálculos rápidos mentalmente.',
            category: 'Educacional', subcategories: ['Corrida', 'Educacional', 'Matemática'], tags: ['educacional', 'infantil', 'matematica', 'corrida', 'kids'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'plus', prefixUrl: '/games/math-run/', version: '1.0.1',
            controls: { mouse: false, teclado: true, toque: true, gamepad: false }, orientation: 'landscape' as any,
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'EduPlay Corp', licenseName: 'Licença Comercial Não Exclusiva'
          },
          contract: {
            id: 'c-4', gameId: '4', contractNumber: 'CON-2026-004', signatoryCreator: 'EduPlay Corp S/A', termsAccepted: true,
            licenseType: 'Licença Comercial de Uso', exclusivityScope: 'Global',
            durationMonths: 12, revenueSharePercent: 20.0, fixedPaymentAmount: 500.0,
            auditLog: '[2026-08-24T11:40:00Z] Contrato assinado. Aprovado editorialmente para portal Kids.\n'
          }
        },
        {
          game: {
            id: '5', slug: 'sudoku-zen', title: 'Sudoku Zen Master', description: 'O clássico tabuleiro matemático de lógica com trilha relaxante.',
            category: 'Terceira Idade', subcategories: ['Puzzle', 'Lógica', 'Cognitivo'], tags: ['sudoku', 'tabuleiro', 'logica', 'zen', 'idoso', 'mente'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'hash', prefixUrl: '/games/sudoku-zen/', version: '1.0.0',
            controls: { mouse: true, teclado: false, toque: true, gamepad: false }, orientation: 'both' as any,
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'ZenPuzzle Co', licenseName: 'Licença Comercial Ampla'
          },
          contract: {
            id: 'c-5', gameId: '5', contractNumber: 'CON-2026-005', signatoryCreator: 'ZenPuzzle LLC', termsAccepted: true,
            licenseType: 'Licença Ampla Não Exclusiva', exclusivityScope: 'Global',
            durationMonths: 48, revenueSharePercent: 10.0, fixedPaymentAmount: 600.0,
            auditLog: '[2026-08-24T12:00:00Z] Contrato Zen assinado. Aprovado para catálogo sênior.\n'
          }
        },
        {
          game: {
            id: '6', slug: 'bubble-pop', title: 'Bolhas Mágicas', description: 'Estoure as bolhas coloridas em um ambiente calmo e seguro.',
            category: 'Bebês', subcategories: ['Lúdico', 'Sensorial', 'Causa e Efeito'], tags: ['bebes', 'bolhas', 'cores', 'sensorial', 'toddler'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'plus', prefixUrl: '/games/bubble-pop/', version: '1.0.0',
            controls: { mouse: true, teclado: false, toque: true, gamepad: false }, orientation: 'both' as any,
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'Franguinhos Original', licenseName: 'Proprietário'
          },
          contract: {
            id: 'c-6', gameId: '6', contractNumber: 'CON-2026-006', signatoryCreator: 'Franguinhos Games', termsAccepted: true,
            licenseType: 'Proprietário (In-house)', exclusivityScope: 'Exclusivo Total',
            durationMonths: 120, revenueSharePercent: 0.0, fixedPaymentAmount: 0.0,
            auditLog: '[2026-08-24T14:30:00Z] Jogo desenvolvido in-house com validação da curadora Denise. Propriedade Intelectual total.\n'
          }
        },
        {
          game: {
            id: '7', slug: 'rocket-climb', title: 'Rocket Climb', description: 'Pilote uma nave espacial, desvie de meteoros, gerencie seu combustível e use turbos e escudos para subir o mais alto possível!',
            category: 'Arcade', subcategories: ['Espaço', 'Sobrevivência', 'Casual'], tags: ['foguete', 'espaco', 'obstaculos', 'moedas', 'climb'],
            ageRating: 'Livre', bannerUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60',
            iconUrl: 'rocket', prefixUrl: '/games/rocket-climb/', version: '1.0.0',
            controls: { mouse: false, teclado: true, toque: true, gamepad: false }, orientation: 'both' as any,
            statusTechnical: 'aprovado', statusEditorial: 'publicado', statusDoc: 'aprovado',
            author: 'Franguinhos Games', licenseName: 'Proprietário'
          },
          contract: {
            id: 'c-7', gameId: '7', contractNumber: 'CON-2026-007', signatoryCreator: 'Franguinhos Games', termsAccepted: true,
            licenseType: 'Proprietário (In-house)', exclusivityScope: 'Exclusivo Total',
            durationMonths: 120, revenueSharePercent: 0.0, fixedPaymentAmount: 0.0,
            auditLog: '[2026-08-31T21:00:00Z] Jogo desenvolvido in-house e integrado ao monorepo.\n'
          }
        }
      ];
      setAdminCatalog(mockCatalog);
    }
  };

  const fetchAdminMetrics = async () => {
    try {
      const response = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminMetrics(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      setAdminMetrics({
        period: 'últimos_30_dias',
        sessions: 14240,
        activeUsers: 5980,
        bounceRate: 0.075,
        avgPlayTimeMinutes: 12.4,
        totalPublishedGames: 7,
        totalDraftGames: 1,
        favoritesCreated: 42,
        topCategories: [
          { name: 'Memória', sessions: 4984 },
          { name: 'Arcade', sessions: 4272 },
          { name: 'Ação', sessions: 2136 },
          { name: 'Puzzle', sessions: 1424 }
        ],
        revenue: { gross: 60.52, estimatedNet: 48.85, rpm: 4.25 }
      });
    }
  };

  const fetchAdminInsights = async () => {
    try {
      const response = await fetch('/api/admin/ai-insights', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminInsights(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      setAdminInsights([
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
      ]);
    }
  };

  const handleAdminDeleteGame = async (gameId: string) => {
    if (!confirm('Tem certeza que deseja deletar este jogo e seu contrato jurídico em cascata do sistema?')) return;

    try {
      const response = await fetch(`/api/admin/games/${gameId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        fetchAdminCatalog();
        fetchGames();
      }
    } catch (e) {
      setAdminCatalog(adminCatalog.filter(item => item.game.id !== gameId));
    }
  };

  const handleAdminSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      title: formGame.title,
      slug: formGame.slug,
      description: formGame.description,
      category: formGame.category,
      subcategories: formGame.subcategories.split(','),
      tags: formGame.tags.split(','),
      ageRating: formGame.ageRating,
      bannerUrl: formGame.bannerUrl,
      iconUrl: formGame.iconUrl,
      prefixUrl: formGame.prefixUrl,
      version: formGame.version,
      controls: {
        mouse: formGame.mouse,
        teclado: formGame.teclado,
        toque: formGame.toque,
        gamepad: formGame.gamepad
      },
      orientation: formGame.orientation,
      statusTechnical: formGame.statusTechnical,
      statusEditorial: formGame.statusEditorial,
      statusDoc: formGame.statusDoc,
      author: formGame.author,
      licenseName: formGame.licenseName,
      contractNumber: formGame.contractNumber,
      signatoryCreator: formGame.signatoryCreator,
      signatoryRepresentative: formGame.signatoryRepresentative,
      termsAccepted: formGame.termsAccepted,
      licenseType: formGame.licenseType,
      exclusivityScope: formGame.exclusivityScope,
      durationMonths: Number(formGame.durationMonths),
      revenueSharePercent: Number(formGame.revenueSharePercent),
      fixedPaymentAmount: Number(formGame.fixedPaymentAmount)
    };

    try {
      const method = adminViewMode === 'add' ? 'POST' : 'PUT';
      const endpoint = adminViewMode === 'add' ? '/api/admin/games' : `/api/admin/games/${adminSelectedGame?.id}`;

      const response = await fetch(endpoint, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setAdminViewMode('list');
        setAdminSelectedGame(null);
        setAdminSelectedContract(null);
        fetchAdminCatalog();
        fetchGames();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao salvar jogo e contrato.');
      }
    } catch (err) {
      if (adminViewMode === 'add') {
        const fakeId = String(adminCatalog.length + 1);
        const newItem = {
          game: {
            id: fakeId, slug: formGame.slug, title: formGame.title, description: formGame.description,
            category: formGame.category, subcategories: formGame.subcategories.split(','), tags: formGame.tags.split(','),
            ageRating: formGame.ageRating, bannerUrl: formGame.bannerUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
            iconUrl: formGame.iconUrl, prefixUrl: formGame.prefixUrl, version: formGame.version,
            controls: { mouse: formGame.mouse, teclado: formGame.teclado, toque: formGame.toque, gamepad: formGame.gamepad },
            orientation: formGame.orientation as any, statusTechnical: formGame.statusTechnical,
            statusEditorial: formGame.statusEditorial, statusDoc: formGame.statusDoc,
            author: formGame.author, licenseName: formGame.licenseName
          },
          contract: {
            id: 'c-' + fakeId, gameId: fakeId, contractNumber: formGame.contractNumber, signatoryCreator: formGame.signatoryCreator,
            signatoryRepresentative: formGame.signatoryRepresentative, termsAccepted: formGame.termsAccepted,
            licenseType: formGame.licenseType, exclusivityScope: formGame.exclusivityScope,
            durationMonths: formGame.durationMonths, revenueSharePercent: formGame.revenueSharePercent,
            fixedPaymentAmount: formGame.fixedPaymentAmount,
            auditLog: `[${new Date().toISOString()}] Criado via formulário integrado offline.\n`
          }
        };
        setAdminCatalog([...adminCatalog, newItem]);
        setGames([...games, newItem.game]);
      } else {
        setAdminCatalog(adminCatalog.map(item => {
          if (item.game.id === adminSelectedGame?.id) {
            return {
              game: { ...item.game, ...payload, subcategories: formGame.subcategories.split(','), tags: formGame.tags.split(',') },
              contract: item.contract ? { ...item.contract, ...payload, durationMonths: Number(formGame.durationMonths), revenueSharePercent: Number(formGame.revenueSharePercent), fixedPaymentAmount: Number(formGame.fixedPaymentAmount), auditLog: item.contract.auditLog + `[${new Date().toISOString()}] Editado offline.\n` } : null
            };
          }
          return item;
        }));
      }
      setAdminViewMode('list');
      setAdminSelectedGame(null);
      setAdminSelectedContract(null);
    }
  };

  const handleAdminAddClick = () => {
    setFormGame({
      title: '', slug: '', description: '', category: 'Arcade', subcategories: '', tags: '',
      ageRating: 'Livre', bannerUrl: '', iconUrl: 'gamepad', prefixUrl: '', version: '1.0.0',
      mouse: true, teclado: true, toque: true, gamepad: false, orientation: 'both',
      statusTechnical: 'pendente_teste', statusEditorial: 'rascunho', statusDoc: 'documentacao_pendente',
      author: '', licenseName: '',
      contractNumber: `CON-2026-00${adminCatalog.length + 1}`, signatoryCreator: '', signatoryRepresentative: '', termsAccepted: false,
      licenseType: 'Licença Comercial de Uso', exclusivityScope: 'Não Exclusivo',
      durationMonths: 12, revenueSharePercent: 0.0, fixedPaymentAmount: 0.0
    });
    setAdminSelectedGame(null);
    setAdminSelectedContract(null);
    setAdminViewMode('add');
  };

  const handleAdminEditClick = (item: any) => {
    setAdminSelectedGame(item.game);
    setAdminSelectedContract(item.contract);
    setFormGame({
      title: item.game.title, slug: item.game.slug, description: item.game.description,
      category: item.game.category, subcategories: item.game.subcategories.join(','), tags: item.game.tags.join(','),
      ageRating: item.game.ageRating, bannerUrl: item.game.bannerUrl, iconUrl: item.game.iconUrl,
      prefixUrl: item.game.prefixUrl, version: item.game.version,
      mouse: item.game.controls.mouse, teclado: item.game.controls.teclado, toque: item.game.controls.toque, gamepad: item.game.controls.gamepad,
      orientation: item.game.orientation, statusTechnical: item.game.statusTechnical,
      statusEditorial: item.game.statusEditorial, statusDoc: item.game.statusDoc,
      author: item.game.author, licenseName: item.game.licenseName,
      contractNumber: item.contract?.contractNumber || '', signatoryCreator: item.contract?.signatoryCreator || '',
      signatoryRepresentative: item.contract?.signatoryRepresentative || '', termsAccepted: item.contract?.termsAccepted || false,
      licenseType: item.contract?.licenseType || 'Licença de Uso Comercial', exclusivityScope: item.contract?.exclusivityScope || 'Não Exclusivo',
      durationMonths: item.contract?.durationMonths || 12, revenueSharePercent: item.contract?.revenueSharePercent || 0.0,
      fixedPaymentAmount: item.contract?.fixedPaymentAmount || 0.0
    });
    setAdminViewMode('edit');
  };

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

  const fetchAdminUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setAdminUsers(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      console.warn('API de usuários offline. Simulando usuários.');
      setAdminUsers([
        { id: '1', username: 'admin', role: 'super_admin', status: 'ativo', agePreference: 'sem_preferencia', createdAt: new Date().toISOString() },
        { id: '2', username: 'editor', role: 'editor', status: 'ativo', agePreference: 'sem_preferencia', createdAt: new Date().toISOString() },
        { id: '3', username: 'poki_gamer', role: 'user', status: 'ativo', agePreference: 'sem_preferencia', createdAt: new Date().toISOString() },
        { id: '4', username: 'vovo_gamer', role: 'user', status: 'ativo', agePreference: 'terceira_idade', createdAt: new Date().toISOString() }
      ]);
    }
  };

  const handleAdminUpdateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        fetchAdminUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Erro ao alterar permissão do usuário.');
      }
    } catch (e) {
      // Simulação Offline
      setAdminUsers(adminUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  // --- Efeitos de Administração Integrada ---
  useEffect(() => {
    if (view === 'admin' && user && user.role !== 'user') {
      fetchAdminCatalog();
      fetchAdminMetrics();
      fetchAdminInsights();
      fetchAdminUsers();
    }
  }, [view, user, token]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/games/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.map((g: Game) => g.id));
      }
    } catch (e) {
      // Offline / Simulado
      const storedFavs = localStorage.getItem(`favorites_${user?.username}`);
      if (storedFavs) {
        setFavorites(JSON.parse(storedFavs));
      }
    }
  };

  // --- Funções de Ação ---
  const handleToggleFavorite = async (gameId: string) => {
    if (!user) {
      setAuthMode('login');
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await fetch(`/api/games/${gameId}/favorite`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.favorited) {
          setFavorites([...favorites, gameId]);
          setLikesCount(prev => ({ ...prev, [gameId]: (prev[gameId] || 0) + 1 }));
        } else {
          setFavorites(favorites.filter(id => id !== gameId));
          setLikesCount(prev => ({ ...prev, [gameId]: Math.max(0, (prev[gameId] || 1) - 1) }));
        }
      }
    } catch (e) {
      // Offline fallback
      let updatedFavs = [];
      if (favorites.includes(gameId)) {
        updatedFavs = favorites.filter(id => id !== gameId);
        setLikesCount(prev => ({ ...prev, [gameId]: Math.max(0, (prev[gameId] || 1) - 1) }));
      } else {
        updatedFavs = [...favorites, gameId];
        setLikesCount(prev => ({ ...prev, [gameId]: (prev[gameId] || 0) + 1 }));
      }
      setFavorites(updatedFavs);
      localStorage.setItem(`favorites_${user.username}`, JSON.stringify(updatedFavs));
    }
  };

  // Auth Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setRecoveryPhrase('');

    if (!usernameInput || !passwordInput) {
      setAuthError('Preencha todos os campos.');
      return;
    }

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: usernameInput, 
          password: passwordInput,
          agePreference: agePreference === 'educacional' ? 'educacional' : agePreference === 'terceira_idade' ? 'terceira_idade' : 'sem_preferencia'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('arcade_user', JSON.stringify(data.user));
        localStorage.setItem('arcade_token', data.token);
        
        if (authMode === 'register') {
          // Gerar código de recuperação único e exibir ao usuário
          const mockPhrase = `REC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          setRecoveryPhrase(mockPhrase);
        } else {
          setShowAuthModal(false);
          setUsernameInput('');
          setPasswordInput('');
        }
      } else {
        setAuthError(data.error || 'Ocorreu um erro.');
      }
    } catch (err) {
      // Simulação Offline de Login / Registro
      if (authMode === 'login') {
        if (usernameInput === 'admin' && passwordInput === 'admin123') {
          const fakeUser = { id: 'admin-id', username: 'admin', role: 'super_admin', status: 'ativo', agePreference: 'sem_preferencia' };
          setUser(fakeUser);
          setToken('fake-jwt-token');
          localStorage.setItem('arcade_user', JSON.stringify(fakeUser));
          localStorage.setItem('arcade_token', 'fake-jwt-token');
          setShowAuthModal(false);
        } else {
          // Registrar como player novo simulado
          const fakeUser = { id: 'fake-id', username: usernameInput, role: 'user', status: 'ativo', agePreference: 'sem_preferencia' };
          setUser(fakeUser);
          setToken('fake-jwt-token');
          localStorage.setItem('arcade_user', JSON.stringify(fakeUser));
          localStorage.setItem('arcade_token', 'fake-jwt-token');
          setShowAuthModal(false);
        }
      } else {
        const fakeUser = { id: 'fake-id', username: usernameInput, role: 'user', status: 'ativo', agePreference: 'sem_preferencia' };
        setUser(fakeUser);
        setToken('fake-jwt-token');
        localStorage.setItem('arcade_user', JSON.stringify(fakeUser));
        localStorage.setItem('arcade_token', 'fake-jwt-token');
        setRecoveryPhrase(`REC-SAFE-ARCADE-OFFLINE-KEY`);
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('arcade_user');
    localStorage.removeItem('arcade_token');
  };

  // Função para executar a saída do jogo (liberar trava)
  const executeExitGame = () => {
    setView('home');
    setSelectedGame(null);
    setIsPlayingGame(false);
    setShowParentGate(false);

    // Liberar trava de tela se houver
    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {});
      wakeLockRef.current = null;
    }

    // Sair do fullscreen se ativo
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    setIsScreenLocked(false);

    // Rola a página de volta para o topo (Garante que não fique perdida embaixo)
    window.scrollTo({ top: 0, behavior: 'instant' });

    logEvent('game_exit', { gameId: selectedGame?.id, gameSlug: selectedGame?.slug });
  };

  // Gatilho de saída interceptado pelo Parent Gate no modo Bebês
  const triggerExitGame = () => {
    if (agePreference === 'bebes' && isScreenLocked) {
      // Gerar cálculo aleatório para o cadeado (Parent Gate)
      const isMult = Math.random() > 0.5;
      const n1 = Math.floor(Math.random() * 5) + 2; // 2 a 6
      const n2 = Math.floor(Math.random() * 5) + 2;
      setParentMath({ n1, n2, op: isMult ? 'x' : '+' });
      setParentInput('');
      setShowParentGate(true);
    } else {
      executeExitGame();
    }
  };

  const handleParentGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = parentMath.op === 'x' ? parentMath.n1 * parentMath.n2 : parentMath.n1 + parentMath.n2;
    if (parseInt(parentInput) === expected) {
      executeExitGame();
    } else {
      setParentInput('');
      alert("Resposta incorreta. Tente novamente.");
    }
  };

  // Iniciar Jogo de forma instantânea e ultra-rápida (sem delays artificiais de anúncios)
  const handlePlayGame = async (game: Game) => {
    setSelectedGame(game);
    setIsPlayingGame(true);
    setView('playing');
    logEvent('game_start', { gameId: game.id, gameSlug: game.slug });

    // Gravação de históricos de jogos recentes (Fase 1 - MVP) - Histórico Total de até 30 jogos de todos os tempos
    setRecentGames(prev => {
      const filtered = prev.filter(play => play.id !== game.id);
      const updated = [{ id: game.id, timestamp: Date.now() }, ...filtered].slice(0, 30); // guarda o histórico de até 30 partidas de todas as sessões
      const usernameKey = user ? user.username : 'visitante';
      if (user) {
        localStorage.setItem(`recents_${usernameKey}`, JSON.stringify(updated));
      }
      return updated;
    });

    // Trava de Tela (Screen Wake Lock) para o Modo Bebês
    if (agePreference === 'bebes' && 'wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.warn('Wake Lock request failed', err);
      }
    }
  };

  const handleManualFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      // SÓ permite sair do fullscreen se o lockscreen estiver DESATIVADO!
      if (!isScreenLocked) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Enviar Evento de Analítica (LGPD minimizado)
  const logEvent = async (type: string, payload: Record<string, any> = {}) => {
    if (!consentOptions.analytics) {
      console.log(`[Analytics bloqueado por preferências de privacidade]: Evento '${type}'`);
      return;
    }

    const eventBody = {
      eventType: type,
      sessionId: 'sess-local-browser',
      userId: user?.id,
      deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
      browser: navigator.userAgent.substring(0, 40),
      consentGiven: true,
      ...payload
    };

    console.log(`[Log Analytics Event]:`, eventBody);

    try {
      await fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventBody)
      });
    } catch (e) {
      // Ignorar silenciosamente falhas de rede em analytics
    }
  };

  // Salvar preferências de Cookies / LGPD
  const saveConsent = (analytics: boolean, ads: boolean) => {
    const consent = { essential: true, analytics, advertising: ads };
    setConsentOptions(consent);
    localStorage.setItem('arcade_consent', JSON.stringify(consent));
    setShowConsentBanner(false);
  };

  // Mapeia categorias extras/especiais para as 3 categorias padrão da barra lateral
  const getMappedCategory = (cat: string) => {
    if (cat === 'Bebês') return 'Arcade';
    if (cat === 'Educacional' || cat === 'Infantil') return 'Memória';
    if (cat === 'Terceira Idade' || cat === 'Puzzle') return 'Memória';
    return cat; // 'Arcade', 'Memória', 'Ação' mantêm-se iguais
  };

  // Filtragem de Jogos baseada nas preferências ativas
  const getFilteredGames = () => {
    let result = [...games];

    // 1. Filtragem por Preferência de Conteúdo (Educacional, Bebês, Terceira Idade)
    if (agePreference === 'educacional') {
      result = result.filter(g => g.ageRating === 'Livre' && (g.category === 'Educacional' || g.category === 'Infantil'));
    } else if (agePreference === 'bebes') {
      // Bloqueio rigoroso: No modo bebês, SOMENTE jogos da categoria "Bebês" podem aparecer
      result = result.filter(g => g.category === 'Bebês');
    } else if (agePreference === 'terceira_idade') {
      // Priorizar puzzle, memória, sudoku zen
      result = result.filter(g => g.category === 'Memória' || g.category === 'Terceira Idade' || g.tags.includes('mente'));
    }

    // 2. Filtragem por Categoria (Engloba categorias especiais do monorepo de acordo com o mapeamento)
    if (activeCategory !== 'Tudo') {
      result = result.filter(g => {
        const mappedCat = getMappedCategory(g.category);
        return mappedCat === activeCategory;
      });
    }

    // 3. Filtragem por Busca
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.title.toLowerCase().includes(q) || 
        g.description.toLowerCase().includes(q) || 
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return result;
  };

  // Recomendação contextual de jogos relacionados (profiling-free)
  const getRelatedGames = (currentGame: Game) => {
    return games
      .filter(g => g.id !== currentGame.id && (g.category === currentGame.category || g.tags.some(t => currentGame.tags.includes(t))))
      .slice(0, 3);
  };

  // Helper para renderizar a imagem de capa (foto real) ou ícone do jogo
  const renderGameCover = (game: Game) => {
    const hasRealImage = game.bannerUrl && game.bannerUrl.startsWith('http');
    if (hasRealImage) {
      return (
        <img 
          src={game.bannerUrl} 
          alt={game.title} 
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105" 
          loading="lazy"
        />
      );
    }

    switch (game.iconUrl) {
      case 'snake': return <Zap className="text-cyan-400 w-12 h-12" />;
      case 'brain': return <Brain className="text-pink-500 w-12 h-12" />;
      case 'rocket': return <Rocket className="text-purple-400 w-12 h-12" />;
      case 'plus': return <Plus className="text-green-400 w-12 h-12" />;
      case 'hash': return <Hash className="text-yellow-400 w-12 h-12" />;
      default: return <Gamepad2 className="text-cyan-400 w-12 h-12" />;
    }
  };

  // Helper para garantir URL física index.html e evitar fallback de rotas SPA do Vite (site dentro de site)
  const getGameUrl = (game: Game) => {
    let url = game.prefixUrl;
    if (!url) return '';
    if (!url.endsWith('.html')) {
      if (!url.endsWith('/')) {
        url += '/';
      }
      url += 'index.html';
    }
    return url;
  };

  // Helper para verificar se o jogo possui código físico implementado localmente
  const isPhysicalGame = (slug: string) => {
    return ['snake-retro', 'memory-match', 'space-defense', 'sudoku-zen', 'math-run', 'bubble-pop', 'rocket-rise'].includes(slug);
  };

  return (
    <div className={`flex flex-col min-h-screen ${agePreference === 'educacional' ? 'theme-edu' : agePreference === 'terceira_idade' ? 'theme-senior' : ''}`}>
      

      {/* --- LATERAL SQUARE ADS STACK (Widescreen Only) --- */}
      {consentOptions.advertising && (
        <>
          <div className="side-ads-wrapper-left">
            <div className="side-square-ad"></div>
            <div className="side-square-ad"></div>
            <div className="side-square-ad"></div>
            <div className="side-square-ad"></div>
          </div>
          <div className="side-ads-wrapper-right">
            <div className="side-square-ad"></div>
            <div className="side-square-ad"></div>
            <div className="side-square-ad"></div>
            <div className="side-square-ad"></div>
          </div>
        </>
      )}



      {/* --- CONTEÚDO PRINCIPAL --- */}
            <main className="container flex-grow py-8">
        
        {/* MASTER TOP LEADERBOARD AD (Maior Visibilidade - CPM Máximo) */}
        {consentOptions.advertising && (
          <div className="ad-slot-leaderboard mt-0 mb-8"></div>
        )}

        {['home', 'favorites', 'privacy', 'terms', 'contact', 'report'].includes(view) ? (
          <div className="bento-portal-wrapper">
            
            {/* 1. COLUNA DA ESQUERDA: SIDEBAR DE NAVEGAÇÃO COMPACTA */}
            <aside className="bento-sidebar-left">
              <div className="bento-sidebar-section-title">Menu Principal</div>
              <nav className="bento-sidebar-nav">
                <button 
                  className={`bento-nav-item ${view === 'home' && activeCategory === 'Tudo' ? 'active' : ''}`}
                  onClick={() => { setView('home'); setActiveCategory('Tudo'); setSelectedGame(null); }}
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>Início</span>
                </button>
                
                <button 
                 className={`bento-nav-item ${view === 'favorites' ? 'active' : ''}`}
                 onClick={() => { setView('favorites'); setSelectedGame(null); }}
                >
                 <Heart className={`w-4 h-4 ${favorites.length > 0 || view === 'favorites' ? 'fill-pink-500 text-pink-500' : ''}`} />
                 <span>Favoritos</span>
                 {favorites.length > 0 && (
                   <span className="bento-nav-badge bg-pink-600 text-white">
                     {favorites.length}
                   </span>
                 )}
                </button>

                <button 
                  className="bento-nav-item"
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                >
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Conta</span>
                </button>
              </nav>

              <div className="bento-sidebar-section-title flex items-center justify-between">
                <span>Categorias</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-500 transform rotate-90" />
              </div>
              <div className="bento-sidebar-nav pl-2 space-y-1">
                {categories.map((cat) => {
                  if (cat === 'Tudo') return null;
                  return (
                    <button
                      key={cat}
                      className={`bento-nav-item-sub ${view === 'home' && activeCategory === cat ? 'active' : ''}`}
                      onClick={() => { setView('home'); setActiveCategory(cat); setSelectedGame(null); }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${view === 'home' && activeCategory === cat ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              {/* Espaçador flexível para empurrar configurações e suporte para o rodapé */}
              <div className="flex-grow" />

              <div className="bento-sidebar-section-title">Ajustes & Legal</div>
              <div className="bento-sidebar-nav space-y-1">
                <button 
                  className={`bento-nav-item ${teaMode ? 'active bg-green-500/20 text-green-400 border-green-500/30' : ''}`}
                  onClick={() => setTeaMode(!teaMode)}
                >
                  <Settings className="w-4 h-4 text-green-400" />
                  <span>KRUUJ Calmo: {teaMode ? 'ON' : 'OFF'}</span>
                </button>

                {/* Submenu de Modos Editoriais na Sidebar (Fidelidade / Usabilidade) */}
                <div className="pl-2.5 pt-1 pb-2 border-l border-white/5 space-y-1 ml-4 my-2 select-none">
                  <button
                    className={`bento-nav-item-sub ${agePreference === 'geral' ? 'active' : ''}`}
                    onClick={() => { setView('home'); setAgePreference('geral'); setSelectedGame(null); }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${agePreference === 'geral' ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                    <span>KRUUJ Play</span>
                  </button>
                  <button
                    className={`bento-nav-item-sub ${agePreference === 'educacional' ? 'active' : ''}`}
                    onClick={() => { setView('home'); setAgePreference('educacional'); setSelectedGame(null); }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${agePreference === 'educacional' ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                    <span>KRUUJ Kids</span>
                  </button>
                  <button
                    className={`bento-nav-item-sub ${agePreference === 'bebes' ? 'active' : ''}`}
                    onClick={() => { setView('home'); setAgePreference('bebes'); setSelectedGame(null); }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${agePreference === 'bebes' ? 'bg-pink-500 shadow-[0_0_6px_rgba(244,114,182,0.4)]' : 'bg-gray-600'}`} />
                    <span>KRUUJ Baby</span>
                  </button>
                  <button
                    className={`bento-nav-item-sub ${agePreference === 'terceira_idade' ? 'active' : ''}`}
                    onClick={() => { setView('home'); setAgePreference('terceira_idade'); setSelectedGame(null); }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${agePreference === 'terceira_idade' ? 'bg-cyan-400' : 'bg-gray-600'}`} />
                    <span>KRUUJ 60+</span>
                  </button>
                </div>

                <button 
                  className={`bento-nav-item ${view === 'privacy' ? 'active' : ''}`}
                  onClick={() => { setView('privacy'); setSelectedGame(null); }}
                >
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Privacidade</span>
                </button>
                <button 
                  className={`bento-nav-item ${view === 'terms' ? 'active' : ''}`}
                  onClick={() => { setView('terms'); setSelectedGame(null); }}
                >
                  <FileText className="w-4 h-4 text-teal-400" />
                  <span>Termos</span>
                </button>
              </div>
            </aside>

            {/* 2. COLUNA CENTRAL: CONTEÚDO DINÂMICO */}
            <div className="bento-main-content">
              
              {/* VIEW: HOME */}
              {view === 'home' && (
                <div className="space-y-8">
                  
                  {/* Logotipo Centralizado de Alta Fidelidade (Mockup Alignment) */}
                  {!searchQuery && activeCategory === 'Tudo' && (
                    <div 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        textAlign: 'center', 
                        margin: '30px auto', 
                        width: '100%',
                        userSelect: 'none'
                      }}
                      className="animate-[fadeInUp_0.4s_ease-out_forwards]"
                    >
                      <div 
                        style={{ 
                          fontSize: '5.2rem',
                          filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.45))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          animation: 'float 4s ease-in-out infinite'
                        }}
                      >
                        🦉
                      </div>
                      <h1 
                        style={{ 
                          fontSize: '1.75rem', 
                          fontWeight: '900', 
                          color: '#fff', 
                          letterSpacing: '0.22em', 
                          textTransform: 'uppercase', 
                          marginTop: '16px',
                          fontFamily: "'Space Grotesk', 'Outfit', sans-serif" 
                        }}
                      >
                        KRUUJ <span className="text-pink-500">Play</span>
                      </h1>
                      <div 
                        style={{ 
                          width: '96px', 
                          height: '4px', 
                          background: 'linear-gradient(90deg, #00f0ff 0%, #ff007f 100%)', 
                          borderRadius: '4px', 
                          marginTop: '10px', 
                          opacity: 0.7 
                        }} 
                      />
                    </div>
                  )}

                  {/* SLOT DE ANÚNCIO SUPERIOR */}
                  {consentOptions.advertising && (
                    <div className="ad-slot-leaderboard"></div>
                  )}

                  {/* Seletor de Acessibilidade Mobile (Menu de Modos de Interação no Topo, visível apenas em celulares e tablets) */}
                  <div className="mobile-only-modes-bar select-none">
                    <button 
                      className={`pref-btn-mobile ${agePreference === 'geral' && !teaMode ? 'active-geral' : ''}`}
                      onClick={() => { setAgePreference('geral'); setTeaMode(false); }}
                    >
                      <Grid style={{ width: '16px', height: '16px' }} />
                      <span>Play</span>
                    </button>
                    <button 
                      className={`pref-btn-mobile ${teaMode ? 'active-tea' : ''}`}
                      onClick={() => setTeaMode(!teaMode)}
                    >
                      <Settings style={{ width: '16px', height: '16px' }} />
                      <span>Calmo</span>
                    </button>
                    <button 
                      className={`pref-btn-mobile ${agePreference === 'educacional' && !teaMode ? 'active-edu' : ''}`}
                      onClick={() => { setAgePreference('educacional'); setTeaMode(false); }}
                    >
                      <Award style={{ width: '16px', height: '16px' }} />
                      <span>Kids</span>
                    </button>
                    <button 
                      className={`pref-btn-mobile ${agePreference === 'bebes' && !teaMode ? 'active-bebes' : ''}`}
                      onClick={() => { setAgePreference('bebes'); setTeaMode(false); }}
                    >
                      <Sparkles style={{ width: '16px', height: '16px' }} />
                      <span>Baby</span>
                    </button>
                    <button 
                      className={`pref-btn-mobile ${agePreference === 'terceira_idade' && !teaMode ? 'active-senior' : ''}`}
                      onClick={() => { setAgePreference('terceira_idade'); setTeaMode(false); }}
                    >
                      <Star style={{ width: '16px', height: '16px' }} />
                      <span>60+</span>
                    </button>

                  </div>

                  {/* Grid de Jogos */}
                  <div className="space-y-4">
                    <h2 className="text-xl font-extrabold text-cyan-300 flex flex-wrap items-center gap-2">
                      <Grid className="w-6 h-6 text-cyan-400" />
                      <span>
                        {activeCategory === 'Tudo' ? 'Todos os Jogos' : `Jogos de ${activeCategory}`}
                        {agePreference !== 'geral' && (
                          <span className="text-pink-400">
                            {' '}do Filtro {
                              agePreference === 'educacional' ? 'KRUUJ Kids' : 
                              agePreference === 'bebes' ? 'KRUUJ Baby' : 
                              agePreference === 'terceira_idade' ? 'KRUUJ 60+' : 
                              agePreference === 'family' ? 'KRUUJ Family' : 
                              agePreference === 'edu' ? 'KRUUJ Edu' : 
                              'KRUUJ Premium'
                            }
                          </span>
                        )}
                      </span>
                    </h2>

                    {isCatalogLoading ? (
                      <div className="bento-grid-feed">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="skeleton-card">
                            <div className="skeleton-body" />
                            <div className="skeleton-title" />
                          </div>
                        ))}
                      </div>
                    ) : getFilteredGames().length === 0 ? (
                      <div className="glass-panel p-10 text-center text-gray-400 space-y-2">
                        <p>Nenhum jogo encontrado com os filtros selecionados.</p>
                        <button 
                          className="text-cyan-400 hover:underline text-sm font-semibold"
                          onClick={() => { setSearchQuery(''); setActiveCategory('Tudo'); setAgePreference('geral'); }}
                        >
                          Resetar Filtros
                        </button>
                      </div>
                    ) : (
                      <div className="bento-grid-feed">
                        {getFilteredGames().map((game, index) => {
                          let spanClass = 'bento-span-1x1';
                          const mod = index % 5;
                          if (mod === 0) spanClass = 'bento-span-2x1';
                          else if (mod === 2) spanClass = 'bento-span-1x2';
                          else if (mod === 3) spanClass = 'bento-span-2x2';
                          
                          return (
                            <div 
                              key={game.id}
                              className={`bento-card-wrapper ${spanClass} cursor-pointer group`}
                              onClick={() => handlePlayGame(game)}
                            >
                              <div className="bento-card-body glass-card">
                                {/* Pílula do Topo "KRUUJ" */}
                                <div className="bento-card-top-header">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  <span>KRUUJ Studio</span>
                                </div>

                                <div className="bento-card-image-wrapper">
                                  {renderGameCover(game)}
                                  
                                  <div 
                                    className="game-card-like-pill"
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                                    title={favorites.includes(game.id) ? 'Remover dos favoritos' : 'Favoritar este jogo'}
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(game.id) ? 'fill-pink-500 text-pink-500 animate-heart' : 'text-gray-400'}`} />
                                    <span>{likesCount[game.id] || 0}</span>
                                  </div>
                                </div>

                                <div className="bento-card-overlay">
                                  <span className="bento-card-badge">
                                    {game.category}
                                  </span>
                                  <p className="bento-card-desc">
                                    {game.description}
                                  </p>
                                  <div className="bento-card-footer">
                                    <span className="bento-card-rating">
                                      Class: {game.ageRating}
                                    </span>
                                    <span className="bento-card-play-btn">
                                      🎮 JOGAR
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Título de Altíssimo Contraste Debaixo do Card (Mockup Alignment) */}
                              <div className="bento-card-title-under">
                                {game.title}
                              </div>
                            </div>
                          );
                        })}

                        {/* IN-FEED AD SLOT CARD - Bento Style */}
                        {consentOptions.advertising && (
                          <div className="bento-card ad-slot-card bento-span-2x1 flex-center">
                            <div className="text-center p-4">
                              <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-widest mb-1">Anúncio Patrocinado</span>
                              <p className="text-xs text-gray-400 font-semibold">Espaço Publicitário de Alta Fidelidade (RPM)</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {view === 'favorites' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-extrabold text-pink-500 flex items-center gap-2">
                    <Heart className="w-7 h-7 fill-current" /> Meus Favoritos
                  </h2>

                  {games.filter(g => favorites.includes(g.id)).length === 0 ? (
                    <div className="glass-panel p-10 text-center text-gray-400">
                      Você ainda não adicionou nenhum jogo aos favoritos. Explore o catálogo para encontrar seus preferidos!
                    </div>
                  ) : (
                    <div className="bento-grid-feed">
                      {games.filter(g => favorites.includes(g.id)).map((game, index) => {
                        let spanClass = 'bento-span-1x1';
                        const mod = index % 5;
                        if (mod === 0) spanClass = 'bento-span-2x1';
                        else if (mod === 2) spanClass = 'bento-span-1x2';
                        else if (mod === 3) spanClass = 'bento-span-2x2';
                        
                        return (
                          <div 
                            key={game.id}
                            className={`bento-card glass-card ${spanClass} cursor-pointer group`}
                            onClick={() => handlePlayGame(game)}
                          >
                            <div className="bento-card-image-wrapper">
                              {renderGameCover(game)}
                              
                              <div 
                                className="game-card-like-pill"
                                onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                                  title={favorites.includes(game.id) ? 'Remover dos favoritos' : 'Favoritar este jogo'}
                              >
                                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-heart" />
                                <span>{likesCount[game.id] || 0}</span>
                              </div>
                            </div>

                            <div className="bento-card-overlay">
                              <span className="bento-card-badge">
                                {game.category}
                              </span>
                              <h3 className="bento-card-title">
                                {game.title}
                              </h3>
                              <p className="bento-card-desc">
                                {game.description}
                              </p>
                              <div className="bento-card-footer">
                                <span className="bento-card-rating">
                                  Class: {game.ageRating}
                                </span>
                                <span className="bento-card-play-btn text-pink-500">
                                  🎮 JOGAR
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {view === 'privacy' && (
                <div className="glass-panel p-8 space-y-6 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-extrabold text-cyan-300">Política de Privacidade (LGPD)</h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    No **KRUUJ**, respeitamos rigorosamente a privacidade dos nossos visitantes e jogadores de conformidade com a Lei Geral de Proteção de Dados (LGPD) e o ECA. 
                    Garantimos coleta mínima de dados: nenhuma informação pessoal é obrigatória para jogar ou se cadastrar (exigimos apenas nome de usuário e senha). 
                    A declaração de faixa etária é opcional e serve exclusivamente para ajustar a curadoria editorial dos jogos na tela inicial.
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Para crianças menores de 12 anos, garantimos que a publicidade é estritamente não personalizada e nenhum profiling comportamental é realizado. 
                    Você pode habilitar ou desabilitar cookies de analíticas e marketing a qualquer momento através do nosso painel de privacidade no rodapé.
                  </p>
                  <button className="btn-secondary py-2 px-4" onClick={() => setView('home')}>Voltar ao Portal</button>
                </div>
              )}

              {view === 'terms' && (
                <div className="glass-panel p-8 space-y-6 max-w-4xl mx-auto">
                  <h2 className="text-2xl font-extrabold text-cyan-300">Termos de Uso</h2>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Ao utilizar o KRUUJ, você concorda com nossos termos. O portal oferece jogos casuais em formato HTML5 incorporados via iframe em sandbox isoladas para a sua segurança.
                    Todos os jogos listados possuem licenciamento amplo comercial comprovado ou cessão patrimonial de direitos autorais de conformidade com a legislação brasileira (Lei nº 9.610/98 e Lei nº 9.609/98).
                  </p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    É estritamente proibido tentar violar os sandboxes dos jogos, fazer scraping do portal ou distribuir os arquivos de jogos estáticos sem prévia autorização contratual por escrito dos autores.
                  </p>
                  <button className="btn-secondary py-2 px-4" onClick={() => setView('home')}>Voltar ao Portal</button>
                </div>
              )}

              {view === 'contact' && (
                <div className="glass-panel p-8 space-y-6 max-w-lg mx-auto">
                  <h2 className="text-2xl font-extrabold text-cyan-300">Fale Conosco</h2>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada com sucesso! Responderemos em até 48 horas.'); setView('home'); }} className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Nome:</label>
                      <input type="text" className="input-field" required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Assunto:</label>
                      <input type="text" className="input-field" required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Mensagem:</label>
                      <textarea rows={4} className="input-field resize-none" required></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center">Enviar Mensagem</button>
                  </form>
                </div>
              )}

              {view === 'report' && (
                <div className="glass-panel p-8 space-y-6 max-w-lg mx-auto">
                  <h2 className="text-2xl font-extrabold text-pink-500">Denunciar Conteúdo</h2>
                  <p className="text-xs text-gray-400">
                    Valorizamos os direitos autorais e as licenças comerciais. Se você identificou qualquer jogo que viole direitos patrimoniais, informe no formulário abaixo com as devidas comprovações para remoção imediata.
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Denúncia recebida e registrada no workflow editorial para análise técnica e jurídica.'); setView('home'); }} className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Seu Nome / Empresa:</label>
                      <input type="text" className="input-field" required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">URL / Título do Jogo:</label>
                      <input type="text" className="input-field" required />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Detalhes da Violação / Licença Conflitante:</label>
                      <textarea rows={4} className="input-field resize-none" required></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center bg-pink-600 hover:bg-pink-700">Enviar Denúncia</button>
                  </form>
                </div>
              )}

            </div>

            {/* 3. COLUNA DA DIREITA: PAINEL SOCIAL / INTERATIVO */}
            <aside className="bento-sidebar-right">
              {/* Widget de Perfil do Usuário */}
              <div className="bento-profile-card">
                {user ? (
                  <div className="flex flex-col h-full justify-between select-none" style={{ boxSizing: 'border-box', padding: '4px 0' }}>
                    {/* Linha 1: Avatar, Identidade e Sair */}
                    <div className="flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar Premium Circular Neon */}
                        <div 
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: '900',
                            fontSize: '0.78rem',
                            border: '1.5px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 0 8px rgba(0, 240, 255, 0.2)',
                            flexShrink: 0
                          }}
                        >
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        
                        <div className="min-w-0">
                          <div className="font-extrabold text-white text-xs truncate leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Olá, {user.username}!
                          </div>
                          <span className="text-[8px] text-cyan-400 font-extrabold uppercase tracking-widest block mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {user.role === 'super_admin' ? 'Admin VIP' : 'Jogador VIP'}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleLogout} 
                        style={{
                          background: 'rgba(255, 69, 101, 0.08)',
                          border: '1px solid rgba(255, 69, 101, 0.2)',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#ff4565',
                          cursor: 'pointer',
                          transition: 'all 0.25s',
                          boxShadow: '0 0 8px rgba(255, 69, 101, 0.1)',
                          flexShrink: 0
                        }}
                        className="hover-logout-btn"
                        title="Sair da Conta"
                      >
                        <LogOut style={{ width: '11px', height: '11px' }} />
                      </button>
                    </div>
                    
                    {/* Linha 2: XP e Progresso de Nível Estendido */}
                    <div className="space-y-1.5 flex-grow flex flex-col justify-end">
                      <div className="flex justify-between items-center text-[8px] font-extrabold text-gray-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        <span className="bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-[8px] text-cyan-400 font-bold">NÍVEL 12</span>
                        <span className="text-gray-500">XP: <strong className="text-white font-mono">1420 / 2000</strong></span>
                      </div>
                      <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <div className="h-full bg-gradient-to-r from-cyan-400 via-[#8a2be2] to-pink-500 rounded-full" style={{ width: '70%', transition: 'width 1s ease' }} />
                      </div>
                    </div>

                    {/* Linha 3: Atalho de Área Administrativa para Super Admins */}
                    {user.role === 'super_admin' && (
                      <button 
                        onClick={() => { setView('admin'); setSelectedGame(null); }}
                        style={{
                          width: '100%',
                          background: 'rgba(0, 240, 255, 0.08)',
                          border: '1px solid rgba(0, 240, 255, 0.2)',
                          borderRadius: '8px',
                          padding: '5px',
                          color: 'var(--accent-cyan)',
                          fontWeight: '800',
                          fontSize: '0.62rem',
                          cursor: 'pointer',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          boxShadow: '0 0 8px rgba(0, 240, 255, 0.1)',
                          transition: 'all 0.25s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          fontFamily: "'Outfit', sans-serif",
                          marginTop: '6px'
                        }}
                        className="btn-admin-profile-shortcut"
                        title="Abrir Cockpit Administrativo"
                      >
                        ⚙️ Área Administrativa
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col h-full justify-between select-none" style={{ boxSizing: 'border-box', padding: '4px 0' }}>
                    {/* Linha 1: Título e Status */}
                    <div className="flex items-center gap-2.5">
                      <div 
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#8f9cae',
                          flexShrink: 0
                        }}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <div className="font-extrabold text-white text-xs leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          Jogador Visitante
                        </div>
                        <span className="text-[9px] text-gray-500 block mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          Crie uma conta para salvar dados!
                        </span>
                      </div>
                    </div>
                    
                    {/* Linha 2: Vantagens Simplificadas */}
                    <div className="text-left text-[9px] text-gray-500 font-medium px-1 leading-normal">
                      🎁 Conecte-se para salvar seus jogos favoritos e gravar recordes nos rankings de pontuação.
                    </div>
                    
                    {/* Linha 3: Botão Conectar */}
                    <button 
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #00f0ff 0%, #8a2be2 100%)',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px',
                        color: '#000',
                        fontWeight: '900',
                        fontSize: '0.68rem',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        boxShadow: '0 4px 12px rgba(0, 240, 255, 0.2)',
                        transition: 'all 0.25s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        fontFamily: "'Outfit', sans-serif"
                      }}
                      className="btn-connect-sidebar"
                      onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    >
                      <LogIn style={{ width: '11px', height: '11px' }} />
                      <span>Conectar Conta</span>
                    </button>
                  </div>
                )}
              </div>



              {/* Widget de Histórico de Jogos Recentes (Fase 1 - Requisito MVP) */}
              <div className="bento-chat-card flex flex-col min-h-[260px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-2 shrink-0">
                  <FileText className="w-4 h-4 text-pink-500" />
                  <span>Jogados Recentemente</span>
                </div>

                {/* Lista de Recentes */}
                <div className="flex-grow overflow-y-auto max-h-[440px] space-y-2.5 pr-1 mb-2 bento-sidebar-scroll">
                  {games.filter(g => recentGames.slice(0, 5).some(play => play.id === g.id)).length === 0 ? (
                    <div className="text-center text-gray-500 text-xs py-10 select-none">
                      Nenhum jogo jogado recentemente. Explore o catálogo!
                    </div>
                  ) : (
                    // Renderiza estritamente os 5 últimos jogos jogados na barra lateral para economizar espaço
                    recentGames
                      .slice(0, 5)
                      .map(play => ({ play, g: games.find(g => g.id === play.id) }))
                      .filter((item): item is { play: RecentPlay, g: Game } => !!item.g)
                      .map(({ play, g }) => (
                        <div 
                          key={g.id} 
                          className="kruuj-history-item"
                          onClick={() => handlePlayGame(g)}
                        >
                          {g.bannerUrl ? (
                            <img 
                              src={g.bannerUrl} 
                              alt={g.title} 
                              className="kruuj-history-cover"
                            />
                          ) : (
                            <div className="kruuj-history-cover-fallback">
                              <Gamepad2 style={{ width: '13px', height: '13px' }} />
                            </div>
                          )}
                          <div className="flex-grow min-w-0 text-left">
                            <div className="kruuj-history-title">{g.title}</div>
                            <div className="flex items-center justify-between gap-2 mt-0.5">
                              <div className="kruuj-history-category">{g.category}</div>
                              <span className="text-[8px] text-gray-500 font-extrabold uppercase font-mono tracking-wider">{formatRelativeTime(play.timestamp)}</span>
                            </div>
                          </div>
                          <button 
                            className="kruuj-history-btn select-none shrink-0"
                            onClick={(e) => { e.stopPropagation(); handlePlayGame(g); }}
                          >
                            JOGAR
                          </button>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </aside>

          </div>
        ) : (
          /* VIEWS DE JOGO EM FOCO OU ÁREA ADMINISTRATIVA INTEIRA */
          <>
            {view === 'playing' && selectedGame && !isScreenLocked && (
              <div className="space-y-6">
                
                {/* Header de Navegação do Jogo */}
                <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0f111a]/60 p-4 rounded-xl border border-white/5">
                  <button 
                    className="btn-secondary py-2 px-4" 
                    onClick={triggerExitGame}
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Portal
                  </button>

                  <h2 className="text-xl font-extrabold text-cyan-300 neon-glow-cyan">
                    {selectedGame.title}
                  </h2>

                  <button 
                    className={`like-action-btn ${favorites.includes(selectedGame.id) ? 'liked' : ''}`}
                    onClick={() => handleToggleFavorite(selectedGame.id)}
                    title={favorites.includes(selectedGame.id) ? 'Remover dos Favoritos' : 'Favoritar este Jogo'}
                  >
                    <Heart className="w-5 h-5" />
                    <span className="like-text">
                      {favorites.includes(selectedGame.id) ? 'Curtido!' : 'Curtir'}
                    </span>
                    <span className="like-divider"></span>
                    <span className="like-count">
                      {likesCount[selectedGame.id] || 0}
                    </span>
                  </button>
                </div>

                {/* Jogo em Destaque Cinema (100% largura e Centrado!) */}
                <div className="iframe-container relative">
                  {/* Botão de Escape Flutuante (X) */}
                  <button 
                    className="bento-game-floating-close"
                    style={{ right: '68px', zIndex: 100000 }}
                    onClick={triggerExitGame}
                    title="Fechar Jogo e Voltar"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Botão de Fullscreen (Sempre à mostra) */}
                  <button 
                    className="bento-game-floating-close"
                    style={{ right: '16px', zIndex: 100000 }}
                    onClick={(e) => { e.stopPropagation(); handleManualFullscreen(); }}
                    title="Tela Cheia"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>

                  {/* Botão de Bloqueio Infantil Flutuante (Parental Lock) */}
                  <button 
                    className="bento-game-floating-lock"
                    style={{ right: '120px', zIndex: 100000 }}
                    onClick={() => {
                      setAgePreference('bebes');
                      setIsScreenLocked(true);
                      if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen().catch(() => {});
                      }
                    }}
                    title="Bloquear Tela (Modo Bebês)"
                  >
                    <Lock className="w-4 h-4" />
                  </button>

                  {isPlayingGame ? (
                    isPhysicalGame(selectedGame.slug) ? (
                      <iframe
                        key={selectedGame.id}
                        src={getGameUrl(selectedGame)}
                        sandbox="allow-scripts allow-same-origin allow-forms"
                        allow="fullscreen; autoplay"
                        allowFullScreen
                        title={selectedGame.title}
                      ></iframe>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 p-6 text-center space-y-4">
                        <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-950/80 px-3 py-1 rounded-full border border-yellow-500/20">
                          🛡️ CIRCUITO EM MANUTENÇÃO EDITORIAL
                        </span>
                        <h3 className="text-lg font-bold text-white">Próximo Lançamento</h3>
                        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                          Este circuito está em fase de auditoria jurídica de direitos autorais e testes de controle de toque. Estará online em breve!
                        </p>
                        <button 
                          className="btn-secondary py-1.5 px-4 text-xs font-bold"
                          onClick={() => { setView('home'); setSelectedGame(null); setIsPlayingGame(false); }}
                        >
                          Voltar ao Catálogo
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95">
                      <p className="text-cyan-400 font-bold mb-4 neon-glow-cyan">Injetando chips estelares...</p>
                    </div>
                  )}
                </div>

                {/* SLOT DE ANÚNCIO LEADERBOARD DEBAIXO DO JOGO */}
                {consentOptions.advertising && (
                  <div className="ad-slot-leaderboard"></div>
                )}

                {/* LAYOUT DE INFORMAÇÕES DEBAIXO DO JOGO */}
                <div className="play-info-split">
                  
                  {/* COLUNA ESQUERDA */}
                  <div className="space-y-6">
                    
                    {/* Descrição do Jogo */}
                    <div className="glass-panel p-6 space-y-4">
                      <h3 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cyan-400" /> Descrição do Circuito
                      </h3>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                        {selectedGame.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                        {selectedGame.tags.map(t => (
                          <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-cyan-950/40 text-cyan-300 border border-cyan-800/20 font-bold">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Grid Premium de Recomendados */}
                    <div className="space-y-4">
                      <h3 className="text-md font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                        <Grid className="w-5 h-5 text-cyan-400" /> Continue Jogando (Sugeridos)
                      </h3>
                      <div className="game-grid">
                        {getRelatedGames(selectedGame).map(game => (
                          <div 
                            key={game.id}
                            className="glass-card p-4 flex flex-col justify-between cursor-pointer group"
                            onClick={() => handlePlayGame(game)}
                          >
                            <div>
                              <div className="game-card-icon-container">
                                {renderGameCover(game)}
                                
                                <div 
                                  className="game-card-like-pill"
                                  onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                                  title={favorites.includes(game.id) ? 'Remover dos favoritos' : 'Favoritar este jogo'}
                                >
                                  <Heart className={`w-3.5 h-3.5 ${favorites.includes(game.id) ? 'fill-pink-500 text-pink-500 animate-heart' : 'text-gray-400'}`} />
                                  <span>{likesCount[game.id] || 0}</span>
                                </div>
                              </div>
                              <h4 className="font-bold text-sm tracking-tight text-white truncate group-hover:text-cyan-400 transition">{game.title}</h4>
                              <p className="text-[11px] text-purple-300 font-bold uppercase mt-1">{game.category}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                              <span className="text-[10px] text-gray-400">Class: {game.ageRating}</span>
                              <span className="text-[10px] font-bold text-cyan-400 font-mono">🎮 JOGAR</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* COLUNA DIREITA */}
                  <div className="info-panel">
                    
                    {/* Ficha Técnica & Controles */}
                    <div className="glass-panel p-6 space-y-4">
                      <h3 className="text-md font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wider">
                        <Settings className="w-4 h-4 text-cyan-400" /> Especificações & Controles
                      </h3>
                      
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-gray-400">Desenvolvedor:</span>
                          <span className="font-bold text-purple-300">{selectedGame.author}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-gray-400">Acordo Licença:</span>
                          <span className="font-bold text-green-400">{selectedGame.licenseName}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-gray-400">Classificação:</span>
                          <span className="font-extrabold text-cyan-400">{selectedGame.ageRating}</span>
                        </div>
                        
                        <div className="pt-2">
                          <span className="text-gray-400 block mb-2">Compatibilidade:</span>
                          <div className="flex gap-2">
                            <div className={`p-2 rounded-lg flex flex-col items-center gap-1 flex-1 ${selectedGame.controls.toque ? 'bg-cyan-950/40 border border-cyan-500/25 text-cyan-400' : 'bg-white/5 text-gray-600'}`}>
                              <Smartphone className="w-4 h-4" />
                              <span className="text-[9px]">Toque</span>
                            </div>
                            <div className={`p-2 rounded-lg flex flex-col items-center gap-1 flex-1 ${selectedGame.controls.teclado ? 'bg-cyan-950/40 border border-cyan-500/25 text-cyan-400' : 'bg-white/5 text-gray-600'}`}>
                              <Gamepad2 className="w-4 h-4" />
                              <span className="text-[9px]">Teclado</span>
                            </div>
                            <div className={`p-2 rounded-lg flex flex-col items-center gap-1 flex-1 ${selectedGame.controls.mouse ? 'bg-cyan-950/40 border border-cyan-500/25 text-cyan-400' : 'bg-white/5 text-gray-600'}`}>
                              <Volume2 className="w-4 h-4" />
                              <span className="text-[9px]">Mouse</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SLOT DE ANÚNCIO RETANGULAR LATERAL */}
                    {consentOptions.advertising && (
                      <div className="ad-slot-rectangle"></div>
                    )}

                  </div>
                </div>
              </div>
            )}

            {view === 'admin' && user && user.role !== 'user' && (
              <div className="space-y-6 text-left">
                {/* Header com Abas em formato de Cápsula Segmentada Premium */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#07080e]/90 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl">
                  <button 
                    className="btn-secondary py-2 px-4 flex items-center gap-2 text-xs font-bold border border-white/10 hover:border-cyan-500/30 text-gray-300 hover:text-white transition rounded-xl shrink-0" 
                    onClick={() => setView('home')}
                  >
                    <ArrowLeft className="w-4 h-4 text-cyan-400" /> Voltar ao Portal
                  </button>
                  
                  <h2 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2 font-mono">
                    <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow shrink-0" />
                    <span>Cockpit de Administração</span>
                  </h2>
                  
                  <div className="flex bg-black/50 p-1 rounded-full border border-white/5 gap-1 shrink-0">
                    <button 
                      className={`text-[10px] uppercase tracking-wider font-extrabold py-1.5 px-4 rounded-full transition-all duration-300 flex items-center gap-1.5 ${adminTab === 'contracts' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] font-black' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => { setAdminTab('contracts'); setAdminViewMode('list'); }}
                    >
                      <FileSignature className="w-3.5 h-3.5" /> Contratos & Jogos
                    </button>
                    <button 
                      className={`text-[10px] uppercase tracking-wider font-extrabold py-1.5 px-4 rounded-full transition-all duration-300 flex items-center gap-1.5 ${adminTab === 'dashboard' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] font-black' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => { setAdminTab('dashboard'); setAdminViewMode('list'); }}
                    >
                      <BarChart3 className="w-3.5 h-3.5" /> Analytics & IA
                    </button>
                    <button 
                      className={`text-[10px] uppercase tracking-wider font-extrabold py-1.5 px-4 rounded-full transition-all duration-300 flex items-center gap-1.5 ${adminTab === 'users' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] font-black' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => { setAdminTab('users'); setAdminViewMode('list'); }}
                    >
                      <Users className="w-3.5 h-3.5" /> Usuários
                    </button>
                  </div>
                </div>

                {/* TAB 1: CONTRACTS & GAMES INTEGRATED MANAGEMENT */}
                {adminTab === 'contracts' && (
                  <div className="space-y-6">
                    {adminViewMode === 'list' ? (
                      <div className="glass-panel p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-md font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>
                              Matriz de Contratos & Licenciamento
                            </h3>
                            <p className="text-xs text-gray-400">
                              Gerencie fichas técnicas de jogos, conformidade jurídica e acordos comerciais ativos.
                            </p>
                          </div>
                          <button 
                            className="btn-primary py-2 px-4 flex items-center gap-1.5"
                            onClick={handleAdminAddClick}
                          >
                            <Plus className="w-4 h-4" /> Cadastrar Novo Jogo e Contrato
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table>
                            <thead>
                              <tr>
                                <th>Contrato / Jogo</th>
                                <th>Licenciante (Autor)</th>
                                <th>Tipo de Licença</th>
                                <th>Rev Share / Fixo</th>
                                <th>Status Técnico</th>
                                <th>Status Editorial</th>
                                <th>Dossiê Jurídico</th>
                                <th className="text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {adminCatalog.map((item) => (
                                <tr key={item.game.id}>
                                  <td>
                                    <div>
                                      <div className="font-bold text-white text-xs">{item.game.title}</div>
                                      <div className="text-[9px] text-cyan-400 font-mono mt-0.5">Reg: {item.contract?.contractNumber || 'PENDENTE'}</div>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="font-semibold text-white text-xs">{item.contract?.signatoryCreator || item.game.author || 'N/A'}</div>
                                    <div className="text-[9px] text-gray-400 font-medium">Rep: {item.contract?.signatoryRepresentative || 'Representante Legal'}</div>
                                  </td>
                                  <td>
                                    <span className="font-bold text-xs text-purple-300 block">{item.contract?.licenseType || 'Licença de Uso'}</span>
                                    <span className="text-[9px] text-gray-500 font-semibold uppercase">{item.contract?.exclusivityScope || 'Não Exclusivo'}</span>
                                  </td>
                                  <td className="font-mono text-xs">
                                    <div className="text-cyan-400 font-bold">{item.contract?.revenueSharePercent || 0}% Share</div>
                                    <div className="text-gray-500 text-[10px]">R$ {item.contract?.fixedPaymentAmount || 0} Fixo</div>
                                  </td>
                                  <td>{getTechnicalBadge(item.game.statusTechnical)}</td>
                                  <td>{getEditorialBadge(item.game.statusEditorial)}</td>
                                  <td>{getDocBadge(item.game.statusDoc)}</td>
                                  <td>
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        className="p-1.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-400 transition"
                                        title="Editar Ficha e Contrato"
                                        onClick={() => handleAdminEditClick(item)}
                                      >
                                        <Edit2 className="w-3.5 h-3.5" />
                                      </button>
                                      {item.contract && (
                                        <button 
                                          className="p-1.5 rounded bg-white/5 hover:bg-green-500/20 text-green-400 transition"
                                          title="Dossiê de Licenciamento"
                                          onClick={() => setAdminSelectedDossier(item)}
                                        >
                                          <FileText className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                      <button 
                                        className="p-1.5 rounded bg-white/5 hover:bg-red-500/20 text-red-400 transition"
                                        title="Deletar Jogo"
                                        onClick={() => handleAdminDeleteGame(item.game.id)}
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
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
                      <div className="glass-panel p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-md font-bold text-white uppercase tracking-wider">
                              {adminViewMode === 'add' ? 'Cadastrar Novo Jogo e Acordo' : 'Editar Ficha Técnica & Contrato'}
                            </h3>
                            <p className="text-xs text-gray-400">
                              Preencha as especificações técnicas, metadados editoriais e as informações do licenciamento em cascata.
                            </p>
                          </div>
                          <button 
                            className="btn-secondary py-1.5 px-4 text-xs font-bold"
                            onClick={() => setAdminViewMode('list')}
                          >
                            Cancelar
                          </button>
                        </div>

                        <form onSubmit={handleAdminSaveSubmit} className="space-y-6 text-left">
                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-widest border-b border-cyan-950 pb-1">
                              1. Metadados & Ficha Técnica do Jogo
                            </h4>
                            
                            <div className="form-grid">
                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Título do Jogo:</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.title} onChange={(e) => setFormGame({...formGame, title: e.target.value})}
                                  placeholder="Ex: Tetris Neon"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Slug Único do Iframe:</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.slug} onChange={(e) => setFormGame({...formGame, slug: e.target.value})}
                                  placeholder="Ex: tetris-neon"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Categoria Principal:</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.category} onChange={(e) => setFormGame({...formGame, category: e.target.value})}
                                >
                                  <option value="Arcade">Arcade</option>
                                  <option value="Memória">Memória</option>
                                  <option value="Ação">Ação</option>
                                  <option value="Educacional">Educacional</option>
                                  <option value="Terceira Idade">Terceira Idade</option>
                                  <option value="Bebês">Bebês</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Versão:</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.version} onChange={(e) => setFormGame({...formGame, version: e.target.value})}
                                  placeholder="Ex: 1.0.0"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">URL de Origem (Capa/Banner):</label>
                                <input 
                                  type="text" className="form-input"
                                  value={formGame.bannerUrl} onChange={(e) => setFormGame({...formGame, bannerUrl: e.target.value})}
                                  placeholder="Ex: https://images.unsplash.com/..."
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Caminho Relativo Iframe (prefixUrl):</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.prefixUrl} onChange={(e) => setFormGame({...formGame, prefixUrl: e.target.value})}
                                  placeholder="Ex: /games/tetris-neon/"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Subcategorias (separadas por vírgula):</label>
                                <input 
                                  type="text" className="form-input"
                                  value={formGame.subcategories} onChange={(e) => setFormGame({...formGame, subcategories: e.target.value})}
                                  placeholder="Ex: Puzzle,Lógica,Casual"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Tags de Busca (separadas por vírgula):</label>
                                <input 
                                  type="text" className="form-input"
                                  value={formGame.tags} onChange={(e) => setFormGame({...formGame, tags: e.target.value})}
                                  placeholder="Ex: blocos,encaixe,neon"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Estúdio Autor / Desenvolvedor:</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.author} onChange={(e) => setFormGame({...formGame, author: e.target.value})}
                                  placeholder="Ex: Pixel Games Ltd"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Nome do Acordo de Licença:</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.licenseName} onChange={(e) => setFormGame({...formGame, licenseName: e.target.value})}
                                  placeholder="Ex: Licença Comercial Não Exclusiva"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Orientação Física:</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.orientation} onChange={(e) => setFormGame({...formGame, orientation: e.target.value as any})}
                                >
                                  <option value="both">Ambas (both)</option>
                                  <option value="landscape">Paisagem (landscape)</option>
                                  <option value="portrait">Retrato (portrait)</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Classificação Indicativa (ECA):</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.ageRating} onChange={(e) => setFormGame({...formGame, ageRating: e.target.value})}
                                >
                                  <option value="Livre">Livre</option>
                                  <option value="10+">10+</option>
                                  <option value="14+">14+</option>
                                  <option value="18+">18+</option>
                                </select>
                              </div>
                            </div>

                            <div className="bg-[#0b0c14] p-3 rounded-lg border border-white/5 space-y-2">
                              <label className="text-xs text-gray-400 font-bold block">Compatibilidade e Controles:</label>
                              <div className="flex flex-wrap gap-4 text-xs text-white">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input 
                                    type="checkbox" checked={formGame.mouse}
                                    onChange={(e) => setFormGame({...formGame, mouse: e.target.checked})}
                                  /> Suporta Mouse / Clique
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input 
                                    type="checkbox" checked={formGame.teclado}
                                    onChange={(e) => setFormGame({...formGame, teclado: e.target.checked})}
                                  /> Suporta Teclado (Setas/WASD)
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input 
                                    type="checkbox" checked={formGame.toque}
                                    onChange={(e) => setFormGame({...formGame, toque: e.target.checked})}
                                  /> Suporta Tela de Toque (Mobile Touch)
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input 
                                    type="checkbox" checked={formGame.gamepad}
                                    onChange={(e) => setFormGame({...formGame, gamepad: e.target.checked})}
                                  /> Suporta Controle Gamepad
                                </label>
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="text-xs text-gray-400 block">Descrição Editorial Comercial:</label>
                              <textarea 
                                rows={3} className="form-input resize-none" required
                                value={formGame.description} onChange={(e) => setFormGame({...formGame, description: e.target.value})}
                                placeholder="Descrição completa do jogo para SEO..."
                              />
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-pink-400 uppercase tracking-widest border-b border-pink-950 pb-1">
                              2. Dossiê Legal & Acordo de Licenciamento (LGPD/ECA)
                            </h4>

                            <div className="form-grid">
                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Código Único do Contrato:</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.contractNumber} onChange={(e) => setFormGame({...formGame, contractNumber: e.target.value})}
                                  placeholder="Ex: CON-2026-008"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Licenciante (Pessoa Física ou Jurídica):</label>
                                <input 
                                  type="text" className="form-input" required
                                  value={formGame.signatoryCreator} onChange={(e) => setFormGame({...formGame, signatoryCreator: e.target.value})}
                                  placeholder="Razão Social ou Nome Completo do Autor"
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Tipo de Licença:</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.licenseType} onChange={(e) => setFormGame({...formGame, licenseType: e.target.value})}
                                >
                                  <option value="Proprietário (In-house)">Proprietário (In-house)</option>
                                  <option value="Licença Comercial Exclusiva Digital">Licença Comercial Exclusiva Digital</option>
                                  <option value="Licença Comercial Não Exclusiva">Licença Comercial Não Exclusiva</option>
                                  <option value="Cessão de Propriedade Intelectual">Cessão de Propriedade Intelectual</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Escopo de Exclusividade:</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.exclusivityScope} onChange={(e) => setFormGame({...formGame, exclusivityScope: e.target.value})}
                                >
                                  <option value="Exclusivo Total">Exclusivo Total</option>
                                  <option value="Exclusivo Brasil">Exclusivo Brasil</option>
                                  <option value="Não Exclusivo">Não Exclusivo / Global</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Duração do Acordo (Meses):</label>
                                <input 
                                  type="number" className="form-input" required
                                  value={formGame.durationMonths} onChange={(e) => setFormGame({...formGame, durationMonths: Number(e.target.value)})}
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Repasse de Receita / Revenue Share (%):</label>
                                <input 
                                  type="number" step="0.1" className="form-input" required
                                  value={formGame.revenueSharePercent} onChange={(e) => setFormGame({...formGame, revenueSharePercent: Number(e.target.value)})}
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Pagamento Fixo Adiantado (R$):</label>
                                <input 
                                  type="number" className="form-input" required
                                  value={formGame.fixedPaymentAmount} onChange={(e) => setFormGame({...formGame, fixedPaymentAmount: Number(e.target.value)})}
                                />
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Representante Legal (Signatário):</label>
                                <input 
                                  type="text" className="form-input"
                                  value={formGame.signatoryRepresentative} onChange={(e) => setFormGame({...formGame, signatoryRepresentative: e.target.value})}
                                  placeholder="Nome do procurador/representante"
                                />
                              </div>
                            </div>

                            <div className="bg-[#0b0c14] p-3 rounded-lg border border-white/5 text-xs text-white">
                              <label className="flex items-center gap-1.5 cursor-pointer font-bold">
                                <input 
                                  type="checkbox" checked={formGame.termsAccepted}
                                  onChange={(e) => setFormGame({...formGame, termsAccepted: e.target.checked})}
                                  required
                                /> Contrato de cessão e termos de conformidade e auditoria de direitos autorais aceitos formalmente
                              </label>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-sm font-bold text-yellow-400 uppercase tracking-widest border-b border-yellow-950 pb-1">
                              3. Workflow Editorial & Auditoria Técnica
                            </h4>

                            <div className="form-grid">
                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Fase de Teste Técnico (Sandbox/Toque):</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.statusTechnical} onChange={(e) => setFormGame({...formGame, statusTechnical: e.target.value})}
                                >
                                  <option value="aprovado">Aprovado e Homologado (Sem Bugs)</option>
                                  <option value="pendente_teste">Pendente Homologação / Controle de Toque</option>
                                  <option value="rejeitado">Rejeitado (Apresenta Bugs de Sandbox)</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Status Editorial (Exibição Homepage):</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.statusEditorial} onChange={(e) => setFormGame({...formGame, statusEditorial: e.target.value})}
                                >
                                  <option value="publicado">Publicado (Visível para o Público)</option>
                                  <option value="rascunho">Rascunho Editorial (Oculto)</option>
                                  <option value="em_análise">Em Análise / Auditoria de Curadoria</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label className="text-xs text-gray-400 block">Auditoria Documentação de Direitos:</label>
                                <select 
                                  className="form-input" required
                                  value={formGame.statusDoc} onChange={(e) => setFormGame({...formGame, statusDoc: e.target.value})}
                                >
                                  <option value="aprovado">Cadeia de Direitos Aprovada (100% OK)</option>
                                  <option value="documentacao_pendente">Pendência Jurídica / Dossiê Incompleto</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 pt-4 border-t border-white/5">
                            <button 
                              type="button" className="btn-secondary flex-1 py-2.5 justify-center"
                              onClick={() => setAdminViewMode('list')}
                            >
                              Cancelar e Voltar
                            </button>
                            <button type="submit" className="btn-primary flex-grow py-2.5 justify-center font-bold">
                              Salvar Registro e Contrato
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: ANALYTICS & IA (Audit Upgrades) */}
                {adminTab === 'dashboard' && (
                  <div className="space-y-6">
                    <div className="glass-panel p-6 space-y-6">
                      <div className="border-b border-white/5 pb-4">
                        <h3 className="text-md font-bold text-white uppercase tracking-wider">
                          Painel de Analytics & Insights de IA
                        </h3>
                        <p className="text-xs text-gray-400">
                          Métricas de engajamento do portal compiladas com total segurança de privacidade (LGPD).
                        </p>
                      </div>

                      <div className="kpi-grid">
                        <div className="glass-card p-4 kpi-card">
                          <div className="kpi-icon-wrapper cyan"><Activity className="w-5 h-5" /></div>
                          <div>
                            <div className="kpi-title">Sessões Totais</div>
                            <div className="kpi-value">12.482</div>
                          </div>
                        </div>
                        <div className="glass-card p-4 kpi-card">
                          <div className="kpi-icon-wrapper purple"><Users className="w-5 h-5" /></div>
                          <div>
                            <div className="kpi-title">Taxa de Rejeição</div>
                            <div className="kpi-value">24.5%</div>
                          </div>
                        </div>
                        <div className="glass-card p-4 kpi-card">
                          <div className="kpi-icon-wrapper green"><DollarSign className="w-5 h-5" /></div>
                          <div>
                            <div className="kpi-title">Faturamento Estimado</div>
                            <div className="kpi-value">R$ 1.482,50</div>
                          </div>
                        </div>
                        <div className="glass-card p-4 kpi-card">
                          <div className="kpi-icon-wrapper pink"><Zap className="w-5 h-5" /></div>
                          <div>
                            <div className="kpi-title">RPM Médio</div>
                            <div className="kpi-value">R$ 12,20</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Gráfico 1: Sessões por Categoria (CSS Puro) */}
                        <div className="glass-card p-5 space-y-4">
                          <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest">
                            📊 Sessões por Categoria (Popularidade)
                          </h4>
                          <div className="css-chart-container">
                            <div className="css-bar-row">
                              <span className="css-bar-label">Arcade</span>
                              <div className="css-bar-track">
                                <div className="css-bar-fill" style={{ width: '85%' }} />
                              </div>
                              <span className="css-bar-value">8.420</span>
                            </div>
                            <div className="css-bar-row">
                              <span className="css-bar-label">Memória</span>
                              <div className="css-bar-track">
                                <div className="css-bar-fill" style={{ width: '45%' }} />
                              </div>
                              <span className="css-bar-value">4.120</span>
                            </div>
                            <div className="css-bar-row">
                              <span className="css-bar-label">Ação</span>
                              <div className="css-bar-track">
                                <div className="css-bar-fill" style={{ width: '65%' }} />
                              </div>
                              <span className="css-bar-value">6.240</span>
                            </div>
                            <div className="css-bar-row">
                              <span className="css-bar-label">Educacional</span>
                              <div className="css-bar-track">
                                <div className="css-bar-fill" style={{ width: '30%' }} />
                              </div>
                              <span className="css-bar-value">2.410</span>
                            </div>
                            <div className="css-bar-row">
                              <span className="css-bar-label">Bebês</span>
                              <div className="css-bar-track">
                                <div className="css-bar-fill" style={{ width: '15%' }} />
                              </div>
                              <span className="css-bar-value">1.102</span>
                            </div>
                          </div>
                        </div>

                        {/* Card Vertex AI Insights */}
                        <div className="glass-card p-5 space-y-4 bg-gradient-to-br from-cyan-950/20 via-transparent to-pink-950/20 border-cyan-500/20">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black text-pink-500 uppercase tracking-widest flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 animate-pulse" /> Vertex AI Insights
                            </h4>
                            <span className="badge badge-cyan">Confiabilidade 98%</span>
                          </div>
                          <p className="text-xs text-gray-300 leading-relaxed">
                            Nossa inteligência preditiva analisou o comportamento do tráfego agregador e gerou sugestões de produto:
                          </p>
                          <ul className="space-y-2.5 pt-2">
                            <li className="flex gap-2.5 items-start text-xs text-white">
                              <div className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-mono font-bold text-[9px] shrink-0 mt-0.5">1</div>
                              <span>A categoria <strong>Arcade</strong> lidera com 85% do tráfego. Considere priorizar a curadoria de jogos de plataforma retrô no próximo trimestre para maximizar o RPM.</span>
                            </li>
                            <li className="flex gap-2.5 items-start text-xs text-white">
                              <div className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-mono font-bold text-[9px] shrink-0 mt-0.5">2</div>
                              <span>Crianças no <strong>Modo Bebês</strong> possuem sessões 18% mais curtas após às 19h. Isso sugere fadiga ocular infantil. Ótimo momento para disparar o <strong>Modo TEA (Calmo)</strong> para os pais.</span>
                            </li>
                            <li className="flex gap-2.5 items-start text-xs text-white">
                              <div className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 flex items-center justify-center font-mono font-bold text-[9px] shrink-0 mt-0.5">3</div>
                              <span><strong>Otimização de Mídia:</strong> 4 capas de jogos estão acima de 1MB. Recomendamos comprimir para WebP de até 150KB para economizar 42% de rede móvel (3G/4G).</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>


      {/* --- FOOTER (Reestruturado com 3 Colunas Premium) --- */}
      <footer>
        <div className="footer-grid">
          
          {/* Coluna 1: Logo & Resumo */}
          <div className="footer-col">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-sm">🦉</span>
              <span className="font-extrabold text-[11px] tracking-widest bg-gradient-to-r from-pink-500 to-[#f59e0b] bg-clip-text text-transparent uppercase font-mono">
                KRUUJ
              </span>
            </div>
            <p>
              KRUUJ é uma plataforma de descoberta e jogos web responsiva, focada em segurança, acessibilidade cognitiva e total conformidade com a LGPD e o Estatuto da Criança e do Adolescente (ECA).
            </p>
          </div>

          {/* Coluna 2: Links Informativos */}
          <div className="footer-col">
            <h4>Navegação</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => { setView('home'); setSelectedGame(null); }}>
                  Início / Catálogo
                </button>
              </li>
              <li>
                <button onClick={() => setView('contact')}>
                  Fale Conosco / Suporte
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { 
                    if (user && user.role !== 'user') {
                      setView('admin'); 
                      setSelectedGame(null); 
                    } else {
                      setAuthMode('login');
                      setShowAuthModal(true);
                    }
                  }}
                >
                  Área Administrativa
                </button>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Políticas & Denúncia */}
          <div className="footer-col">
            <h4>Políticas Legais</h4>
            <ul className="footer-links">
              <li>
                <button onClick={() => setView('privacy')}>
                  Política de Privacidade (LGPD)
                </button>
              </li>
              <li>
                <button onClick={() => setView('terms')}>
                  Termos de Uso
                </button>
              </li>
              <li>
                <button onClick={() => setView('report')} className="text-pink-500">
                  Denunciar Conteúdo
                </button>
              </li>
              <li>
                <button onClick={() => setShowConsentBanner(true)} className="text-yellow-500">
                  Preferências de Cookies
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Linha Inferior com Copyright e Redes Sociais */}
        <div className="footer-bottom">
          <p>© 2026 KRUUJ. Todos os direitos reservados. Tema Space Dark Arcade.</p>
          <div className="social-links">
            <a href="#discord" className="social-icon" title="Comunidade Discord">DC</a>
            <a href="#twitter" className="social-icon" title="Canal Twitter / X">TW</a>
            <a href="#github" className="social-icon" title="Código-Fonte GitHub">GH</a>
          </div>
        </div>
      </footer>

      {/* --- MODO BEBÊS (LOCKSCREEN EM TELA CHEIA E ABSOLUTA) --- */}
      {view === 'playing' && selectedGame && isScreenLocked && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 99999,
            backgroundColor: '#05060a',
            display: 'block',
            cursor: !document.fullscreenElement ? 'pointer' : 'default'
          }}
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen().catch(() => {});
            }
          }}
        >
          {isPlayingGame ? (
            isPhysicalGame(selectedGame.slug) ? (
              <iframe
                key={selectedGame.id}
                src={getGameUrl(selectedGame)}
                sandbox="allow-scripts allow-same-origin allow-forms"
                allow="fullscreen; autoplay"
                allowFullScreen
                title={selectedGame.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  margin: 0,
                  padding: 0,
                  objectFit: 'cover'
                }}
              ></iframe>
            ) : (
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold'
                }}
              >
                Em Manutenção Editorial...
              </div>
            )
          ) : (
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22d3ee',
                fontWeight: 'bold'
              }}
            >
              Carregando Jogo Lúdico...
            </div>
          )}
          
          {/* Botão de Fullscreen (Sempre no canto direito) */}
          <button 
            className="bento-game-floating-close"
            style={{ 
              position: 'absolute', 
              right: '16px', 
              left: 'auto', 
              top: '16px', 
              zIndex: 100000 
            }}
            onClick={(e) => { e.stopPropagation(); handleManualFullscreen(); }}
            title="Tela Cheia"
          >
            <Maximize className="w-4 h-4" />
          </button>
          
          {/* Botão de Cadeado Ativado (Vermelho, no mesmo lugar que o desativado!) */}
          <button 
            className="bento-game-floating-lock"
            style={{ 
              position: 'absolute', 
              right: '120px', 
              left: 'auto', 
              top: '16px', 
              zIndex: 100000,
              backgroundColor: '#ef4444',
              borderColor: '#ef4444',
              boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
            }}
            onClick={(e) => { e.stopPropagation(); triggerExitGame(); }}
            title="Sair do Jogo (Protegido)"
          >
            <Lock className="w-4 h-4" style={{ color: '#ffffff', filter: 'none', animation: 'none' }} />
          </button>
        </div>
      )}

      {/* --- PRE-GAME INTERSTITIAL AD OVERLAY --- */}
      {showAdOverlay && (
        <div className="fixed inset-0 bg-black/95 z-[5000] flex flex-col items-center justify-center p-6">
          <div className="glass-panel p-8 max-w-sm text-center space-y-6 border border-pink-500/30">
            <span className="text-xs uppercase tracking-wider font-extrabold text-pink-500 block">PUBLICIDADE AMISTOSA</span>
            <h3 className="text-lg font-bold text-white">Carregando seu portal em {adCountdown} segundos...</h3>
            <p className="text-xs text-gray-400">Anúncio seguro e em conformidade completa com a LGPD/ECA brasileira.</p>
            <div className="ad-banner-mock py-10 font-mono text-sm">
              ✨ NEON DRINK CYBERPUNK ✨<br />A REVOLUÇÃO ENERGÉTICA EM LATA!
            </div>
          </div>
        </div>
      )}

      {/* --- PRIVACY COOKIE CONSENT BANNER (LGPD) --- */}
      {showConsentBanner && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#0c0d14]/95 border-t border-cyan-500/20 z-[9999] flex flex-wrap md:flex-nowrap justify-between items-center gap-6 backdrop-blur-md">
          <div className="space-y-2 max-w-4xl text-left">
            <h4 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" /> Preferências de Privacidade (LGPD)
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Usamos apenas cookies e eventos essenciais para a sua conta e favoritos. Opcionalmente, você pode aceitar a coleta de eventos analíticos agregados anônimos para nos ajudar a melhorar o portal e receber anúncios não personalizados voltados ao desenvolvimento local.
            </p>
            <div className="flex gap-6 pt-1 text-[11px]">
              <label className="flex items-center gap-2 text-cyan-400">
                <input type="checkbox" checked disabled /> Essenciais (Ativo)
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                <input 
                  type="checkbox" 
                  checked={consentOptions.analytics} 
                  onChange={(e) => setConsentOptions({...consentOptions, analytics: e.target.checked})}
                /> Analytics
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white">
                <input 
                  type="checkbox" 
                  checked={consentOptions.advertising} 
                  onChange={(e) => setConsentOptions({...consentOptions, advertising: e.target.checked})}
                /> Publicidade
              </label>
            </div>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto justify-end">
            <button 
              className="btn-secondary py-2 px-5 text-xs"
              onClick={() => saveConsent(false, false)}
            >
              Rejeitar Tudo
            </button>
            <button 
              className="btn-primary py-2 px-5 text-xs"
              onClick={() => saveConsent(consentOptions.analytics, consentOptions.advertising)}
            >
              Confirmar Escolhas
            </button>
            <button 
              className="btn-primary py-2 px-5 text-xs bg-cyan-400 text-bg-primary"
              onClick={() => saveConsent(true, true)}
            >
              Aceitar Tudo
            </button>
          </div>
        </div>
      )}

      {/* --- AUTHENTICATION MODAL --- */}
      {showAuthModal && (
        <div className="modal-backdrop">
          <div className="glass-panel modal-content auth-modal-card relative">
            <button 
              className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/5 transition"
              onClick={() => { setShowAuthModal(false); setAuthError(''); setRecoveryPhrase(''); }}
            >
              <X className="w-5 h-5" />
            </button>

            {user ? (
              <div className="space-y-6 text-center select-none animate-[fadeInUp_0.4s_ease-out_forwards]">
                {accountSubView === 'menu' ? (
                  <>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div 
                        style={{ 
                          fontSize: '3rem',
                          filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))',
                          animation: 'float 4s ease-in-out infinite'
                        }}
                      >
                        🦉
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-wider mt-3" style={{ fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                        Menu da <span className="text-pink-500">sua Conta</span>
                      </h3>
                    </div>

                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5 space-y-4">
                      {/* Informações Básicas */}
                      <div className="flex items-center gap-4 text-left">
                        <div 
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #00f0ff 0%, #ff007f 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: '900',
                            fontSize: '0.95rem',
                            border: '2px solid rgba(255, 255, 255, 0.15)',
                            boxShadow: '0 0 12px rgba(0, 240, 255, 0.3)',
                            flexShrink: 0
                          }}
                        >
                          {user.username.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-white text-sm leading-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            {user.username}
                          </h4>
                          <p className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest mt-1">
                            {user.role === 'super_admin' ? 'Administrador do Portal' : 'Jogador VIP'}
                          </p>
                        </div>
                      </div>

                      {/* Nível & Experiência */}
                      <div className="space-y-2 pt-2 border-t border-white/5 text-left">
                        <div className="flex justify-between items-center text-[10px] font-extrabold text-gray-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md text-[9px] text-cyan-400 font-bold">NÍVEL 12</span>
                          <span className="text-gray-500">XP: <strong className="text-white font-mono">1.420 / 2.000</strong></span>
                        </div>
                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-cyan-400 via-[#8a2be2] to-pink-500 rounded-full" style={{ width: '70%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Botão de Histórico de Jogos Recentes */}
                      <button
                        className="btn-primary w-full justify-center rounded-xl py-3 font-extrabold"
                        onClick={() => setAccountSubView('history')}
                        style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', color: '#fff', border: 'none' }}
                      >
                        📜 Meu Histórico de Jogos
                      </button>

                      {/* Se for Super Admin, exibe o link direto para a Área Administrativa */}
                      {user.role === 'super_admin' && (
                        <button
                          className="btn-secondary w-full justify-center rounded-xl py-3 font-extrabold"
                          onClick={() => {
                            setView('admin');
                            setSelectedGame(null);
                            setShowAuthModal(false);
                          }}
                        >
                          ⚙️ Área Administrativa (Cockpit)
                        </button>
                      )}

                      <button
                        className="btn-secondary w-full justify-center rounded-xl py-3 font-extrabold"
                        style={{ borderColor: 'rgba(255, 69, 101, 0.2)', color: '#ff4565', background: 'rgba(255, 69, 101, 0.05)' }}
                        onClick={() => {
                          handleLogout();
                          setShowAuthModal(false);
                        }}
                      >
                        Sair da Conta (Logout)
                      </button>

                      <button
                        className="btn-secondary w-full justify-center rounded-xl py-3 font-extrabold"
                        onClick={() => setShowAuthModal(false)}
                      >
                        Fechar Menu
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-col items-center justify-center text-center">
                      <div style={{ fontSize: '2.5rem' }}>📜</div>
                      <h3 className="text-xl font-black text-white uppercase tracking-wider mt-2" style={{ fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                        Histórico de <span className="text-cyan-400">Jogos</span>
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">Seus últimos circuitos acessados no portal</p>
                    </div>

                    <div className="p-3 bg-black/40 rounded-2xl border border-white/5 space-y-2.5 max-h-[300px] overflow-y-auto bento-sidebar-scroll text-left">
                      {games.filter(g => recentGames.some(play => play.id === g.id)).length === 0 ? (
                        <div className="text-center text-gray-500 text-xs py-10 select-none">
                          Você ainda não jogou nenhum jogo nesta sessão.
                        </div>
                      ) : (
                        recentGames
                          .map(play => ({ play, g: games.find(g => g.id === play.id) }))
                          .filter((item): item is { play: RecentPlay, g: Game } => !!item.g)
                          .map(({ play, g }) => (
                            <div 
                              key={g.id} 
                              className="kruuj-history-item"
                              onClick={() => { handlePlayGame(g); setShowAuthModal(false); setAccountSubView('menu'); }}
                              style={{ cursor: 'pointer' }}
                            >
                              {g.bannerUrl ? (
                                <img 
                                  src={g.bannerUrl} 
                                  alt={g.title} 
                                  className="kruuj-history-cover"
                                />
                              ) : (
                                <div className="kruuj-history-cover-fallback">
                                  <Gamepad2 style={{ width: '13px', height: '13px' }} />
                                </div>
                              )}
                              <div className="flex-grow min-w-0 text-left">
                                <div className="kruuj-history-title">{g.title}</div>
                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                  <div className="kruuj-history-category">{g.category}</div>
                                  <span className="text-[8px] text-gray-500 font-extrabold uppercase font-mono tracking-wider">{formatRelativeTime(play.timestamp)}</span>
                                </div>
                              </div>
                              <button 
                                className="kruuj-history-btn select-none shrink-0"
                                onClick={(e) => { e.stopPropagation(); handlePlayGame(g); setShowAuthModal(false); setAccountSubView('menu'); }}
                              >
                                JOGAR
                              </button>
                            </div>
                          ))
                      )}
                    </div>

                    <div className="space-y-2">
                      <button
                        className="btn-secondary w-full justify-center rounded-xl py-3 font-extrabold"
                        onClick={() => setAccountSubView('menu')}
                      >
                        ⬅️ Voltar ao Menu
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : recoveryPhrase ? (
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-green-950/40 border border-green-500/30 rounded-full flex items-center justify-center mx-auto text-green-400">
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-green-400">Conta Criada com Segurança!</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Não solicitamos e-mail obrigatório de conformidade com nossa política de privacidade. Guarde seu **Código de Recuperação** abaixo. Ele é o único meio de recuperar seu acesso se esquecer a senha:
                </p>
                <div className="p-3 bg-black/60 rounded-lg border border-white/5 font-mono text-sm text-cyan-400 select-all font-bold">
                  {recoveryPhrase}
                </div>
                <button 
                  className="btn-primary w-full justify-center rounded-xl py-3 font-extrabold"
                  onClick={() => { setShowAuthModal(false); setRecoveryPhrase(''); setUsernameInput(''); setPasswordInput(''); }}
                >
                  Concluído
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-5">
                
                {/* Cabeçalho do Cartão de Autenticação */}
                <div className="flex flex-col items-center justify-center text-center select-none mb-2">
                  <div 
                    style={{ 
                      fontSize: '3rem',
                      filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))'
                    }}
                  >
                    🦉
                  </div>
                  <h2 className="text-md font-black text-white tracking-widest uppercase mt-2" style={{ fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                    KRUUJ <span className="text-pink-500">Play</span>
                  </h2>
                </div>

                {/* Seletor Segmentado de Abas Premium */}
                <div className="flex bg-black/40 p-1 rounded-full border border-white/5 mb-6 max-w-[280px] mx-auto">
                  <button
                    type="button"
                    className={`flex-1 text-center py-1.5 rounded-full text-xs font-black transition-all ${authMode === 'login' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.3)]' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  >
                    Fazer Login
                  </button>
                  <button
                    type="button"
                    className={`flex-1 text-center py-1.5 rounded-full text-xs font-black transition-all ${authMode === 'register' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.3)]' : 'text-gray-400 hover:text-white'}`}
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  >
                    Criar Conta
                  </button>
                </div>

                {authError && (
                  <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/20 text-xs text-red-400 flex items-center gap-2 text-left">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Nome de Usuário:</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-cyan-400" />
                      <input 
                        type="text" 
                        className="input-field pl-10" 
                        placeholder="Seu apelido único de jogador" 
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Senha de Acesso:</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-cyan-400" />
                      <input 
                        type="password" 
                        className="input-field pl-10" 
                        placeholder="Sua senha secreta" 
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {authMode === 'register' && (
                  <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/10 text-[10px] text-gray-400 leading-relaxed text-left flex gap-2">
                    <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>🔒 <strong>Privacidade Garantida</strong>: Sua senha é armazenada com criptografia de hash irreversível. Não coletamos e-mails de acordo com as diretrizes da LGPD e do ECA.</span>
                  </div>
                )}

                <button type="submit" className="btn-primary w-full justify-center font-black py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-[0_4px_15px_rgba(0,240,255,0.2)] hover:shadow-[0_4px_25px_rgba(0,240,255,0.45)] mt-4">
                  {authMode === 'login' ? 'Conectar ao Portal' : 'Registrar Minha Conta'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- DOSSIÊ JURÍDICO MODAL --- */}
      {adminSelectedDossier && (
        <div className="modal-backdrop">
          <div className="glass-panel modal-content relative text-left space-y-6 max-w-lg">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => setAdminSelectedDossier(null)}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Award className="w-6 h-6 text-green-400 shrink-0" />
              <div>
                <h3 className="text-md font-bold text-white uppercase tracking-wider">
                  Dossiê de Licenciamento Técnico-Legal
                </h3>
                <p className="text-[11px] text-gray-400">
                  Validação de autoria e conformidade da Propriedade Intelectual (Lei nº 9.610/98).
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-white max-h-[350px] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-3 bg-[#0b0c14] p-3 rounded-lg border border-white/5">
                <div>
                  <span className="text-gray-400 block mb-1">Título do Circuito:</span>
                  <strong className="text-white text-xs">{adminSelectedDossier.game.title}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Código Contrato:</span>
                  <strong className="text-cyan-400 font-mono text-xs">{adminSelectedDossier.contract?.contractNumber || 'SEM REGISTRO'}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Autor / Licenciante:</span>
                  <strong className="text-white">{adminSelectedDossier.contract?.signatoryCreator || adminSelectedDossier.game.author}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Tipo de Licença:</span>
                  <strong className="text-purple-300">{adminSelectedDossier.contract?.licenseType || adminSelectedDossier.game.licenseName}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Vigência Comercial:</span>
                  <strong className="text-white">{adminSelectedDossier.contract?.durationMonths ? `${adminSelectedDossier.contract.durationMonths} meses` : 'N/A'}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1">Exclusividade:</span>
                  <strong className="text-pink-300">{adminSelectedDossier.contract?.exclusivityScope || 'Não Exclusivo'}</strong>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Histórico de Auditoria e Logs:</span>
                <pre className="p-3 bg-black/60 rounded border border-white/5 font-mono text-[10px] text-gray-300 leading-relaxed whitespace-pre-wrap select-text">
                  {adminSelectedDossier.contract?.auditLog || '[AUDITOR]: Nenhuma auditoria registrada para este circuito.'}
                </pre>
              </div>

              <div className="bg-[#0b0c14] p-3 rounded-lg border border-white/5 space-y-2">
                <span className="text-gray-400 font-bold block uppercase tracking-wider text-[10px]">Workflow Status:</span>
                <div className="flex flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Editorial:</span>
                    {getEditorialBadge(adminSelectedDossier.game.statusEditorial)}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Técnico:</span>
                    {getTechnicalBadge(adminSelectedDossier.game.statusTechnical)}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Legal / Docs:</span>
                    {getDocBadge(adminSelectedDossier.game.statusDoc)}
                  </div>
                </div>
              </div>
            </div>

            <button 
              className="btn-primary w-full justify-center bg-green-600 hover:bg-green-700 font-bold py-2.5"
              onClick={() => setAdminSelectedDossier(null)}
            >
              Fechar Dossiê Legal
            </button>
          </div>
        </div>
      )}

      {/* --- PARENT GATE MODAL (Lockscreen para Bebês) --- */}
      {showParentGate && (
        <div className="modal-backdrop" style={{ zIndex: 200000 }}>
          <div className="glass-panel modal-content parent-gate-card text-center space-y-6" style={{ zIndex: 200001 }}>
            <div className="w-14 h-14 bg-pink-950/40 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto text-pink-500 animate-bounce">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-pink-500">🔐 Área Exclusiva para Adultos</h3>
            <p className="text-xs text-gray-400">Para garantir que o bebê continue brincando em total segurança dentro do portal, resolva a equação para sair da tela cheia:</p>
            <form onSubmit={handleParentGateSubmit} className="space-y-4">
              <div className="text-3xl font-extrabold text-white mb-4 font-mono">
                {parentMath.n1} {parentMath.op} {parentMath.n2} = ?
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="input-field text-center text-2xl font-bold bg-black/60 border-pink-500/30 text-white rounded-lg p-2"
                style={{ maxWidth: '160px', margin: '0 auto', display: 'block' }}
                value={parentInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    setParentInput(val);
                    const expected = parentMath.op === 'x' ? parentMath.n1 * parentMath.n2 : parentMath.n1 + parentMath.n2;
                    if (parseInt(val) === expected) {
                      executeExitGame();
                    }
                  }
                }}
                autoFocus
                required
              />
              <div className="flex gap-4 mt-4">
                <button type="button" className="btn-secondary flex-1 justify-center py-2.5 rounded-xl font-bold" onClick={() => setShowParentGate(false)}>Continuar Jogando</button>
                <button type="submit" className="btn-primary flex-1 justify-center py-2.5 rounded-xl bg-pink-500 text-white hover:bg-pink-600 font-extrabold">Sair do Jogo</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
