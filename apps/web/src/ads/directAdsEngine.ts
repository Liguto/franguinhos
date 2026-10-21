/**
 * ==============================================================================
 * KRUUJ DIRECT ADS & WATERFALL ENGINE
 * ==============================================================================
 * Gerenciador de campanhas diretas (Direct Deals) com anunciantes exclusivos
 * de alto CPM (ex: MedSênior para o público 60+), com suporte a fallback
 * programático e blindagem total para a categoria Kids.
 * ==============================================================================
 */

import { CohortType } from '../cohorts/cohortEngine';

export interface DirectCampaign {
  id: string;
  name: string;
  advertiser: string;
  targetCohort: CohortType;
  title: string;
  tagline: string;
  ctaText: string;
  landingUrl: string;
  badgeText: string;
  themeColor: string;
  cpmValueReais: number; // Ex: R$ 35,00
  durationSeconds: number; // Duração do anúncio antes de liberar o botão fechar (padrão 5s)
}

// Catálogo de campanhas diretas ativas no portal KRUUJ
const ACTIVE_DIRECT_CAMPAIGNS: DirectCampaign[] = [
  {
    id: 'camp_medsenior_60_v1',
    name: 'MedSênior Saúde 60+',
    advertiser: 'MedSênior Brasil',
    targetCohort: 'COHORT_SENIOR_60',
    title: 'Plano de Saúde Especializado para Quem Já Passou dos 49 Anos',
    tagline: 'Medicina preventiva, oficinas de saúde e atendimento acolhedor sem coparticipação surpresa.',
    ctaText: 'CONHECER PLANO MEDSÊNIOR',
    landingUrl: 'https://www.medsenior.com.br/?utm_source=kruuj_games&utm_medium=interstitial_60&utm_campaign=zen_seniors',
    badgeText: 'PARCEIRO OFICIAL 60+ KRUUJ',
    themeColor: '#0284c7', // Azul acolhedor
    cpmValueReais: 38.00,
    durationSeconds: 5,
  },
  {
    id: 'camp_arcade_overdrive_v1',
    name: 'KRUUJ Pro Game Pass',
    advertiser: 'KRUUJ Studio Originals',
    targetCohort: 'COHORT_ARCADE_GAMER',
    title: 'Desbloqueie Todos os 36 Jogos em Modo Competitivo',
    tagline: 'Jogue sem anúncios, concorra em placares semanais e ganhe itens cósmicos exclusivos.',
    ctaText: 'EXPERIMENTAR GRÁTIS',
    landingUrl: '/premium',
    badgeText: 'KRUUJ ESPORTS',
    themeColor: '#8b5cf6',
    cpmValueReais: 18.00,
    durationSeconds: 5,
  },
  {
    id: 'camp_casual_kruuj_v1',
    name: 'KRUUJ Clube de Jogos',
    advertiser: 'Portal KRUUJ',
    targetCohort: 'COHORT_CASUAL_GENERAL',
    title: 'Mais de 36 Jogos Gratuitos para Toda a Família',
    tagline: 'Novos jogos adicionados toda semana. Salve seus recordes e jogue sem instalar nada!',
    ctaText: 'EXPLORAR CATÁLOGO',
    landingUrl: '/catalog',
    badgeText: 'ORIGINAL KRUUJ',
    themeColor: '#10b981',
    cpmValueReais: 12.00,
    durationSeconds: 4,
  },
];

/**
 * Seleciona a campanha direta mais qualificada para o Cohort do usuário
 * @param cohort Perfil detectado pelo motor de afinidade
 */
export function getDirectCampaignForCohort(cohort: CohortType): DirectCampaign | null {
  // REGRA DE OURO DA INFÂNCIA: Zero publicidade comercial para o público infantil (LGPD Art. 14)
  if (cohort === 'COHORT_PROTECTED_KIDS') {
    return null;
  }

  const campaign = ACTIVE_DIRECT_CAMPAIGNS.find(c => c.targetCohort === cohort);
  if (campaign) return campaign;

  // Fallback para campanha casual geral se não encontrar segmentação específica
  return ACTIVE_DIRECT_CAMPAIGNS.find(c => c.targetCohort === 'COHORT_CASUAL_GENERAL') || null;
}

/**
 * Registra a telemetria da exibição para auditoria e repasse financeiro
 */
export async function logAdTelemetry(eventType: 'impression' | 'click' | 'complete', campaign: DirectCampaign) {
  try {
    const payload = {
      eventType: `direct_ad_${eventType}`,
      campaignId: campaign.id,
      advertiser: campaign.advertiser,
      cpmValue: campaign.cpmValueReais,
      timestamp: Date.now(),
      cohort: campaign.targetCohort,
    };

    // Salva em buffer local de telemetria
    const buffer = JSON.parse(localStorage.getItem('kruuj_ads_telemetry_v1') || '[]');
    buffer.push(payload);
    if (buffer.length > 50) buffer.shift();
    localStorage.setItem('kruuj_ads_telemetry_v1', JSON.stringify(buffer));
  } catch (e) {}
}
