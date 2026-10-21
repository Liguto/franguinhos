import React, { useState } from 'react';
import { ArrowLeft, Code, Sparkles, Shield, Zap, DollarSign, Check, Copy, FileText, Terminal, Download, Rocket } from 'lucide-react';

interface DevelopersPageProps {
  onBackToGames: () => void;
}

export const DevelopersPage: React.FC<DevelopersPageProps> = ({ onBackToGames }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sdk' | 'submit' | 'validator'>('overview');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#070913] text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0b0e1e]/90 backdrop-blur-md border-b border-indigo-500/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToGames}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-all border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar aos Jogos</span>
          </button>
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🦉</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm tracking-wider text-white">KRUUJ</span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-sm">
                for Developers
              </span>
            </div>
          </div>
        </div>

        {/* Tab Quick Selector */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visão Geral & 70/30
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'sdk' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Documentação do SDK
          </button>
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'validator' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Robô Validador
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'submit' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Submeter Jogo
          </button>
        </div>

        <button
          onClick={() => setActiveTab('submit')}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold tracking-wide shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Publicar Jogo</span>
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-10">

        {/* Hero Section */}
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-indigo-500/30 bg-gradient-to-b from-[#111633] via-[#0d1026] to-[#070913] shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Distribuição & Monetização Padrão Poki</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Leve seus jogos HTML5 para <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">milhões de jogadores</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Publique instantaneamente no portal KRUUJ. Sem taxas de entrada, com <b>70% de Revenue Share líquido</b>, saques automáticos via <b>PIX</b> em reais e suporte integral ao padrão global <b>PokiSDK</b>.
            </p>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-black text-indigo-400">70%</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">Repasse Líquido Dev</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-black text-emerald-400">R$ 200</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">Saque Mínimo via PIX</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-black text-amber-400">&lt; 10s</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">Validador Automático</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm">
                <div className="text-2xl font-black text-cyan-400">100%</div>
                <div className="text-xs text-slate-400 font-semibold mt-0.5">Compatível com Poki</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons (Mobile Visible) */}
        <div className="flex md:hidden overflow-x-auto pb-2 gap-2 text-xs font-bold border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === 'sdk' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            SDK Docs
          </button>
          <button
            onClick={() => setActiveTab('validator')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === 'validator' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            Robô Validador
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap ${activeTab === 'submit' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
          >
            Submeter Jogo
          </button>
        </div>

        {/* TAB 1: VISÃO GERAL & MODELO DE NEGÓCIOS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Modelo 70/30 Sem Surpresas</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Você recebe 70% de toda a receita líquida gerada pelos anúncios exibidos dentro do seu jogo (intersticiais, banners e vídeos recompensados). Os repasses são calculados mensalmente e pagos via PIX em reais.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-2xl">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Retrocompatível com PokiSDK</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Já publicou na Poki ou no CrazyGames? Não precisa alterar nada! Nosso SDK é 100% espelhado com a Poki API (<code className="text-indigo-300">window.PokiSDK = window.KruujSDK</code>). Basta subir sua build.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-3 hover:border-indigo-500/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center text-2xl">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white">Privacidade & LGPD Nativa</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Toda a telemetria do portal é first-party e anônima. Nenhuma informação pessoal ou CPF de jogador é coletada, protegendo seu jogo contra processos regulatórios e garantindo conformidade com a LGPD.
                </p>
              </div>
            </div>

            {/* Checklist de Requisitos do Processo 001 */}
            <div className="p-6 rounded-2xl bg-[#0c0f24] border border-indigo-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">Requisitos Obrigatórios para Aprovação (Manual KRUUJ-PROC-001)</h3>
                  <p className="text-xs text-slate-400">Seu jogo precisa cumprir os 5 pilares fundamentais da plataforma:</p>
                </div>
                <button
                  onClick={() => setActiveTab('validator')}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Ver Validador CLI</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <div>
                    <b className="text-white">Pacote Autocontido:</b> Tamanho máximo recomendado de 18 MB com imagens comprimidas (WebP) e áudios em MP3/OGG.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <div>
                    <b className="text-white">Mobile Responsivo:</b> Viewport travado (<code className="text-indigo-300">user-scalable=no</code>) e CSS com <code className="text-indigo-300">touch-action: none</code>.
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <div>
                    <b className="text-white">Botão de Mute Acessível:</b> Proibido som no carregamento inicial e obrigatório botão para silenciar áudio (🔊/🔇).
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-emerald-400 font-bold">✔</span>
                  <div>
                    <b className="text-white">Zona de Segurança Poki:</b> No mobile, afaste botões vitais do canto superior esquerdo (recuo de 68px do botão de voltar).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENTAÇÃO DO SDK */}
        {activeTab === 'sdk' && (
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Guia de Integração do KRUUJ SDK v1.0</h2>
              <p className="text-xs text-slate-400">
                O SDK oficial permite que o jogo se comunique com o portal de forma segura através do iframe isolado.
              </p>
            </div>

            {/* Passo 1 */}
            <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold">1</span>
                  Importe o SDK no &lt;head&gt; do seu index.html
                </h3>
                <button
                  onClick={() => handleCopy('<script src="/sdk/v1/kruuj-sdk.js"></script>', 'step1')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode === 'step1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'step1' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-emerald-300 bg-black/60 p-4 rounded-xl border border-slate-800 overflow-x-auto">
{`<script src="/sdk/v1/kruuj-sdk.js"></script>`}
              </pre>
            </div>

            {/* Passo 2 */}
            <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold">2</span>
                  Notifique o Fim do Carregamento (Loading)
                </h3>
                <button
                  onClick={() => handleCopy(`KruujSDK.init().then(() => {\n  KruujSDK.gameLoadingFinished();\n});`, 'step2')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode === 'step2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'step2' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Assim que os assets e o Canvas estiverem carregados, chame esse método para que o portal remova o loader com a corujinha.
              </p>
              <pre className="text-xs font-mono text-slate-200 bg-black/60 p-4 rounded-xl border border-slate-800 overflow-x-auto">
{`KruujSDK.init().then(() => {
  KruujSDK.gameLoadingFinished(); // Libera o jogo no portal
});`}
              </pre>
            </div>

            {/* Passo 3 */}
            <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold">3</span>
                  Marque Início e Término da Gameplay Ativa
                </h3>
                <button
                  onClick={() => handleCopy(`// Início da partida\nKruujSDK.gameplayStart();\n\n// Game Over, Vitória ou Pausa\nKruujSDK.gameplayStop();`, 'step3')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode === 'step3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'step3' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-200 bg-black/60 p-4 rounded-xl border border-slate-800 overflow-x-auto">
{`// Quando o jogador clica em "JOGAR" ou começa a partida:
KruujSDK.gameplayStart();

// Quando o jogador perde, vence a fase ou pausa o jogo:
KruujSDK.gameplayStop();`}
              </pre>
            </div>

            {/* Passo 4 */}
            <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-indigo-300 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs text-indigo-400 font-bold">4</span>
                  Vídeo Recompensado para Reviver (Rewarded Ad)
                </h3>
                <button
                  onClick={() => handleCopy(`function assistirVideoParaReviver() {\n  KruujSDK.rewardedBreak(() => {\n    // Pausar sons do jogo\n  }).then((sucesso) => {\n    if (sucesso) {\n      jogador.vidas = 3;\n    }\n  });\n}`, 'step4')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedCode === 'step4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'step4' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-200 bg-black/60 p-4 rounded-xl border border-slate-800 overflow-x-auto">
{`function assistirVideoParaReviver() {
  KruujSDK.rewardedBreak(() => {
    // Pausar sons do jogo enquanto assiste ao anúncio
  }).then((sucesso) => {
    if (sucesso) {
      jogador.vidas = 3; // Recompensa concedida!
    }
  });
}`}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: ROBÔ VALIDADOR LOCAL */}
        {activeTab === 'validator' && (
          <div className="space-y-6 text-left">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Robô Validador Automatizado (CLI)</h2>
              <p className="text-xs text-slate-400">
                Audite seu jogo localmente no seu computador antes de submeter. O robô informa na hora se o jogo atende aos critérios do Processo 001.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0f1329] border border-slate-800 space-y-4">
              <h3 className="text-sm font-extrabold text-white">Como rodar na sua máquina em 2 passos:</h3>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400">1. Baixe o script de validação oficial:</div>
                  <p className="text-xs text-slate-400">
                    O script é zero-dependência e roda direto com o Node.js puro.
                  </p>
                  <a
                    href="/scripts/check-game.js"
                    download="check-game.js"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Baixar check-game.js</span>
                  </a>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-indigo-400">2. Execute no CMD ou Terminal apontando para o seu jogo:</div>
                  <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto">
node check-game.js ./pasta-do-seu-jogo
                  </pre>
                  <p className="text-xs text-slate-400">
                    O validador audita viewport, bloqueio de rolagem, integridade de assets, conformidade com o SDK e limites de peso.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SUBMETER JOGO */}
        {activeTab === 'submit' && (
          <div className="max-w-2xl mx-auto text-left">
            {submitSuccess ? (
              <div className="p-8 rounded-3xl bg-[#0f1329] border border-indigo-500/30 text-center space-y-4">
                <div className="text-5xl">🎉</div>
                <h3 className="text-xl font-black text-white">Jogo Recebido na Esteira de Homologação!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Recebemos a submissão do jogo <b>{formData.title}</b>. O robô validador iniciou a auditoria de QA e você receberá a aprovação no e-mail <b>{formData.email}</b>.
                </p>
                <button
                  onClick={() => { setSubmitSuccess(false); onBackToGames(); }}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Voltar ao Catálogo KRUUJ
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8 rounded-3xl bg-[#0f1329] border border-slate-800 space-y-5">
                <div>
                  <h2 className="text-xl font-black text-white">Ficha de Submissão de Jogo</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Preencha os dados técnicos para iniciar a homologação e o contrato de repasse 70/30.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Título Oficial do Jogo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Space Asteroids"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Slug Provisório (URL) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: space-asteroids"
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Estúdio ou Autor *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Studio Pixel BR"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">E-mail para Notificações *</label>
                    <input
                      type="email"
                      required
                      placeholder="dev@studio.com.br"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Chave PIX para Repasse 70% *</label>
                    <input
                      type="text"
                      required
                      placeholder="CPF, CNPJ, E-mail ou Telefone"
                      value={formData.pixKey}
                      onChange={e => setFormData({ ...formData, pixKey: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Categoria Principal</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none transition-colors"
                    >
                      <option>Raciocínio & Sênior Play</option>
                      <option>Ação & Arcade</option>
                      <option>Puzzle & Match</option>
                      <option>Casual & Família</option>
                      <option>Infantil / Educativo</option>
                    </select>
                  </div>
                </div>

                {/* Upload Box */}
                <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-colors bg-slate-950/60">
                  <div className="text-3xl mb-2">📦</div>
                  <p className="text-xs font-bold text-white">Arraste a build do jogo (.ZIP) aqui</p>
                  <p className="text-[11px] text-slate-400 mt-1">O pacote deve conter index.html, README.md, CHANGELOG.md e LICENSES.md (máx. 18 MB)</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onBackToGames}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-extrabold tracking-wide transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                  >
                    {submitting ? 'Auditoria em andamento...' : 'Enviar Jogo para Homologação'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
