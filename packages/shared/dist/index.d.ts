export type UserStatus = 'ativo' | 'suspenso';
export type UserRole = 'super_admin' | 'editor' | 'moderador' | 'analista' | 'marketing' | 'suporte' | 'financeiro' | 'user';
export interface User {
    id: string;
    username: string;
    role: UserRole;
    status: UserStatus;
    agePreference?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface AuthResponse {
    user: User;
    token: string;
}
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
    ageRating: string;
    bannerUrl: string;
    iconUrl: string;
    prefixUrl: string;
    version: string;
    controls: GameControls;
    orientation: 'portrait' | 'landscape' | 'both';
    statusTechnical: TechnicalStatus;
    statusEditorial: EditorialStatus;
    statusDoc: DocumentalStatus;
    author: string;
    licenseName: string;
    publishedAt?: Date;
    revisedAt?: Date;
    accessibilityMetadata?: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ContractInfo {
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
export type AnalyticsEventType = 'page_view' | 'category_view' | 'game_impression' | 'game_start' | 'game_loaded' | 'game_load_error' | 'game_exit' | 'game_completed' | 'favorite_added' | 'search_performed' | 'login_started' | 'login_completed' | 'ad_impression' | 'ad_completed' | 'ad_skipped' | 'consent_updated';
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
    placementId: string;
    adType: 'display' | 'interstitial' | 'rewarded';
    campaignId?: string;
}
export interface AggregateMetrics {
    period: string;
    sessions: number;
    activeUsers: number;
    bounceRate: number;
    avgPlayTimeMinutes: number;
    topGames: Array<{
        gameId: string;
        title: string;
        sessions: number;
    }>;
    topCategories: Array<{
        name: string;
        sessions: number;
    }>;
    revenue: {
        gross: number;
        estimatedNet: number;
        rpm: number;
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
