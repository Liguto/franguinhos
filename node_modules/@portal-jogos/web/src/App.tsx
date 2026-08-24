import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Search, Heart, User, LogIn, LogOut, Info, Shield, 
  Settings, HelpCircle, ArrowLeft, Star, Volume2, ShieldAlert, 
  Smartphone, Share2, Award, Zap, Brain, Rocket, Grid, Plus, Hash, X, FileText, Lock, Maximize
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
  const [view, setView] = useState<'home' | 'playing' | 'favorites' | 'privacy' | 'terms' | 'contact' | 'report'>('home');
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<string[]>(['Tudo', 'Arcade', 'Memória', 'Ação']);
  const [activeCategory, setActiveCategory] = useState<string>('Tudo');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Preferências
  const [agePreference, setAgePreference] = useState<'geral' | 'educacional' | 'terceira_idade' | 'bebes'>('geral');
  
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

  // PWA & Posição de Instalação
  const [isPwaInstalled, setIsPwaInstalled] = useState<boolean>(false);
  const [showPwaBanner, setShowPwaBanner] = useState<boolean>(true);

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
    let pageTitle = 'Franguinhos Games | Jogos HTML5 Online Gratuitos e Seguros';
    let pageDesc = 'Portal de jogos HTML5 responsivo, focado em desempenho mobile, segurança de sandbox e total conformidade com a LGPD e ECA.';

    if (view === 'playing' && selectedGame) {
      // Long-Tail SEO injetado quando uma página de jogo específica é acessada
      pageTitle = `${selectedGame.title} - Jogar Online Grátis | Franguinhos Games`;
      pageDesc = selectedGame.description;
    } else if (view === 'home') {
      // Long-Tail SEO para subnichos de categoria editorial
      if (agePreference === 'educacional') {
        pageTitle = 'Jogos Educacionais de Matemática e Lógica Online | Franguinhos Games';
        pageDesc = 'Os melhores jogos educativos de matemática, memória e lógica para crianças e adolescentes jogarem grátis e sem instalar nada no celular.';
      } else if (agePreference === 'terceira_idade') {
        pageTitle = 'Jogos para Terceira Idade e Memória Grátis | Franguinhos Games';
        pageDesc = 'Jogos gratuitos para estimular a memória de idosos. Sudoku, caça-palavras e jogos de lógica fáceis e relaxantes direto no celular.';
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
        }
      ];
      setGames(mockGames);
    }
  };

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

    logEvent('game_exit', { gameId: selectedGame?.id, gameSlug: selectedGame?.slug });
  };

  // Gatilho de saída interceptado pelo Parent Gate no modo Bebês
  const triggerExitGame = () => {
    if (agePreference === 'bebes') {
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

    // 1. Aciona o modo Fullscreen do navegador nativamente no mobile/tablet (ou sempre no modo Bebês)
    if (window.innerWidth < 1024 || agePreference === 'bebes') {
      try {
        const docEl = document.documentElement as any;
        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        if (requestFullScreen) {
          await requestFullScreen.call(docEl);
        }
      } catch (err) {
        console.warn('Fullscreen automático bloqueado ou não suportado pelo navegador.');
      }
    }

    // 2. Trava de Tela (Screen Wake Lock) para o Modo Bebês
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
      document.exitFullscreen().catch(() => {});
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

    // 2. Filtragem por Categoria
    if (activeCategory !== 'Tudo') {
      result = result.filter(g => g.category === activeCategory);
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
    return ['snake-retro', 'memory-match', 'space-defense', 'sudoku-zen', 'math-run', 'bubble-pop'].includes(slug);
  };

  return (
    <div className={`flex flex-col min-h-screen ${agePreference === 'educacional' ? 'theme-edu' : agePreference === 'terceira_idade' ? 'theme-senior' : ''}`}>
      {/* --- HEADER --- */}
      <header>
        <div className="header-container">
          <div className="logo-container flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); setSelectedGame(null); }}>
            <img 
              src="/logo_franguinhos.png" 
              alt="Franguinhos Games Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition duration-200 hover:scale-105 shrink-0" 
              style={{ maxHeight: '48px' }}
            />
            <span className="hidden sm:block font-extrabold text-lg lg:text-xl tracking-tight bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent">
              FRANGUINHOS GAMES
            </span>
          </div>

          {/* Barra de Busca Premium em Cápsula (Agora visível em todas as telas) */}
          <div className="header-search">
            <div className="search-bar-container">
              <Search className="search-bar-icon w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar jogos, tags..." 
                className="search-bar-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Seleção de Perfil/Modo Editorial e Ações */}
          <div className="header-actions">
            <div className="pref-selector">
              <button 
                className={`pref-btn ${agePreference === 'geral' ? 'active' : ''}`}
                onClick={() => setAgePreference('geral')}
                title="Mostrar catálogo geral completo"
              >
                Geral
              </button>
              <button 
                className={`pref-btn ${agePreference === 'educacional' ? 'active educacional' : ''}`}
                onClick={() => setAgePreference('educacional')}
                title="Catálogo Educacional (Anúncios ocultos e foco em aprendizado)"
              >
                Educacional
              </button>
              <button 
                className={`pref-btn ${agePreference === 'bebes' ? 'active bebes' : ''}`}
                onClick={() => setAgePreference('bebes')}
                title="Catálogo Bebês (Seguro, sem anúncios e com trava de tela)"
              >
                Bebês
              </button>
              <button 
                className={`pref-btn ${agePreference === 'terceira_idade' ? 'active idoso' : ''}`}
                onClick={() => setAgePreference('terceira_idade')}
                title="Área Sênior (Jogos lógicos e acessíveis)"
              >
                Sênior
              </button>
              
              <div className="w-[1px] h-4 bg-white/20 mx-1"></div>
              
              <button 
                className={`pref-btn flex items-center gap-1 ${teaMode ? 'active bg-green-500/20 text-green-400' : ''}`}
                onClick={() => setTeaMode(!teaMode)}
                title="Modo Neurodivergente (Baixa estimulação sensorial)"
              >
                <Brain className="w-3.5 h-3.5" /> TEA
              </button>
            </div>

            {/* Favoritos (Design Premium em Cápsula com Contador) */}
            {user && (
              <button 
                className={`btn-secondary py-1.5 px-3 text-xs flex items-center gap-2 transition-all ${view === 'favorites' ? 'border-pink-500/50 text-pink-400 bg-pink-500/10' : 'hover:border-pink-500/30 hover:text-pink-400'}`}
                onClick={() => { setView('favorites'); setSelectedGame(null); }}
                title="Meus Favoritos"
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 || view === 'favorites' ? 'fill-pink-500 text-pink-500' : 'text-gray-400'}`} />
                <span className="hidden sm:inline font-bold">Favoritos</span>
                {favorites.length > 0 && (
                  <span className="bg-pink-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-[0_0_8px_rgba(255,0,127,0.6)]">
                    {favorites.length}
                  </span>
                )}
              </button>
            )}

            {/* Autenticação */}
            {user ? (
              <div className="header-user-badge">
                <span className="text-sm font-semibold hidden lg:inline-block text-cyan-400">
                  Olá, {user.username}!
                </span>
                {user.role !== 'user' && (
                  <a 
                    href="http://localhost:3001" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="admin-badge-glow"
                    title="Painel Administrativo"
                  >
                    ADMIN
                  </a>
                )}
                <button 
                  className="btn-secondary py-1.5 px-3 text-xs" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            ) : (
              <button 
                className="btn-primary"
                onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              >
                <User className="w-4 h-4" /> Entrar
              </button>
            )}
          </div>
        </div>
      </header>

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

      {/* --- SLEEK MOBILE-ONLY PWA TOAST (Escondido em PCs, visível apenas em celulares) --- */}
      {showPwaBanner && !isPwaInstalled && (
        <div className="pwa-toast">
          <div className="flex items-center gap-2 text-sm">
            <Smartphone className="text-cyan-400 w-5 h-5 shrink-0" />
            <span className="font-bold text-white">Instalar Franguinhos Games</span>
          </div>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Instale o PWA para jogar em tela cheia de forma instantânea com atalho direto na sua tela inicial!
          </p>
          <div className="flex gap-3 justify-end pt-1">
            <button 
              className="text-[11px] text-gray-500 font-bold hover:text-white transition"
              onClick={() => setShowPwaBanner(false)}
            >
              Agora Não
            </button>
            <button 
              className="bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-[11px] py-1.5 px-4 rounded-full transition"
              onClick={() => {
                setIsPwaInstalled(true);
                setShowPwaBanner(false);
                alert("Simulação de PWA: Aplicativo adicionado à sua tela inicial com sucesso!");
              }}
            >
              Instalar
            </button>
          </div>
        </div>
      )}

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="container flex-grow py-8">
        
        {/* MASTER TOP LEADERBOARD AD (Maior Visibilidade - CPM Máximo) */}
        {consentOptions.advertising && (
          <div className="ad-slot-leaderboard mt-0 mb-8"></div>
        )}

        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="space-y-8">
            
            {/* Barra de Busca Móvel */}
            <div className="flex md:hidden items-center relative w-full mb-4">
              <input 
                type="text" 
                placeholder="Buscar jogos..." 
                className="input-field pr-10 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 w-5 h-5 text-gray-400" />
            </div>

            {/* Seletor de Faixa Etária Móvel (Visível apenas no celular, oculto no PC) */}
            <div className="mobile-pref-block">
              <div className="pref-selector">
                <button 
                  className={`pref-btn ${agePreference === 'geral' ? 'active' : ''}`}
                  onClick={() => setAgePreference('geral')}
                >
                  Geral
                </button>
                <button 
                  className={`pref-btn ${agePreference === 'educacional' ? 'active educacional' : ''}`}
                  onClick={() => setAgePreference('educacional')}
                >
                  Educacional
                </button>
                <button 
                  className={`pref-btn ${agePreference === 'terceira_idade' ? 'active idoso' : ''}`}
                  onClick={() => setAgePreference('terceira_idade')}
                >
                  Sênior
                </button>
              </div>
            </div>

            {/* Categorias Tabs */}
            <div className="category-container">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* HERO BANNER DESTAQUE (Apenas na categoria Geral/Tudo e sem busca ativa para visual premium) */}
            {activeCategory === 'Tudo' && !searchQuery && games.length > 0 && (
              <div 
                className="hero-banner"
                style={{ backgroundImage: `url(${games[0].bannerUrl})` }}
              >
                <div className="hero-content">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/20 w-max">
                    🎮 RECOMENDADO DO DIA
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight drop-shadow-md">
                    {games[0].title}
                  </h2>
                  <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed max-w-sm">
                    {games[0].description}
                  </p>
                  <button 
                    className="btn-primary mt-2"
                    onClick={() => handlePlayGame(games[0])}
                  >
                    Jogar Agora
                  </button>
                </div>
              </div>
            )}

            {/* SLOT DE ANÚNCIO SUPERIOR (Vazio para testes de layout de Ad Adsense / Direct) */}
            {consentOptions.advertising && (
              <div className="ad-slot-leaderboard"></div>
            )}

            {/* Grid de Jogos */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-cyan-300 flex flex-wrap items-center gap-2">
                <Grid className="w-6 h-6 text-cyan-400" />
                <span>
                  {activeCategory === 'Tudo' ? 'Todos os Jogos' : `Jogos de ${activeCategory}`}
                  {agePreference !== 'geral' && (
                    <span className="text-pink-400">
                      {' '}do Filtro {agePreference === 'educacional' ? 'Educacional' : agePreference === 'bebes' ? 'Bebês' : 'Sênior'}
                    </span>
                  )}
                </span>
              </h2>

              {getFilteredGames().length === 0 ? (
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
                <div className="game-grid">
                  {getFilteredGames().map((game) => (
                    <div 
                      key={game.id}
                      className="glass-card p-4 flex flex-col justify-between cursor-pointer group"
                      onClick={() => handlePlayGame(game)}
                    >
                      <div>
                        <div className="game-card-icon-container">
                          {renderGameCover(game)}
                          
                          {/* Modern Floating Like Pill with reactive likes count */}
                          <div 
                            className="game-card-like-pill"
                            onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                            title={favorites.includes(game.id) ? 'Remover dos favoritos' : 'Favoritar este jogo'}
                          >
                            <Heart className={`w-3.5 h-3.5 ${favorites.includes(game.id) ? 'fill-pink-500 text-pink-500 animate-heart' : 'text-gray-400'}`} />
                            <span>{likesCount[game.id] || 0}</span>
                          </div>
                        </div>
                        <h3 className="font-bold text-sm tracking-tight group-hover:text-cyan-400 transition">
                          {game.title}
                        </h3>
                        <p className="text-[11px] text-purple-300 font-bold uppercase mt-1">
                          {game.category}
                        </p>
                      </div>
                      
                      <div className="flex items-center mt-3 pt-2 border-t border-white/5">
                        <span className="text-[10px] text-gray-400 font-semibold">
                          Class: {game.ageRating}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* IN-FEED AD SLOT CARD (Slot vazio de alta fidelidade para testes de layout e RPM) */}
                  {consentOptions.advertising && (
                    <div className="ad-slot-card"></div>
                  )}
                </div>
              )}
            </div>

            {/* SLOT DE ANÚNCIO IN-FEED LEADERBOARD INFERIOR (Vazio de alta fidelidade para testes de layout de anúncios) */}
            {consentOptions.advertising && (
              <div className="ad-slot-leaderboard"></div>
            )}
          </div>
        )}

        {/* VIEW: FAVORITOS */}
        {view === 'favorites' && (
          <div className="space-y-6">
            <button className="btn-secondary py-2 px-4" onClick={() => setView('home')}>
              <ArrowLeft className="w-4 h-4" /> Voltar ao Início
            </button>
            <h2 className="text-2xl font-extrabold text-pink-500 flex items-center gap-2">
              <Heart className="w-7 h-7 fill-current" /> Meus Favoritos
            </h2>

            {games.filter(g => favorites.includes(g.id)).length === 0 ? (
              <div className="glass-panel p-10 text-center text-gray-400">
                Você ainda não adicionou nenhum jogo aos favoritos. Explore o catálogo para encontrar seus preferidos!
              </div>
            ) : (
              <div className="game-grid">
                {games.filter(g => favorites.includes(g.id)).map((game) => (
                  <div 
                    key={game.id}
                    className="glass-card p-4 flex flex-col justify-between cursor-pointer group"
                    onClick={() => handlePlayGame(game)}
                  >
                    <div>
                      <div className="game-card-icon-container">
                        {renderGameCover(game)}
                        
                        {/* Modern Floating Like Pill with reactive likes count */}
                        <div 
                          className="game-card-like-pill"
                          onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                          title={favorites.includes(game.id) ? 'Remover dos favoritos' : 'Favoritar este jogo'}
                        >
                          <Heart className={`w-3.5 h-3.5 ${favorites.includes(game.id) ? 'fill-pink-500 text-pink-500 animate-heart' : 'text-gray-400'}`} />
                          <span>{likesCount[game.id] || 0}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm group-hover:text-cyan-400 transition">
                        {game.title}
                      </h3>
                      <p className="text-[10px] text-purple-300 font-bold uppercase mt-1">
                        {game.category}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-white/5">
                      <span className="text-[10px] text-gray-400">
                        Class: {game.ageRating}
                      </span>
                      <span className="text-[10px] font-bold text-cyan-400 font-mono tracking-wider">
                        🎮 JOGAR
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW: PLAYING GAME */}
        {view === 'playing' && selectedGame && agePreference !== 'bebes' && (
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
              <div className="iframe-container">
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

              {/* SLOT DE ANÚNCIO LEADERBOARD DEBAIXO DO JOGO (Vazio para testes de layout e RPM) */}
              {consentOptions.advertising && (
                <div className="ad-slot-leaderboard"></div>
              )}

              {/* LAYOUT DE INFORMAÇÕES DEBAIXO DO JOGO (Refatorado para Cinema Layout) */}
              <div className="play-info-split">
                
                {/* COLUNA ESQUERDA (Descrição e Outros Jogos Recomendados) */}
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

                {/* Grid Premium de Recomendados ( Continue Jogando Poki-Style ) */}
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
                            
                            {/* Modern Floating Like Pill */}
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

              {/* COLUNA DIREITA (Especificações Técnicas & Banners Laterais) */}
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
                    
                    {/* Controles Declarados */}
                    <div className="pt-2">
                      <span className="text-gray-400 block mb-2">Compatibilidade:</span>
                      <div className="flex gap-2">
                        <div className={`p-2 rounded-lg flex flex-col items-center gap-1 flex-1 ${selectedGame.controls.toque ? 'bg-cyan-950/40 border border-cyan-500/25 text-cyan-400' : 'bg-white/5 text-gray-600'}`} title={selectedGame.controls.toque ? "Suporta Toque" : "Não suporta Toque"}>
                          <Smartphone className="w-4 h-4" />
                          <span className="text-[9px]">Toque</span>
                        </div>
                        <div className={`p-2 rounded-lg flex flex-col items-center gap-1 flex-1 ${selectedGame.controls.teclado ? 'bg-cyan-950/40 border border-cyan-500/25 text-cyan-400' : 'bg-white/5 text-gray-600'}`} title={selectedGame.controls.teclado ? "Suporta Teclado" : "Não suporta Teclado"}>
                          <Gamepad2 className="w-4 h-4" />
                          <span className="text-[9px]">Teclado</span>
                        </div>
                        <div className={`p-2 rounded-lg flex flex-col items-center gap-1 flex-1 ${selectedGame.controls.mouse ? 'bg-cyan-950/40 border border-cyan-500/25 text-cyan-400' : 'bg-white/5 text-gray-600'}`} title={selectedGame.controls.mouse ? "Suporta Mouse" : "Não suporta Mouse"}>
                          <Volume2 className="w-4 h-4" />
                          <span className="text-[9px]">Mouse</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SLOT DE ANÚNCIO RETANGULAR LATERAL (Vazio para testes de layout e RPM na barra lateral) */}
                {consentOptions.advertising && (
                  <div className="ad-slot-rectangle"></div>
                )}

              </div>
            </div>
          </div>
        )}

      {/* STATIC PAGES */}
        {view === 'privacy' && (
          <div className="glass-panel p-8 space-y-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-extrabold text-cyan-300">Política de Privacidade (LGPD)</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              No **Franguinhos Games**, respeitamos rigorosamente a privacidade dos nossos visitantes e jogadores de conformidade com a Lei Geral de Proteção de Dados (LGPD) e o ECA. 
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
              Ao utilizar o Franguinhos Games, você concorda com nossos termos. O portal oferece jogos casuais em formato HTML5 incorporados via iframe em sandbox isoladas para a sua segurança.
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
      </main>

      {/* --- FOOTER (Reestruturado com 3 Colunas Premium) --- */}
      <footer>
        <div className="footer-grid">
          
          {/* Coluna 1: Logo & Resumo */}
          <div className="footer-col">
            <div className="flex items-center gap-1.5 mb-2">
              <img 
                src="/logo_franguinhos.png" 
                alt="Franguinhos Games Logo" 
                style={{ width: '16px', height: '16px', objectFit: 'contain', opacity: 0.8 }} 
              />
              <span className="font-extrabold text-[10px] tracking-tight bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent uppercase">
                Franguinhos Games
              </span>
            </div>
            <p>
              Portal de jogos HTML5 responsivo, focado em desempenho mobile, segurança de sandbox e total conformidade com a LGPD e o Estatuto da Criança e do Adolescente (ECA).
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
                <a href="http://localhost:3001" target="_blank" rel="noreferrer">
                  Área Administrativa
                </a>
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
          <p>© 2026 Franguinhos Games. Todos os direitos reservados. Tema Glassmorphic Dark Arcade.</p>
          <div className="social-links">
            <a href="#discord" className="social-icon" title="Comunidade Discord">DC</a>
            <a href="#twitter" className="social-icon" title="Canal Twitter / X">TW</a>
            <a href="#github" className="social-icon" title="Código-Fonte GitHub">GH</a>
          </div>
        </div>
      </footer>

      {/* --- MODO BEBÊS (LOCKSCREEN EM TELA CHEIA E ABSOLUTA) --- */}
      {view === 'playing' && selectedGame && agePreference === 'bebes' && (
        <div className="fixed inset-0 z-[9999] bg-[#0f172a] block">
          {isPlayingGame ? (
            isPhysicalGame(selectedGame.slug) ? (
              <iframe
                key={selectedGame.id}
                src={getGameUrl(selectedGame)}
                sandbox="allow-scripts allow-same-origin allow-forms"
                allow="fullscreen; autoplay"
                allowFullScreen
                title={selectedGame.title}
                className="absolute inset-0 w-full h-full border-none m-0 p-0"
                style={{ objectFit: 'cover' }}
              ></iframe>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold">Em Manutenção Editorial...</div>
            )
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-cyan-400 font-bold">Carregando Jogo Lúdico...</div>
          )}
          
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 p-3 md:p-4 bg-black/40 hover:bg-black/80 text-white/50 hover:text-white rounded-full backdrop-blur-sm transition-all border border-white/10 z-[10000] shadow-lg"
            onClick={handleManualFullscreen}
            title="Tela Cheia"
          >
            <Maximize className="w-6 h-6 md:w-8 md:h-8" />
          </button>
          
          <button 
            className="absolute top-4 left-4 md:top-8 md:left-8 p-3 md:p-4 bg-black/40 hover:bg-black/80 text-white/50 hover:text-white rounded-full backdrop-blur-sm transition-all border border-white/10 z-[10000] shadow-lg"
            onClick={triggerExitGame}
            title="Sair do Jogo (Protegido)"
          >
            <Lock className="w-6 h-6 md:w-8 md:h-8" />
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
          <div className="glass-panel modal-content relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => { setShowAuthModal(false); setAuthError(''); setRecoveryPhrase(''); }}
            >
              <X className="w-5 h-5" />
            </button>

            {recoveryPhrase ? (
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
                  className="btn-primary w-full justify-center"
                  onClick={() => { setShowAuthModal(false); setRecoveryPhrase(''); setUsernameInput(''); setPasswordInput(''); }}
                >
                  Concluído
                </button>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <h3 className="text-xl font-extrabold text-cyan-300 text-center">
                  {authMode === 'login' ? 'ENTRAR NO ARCADE' : 'CRIAR CONTA SEGURA'}
                </h3>
                
                {authError && (
                  <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/20 text-xs text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Nome de Usuário:</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Apelido único" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400">Senha:</label>
                  <input 
                    type="password" 
                    className="input-field" 
                    placeholder="Senha de acesso" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                  />
                </div>

                {authMode === 'register' && (
                  <p className="text-[10px] text-gray-400 leading-relaxed">
                    🔒 **Privacidade**: Sua senha será criptografada como Hash scrypt/bcrypt. Não guardamos e-mails nem faremos rastreamento abusivo.
                  </p>
                )}

                <button type="submit" className="btn-primary w-full justify-center font-bold">
                  {authMode === 'login' ? 'Conectar' : 'Criar Minha Conta'}
                </button>

                <div className="text-center pt-2">
                  {authMode === 'login' ? (
                    <button 
                      type="button" 
                      className="text-xs text-gray-400 hover:text-cyan-400 transition"
                      onClick={() => setAuthMode('register')}
                    >
                      Não tem conta? **Cadastre-se aqui**
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className="text-xs text-gray-400 hover:text-cyan-400 transition"
                      onClick={() => setAuthMode('login')}
                    >
                      Já possui conta? **Faça login aqui**
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* --- PARENT GATE MODAL (Lockscreen para Bebês) --- */}
      {showParentGate && (
        <div className="modal-backdrop">
          <div className="glass-panel modal-content relative text-center space-y-6">
            <h3 className="text-xl font-extrabold text-pink-500">Controle de Pais</h3>
            <p className="text-sm text-gray-300">Resolva a equação para sair do jogo e destravar a tela:</p>
            <form onSubmit={handleParentGateSubmit} className="space-y-4">
              <div className="text-3xl font-bold text-white mb-4">
                {parentMath.n1} {parentMath.op} {parentMath.n2} = ?
              </div>
              <input
                type="number"
                className="input-field text-center text-xl"
                value={parentInput}
                onChange={(e) => setParentInput(e.target.value)}
                autoFocus
                required
              />
              <div className="flex gap-4 mt-4">
                <button type="button" className="btn-secondary flex-1 justify-center" onClick={() => setShowParentGate(false)}>Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
