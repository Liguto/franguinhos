import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeação do banco de dados...');

  // 1. Limpar tabelas existentes
  await prisma.favorite.deleteMany({});
  await prisma.contract.deleteMany({});
  await prisma.game.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.analyticsEvent.deleteMany({});

  console.log('🧹 Banco de dados limpo.');

  // 2. Criar Usuários
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const playerPasswordHash = await bcrypt.hash('player123', 10);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      passwordHash: adminPasswordHash,
      role: 'super_admin',
      status: 'ativo',
      agePreference: 'sem_preferencia'
    }
  });

  const editor = await prisma.user.create({
    data: {
      username: 'editor',
      passwordHash: adminPasswordHash,
      role: 'editor',
      status: 'ativo',
      agePreference: 'sem_preferencia'
    }
  });

  const player1 = await prisma.user.create({
    data: {
      username: 'poki_gamer',
      passwordHash: playerPasswordHash,
      role: 'user',
      status: 'ativo',
      agePreference: 'sem_preferencia'
    }
  });

  const player2 = await prisma.user.create({
    data: {
      username: 'vovo_gamer',
      passwordHash: playerPasswordHash,
      role: 'user',
      status: 'ativo',
      agePreference: 'terceira_idade'
    }
  });

  console.log('👥 Usuários criados com sucesso.');

  // 3. Criar os 24 Jogos Oficiais do Catálogo KRUUJ
  const gamesToSeed = [
    {
      title: 'Corrida Espacial',
      slug: 'rocket-rise',
      description: 'Acelere nessa aventura intergaláctica cheia de adrenalina! Pilote sua nave espacial, desvie de chuvas de meteoros e colete energia estelar para cruzar a linha de chegada.',
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
      contract: {
        contractNumber: 'CON-2026-001',
        signatoryCreator: 'KRUUJ Studio S/A',
        termsAccepted: true,
        licenseType: 'Proprietário In-house',
        exclusivityScope: 'Exclusivo Total',
        durationMonths: 120,
        revenueSharePercent: 0.0,
        fixedPaymentAmount: 0.0,
        auditLog: `[2026-08-24T10:00:00Z] Jogo desenvolvido in-house com suporte completo a mobile e PC.\n`
      }
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
      contract: {
        contractNumber: 'CON-2026-002',
        signatoryCreator: 'PixelGlitch Labs',
        termsAccepted: true,
        licenseType: 'Cessão de Propriedade Intelectual',
        exclusivityScope: 'Exclusivo Total',
        durationMonths: 120,
        revenueSharePercent: 0.0,
        fixedPaymentAmount: 3500.0,
        auditLog: `[2026-08-24T10:15:00Z] Cessão de direitos autorais registrada em cartório digital.\n`
      }
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
      contract: {
        contractNumber: 'CON-2026-003',
        signatoryCreator: 'RetroByte Studios LP',
        termsAccepted: true,
        licenseType: 'Licença Comercial Exclusiva Digital',
        exclusivityScope: 'Exclusivo Brasil',
        durationMonths: 24,
        revenueSharePercent: 30.0,
        fixedPaymentAmount: 1200.0,
        auditLog: `[2026-08-24T10:30:00Z] Contrato assinado eletronicamente por RetroByte LP.\n`
      }
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
      contract: {
        contractNumber: 'CON-2026-004',
        signatoryCreator: 'KRUUJ Games',
        termsAccepted: true,
        licenseType: 'Proprietário In-house',
        exclusivityScope: 'Exclusivo Total',
        durationMonths: 120,
        revenueSharePercent: 0.0,
        fixedPaymentAmount: 0.0,
        auditLog: `[2026-08-24T11:00:00Z] Jogo desenvolvido in-house com bloqueio infantil.\n`
      }
    },
    {
      title: 'Super Kart Racer',
      slug: 'super-kart-racer',
      description: 'Acelere em pistas radicais com derrapagens insanas e turbos nitros empolgantes.',
      category: 'Corrida',
      subcategories: 'Kart,Velocidade,Arcade',
      tags: 'corrida,kart,velocidade,competicao',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/rocket-rise/',
      version: '1.0.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'Speedy Games',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-005',
        signatoryCreator: 'Speedy Games Studio',
        termsAccepted: true,
        licenseType: 'Licença Comercial Ampla',
        exclusivityScope: 'Global',
        durationMonths: 36,
        revenueSharePercent: 25.0,
        fixedPaymentAmount: 1500.0,
        auditLog: `[2026-08-24T11:30:00Z] Licença firmada com Speedy Games.\n`
      }
    },
    {
      title: 'Craft World',
      slug: 'craft-world',
      description: 'Explore biomas voxel infinitos, minere recursos e construa castelos e ferramentas lendárias.',
      category: 'Aventura',
      subcategories: 'Sandbox,Crafting,Exploração',
      tags: 'craft,blocos,mundo,criativo',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'gamepad',
      prefixUrl: '/games/snake-retro/',
      version: '1.0.0',
      mouse: true,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'BlockCraft Studio',
      licenseName: 'Licença Ampla',
      contract: {
        contractNumber: 'CON-2026-006',
        signatoryCreator: 'BlockCraft Games Inc',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 1000.0,
        auditLog: `[2026-08-24T12:00:00Z] Contrato de distribuição assinado.\n`
      }
    },
    {
      title: 'Monster Truck',
      slug: 'monster-truck',
      description: 'Esmague obstáculos e faça saltos épicos pilotando caminhões monstros gigantescos.',
      category: 'Ação',
      subcategories: 'Carros,Acrobacias,Física',
      tags: 'truck,carros,acrobacia,destruicao',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/rocket-rise/',
      version: '1.0.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'NitroWheels Co',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-007',
        signatoryCreator: 'NitroWheels Co',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 800.0,
        auditLog: `[2026-08-24T12:30:00Z] Licença Comercial NitroWheels.\n`
      }
    },
    {
      title: 'Fruit Ninja',
      slug: 'fruit-ninja',
      description: 'Corte melancias, laranjas e maçãs voadoras com golpes rápidos de lâmina ninja.',
      category: 'Arcade',
      subcategories: 'Corte,Reflexo,Casual',
      tags: 'frutas,corte,ninja,reflexo',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&auto=format&fit=crop&q=60',
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
      author: 'SliceBlade Studio',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-008',
        signatoryCreator: 'SliceBlade Studio',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 36,
        revenueSharePercent: 15.0,
        fixedPaymentAmount: 1100.0,
        auditLog: `[2026-08-24T13:00:00Z] Contrato SliceBlade validado.\n`
      }
    },
    {
      title: 'Sky Force',
      slug: 'sky-force',
      description: 'Combate aéreo intenso pilotando jatos avançados contra frotas e chefes mecânicos.',
      category: 'Ação',
      subcategories: 'Tiro,Aviões,Guerra',
      tags: 'aviao,tiro,batalha,ceu',
      ageRating: '10+',
      bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/space-defense/',
      version: '1.0.0',
      mouse: true,
      teclado: true,
      toque: true,
      gamepad: true,
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'SkyFighter Games',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-009',
        signatoryCreator: 'SkyFighter Games',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 1400.0,
        auditLog: `[2026-08-24T13:30:00Z] Licença Comercial Sky Force.\n`
      }
    },
    {
      title: 'Animal Rescue',
      slug: 'animal-rescue',
      description: 'Salve bichinhos fofos perdidos na floresta mágica resolvendo desafios e enigmas.',
      category: 'Educacional',
      subcategories: 'Crianças,Animais,Lógica',
      tags: 'animais,resgate,infantil,natureza',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'plus',
      prefixUrl: '/games/math-run/',
      version: '1.0.0',
      mouse: true,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'Wildlife Games',
      licenseName: 'Licença Não Exclusiva',
      contract: {
        contractNumber: 'CON-2026-010',
        signatoryCreator: 'Wildlife Games LLC',
        termsAccepted: true,
        licenseType: 'Licença Não Exclusiva Educacional',
        exclusivityScope: 'Global',
        durationMonths: 36,
        revenueSharePercent: 15.0,
        fixedPaymentAmount: 600.0,
        auditLog: `[2026-08-24T14:00:00Z] Aprovado para categoria Kids/Educacional.\n`
      }
    },
    {
      title: 'Puzzle Quest',
      slug: 'puzzle-quest',
      description: 'Combine joias místicas e pedras preciosas para conjurar feitiços e vencer batalhas de inteligência.',
      category: 'Puzzle',
      subcategories: 'Joias,Combinação,RPG',
      tags: 'puzzle,joias,magia,raciocinio',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'brain',
      prefixUrl: '/games/memory-match/',
      version: '1.0.0',
      mouse: true,
      teclado: false,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'GemQuest Studios',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-011',
        signatoryCreator: 'GemQuest Studios',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 950.0,
        auditLog: `[2026-08-24T14:30:00Z] Contrato Puzzle Quest assinado.\n`
      }
    },
    {
      title: 'Color Match',
      slug: 'color-match',
      description: 'Teste sua agilidade mental e memória combinando blocos e paletas de cores harmônicas.',
      category: 'Memória',
      subcategories: 'Cognitivo,Design,Percepção',
      tags: 'cores,memoria,padroes,mente',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'brain',
      prefixUrl: '/games/memory-match/',
      version: '1.0.0',
      mouse: true,
      teclado: false,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'ColorLabs',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-012',
        signatoryCreator: 'ColorLabs Corp',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 15.0,
        fixedPaymentAmount: 700.0,
        auditLog: `[2026-08-24T15:00:00Z] Contrato ColorLabs validado.\n`
      }
    },
    {
      title: 'Tiny Farmers',
      slug: 'tiny-farmers',
      description: 'Plante hortaliças, cuide dos animais da fazenda e negocie colheitas com seus vizinhos.',
      category: 'Família',
      subcategories: 'Fazenda,Gestão,Simulação',
      tags: 'fazenda,plantio,familia,relaxante',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60',
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
      author: 'FarmSim Co',
      licenseName: 'Licença Geral',
      contract: {
        contractNumber: 'CON-2026-013',
        signatoryCreator: 'FarmSim Entertainment',
        termsAccepted: true,
        licenseType: 'Licença Comercial Família',
        exclusivityScope: 'Global',
        durationMonths: 36,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 1200.0,
        auditLog: `[2026-08-24T15:30:00Z] Contrato Tiny Farmers assinado.\n`
      }
    },
    {
      title: 'Dragon Run',
      slug: 'dragon-run',
      description: 'Guie o dragão mítico pelos céus do reino coletando esferas de fogo e desviando de tempestades.',
      category: 'Ação',
      subcategories: 'Dragões,Corrida Infinita,Fantasia',
      tags: 'dragao,fantasia,corrida,mitologia',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=60',
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
      author: 'MythicByte',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-014',
        signatoryCreator: 'MythicByte Studios',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 900.0,
        auditLog: `[2026-08-24T16:00:00Z] Contrato Dragon Run assinado.\n`
      }
    },
    {
      title: 'Space Jump',
      slug: 'space-jump',
      description: 'Pule entre plataformas flutuantes em baixa gravidade enquanto viaja pelo sistema solar.',
      category: 'Arcade',
      subcategories: 'Salto,Gravidade,Plataforma',
      tags: 'salto,plataforma,espaco,gravidade',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/rocket-rise/',
      version: '1.0.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'Orbit Games',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-015',
        signatoryCreator: 'Orbit Games SA',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 850.0,
        auditLog: `[2026-08-24T16:30:00Z] Contrato Space Jump validado.\n`
      }
    },
    {
      title: 'Blaze Riders',
      slug: 'blaze-riders',
      description: 'Corridas de motos esportivas em alta velocidade por metrópoles futuristas iluminadas a neon.',
      category: 'Corrida',
      subcategories: 'Motos,Velocidade,Cyberpunk',
      tags: 'moto,corrida,nitro,cidade',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/rocket-rise/',
      version: '1.0.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'CyberMoto',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-016',
        signatoryCreator: 'CyberMoto Interactive',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 25.0,
        fixedPaymentAmount: 1300.0,
        auditLog: `[2026-08-24T17:00:00Z] Contrato Blaze Riders assinado.\n`
      }
    },
    {
      title: 'Magic Tiles',
      slug: 'magic-tiles',
      description: 'Toque nas teclas do piano no ritmo das melhores canções clássicas e eletrônicas.',
      category: 'Memória',
      subcategories: 'Música,Ritmo,Piano',
      tags: 'musica,piano,ritmo,teclas',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'brain',
      prefixUrl: '/games/memory-match/',
      version: '1.0.0',
      mouse: true,
      teclado: false,
      toque: true,
      gamepad: false,
      orientation: 'portrait',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'RhythmArts',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-017',
        signatoryCreator: 'RhythmArts Entertainment',
        termsAccepted: true,
        licenseType: 'Licença Comercial Musical',
        exclusivityScope: 'Global',
        durationMonths: 36,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 1100.0,
        auditLog: `[2026-08-24T17:30:00Z] Licença e direitos musicais validados.\n`
      }
    },
    {
      title: 'Island Builder',
      slug: 'island-builder',
      description: 'Colonize ilhas tropicais paradisíacas criando portos, pontes e cidades sustentáveis.',
      category: 'Família',
      subcategories: 'Construção,Estratégia,Ilhas',
      tags: 'ilha,construcao,mar,familia',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
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
      author: 'TropicoStudios',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-018',
        signatoryCreator: 'TropicoStudios LLC',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 1000.0,
        auditLog: `[2026-08-24T18:00:00Z] Contrato Island Builder assinado.\n`
      }
    },
    {
      title: 'Dino Adventure',
      slug: 'dino-adventure',
      description: 'Acompanhe dinossauros simpáticos em expedições pela selva pré-histórica cheia de enigmas.',
      category: 'Educacional',
      subcategories: 'Dinossauros,Aventura,Kids',
      tags: 'dino,jurassico,aventura,crianca',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1525877442103-5dd52293b455?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'plus',
      prefixUrl: '/games/math-run/',
      version: '1.0.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'Prehistoric Corp',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-019',
        signatoryCreator: 'Prehistoric Corp',
        termsAccepted: true,
        licenseType: 'Licença Comercial Educacional',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 15.0,
        fixedPaymentAmount: 750.0,
        auditLog: `[2026-08-24T18:30:00Z] Contrato Dino Adventure aprovado para público Kids.\n`
      }
    },
    {
      title: 'Soccer Stars',
      slug: 'soccer-stars',
      description: 'Partidas de futebol disputadas com jogadas de botão, tabelas e gols nos acréscimos.',
      category: 'Ação',
      subcategories: 'Futebol,Esportes,Competição',
      tags: 'futebol,gol,chute,campeonato',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'rocket',
      prefixUrl: '/games/space-defense/',
      version: '1.0.0',
      mouse: true,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'landscape',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'GoalMaster Studios',
      licenseName: 'Licença Comercial',
      contract: {
        contractNumber: 'CON-2026-020',
        signatoryCreator: 'GoalMaster Studios',
        termsAccepted: true,
        licenseType: 'Licença Comercial Esportiva',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 1200.0,
        auditLog: `[2026-08-24T19:00:00Z] Contrato Soccer Stars assinado.\n`
      }
    },
    {
      title: 'Forest Guardians',
      slug: 'forest-guardians',
      description: 'Proteja os espíritos da floresta antiga contra as forças da sombra com enigmas de luz.',
      category: 'Aventura',
      subcategories: 'Magia,Natureza,Puzzle',
      tags: 'floresta,magia,guardiao,aventura',
      ageRating: 'Livre',
      bannerUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=60',
      iconUrl: 'plus',
      prefixUrl: '/games/math-run/',
      version: '1.0.0',
      mouse: false,
      teclado: true,
      toque: true,
      gamepad: false,
      orientation: 'both',
      statusTechnical: 'aprovado',
      statusEditorial: 'publicado',
      statusDoc: 'aprovado',
      author: 'GuardianGames',
      licenseName: 'Licença Geral',
      contract: {
        contractNumber: 'CON-2026-021',
        signatoryCreator: 'GuardianGames Studio',
        termsAccepted: true,
        licenseType: 'Licença Comercial',
        exclusivityScope: 'Global',
        durationMonths: 24,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 850.0,
        auditLog: `[2026-08-24T19:30:00Z] Contrato Forest Guardians assinado.\n`
      }
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
      contract: {
        contractNumber: 'CON-2026-022',
        signatoryCreator: 'ZenPuzzle LLC',
        termsAccepted: true,
        licenseType: 'Licença Ampla Não Exclusiva',
        exclusivityScope: 'Global',
        durationMonths: 48,
        revenueSharePercent: 10.0,
        fixedPaymentAmount: 600.0,
        auditLog: `[2026-08-24T20:00:00Z] Contrato Zen assinado. Aprovado para catálogo sênior.\n`
      }
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
      contract: {
        contractNumber: 'CON-2026-023',
        signatoryCreator: 'EduPlay Corp S/A',
        termsAccepted: true,
        licenseType: 'Licença Comercial de Uso',
        exclusivityScope: 'Global',
        durationMonths: 12,
        revenueSharePercent: 20.0,
        fixedPaymentAmount: 500.0,
        auditLog: `[2026-08-24T20:30:00Z] Contrato assinado. Aprovado editorialmente para portal Educacional.\n`
      }
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
      contract: {
        contractNumber: 'CON-2026-024',
        signatoryCreator: 'MindCare Software SA',
        termsAccepted: true,
        licenseType: 'Licença Comercial Não Exclusiva',
        exclusivityScope: 'Global',
        durationMonths: 36,
        revenueSharePercent: 15.0,
        fixedPaymentAmount: 800.0,
        auditLog: `[2026-08-24T21:00:00Z] Contrato validado por MindCare SA. Aprovado para Infantil e 60+.\n`
      }
    },
    {
      title: 'KruujDoku',
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
      contract: {
        contractNumber: 'CON-2026-025',
        signatoryCreator: 'KRUUJ Studio S/A',
        termsAccepted: true,
        licenseType: 'Proprietário Exclusivo',
        exclusivityScope: 'Global',
        durationMonths: 120,
        revenueSharePercent: 0.0,
        fixedPaymentAmount: 0.0,
        auditLog: `[2026-10-06T10:00:00Z] Jogo original KruujDoku homologado e registrado no catálogo oficial KRUUJ.\n`
      }
    }
  ];

  for (const g of gamesToSeed) {
    const { contract, ...gameData } = g;
    const game = await prisma.game.create({
      data: {
        ...gameData,
        publishedAt: gameData.statusEditorial === 'publicado' ? new Date() : null,
      }
    });

    await prisma.contract.create({
      data: {
        ...contract,
        gameId: game.id
      }
    });
  }

  // 4. Criar Favoritos Iniciais
  const seededGames = await prisma.game.findMany();
  const snakeGame = seededGames.find(g => g.slug === 'snake-retro');
  const memoryGame = seededGames.find(g => g.slug === 'memory-match');
  const rocketGame = seededGames.find(g => g.slug === 'rocket-rise');

  if (snakeGame) {
    await prisma.favorite.create({
      data: {
        userId: player1.id,
        gameId: snakeGame.id
      }
    });
  }

  if (memoryGame) {
    await prisma.favorite.create({
      data: {
        userId: player2.id,
        gameId: memoryGame.id
      }
    });
  }

  if (rocketGame) {
    await prisma.favorite.create({
      data: {
        userId: player1.id,
        gameId: rocketGame.id
      }
    });
  }

  // 5. Ingerir eventos iniciais de analytics para popular dashboard
  console.log('📊 Semeando eventos de analítica históricos...');
  const events = [
    { eventType: 'page_view', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome' },
    { eventType: 'page_view', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari' },
    { eventType: 'game_start', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome', gameSlug: 'rocket-rise' },
    { eventType: 'game_loaded', sessionId: 'sess-001', deviceType: 'desktop', browser: 'Chrome', gameSlug: 'rocket-rise' },
    { eventType: 'game_start', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', gameSlug: 'bubble-pop' },
    { eventType: 'game_loaded', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', gameSlug: 'bubble-pop' },
    { eventType: 'ad_impression', sessionId: 'sess-002', deviceType: 'mobile', browser: 'Safari', placementId: 'banner_home', adType: 'display' }
  ];

  for (const ev of events) {
    await prisma.analyticsEvent.create({
      data: {
        ...ev,
        timestamp: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
      }
    });
  }

  console.log(`✅ Semeação concluída com sucesso! Total de jogos cadastrados: ${gamesToSeed.length}`);
}

main()
  .catch((e) => {
    console.error('Erro na semeação do banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
