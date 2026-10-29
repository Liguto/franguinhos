import React, { useState } from 'react';
import { 
  ArrowLeft, Code, Sparkles, Shield, Zap, DollarSign, Check, Copy, 
  Terminal, Download, Rocket, Cpu, CheckCircle2, FileCode, Users, 
  ExternalLink, ChevronRight, Layers, Smartphone, Play, Sliders
} from 'lucide-react';

interface DevelopersPageProps {
  onBackToGames: () => void;
}

export const DevelopersPage: React.FC<DevelopersPageProps> = ({ onBackToGames }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sdk' | 'validator' | 'submit'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Simulador de Repasse Financeiro (70/30)
  const [monthlyPlays, setMonthlyPlays] = useState<number>(150000);
  const estimatedCpm = 38.00; // CPM médio combinado (Diretos + Programática)
  const grossRevenue = (monthlyPlays / 1000) * estimatedCpm;
  const developerShare = grossRevenue * 0.70;

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    email: '',
    pixKey: '',
    category: 'Raciocínio & Sênior Play',
    engine: 'HTML5 Puro / Canvas',
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  return (
    <div className="kruuj-dev-portal">
      
      {/* =========================================================================
          1. HEADER DO DEVELOPER HUB (Padrão Stripe / Poki for Developers)
          ========================================================================= */}
      <header className="kruuj-dev-header">
        <div className="kruuj-dev-header-inner">
          
          {/* Logo & Voltar */}
          <div className="kruuj-dev-brand">
            <button
              onClick={onBackToGames}
              className="kruuj-dev-back-btn"
              title="Voltar ao portal principal"
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Voltar ao Portal</span>
            </button>

            <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.12)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="/kruuj-mascote.png" 
                alt="KRUUJ Mascote" 
                style={{ width: '32px', height: '32px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(99,102,241,0.5))' }} 
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '0.05em', color: '#ffffff' }}>KRUUJ</span>
                  <span style={{ 
                    fontSize: '0.65rem', 
                    fontWeight: 900, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.08em',
                    padding: '2px 8px', 
                    borderRadius: '9999px', 
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: '#ffffff',
                    boxShadow: '0 2px 8px rgba(99,102,241,0.35)'
                  }}>
                    FOR DEVELOPERS
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.65rem', color: '#34d399', fontWeight: 700 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                  <span>KruujSDK v1.0 • Poki-Grade Homologado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navegação entre Abas (Desktop) */}
          <nav className="kruuj-dev-tabs-nav">
            <button
              onClick={() => setActiveTab('overview')}
              className={`kruuj-dev-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
            >
              Visão Geral & 70/30
            </button>
            <button
              onClick={() => setActiveTab('sdk')}
              className={`kruuj-dev-tab-item ${activeTab === 'sdk' ? 'active' : ''}`}
            >
              Documentação do SDK
            </button>
            <button
              onClick={() => setActiveTab('validator')}
              className={`kruuj-dev-tab-item ${activeTab === 'validator' ? 'active' : ''}`}
            >
              Robô Validador CLI
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`kruuj-dev-tab-item ${activeTab === 'submit' ? 'active' : ''}`}
            >
              Publicar Jogo
            </button>
          </nav>

          {/* Botão de Ação Direta */}
          <div>
            <button
              onClick={() => setActiveTab('submit')}
              className="kruuj-dev-cta-btn"
            >
              <Rocket style={{ width: 15, height: 15 }} />
              <span>Submeter Jogo</span>
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION DE ALTO IMPACTO COM GLOW CÓSMICO
          ========================================================================= */}
      <section className="kruuj-dev-hero">
        <div className="kruuj-dev-hero-glow" />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto' }}>
          
          <div className="kruuj-dev-pill-badge">
            <Sparkles style={{ width: 14, height: 14, color: '#818cf8' }} />
            <span>ECOSSISTEMA OFICIAL KRUUJ • REVENUE SHARE 70/30 • REPASSES VIA PIX</span>
          </div>

          <h1 className="kruuj-dev-hero-title">
            Publique seus jogos web para <span className="kruuj-dev-hero-gradient-text">milhões de jogadores</span>.
          </h1>

          <p className="kruuj-dev-hero-desc">
            A plataforma mais rápida, justa e lucrativa para criadores e estúdios HTML5 no Brasil. 
            Sem taxas de entrada, com <b>70% de repasse líquido direto no seu PIX</b>, compatibilidade com o padrão PokiSDK e homologação automatizada em segundos.
          </p>

          {/* BENTO GRID DE 4 KPIS */}
          <div className="kruuj-dev-kpi-grid">
            
            <div className="kruuj-dev-kpi-card">
              <div className="kruuj-dev-kpi-label">Divisão de Anúncios</div>
              <div className="kruuj-dev-kpi-val" style={{ color: '#818cf8' }}>70% Líquido</div>
              <div className="kruuj-dev-kpi-desc">Você recebe 70% de toda a receita de publicidade gerada pelo seu jogo no portal.</div>
            </div>

            <div className="kruuj-dev-kpi-card">
              <div className="kruuj-dev-kpi-label">Repasse Sem Burocracia</div>
              <div className="kruuj-dev-kpi-val" style={{ color: '#34d399' }}>Via PIX</div>
              <div className="kruuj-dev-kpi-desc">Saques mensais em Reais (BRL) direto na sua conta bancária sem IOF ou taxas de câmbio.</div>
            </div>

            <div className="kruuj-dev-kpi-card">
              <div className="kruuj-dev-kpi-label">Auditoria Técnica</div>
              <div className="kruuj-dev-kpi-val" style={{ color: '#fbbf24' }}>&lt; 10s</div>
              <div className="kruuj-dev-kpi-desc">Robô validador de compliance emite o relatório de homologação de forma instantânea.</div>
            </div>

            <div className="kruuj-dev-kpi-card">
              <div className="kruuj-dev-kpi-label">Compatibilidade Total</div>
              <div className="kruuj-dev-kpi-val" style={{ color: '#38bdf8' }}>100% Poki</div>
              <div className="kruuj-dev-kpi-desc">Se o seu jogo roda na Poki ou no CrazyGames, ele roda no KRUUJ sem nenhuma alteração.</div>
            </div>

          </div>

          {/* SIMULADOR INTERATIVO DE REPASSE (70/30) */}
          <div className="kruuj-dev-sim-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sliders style={{ width: 20, height: 20, color: '#818cf8' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Simulador de Ganhos com Repasse 70/30
                </h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>
                CPM Médio Estimado: <b style={{ color: '#38bdf8' }}>R$ 38,00</b>
              </span>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Partidas jogadas por mês:</span>
                <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '1.05rem' }}>{monthlyPlays.toLocaleString('pt-BR')} partidas</span>
              </div>
              <input 
                type="range" 
                min="10000" 
                max="1000000" 
                step="10000" 
                value={monthlyPlays} 
                onChange={(e) => setMonthlyPlays(Number(e.target.value))}
                className="kruuj-dev-sim-slider"
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>
                <span>10.000</span>
                <span>250.000</span>
                <span>500.000</span>
                <span>1.000.000 partidas</span>
              </div>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '14px', 
              background: 'rgba(6, 10, 24, 0.7)', 
              padding: '20px', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.08)' 
            }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Receita Bruta Gerada</span>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#cbd5e1', marginTop: '4px' }}>
                  {grossRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>Seu Repasse Líquido (70%)</span>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399', marginTop: '4px' }}>
                  {developerShare.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#818cf8', background: 'rgba(99, 102, 241, 0.12)', padding: '8px 14px', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                  ⚡ Transferência direta via PIX todo dia 15 sem retenções.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          3. SUB-NAV MOBILE
          ========================================================================= */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        padding: '14px 16px', 
        background: '#090e1f', 
        borderBottom: '1px solid rgba(255,255,255,0.08)' 
      }} className="lg:hidden scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`kruuj-dev-tab-item ${activeTab === 'overview' ? 'active' : ''}`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('sdk')}
          className={`kruuj-dev-tab-item ${activeTab === 'sdk' ? 'active' : ''}`}
        >
          SDK Docs
        </button>
        <button
          onClick={() => setActiveTab('validator')}
          className={`kruuj-dev-tab-item ${activeTab === 'validator' ? 'active' : ''}`}
        >
          Validador CLI
        </button>
        <button
          onClick={() => setActiveTab('submit')}
          className={`kruuj-dev-tab-item ${activeTab === 'submit' ? 'active' : ''}`}
        >
          Submeter Jogo
        </button>
      </div>

      {/* =========================================================================
          4. CONTEÚDO PRINCIPAL DAS ABAS
          ========================================================================= */}
      <main style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '40px 24px', flex: 1 }}>

        {/* -----------------------------------------------------------------------
            ABA 1: VISÃO GERAL & PARCERIA 70/30
            ----------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', textAlign: 'left' }}>
            
            {/* Como funciona o fluxo de receita */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              <div style={{ 
                background: 'rgba(13, 20, 42, 0.75)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '24px', 
                padding: '28px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)' 
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <DollarSign style={{ width: 24, height: 24 }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
                  Monetização com Alta Conversão
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  A KRUUJ combina leilões de anúncios programáticos globais (Google AdX, Magnite) com patrocinadores diretos de alta renda (como planos de saúde MedSênior na vertical 60+ a CPM de até R$ 38,00), maximizando sua receita por partida.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(13, 20, 42, 0.75)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '24px', 
                padding: '28px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)' 
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Zap style={{ width: 24, height: 24 }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
                  Padrão PokiSDK Nativo
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Zero esforço de migração: se o seu jogo já foi compilado para a Poki, CrazyGames ou GamePix, ele roda diretamente no KRUUJ Studio sem alterar uma única linha de código. O objeto <code style={{ color: '#38bdf8' }}>window.PokiSDK</code> é emulado nativamente.
                </p>
              </div>

              <div style={{ 
                background: 'rgba(13, 20, 42, 0.75)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                borderRadius: '24px', 
                padding: '28px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.4)' 
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Shield style={{ width: 24, height: 24 }} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
                  Segurança Jurídica & LGPD
                </h3>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                  Seu código roda isolado em sandbox de alta segurança. Os contratos de publishing são transparentes, sem cessão de propriedade intelectual — o jogo permanece 100% sob a propriedade do seu estúdio.
                </p>
              </div>

            </div>

            {/* Pipeline de Publicação em 4 Passos */}
            <div style={{ 
              background: 'rgba(10, 15, 34, 0.9)', 
              border: '1px solid rgba(99, 102, 241, 0.25)', 
              borderRadius: '28px', 
              padding: '36px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5)'
            }}>
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  Como Publicar seu Jogo no KRUUJ (Pipeline em 4 Passos)
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px' }}>
                  Da sua máquina para a vitrine em menos de 24 horas:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                
                <div style={{ padding: '18px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#6366f1', color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>1</div>
                  <b style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Integre o KruujSDK</b>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Adicione a tag script e chame <code style={{ color: '#818cf8' }}>gameLoadingFinished()</code> e <code style={{ color: '#818cf8' }}>gameplayStart()</code>.
                  </p>
                </div>

                <div style={{ padding: '18px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#06b6d4', color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>2</div>
                  <b style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Rode o Validador</b>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Execute <code style={{ color: '#38bdf8' }}>node check-game.js</code> para auditar tamanho, viewport e áudio em 10s.
                  </p>
                </div>

                <div style={{ padding: '18px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#ec4899', color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>3</div>
                  <b style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Envie o ZIP</b>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Submeta o arquivo build através do formulário com seu e-mail e chave PIX cadastrada.
                  </p>
                </div>

                <div style={{ padding: '18px', borderRadius: '18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10b981', color: '#ffffff', fontWeight: 900, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>4</div>
                  <b style={{ color: '#ffffff', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>Receba 70% no PIX</b>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                    Seu jogo entra no ar no mosaico Bento Grid e os repasses mensais caem direto na sua conta.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            ABA 2: DOCUMENTAÇÃO DO KRUUJ SDK
            ----------------------------------------------------------------------- */}
        {activeTab === 'sdk' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'left' }}>
            
            <div>
              <div className="kruuj-dev-pill-badge">
                <Code style={{ width: 14, height: 14, color: '#38bdf8' }} />
                <span>GUIA TÉCNICO OFICIAL DE INTEGRAÇÃO</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '8px 0' }}>
                Documentação do KruujSDK & PokiBridge
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, maxWidth: '650px' }}>
                O KruujSDK gerencia o ciclo de vida do jogo no portal, sincroniza o término de carregamento e dispara quebras comerciais sem travar o áudio.
              </p>
            </div>

            {/* Código 1: Importação */}
            <div className="kruuj-dev-code-editor">
              <div className="kruuj-dev-code-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="kruuj-dev-code-dots">
                    <span className="kruuj-dev-code-dot" style={{ background: '#f43f5e' }} />
                    <span className="kruuj-dev-code-dot" style={{ background: '#f59e0b' }} />
                    <span className="kruuj-dev-code-dot" style={{ background: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#cbd5e1' }}>index.html — Inclusão no &lt;head&gt;</span>
                </div>
                <button
                  onClick={() => handleCopy('<script src="/sdk/v1/kruuj-sdk.js"></script>', 'sdk1')}
                  className="kruuj-dev-back-btn"
                  style={{ padding: '4px 12px', fontSize: '0.72rem' }}
                >
                  {copiedCode === 'sdk1' ? <Check style={{ width: 12, height: 12, color: '#34d399' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  <span>{copiedCode === 'sdk1' ? 'Copiado!' : 'Copiar Script'}</span>
                </button>
              </div>
              <div className="kruuj-dev-code-body">
                <span style={{ color: '#64748b' }}>&lt;!-- Importe o SDK oficial no cabeçalho antes de qualquer script do jogo --&gt;</span><br />
                <span style={{ color: '#f43f5e' }}>&lt;script</span> <span style={{ color: '#38bdf8' }}>src</span>=<span style={{ color: '#34d399' }}>"/sdk/v1/kruuj-sdk.js"</span><span style={{ color: '#f43f5e' }}>&gt;&lt;/script&gt;</span>
              </div>
            </div>

            {/* Código 2: Inicialização */}
            <div className="kruuj-dev-code-editor">
              <div className="kruuj-dev-code-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="kruuj-dev-code-dots">
                    <span className="kruuj-dev-code-dot" style={{ background: '#f43f5e' }} />
                    <span className="kruuj-dev-code-dot" style={{ background: '#f59e0b' }} />
                    <span className="kruuj-dev-code-dot" style={{ background: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#cbd5e1' }}>game.js — Fim do Carregamento (Loading Finished)</span>
                </div>
                <button
                  onClick={() => handleCopy("KruujSDK.init().then(() => {\n  KruujSDK.gameLoadingFinished();\n});", 'sdk2')}
                  className="kruuj-dev-back-btn"
                  style={{ padding: '4px 12px', fontSize: '0.72rem' }}
                >
                  {copiedCode === 'sdk2' ? <Check style={{ width: 12, height: 12, color: '#34d399' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  <span>{copiedCode === 'sdk2' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="kruuj-dev-code-body">
                <span style={{ color: '#64748b' }}>// Assim que texturas, áudios e Canvas estiverem prontos para jogar:</span><br />
                <span style={{ color: '#818cf8' }}>KruujSDK</span>.<span style={{ color: '#38bdf8' }}>init</span>().<span style={{ color: '#38bdf8' }}>then</span>(() =&gt; &#123;<br />
                &nbsp;&nbsp;<span style={{ color: '#818cf8' }}>KruujSDK</span>.<span style={{ color: '#38bdf8' }}>gameLoadingFinished</span>(); <span style={{ color: '#64748b' }}>// Desativa o loader de abertura do portal</span><br />
                &#125;);
              </div>
            </div>

            {/* Código 3: Partida & Anúncios */}
            <div className="kruuj-dev-code-editor">
              <div className="kruuj-dev-code-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="kruuj-dev-code-dots">
                    <span className="kruuj-dev-code-dot" style={{ background: '#f43f5e' }} />
                    <span className="kruuj-dev-code-dot" style={{ background: '#f59e0b' }} />
                    <span className="kruuj-dev-code-dot" style={{ background: '#10b981' }} />
                  </div>
                  <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#cbd5e1' }}>game.js — Início de Partida e Comerciais (70/30)</span>
                </div>
                <button
                  onClick={() => handleCopy("// 1. Ao iniciar a gameplay:\nKruujSDK.gameplayStart();\n\n// 2. No Game Over ou Pausa:\nKruujSDK.gameplayStop();\n\n// 3. Exibir anúncio recompensado para reviver:\nKruujSDK.rewardedBreak(() => {\n  pauseAudio();\n}).then((rewardGiven) => {\n  resumeAudio();\n  if (rewardGiven) {\n    player.lives = 3;\n  }\n});", 'sdk3')}
                  className="kruuj-dev-back-btn"
                  style={{ padding: '4px 12px', fontSize: '0.72rem' }}
                >
                  {copiedCode === 'sdk3' ? <Check style={{ width: 12, height: 12, color: '#34d399' }} /> : <Copy style={{ width: 12, height: 12 }} />}
                  <span>{copiedCode === 'sdk3' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="kruuj-dev-code-body">
                <span style={{ color: '#64748b' }}>// 1. Quando o jogador começa a partida (para telemetria e tempo jogado):</span><br />
                <span style={{ color: '#818cf8' }}>KruujSDK</span>.<span style={{ color: '#38bdf8' }}>gameplayStart</span>();<br /><br />
                <span style={{ color: '#64748b' }}>// 2. No Game Over, Vitória ou Pausa de Fase:</span><br />
                <span style={{ color: '#818cf8' }}>KruujSDK</span>.<span style={{ color: '#38bdf8' }}>gameplayStop</span>();<br /><br />
                <span style={{ color: '#64748b' }}>// 3. Recompensa opcional para reviver (Rewarded Ad de alta monetização):</span><br />
                <span style={{ color: '#818cf8' }}>KruujSDK</span>.<span style={{ color: '#38bdf8' }}>rewardedBreak</span>(() =&gt; &#123; <span style={{ color: '#64748b' }}>/* Pausar sons */</span> &#125;).<span style={{ color: '#38bdf8' }}>then</span>((<span style={{ color: '#f59e0b' }}>rewardGiven</span>) =&gt; &#123;<br />
                &nbsp;&nbsp;<span style={{ color: '#f43f5e' }}>if</span> (rewardGiven) &#123;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;player.lives = <span style={{ color: '#38bdf8' }}>3</span>; <span style={{ color: '#64748b' }}>// Recompensa liberada!</span><br />
                &nbsp;&nbsp;&#125;<br />
                &#125;);
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            ABA 3: ROBÔ VALIDADOR LOCAL (CLI)
            ----------------------------------------------------------------------- */}
        {activeTab === 'validator' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', textAlign: 'left' }}>
            
            <div>
              <div className="kruuj-dev-pill-badge">
                <Terminal style={{ width: 14, height: 14, color: '#fbbf24' }} />
                <span>HOMOLOGAÇÃO AUTOMATIZADA EM 10 SEGUNDOS</span>
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', margin: '8px 0' }}>
                Robô Validador de Compliance (CLI)
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, maxWidth: '650px' }}>
                Audite seu jogo localmente antes de enviar. O script oficial verifica tamanho do pacote, viewport mobile, colisão de botões e ausência de vulnerabilidades de segurança.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(14, 21, 45, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '24px', 
              padding: '32px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.45)' 
            }}>
              
              <div style={{ marginBottom: '24px' }}>
                <b style={{ color: '#ffffff', fontSize: '1rem', display: 'block', marginBottom: '6px' }}>1. Baixe o Script Oficial</b>
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>
                  Script em Node.js com zero dependências externas.
                </p>
                <div style={{ marginTop: '14px' }}>
                  <a
                    href="/scripts/check-game.js"
                    download="check-game.js"
                    className="kruuj-dev-cta-btn"
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}
                  >
                    <Download style={{ width: 15, height: 15 }} />
                    <span>Baixar check-game.js (Versão Oficial)</span>
                  </a>
                </div>
              </div>

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '24px 0' }} />

              <div>
                <b style={{ color: '#ffffff', fontSize: '1rem', display: 'block', marginBottom: '6px' }}>2. Execute o Teste no seu Terminal</b>
                <div className="kruuj-dev-code-editor" style={{ marginTop: '12px', marginBottom: '16px' }}>
                  <div className="kruuj-dev-code-body" style={{ color: '#34d399' }}>
                    $ node check-game.js ./pasta-do-seu-jogo
                  </div>
                </div>

                <div style={{ 
                  background: 'rgba(6, 10, 24, 0.6)', 
                  border: '1px solid rgba(255, 255, 255, 0.08)', 
                  borderRadius: '16px', 
                  padding: '20px',
                  fontSize: '0.82rem',
                  lineHeight: 1.7,
                  color: '#cbd5e1'
                }}>
                  <b style={{ color: '#fbbf24', display: 'block', marginBottom: '8px' }}>O que o Robô audita automaticamente:</b>
                  <div>✓ Pacote autocontido de no máximo 18 MB com caminhos relativos.</div>
                  <div>✓ Viewport mobile com <code style={{ color: '#818cf8' }}>user-scalable=no</code> e sem rolagem de página.</div>
                  <div>✓ Desvio de segurança de 68px no topo para não colidir com o botão flutuante KRUUJ.</div>
                  <div>✓ Inicialização correta de <code style={{ color: '#818cf8' }}>KruujSDK.gameLoadingFinished()</code>.</div>
                  <div>✓ Áudio compatível com WebAudio sem bloqueio de autoplay em navegadores modernos.</div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            ABA 4: SUBMETER JOGO
            ----------------------------------------------------------------------- */}
        {activeTab === 'submit' && (
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'left' }}>
            {submitSuccess ? (
              <div style={{ 
                background: 'rgba(14, 21, 45, 0.85)', 
                border: '1px solid rgba(52, 211, 153, 0.3)', 
                borderRadius: '28px', 
                padding: '48px 32px', 
                textAlign: 'center',
                boxShadow: '0 16px 40px rgba(0,0,0,0.5)'
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🚀</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginBottom: '10px' }}>
                  Jogo Enviado para Homologação!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 24px' }}>
                  Recebemos os dados de <b>{formData.title}</b>. O robô validador está checando os arquivos e nossa equipe de curadoria entrará em contato pelo e-mail <b>{formData.email}</b> em até 24 horas.
                </p>
                <button
                  onClick={() => { setSubmitSuccess(false); onBackToGames(); }}
                  className="kruuj-dev-cta-btn"
                >
                  Voltar ao Portal Principal
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="kruuj-dev-form-card">
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    Ficha Técnica de Homologação
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '4px' }}>
                    Preencha os dados do seu jogo para cadastrarmos na vitrine e gerarmos o contrato 70/30.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>Título Oficial *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Neon Cyber Overdrive"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="kruuj-dev-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>Slug Provisório (URL) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: neon-cyber"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="kruuj-dev-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>Estúdio ou Desenvolvedor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pixel Wave Studios"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="kruuj-dev-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>E-mail de Contato *</label>
                    <input
                      type="email"
                      required
                      placeholder="contato@estudio.com.br"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="kruuj-dev-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>Chave PIX para Repasses 70% *</label>
                    <input
                      type="text"
                      required
                      placeholder="CPF, CNPJ, E-mail ou Aleatória"
                      value={formData.pixKey}
                      onChange={e => setFormData({ ...formData, pixKey: e.target.value })}
                      className="kruuj-dev-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>Categoria no Portal</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="kruuj-dev-input"
                    >
                      <option>Raciocínio & Sênior Play</option>
                      <option>Ação & Arcade</option>
                      <option>Puzzle & Match</option>
                      <option>Casual & Família</option>
                      <option>Infantil & Educativo</option>
                    </select>
                  </div>
                </div>

                {/* Caixa de Upload Drag & Drop */}
                <div className="kruuj-dev-upload-box" style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
                  <b style={{ color: '#ffffff', fontSize: '0.95rem', display: 'block', marginBottom: '4px' }}>
                    Arraste a build do seu jogo (.ZIP) aqui
                  </b>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                    O arquivo ZIP deve conter index.html na raiz com assets em caminhos relativos (máximo 18 MB).
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button
                    type="button"
                    onClick={onBackToGames}
                    className="kruuj-dev-back-btn"
                    style={{ padding: '10px 20px' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="kruuj-dev-cta-btn"
                  >
                    {submitting ? 'Auditoria em andamento...' : 'Enviar Jogo para Homologação 🚀'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </main>

      {/* =========================================================================
          5. FOOTER CORPORATIVO DO DEVELOPER HUB
          ========================================================================= */}
      <footer style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
        background: '#04060c', 
        padding: '30px 24px', 
        textAlign: 'center', 
        fontSize: '0.75rem', 
        color: '#64748b' 
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px', fontWeight: 700, marginBottom: '14px' }}>
          <button onClick={() => setActiveTab('overview')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Modelo 70/30</button>
          <button onClick={() => setActiveTab('sdk')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>KruujSDK Docs</button>
          <button onClick={() => setActiveTab('validator')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Validador CLI</button>
          <button onClick={() => setActiveTab('submit')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Submeter Jogo</button>
          <button onClick={onBackToGames} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer' }}>← Voltar ao Portal</button>
        </div>
        <p style={{ margin: 0 }}>
          KRUUJ Studio Brasil • Plataforma de Jogos Web & Rede de Desenvolvedores Independentes • Suporte a Criadores: <span style={{ color: '#818cf8', fontFamily: 'monospace' }}>devs@kruuj.com</span>
        </p>
      </footer>

    </div>
  );
};
