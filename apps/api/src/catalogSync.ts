import { prisma } from './prisma';

export const OFFICIAL_GAMES = [
  {
    title: 'KRUUJ Orbit',
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
    title: 'Kruuj Match',
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
    title: 'KRUUJ Guardians',
    slug: 'kruuj-defense',
    description: 'Tower defense tático espacial! Posicione Corujas Guardiãs com poderes de raio, gelo e explosão cósmica para proteger o ninho sagrado.',
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
    title: 'KRUUJ Runner',
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
    title: 'Kruuj Word',
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
    for (const item of OFFICIAL_GAMES) {
      const existing = await prisma.game.findUnique({
        where: { slug: item.slug }
      });

      if (!existing) {
        console.log(`[Supabase Sync] Inserindo jogo: ${item.title} (${item.slug})`);
        const { contractNumber, ...gameData } = item;
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
      }
    }
    syncExecuted = true;
    console.log('[Supabase Sync] Todos os jogos estão sincronizados no PostgreSQL.');
  } catch (err: any) {
    console.warn('[Supabase Sync] Aviso na sincronização:', err?.message);
  }
}
