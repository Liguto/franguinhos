// Tipos compartilhados do Portal de Jogos HTML5

// --- USUÁRIOS E AUTENTICAÇÃO ---

export type UserStatus = 'ativo' | 'suspenso';
export type UserRole = 'super_admin' | 'editor' | 'moderador' | 'analista' | 'marketing' | 'suporte' | 'financeiro' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  status: UserStatus;
  agePreference?: string; // 'infantil' | 'terceira_idade' | 'sem_preferencia'
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// --- JOGOS ---

export type TechnicalStatus = 'aprovado' | 'pendente_teste' | 'rejeitado';
export type EditorialStatus = 'rascunho' | 'em_análise' | 'aprovado' | 'publicado' | 'suspenso' | 'arquivado';
export type DocumentalStatus = 'aprovado' | 'documentacao_pendente' | 'rejeitado';

export interface GameControls {
  mouse: boolean;
  teclado: boolean;
  toque: boolean;
  gamepad: boolean;
}

export interface Game {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategories: string[];
  tags: string[];
  ageRating: string; // ex: 'Livre', '10+', '14+', etc.
  bannerUrl: string;
  iconUrl: string;
  prefixUrl: string; // Prefixo no storage ex: /games/snake-v1/
  version: string;
  controls: GameControls;
  orientation: 'portrait' | 'landscape' | 'both';
  statusTechnical: TechnicalStatus;
  statusEditorial: EditorialStatus;
  statusDoc: DocumentalStatus;
  author: string;
  licenseName: string; // ex: 'Licença Comercial Ampla', 'Cessão de Direitos'
  publishedAt?: Date;
  revisedAt?: Date;
  accessibilityMetadata?: string;
  createdAt: Date;
  updatedAt: Date;
}

// --- DOSSIÊ JURÍDICO DO JOGO ---

export interface ContractInfo {
  id: string;
  gameId: string;
  contractNumber: string;
  signatoryCreator: string;
  signatoryRepresentative?: string; // para menores ou representantes legais
  termsAccepted: boolean;
  licenseType: string;
  exclusivityScope: string; // 'exclusivo_brasil' | 'nao_exclusivo' | 'etc'
  durationMonths: number;
  revenueSharePercent: number;
  fixedPaymentAmount: number;
  auditLog: string;
}

// --- ANALYTICS & EVENTOS ---

export type AnalyticsEventType =
  | 'page_view'
  | 'category_view'
  | 'game_impression'
  | 'game_start'
  | 'game_loaded'
  | 'game_load_error'
  | 'game_exit'
  | 'game_completed'
  | 'favorite_added'
  | 'search_performed'
  | 'login_started'
  | 'login_completed'
  | 'ad_impression'
  | 'ad_completed'
  | 'ad_skipped'
  | 'consent_updated';

export interface BaseAnalyticsEvent {
  id: string;
  eventType: AnalyticsEventType;
  sessionId: string;
  userId?: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  timestamp: Date;
  consentGiven: boolean;
}

export interface GameEventPayload extends BaseAnalyticsEvent {
  gameId: string;
  gameSlug: string;
  durationSeconds?: number;
}

export interface AdEventPayload extends BaseAnalyticsEvent {
  placementId: string; // 'banner_home', 'interstitial_pre_game', etc.
  adType: 'display' | 'interstitial' | 'rewarded';
  campaignId?: string;
}

// --- INSIGHTS DE IA ---

export interface AggregateMetrics {
  period: string; // 'last_7_days' | 'last_30_days'
  sessions: number;
  activeUsers: number;
  bounceRate: number; // abandono no carregamento
  avgPlayTimeMinutes: number;
  topGames: Array<{ gameId: string; title: string; sessions: number }>;
  topCategories: Array<{ name: string; sessions: number }>;
  revenue: {
    gross: number;
    estimatedNet: number;
    rpm: number; // receita por mil sessões
  };
}

export interface IAInsight {
  id: string;
  title: string;
  summary: string;
  period: string;
  detectedAt: Date;
  confidence: 'alta' | 'media' | 'baixa';
  evidenceData: Record<string, any>;
  suggestions: string[];
}
