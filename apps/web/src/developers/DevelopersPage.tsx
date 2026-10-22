import React, { useState } from 'react';
import { 
  ArrowLeft, Code, Sparkles, Shield, Zap, DollarSign, Check, Copy, 
  Terminal, Download, Rocket, Cpu, CheckCircle2, FileCode, Users, 
  ExternalLink, ChevronRight, Layers, Smartphone
} from 'lucide-react';

interface DevelopersPageProps {
  onBackToGames: () => void;
}

export const DevelopersPage: React.FC<DevelopersPageProps> = ({ onBackToGames }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sdk' | 'validator' | 'submit'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    <div className="min-h-screen w-full bg-[#080E1A] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* =========================================================================
          1. HEADER DEDICADO DO DEVELOPER HUB (Padrão Stripe / Poki Devs)
          ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0A1020]/95 backdrop-blur-xl border-b border-indigo-500/20 px-4 sm:px-8 py-3.5 transition-all shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Voltar */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button
              onClick={onBackToGames}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-extrabold transition-all border border-white/10 hover:border-white/20 hover:-translate-x-0.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao Catálogo</span>
            </button>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <span className="text-2xl filter drop-shadow">🦉</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm sm:text-base tracking-wider text-white">KRUUJ</span>
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm tracking-wide">
                    Developers
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SDK v1.0 • Poki Standard Ativo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seletor de Abas Desktop (Pill Switcher) */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#0E1528] p-1.5 rounded-full border border-slate-800 text-xs font-extrabold shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visão Geral & 70/30
            </button>
            <button
              onClick={() => setActiveTab('sdk')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'sdk'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Documentação do SDK
            </button>
            <button
              onClick={() => setActiveTab('validator')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'validator'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Robô Validador
            </button>
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-1.5 rounded-full transition-all ${
                activeTab === 'submit'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Submeter Jogo
            </button>
          </nav>

          {/* CTA Principal */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('submit')}
              className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white text-xs font-black tracking-wide shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Publicar Jogo</span>
            </button>
          </div>

        </div>
      </header>

      {/* =========================================================================
          2. HERO SECTION DE ALTO IMPACTO (BENTO GRID + GRADIENTE CÓSMICO)
          ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 border-b border-indigo-500/10">
        {/* Glows de Fundo */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-black uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>ECOSSISTEMA OFICIAL KRUUJ • REVENUE SHARE 70/30 • PIX EM REAIS</span>
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
            Publique seus jogos web para <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">milhões de jogadores</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            A forma mais rápida e lucrativa de monetizar jogos HTML5 no Brasil. Sem taxas abusivas de entrada, com <b>70% de repasse líquido direto no seu PIX</b>, padrão PokiSDK nativo e homologação automatizada em segundos.
          </p>

          {/* BENTO GRID DE 4 KPIS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4">
            
            <div className="p-4 rounded-2xl bg-[#0E1528]/80 border border-indigo-500/20 backdrop-blur-md text-left space-y-1 shadow-lg hover:border-indigo-500/40 transition-all">
              <div className="text-xs font-bold text-slate-400">Divisão de Anúncios</div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">70% Líquido</div>
              <div className="text-[11px] text-slate-400 leading-snug">Você recebe 70% de toda a receita de publicidade do seu jogo.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1528]/80 border border-emerald-500/20 backdrop-blur-md text-left space-y-1 shadow-lg hover:border-emerald-500/40 transition-all">
              <div className="text-xs font-bold text-slate-400">Repasses Nacionais</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">Via PIX</div>
              <div className="text-[11px] text-slate-400 leading-snug">Saques automáticos em reais a partir de R$ 200,00 sem taxas.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1528]/80 border border-amber-500/20 backdrop-blur-md text-left space-y-1 shadow-lg hover:border-amber-500/40 transition-all">
              <div className="text-xs font-bold text-slate-400">Validador de Código</div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">&lt; 10s</div>
              <div className="text-[11px] text-slate-400 leading-snug">Robô CLI próprio que audita e emite selo de aprovação instantâneo.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E1528]/80 border border-cyan-500/20 backdrop-blur-md text-left space-y-1 shadow-lg hover:border-cyan-500/40 transition-all">
              <div className="text-xs font-bold text-slate-400">Padrão de Mercado</div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400">100% Poki</div>
              <div className="text-[11px] text-slate-400 leading-snug">Se o seu jogo já funciona na Poki, roda no KRUUJ sem alterações.</div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. SELETOR DE ABAS MOBILE & SUB-NAV
          ========================================================================= */}
      <div className="lg:hidden px-4 pt-4 pb-2 bg-[#0A1020] border-b border-slate-800">
        <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Visão Geral & 70/30
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'sdk' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400'
            }`}
          >
            SDK Docs
          </button>
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'validator' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Robô Validador CLI
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
              activeTab === 'submit' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Submeter Jogo
          </button>
        </div>
      </div>

      {/* =========================================================================
          4. CONTEÚDO PRINCIPAL DAS ABAS
          ========================================================================= */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-10">

        {/* -----------------------------------------------------------------------
            ABA 1: VISÃO GERAL & PARCERIA 70/30
            ----------------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-10 text-left">
            
            {/* Como funciona o fluxo de receita */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl bg-[#0E1528] border border-slate-800 space-y-3.5 hover:border-indigo-500/40 transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl font-black">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Monetização de Alto CPM</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Seus jogos exibem anúncios no momento certo (intersticiais de pausa, game over e rewarded ads voluntários). A KRUUJ combina leilões globais com anunciantes diretos de alto valor (como MedSênior a CPM de até R$ 38,00).
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0E1528] border border-slate-800 space-y-3.5 hover:border-cyan-500/40 transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl font-black">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Compatível com PokiSDK</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Se seu estúdio já publica na Poki ou no CrazyGames, o jogo já está 100% pronto. Nosso SDK espelha os comandos <code className="text-cyan-300">gameLoadingFinished</code>, <code className="text-cyan-300">gameplayStart</code> e <code className="text-cyan-300">commercialBreak</code> sem refatoração.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#0E1528] border border-slate-800 space-y-3.5 hover:border-pink-500/40 transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-2xl font-black">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Proteção e LGPD First-Party</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  Zero coleta de dados sensíveis ou CPF de usuários. Os jogos rodam em contêineres sandbox seguros, protegendo os direitos autorais da sua obra e garantindo conformidade jurídica completa.
                </p>
              </div>

            </div>

            {/* Comparativo de Plataformas */}
            <div className="rounded-3xl bg-[#0A1020] border border-indigo-500/20 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">Por que publicar na KRUUJ?</h3>
                <p className="text-xs text-slate-400">Veja o comparativo frente a lojas tradicionais e portais internacionais:</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                  <div className="font-black text-indigo-400 text-sm">KRUUJ for Developers</div>
                  <div className="text-slate-300">• <b>70% de repasse líquido</b></div>
                  <div className="text-slate-300">• Pagamento via <b>PIX em Reais</b></div>
                  <div className="text-slate-300">• Saque mínimo de <b>R$ 200,00</b></div>
                  <div className="text-slate-300">• Validador de código em <b>10 segundos</b></div>
                  <div className="text-slate-300">• Suporte técnico nativo em português</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-slate-400">
                  <div className="font-bold text-slate-300 text-sm">Lojas Tradicionais (App Store / Play)</div>
                  <div>• Taxa de inscrição anual/única ($25 a $99)</div>
                  <div>• Repasse menor (70% ou 85% pós taxas)</div>
                  <div>• Retenção de câmbio e IOF internacional</div>
                  <div>• Processos manuais de revisão de dias</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-slate-400">
                  <div className="font-bold text-slate-300 text-sm">Portais Genéricos</div>
                  <div>• Divisão opaca de 50% ou menor</div>
                  <div>• Pagamento via Wire / PayPal com taxas</div>
                  <div>• Demora de aprovação e sem suporte</div>
                  <div>• CPM baixo sem anúncios diretos</div>
                </div>
              </div>
            </div>

            {/* Requisitos Obrigatórios do Processo 001 */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">Checklist de Homologação (KRUUJ-PROC-001)</h3>
                  <p className="text-xs text-slate-400">Antes de submeter, garanta que seu jogo cumpre as 4 regras de ouro:</p>
                </div>
                <button
                  onClick={() => setActiveTab('validator')}
                  className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold transition-all border border-indigo-500/20 flex items-center gap-1.5 w-fit"
                >
                  <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Testar com o Validador</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <b className="text-white">Pacote Autocontido (máx 18 MB):</b>
                    <p className="text-slate-400 leading-normal">Imagens em WebP, áudios comprimidos (128kbps) e caminhos relativos de assets.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <b className="text-white">Mobile First & Sem Scroll:</b>
                    <p className="text-slate-400 leading-normal">Viewport travado (<code className="text-indigo-300">user-scalable=no</code>) e CSS com <code className="text-indigo-300">touch-action: none</code>.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <b className="text-white">Áudio com Botão de Mute:</b>
                    <p className="text-slate-400 leading-normal">Sem autoplay na abertura da página e com botão de silenciar som acessível na interface.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <b className="text-white">Zona de Segurança Mobile (68px):</b>
                    <p className="text-slate-400 leading-normal">Afaste botões vitais do canto superior esquerdo para não colidir com o botão de retorno do portal.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            ABA 2: DOCUMENTAÇÃO DO KRUUJ SDK
            ----------------------------------------------------------------------- */}
        {activeTab === 'sdk' && (
          <div className="space-y-8 text-left">
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Code className="w-3.5 h-3.5" />
                <span>INTEGRAÇÃO TÉCNICA EM 4 PASSOS</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Manual do Desenvolvedor — KRUUJ SDK</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                O SDK do KRUUJ roda dentro do iframe do seu jogo e cuida da comunicação com o portal, sincronização de loading e exibição de comerciais.
              </p>
            </div>

            {/* Passo 1 */}
            <div className="rounded-3xl bg-[#0E1528] border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-[#0A1020] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">Passo 1: Importação no index.html</span>
                </div>
                <button
                  onClick={() => handleCopy('<script src="/sdk/v1/kruuj-sdk.js"></script>', 'sdk1')}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-extrabold flex items-center gap-1.5 transition-all border border-white/10"
                >
                  {copiedCode === 'sdk1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'sdk1' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-xs text-slate-400">Adicione a tag no &lt;head&gt; do seu jogo antes dos scripts de gameplay:</p>
                <pre className="text-xs font-mono text-emerald-300 bg-[#060812] p-4 rounded-2xl border border-slate-900 overflow-x-auto">
{`<script src="/sdk/v1/kruuj-sdk.js"></script>`}
                </pre>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="rounded-3xl bg-[#0E1528] border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-[#0A1020] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">Passo 2: Notificar Fim do Carregamento (Loading Finished)</span>
                </div>
                <button
                  onClick={() => handleCopy(`KruujSDK.init().then(() => {\n  KruujSDK.gameLoadingFinished();\n});`, 'sdk2')}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-extrabold flex items-center gap-1.5 transition-all border border-white/10"
                >
                  {copiedCode === 'sdk2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'sdk2' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-xs text-slate-400">Assim que imagens, sons e o Canvas estiverem prontos:</p>
                <pre className="text-xs font-mono text-cyan-300 bg-[#060812] p-4 rounded-2xl border border-slate-900 overflow-x-auto">
{`KruujSDK.init().then(() => {
  KruujSDK.gameLoadingFinished(); // Libera a tela do portal
});`}
                </pre>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="rounded-3xl bg-[#0E1528] border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-[#0A1020] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">Passo 3: Início e Encerramento de Partidas (Analytics)</span>
                </div>
                <button
                  onClick={() => handleCopy(`// Quando o jogador clica em "JOGAR" ou começa a partida:\nKruujSDK.gameplayStart();\n\n// Quando ocorre Game Over, Vitória ou Pausa:\nKruujSDK.gameplayStop();`, 'sdk3')}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-extrabold flex items-center gap-1.5 transition-all border border-white/10"
                >
                  {copiedCode === 'sdk3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'sdk3' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-xs text-slate-400">É assim que calculamos o tempo jogado para auditoria e repasse financeiro:</p>
                <pre className="text-xs font-mono text-slate-200 bg-[#060812] p-4 rounded-2xl border border-slate-900 overflow-x-auto">
{`// Quando o jogador clica em "JOGAR" ou começa a partida:
KruujSDK.gameplayStart();

// Quando ocorre Game Over, Vitória ou Pausa:
KruujSDK.gameplayStop();`}
                </pre>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="rounded-3xl bg-[#0E1528] border border-slate-800 overflow-hidden shadow-xl">
              <div className="px-6 py-4 bg-[#0A1020] border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-bold text-slate-300">Passo 4: Vídeos Recompensados para Reviver (Rewarded Ads)</span>
                </div>
                <button
                  onClick={() => handleCopy(`function assistirVideoParaReviver() {\n  KruujSDK.rewardedBreak(() => {\n    // Pausar sons do jogo enquanto o comercial é assistido\n  }).then((sucesso) => {\n    if (sucesso) {\n      jogador.vidas = 3; // Recompensa concedida!\n    }\n  });\n}`, 'sdk4')}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-extrabold flex items-center gap-1.5 transition-all border border-white/10"
                >
                  {copiedCode === 'sdk4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'sdk4' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-xs text-slate-400">Ofereça vidas ou moedas extras com anúncios voluntários de alta conversão:</p>
                <pre className="text-xs font-mono text-purple-300 bg-[#060812] p-4 rounded-2xl border border-slate-900 overflow-x-auto">
{`function assistirVideoParaReviver() {
  KruujSDK.rewardedBreak(() => {
    // Pausar sons do jogo enquanto o comercial é assistido
  }).then((sucesso) => {
    if (sucesso) {
      jogador.vidas = 3; // Recompensa concedida!
    }
  });
}`}
                </pre>
              </div>
            </div>

          </div>
        )}

        {/* -----------------------------------------------------------------------
            ABA 3: ROBÔ VALIDADOR LOCAL (CLI)
            ----------------------------------------------------------------------- */}
        {activeTab === 'validator' && (
          <div className="space-y-8 text-left">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>AUDITORIA TÉCNICA OFICIAL KRUUJ-PROC-001</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Robô Validador Automatizado (CLI)</h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Não perca tempo esperando dias por aprovação. Nosso robô roda localmente na sua máquina em segundos e aponta com precisão qualquer ponto de melhoria antes do envio.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1528] border border-slate-800 space-y-6 shadow-xl">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">1</span>
                  <h3 className="text-sm font-black text-white">Baixe o script oficial para sua pasta de trabalho</h3>
                </div>
                <p className="text-xs text-slate-400">
                  O arquivo <code>check-game.js</code> possui zero dependências externas. Tudo o que você precisa é ter o Node.js instalado.
                </p>
                <a
                  href="/scripts/check-game.js"
                  download="check-game.js"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold tracking-wide transition-all shadow-lg shadow-indigo-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar check-game.js (Script Oficial)</span>
                </a>
              </div>

              <div className="h-px bg-slate-800" />

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black">2</span>
                  <h3 className="text-sm font-black text-white">Execute no CMD ou Terminal apontando para seu jogo</h3>
                </div>
                <pre className="text-xs font-mono text-emerald-300 bg-[#060812] p-4 rounded-2xl border border-slate-900 overflow-x-auto">
node check-game.js ./pasta-do-seu-jogo
                </pre>
                <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                  <b className="text-indigo-400">O que o robô audita em menos de 10 segundos:</b>
                  <p>• Integridade do <code className="text-slate-200">index.html</code> e ausência de caminhos locais absolutos (ex: <code className="text-slate-200">C:\</code>).</p>
                  <p>• Bloqueio de vulnerabilidades (<code className="text-slate-200">eval()</code>, <code className="text-slate-200">document.write()</code> e modais <code className="text-slate-200">alert()</code>).</p>
                  <p>• Viewport mobile com <code className="text-slate-200">user-scalable=no</code> e trava de rolagem via <code className="text-slate-200">touch-action: none</code>.</p>
                  <p>• Respeito à zona de exclusão de 68px do botão Poki no canto superior esquerdo.</p>
                  <p>• Verificação de integridade de assets (garante que nenhum arquivo dê erro 404).</p>
                  <p>• Presença dos métodos obrigatórios do KruujSDK e botão de silenciar áudio.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* -----------------------------------------------------------------------
            ABA 4: SUBMETER JOGO
            ----------------------------------------------------------------------- */}
        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto text-left">
            {submitSuccess ? (
              <div className="p-10 rounded-3xl bg-[#0E1528] border border-indigo-500/30 text-center space-y-5 shadow-2xl">
                <div className="text-6xl animate-bounce">🎉</div>
                <h3 className="text-2xl font-black text-white">Jogo Enviado para Homologação!</h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Recebemos a submissão de <b>{formData.title}</b>. O robô validador está analisando o pacote e nossa equipe editorial enviará o link de publicação e o contrato de repasse 70/30 no e-mail <b>{formData.email}</b>.
                </p>
                <button
                  onClick={() => { setSubmitSuccess(false); onBackToGames(); }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition-all shadow-lg shadow-indigo-600/30"
                >
                  Voltar ao Catálogo KRUUJ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-[#0E1528] border border-slate-800 space-y-6 shadow-2xl">
                <div>
                  <h2 className="text-2xl font-black text-white">Submeta seu Jogo para Publicação</h2>
                  <p className="text-xs text-slate-400 mt-1">Preencha a ficha técnica para darmos início ao cadastro e ativação de anúncios.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Título do Jogo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cyber Runner 2099"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#060812] border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Slug Provisório (URL) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: cyber-runner"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#060812] border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Estúdio ou Desenvolvedor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Pixel Wave Studios"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#060812] border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">E-mail de Contato *</label>
                    <input
                      type="email"
                      required
                      placeholder="contato@estudio.com.br"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#060812] border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Chave PIX para Repasses 70% *</label>
                    <input
                      type="text"
                      required
                      placeholder="CPF, CNPJ, E-mail ou Telefone"
                      value={formData.pixKey}
                      onChange={e => setFormData({ ...formData, pixKey: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#060812] border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Categoria Principal</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#060812] border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-all"
                    >
                      <option>Raciocínio & Sênior Play</option>
                      <option>Ação & Arcade</option>
                      <option>Puzzle & Match</option>
                      <option>Casual & Família</option>
                      <option>Infantil / Educativo</option>
                    </select>
                  </div>
                </div>

                {/* Upload Box Estilo SaaS */}
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-8 text-center cursor-pointer transition-all bg-[#060812]/70 group">
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">📦</div>
                  <p className="text-xs sm:text-sm font-black text-white">Arraste a build do seu jogo (.ZIP) aqui</p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    O pacote deve conter index.html, README.md, CHANGELOG.md e LICENSES.md (máximo 18 MB).
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onBackToGames}
                    className="px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white text-xs font-black tracking-wide transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    {submitting ? 'Auditoria em andamento...' : 'Enviar Jogo para Homologação'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </main>

      {/* =========================================================================
          5. FOOTER CORPORATIVO EXCLUSIVO DO DEVELOPER HUB
          ========================================================================= */}
      <footer className="border-t border-slate-800/80 bg-[#060812] py-8 px-4 sm:px-8 text-center text-xs text-slate-400 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold">
          <button onClick={() => setActiveTab('overview')} className="hover:text-indigo-400 transition-colors">Modelo 70/30</button>
          <button onClick={() => setActiveTab('sdk')} className="hover:text-indigo-400 transition-colors">Kruuj SDK</button>
          <button onClick={() => setActiveTab('validator')} className="hover:text-indigo-400 transition-colors">Validador CLI</button>
          <button onClick={() => setActiveTab('submit')} className="hover:text-indigo-400 transition-colors">Publicar Jogo</button>
          <button onClick={onBackToGames} className="text-indigo-400 hover:underline">← Voltar ao Catálogo</button>
        </div>
        <p className="text-[11px] text-slate-400">
          KRUUJ Studio Brasil • Plataforma de Jogos Web & Rede de Desenvolvedores Independentes • Suporte: <span className="text-slate-300 font-mono">devs@kruuj.com</span>
        </p>
      </footer>

    </div>
  );
};
