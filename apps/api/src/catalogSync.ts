import { prisma } from './prisma';

export const REAL_14_GAMES = [
  {
    title: 'Rocket Rise',
    slug: 'rocket-rise',
    description: 'Acelere nessa aventura intergaláctica cheia de adrenalina! Pilote sua nave espacial, desvie de chuvas de meteoros e colete energia estelar para subir o mais alto possível.',
    category: 'Arcade',
    subcategories: 'Corrida,Espaço,Ação',
    tags: 'corrida,espaco,arcade,foguete,velocidade',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'rocket',
    prefixUrl: '/games/rocket-rise/',
    version: '1.2.0',
    mouse: false,
    teclado: true,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-001'
  },
  {
    title: 'Cyber Space Defense',
    slug: 'space-defense',
    description: 'Jogo de tiro no espaço arcade gratuito. Defenda o núcleo central contra invasores cibernéticos do espaço profundo atirando sem parar! Jogue agora no PC ou mobile.',
    category: 'Ação',
    subcategories: 'Espaço,Tiro,Sobrevivência',
    tags: 'tiro,espaco,defense,arcade,invasores',
    ageRating: '10+',
    bannerUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'rocket',
    prefixUrl: '/games/space-defense/',
    version: '1.1.0',
    mouse: true,
    teclado: true,
    toque: true,
    gamepad: true,
    orientation: 'landscape',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'PixelGlitch Labs',
    licenseName: 'Cessão Total de Direitos',
    contractNumber: 'CON-2026-002'
  },
  {
    title: 'Snake Retro Arcade',
    slug: 'snake-retro',
    description: 'Jogo da cobrinha neon online grátis para celular e PC! O clássico retro futurista arcade perfeito para passar o tempo. Pegue os blocos de dados sem bater nas paredes.',
    category: 'Arcade',
    subcategories: 'Clássico,Casual,Retrô',
    tags: 'cobrinha,retro,pixel,neon,casual',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'snake',
    prefixUrl: '/games/snake-retro/',
    version: '1.0.0',
    mouse: false,
    teclado: true,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'RetroByte Studios',
    licenseName: 'Licença Comercial Ampla',
    contractNumber: 'CON-2026-003'
  },
  {
    title: 'Bubble Boom',
    slug: 'bubble-pop',
    description: 'Estoure bolhas mágicas coloridas em um ambiente vibrante, calmo e seguro. Perfeito para relaxar e exercitar a coordenação motora de bebês e crianças.',
    category: 'Bebês',
    subcategories: 'Lúdico,Sensorial,Cores',
    tags: 'bebes,bolhas,cores,sensorial,relaxante',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'plus',
    prefixUrl: '/games/bubble-pop/',
    version: '1.0.0',
    mouse: true,
    teclado: false,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Original',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-004'
  },
  {
    title: 'Sudoku Zen Master',
    slug: 'sudoku-zen',
    description: 'Sudoku fácil para celular sem instalar grátis. O clássico tabuleiro matemático de lógica com trilha relaxante, excelente para manter o cérebro da terceira idade ativo.',
    category: 'Terceira Idade',
    subcategories: 'Puzzle,Lógica,Cognitivo',
    tags: 'sudoku,tabuleiro,logica,zen,idoso,mente',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'hash',
    prefixUrl: '/games/sudoku-zen/',
    version: '1.0.0',
    mouse: true,
    teclado: false,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'ZenPuzzle Co',
    licenseName: 'Licença Comercial Ampla',
    contractNumber: 'CON-2026-005'
  },
  {
    title: 'Super Math Run',
    slug: 'math-run',
    description: 'Jogos de soma e matemática online. Corra, pule obstáculos e responda contas e cálculos rápidos mentalmente para continuar avançando.',
    category: 'Educacional',
    subcategories: 'Corrida,Educacional,Matemática',
    tags: 'educacional,infantil,matematica,corrida,kids',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'plus',
    prefixUrl: '/games/math-run/',
    version: '1.0.1',
    mouse: false,
    teclado: true,
    toque: true,
    gamepad: false,
    orientation: 'landscape',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'EduPlay Corp',
    licenseName: 'Licença Comercial Não Exclusiva',
    contractNumber: 'CON-2026-006'
  },
  {
    title: 'Memory Training Neon',
    slug: 'memory-match',
    description: 'Jogos gratuitos para exercitar a mente combinando cartas de neon vibrantes diretamente no navegador.',
    category: 'Memória',
    subcategories: 'Cognitivo,Educacional,Infantil',
    tags: 'memoria,educacional,mente,cartas,infantil,idoso',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'brain',
    prefixUrl: '/games/memory-match/',
    version: '1.0.2',
    mouse: true,
    teclado: false,
    toque: true,
    gamepad: false,
    orientation: 'portrait',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'MindCare Software',
    licenseName: 'Licença Comercial Geral',
    contractNumber: 'CON-2026-007'
  },
  {
    title: 'KRUUJDOKU',
    slug: 'kruujdoku',
    description: 'O puzzle oficial de raciocínio lógico das corujinhas do KRUUJ! 100 fases desafiadoras + Modo Infinito com regras puras de dedução, cores harmônicas e relaxamento mental.',
    category: 'Puzzle',
    subcategories: 'Sudoku,Lógica,Corujas,Cognitivo',
    tags: 'kruujdoku,sudoku,corujas,puzzle,mente,raciocinio,zen',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'brain',
    prefixUrl: '/games/kruujdoku/',
    version: '1.0.0',
    mouse: true,
    teclado: true,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-025'
  },
  {
    title: 'KRUUJ.IO ARENA',
    slug: 'kruujio',
    description: 'A grande arena competitiva das corujas! Entre no campo de batalha cósmico, colete energia estelar para crescer, use boost com sabedoria e derrote os rivais para alcançar o Rank #1.',
    category: 'Ação',
    subcategories: 'Arena,Multiplayer,Sobrevivência,Battle Royale',
    tags: 'kruujio,arena,acao,io,corujas,competitivo,multiplayer',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'gamepad',
    prefixUrl: '/games/kruujio/',
    version: '1.0.0',
    mouse: true,
    teclado: true,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-026'
  },
  {
    title: 'KRUUJ ORBIT',
    slug: 'kruuj-orbit',
    description: 'Salte entre órbitas planetárias com a física da coruja cósmica. Toque para se soltar e capture o campo gravitacional do próximo planeta!',
    category: 'Arcade',
    subcategories: 'Arcade,Gravidade,Espaço,One-Touch',
    tags: 'orbit,kruuj,espaco,arcade,gravidade,corujas,salto,kids',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'compass',
    prefixUrl: '/games/kruuj-orbit/',
    version: '1.0.0',
    mouse: true,
    teclado: true,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-027'
  },
  {
    title: 'KRUUJ MATCH',
    slug: 'kruuj-match',
    description: 'Puzzle zen de alquimia estelar! Combine 3 ou mais cristais rúnicos cósmicos e crie super poderes para libertar a energia mágica da coruja.',
    category: 'Puzzle',
    subcategories: 'Match-3,Puzzle,Zen,Lógica',
    tags: 'match3,kruuj,puzzle,zen,alquimia,mente,relaxar,idoso,familia',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'sparkles',
    prefixUrl: '/games/kruuj-match/',
    version: '1.0.0',
    mouse: true,
    teclado: false,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-028'
  },
  {
    title: 'KRUUJ GUARDIANS',
    slug: 'kruuj-defense',
    description: 'Tower defense tático estilo Bloons TD! Posicione Corujas Guardiãs para estourar balões cósmicos com penas, gelo, raio e lasers!',
    category: 'Ação',
    subcategories: 'Tower Defense,Estratégia,Ação,Defesa',
    tags: 'defense,kruuj,torres,estrategia,guardioes,acao,familia',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'shield',
    prefixUrl: '/games/kruuj-defense/',
    version: '1.0.0',
    mouse: true,
    teclado: false,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-029'
  },
  {
    title: 'KRUUJ RUNNER',
    slug: 'kruuj-runner',
    description: 'Corra pelos telhados cibernéticos da cidade cósmica em alta velocidade! Salte duas vezes, plane suavemente e resgate as penas estelares.',
    category: 'Ação',
    subcategories: 'Runner,Endless,Cyberpunk,Velocidade',
    tags: 'runner,kruuj,corrida,parkour,cyberpunk,acao,infinito',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'zap',
    prefixUrl: '/games/kruuj-runner/',
    version: '1.0.0',
    mouse: true,
    teclado: true,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-030'
  },
  {
    title: 'KRUUJ WORD',
    slug: 'kruuj-words',
    description: 'O enigma das corujas! Conecte letras cósmicas na roda mágica para desvendar palavras secretas e alimentar os filhotinhos de coruja.',
    category: 'Educacional',
    subcategories: 'Palavras,Lógica,Vocabulário,Educativo',
    tags: 'palavras,kruuj,educacional,letras,vocabulario,enigma,kids,infantil',
    ageRating: 'Livre',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60',
    iconUrl: 'book',
    prefixUrl: '/games/kruuj-words/',
    version: '1.0.0',
    mouse: true,
    teclado: false,
    toque: true,
    gamepad: false,
    orientation: 'both',
    statusTechnical: 'aprovado',
    statusEditorial: 'publicado',
    statusDoc: 'aprovado',
    author: 'KRUUJ Studio',
    licenseName: 'Proprietário',
    contractNumber: 'CON-2026-031'
  }
];

let syncExecuted = false;

export async function syncDatabaseWithCatalog() {
  if (syncExecuted) return;
  try {
    const validSlugs = new Set(REAL_14_GAMES.map(g => g.slug));

    // 1. Despublicar/remover jogos fictícios no Supabase para que não apareçam mais no site
    await prisma.game.updateMany({
      where: {
        slug: { notIn: Array.from(validSlugs) }
      },
      data: {
        statusEditorial: 'rascunho'
      }
    });

    // 2. Renomear e atualizar "Rocket Rise" e garantir os 14 jogos no banco
    for (const item of REAL_14_GAMES) {
      const existing = await prisma.game.findUnique({
        where: { slug: item.slug }
      });

      const { contractNumber, ...gameData } = item;

      if (!existing) {
        console.log(`[Supabase Sync] Inserindo jogo real: ${item.title} (${item.slug})`);
        const newGame = await prisma.game.create({
          data: {
            ...gameData,
            publishedAt: new Date()
          }
        });

        await prisma.contract.create({
          data: {
            contractNumber,
            signatoryCreator: 'KRUUJ Studio S/A',
            termsAccepted: true,
            licenseType: 'Proprietário Exclusivo',
            exclusivityScope: 'Global',
            durationMonths: 120,
            revenueSharePercent: 0.0,
            fixedPaymentAmount: 0.0,
            auditLog: `[${new Date().toISOString()}] Jogo sincronizado e homologado no Supabase.\n`,
            gameId: newGame.id
          }
        });
      } else {
        // Atualiza título se necessário (ex: Corrida Espacial -> Rocket Rise)
        await prisma.game.update({
          where: { slug: item.slug },
          data: {
            title: item.title,
            description: item.description,
            statusEditorial: 'publicado',
            prefixUrl: item.prefixUrl
          }
        });
      }
    }
    syncExecuted = true;
    console.log('[Supabase Sync] Catálogo limpo! Apenas os 14 jogos físicos reais estão ativos.');
  } catch (err: any) {
    console.warn('[Supabase Sync] Aviso na sincronização:', err?.message);
  }
}
