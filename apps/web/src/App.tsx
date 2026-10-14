import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Search, Heart, User, LogIn, LogOut, Info, Shield, 
  Settings, HelpCircle, ArrowLeft, Star, Volume2, ShieldAlert, Sparkles,
  Smartphone, Share2, Award, Zap, Brain, Rocket, Grid, Plus, Hash, X, FileText, Lock, Maximize,
  FolderGit2, FileSignature, BarChart3, Cpu, Trash2, Edit2, Calendar, Users, DollarSign, Activity, AlertCircle, ChevronRight,
  MessageSquare, Send, Compass, ChevronLeft, Play, Flame, Trophy, Bell, Clock, Check, GraduationCap, Smile,
  ThumbsUp, ThumbsDown, Flag
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

interface KruujPortalLoaderProps {
  game: Game;
  lang: 'pt' | 'en' | 'es';
  onFinish: () => void;
}

const KruujPortalLoader: React.FC<KruujPortalLoaderProps> = ({ game, lang, onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const tipsMap = {
    pt: [
      'Prepare os fones, a coruja já está chegando.',
      'Dica: use fones de ouvido para imersão estéreo.',
      'Colete recordes e desbloqueie conquistas na KRUUJ Studio!',
      'Gire o celular na horizontal para jogar em tela cheia!'
    ],
    en: [
      'Put on your headphones, the owl is coming.',
      'Tip: use headphones for the best stereo immersion.',
      'Beat high scores and unlock achievements on KRUUJ Studio!',
      'Turn your phone to landscape to play in full screen!'
    ],
    es: [
      'Prepara los auriculares, el búho está llegando.',
      'Consejo: usa auriculares para una mejor inmersión.',
      '¡Supera los récords y desbloquea logros en KRUUJ Studio!',
      '¡Gira tu celular en horizontal para jugar en pantalla completa!'
    ]
  };

  const tips = tipsMap[lang] || tipsMap.pt;

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 3000; // 3.0 segundos garantidos de prestígio de marca

    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / (minDuration - 250)) * 100));
      setProgress(pct);

      if (elapsed >= minDuration) {
        clearInterval(progressInterval);
        setIsFadingOut(true);
        setTimeout(() => {
          onFinish();
        }, 500);
      }
    }, 40);

    const tipInterval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, [tips.length, onFinish]);

  return (
    <div className={`kruuj-portal-loader-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="kruuj-loader-owl-wrap">
        <img src="/kruuj-avatar.png" alt="KRUUJ" className="kruuj-loader-owl-img" />
      </div>

      <div className="kruuj-loader-brand-title">KRUUJ STUDIO</div>
      <h2 className="kruuj-loader-game-name">{game.title}</h2>
      <p className="kruuj-loader-tagline">{tips[0]}</p>

      <div className="kruuj-loader-track">
        <div className="kruuj-loader-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="kruuj-loader-pct">{progress}%</div>
      <p className="kruuj-loader-tip">🦉 {tips[tipIndex]}</p>

      <div className="kruuj-loader-studio-footer">Jogue • Descubra • Conecte</div>
    </div>
  );
};


interface AdaptivePokiClusterProps {
  isScreenLocked: boolean;
  isBabyMode: boolean;
  onExit: () => void;
  onLock: () => void;
  onUnlockRequest: () => void;
}

const AdaptivePokiCluster: React.FC<AdaptivePokiClusterProps> = ({
  isScreenLocked,
  isBabyMode,
  onExit,
  onLock,
  onUnlockRequest
}) => {
  const [side, setSide] = useState<'left' | 'right'>(() => {
    return (localStorage.getItem('kruuj_back_btn_side') as 'left' | 'right') || 'left';
  });
  const [topY, setTopY] = useState<number>(() => {
    const saved = localStorage.getItem('kruuj_back_btn_top');
    return saved ? Math.max(10, Math.min(window.innerHeight - 60, parseInt(saved, 10))) : 14;
  });
  const [isGhost, setIsGhost] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const dragRef = useRef<{ startX: number; startY: number; initialY: number; moved: boolean }>({
    startX: 0,
    startY: 0,
    initialY: 14,
    moved: false
  });
  const idleTimerRef = useRef<any>(null);

  const resetIdleTimer = () => {
    setIsGhost(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setIsGhost(true);
    }, 3200);
  };

  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Rastreamento global por Window durante arraste para resposta tátil 100% fluida
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.hypot(dx, dy) > 5) {
        dragRef.current.moved = true;
        const newY = Math.max(8, Math.min(window.innerHeight - 52, dragRef.current.initialY + dy));
        setTopY(newY);
        resetIdleTimer();
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      setIsDragging(false);
      if (dragRef.current.moved) {
        const newSide = e.clientX > window.innerWidth / 2 ? 'right' : 'left';
        setSide(newSide);
        localStorage.setItem('kruuj_back_btn_side', newSide);
        const finalY = Math.max(8, Math.min(window.innerHeight - 52, dragRef.current.initialY + (e.clientY - dragRef.current.startY)));
        setTopY(finalY);
        localStorage.setItem('kruuj_back_btn_top', String(finalY));
        resetIdleTimer();
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isDragging]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialY: topY,
      moved: false
    };
    resetIdleTimer();
  };

  return (
    <div 
      className={`kruuj-poki-top-cluster side-${side} ${isGhost ? 'idle-ghost' : ''} ${isDragging ? 'dragging' : ''}`}
      style={{
        top: `calc(${topY}px + env(safe-area-inset-top, 0px))`,
        ...(side === 'left' 
          ? { left: 'env(safe-area-inset-left, 0px)', right: 'auto' } 
          : { right: 'env(safe-area-inset-right, 0px)', left: 'auto' })
      }}
      onPointerDown={handlePointerDown}
      onMouseEnter={resetIdleTimer}
      onTouchStart={resetIdleTimer}
    >
      {!isScreenLocked && (
        <button 
          className="kruuj-poki-back-btn" 
          style={{ touchAction: 'none' }}
          onClick={(e) => {
            if (dragRef.current.moved) return;
            onExit();
          }}
          title="Toque para sair ou arraste para mover"
        >
          {side === 'left' ? (
            <ChevronLeft style={{ width: 16, height: 16, minWidth: 16, minHeight: 16 }} className="text-gray-900 stroke-[2.8]" />
          ) : (
            <ChevronRight style={{ width: 16, height: 16, minWidth: 16, minHeight: 16 }} className="text-gray-900 stroke-[2.8]" />
          )}
          <img 
            src="/kruuj-avatar.png" 
            alt="KRUUJ" 
            style={{ width: 22, height: 22, minWidth: 22, minHeight: 22, maxWidth: 22, maxHeight: 22, borderRadius: '50%', objectFit: 'cover' }}
            className="shadow-sm"
          />
        </button>
      )}

      {/* Botão de Bloqueio/Desbloqueio Discreto (Modo Bebês) — Reajustável e Arrastável */}
      {isBabyMode && (
        <button
          className={`kruuj-poki-lock-btn ${isScreenLocked ? 'locked' : ''}`}
          style={{ touchAction: 'none' }}
          onClick={(e) => {
            if (dragRef.current.moved) return;
            if (isScreenLocked) {
              onUnlockRequest(); // Abre o Parent Gate matemático para desbloquear e continuar jogando!
            } else {
              onLock();
            }
          }}
          title={isScreenLocked ? "Desbloquear com Desafio Matemático (Arraste para mover)" : "Bloquear Tela para Bebê (Arraste para mover)"}
        >
          <Lock style={{ width: 14, height: 14 }} className={isScreenLocked ? "text-rose-600 stroke-[2.8]" : "text-gray-700 stroke-[2.2]"} />
          <span className="kruuj-poki-lock-label">{isScreenLocked ? "Desbloquear" : "Bloquear"}</span>
        </button>
      )}
    </div>
  );
};

export default function App() {
  // --- Estados do Portal ---
  const [view, setView] = useState<'home' | 'explore' | 'favorites' | 'profile' | 'details' | 'playing' | 'privacy' | 'terms' | 'contact' | 'report' | 'admin'>('home');
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<string[]>(['Tudo', 'Arcade', 'Memória', 'Ação', 'Educacional', 'Corrida', 'Puzzle', 'Aventura']);
  const [activeCategory, setActiveCategory] = useState<string>('Tudo');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dismissRotateNotice, setDismissRotateNotice] = useState<boolean>(false);

  // Prevenção de rolagem indesejada por teclado (Padrão Poki / HTML5 Games)
  useEffect(() => {
    if (view !== 'playing') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(e.code)) {
        if ((e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view]);


  // Detecção Inteligente e Reativa de Mobile vs Web (Retrato e Paisagem/Landscape)
  const [isMobileMode, setIsMobileMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isMobileLandscape = window.matchMedia('(orientation: landscape) and (max-height: 550px)').matches;
    const isSmallWidth = window.innerWidth <= 768;
    const isUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    return isUA || isCoarse || isSmallWidth || isMobileLandscape;
  });

  useEffect(() => {
    const checkDevice = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const isMobileLandscape = window.matchMedia('(orientation: landscape) and (max-height: 550px)').matches;
      const isSmallWidth = window.innerWidth <= 768;
      const isUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      const mobile = isUA || isCoarse || isSmallWidth || isMobileLandscape;
      setIsMobileMode(mobile);
      if (mobile) {
        document.documentElement.classList.add('device-mobile');
        document.documentElement.classList.remove('device-desktop');
      } else {
        document.documentElement.classList.add('device-desktop');
        document.documentElement.classList.remove('device-mobile');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  
  // Preferências - 7 Verticais de Públicos Oficiais do KRUUJ (Whitepaper Item 6)
  const [agePreference, setAgePreference] = useState<'geral' | 'educacional' | 'terceira_idade' | 'bebes' | 'family' | 'edu' | 'premium'>('geral');
  
  // UX Audit Upgrades — Estados para Skeletons de Transição e Gamificação Social
  const [isCatalogLoading, setIsCatalogLoading] = useState<boolean>(false);
  const [activeChallengeFriend, setActiveChallengeFriend] = useState<string | null>(null);

  // Estados dos Novos Módulos do Layout KRUUJ Oficial
  const [featuredIndex, setFeaturedIndex] = useState<number>(0);
  const [exploreAudience, setExploreAudience] = useState<string>('Todos');
  const [exploreGenre, setExploreGenre] = useState<string>('Todos');
  const [exploreMoment, setExploreMoment] = useState<string>('Todos');
  const [profileTab, setProfileTab] = useState<'conquistas' | 'jogos' | 'favoritos' | 'config'>('conquistas');

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

  // --- FUNDAÇÃO i18n (Português, Inglês e Espanhol) ---
  const [currentLang, setCurrentLang] = useState<'pt' | 'en' | 'es'>(() => {
    const saved = localStorage.getItem('kruuj_lang') as 'pt' | 'en' | 'es';
    if (saved && ['pt', 'en', 'es'].includes(saved)) return saved;
    const nav = (navigator.language || 'pt').toLowerCase();
    if (nav.startsWith('en')) return 'en';
    if (nav.startsWith('es')) return 'es';
    return 'pt';
  });

  const changeLanguage = (lang: 'pt' | 'en' | 'es') => {
    setCurrentLang(lang);
    localStorage.setItem('kruuj_lang', lang);
  };

  const I18N_TEXTS: Record<'pt' | 'en' | 'es', Record<string, string>> = {
    pt: {
      searchPlaceholder: "Buscar jogos, categorias...",
      calmMode: "Calmo",
      playNow: "Jogar agora",
      trending: "Em alta",
      discoveries: "Descobertas",
      newReleases: "Novos Lançamentos",
      mostPlayed: "Mais Jogados",
      favorites: "Favoritos",
      explore: "Explorar",
      share: "Compartilhar",
      details: "Detalhes",
      unlock: "Desbloquear",
      exit: "Sair do Jogo",
      all: "Tudo",
      login: "Entrar",
      profile: "Perfil",
      navHome: "Início",
      navExplore: "Explorar",
      navFavorites: "Favoritos",
      navProfile: "Perfil",
      navSettings: "Ajustes",
      audAll: "Todos os Jogos",
      audBaby: "Bebês (0-4 anos)",
      audKids: "Crianças (5-10 anos)",
      audPlay: "Geral (Casual)",
      audFamily: "Família (Jogue Junto)",
      audSenior: "60+ (Mente Ativa & Zen)",
      audEdu: "Educacional & Aprendizado",
      favBadge: "FAVORITO",
      favTitle: "Seus Jogos Favoritos",
      favEmpty: "Você ainda não favoritou nenhum jogo. Clique no coração ❤️ em qualquer jogo do catálogo para salvar aqui!",
      noGamesFound: "Nenhum jogo encontrado com os filtros selecionados.",
      footerAbout: "Sobre a KRUUJ",
      footerTerms: "Termos de Uso",
      footerPrivacy: "Privacidade",
      footerDevs: "Desenvolvedores",
      footerRights: "Todos os direitos reservados.",
      tagNew: "NOVO"
    },
    en: {
      searchPlaceholder: "Search games, categories...",
      calmMode: "Calm",
      playNow: "Play now",
      trending: "Trending",
      discoveries: "Discoveries",
      newReleases: "New Releases",
      mostPlayed: "Most Played",
      favorites: "Favorites",
      explore: "Explore",
      share: "Share",
      details: "Details",
      unlock: "Unlock",
      exit: "Exit Game",
      all: "All",
      login: "Sign In",
      profile: "Profile",
      navHome: "Home",
      navExplore: "Explore",
      navFavorites: "Favorites",
      navProfile: "Profile",
      navSettings: "Settings",
      audAll: "All Games",
      audBaby: "Babies (0-4 yrs)",
      audKids: "Kids (5-10 yrs)",
      audPlay: "General (Casual)",
      audFamily: "Family (Play Together)",
      audSenior: "60+ (Active Mind & Zen)",
      audEdu: "Educational & Learning",
      favBadge: "FAVORITE",
      favTitle: "Your Favorite Games",
      favEmpty: "You haven't favorited any games yet. Click the heart ❤️ on any game to save it here!",
      noGamesFound: "No games found matching your selected filters.",
      footerAbout: "About KRUUJ",
      footerTerms: "Terms of Service",
      footerPrivacy: "Privacy Policy",
      footerDevs: "For Developers",
      footerRights: "All rights reserved.",
      tagNew: "NEW"
    },
    es: {
      searchPlaceholder: "Buscar juegos, categorías...",
      calmMode: "Calma",
      playNow: "Jugar ahora",
      trending: "Tendencias",
      discoveries: "Descubrimientos",
      newReleases: "Novedades",
      mostPlayed: "Más Jugados",
      favorites: "Favoritos",
      explore: "Explorar",
      share: "Compartir",
      details: "Detalles",
      unlock: "Desbloquear",
      exit: "Salir del Juego",
      all: "Todos",
      login: "Iniciar sesión",
      profile: "Perfil",
      navHome: "Inicio",
      navExplore: "Explorar",
      navFavorites: "Favoritos",
      navProfile: "Perfil",
      navSettings: "Ajustes",
      audAll: "Todos los Juegos",
      audBaby: "Bebés (0-4 años)",
      audKids: "Niños (5-10 años)",
      audPlay: "General (Casual)",
      audFamily: "Familia (Jugar Juntos)",
      audSenior: "60+ (Mente Activa & Zen)",
      audEdu: "Educativo y Aprendizaje",
      favBadge: "FAVORITO",
      favTitle: "Tus Juegos Favoritos",
      favEmpty: "Aún no has agregado juegos a favoritos. ¡Haz clic en el corazón ❤️ para guardarlo aquí!",
      noGamesFound: "No se encontraron juegos con los filtros seleccionados.",
      footerAbout: "Sobre KRUUJ",
      footerTerms: "Términos de Uso",
      footerPrivacy: "Privacidad",
      footerDevs: "Desarrolladores",
      footerRights: "Todos los derechos reservados.",
      tagNew: "NUEVO"
    }
  };
  const t = I18N_TEXTS[currentLang];

  // Sempre que a rota/view mudar, rola a página de volta ao topo absoluto após a renderização do React
  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 60); // 60ms dá tempo suficiente para a renderização do novo layout se consolidar
    return () => clearTimeout(timer);
  }, [view]);
  
  // Controle de Saída de Segurança (Parent Gate - Modo Bebês)
  const [showParentGate, setShowParentGate] = useState<boolean>(false);
  const [parentMath, setParentMath] = useState({ n1: 0, n2: 0, op: '+' });
  const [parentInput, setParentInput] = useState<string>('');
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [accountSubView, setAccountSubView] = useState<'menu' | 'history'>('menu');
  const wakeLockRef = useRef<any>(null);
  const lastCommercialTimeRef = useRef<number>(0);

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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);

  // Refs de sincronização de saves em nuvem com o jogo
  const gameIframeRef = useRef<HTMLIFrameElement | null>(null);
  const cloudSaveDataRef = useRef<any>(null);

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



  // Bloquear navegação traseira (Botão Voltar do Android/Browser) no Modo Bebês e restaurar fullscreen no toque/gesto
  useEffect(() => {
    if (!isScreenLocked) {
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overscrollBehavior = '';
      return;
    }

    // Trava de comportamento de overscroll para impedir navegação por deslize de borda e pull-to-refresh
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overscrollBehavior = 'none';

    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      if (isScreenLocked) {
        window.history.pushState(null, '', window.location.href);
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        alert("O Modo Bebês está ativo! Resolva o cálculo do cadeado de segurança para sair do jogo.");
      }
    };

    const handleTouchToRestore = () => {
      if (isScreenLocked && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('touchstart', handleTouchToRestore, { passive: true });
    window.addEventListener('touchend', handleTouchToRestore, { passive: true });
    window.addEventListener('click', handleTouchToRestore);
    window.addEventListener('resize', handleTouchToRestore);
    window.addEventListener('focus', handleTouchToRestore);

    return () => {
      document.documentElement.style.overscrollBehavior = '';
      document.body.style.overscrollBehavior = '';
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('touchstart', handleTouchToRestore);
      window.removeEventListener('touchend', handleTouchToRestore);
      window.removeEventListener('click', handleTouchToRestore);
      window.removeEventListener('resize', handleTouchToRestore);
      window.removeEventListener('focus', handleTouchToRestore);
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
  const [portalLoaderActive, setPortalLoaderActive] = useState<boolean>(true);

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

  // Efeito para carregar o histórico de jogos recentes sincronizado na nuvem por conta de usuário
  useEffect(() => {
    const loadUserHistory = async () => {
      if (!user) {
        setRecentGames([]);
        return;
      }

      // 1. Tenta carregar do cache local primeiro para exibição instantânea
      const storedRecents = localStorage.getItem(`recents_${user.username}`);
      if (storedRecents) {
        try {
          const parsed = JSON.parse(storedRecents);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map(item => {
              if (typeof item === 'string') return { id: item, timestamp: Date.now() };
              if (item && typeof item === 'object' && item.id) return { id: item.id, timestamp: item.timestamp || Date.now() };
              return null;
            }).filter((item): item is RecentPlay => !!item);
            setRecentGames(normalized);
          }
        } catch (e) {}
      }

      // 2. Sincroniza com a nuvem no Supabase (compartilhado entre Celular e PC)
      if (token) {
        try {
          const res = await fetch('/api/user/history', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const cloudHistory = await res.json();
            if (Array.isArray(cloudHistory) && cloudHistory.length > 0) {
              const mapped: RecentPlay[] = cloudHistory.map((h: any) => {
                const match = games.find(g => g.slug === h.gameSlug) || defaultGamesCatalog.find(g => g.slug === h.gameSlug);
                return {
                  id: match ? match.id : h.gameSlug,
                  timestamp: new Date(h.lastPlayed).getTime()
                };
              });
              setRecentGames(mapped);
              localStorage.setItem(`recents_${user.username}`, JSON.stringify(mapped));
            }
          }
        } catch (e) {}
      }
    };

    loadUserHistory();
  }, [user, token, games]);


  // --- Efeitos e Inicialização ---
  useEffect(() => {
    // Carregar dados de Autenticação do LocalStorage (garante que apenas tokens reais sejam mantidos)
    const storedUser = localStorage.getItem('arcade_user');
    const storedToken = localStorage.getItem('arcade_token');
    if (storedUser && storedToken) {
      if (storedToken === 'fake-jwt-token' || (storedUser && JSON.parse(storedUser).id === 'fake-id')) {
        localStorage.removeItem('arcade_user');
        localStorage.removeItem('arcade_token');
        setUser(null);
        setToken(null);
      } else {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch(e) {
          localStorage.removeItem('arcade_user');
          localStorage.removeItem('arcade_token');
        }
      }
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

  // --- Prevenir que setas do teclado e espaço rolem a página do navegador durante a partida ---
  useEffect(() => {
    if (view !== 'playing') return;

    const handleKeyDownPreventScroll = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        const target = e.target as HTMLElement;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDownPreventScroll, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDownPreventScroll);
  }, [view]);

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

  // --- Bloqueio de rolagem do fundo quando um jogo estiver ativo ---
  useEffect(() => {
    if (view === 'playing' && selectedGame && isMobileMode) {
      document.body.classList.add('playing-game-mode');
      document.documentElement.classList.add('playing-game-mode');
    } else {
      document.body.classList.remove('playing-game-mode');
      document.documentElement.classList.remove('playing-game-mode');
    }
    return () => {
      document.body.classList.remove('playing-game-mode');
      document.documentElement.classList.remove('playing-game-mode');
    };
  }, [view, selectedGame]);

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

  // Carregamento de favoritos salvos (funciona para visitantes anônimos e usuários)
  useEffect(() => {
    const loadSavedFavorites = async () => {
      // 1. Carrega imediatamente do localStorage para resposta instantânea
      const storageKey = user ? `kruuj_favorites_${user.username}` : 'kruuj_guest_favorites';
      const local = localStorage.getItem(storageKey) || localStorage.getItem('kruuj_guest_favorites');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            setFavorites(parsed);
          }
        } catch (e) {}
      }

      // 2. Se logado, sincroniza com o backend em nuvem (Supabase)
      if (user && token) {
        try {
          const response = await fetch('/api/user/favorites', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const apiData = await response.json();
            if (Array.isArray(apiData) && apiData.length > 0) {
              const apiSlugsOrIds = apiData.map((f: any) => f.gameSlug || f.gameId);
              setFavorites(prev => {
                const combined = Array.from(new Set([...prev, ...apiSlugsOrIds]));
                localStorage.setItem(`kruuj_favorites_${user.username}`, JSON.stringify(combined));
                return combined;
              });
            }
          }
        } catch (e) {}
      }
    };

    loadSavedFavorites();
  }, [user, token]);

  // Limpeza automática de IDs órfãos/fantasmas que não pertencem a nenhum jogo do catálogo
  useEffect(() => {
    if (games.length === 0 || favorites.length === 0) return;
    const cleaned = favorites.filter(fav =>
      games.some(g => g.id === fav || g.slug === fav)
    );
    if (cleaned.length !== favorites.length) {
      setFavorites(cleaned);
      const storageKey = user ? `kruuj_favorites_${user.username}` : 'kruuj_guest_favorites';
      try {
        localStorage.setItem(storageKey, JSON.stringify(cleaned));
        localStorage.setItem('kruuj_guest_favorites', JSON.stringify(cleaned));
      } catch (e) {}
    }
  }, [games, favorites, user]);

  // Catálogo Oficial KRUUJ — Apenas os 14 Jogos Físicos Reais Implementados
  const defaultGamesCatalog: Game[] = [
    {
      id: '1',
      slug: 'rocket-rise',
      title: 'KRUUJ Rocket Rise',
      description: 'Acelere nessa aventura intergaláctica cheia de adrenalina! Pilote sua nave espacial, desvie de chuvas de meteoros e colete energia estelar para subir o mais alto possível.',
      category: 'Arcade',
      subcategories: ['Corrida', 'Espaço', 'Ação'],
      tags: ['corrida', 'espaco', 'arcade', 'foguete', 'velocidade'],
      ageRating: 'Livre',
      bannerUrl: '/banners/rocket-rise.jpg',
      iconUrl: '/icons/rocket-rise.jpg',
      prefixUrl: '/games/rocket-rise/',
      version: '1.2.0',
      controls: { mouse: false, teclado: true, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '2',
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
      id: '3',
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
      id: '4',
      slug: 'bubble-pop',
      title: 'Bubble Boom',
      description: 'Estoure bolhas mágicas coloridas em um ambiente vibrante, calmo e seguro. Perfeito para relaxar e exercitar a coordenação motora de crianças e bebês.',
      category: 'Bebês',
      subcategories: ['Lúdico', 'Sensorial', 'Cores'],
      tags: ['bebes', 'bolhas', 'cores', 'sensorial', 'relaxante'],
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
      author: 'KRUUJ Original',
      licenseName: 'Proprietário'
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
      slug: 'math-run',
      title: 'Super Math Run',
      description: 'Jogos de soma e matemática online. Corra, pule obstáculos e responda contas e cálculos rápidos mentalmente para continuar avançando.',
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
      id: '7',
      slug: 'memory-match',
      title: 'Memory Training Neon',
      description: 'Jogos gratuitos para exercitar a mente combinando cartas de neon vibrantes diretamente no navegador.',
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
      id: '8',
      slug: 'kruujdoku',
      title: 'KRUUJDOKU',
      description: 'O puzzle oficial de raciocínio lógico das corujinhas do KRUUJ! 100 fases desafiadoras + Modo Infinito com regras puras de dedução, cores harmônicas e relaxamento mental.',
      category: 'Puzzle',
      subcategories: ['Sudoku', 'Lógica', 'Corujas', 'Cognitivo'],
      tags: ['kruujdoku', 'sudoku', 'corujas', 'puzzle', 'mente', 'raciocinio', 'zen'],
      ageRating: 'Livre',
      bannerUrl: '/banners/kruujdoku.jpg',
      iconUrl: '/icons/kruujdoku.png',
      prefixUrl: '/games/kruujdoku/',
      version: '1.0.0',
      controls: { mouse: true, teclado: true, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '9',
      slug: 'kruujio',
      title: 'KRUUJ.IO ARENA',
      description: 'A grande arena competitiva das corujas! Entre no campo de batalha cósmico, colete energia estelar para crescer, use boost com sabedoria e derrote os rivais para alcançar o Rank #1.',
      category: 'Ação',
      subcategories: ['Arena', 'Multiplayer', 'Sobrevivência', 'Battle Royale'],
      tags: ['kruujio', 'arena', 'acao', 'io', 'corujas', 'competitivo', 'multiplayer'],
      ageRating: 'Livre',
      bannerUrl: '/banners/kruujio.png',
      iconUrl: '/icons/kruujio.png',
      prefixUrl: '/games/kruujio/',
      version: '1.0.0',
      controls: { mouse: true, teclado: true, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '10',
      slug: 'kruuj-orbit',
      title: 'KRUUJ ORBIT',
      description: 'Salte entre órbitas planetárias com a física da coruja cósmica. Toque para se soltar e capture o campo gravitacional do próximo planeta!',
      category: 'Arcade',
      subcategories: ['Arcade', 'Gravidade', 'Espaço', 'One-Touch'],
      tags: ['orbit', 'kruuj', 'espaco', 'arcade', 'gravidade', 'corujas', 'salto', 'kids'],
      ageRating: 'Livre',
      bannerUrl: '/banners/kruuj-orbit.jpg',
      iconUrl: '/icons/kruuj-orbit.png',
      prefixUrl: '/games/kruuj-orbit/',
      version: '1.0.0',
      controls: { mouse: true, teclado: true, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '11',
      slug: 'kruuj-match',
      title: 'KRUUJ MATCH',
      description: 'Puzzle zen de alquimia estelar! Combine 3 ou mais cristais rúnicos cósmicos e crie super poderes para libertar a energia mágica da coruja.',
      category: 'Puzzle',
      subcategories: ['Match-3', 'Puzzle', 'Zen', 'Lógica'],
      tags: ['match3', 'kruuj', 'puzzle', 'zen', 'alquimia', 'mente', 'relaxar', 'idoso', 'familia'],
      ageRating: 'Livre',
      bannerUrl: '/banners/kruuj-match.jpg',
      iconUrl: '/icons/kruuj-match.png',
      prefixUrl: '/games/kruuj-match/',
      version: '1.0.0',
      controls: { mouse: true, teclado: false, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '12',
      slug: 'kruuj-defense',
      title: 'KRUUJ GUARDIANS',
      description: 'Tower defense tático estilo Bloons TD! Posicione Corujas Guardiãs para estourar balões cósmicos com penas, gelo, raio e lasers!',
      category: 'Ação',
      subcategories: ['Tower Defense', 'Estratégia', 'Ação', 'Defesa'],
      tags: ['defense', 'kruuj', 'torres', 'estrategia', 'guardioes', 'acao', 'familia'],
      ageRating: 'Livre',
      bannerUrl: '/banners/kruuj-defense.jpg',
      iconUrl: '/icons/kruuj-defense.png',
      prefixUrl: '/games/kruuj-defense/',
      version: '1.0.0',
      controls: { mouse: true, teclado: false, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '14',
      slug: 'kruuj-words',
      title: 'KRUUJ WORD',
      description: 'O enigma das corujas! Conecte letras cósmicas na roda mágica para desvendar palavras secretas e alimentar os filhotinhos de coruja.',
      category: 'Educacional',
      subcategories: ['Palavras', 'Lógica', 'Vocabulário', 'Educativo'],
      tags: ['palavras', 'kruuj', 'educacional', 'letras', 'vocabulario', 'enigma', 'kids', 'infantil'],
      ageRating: 'Livre',
      bannerUrl: '/banners/kruuj-words.jpg',
      iconUrl: '/icons/kruuj-words.png',
      prefixUrl: '/games/kruuj-words/',
      version: '1.0.0',
      controls: { mouse: true, teclado: false, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '15',
      slug: 'kruuj-overdrive',
      title: 'KRUUJ OVERDRIVE',
      description: 'KRUUJ OVERDRIVE — World Tour! Acelere pelas ruas de Tóquio, Miami e Berlim em uma corrida arcade alucinante estilo OutRun.',
      category: 'Arcade',
      subcategories: ['Corrida', 'Retrô', 'Ação'],
      tags: ['corrida', 'outrun', 'retro', 'kruuj', 'arcade', 'carros'],
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/kruuj-overdrive/',
      version: '1.0.0',
      controls: { mouse: true, teclado: true, toque: true, gamepad: false },
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '16',
      slug: 'kruuj-solitaire',
      title: 'KRUUJ SOLITAIRE',
      description: 'KRUUJ SOLITAIRE — O clássico Paciência repaginado! Relaxe com cartas de visual moderno e temas personalizáveis no melhor estilo KRUUJ.',
      category: 'Terceira Idade',
      subcategories: ['Cartas', 'Paciência', 'Clássico', 'Relaxante'],
      tags: ['cartas', 'paciencia', 'solitaire', 'idoso', 'relaxante', 'kruuj'],
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'grid',
      prefixUrl: '/games/kruuj-solitaire/',
      version: '1.0.0',
      controls: { mouse: true, teclado: false, toque: true, gamepad: false },
      orientation: 'portrait',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '17',
      slug: 'kruuj-penalty',
      title: 'KRUUJ 3D PENALTY SHOOTOUT',
      description: 'KRUUJ 3D Penalty Shootout! Sinta a tensão do futebol e cobre pênaltis com gráficos 3D incríveis e física realista. Torne-se o campeão da Copa!',
      category: 'Ação',
      subcategories: ['Esporte', 'Futebol', '3D', 'Competitivo'],
      tags: ['futebol', 'penalti', 'esporte', '3d', 'kruuj', 'chute'],
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1518605368461-1e1252281146?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'award',
      prefixUrl: '/games/kruuj-penalty/',
      version: '1.0.0',
      controls: { mouse: true, teclado: false, toque: true, gamepad: false },
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '18',
      slug: 'kruuj-dominio',
      title: 'KRUUJ NEON DOMAIN',
      description: 'KRUUJ NEON DOMAIN: Conquiste o território! Um jogo de estratégia abstrato onde você deve cercar e dominar a malha cibernética antes dos adversários.',
      category: 'Estratégia',
      subcategories: ['Tabuleiro', 'Neon', 'Abstrato', 'Tático'],
      tags: ['estrategia', 'tabuleiro', 'neon', 'dominio', 'kruuj', 'tatico'],
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'cpu',
      prefixUrl: '/games/kruuj-dominio/',
      version: '1.0.0',
      controls: { mouse: true, teclado: false, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Studio',
      licenseName: 'Proprietário'
    },
    {
      id: '19',
      slug: 'kruuj-paint',
      title: 'KRUUJ BABY PAINT',
      description: 'Livre sua criatividade com KRUUJ BABY PAINT! Um ambiente lúdico e seguro para crianças desenharem e colorirem os personagens da coruja.',
      category: 'Bebês',
      subcategories: ['Arte', 'Desenho', 'Criativo', 'Infantil'],
      tags: ['arte', 'pintar', 'desenho', 'bebes', 'infantil', 'criatividade', 'kruuj'],
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'edit2',
      prefixUrl: '/games/kruuj-paint/',
      version: '1.0.0',
      controls: { mouse: true, teclado: false, toque: true, gamepad: false },
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'KRUUJ Original',
      licenseName: 'Proprietário'
    }
  ];

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games');
      if (response.ok) {
        const apiGames: Game[] = await response.json();
        // Filtra estritamente os jogos físicos reais eliminando quaisquer fictícios
        const validSlugs = new Set(defaultGamesCatalog.map(g => g.slug));
        const filteredApiGames = apiGames.filter(g => validSlugs.has(g.slug));
        const apiSlugs = new Set(filteredApiGames.map(g => g.slug));
        const missingFromApi = defaultGamesCatalog.filter(m => !apiSlugs.has(m.slug));
        setGames([...filteredApiGames, ...missingFromApi]);
      } else {
        throw new Error('Falha ao obter jogos');
      }
    } catch (err) {
      console.warn('API não disponível no momento. Utilizando catálogo base no frontend.');
      setGames(defaultGamesCatalog);
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

  // Helper para checar se um jogo está favoritado (por id ou slug)
  const isGameFavorited = (g: Game | null | undefined) => {
    if (!g) return false;
    return favorites.some(fav => fav && (fav === g.id || fav === g.slug));
  };

  // Lista real de jogos favoritados que realmente existem no catálogo (elimina IDs fantasmas)
  const userFavoritesList = games.filter(isGameFavorited);

  // --- Função Universal de Favoritar (Funciona Imediatamente para Visitantes e Logados) ---
  const handleToggleFavorite = async (gameIdOrSlug: string) => {
    const game = games.find(g => g.id === gameIdOrSlug || g.slug === gameIdOrSlug) ||
                 defaultGamesCatalog.find(g => g.id === gameIdOrSlug || g.slug === gameIdOrSlug);
    const id = game ? game.id : gameIdOrSlug;
    const slug = game ? game.slug : gameIdOrSlug;

    const isFav = favorites.includes(id) || favorites.includes(slug);
    let nextFavorites: string[];

    if (isFav) {
      nextFavorites = favorites.filter(f => f !== id && f !== slug);
      setLikesCount(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 1) - 1) }));
    } else {
      nextFavorites = [...favorites, id];
      setLikesCount(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
      logEvent('favorite_added', { gameId: id, slug });
    }

    setFavorites(nextFavorites);

    // Salva no localStorage para não perder em reloads (visitantes e usuários)
    const storageKey = user ? `kruuj_favorites_${user.username}` : 'kruuj_guest_favorites';
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextFavorites));
      localStorage.setItem('kruuj_guest_favorites', JSON.stringify(nextFavorites));
    } catch (e) {}

    // Se estiver logado, sincroniza com o backend em nuvem no Supabase
    if (user && token && game) {
      try {
        await fetch(`/api/user/favorites/${game.slug}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
          }
        });
      } catch (e) {
        console.warn('Erro ao sincronizar favorito na nuvem:', e);
      }
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
      console.error('Erro de conexão:', err);
      setAuthError('Não foi possível conectar ao servidor da nuvem. O serviço pode estar acordando (Render Free leva ~30s), por favor tente novamente em instantes.');
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

    try {
      if (screen.orientation && (screen.orientation as any).unlock) {
        (screen.orientation as any).unlock();
      }
    } catch (e) {}

    setIsScreenLocked(false);

    // Rola a página de volta para o topo (Garante que não fique perdida embaixo)
    window.scrollTo({ top: 0, behavior: 'instant' });

    logEvent('game_exit', { gameId: selectedGame?.id, gameSlug: selectedGame?.slug });
  };

  // Gatilho de saída: SÓ exige conta matemática se o bloqueio de tela estiver ATIVO!
  const triggerExitGame = () => {
    if (isScreenLocked) {
      // Bloqueio ATIVO: Exige desafio matemático para desbloquear
      const isMult = Math.random() > 0.4;
      const n1 = Math.floor(Math.random() * 5) + 2; // 2 a 6
      const n2 = Math.floor(Math.random() * 5) + 2;
      setParentMath({ n1, n2, op: isMult ? 'x' : '+' });
      setParentInput('');
      setShowParentGate(true);
    } else {
      // Bloqueio DESATIVADO: Sai direto para a Home sem pedir conta matemática!
      executeExitGame();
    }
  };

  // Desbloqueia o jogo e CONTINUA JOGANDO (Permanece na partida sem sair para a Home)
  const handleUnlockAndStay = () => {
    const expected = parentMath.op === 'x' ? parentMath.n1 * parentMath.n2 : parentMath.n1 + parentMath.n2;
    if (parseInt(parentInput.trim(), 10) === expected) {
      setIsScreenLocked(false);
      setShowParentGate(false);
      setParentInput('');
    } else {
      setParentInput('');
      alert("Resposta incorreta. Tente novamente.");
    }
  };

  // Desbloqueia e SAI PARA A HOME
  const handleUnlockAndExit = () => {
    const expected = parentMath.op === 'x' ? parentMath.n1 * parentMath.n2 : parentMath.n1 + parentMath.n2;
    if (parseInt(parentInput.trim(), 10) === expected) {
      setIsScreenLocked(false);
      setShowParentGate(false);
      setParentInput('');
      executeExitGame();
    } else {
      setParentInput('');
      alert("Resposta incorreta. Tente novamente.");
    }
  };

  const handleParentGateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Padrão: Desbloqueia e permanece no jogo!
    handleUnlockAndStay();
  };

  // Iniciar Jogo de forma instantânea com sincronização de save da nuvem
  const handlePlayGame = async (game?: Game | null) => {
    if (!game) return;
    setDismissRotateNotice(false);
    setPortalLoaderActive(false); // O loading é nativo dentro do iframe de cada jogo!
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedGame(game);
    setIsPlayingGame(true);
    setView('playing');
    cloudSaveDataRef.current = null;
    logEvent('game_start', { gameId: game.id, gameSlug: game.slug });

    // Se estiver conectado na conta, recupera save em nuvem do Supabase e atualiza histórico
    if (user && token) {
      try {
        const res = await fetch(`/api/user/progress/${game.slug}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const prog = await res.json();
          if (prog.found && prog.saveData) {
            cloudSaveDataRef.current = prog.saveData;
          }
        }
      } catch (e) {}

      // Registra no histórico em nuvem no Supabase
      try {
        await fetch('/api/user/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            gameSlug: game.slug,
            gameTitle: game.title,
            score: 0
          })
        });
      } catch (e) {}
    }

    // Gravação de históricos de jogos recentes no estado e cache local
    setRecentGames(prev => {
      const filtered = prev.filter(play => play.id !== game.id);
      const updated = [{ id: game.id, timestamp: Date.now() }, ...filtered].slice(0, 30);
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

  // Ouvinte global para mensagens do iframe dos jogos (save states em nuvem e telemetria)
  useEffect(() => {
    const handleGameMessage = async (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      // =========================================================================
      // TRATAMENTO OFICIAL DO KRUUJ SDK / POKI SDK (Poki Architecture Blueprint)
      // =========================================================================
      if (data.source === 'KRUUJ_SDK' || data.source === 'POKI_SDK') {
        const respond = (success: boolean, responseData?: any, error?: string) => {
          if (event.source && typeof (event.source as any).postMessage === 'function') {
            (event.source as any).postMessage({
              source: 'KRUUJ_PORTAL',
              id: data.id,
              success,
              data: responseData,
              error
            }, '*');
          }
        };

        const slug = selectedGame?.slug || '';

        switch (data.action) {
          case 'init':
            respond(true, { version: '1.0.0', platform: 'KRUUJ' });
            break;

          case 'gameLoadingFinished':
            logEvent('game_loading_finished', { gameSlug: slug });
            respond(true);
            break;

          case 'gameplayStart':
            logEvent('gameplay_start', { gameSlug: slug });
            respond(true);
            break;

          case 'gameplayStop':
            logEvent('gameplay_stop', { gameSlug: slug });
            respond(true);
            break;

          case 'commercialBreak': {
            // Pacing inteligente Poki: mínimo 90s entre interstitials para não frustrar o jogador
            const now = Date.now();
            const lastAd = lastCommercialTimeRef.current || 0;
            if (now - lastAd > 90000) {
              lastCommercialTimeRef.current = now;
              setTimeout(() => {
                respond(true);
              }, 1800);
            } else {
              respond(true);
            }
            break;
          }

          case 'rewardedBreak': {
            // Anúncio voluntário recompensado zera o timer do commercialBreak
            lastCommercialTimeRef.current = Date.now();
            setTimeout(() => {
              respond(true, { success: true });
            }, 1500);
            break;
          }

          case 'measure':
            logEvent('game_measure', { gameSlug: slug, ...data.payload });
            respond(true);
            break;

          case 'getLanguage':
            respond(true, currentLang);
            break;

          case 'getUser':
            respond(true, user ? { id: user.id, username: user.username } : null);
            break;

          case 'getToken':
            respond(true, token || null);
            break;

          default:
            respond(true);
            break;
        }
        return;
      }

      const authToken = token || localStorage.getItem('arcade_token');
      const authUser = user || (localStorage.getItem('arcade_user') ? JSON.parse(localStorage.getItem('arcade_user')!) : null);
      const isRealAuth = authToken && authToken !== 'fake-jwt-token';
      const slug = data.gameSlug || selectedGame?.slug;

      // 0. Solicitação de orientação paisagem (Landscape) vinda do jogo
      if (data.type === 'request_landscape') {
        try {
          /* Fullscreen handled via CSS 100vw x 100dvh without OS popup */
        } catch(e) {}
        try {
          if (screen.orientation && (screen.orientation as any).lock) {
            (screen.orientation as any).lock('landscape').catch(() => {});
          }
        } catch(e) {}
      }

      // 1. O jogo acabou de carregar: envia save da nuvem para o jogo se houver
      if (data.type === 'game_loaded') {
        if (cloudSaveDataRef.current && gameIframeRef.current?.contentWindow) {
          gameIframeRef.current.contentWindow.postMessage({
            type: 'load_cloud_save',
            saveData: cloudSaveDataRef.current
          }, '*');
        }
      }

      // 2. Início de partida
      if (data.type === 'game_start') {
        logEvent('game_start', { gameSlug: slug });
        if (isRealAuth && slug) {
          try {
            await fetch('/api/user/history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },
              body: JSON.stringify({
                gameSlug: slug,
                gameTitle: selectedGame?.title || slug,
                score: 0
              })
            });
          } catch(e) {}
        }
      }

      // 3. O jogo emitiu um save de progresso
      if (data.type === 'game_save' && data.saveData) {
        if (isRealAuth && slug) {
          try {
            await fetch(`/api/user/progress/${slug}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },
              body: JSON.stringify({
                saveData: data.saveData,
                score: data.score || 0
              })
            });

            await fetch('/api/user/history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },
              body: JSON.stringify({
                gameSlug: slug,
                gameTitle: selectedGame?.title || slug,
                score: data.score || 0
              })
            });
          } catch (e) {
            console.warn('Erro ao salvar progresso em nuvem:', e);
          }
        }
      }

      // 4. Jogo concluído / Game Over
      if (data.type === 'game_completed' || data.type === 'game_over') {
        logEvent('game_completed', { gameSlug: slug, score: data.score || 0 });
        if (isRealAuth && slug) {
          try {
            await fetch('/api/user/history', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },
              body: JSON.stringify({
                gameSlug: slug,
                gameTitle: selectedGame?.title || slug,
                score: data.score || 0
              })
            });

            if (data.saveData || data.score) {
              await fetch(`/api/user/progress/${slug}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authToken}`
                },
                body: JSON.stringify({
                  saveData: data.saveData || { score: data.score, completedAt: Date.now() },
                  score: data.score || 0
                })
              });
            }
          } catch (e) {}
        }
      }
    };

    window.addEventListener('message', handleGameMessage);
    return () => window.removeEventListener('message', handleGameMessage);
  }, [user, token, selectedGame]);

  const handleManualFullscreen = () => {
    const target = document.getElementById('game-fullscreen-target') || document.querySelector('.iframe-container');
    if (!document.fullscreenElement && target) {
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(() => {});
      } else if ((target as any).webkitRequestFullscreen) {
        (target as any).webkitRequestFullscreen();
      }
    } else {
      // SÓ permite sair do fullscreen se o lockscreen estiver DESATIVADO!
      if (!isScreenLocked && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Enviar Evento de Analítica (alimenta a tabela AnalyticsEvent no banco em conformidade com LGPD)
  const logEvent = async (type: string, payload: Record<string, any> = {}) => {
    const authUser = user || (localStorage.getItem('arcade_user') ? JSON.parse(localStorage.getItem('arcade_user')!) : null);
    
    let sessId = localStorage.getItem('kruuj_session_id');
    if (!sessId) {
      sessId = 'sess_' + Math.random().toString(36).substring(2, 11);
      try { localStorage.setItem('kruuj_session_id', sessId); } catch(e) {}
    }

    const eventBody = {
      eventType: type,
      sessionId: sessId,
      userId: authUser?.id || null,
      deviceType: window.innerWidth < 768 ? 'mobile' : 'desktop',
      browser: navigator.userAgent.substring(0, 40),
      consentGiven: true,
      ...payload
    };

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

  // Filtragem de Jogos baseada nas preferências ativas e filtros dimensionais de exploração
  const getFilteredGames = () => {
    let result = [...games];

    // Se estiver na tela Explorar, aplica os filtros da proposta oficial
    if (view === 'explore') {
      if (exploreAudience !== 'Todos') {
        if (exploreAudience === 'Baby') result = result.filter(g => g.category === 'Bebês' || g.tags.includes('bebes'));
        else if (exploreAudience === 'Kids') result = result.filter(g => g.category === 'Educacional' || g.tags.includes('kids') || g.tags.includes('infantil'));
        else if (exploreAudience === 'Play') result = result.filter(g => g.ageRating === 'Livre' || g.ageRating === '10+');
        else if (exploreAudience === 'Family') result = result.filter(g => g.category === 'Família' || g.tags.includes('familia'));
        else if (exploreAudience === '60+') result = result.filter(g => g.category === 'Terceira Idade' || g.tags.includes('mente') || g.tags.includes('zen'));
        else if (exploreAudience === 'Edu') result = result.filter(g => g.category === 'Educacional' || g.tags.includes('educacional'));
      }

      if (exploreGenre !== 'Todos') {
        result = result.filter(g => g.category === exploreGenre || g.subcategories.includes(exploreGenre) || g.tags.includes(exploreGenre.toLowerCase()));
      }

      if (exploreMoment !== 'Todos') {
        if (exploreMoment === '5 minutos') result = result.filter(g => g.category === 'Arcade' || g.tags.includes('casual'));
        else if (exploreMoment === 'Relaxar') result = result.filter(g => g.tags.includes('relaxante') || g.tags.includes('zen') || g.category === 'Bebês');
        else if (exploreMoment === 'Desafio') result = result.filter(g => g.category === 'Ação' || g.category === 'Corrida');
        else if (exploreMoment === 'Jogar junto') result = result.filter(g => g.category === 'Família' || g.tags.includes('familia'));
        else if (exploreMoment === 'Exercitar a mente') result = result.filter(g => g.category === 'Memória' || g.category === 'Puzzle' || g.tags.includes('mente'));
      }
    } else {
      // 1. Filtragem por Preferência de Conteúdo (Home)
      if (agePreference === 'bebes') {
        result = result.filter(g => 
          g.category === 'Bebês' || 
          g.tags.some(t => ['bebes', 'bebe', 'ludico', 'cores'].includes(t.toLowerCase())) || 
          g.slug === 'bubble-pop' || 
          g.slug === 'memory-match'
        );
      } else if (agePreference === 'educacional') { // Kids
        result = result.filter(g => 
          g.category === 'Educacional' || 
          g.category === 'Infantil' || 
          g.category === 'Memória' || 
          g.tags.some(t => ['kids', 'infantil', 'desenho', 'crianca', 'cores'].includes(t.toLowerCase())) || 
          g.slug === 'math-run' || 
          g.slug === 'memory-match'
        );
      } else if (agePreference === 'family') {
        result = result.filter(g => 
          g.category === 'Família' || 
          g.tags.some(t => ['familia', 'casual', 'coop', 'amigos'].includes(t.toLowerCase())) || 
          g.category === 'Corrida' || 
          g.slug === 'kruujio'
        );
      } else if (agePreference === 'terceira_idade') { // 60+
        result = result.filter(g => 
          g.category === 'Terceira Idade' || 
          g.category === 'Memória' || 
          g.category === 'Puzzle' || 
          g.tags.some(t => ['mente', 'zen', 'cerebro', 'raciocinio', 'tabuleiro', 'memoria'].includes(t.toLowerCase())) || 
          g.slug === 'sudoku-zen' || 
          g.slug === 'kruujdoku'
        );
      } else if (agePreference === 'edu') {
        result = result.filter(g => 
          g.category === 'Educacional' || 
          g.tags.some(t => ['educacional', 'educativo', 'aprendizado', 'matematica', 'logica', 'escola'].includes(t.toLowerCase())) || 
          g.slug === 'math-run' || 
          g.slug === 'kruujdoku'
        );
      }

      // 2. Filtragem por Categoria
      if (activeCategory !== 'Tudo') {
        result = result.filter(g => {
          const mappedCat = getMappedCategory(g.category);
          return mappedCat === activeCategory;
        });
      }
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
    const validImage = 
      (game.bannerUrl && (game.bannerUrl.startsWith('http') || game.bannerUrl.startsWith('/'))) 
        ? game.bannerUrl 
        : ((game.iconUrl && (game.iconUrl.startsWith('http') || game.iconUrl.startsWith('/'))) 
          ? game.iconUrl 
          : null);

    if (validImage) {
      return (
        <img 
          src={validImage} 
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

  // Helper para garantir URL física index.html e injetar parâmetro de idioma (i18n)
  
  // Helper para Mosaico Bento Poki: atribui tiles 2x2, 2x1 e 1x1
  const getTileClass = (slug: string): string => {
    if (slug === 'kruuj-overdrive' || slug === 'kruuj-orbit') return 'tile-2x2';
    if (slug === 'kruuj-match' || slug === 'kruuj-penalty' || slug === 'kruuj-defense') return 'tile-2x1';
    return 'tile-1x1';
  };

  const getGameUrl = (game: Game) => {
    let url = game.prefixUrl;
    if (!url) return '';
    if (!url.endsWith('.html')) {
      if (!url.endsWith('/')) {
        url += '/';
      }
      url += 'index.html';
    }
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}lang=${currentLang}`;
  };

  // Helper para verificar se o jogo possui código físico implementado localmente
  const isPhysicalGame = (slug: string) => {
    return true;
  };

  // --- Helpers e Dados do Layout KRUUJ Oficial ---
  const featuredGames = [
    {
      title: 'KRUUJ OVERDRIVE',
      subtitle: 'Acelere pelas ruas de Tóquio, Miami e Berlim em uma corrida arcade alucinante!',
      tag: 'NOVO Lançamento • CORRIDA RETRÔ',
      slug: 'kruuj-overdrive',
      bannerUrl: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&auto=format&fit=crop&q=60',
      category: 'Arcade / Corrida'
    },
    {
      title: 'KRUUJ ORBIT',
      subtitle: 'Salte entre órbitas planetárias com física cósmica e pegue o impulso certo!',
      tag: 'NOVO • ARCADE CÓSMICO',
      slug: 'kruuj-orbit',
      bannerUrl: '/banners/kruuj-orbit.jpg',
      category: 'Arcade / Gravidade'
    },
    {
      title: 'KRUUJ SOLITAIRE',
      subtitle: 'O clássico Paciência repaginado! Relaxe com cartas de visual moderno.',
      tag: 'EM ALTA • CARTAS',
      slug: 'kruuj-solitaire',
      bannerUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=800&auto=format&fit=crop&q=60',
      category: 'Paciência / Clássico'
    },
    {
      title: 'KRUUJ 3D PENALTY SHOOTOUT',
      subtitle: 'Sinta a tensão do futebol e cobre pênaltis com gráficos 3D incríveis!',
      tag: 'ESPORTES',
      slug: 'kruuj-penalty',
      bannerUrl: 'https://images.unsplash.com/photo-1518605368461-1e1252281146?w=800&auto=format&fit=crop&q=60',
      category: 'Esporte / Futebol'
    },
    {
      title: 'KRUUJ NEON DOMAIN',
      subtitle: 'Um jogo de estratégia abstrato: cerque e domine a malha cibernética!',
      tag: 'NOVO • ESTRATÉGIA',
      slug: 'kruuj-dominio',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
      category: 'Estratégia / Tabuleiro'
    },
    {
      title: 'KRUUJ BABY PAINT',
      subtitle: 'Ambiente lúdico e seguro para crianças desenharem e colorirem.',
      tag: 'INFANTIL • LÚDICO',
      slug: 'kruuj-paint',
      bannerUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60',
      category: 'Bebês / Arte'
    },
    {
      title: 'KRUUJ.IO ARENA',
      subtitle: 'Entre na grande arena cósmica! Colete energia, cresça e domine o topo do ranking!',
      tag: 'POPULAR • ARENA IO',
      slug: 'kruujio',
      bannerUrl: '/banners/kruujio.png',
      category: 'Ação / Arena'
    },
    {
      title: 'KRUUJ MATCH',
      subtitle: 'Alquimia estelar relaxante! Combine 3 cristais rúnicos e liberte super poderes!',
      tag: 'PUZZLE ZEN',
      slug: 'kruuj-match',
      bannerUrl: '/banners/kruuj-match.jpg',
      category: 'Puzzle / Match-3'
    },
    {
      title: 'KRUUJ GUARDIANS',
      subtitle: 'Tower defense tático estilo Bloons TD! Estoure balões cósmicos com Corujas Guardiãs!',
      tag: 'ESTRATÉGIA',
      slug: 'kruuj-defense',
      bannerUrl: '/banners/kruuj-defense.jpg',
      category: 'Estratégia / Defesa'
    },
    {
      title: 'KRUUJ WORD',
      subtitle: 'O enigma das corujas! Conecte letras cósmicas e descubra as palavras secretas!',
      tag: 'EDUCACIONAL',
      slug: 'kruuj-words',
      bannerUrl: '/banners/kruuj-words.jpg',
      category: 'Educacional / Palavras'
    },
    {
      title: 'KRUUJDOKU',
      subtitle: 'O puzzle oficial de raciocínio das corujinhas! 100 fases + Modo Infinito.',
      tag: 'Exclusivo KRUUJ',
      slug: 'kruujdoku',
      bannerUrl: '/banners/kruujdoku.jpg',
      category: 'Puzzle / Raciocínio'
    }
  ];

  const nextFeatured = () => setFeaturedIndex((prev) => (prev + 1) % featuredGames.length);
  const prevFeatured = () => setFeaturedIndex((prev) => (prev - 1 + featuredGames.length) % featuredGames.length);

  
  // Abre o Palco Poki em modo de PRÉ-VISUALIZAÇÃO (com o vídeo/banner e botão Play Now)
  const handleOpenPreview = (game: Game) => {
    setSelectedGame(game);
    setIsPlayingGame(false);
    setView('playing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (game: Game) => { handlePlayGame(game); };

  // 4 Prateleiras Oficiais — Atualizadas com os novos 5 jogos
  const shelfTrending = [
    games.find(g => g.slug === 'kruuj-overdrive') || defaultGamesCatalog[14],
    games.find(g => g.slug === 'kruujio') || defaultGamesCatalog[8],
    games.find(g => g.slug === 'kruuj-penalty') || defaultGamesCatalog[16],
    games.find(g => g.slug === 'kruujdoku') || defaultGamesCatalog[7],
    games.find(g => g.slug === 'kruuj-solitaire') || defaultGamesCatalog[15],
    games.find(g => g.slug === 'kruuj-orbit') || defaultGamesCatalog[9],
  ].filter(Boolean) as Game[];

  const shelfDiscoveries = [
    games.find(g => g.slug === 'kruuj-dominio') || defaultGamesCatalog[17],
    games.find(g => g.slug === 'kruuj-match') || defaultGamesCatalog[10],
    games.find(g => g.slug === 'kruuj-defense') || defaultGamesCatalog[11],
    games.find(g => g.slug === 'snake-retro') || defaultGamesCatalog[2],
    games.find(g => g.slug === 'sudoku-zen') || defaultGamesCatalog[4],
    games.find(g => g.slug === 'memory-match') || defaultGamesCatalog[6],
  ].filter(Boolean) as Game[];

  const shelfNewReleases = [
    games.find(g => g.slug === 'kruuj-overdrive') || defaultGamesCatalog[14],
    games.find(g => g.slug === 'kruuj-solitaire') || defaultGamesCatalog[15],
    games.find(g => g.slug === 'kruuj-penalty') || defaultGamesCatalog[16],
    games.find(g => g.slug === 'kruuj-dominio') || defaultGamesCatalog[17],
    games.find(g => g.slug === 'kruuj-paint') || defaultGamesCatalog[18],
    games.find(g => g.slug === 'kruuj-orbit') || defaultGamesCatalog[9],
  ].filter(Boolean) as Game[];

  const shelfMostPlayed = [
    games.find(g => g.slug === 'kruuj-penalty') || defaultGamesCatalog[16],
    games.find(g => g.slug === 'rocket-rise') || defaultGamesCatalog[0],
    games.find(g => g.slug === 'space-defense') || defaultGamesCatalog[1],
    games.find(g => g.slug === 'math-run') || defaultGamesCatalog[5],
    games.find(g => g.slug === 'bubble-pop') || defaultGamesCatalog[3],
    games.find(g => g.slug === 'kruuj-words') || defaultGamesCatalog[12],
  ].filter(Boolean) as Game[];

  return (
    <div className={`flex flex-col min-h-screen ${agePreference === 'educacional' ? 'theme-edu' : agePreference === 'terceira_idade' ? 'theme-senior' : ''}`}>
      
      {/* --- TOPBAR KRUUJ OFICIAL (DESKTOP & MOBILE) --- */}
      <header className="kruuj-topbar">
        {isMobileSearchOpen ? (
          <div className="kruuj-mobile-search-overlay">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input 
              type="text" 
              className="kruuj-mobile-search-input"
              placeholder="Buscar jogos, categorias..."
              autoFocus
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (view !== 'home' && view !== 'explore') {
                  setView('home');
                }
              }}
            />
            <button 
              className="kruuj-mobile-search-close"
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              title="Fechar busca"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="kruuj-topbar-inner">
            <div className="kruuj-topbar-left">
              <div 
                className="kruuj-logo-link"
                onClick={() => { setView('home'); setSelectedGame(null); setSearchQuery(''); setActiveCategory('Tudo'); }}
              >
                <img src="/kruuj-logo.svg" alt="KRUUJ" style={{ height: '26px', maxHeight: '26px', width: 'auto', objectFit: 'contain' }} />
              </div>
            </div>

            {/* Busca Desktop Centralizada */}
            <div className="kruuj-topbar-search">
              <Search className="w-4 h-4 kruuj-topbar-search-icon" />
              <input 
                type="text" 
                className="kruuj-topbar-search-input"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (view !== 'home' && view !== 'explore') {
                    setView('home');
                  }
                }}
              />
            </div>

            <div className="kruuj-topbar-actions">
              {/* Seletor Internacional de Idioma (i18n) */}
              <div className="kruuj-lang-selector" title="Alterar Idioma / Change Language">
                <button 
                  className={`kruuj-lang-btn ${currentLang === 'pt' ? 'active' : ''}`}
                  onClick={() => changeLanguage('pt')}
                >
                  PT
                </button>
                <button 
                  className={`kruuj-lang-btn ${currentLang === 'en' ? 'active' : ''}`}
                  onClick={() => changeLanguage('en')}
                >
                  EN
                </button>
                <button 
                  className={`kruuj-lang-btn ${currentLang === 'es' ? 'active' : ''}`}
                  onClick={() => changeLanguage('es')}
                >
                  ES
                </button>
              </div>

              {/* Botão Acesso Rápido KRUUJ Calmo (TEA) - Visível no Topbar */}
              <button 
                className={`kruuj-calmo-pill-btn ${teaMode ? 'active' : ''}`}
                onClick={() => setTeaMode(!teaMode)}
                title="Modo Calmo (Acessibilidade a estímulos sensoriais / TEA)"
              >
                <span className="text-xs">🍃</span>
                <span className="kruuj-calmo-pill-text">{t.calmMode}</span>
                <span className={`kruuj-calmo-pill-badge ${teaMode ? 'on' : 'off'}`}>{teaMode ? 'ON' : 'OFF'}</span>
              </button>

              {/* Botão de Busca Mobile (Posicionado à esquerda e adjacente ao avatar) */}
              <button 
                className="kruuj-mobile-search-btn"
                onClick={() => setIsMobileSearchOpen(true)}
                title="Pesquisar jogos"
              >
                <Search className="w-4 h-4" />
              </button>

              <button 
                className="kruuj-action-circle-btn"
                onClick={() => { setView('favorites'); setSelectedGame(null); }}
                title="Favoritos"
              >
                <Heart className={`w-4 h-4 ${userFavoritesList.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                {userFavoritesList.length > 0 && (
                  <span className="kruuj-badge-count">{userFavoritesList.length}</span>
                )}
              </button>

              <button 
                className="kruuj-action-circle-btn"
                onClick={() => { setView('profile'); setSelectedGame(null); }}
                title="Perfil & Comunidade"
              >
                <User className="w-4 h-4" />
              </button>

              <div 
                className="kruuj-avatar-trigger"
                onClick={() => { setView('profile'); setSelectedGame(null); }}
                title="Minha Conta"
              >
                <div className="kruuj-avatar-inner">
                  <img src="/kruuj-avatar.png" alt="Mascote" />
                </div>
              </div>
            </div>
          </div>
        )}
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



      {/* --- CONTEÚDO PRINCIPAL --- */}
      <main className="kruuj-main-stage">
        
        {/* MASTER TOP LEADERBOARD AD (Maior Visibilidade - CPM Máximo) */}
        {consentOptions.advertising && (
          <div className="ad-slot-leaderboard mt-0 mb-8"></div>
        )}

        {['home', 'explore', 'favorites', 'profile', 'details', 'privacy', 'terms', 'contact', 'report'].includes(view) ? (
          <div className="kruuj-layout-framework">
            
            {/* SIDEBAR COMPACTA DA ESQUERDA (DESKTOP) */}
            {!isMobileMode && (
            <aside className="kruuj-compact-sidebar">
              <button 
                className={`kruuj-sidebar-btn ${view === 'home' ? 'active' : ''}`}
                onClick={() => { setView('home'); setSelectedGame(null); }}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>{t.navHome}</span>
              </button>

              <button 
                className={`kruuj-sidebar-btn ${view === 'explore' ? 'active' : ''}`}
                onClick={() => { setView('explore'); setSelectedGame(null); }}
              >
                <Compass className="w-4 h-4" />
                <span>{t.navExplore}</span>
              </button>

              <button 
                className={`kruuj-sidebar-btn ${view === 'favorites' ? 'active' : ''}`}
                onClick={() => { setView('favorites'); setSelectedGame(null); }}
              >
                <Heart className={`w-4 h-4 ${userFavoritesList.length > 0 ? 'fill-current' : ''}`} />
                <span>{t.navFavorites}</span>
                {userFavoritesList.length > 0 && (
                  <span className="ml-auto text-[10px] font-black bg-pink-500/20 text-pink-400 px-2 py-0.5 rounded-full">
                    {userFavoritesList.length}
                  </span>
                )}
              </button>

              <button 
                className={`kruuj-sidebar-btn ${view === 'profile' ? 'active' : ''}`}
                onClick={() => { setView('profile'); setSelectedGame(null); }}
              >
                <User className="w-4 h-4" />
                <span>{t.navProfile}</span>
              </button>

              <div className="kruuj-sidebar-extra">
                {/* Widget Acessibilidade KRUUJ Calmo com Chave ON/OFF */}
                <div 
                  className={`kruuj-calmo-card ${teaMode ? 'active' : ''}`}
                  onClick={() => setTeaMode(!teaMode)}
                  title="Ativar/Desativar modo de acessibilidade sensorial e TEA"
                >
                  <div className="kruuj-calmo-header">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">🍃</span>
                      <span className="kruuj-calmo-label">KRUUJ Calmo</span>
                    </div>
                    <div className={`kruuj-calmo-switch ${teaMode ? 'on' : 'off'}`}>
                      <span className="kruuj-calmo-status-text">{teaMode ? 'ON' : 'OFF'}</span>
                      <span className="kruuj-calmo-switch-knob"></span>
                    </div>
                  </div>
                  <p className="kruuj-calmo-desc">
                    {teaMode ? '✓ Modo calmo ativado (TEA)' : 'Acessibilidade TEA (menos estímulos)'}
                  </p>
                </div>

                <button 
                  className="kruuj-sidebar-sublink"
                  onClick={() => setView('privacy')}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Privacidade LGPD</span>
                </button>

                <button 
                  className="kruuj-sidebar-sublink"
                  onClick={() => setView('terms')}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Termos</span>
                </button>
              </div>
            </aside>
            )}

                        {/* ÁREA DE CONTEÚDO PRINCIPAL KRUUJ */}
            <div className="kruuj-content-body">
              {/* VIEW: HOME */}
              {view === 'home' && (
                <>
                  {searchQuery ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white">
                          Resultados para "{searchQuery}"
                        </h2>
                        <button 
                          className="text-xs text-cyan-400 font-bold hover:underline"
                          onClick={() => setSearchQuery('')}
                        >
                          Limpar busca
                        </button>
                      </div>
                      <div className="kruuj-shelf-row">
                        {getFilteredGames().map(game => (
                          <div 
                            key={game.id} 
                            className="kruuj-game-card-clean"
                            onClick={() => handlePlayGame(game)}
                          >
                            <div className="kruuj-game-thumb">
                              {renderGameCover(game)}
                              <button
                                className="kruuj-game-like-btn"
                                onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isGameFavorited(game) ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
                              </button>
                            </div>
                            <div className="kruuj-game-title-clean">{game.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* 1. Banner Carrossel Destaque (KRUUJ recomenda) no Topo do Layout */}
                      <div 
                        className="kruuj-featured-banner"
                        style={{
                          backgroundImage: `linear-gradient(90deg, rgba(8, 14, 26, 0.96) 0%, rgba(8, 14, 26, 0.84) 48%, rgba(8, 14, 26, 0.3) 80%, rgba(8, 14, 26, 0.1) 100%), url('${featuredGames[featuredIndex]?.bannerUrl || '/banners/welcome.jpg'}')`,
                          backgroundPosition: 'right center',
                          backgroundSize: 'cover',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                        <button 
                          className="kruuj-featured-arrow-left"
                          onClick={prevFeatured}
                          title="Anterior"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex flex-col z-10 pl-6 pr-4">
                          <span className="kruuj-featured-badge">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> {featuredGames[featuredIndex].tag}
                          </span>
                          <h2 className="kruuj-featured-title">
                            {featuredGames[featuredIndex].title}
                          </h2>
                          <p className="kruuj-featured-desc">
                            {featuredGames[featuredIndex].subtitle}
                          </p>
                          <div>
                            <button 
                              className="kruuj-featured-play-btn"
                              onClick={() => {
                                const matched = games.find(g => g.slug === featuredGames[featuredIndex].slug) || defaultGamesCatalog.find(g => g.slug === featuredGames[featuredIndex].slug) || defaultGamesCatalog[0];
                                handlePlayGame(matched);
                              }}
                            >
                              <Play className="w-4 h-4 fill-current" /> {t.playNow}
                            </button>
                          </div>
                        </div>

                        <div className="hidden md:flex items-center gap-4 z-10 pr-4 shrink-0">
                          {/* Espaço reservado para visualização limpa do banner de fundo */}
                        </div>

                        <button 
                          className="kruuj-featured-arrow-right"
                          onClick={nextFeatured}
                          title="Próximo"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        <div className="kruuj-featured-dots">
                          {featuredGames.map((_, i) => (
                            <span 
                              key={i} 
                              className={`kruuj-dot ${featuredIndex === i ? 'active' : ''}`}
                              onClick={() => setFeaturedIndex(i)}
                            />
                          ))}
                        </div>
                      </div>

                      {/* 2. Seletor de 6 Categorias (Públicos) em Pílulas 3D */}
                      <div className="kruuj-categories-grid">
                        <div 
                          className={`kruuj-cat-pill kruuj-cat-baby ${agePreference === 'bebes' ? 'active' : ''}`}
                          onClick={() => setAgePreference(agePreference === 'bebes' ? 'geral' : 'bebes')}
                        >
                          <div className="kruuj-cat-icon">🐱</div>
                          <span className="kruuj-cat-title">Baby</span>
                          <span className="kruuj-cat-sub">0 a 3 anos</span>
                        </div>

                        <div 
                          className={`kruuj-cat-pill kruuj-cat-kids ${agePreference === 'educacional' ? 'active' : ''}`}
                          onClick={() => setAgePreference(agePreference === 'educacional' ? 'geral' : 'educacional')}
                        >
                          <div className="kruuj-cat-icon">👦</div>
                          <span className="kruuj-cat-title">Kids</span>
                          <span className="kruuj-cat-sub">4 a 12 anos</span>
                        </div>

                        <div 
                          className={`kruuj-cat-pill kruuj-cat-play ${agePreference === 'geral' ? 'active' : ''}`}
                          onClick={() => setAgePreference('geral')}
                        >
                          <div className="kruuj-cat-icon">🎮</div>
                          <span className="kruuj-cat-title">Play</span>
                          <span className="kruuj-cat-sub">Todas as idades</span>
                        </div>

                        <div 
                          className={`kruuj-cat-pill kruuj-cat-family ${agePreference === 'family' ? 'active' : ''}`}
                          onClick={() => setAgePreference(agePreference === 'family' ? 'geral' : 'family')}
                        >
                          <div className="kruuj-cat-icon">👨‍👩‍👧</div>
                          <span className="kruuj-cat-title">Family</span>
                          <span className="kruuj-cat-sub">Jogue junto</span>
                        </div>

                        <div 
                          className={`kruuj-cat-pill kruuj-cat-senior ${agePreference === 'terceira_idade' ? 'active' : ''}`}
                          onClick={() => setAgePreference(agePreference === 'terceira_idade' ? 'geral' : 'terceira_idade')}
                        >
                          <div className="kruuj-cat-icon">👵</div>
                          <span className="kruuj-cat-title">60+</span>
                          <span className="kruuj-cat-sub">Mente ativa</span>
                        </div>

                        <div 
                          className={`kruuj-cat-pill kruuj-cat-edu ${agePreference === 'edu' ? 'active' : ''}`}
                          onClick={() => setAgePreference(agePreference === 'edu' ? 'geral' : 'edu')}
                        >
                          <div className="kruuj-cat-icon">🎓</div>
                          <span className="kruuj-cat-title">Edu</span>
                          <span className="kruuj-cat-sub">Aprender jogando</span>
                        </div>
                      </div>

                      {/* Se houver uma categoria específica selecionada (Baby, Kids, Family, 60+, Edu), exibe a lista filtrada */}
                      {agePreference !== 'geral' ? (
                        <section className="kruuj-shelf-section" style={{ marginTop: '20px' }}>
                          <div className="kruuj-shelf-header" style={{ alignItems: 'center' }}>
                            <div>
                              <h3 className="kruuj-shelf-title" style={{ fontSize: '1.25rem' }}>
                                {agePreference === 'bebes' && '🐱 Jogos para Bebês (0 a 3 anos)'}
                                {agePreference === 'educacional' && '👦 Jogos Kids & Infantis (4 a 12 anos)'}
                                {agePreference === 'family' && '👨‍👩‍👧 Jogos em Família (Jogue Junto)'}
                                {agePreference === 'terceira_idade' && `👵 ${t.audSenior}`}
                                {agePreference === 'edu' && `🎓 ${t.audEdu}`}
                              </h3>
                              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                                {getFilteredGames().length} jogos selecionados para este público
                              </p>
                            </div>
                            <button
                              className="btn-secondary py-1.5 px-3 text-xs"
                              onClick={() => setAgePreference('geral')}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                            >
                              <span>Mostrar todos</span>
                              <span style={{ fontSize: '12px' }}>✕</span>
                            </button>
                          </div>

                          <div className="kruuj-poki-grid" style={{ marginTop: '16px' }}>
                            {getFilteredGames().map(game => (
                              <div 
                                key={game.id} 
                                className={`kruuj-poki-card ${getTileClass(game.slug)} ${isGameFavorited(game) ? 'is-favorited' : ''}`}
                                onClick={() => handlePlayGame(game)}
                                title={`Jogar ${game.title}`}
                              >
                                <div className="kruuj-poki-thumb">
                                  {renderGameCover(game)}
                                  <div className="kruuj-poki-overlay">
                                    <div className="kruuj-poki-play-icon">
                                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                                    </div>
                                  </div>
                                  <button
                                    className={`kruuj-poki-like-btn ${isGameFavorited(game) ? 'favorited' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                                    title={isGameFavorited(game) ? 'Remover dos favoritos' : 'Favoritar'}
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${isGameFavorited(game) ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                                  </button>
                                </div>
                                <div className="kruuj-poki-meta">
                                  <span className="kruuj-poki-title">{game.title}</span>
                                  <span className="kruuj-poki-cat">{game.category}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      ) : (
                        <div className="kruuj-poki-section" style={{ marginTop: '16px' }}>
                          <div className="kruuj-poki-grid">
                            {getFilteredGames().map((game) => (
                              <div 
                                key={game.id} 
                                className={`kruuj-poki-card ${getTileClass(game.slug)} ${isGameFavorited(game) ? 'is-favorited' : ''}`}
                                onClick={() => handlePlayGame(game)}
                                title={`Jogar ${game.title}`}
                              >
                                <div className="kruuj-poki-thumb">
                                  {renderGameCover(game)}
                                  <div className="kruuj-poki-overlay">
                                    <div className="kruuj-poki-play-icon">
                                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                                    </div>
                                  </div>
                                  <button
                                    className={`kruuj-poki-like-btn ${isGameFavorited(game) ? 'favorited' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                                    title={isGameFavorited(game) ? 'Remover dos favoritos' : 'Favoritar'}
                                  >
                                    <Heart className={`w-3.5 h-3.5 ${isGameFavorited(game) ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                                  </button>
                                </div>
                                <div className="kruuj-poki-meta">
                                  <span className="kruuj-poki-title">{game.title}</span>
                                  <span className="kruuj-poki-cat">{game.category}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* VIEW: EXPLORAR / CATEGORIAS */}
              {view === 'explore' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Compass className="w-6 h-6 text-cyan-400" /> Explorar Catálogo
                    </h2>
                    <span className="text-xs text-gray-400 font-semibold">
                      {getFilteredGames().length} jogos disponíveis
                    </span>
                  </div>

                  {/* Filtro: Público */}
                  <div className="kruuj-filter-group">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Público</span>
                    <div className="kruuj-filter-chips">
                      {['Todos', 'Baby', 'Kids', 'Play', 'Family', '60+', 'Edu'].map(aud => (
                        <button
                          key={aud}
                          className={`kruuj-chip ${exploreAudience === aud ? 'active' : ''}`}
                          onClick={() => setExploreAudience(aud)}
                        >
                          {aud === 'Baby' && '🐱 '}
                          {aud === 'Kids' && '👦 '}
                          {aud === 'Play' && '🎮 '}
                          {aud === 'Family' && '👨‍👩‍👧 '}
                          {aud === '60+' && '👵 '}
                          {aud === 'Edu' && '🎓 '}
                          {aud}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtro: Tipo de Jogo */}
                  <div className="kruuj-filter-group">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de jogo</span>
                    <div className="kruuj-filter-chips">
                      {['Todos', 'Ação', 'Corrida', 'Arcade', 'Puzzle', 'Memória', 'Educacional', 'Família'].map(genre => (
                        <button
                          key={genre}
                          className={`kruuj-chip ${exploreGenre === genre ? 'active' : ''}`}
                          onClick={() => setExploreGenre(genre)}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Filtro: Momento */}
                  <div className="kruuj-filter-group">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Momento</span>
                    <div className="kruuj-filter-chips">
                      {['Todos', '5 minutos', 'Relaxar', 'Desafio', 'Jogar junto', 'Exercitar a mente'].map(mom => (
                        <button
                          key={mom}
                          className={`kruuj-chip ${exploreMoment === mom ? 'active' : ''}`}
                          onClick={() => setExploreMoment(mom)}
                        >
                          {mom}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grid de Resultados */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="kruuj-shelf-row">
                      {getFilteredGames().map(game => (
                        <div 
                          key={game.id} 
                          className="kruuj-game-card-clean"
                          onClick={() => handlePlayGame(game)}
                        >
                          <div className="kruuj-game-thumb">
                            {renderGameCover(game)}
                            <button
                              className="kruuj-game-like-btn"
                              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isGameFavorited(game) ? 'fill-pink-500 text-pink-500' : 'text-white'}`} />
                            </button>
                          </div>
                          <div className="kruuj-game-title-clean">{game.title}</div>
                          <span className="text-[10px] text-gray-400 font-medium">{game.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: PERFIL & COMUNIDADE */}
              {view === 'profile' && (
                <div className="kruuj-profile-view-wrapper">
                  <div className="kruuj-profile-card-header">
                    <div className="flex items-center gap-3">
                      <div className="kruuj-profile-avatar-wrap">
                        <img 
                          src="/kruuj-avatar.png" 
                          alt="Avatar" 
                          className="kruuj-profile-avatar-img" 
                        />
                      </div>
                      <div>
                        <h2 className="kruuj-profile-username">{user ? user.username : 'Explorer_123'}</h2>
                        <div className="kruuj-profile-meta-row">
                          <span className="kruuj-profile-level-badge">
                            Nível 5
                          </span>
                          <span className="kruuj-profile-xp-text">• 1.250 pontos XP</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {user ? (
                        <button className="kruuj-profile-action-btn logout" onClick={handleLogout}>
                          <LogOut className="w-3.5 h-3.5" /> <span>Sair</span>
                        </button>
                      ) : (
                        <button className="kruuj-profile-action-btn login" onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}>
                          <LogIn className="w-3.5 h-3.5" /> <span>Entrar</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Barra de Progresso de Nível */}
                  <div className="kruuj-profile-progress-box">
                    <div className="flex justify-between kruuj-profile-progress-text">
                      <span className="text-gray-300">Progresso para o Nível 6</span>
                      <span className="text-cyan-400 font-bold">1.250 / 2.000 XP</span>
                    </div>
                    <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden border border-white/5">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full" style={{ width: '62%' }} />
                    </div>
                  </div>

                  {/* Abas Estilizadas Premium com Ícones e Contadores */}
                  <div className="kruuj-profile-tabs-bar">
                    <button
                      className={`kruuj-profile-tab-btn ${profileTab === 'conquistas' ? 'active' : ''}`}
                      onClick={() => setProfileTab('conquistas')}
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                      <span>Conquistas</span>
                      <span className="kruuj-tab-count-badge">6</span>
                    </button>

                    <button
                      className={`kruuj-profile-tab-btn ${profileTab === 'jogos' ? 'active' : ''}`}
                      onClick={() => setProfileTab('jogos')}
                    >
                      <Gamepad2 className="w-4 h-4 text-cyan-400" />
                      <span>Jogos Recentes</span>
                      {recentGames.length > 0 && (
                        <span className="kruuj-tab-count-badge">{recentGames.length}</span>
                      )}
                    </button>

                    <button
                      className={`kruuj-profile-tab-btn ${profileTab === 'favoritos' ? 'active' : ''}`}
                      onClick={() => setProfileTab('favoritos')}
                    >
                      <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
                      <span>{t.navFavorites}</span>
                      {userFavoritesList.length > 0 && (
                        <span className="kruuj-tab-count-badge">{userFavoritesList.length}</span>
                      )}
                    </button>

                    <button
                      className={`kruuj-profile-tab-btn ${profileTab === 'config' ? 'active' : ''}`}
                      onClick={() => setProfileTab('config')}
                    >
                      <Settings className="w-4 h-4 text-purple-400" />
                      <span>Configurações</span>
                    </button>
                  </div>

                  {profileTab === 'conquistas' && (
                    <div className="kruuj-achievements-grid">
                      <div className="kruuj-achievement-card">
                        <div className="kruuj-achievement-icon">🎮</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Primeira Jogada</h4>
                          <p className="text-xs text-gray-400">Iniciou sua primeira partida no portal</p>
                          <span className="text-[10px] text-amber-400 font-extrabold mt-1 block">+50 pts • Desbloqueado</span>
                        </div>
                      </div>
                      <div className="kruuj-achievement-card">
                        <div className="kruuj-achievement-icon">🧩</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Mestre dos Puzzles</h4>
                          <p className="text-xs text-gray-400">Jogou e completou 3 quebra-cabeças</p>
                          <span className="text-[10px] text-amber-400 font-extrabold mt-1 block">+150 pts • Desbloqueado</span>
                        </div>
                      </div>
                      <div className="kruuj-achievement-card">
                        <div className="kruuj-achievement-icon">🧭</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Explorador da Galáxia</h4>
                          <p className="text-xs text-gray-400">Explorou mais de 5 categorias diferentes</p>
                          <span className="text-[10px] text-amber-400 font-extrabold mt-1 block">+100 pts • Desbloqueado</span>
                        </div>
                      </div>
                      <div className="kruuj-achievement-card">
                        <div className="kruuj-achievement-icon">👨‍👩‍👧</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Jogador Família</h4>
                          <p className="text-xs text-gray-400">Desafiou amigos ou familiares em um jogo</p>
                          <span className="text-[10px] text-amber-400 font-extrabold mt-1 block">+200 pts • Desbloqueado</span>
                        </div>
                      </div>
                      <div className="kruuj-achievement-card">
                        <div className="kruuj-achievement-icon">⚡</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Reflexos Rápidos</h4>
                          <p className="text-xs text-gray-400">Alcançou pontuação recorde no Arcade</p>
                          <span className="text-[10px] text-amber-400 font-extrabold mt-1 block">+120 pts • Desbloqueado</span>
                        </div>
                      </div>
                      <div className="kruuj-achievement-card">
                        <div className="kruuj-achievement-icon">🦉</div>
                        <div>
                          <h4 className="text-sm font-bold text-white">Amigo da Coruja</h4>
                          <p className="text-xs text-gray-400">Acesse o KRUUJ 7 dias consecutivos</p>
                          <span className="text-[10px] text-purple-400 font-extrabold mt-1 block">+300 pts • 4 / 7 dias</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {profileTab === 'jogos' && (
                    <div className="kruuj-recent-games-list">
                      {recentGames.length === 0 ? (
                        <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                          <Gamepad2 className="w-10 h-10 text-gray-600 mx-auto" />
                          <p className="text-gray-400 text-sm font-bold">Nenhum jogo no histórico ainda.</p>
                          <p className="text-xs text-gray-500">Jogue qualquer partida no portal para registrar seu histórico!</p>
                        </div>
                      ) : (
                        recentGames.map((hist, i) => {
                          const g = games.find(item => item.id === hist.id || item.slug === hist.id || (hist as any).slug === item.slug);
                          if (!g) return null;
                          return (
                            <div key={i} className="kruuj-recent-game-card">
                              <div className="kruuj-recent-game-left">
                                <div className="kruuj-recent-thumb-wrap">
                                  {g.bannerUrl ? (
                                    <img src={g.bannerUrl} alt={g.title} className="kruuj-recent-thumb-img" />
                                  ) : (
                                    <Gamepad2 className="w-5 h-5 text-cyan-400" />
                                  )}
                                </div>
                                <div className="kruuj-recent-info">
                                  <h4 className="kruuj-recent-title">{g.title}</h4>
                                  <div className="kruuj-recent-meta">
                                    <span className="kruuj-recent-tag">{g.category}</span>
                                    {hist.timestamp && (
                                      <span className="kruuj-recent-score">🕒 {formatRelativeTime(hist.timestamp)}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <button className="kruuj-recent-btn" onClick={() => handlePlayGame(g)}>
                                <Play className="w-3.5 h-3.5 fill-current" />
                                <span>Jogar</span>
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {profileTab === 'favoritos' && (
                    <div className="kruuj-shelf-row">
                      {userFavoritesList.length === 0 ? (
                        <p className="text-gray-400 text-sm p-4 col-span-full">Nenhum jogo favoritado ainda.</p>
                      ) : (
                        userFavoritesList.map(g => (
                          <div key={g.id} className="kruuj-game-card-clean" onClick={() => handleOpenDetails(g)}>
                            <div className="kruuj-game-thumb">
                              {renderGameCover(g)}
                            </div>
                            <div className="kruuj-game-title-clean">{g.title}</div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {profileTab === 'config' && (
                    <div className="bg-[#11172a] p-6 rounded-2xl border border-white/5 space-y-4 max-w-lg">
                      <h3 className="text-base font-bold text-white">Acessibilidade e Preferências</h3>
                      <div 
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={() => setTeaMode(!teaMode)}
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">🍃</span>
                            <span className="text-sm font-bold text-white block">KRUUJ Calmo (Modo TEA)</span>
                          </div>
                          <span className="text-xs text-gray-400 mt-0.5 block">Reduz animações, saturação e sons intensos</span>
                        </div>
                        <div className={`kruuj-calmo-switch ${teaMode ? 'on' : 'off'}`}>
                          <span className="kruuj-calmo-status-text">{teaMode ? 'ON' : 'OFF'}</span>
                          <span className="kruuj-calmo-switch-knob"></span>
                        </div>
                      </div>
                      <button className="btn-secondary w-full justify-center text-xs" onClick={() => setShowConsentBanner(true)}>
                        Gerenciar Cookies e Privacidade
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW: FAVORITOS */}
              {view === 'favorites' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <Heart className="w-6 h-6 text-pink-500 fill-pink-500" /> Meus Favoritos ({userFavoritesList.length})
                    </h2>
                    <button className="btn-secondary py-1.5 px-3 text-xs" onClick={() => setView('home')}>
                      Voltar ao Início
                    </button>
                  </div>
                  {userFavoritesList.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                      <Heart className="w-12 h-12 text-gray-600 mx-auto" />
                      <p className="text-gray-300 font-bold">Você ainda não favoritou nenhum jogo.</p>
                      <p className="text-xs text-gray-400">Clique no coração de qualquer jogo para adicioná-lo aos seus favoritos!</p>
                      <button className="btn-primary py-2 px-6 text-xs mx-auto" onClick={() => setView('home')}>
                        Explorar Jogos
                      </button>
                    </div>
                  ) : (
                    <div className="kruuj-shelf-row">
                      {userFavoritesList.map(g => (
                        <div key={g.id} className="kruuj-game-card-clean" onClick={() => handleOpenDetails(g)}>
                          <div className="kruuj-game-thumb">
                            {renderGameCover(g)}
                            <button
                              className="kruuj-game-like-btn"
                              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(g.id); }}
                            >
                              <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                            </button>
                          </div>
                          <div className="kruuj-game-title-clean">{g.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* VIEW: POLÍTICA DE PRIVACIDADE LGPD */}
              {view === 'privacy' && (
                <div className="card space-y-4 max-w-4xl text-left">
                  <button className="btn-secondary py-1.5 px-3 text-xs mb-2" onClick={() => setView('home')}>
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Início
                  </button>
                  <h2 className="text-2xl font-extrabold text-cyan-400 flex items-center gap-2">
                    <Shield className="w-6 h-6" /> Política de Privacidade & Proteção de Dados
                  </h2>
                  <p className="text-xs text-gray-300">
                    O KRUUJ está em conformidade total com a Lei Geral de Proteção de Dados (LGPD) e o Estatuto da Criança e do Adolescente (ECA).
                  </p>
                  <p className="text-xs text-gray-400">
                    Não coletamos dados biométricos, endereço, documentos pessoais ou números de telefone de jogadores.
                  </p>
                </div>
              )}

              {/* VIEW: TERMOS DE USO */}
              {view === 'terms' && (
                <div className="card space-y-4 max-w-4xl text-left">
                  <button className="btn-secondary py-1.5 px-3 text-xs mb-2" onClick={() => setView('home')}>
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Início
                  </button>
                  <h2 className="text-2xl font-extrabold text-cyan-400 flex items-center gap-2">
                    <FileText className="w-6 h-6" /> Termos de Uso do KRUUJ
                  </h2>
                  <p className="text-xs text-gray-300">
                    O uso do portal KRUUJ implica na aceitação destes termos. Todos os jogos disponibilizados são licenciados ou de propriedade exclusiva.
                  </p>
                </div>
              )}

              {/* VIEW: FALE CONOSCO */}
              {view === 'contact' && (
                <div className="card space-y-4 max-w-xl text-left">
                  <button className="btn-secondary py-1.5 px-3 text-xs mb-2" onClick={() => setView('home')}>
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Início
                  </button>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" /> Fale Conosco
                  </h2>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Mensagem enviada com sucesso!'); setView('home'); }} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Seu Nome / Apelido</label>
                      <input type="text" className="input-field w-full" required />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Mensagem</label>
                      <textarea className="input-field w-full h-24" required></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center">Enviar Mensagem</button>
                  </form>
                </div>
              )}

              {/* VIEW: DENÚNCIA */}
              {view === 'report' && (
                <div className="card space-y-4 max-w-xl text-left">
                  <button className="btn-secondary py-1.5 px-3 text-xs mb-2" onClick={() => setView('home')}>
                    <ArrowLeft className="w-4 h-4" /> Voltar ao Início
                  </button>
                  <h2 className="text-xl font-bold text-pink-400 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> Canal de Denúncia & Moderação
                  </h2>
                  <form onSubmit={(e) => { e.preventDefault(); alert('Denúncia registrada com sucesso.'); setView('home'); }} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Motivo da Denúncia</label>
                      <select className="input-field w-full">
                        <option>Conteúdo Impróprio para a faixa etária</option>
                        <option>Propriedade Intelectual / Copyright</option>
                        <option>Erro técnico ou travamento grave</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Detalhes</label>
                      <textarea className="input-field w-full h-24" required></textarea>
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center bg-pink-600 hover:bg-pink-700">Enviar Denúncia</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIEWS DE JOGO EM FOCO OU ÁREA ADMINISTRATIVA INTEIRA */
          <>
            {view === 'playing' && selectedGame && (
              <div className="poki-stage-container">
                {/* 1. LINHA SUPERIOR DO PALCO (ESQUERDA - CENTRO - DIREITA) */}
                <div className="poki-stage-top-row">
                  {/* LATERAL ESQUERDA: Pílula KRUUJ Logo + Busca + Início + Skyscraper */}
                  <div className="poki-stage-left-rail">
                    <div className="poki-stage-brand-pill" style={{ overflow: 'hidden', maxWidth: '100%' }}>
                      <div className="poki-stage-logo" onClick={() => { setView('home'); setSelectedGame(null); }} title="Ir para o Início" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <img 
                          src="/kruuj-avatar.png" 
                          alt="KRUUJ" 
                          style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', maxWidth: '32px', maxHeight: '32px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} 
                        />
                        <span className="font-black tracking-tight text-slate-900 text-base">KRUUJ</span>
                      </div>
                      <div className="poki-stage-pill-actions">
                        <button className="poki-stage-pill-btn" onClick={() => setIsMobileSearchOpen(true)} title="Buscar">
                          <Search className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="poki-stage-pill-btn" onClick={() => { setView('home'); setSelectedGame(null); }} title="Início">
                          <ArrowLeft className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="poki-stage-skyscraper hidden xl:flex">
                      <span>KRUUJ STUDIO</span>
                    </div>
                  </div>

                  {/* CENTRO: O PALCO DO JOGO + BARRA BRANCA POKI */}
                  <div className="poki-stage-center">
                    <div className="poki-stage-player-wrapper" id="game-fullscreen-target">
                      {/* Loader oficial rodando nativamente dentro do iframe do próprio jogo */}

                      {(isMobileMode || isScreenLocked) && (
                        <AdaptivePokiCluster
                          isScreenLocked={isScreenLocked}
                        isBabyMode={agePreference === 'bebes' || selectedGame.category === 'Bebês'}
                        onExit={triggerExitGame}
                        onLock={() => {
                          setIsScreenLocked(true);
                          try {
                            if (navigator.wakeLock && navigator.wakeLock.request) {
                              navigator.wakeLock.request('screen').then(lock => {
                                wakeLockRef.current = lock;
                              }).catch(() => {});
                            }
                          } catch (e) {}
                        }}
                        onUnlockRequest={() => {
                          const isMult = Math.random() > 0.4;
                          const n1 = Math.floor(Math.random() * 5) + 2;
                          const n2 = Math.floor(Math.random() * 5) + 2;
                          setParentMath({ n1, n2, op: isMult ? 'x' : '+' });
                          setParentInput('');
                          setShowParentGate(true);
                        }}
                      />
                      )}

                      {/* AVISO ANIMADO DE ROTAÇÃO RECOMENDADA (ESTILO POKI.COM) */}
                      {isMobileMode && !dismissRotateNotice && selectedGame.orientation === 'landscape' && window.innerHeight > window.innerWidth && (
                        <div className="kruuj-rotate-hint-banner">
                          <span>📱↷</span>
                          <span>
                            {currentLang === 'en' 
                              ? 'Rotate phone to landscape for best experience' 
                              : currentLang === 'es' 
                              ? 'Gira tu celular para una mejor experiencia' 
                              : 'Gire o celular na horizontal para a melhor experiência'}
                          </span>
                          <button onClick={() => setDismissRotateNotice(true)} className="kruuj-rotate-hint-close">✕</button>
                        </div>
                      )}

                      /* JOGO EM EXECUÇÃO REAL AO VIVO (PADRÃO POKI.COM COM KRUUJPORTALLOADER DE 3S) */
                      <div className="poki-stage-iframe-container" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                        {isPhysicalGame(selectedGame.slug) ? (
                          <iframe
                            ref={gameIframeRef}
                            onLoad={() => {
                              try {
                                gameIframeRef.current?.contentWindow?.postMessage({ type: 'KRUUJ_RESUME_AUDIO' }, '*');
                                gameIframeRef.current?.focus();
                              } catch(e) {}
                            }}
                            key={selectedGame.id}
                            src={getGameUrl(selectedGame)}
                            sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
                            allow="fullscreen; autoplay; gamepad; accelerometer; gyroscope; screen-wake-lock; orientation-lock"
                            allowFullScreen
                            scrolling="no"
                            title={selectedGame.title}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              margin: 0,
                              padding: 0
                            }}
                          ></iframe>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 p-6 text-center space-y-4">
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest bg-yellow-950/80 px-3 py-1 rounded-full border border-yellow-500/20">
                              🛡️ CIRCUITO EM AUDITORIA
                            </span>
                            <h3 className="text-lg font-bold text-white">{selectedGame.title}</h3>
                            <button 
                              className="btn-secondary py-1.5 px-4 text-xs font-bold"
                              onClick={() => { setView('home'); setSelectedGame(null); setIsPlayingGame(false); }}
                            >
                              Voltar ao Catálogo
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BARRA BRANCA POKI DE AÇÕES (IDÊNTICA À tela-poki-jogo.png) */}
                    <div className="poki-stage-action-bar">
                      <div className="poki-bar-game-info">
                        <div className="poki-bar-thumb">
                          {renderGameCover(selectedGame)}
                        </div>
                        <div className="poki-bar-text">
                          <h2 className="poki-bar-title">{selectedGame.title}</h2>
                          <span className="poki-bar-author">by {selectedGame.author || 'KRUUJ Studio'}</span>
                        </div>
                      </div>

                      <div className="poki-bar-actions">
                        {/* Curtir / Like 👍 */}
                        <button 
                          className={`poki-bar-action-item ${isGameFavorited(selectedGame) ? 'liked' : ''}`}
                          onClick={() => handleToggleFavorite(selectedGame.id)}
                          title="Gostei"
                        >
                          <ThumbsUp className={`w-4 h-4 ${isGameFavorited(selectedGame) ? 'fill-blue-600 text-blue-600' : 'text-gray-500'}`} />
                          <span className="poki-bar-action-count">{likesCount[selectedGame.id] || 124}</span>
                        </button>

                        {/* Não Gostei 👎 */}
                        <button 
                          className="poki-bar-action-item"
                          onClick={() => alert("Obrigado pelo feedback!")}
                          title="Não gostei"
                        >
                          <ThumbsDown className="w-4 h-4 text-gray-400" />
                          <span className="poki-bar-action-count">3</span>
                        </button>

                        {/* Compartilhar */}
                        <button 
                          className="poki-bar-action-item"
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({ title: selectedGame.title, url: window.location.href }).catch(() => {});
                            } else {
                              navigator.clipboard?.writeText(window.location.href);
                              alert("Link copiado com sucesso!");
                            }
                          }}
                          title="Compartilhar"
                        >
                          <Share2 className="w-4 h-4 text-gray-500" />
                        </button>

                        {/* Denúncia / Report ⚑ */}
                        <button 
                          className="poki-bar-action-item"
                          onClick={() => setView('report')}
                          title="Reportar"
                        >
                          <Flag className="w-4 h-4 text-gray-400" />
                        </button>

                        <button 
                            className="poki-bar-action-item"
                            onClick={handleManualFullscreen}
                            title="Tela Cheia"
                          >
                            <Maximize className="w-4 h-4 text-gray-600" />
                          </button>
                      </div>
                    </div>
                  </div>

                  {/* LATERAL DIREITA: MOSAICO POKI DE JOGOS RECOMENDADOS (2 COLUNAS) */}
                  <div className="poki-stage-right-mosaic hidden lg:grid">
                    {getRelatedGames(selectedGame).slice(0, 8).map((rel, i) => (
                      <div 
                        key={rel.id} 
                        className={`kruuj-poki-card ${i === 1 ? 'tile-2x2' : 'tile-1x1'} ${isGameFavorited(rel) ? 'is-favorited' : ''}`}
                        onClick={() => handlePlayGame(rel)}
                        title={`Ver ${rel.title}`}
                      >
                        <div className="kruuj-poki-thumb">
                          {renderGameCover(rel)}
                          <div className="kruuj-poki-overlay">
                            <div className="kruuj-poki-play-icon">
                              <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className="kruuj-poki-meta">
                          <span className="kruuj-poki-title">{rel.title}</span>
                          <span className="kruuj-poki-cat">{rel.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MOSAICO INFERIOR CONTÍNUO DE TODOS OS JOGOS (ABAIXO DO PALCO) */}
                <div className="poki-stage-bottom-mosaic">
                  <div className="kruuj-poki-section">
                    <div className="kruuj-poki-grid">
                      {getFilteredGames().map((game) => (
                        <div 
                          key={game.id} 
                          className={`kruuj-poki-card ${getTileClass(game.slug)} ${isGameFavorited(game) ? 'is-favorited' : ''}`}
                          onClick={() => handlePlayGame(game)}
                          title={`Ver ${game.title}`}
                        >
                          <div className="kruuj-poki-thumb">
                            {renderGameCover(game)}
                            <div className="kruuj-poki-overlay">
                              <div className="kruuj-poki-play-icon">
                                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                              </div>
                            </div>
                            <button
                              className={`kruuj-poki-like-btn ${isGameFavorited(game) ? 'favorited' : ''}`}
                              onClick={(e) => { e.stopPropagation(); handleToggleFavorite(game.id); }}
                              title="Favoritar"
                            >
                              <Heart className={`w-3.5 h-3.5 ${isGameFavorited(game) ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                            </button>
                          </div>
                          <div className="kruuj-poki-meta">
                            <span className="kruuj-poki-title">{game.title}</span>
                            <span className="kruuj-poki-cat">{game.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'admin' && user && user.role !== 'user' && (
              <div className="space-y-6 text-left">
                {/* Header com Abas Estilizadas em Pílula Premium */}
                <div className="kruuj-admin-header-card">
                  <div className="flex items-center gap-3">
                    <button 
                      className="btn-secondary py-1.5 px-3 text-xs"
                      onClick={() => setView('home')}
                      title="Sair do Cockpit"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" /> <span>Voltar ao Portal</span>
                    </button>
                    
                    <h2 className="text-xs font-black text-white tracking-widest uppercase flex items-center gap-2 font-mono">
                      <Settings className="w-4 h-4 text-cyan-400 animate-spin-slow shrink-0" />
                      <span>Cockpit Admin</span>
                    </h2>
                  </div>
                  
                  <div className="kruuj-admin-tabs-bar">
                    <button 
                      className={`kruuj-admin-tab-btn ${adminTab === 'contracts' ? 'active' : ''}`}
                      onClick={() => { setAdminTab('contracts'); setAdminViewMode('list'); }}
                    >
                      <FileSignature className="w-3.5 h-3.5" />
                      <span>Contratos & Jogos</span>
                    </button>
                    <button 
                      className={`kruuj-admin-tab-btn ${adminTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => { setAdminTab('dashboard'); setAdminViewMode('list'); }}
                    >
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span>Analytics & IA</span>
                    </button>
                    <button 
                      className={`kruuj-admin-tab-btn ${adminTab === 'users' ? 'active' : ''}`}
                      onClick={() => { setAdminTab('users'); setAdminViewMode('list'); }}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Usuários</span>
                      {adminUsers.length > 0 && (
                        <span className="text-[10px] font-black bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded-full">
                          {adminUsers.length}
                        </span>
                      )}
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

                {/* TAB 3: GESTÃO DE USUÁRIOS E CONTROLE DE ACESSO (RBAC) */}
                {adminTab === 'users' && (
                  <div className="space-y-6">
                    <div className="glass-panel p-6 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <h3 className="text-md font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Gestão de Usuários & Controle de Acesso (RBAC)
                          </h3>
                          <p className="text-xs text-gray-400">
                            Supervisione contas registradas, atribua permissões administrativas e audite perfis conforme a LGPD.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-3 py-1.5 rounded-full">
                            {adminUsers.length} Usuários Cadastrados
                          </span>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table>
                          <thead>
                            <tr>
                              <th>Usuário</th>
                              <th>Papel Atual</th>
                              <th>Status</th>
                              <th>Preferência</th>
                              <th>Criado em</th>
                              <th className="text-right">Alterar Papel</th>
                            </tr>
                          </thead>
                          <tbody>
                            {adminUsers.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-400 text-xs">
                                  Nenhum usuário cadastrado no momento.
                                </td>
                              </tr>
                            ) : (
                              adminUsers.map((u) => (
                                <tr key={u.id}>
                                  <td>
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0">
                                        {u.username.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="font-bold text-white text-xs">{u.username}</div>
                                        <div className="text-[9px] text-gray-500 font-mono">ID: {u.id.slice(0, 8)}...</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    {u.role === 'super_admin' && (
                                      <span className="badge badge-purple flex items-center gap-1 w-fit">
                                        👑 Super Admin
                                      </span>
                                    )}
                                    {u.role === 'editor' && (
                                      <span className="badge badge-cyan flex items-center gap-1 w-fit">
                                        ✍️ Editor
                                      </span>
                                    )}
                                    {u.role === 'user' && (
                                      <span className="badge bg-white/10 text-gray-300 border border-white/10 flex items-center gap-1 w-fit">
                                        🎮 Jogador
                                      </span>
                                    )}
                                    {u.role !== 'super_admin' && u.role !== 'editor' && u.role !== 'user' && (
                                      <span className="badge bg-purple-950/60 text-purple-300 border border-purple-500/30 flex items-center gap-1 w-fit capitalize">
                                        🛡️ {u.role}
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <span className="badge badge-green">✓ {u.status || 'Ativo'}</span>
                                  </td>
                                  <td>
                                    <span className="text-xs text-gray-300 capitalize">{u.agePreference || 'Geral'}</span>
                                  </td>
                                  <td className="text-xs text-gray-400 font-mono">
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('pt-BR') : 'Hoje'}
                                  </td>
                                  <td className="text-right">
                                    <select
                                      value={u.role}
                                      onChange={(e) => handleAdminUpdateRole(u.id, e.target.value)}
                                      className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-cyan-400 font-bold focus:border-cyan-500 outline-none cursor-pointer"
                                      disabled={u.username === user.username && u.role === 'super_admin'}
                                    >
                                      <option value="user">Jogador (user)</option>
                                      <option value="editor">Editor (editor)</option>
                                      <option value="super_admin">Super Admin (super_admin)</option>
                                    </select>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>


      {/* --- NOVO FOOTER KRUUJ COM LOGO OFICIAL E MASCOTE ESPIANDO --- */}
      <footer className="kruuj-footer">
        <div className="kruuj-footer-content">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <img src="/kruuj-logo.svg" alt="KRUUJ" style={{ height: '22px', maxHeight: '22px', width: 'auto', objectFit: 'contain' }} />
              <span className="text-xs text-gray-400 font-semibold">• Mais que jogos, um universo de experiências.</span>
            </div>
            <div className="kruuj-footer-links">
              <button className="kruuj-footer-link-btn privacy" onClick={() => setView('privacy')}>
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>Privacidade (LGPD)</span>
              </button>
              <button className="kruuj-footer-link-btn terms" onClick={() => setView('terms')}>
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Termos de Uso</span>
              </button>
              <button className="kruuj-footer-link-btn contact" onClick={() => setView('contact')}>
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Fale Conosco</span>
              </button>
              <button className="kruuj-footer-link-btn report" onClick={() => setView('report')}>
                <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
                <span>Denunciar Conteúdo</span>
              </button>
              {user && user.role !== 'user' && (
                <button className="kruuj-footer-link-btn admin" onClick={() => setView('admin')}>
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Painel Admin</span>
                </button>
              )}
            </div>
          </div>

          <img src="/kruuj-mascote.png" alt="Mascote KRUUJ" className="kruuj-footer-mascot-peeking" />
        </div>
      </footer>

      {/* --- MOBILE BOTTOM NAVIGATION BAR (Oculta durante gameplay para desobstruir os controles do jogo) --- */}
      {!selectedGame && (
        <nav className="kruuj-bottom-bar">
          <button 
            className={`kruuj-bottom-btn ${view === 'home' ? 'active' : ''}`}
            onClick={() => { setView('home'); setSelectedGame(null); }}
          >
            <Gamepad2 className="w-5 h-5" />
            <span>{t.navHome}</span>
          </button>

          <button 
            className={`kruuj-bottom-btn ${view === 'explore' ? 'active' : ''}`}
            onClick={() => { setView('explore'); setSelectedGame(null); }}
          >
            <Compass className="w-5 h-5" />
            <span>{t.navExplore}</span>
          </button>

          <button 
            className={`kruuj-bottom-btn ${view === 'favorites' ? 'active' : ''}`}
            onClick={() => { setView('favorites'); setSelectedGame(null); }}
          >
            <Heart className={`w-5 h-5 ${userFavoritesList.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
            <span>{t.navFavorites}</span>
          </button>

          <button 
            className={`kruuj-bottom-btn ${view === 'profile' ? 'active' : ''}`}
            onClick={() => { setView('profile'); setSelectedGame(null); }}
          >
            <User className="w-5 h-5" />
            <span>{t.navProfile}</span>
          </button>
        </nav>
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
        <div className="modal-backdrop parent-gate-backdrop" style={{ zIndex: 999999999, position: 'fixed', inset: 0 }}>
          <div className="glass-panel modal-content parent-gate-card text-center space-y-6" style={{ zIndex: 1000000000, position: 'relative' }}>
            <div className="w-14 h-14 bg-pink-950/40 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto text-pink-500 animate-bounce">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-pink-500">🔐 Área Exclusiva para Adultos</h3>
            <p className="text-xs text-gray-400">
              Para desbloquear os controles e continuar jogando normalmente, resolva o desafio matemático:
            </p>
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
                    if (parseInt(val, 10) === expected) {
                      // Ao acertar, desbloqueia e CONTINUA NO JOGO!
                      setTimeout(() => {
                        setIsScreenLocked(false);
                        setShowParentGate(false);
                        setParentInput('');
                      }, 150);
                    }
                  }
                }}
                autoFocus
                required
                placeholder="?"
              />
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  type="submit" 
                  className="btn-primary flex-1 justify-center py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold shadow-lg shadow-teal-500/20"
                >
                  🔓 Desbloquear Jogo
                </button>
                <button 
                  type="button" 
                  className="btn-secondary flex-1 justify-center py-2.5 rounded-xl font-bold border-pink-500/30 hover:border-pink-500 text-pink-300"
                  onClick={() => handleUnlockAndExit()}
                >
                  🚪 Desbloquear e Sair
                </button>
              </div>

              <button
                type="button"
                className="text-xs text-gray-400 hover:text-white underline pt-1 block mx-auto"
                onClick={() => { setShowParentGate(false); setParentInput(''); }}
              >
                Cancelar (Manter Bloqueado)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
