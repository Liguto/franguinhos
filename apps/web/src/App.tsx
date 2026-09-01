import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Search, Heart, User, LogIn, LogOut, Info, Shield, 
  Settings, HelpCircle, ArrowLeft, Star, Volume2, ShieldAlert, 
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

  // --- Estados do Painel Administrativo Integrado ---
  const [adminTab, setAdminTab] = useState<'catalog' | 'contracts' | 'dashboard' | 'users'>('catalog');
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

  // --- Estados do Bento Grid Social & Chat (Nova Interface) ---
  const [onlineFriends, setOnlineFriends] = useState([
    { name: 'GamerPro', status: 'jogando', game: 'Snake Retro Arcade', avatarColor: 'from-cyan-500 to-blue-500' },
    { name: 'Alice_Logics', status: 'jogando', game: 'Memory Training Neon', avatarColor: 'from-pink-500 to-purple-500' },
    { name: 'MatheMágico', status: 'online', game: '', avatarColor: 'from-green-500 to-emerald-500' },
    { name: 'Nerd_HTML5', status: 'ausente', game: '', avatarColor: 'from-yellow-500 to-orange-500' }
  ]);

  const [chatMessages, setChatMessages] = useState([
    { sender: 'GamerPro', text: 'Alguém conseguiu passar dos 100 pontos no Snake Retro?', time: '2 min atrás', avatarColor: 'from-cyan-500 to-blue-500' },
    { sender: 'Alice_Logics', text: 'Memory Neon é excelente para exercitar o cérebro! Recomendo!', time: '1 min atrás', avatarColor: 'from-pink-500 to-purple-500' },
    { sender: 'MatheMágico', text: 'Novo recorde no Math Run: 250 pontos! Alguém me supera?', time: 'Agora', avatarColor: 'from-green-500 to-emerald-500' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Efeito para atualizar aleatoriamente o status/jogo dos amigos e simular atividade real
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineFriends(prev => {
        return prev.map(friend => {
          if (Math.random() > 0.75) {
            const gamesList = ['Snake Retro Arcade', 'Memory Training Neon', 'Cyber Space Defense', 'Super Math Run', 'Sudoku Zen Master', 'Bolhas Mágicas', 'Rocket Rise'];
            const statuses = ['jogando', 'online', 'ausente'];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const randomGame = randomStatus === 'jogando' ? gamesList[Math.floor(Math.random() * gamesList.length)] : '';
            return {
              ...friend,
              status: randomStatus,
              game: randomGame
            };
          }
          return friend;
        });
      });
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      sender: user ? user.username : 'Jogador_Visitante',
      text: chatInput,
      time: 'Agora',
      avatarColor: 'from-pink-500 to-cyan-500'
    };

    setChatMessages(prev => [...prev, userMsg]);
    const inputVal = chatInput.toLowerCase();
    setChatInput('');

    // Resposta simulada após 1.5 segundos
    setTimeout(() => {
      let replyText = '';
      let replySender = 'GamerPro';
      let replyColor = 'from-cyan-500 to-blue-500';

      if (inputVal.includes('snake') || inputVal.includes('cobra') || inputVal.includes('cobrinha')) {
        replySender = 'GamerPro';
        replyText = 'O segredo do Snake é fazer curvas rápidas rente às paredes de neon!';
        replyColor = 'from-cyan-500 to-blue-500';
      } else if (inputVal.includes('oi') || inputVal.includes('olá') || inputVal.includes('ola') || inputVal.includes('salve') || inputVal.includes('eae')) {
        replySender = 'Nerd_HTML5';
        replyText = 'Eae jogador! Bem-vindo ao chat ao vivo do Franguinhos Games! Bora jogar!';
        replyColor = 'from-yellow-500 to-orange-500';
      } else if (inputVal.includes('math') || inputVal.includes('matematica') || inputVal.includes('conta') || inputVal.includes('calculo')) {
        replySender = 'MatheMágico';
        replyText = 'Math Run é insano, as contas dão bônus de velocidade e multiplicam o score!';
        replyColor = 'from-green-500 to-emerald-500';
      } else if (inputVal.includes('memoria') || inputVal.includes('memory')) {
        replySender = 'Alice_Logics';
        replyText = 'No Memory Neon recomendo focar nas cores para decorar os pares mais rápido.';
        replyColor = 'from-pink-500 to-purple-500';
      } else {
        const randomReplies = [
          'Mandou bem! Bora subir esse recorde nos rankings do portal!',
          'Este novo visual Bento Grid ficou simplesmente perfeito, muito premium!',
          'Qual o seu jogo favorito? O meu é o Cyber Space Defense!',
          'Caraca, esse chat está super movimentado hoje!',
          'Se cansar do neon, ativa o Modo TEA nas Configurações da barra lateral!'
        ];
        const senders = [
          { name: 'GamerPro', color: 'from-cyan-500 to-blue-500' },
          { name: 'Alice_Logics', color: 'from-pink-500 to-purple-500' },
          { name: 'Nerd_HTML5', color: 'from-yellow-500 to-orange-500' }
        ];
        const chosenSender = senders[Math.floor(Math.random() * senders.length)];
        replySender = chosenSender.name;
        replyText = randomReplies[Math.floor(Math.random() * randomReplies.length)];
        replyColor = chosenSender.color;
      }

      setChatMessages(prev => [...prev, {
        sender: replySender,
        text: replyText,
        time: 'Agora',
        avatarColor: replyColor
      }]);
    }, 1500);
  };


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

        {['home', 'favorites', 'privacy', 'terms', 'contact', 'report'].includes(view) ? (
          <div className="bento-portal-wrapper">
            
            {/* 1. COLUNA DA ESQUERDA: SIDEBAR DE NAVEGAÇÃO COMPACTA */}
            <aside className="bento-sidebar-left">
              {/* Logo Franguinhos Games */}
              <div className="flex items-center gap-2.5 px-2 pb-5 border-b border-white/5 mb-4 select-none">
                <img src="/logo_franguinhos.png" alt="Franguinhos Logo" className="w-8 h-8 rounded-lg object-contain filter drop-shadow-[0_0_8px_rgba(102,252,241,0.25)]" />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-white leading-none tracking-widest uppercase">Franguinhos</span>
                  <span className="text-[10px] font-black text-cyan-400 leading-none tracking-widest uppercase mt-1">Games</span>
                </div>
              </div>

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
                  <span>Biblioteca</span>
                  {favorites.length > 0 && (
                    <span className="bento-nav-badge bg-pink-600 text-white">
                      {favorites.length}
                    </span>
                  )}
                </button>

                <button 
                  className="bento-nav-item"
                  onClick={() => alert("Comunidade: Feed Social em breve!")}
                >
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>Comunidade</span>
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
                  <span>Modo TEA</span>
                </button>
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
                    <div className="flex flex-col items-center justify-center my-6 text-center select-none">
                      <img 
                        src="/logo_franguinhos.png" 
                        alt="Franguinhos Games Logo" 
                        className="w-48 h-auto filter drop-shadow-[0_0_30px_rgba(102,252,241,0.25)] animate-[float_4s_ease-in-out_infinite]"
                      />
                    </div>
                  )}

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

                  {/* SEÇÃO 'EM DESTAQUE' (Bento Style: 2 wide horizontal cards) */}
                  {activeCategory === 'Tudo' && !searchQuery && games.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xs font-extrabold text-white tracking-widest uppercase bg-cyan-950/40 px-3 py-1 rounded-full border border-cyan-500/20 w-max">
                        ⭐ Em Destaque
                      </h3>
                      
                      <div className="bento-featured-grid">
                        {/* Cartão 1: Bolhas Mágicas (Recomendado do Dia) */}
                        <div 
                          className="bento-card-featured-game cursor-pointer group"
                          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=80')` }}
                          onClick={() => {
                            const bubblePop = games.find(g => g.slug === 'bubble-pop') || games[0];
                            handlePlayGame(bubblePop);
                          }}
                        >
                          <div className="bento-featured-overlay">
                            <span className="bento-card-badge-hot">
                              🎮 RECOMENDADO DO DIA
                            </span>
                            <h2 className="text-lg font-black text-white tracking-tight uppercase group-hover:text-cyan-400 transition">
                              Bolhas Mágicas
                            </h2>
                          </div>
                        </div>
                        
                        {/* Cartão 2: Subway Surfers / Rocket Rise */}
                        <div 
                          className="bento-card-featured-game cursor-pointer group"
                          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80')` }}
                          onClick={() => {
                            const rocketRise = games.find(g => g.slug === 'rocket-rise') || games[1];
                            handlePlayGame(rocketRise);
                          }}
                        >
                          <div className="bento-featured-overlay">
                            <span className="bento-card-badge-hot bg-purple-950/40 border-purple-500/30 text-purple-400">
                              🚀 ALTA PERFORMANCE
                            </span>
                            <h2 className="text-lg font-black text-white tracking-tight uppercase group-hover:text-pink-500 transition">
                              Rocket Rise
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SLOT DE ANÚNCIO SUPERIOR */}
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
                                {/* Pílula do Topo "FRANGUINHOS GAMES" */}
                                <div className="bento-card-top-header">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  <span>Franguinhos Games</span>
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

                  {/* SLOT DE ANÚNCIO IN-FEED LEADERBOARD INFERIOR */}
                  {consentOptions.advertising && (
                    <div className="ad-slot-leaderboard"></div>
                  )}
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

            </div>

            {/* 3. COLUNA DA DIREITA: PAINEL SOCIAL / INTERATIVO */}
            <aside className="bento-sidebar-right">
              {/* Widget de Perfil do Usuário */}
              <div className="bento-profile-card">
                {user ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm border-2 border-cyan-400/30 bento-friend-avatar-glow">
                      {user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-grow">
                      <div className="font-extrabold text-white text-sm leading-none">Olá, {user.username}!</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] text-cyan-400 bg-cyan-950/50 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono uppercase tracking-wider">
                          {user.role === 'super_admin' ? 'Admin' : 'Gamer'}
                        </span>
                        <span className="text-[9px] text-pink-400 bg-pink-950/40 px-1.5 py-0.5 rounded border border-pink-500/10 font-mono uppercase tracking-wider">
                          Nível 12
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={handleLogout} 
                      className="p-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
                      title="Sair da Conta"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-extrabold text-white text-xs leading-none">Jogador Visitante</div>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Salve seus recordes online</span>
                      </div>
                    </div>
                    <button 
                      className="btn-primary py-1.5 px-4 text-[10px] font-black shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                      onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                    >
                      Entrar
                    </button>
                  </div>
                )}
              </div>

              {/* Widget de Amigos Online */}
              <div className="bento-social-card flex-grow flex flex-col min-h-[160px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Amigos Online ({onlineFriends.filter(f => f.status !== 'ausente').length})</span>
                </div>
                
                <div className="space-y-2 overflow-y-auto max-h-[140px] pr-1 bento-sidebar-scroll">
                  {onlineFriends.map((friend) => (
                    <div key={friend.name} className="bento-friend-item">
                      <div className="relative shrink-0">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${friend.avatarColor} flex items-center justify-center text-white font-extrabold text-[10px] bento-friend-avatar-glow`}>
                          {friend.name.substring(0, 2).toUpperCase()}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-black ${
                          friend.status === 'jogando' ? 'bg-green-400 animate-pulse' :
                          friend.status === 'online' ? 'bg-green-400' : 'bg-gray-500'
                        }`} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="text-xs font-extrabold text-white truncate leading-none">{friend.name}</div>
                        <div className="text-[10px] text-gray-400 truncate mt-1">
                          {friend.status === 'jogando' ? `Jogando ${friend.game}` : 'Disponível'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Widget de Chat Ao Vivo */}
              <div className="bento-chat-card flex flex-col min-h-[260px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider mb-2 border-b border-white/5 pb-2 shrink-0">
                  <MessageSquare className="w-4 h-4 text-pink-500" />
                  <span>Chat Geral do Portal</span>
                </div>

                {/* Lista de Mensagens */}
                <div className="flex-grow overflow-y-auto max-h-[160px] space-y-2 pr-1 mb-2 bento-sidebar-scroll">
                  {chatMessages.map((msg, index) => {
                    let bubbleColorClass = 'msg-purple';
                    if (msg.sender === 'GamerPro') bubbleColorClass = 'msg-cyan';
                    else if (msg.sender === 'Alice_Logics') bubbleColorClass = 'msg-pink';
                    else if (msg.sender === 'MatheMágico') bubbleColorClass = 'msg-green';
                    else if (msg.sender === 'Nerd_HTML5') bubbleColorClass = 'msg-yellow';
                    else if (user && msg.sender === user.username) bubbleColorClass = 'msg-pink';

                    return (
                      <div key={index} className={`bento-chat-bubble ${bubbleColorClass}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-extrabold text-white text-[10px] tracking-tight">{msg.sender}</span>
                          <span className="text-[8px] text-gray-500 font-mono">{msg.time}</span>
                        </div>
                        <p className="text-gray-300 text-[11px] leading-relaxed font-semibold">{msg.text}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Input de Envio de Chat */}
                <form onSubmit={handleSendChatMessage} className="flex gap-1.5 border-t border-white/5 pt-2 shrink-0">
                  <input 
                    type="text" 
                    placeholder="Diga algo no chat..." 
                    className="input-field text-xs py-1.5"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn-primary p-2 justify-center rounded-lg bg-cyan-500 text-black border-none hover:bg-cyan-400 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>

              {/* Widget de Pesquisa Flutuante no Rodapé da Sidebar */}
              <div className="bento-floating-search shrink-0">
                <Search className="w-4 h-4 text-cyan-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Pesquisa rápida..." 
                  className="bento-floating-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </aside>

          </div>
        ) : (
          /* VIEWS DE JOGO EM FOCO OU ÁREA ADMINISTRATIVA INTEIRA */
          <>
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
                      className={`text-[10px] uppercase tracking-wider font-extrabold py-1.5 px-4 rounded-full transition-all duration-300 flex items-center gap-1.5 ${adminTab === 'catalog' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] font-black' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => { setAdminTab('catalog'); setAdminViewMode('list'); }}
                    >
                      <FolderGit2 className="w-3.5 h-3.5" /> Catálogo
                    </button>
                    <button 
                      className={`text-[10px] uppercase tracking-wider font-extrabold py-1.5 px-4 rounded-full transition-all duration-300 flex items-center gap-1.5 ${adminTab === 'contracts' ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(0,240,255,0.4)] font-black' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => { setAdminTab('contracts'); setAdminViewMode('list'); }}
                    >
                      <FileSignature className="w-3.5 h-3.5" /> Contratos
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

                {/* TAB 1: CATALOG MANAGMENT */}
                {adminTab === 'catalog' && (
                  <div className="space-y-6">
                    {adminViewMode === 'list' ? (
                      <div className="glass-panel p-6 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                          <div>
                            <h3 className="text-md font-bold text-white uppercase tracking-wider">
                              Catálogo de Circuitos HTML5
                            </h3>
                            <p className="text-xs text-gray-400">
                              Gerencie fichas técnicas de jogos e contratos de licenciamento ativos no portal.
                            </p>
                          </div>
                          <button 
                            className="btn-primary py-2 px-4 flex items-center gap-1.5"
                            onClick={handleAdminAddClick}
                          >
                            <Plus className="w-4 h-4" /> Adicionar Novo Jogo
                          </button>
                        </div>

                        <div className="overflow-x-auto">
                          <table>
                            <thead>
                              <tr>
                                <th>Jogo / ID</th>
                                <th>Categoria</th>
                                <th>Versão</th>
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
                                    <div className="flex items-center gap-3">
                                      {item.game.bannerUrl ? (
                                        <img 
                                          src={item.game.bannerUrl} 
                                          alt={item.game.title} 
                                          className="w-10 h-7 object-cover rounded border border-white/5 shrink-0"
                                        />
                                      ) : (
                                        <div className="w-10 h-7 bg-white/5 rounded border border-white/5 flex items-center justify-center shrink-0">
                                          <Gamepad2 className="w-4 h-4 text-cyan-400" />
                                        </div>
                                      )}
                                      <div>
                                        <div className="font-bold text-white text-xs">{item.game.title}</div>
                                        <div className="text-[10px] text-gray-400 font-mono">slug: {item.game.slug}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className="font-semibold text-purple-300">{item.game.category}</span>
                                  </td>
                                  <td className="font-mono text-[11px] text-gray-300">v{item.game.version}</td>
                                  <td>{getTechnicalBadge(item.game.statusTechnical)}</td>
                                  <td>{getEditorialBadge(item.game.statusEditorial)}</td>
                                  <td>{getDocBadge(item.game.statusDoc)}</td>
                                  <td>
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        className="p-1.5 rounded bg-white/5 hover:bg-cyan-500/20 text-cyan-400 transition"
                                        title="Editar Ficha"
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
                              {adminViewMode === 'add' ? 'Cadastrar Novo Jogo e Acordo' : 'Editar Ficha Técnica'}
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
