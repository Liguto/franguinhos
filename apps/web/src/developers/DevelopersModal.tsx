import React, { useState } from 'react';

interface DevelopersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevelopersModal: React.FC<DevelopersModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sdk' | 'submit'>('overview');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    email: '',
    pixKey: '',
    category: 'Raciocínio',
    engine: 'HTML5 Puro / Canvas',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto" style={{ zIndex: 999999 }}>
      <div className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦉</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-wide text-white">KRUUJ for Developers</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Poki Standard
                </span>
              </div>
              <p className="text-xs text-slate-400">Plataforma oficial de publicação, homologação e monetização de jogos HTML5</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/30 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🌟 Visão Geral & Modelo 70/30
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'sdk'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🔌 Documentação do SDK
          </button>
          <button
            onClick={() => setActiveTab('submit')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
              activeTab === 'submit'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🚀 Enviar Jogo para Homologação
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-950/60 to-purple-950/40 border border-indigo-500/30">
                <h3 className="text-base font-extrabold text-white mb-2">Monetize seus jogos do primeiro minuto.</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  O KRUUJ é o portal de jogos instantâneos que mais cresce no Brasil. Nosso ecossistema distribui seu jogo em desktop e mobile sem necessidade de download, com integração em tempo real a anúncios de alto rendimento (AdSense, NitroPay e campanhas diretas exclusivas).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="text-xl mb-1">💰</div>
                  <h4 className="text-sm font-bold text-white">70% de Revenue Share</h4>
                  <p className="text-xs text-slate-400 mt-1">Você recebe 70% de toda a receita líquida gerada pelos anúncios dentro do seu jogo.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="text-xl mb-1">⚡</div>
                  <h4 className="text-sm font-bold text-white">Pagamentos via PIX</h4>
                  <p className="text-xs text-slate-400 mt-1">Saques automáticos em reais a partir de R$ 200,00 direto na sua chave PIX, sem burocracia internacional.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="text-xl mb-1">🛡️</div>
                  <h4 className="text-sm font-bold text-white">Padrão Poki Nativo</h4>
                  <p className="text-xs text-slate-400 mt-1">Seu jogo já funciona na Poki? Ele roda no KRUUJ sem precisar reescrever nenhuma linha de código.</p>
                </div>
              </div>

              {/* Tabela de Critérios de Qualidade */}
              <div className="border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200">Requisitos Técnicos de Publicação (KRUUJ-PROC-001)</h4>
                </div>
                <div className="p-4 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✔</span>
                    <span><b>Pacote Autocontido:</b> Tamanho máximo recomendado de 18 MB com imagens comprimidas (WebP).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✔</span>
                    <span><b>Mobile First:</b> Viewport travado (<code className="text-indigo-300">user-scalable=no</code>) e CSS com <code className="text-indigo-300">touch-action: none</code>.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✔</span>
                    <span><b>Áudio com Mute:</b> Proibido som no carregamento inicial (autoplay) e obrigatório botão de silenciar (🔊/🔇).</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✔</span>
                    <span><b>Validação Automatizada:</b> Todo jogo passa pelo robô <code className="text-indigo-300">check-game.js</code> antes de ir ao ar.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SDK DOCS */}
          {activeTab === 'sdk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h4 className="text-xs font-bold text-indigo-400 mb-1">1. Importação no &lt;head&gt; do index.html:</h4>
                <pre className="text-[11px] font-mono text-emerald-300 bg-slate-900 p-3 rounded-lg overflow-x-auto border border-slate-800">
{`<script src="/sdk/v1/kruuj-sdk.js"></script>`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h4 className="text-xs font-bold text-indigo-400 mb-1">2. Ciclo de Vida Obrigatório (Loading e Gameplay):</h4>
                <pre className="text-[11px] font-mono text-slate-200 bg-slate-900 p-3 rounded-lg overflow-x-auto border border-slate-800">
{`// Ao concluir o carregamento de texturas e sons:
KruujSDK.init().then(() => {
  KruujSDK.gameLoadingFinished(); // Libera a tela de loading do portal
});

// Quando o jogador clicar em "JOGAR" ou iniciar a rodada:
KruujSDK.gameplayStart();

// Quando der Game Over, Vitória ou Pausa:
KruujSDK.gameplayStop();`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                <h4 className="text-xs font-bold text-indigo-400 mb-1">3. Comerciais e Vídeos Recompensados (Opcional):</h4>
                <pre className="text-[11px] font-mono text-slate-200 bg-slate-900 p-3 rounded-lg overflow-x-auto border border-slate-800">
{`// Vídeo de recompensa para reviver ou dar moedas (Rewarded Ad)
function renascerJogador() {
  KruujSDK.rewardedBreak(() => {
    // Pausar sons do jogo enquanto assiste ao anúncio
  }).then((assistiuCompleto) => {
    if (assistiuCompleto) {
      jogador.vidas = 3; // Recompensa liberada!
    }
  });
}`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: SUBMISSÃO */}
          {activeTab === 'submit' && (
            <div>
              {submitSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="text-5xl">🎉</div>
                  <h3 className="text-lg font-black text-white">Jogo Enviado para a Esteira de Homologação!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Recebemos os dados do jogo <b>{formData.title}</b>. Nosso robô validador automatizado (<code>check-game.js</code>) iniciou os testes de QA e você receberá o retorno no e-mail <b>{formData.email}</b>.
                  </p>
                  <button
                    onClick={() => { setSubmitSuccess(false); onClose(); }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
                  >
                    Voltar ao Portal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Título do Jogo *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Space Asteroids"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Estúdio ou Autor *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Studio Pixel BR"
                        value={formData.author}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">E-mail de Contato *</label>
                      <input
                        type="email"
                        required
                        placeholder="dev@studio.com.br"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Chave PIX para Repasse 70/30 *</label>
                      <input
                        type="text"
                        required
                        placeholder="CPF, CNPJ, E-mail ou Aleatória"
                        value={formData.pixKey}
                        onChange={e => setFormData({ ...formData, pixKey: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Categoria Principal</label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-indigo-500 focus:outline-none"
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
                  <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40">
                    <div className="text-3xl mb-2">📦</div>
                    <p className="text-xs font-bold text-white">Arraste a build do jogo (.ZIP) aqui</p>
                    <p className="text-[11px] text-slate-400 mt-1">O pacote deve conter index.html, README.md, CHANGELOG.md e LICENSES.md (máx. 18 MB)</p>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-2"
                    >
                      {submitting ? 'Auditoria em andamento...' : 'Submeter e Iniciar Validador'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
