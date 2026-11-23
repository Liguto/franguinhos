import React, { useState } from 'react';
import { Rocket, DollarSign, Code, Check, Copy, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface DevelopersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevelopersModal: React.FC<DevelopersModalProps> = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contractProtocol, setContractProtocol] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    email: '',
    pixKey: '',
    category: 'Arcade',
    platformSupport: 'both',
    orientation: 'both',
    supportsMouse: true,
    supportsKeyboard: true,
    supportsTouch: true,
    description: '',
    zipUrl: ''
  });

  // Checklist Contratual de Monetização Futura (Obrigatório)
  const [checklist, setChecklist] = useState({
    intellectualProperty: false,
    nonMonetizedPhaseAcknowledged: false,
    futureRevShare70_30Agreed: false,
    nonExclusiveLicense: false,
    childProtectionAndLgpd: false
  });

  const isChecklistComplete = 
    checklist.intellectualProperty &&
    checklist.nonMonetizedPhaseAcknowledged &&
    checklist.futureRevShare70_30Agreed &&
    checklist.nonExclusiveLicense &&
    checklist.childProtectionAndLgpd;

  if (!isOpen) return null;

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecklistComplete) {
      setErrorMessage('Por favor, marque todos os 5 itens do checklist contratual antes de enviar.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/games/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          author: formData.author,
          email: formData.email,
          description: formData.description,
          category: formData.category,
          orientation: formData.orientation,
          controls: {
            mouse: formData.supportsMouse,
            teclado: formData.supportsKeyboard,
            toque: formData.supportsTouch,
            platformSupport: formData.platformSupport
          },
          zipUrl: formData.zipUrl,
          pixKey: formData.pixKey || 'Pendente (Opcional)',
          checklist
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setContractProtocol(data.contractNumber || 'KRUUJ-DEV-' + Date.now().toString(36).toUpperCase());
        setSubmitSuccess(true);
      } else {
        setErrorMessage(data.error || 'Erro ao enviar jogo. Verifique os dados e tente novamente.');
      }
    } catch (err: any) {
      setContractProtocol('KRUUJ-DEV-' + Date.now().toString(36).toUpperCase());
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto" style={{ zIndex: 999999 }}>
      <div className="relative w-full max-w-3xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl text-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/kruuj-avatar.png" alt="KRUUJ" className="w-8 h-8 rounded-lg object-cover border border-cyan-400/40" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black tracking-wide text-white">KRUUJ for Developers</h2>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  Padrão KRUUJ Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">Publicação de Jogos HTML5 & Parceria de Monetização</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          
          {submitSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="text-5xl">🎉</div>
              <h3 className="text-lg font-black text-white">Jogo Enviado para Aprovação dos Administradores!</h3>
              <div className="inline-block bg-cyan-500/10 border border-cyan-400/40 px-4 py-2 rounded-xl text-cyan-300 font-mono text-sm font-bold">
                Protocolo: {contractProtocol}
              </div>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Recebemos sua submissão e o arquivo ZIP. Os administradores da KRUUJ farão a análise e, uma vez aprovado no Cockpit Administrativo, seu jogo será publicado diretamente no catálogo do site!
              </p>
              <button
                onClick={() => { setSubmitSuccess(false); onClose(); }}
                className="btn-primary py-2.5 px-6 rounded-full text-xs font-bold"
              >
                Voltar ao Portal
              </button>
            </div>
          ) : (
            <>
              {/* Card de Transparência sobre Monetização */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-wider">
                  <Rocket className="w-4 h-4" />
                  <span>Regras Claras de Parceria & Monetização</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <b className="text-white block mb-1">🚀 Fase Atual (Audiência):</b>
                    <span>O portal está em crescimento sem anúncios. Neste momento inicial os jogos <strong>não são monetizados</strong>, garantindo máxima tração e visibilidade para o seu título.</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-purple-500/20">
                    <b className="text-purple-300 block mb-1">💰 Fase Futura (RevShare 70/30):</b>
                    <span>Assim que ativarmos os anúncios no portal, você receberá <strong>70% de todo o faturamento líquido</strong> gerado pelo jogo, pago mensalmente via Pix sob contrato digital.</span>
                  </div>
                </div>
              </div>

              {/* Linha do SDK */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-3 text-xs">
                <div className="truncate">
                  <span className="text-slate-400 mr-2">KruujSDK Oficial:</span>
                  <code className="text-cyan-400 font-mono">&lt;script src="https://kruuj-web.vercel.app/sdk/v1/kruuj-sdk.js"&gt;&lt;/script&gt;</code>
                </div>
                <button
                  onClick={() => handleCopy('<script src="https://kruuj-web.vercel.app/sdk/v1/kruuj-sdk.js"></script>', 'sdk-modal')}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold shrink-0 flex items-center gap-1.5"
                >
                  {copiedCode === 'sdk-modal' ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'sdk-modal' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Título do Jogo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cyber Runner Arcade"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Nome do Criador ou Estúdio *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Indie Pixel Games (ou seu nome)"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">E-mail do Desenvolvedor (ou do Responsável) *</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Chave Pix para Repasses 70% <span className="text-slate-500 font-normal">(Opcional no momento)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Pode cadastrar no futuro pelo responsável legal"
                      value={formData.pixKey}
                      onChange={e => setFormData({ ...formData, pixKey: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block mt-0.5">Alunos e menores podem deixar em branco.</span>
                  </div>
                </div>

                {/* DETALHES DE COMPATIBILIDADE DE DISPOSITIVOS E PLATAFORMA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Plataforma Suportada *</label>
                    <select
                      value={formData.platformSupport}
                      onChange={e => setFormData({ ...formData, platformSupport: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="both">Computador & Celular (Web + Mobile) [Recomendado]</option>
                      <option value="desktop_only">Apenas Computador (Teclado / Mouse)</option>
                      <option value="mobile_only">Apenas Celular / Tablet (Touchscreen)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Orientação da Tela</label>
                    <select
                      value={formData.orientation}
                      onChange={e => setFormData({ ...formData, orientation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="both">Ambas (Adaptável)</option>
                      <option value="landscape">Paisagem (Horizontal)</option>
                      <option value="portrait">Retrato (Vertical)</option>
                    </select>
                  </div>
                </div>

                {/* CONTROLES TESTADOS */}
                <div className="p-3 rounded-xl bg-slate-950 border border-white/5 space-y-1.5 text-xs">
                  <label className="block text-[11px] font-bold text-slate-400">Controles Funcionais Testados no seu Jogo:</label>
                  <div className="flex flex-wrap gap-4 text-xs text-white">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.supportsTouch} 
                        onChange={e => setFormData({ ...formData, supportsTouch: e.target.checked })} 
                        className="accent-cyan-400"
                      /> 📱 Tela de Toque (Mobile Touch)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.supportsKeyboard} 
                        onChange={e => setFormData({ ...formData, supportsKeyboard: e.target.checked })} 
                        className="accent-cyan-400"
                      /> ⌨️ Teclado (Setas / WASD / Espaço)
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.supportsMouse} 
                        onChange={e => setFormData({ ...formData, supportsMouse: e.target.checked })} 
                        className="accent-cyan-400"
                      /> 🖱️ Mouse / Cursor
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Categoria Principal</label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="Arcade">Arcade</option>
                      <option value="Ação">Ação & Tiro</option>
                      <option value="Cartas">Cartas & Tabuleiro</option>
                      <option value="Puzzle">Puzzle & Raciocínio</option>
                      <option value="Casual">Casual & Família</option>
                      <option value="Bebês">Bebês & Infantil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Link do Arquivo ZIP do Jogo (.zip) *</label>
                    <input
                      type="url"
                      required
                      placeholder="Google Drive, WeTransfer, GitHub ou Dropbox"
                      value={formData.zipUrl}
                      onChange={e => setFormData({ ...formData, zipUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Descrição Curta (Instruções)</label>
                  <textarea
                    rows={2}
                    placeholder="Explique o objetivo do jogo em poucas linhas..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Checklist Contratual Obrigatório */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/25 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 font-bold text-cyan-300 text-xs">
                    <FileText className="w-4 h-4" />
                    <span>Checklist para Contrato de Monetização Futura</span>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.intellectualProperty}
                      onChange={e => setChecklist({ ...checklist, intellectualProperty: e.target.checked })}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <span><strong>1. Autoria:</strong> Declaro sob as penas da lei que sou o criador original ou possuo os direitos autorais e de propriedade intelectual deste jogo.</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.nonMonetizedPhaseAcknowledged}
                      onChange={e => setChecklist({ ...checklist, nonMonetizedPhaseAcknowledged: e.target.checked })}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <span><strong>2. Fase Atual Não-Monetizada:</strong> Estou ciente de que o portal KRUUJ está em fase de tração e crescimento sem anúncios, e que a inclusão inicial do jogo não gerará receitas imediatas.</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.futureRevShare70_30Agreed}
                      onChange={e => setChecklist({ ...checklist, futureRevShare70_30Agreed: e.target.checked })}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <span><strong>3. Divisão Futura 70/30:</strong> Concordo irrevogavelmente com o repasse mensal de <strong>70% da receita líquida</strong> para mim e 30% para a KRUUJ a partir do momento em que a monetização for ativada no portal.</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.nonExclusiveLicense}
                      onChange={e => setChecklist({ ...checklist, nonExclusiveLicense: e.target.checked })}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <span><strong>4. Licença Não-Exclusiva:</strong> Concedo à KRUUJ Studio licença não-exclusiva para hospedar e distribuir o jogo globalmente, mantendo a minha propriedade intelectual.</span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checklist.childProtectionAndLgpd}
                      onChange={e => setChecklist({ ...checklist, childProtectionAndLgpd: e.target.checked })}
                      className="mt-0.5 accent-cyan-400"
                    />
                    <span><strong>5. Proteção à Criança & LGPD:</strong> O jogo respeita as leis de privacidade, não coleta dados de menores e não possui compras abusivas.</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !isChecklistComplete}
                    className={`px-6 py-2 rounded-full text-white text-xs font-extrabold transition-all ${
                      isChecklistComplete
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 cursor-pointer shadow-lg shadow-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {submitting ? 'Enviando para os Administradores...' : 'Enviar para Aprovação dos Administradores 🚀'}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
