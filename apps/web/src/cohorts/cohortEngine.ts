/**
 * ==============================================================================
 * KRUUJ COHORT & FIRST-PARTY AUDIENCE ENGINE (LGPD-COMPLIANT)
 * ==============================================================================
 * Identifica o perfil comportamental do jogador (ex: 60+ Sênior, Kids, Arcade)
 * tanto para usuários anônimos quanto logados, utilizando estritamente sinais
 * first-party no cliente (sem cookies de terceiros, sem coleta de CPF/dados pessoais).
 * ==============================================================================
 */

export type CohortType =
  | 'COHORT_SENIOR_60'      // Jogadores com alta afinidade em Raciocínio, Dominó, Sudoku, Paciência
  | 'COHORT_ARCADE_GAMER'   // Jogadores de ação rápida, corrida e reflexos (Overdrive, Rocket Rise)
  | 'COHORT_PROTECTED_KIDS' // Menores/Bebês - ZERO direcionamento comercial (Art. 14 LGPD/ECA)
  | 'COHORT_CASUAL_GENERAL';// Público geral sem tendência única definida

export interface CohortScores {
  senior: number;
  arcade: number;
  kids: number;
  casual: number;
  totalInteractions: number;
  lastUpdated: number;
}

// Mapeamento de afinidade por slug de jogo
const GAME_AFFINITY_MAP: Record<string, { senior: number; arcade: number; kids: number; casual: number }> = {
  // Sênior Play / 60+
  'sudoku-zen': { senior: 10, arcade: 0, kids: 0, casual: 2 },
  'kruujdoku': { senior: 10, arcade: 0, kids: 0, casual: 2 },
  'kruuj-dominio': { senior: 10, arcade: 0, kids: 0, casual: 3 },
  'kruuj-master-dominoes': { senior: 10, arcade: 0, kids: 0, casual: 2 },
  'kruuj-truco': { senior: 9, arcade: 1, kids: 0, casual: 3 },
  'kruuj-solitaire': { senior: 10, arcade: 0, kids: 0, casual: 3 },
  'kruuj-zen-crosswords': { senior: 10, arcade: 0, kids: 0, casual: 2 },
  'kruuj-word-search': { senior: 9, arcade: 0, kids: 1, casual: 3 },
  'kruuj-words': { senior: 8, arcade: 1, kids: 1, casual: 3 },
  'kruuj-golden-memory': { senior: 7, arcade: 1, kids: 1, casual: 4 },
  'kruuj-jigsaw-gallery': { senior: 8, arcade: 0, kids: 1, casual: 4 },

  // Kids & Linha Baby (Protegidos)
  'kruuj-baby-animals': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-bath': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-feeding': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-music': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-pairs': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-peekaboo': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-shapes': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-silhouette': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'kruuj-baby-train': { senior: 0, arcade: 0, kids: 10, casual: 0 },
  'math-run': { senior: 0, arcade: 2, kids: 10, casual: 2 },
  'bubble-pop': { senior: 1, arcade: 2, kids: 8, casual: 4 },
  'kruuj-paint': { senior: 1, arcade: 0, kids: 8, casual: 4 },

  // Ação / Arcade / Hardcore
  'kruuj-overdrive': { senior: 1, arcade: 10, kids: 1, casual: 3 },
  'rocket-rise': { senior: 1, arcade: 10, kids: 1, casual: 3 },
  'kruuj-orbit': { senior: 2, arcade: 9, kids: 1, casual: 4 },
  'kruuj-defense': { senior: 3, arcade: 8, kids: 1, casual: 5 },
  'kruuj-aim-trainer': { senior: 0, arcade: 10, kids: 0, casual: 2 },
  'kruujio': { senior: 1, arcade: 9, kids: 1, casual: 4 },
  'space-defense': { senior: 1, arcade: 9, kids: 1, casual: 3 },
  'snake-retro': { senior: 2, arcade: 7, kids: 2, casual: 5 },
  'memory-match': { senior: 5, arcade: 2, kids: 4, casual: 5 },
  'kruuj-gem-quest': { senior: 3, arcade: 4, kids: 2, casual: 8 },
  'kruuj-pizza-empire': { senior: 3, arcade: 6, kids: 3, casual: 9 },
  'kruuj-match': { senior: 4, arcade: 3, kids: 2, casual: 8 },
  'kruuj-neon-blocks': { senior: 4, arcade: 4, kids: 1, casual: 8 },
  'kruuj-penalty': { senior: 3, arcade: 6, kids: 3, casual: 6 },
};

const STORAGE_KEY = 'kruuj_cohort_affinity_v1';
const DID_KEY = 'kruuj_anonymous_did';

// Obtém ou gera um Identificador Anônimo First-Party
export function getOrCreateDeviceUUID(): string {
  try {
    let did = localStorage.getItem(DID_KEY);
    if (!did) {
      did = 'kruuj_did_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      localStorage.setItem(DID_KEY, did);
    }
    return did;
  } catch (e) {
    return 'kruuj_did_ephemeral';
  }
}

// Recupera a matriz de pontuações do localStorage
function getStoredScores(): CohortScores {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}

  return {
    senior: 0,
    arcade: 0,
    kids: 0,
    casual: 0,
    totalInteractions: 0,
    lastUpdated: Date.now(),
  };
}

// Salva a pontuação calculada
function saveScores(scores: CohortScores) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  } catch (e) {}
}

/**
 * Registra uma interação de jogo para calibrar o perfil em tempo real
 * @param gameSlug Identificador do jogo jogado
 * @param durationSeconds Tempo de gameplay ativa em segundos
 */
export function trackGameInteraction(gameSlug: string, durationSeconds: number = 30) {
  const scores = getStoredScores();
  const affinity = GAME_AFFINITY_MAP[gameSlug] || { senior: 1, arcade: 1, kids: 1, casual: 4 };

  // Fator de peso baseado na duração (mínimo 1 ponto, +1 a cada 60s)
  const durationWeight = Math.max(1, Math.min(5, Math.floor(durationSeconds / 60) + 1));

  scores.senior += affinity.senior * durationWeight;
  scores.arcade += affinity.arcade * durationWeight;
  scores.kids += affinity.kids * durationWeight;
  scores.casual += affinity.casual * durationWeight;
  scores.totalInteractions += 1;
  scores.lastUpdated = Date.now();

  saveScores(scores);
}

/**
 * Identifica o Cohort ativo do usuário (anônimo ou logado)
 */
export function getUserCohort(): {
  cohort: CohortType;
  seniorProbability: number;
  reason: string;
} {
  const scores = getStoredScores();
  const total = scores.senior + scores.arcade + scores.kids + scores.casual;

  // Se houver poucas interações, mantém no público geral neutro
  if (total < 10) {
    return {
      cohort: 'COHORT_CASUAL_GENERAL',
      seniorProbability: 0.25,
      reason: 'Amostragem inicial insuficiente (< 10 pontos).',
    };
  }

  // REGRA DE OURO JURÍDICA: Se houver forte consumo de jogos Kids/Bebês,
  // bloqueia profiling comercial e protege imediatamente a sessão (Art. 14 LGPD/ECA).
  const kidsRatio = scores.kids / total;
  if (kidsRatio >= 0.40) {
    return {
      cohort: 'COHORT_PROTECTED_KIDS',
      seniorProbability: 0,
      reason: 'Perfil infantil protegido: anúncios comerciais bloqueados (LGPD Art. 14).',
    };
  }

  // Análise de Afinidade Terceira Idade (60+ Sênior)
  const seniorRatio = scores.senior / total;
  if (seniorRatio >= 0.45) {
    return {
      cohort: 'COHORT_SENIOR_60',
      seniorProbability: Math.min(0.98, Math.round(seniorRatio * 100) / 100),
      reason: `Alta afinidade com jogos de raciocínio, dominó e cartas (${Math.round(seniorRatio * 100)}%).`,
    };
  }

  // Análise Gamer Arcade / Reflexos
  const arcadeRatio = scores.arcade / total;
  if (arcadeRatio >= 0.45) {
    return {
      cohort: 'COHORT_ARCADE_GAMER',
      seniorProbability: 0.1,
      reason: `Afinidade com jogos de ação e corrida (${Math.round(arcadeRatio * 100)}%).`,
    };
  }

  return {
    cohort: 'COHORT_CASUAL_GENERAL',
    seniorProbability: Math.round(seniorRatio * 100) / 100,
    reason: 'Padrão de jogo equilibrado entre múltiplas categorias.',
  };
}
