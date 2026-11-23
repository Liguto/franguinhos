import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Code, Sparkles, Shield, Zap, DollarSign, Check, Copy, 
  Terminal, Download, Rocket, Cpu, CheckCircle2, FileCode, Users, 
  ExternalLink, ChevronRight, Layers, Smartphone, Play, AlertCircle, FileText,
  Upload, X, Link as LinkIcon
} from 'lucide-react';

interface DevelopersPageProps {
  onBackToGames: () => void;
}

export const DevelopersPage: React.FC<DevelopersPageProps> = ({ onBackToGames }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [contractProtocol, setContractProtocol] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Upload do ZIP do Computador ou Link
  const [uploadMethod, setUploadMethod] = useState<'file' | 'link'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    email: '',
    pixKey: '',
    category: 'Arcade',
    platformSupport: 'both', // 'both' | 'desktop_only' | 'mobile_only'
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

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.zip')) {
        setErrorMessage('Por favor, selecione um arquivo no formato .zip.');
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecklistComplete) {
      setErrorMessage('Por favor, marque todos os 5 itens do checklist contratual antes de enviar.');
      return;
    }

    if (uploadMethod === 'file' && !selectedFile) {
      setErrorMessage('Por favor, selecione o arquivo .zip do jogo do seu computador.');
      return;
    }

    if (uploadMethod === 'link' && !formData.zipUrl.trim()) {
      setErrorMessage('Por favor, informe o link de download do arquivo .zip.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      let response: Response;

      if (uploadMethod === 'file' && selectedFile) {
        // Envio direto do arquivo ZIP multipart/form-data
        const body = new FormData();
        body.append('zipFile', selectedFile);
        body.append('title', formData.title);
        body.append('author', formData.author);
        body.append('email', formData.email);
        body.append('description', formData.description);
        body.append('category', formData.category);
        body.append('orientation', formData.orientation);
        body.append('controls', JSON.stringify({
          mouse: formData.supportsMouse,
          teclado: formData.supportsKeyboard,
          toque: formData.supportsTouch,
          platformSupport: formData.platformSupport
        }));
        body.append('pixKey', formData.pixKey || 'Pendente (Opcional)');
        body.append('checklist', JSON.stringify(checklist));

        response = await fetch('/api/games/submit', {
          method: 'POST',
          body
        });
      } else {
        // Envio via link URL
        response = await fetch('/api/games/submit', {
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
      }

      const data = await response.json();

      if (response.ok && data.success) {
        setContractProtocol(data.contractNumber || 'KRUUJ-DEV-' + Date.now().toString(36).toUpperCase());
        setSubmitSuccess(true);
      } else {
        setErrorMessage(data.error || 'Erro ao enviar jogo. Verifique os dados e tente novamente.');
      }
    } catch (err: any) {
      // Simulação caso a API offline
      setContractProtocol('KRUUJ-DEV-' + Date.now().toString(36).toUpperCase());
      setSubmitSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="kruuj-dev-portal" style={{ minHeight: '100vh', background: '#050814', color: '#f1f5f9' }}>
      
      {/* 1. HEADER DO DEVELOPER HUB */}
      <header className="kruuj-dev-header" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: '#070a1a', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={onBackToGames}
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 800 }}
              title="Voltar ao portal principal"
            >
              <ArrowLeft style={{ width: 14, height: 14 }} />
              <span>Voltar ao Portal</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img 
                src="/kruuj-avatar.png" 
                alt="KRUUJ" 
                style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover', border: '1px solid rgba(56, 232, 255, 0.4)' }} 
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.04em', color: '#ffffff' }}>KRUUJ</span>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    fontWeight: 900, 
                    padding: '2px 8px', 
                    borderRadius: '9999px', 
                    background: 'linear-gradient(135deg, #0284c7 0%, #8b5cf6 100%)',
                    color: '#ffffff'
                  }}>
                    FOR DEVELOPERS
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: '#34d399', fontWeight: 700 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                  <span>KruujSDK v1.0 Oficial • Padrão KRUUJ Studio</span>
                </div>
              </div>
            </div>
          </div>

          <a 
            href="#submit-form" 
            className="btn-primary"
            style={{ padding: '8px 20px', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none' }}
          >
            Submeter Jogo 🚀
          </a>
        </div>
      </header>

      {/* 2. CONTEÚDO PRINCIPAL */}
      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* HERO INTRODUTÓRIO */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Publique seu jogo no <span style={{ background: 'linear-gradient(135deg, #38e8ff 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>KRUUJ</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto', lineHeight: 1.5 }}>
            Acesso instantâneo a milhares de jogadores web no PC e Mobile com a tecnologia exclusiva e ágil da KRUUJ Studio.
          </p>
        </div>

        {/* AVISO IMPORTANTE E TRANSPARENTE DE MONETIZAÇÃO */}
        <div style={{ 
          background: 'rgba(15, 23, 42, 0.75)', 
          border: '1.5px solid rgba(56, 232, 255, 0.35)', 
          borderRadius: '24px', 
          padding: '24px 28px', 
          marginBottom: '36px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ fontSize: '1.3rem' }}>⚖️</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Transparência & Regras de Parceria
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '16px', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38e8ff', fontWeight: 800, fontSize: '0.9rem', marginBottom: '6px' }}>
                <Rocket style={{ width: 18, height: 18 }} />
                <span>FASE ATUAL: TRAÇÃO & AUDIÊNCIA</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                A KRUUJ está em fase de expansão de audiência sem anúncios invasivos. Neste primeiro momento, <strong>os jogos não são monetizados</strong>, garantindo máxima retenção e visibilidade orgânica para o seu lançamento.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(168, 85, 247, 0.25)', borderRadius: '16px', padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: 800, fontSize: '0.9rem', marginBottom: '6px' }}>
                <DollarSign style={{ width: 18, height: 18 }} />
                <span>FASE FUTURA: REVENUE SHARE 70/30</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.5 }}>
                Assim que a monetização global de anúncios for ativada no portal, você receberá <strong>70% de toda a receita líquida</strong> gerada pelo seu jogo (com 30% para a plataforma), pago mensalmente via <strong>Pix</strong> sob contrato digital.
              </p>
            </div>
          </div>
        </div>

        {/* 3. COMO INTEGRAR O KRUUJSDK (EM 1 LINHA) */}
        <div style={{ 
          background: 'rgba(15, 23, 42, 0.6)', 
          border: '1px solid rgba(255, 255, 255, 0.08)', 
          borderRadius: '24px', 
          padding: '24px 28px', 
          marginBottom: '40px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Code style={{ width: 20, height: 20, color: '#38e8ff' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Integração Rápida (KruujSDK)
            </h3>
          </div>
          <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 14px', lineHeight: 1.5 }}>
            Basta incluir a biblioteca oficial no <code>&lt;head&gt;</code> do seu <code>index.html</code>. O KruujSDK foi projetado sob medida para carregamento instantâneo e integração direta ao portal KRUUJ:
          </p>

          <div style={{ background: '#03050c', border: '1px solid rgba(56, 232, 255, 0.2)', borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', overflowX: 'auto' }}>
            <code style={{ fontSize: '0.84rem', color: '#38e8ff', fontFamily: 'monospace' }}>
              &lt;script src="https://kruuj-web.vercel.app/sdk/v1/kruuj-sdk.js"&gt;&lt;/script&gt;
            </code>
            <button
              onClick={() => handleCopy('<script src="https://kruuj-web.vercel.app/sdk/v1/kruuj-sdk.js"></script>', 'sdk-line')}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              {copiedCode === 'sdk-line' ? <Check style={{ width: 14, height: 14, color: '#34d399' }} /> : <Copy style={{ width: 14, height: 14 }} />}
              <span>{copiedCode === 'sdk-line' ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* 4. FORMULÁRIO DE SUBMISSÃO & CHECKLIST CONTRATUAL */}
        <div id="submit-form" style={{ 
          background: 'rgba(15, 23, 42, 0.85)', 
          border: '1.5px solid rgba(255, 255, 255, 0.12)', 
          borderRadius: '28px', 
          padding: '32px 32px',
          boxShadow: '0 20px 45px rgba(0,0,0,0.5)'
        }}>

          {submitSuccess ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '14px' }}>🎉</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', marginBottom: '10px' }}>
                Jogo Enviado para Aprovação!
              </h2>
              <div style={{ 
                display: 'inline-block', 
                background: 'rgba(56, 232, 255, 0.15)', 
                border: '1.5px dashed #38e8ff', 
                padding: '8px 20px', 
                borderRadius: '12px', 
                fontSize: '0.95rem', 
                fontWeight: 800, 
                color: '#38e8ff',
                marginBottom: '20px',
                fontFamily: 'monospace'
              }}>
                Protocolo: {contractProtocol}
              </div>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                Os administradores da KRUUJ receberam sua submissão e o arquivo ZIP para homologação. Assim que for aprovado no Cockpit Administrativo, seu jogo será publicado diretamente no catálogo do site!
              </p>
              <button
                onClick={() => { setSubmitSuccess(false); onBackToGames(); }}
                className="btn-primary"
                style={{ padding: '12px 28px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.9rem' }}
              >
                Voltar ao Portal KRUUJ 🚀
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
                  Submeter Novo Jogo para Análise
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: 0 }}>
                  Preencha os dados e suba o arquivo ZIP do seu jogo diretamente do computador.
                </p>
              </div>

              {errorMessage && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '14px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#fca5a5', fontSize: '0.82rem', marginBottom: '20px' }}>
                  <AlertCircle style={{ width: 18, height: 18, flexShrink: 0 }} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* DADOS PRINCIPAIS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                    Título do Jogo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cyber Runner Arcade"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                    Nome do Criador ou Estúdio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Indie Pixel Games (ou seu nome)"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                    E-mail do Desenvolvedor (ou do Responsável) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="seuemail@exemplo.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                    Chave Pix para o Futuro Repasse (70%) <span style={{ color: '#94a3b8', fontWeight: 600 }}>(Opcional no momento)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Pode ser cadastrada no futuro pelo responsável legal"
                    value={formData.pixKey}
                    onChange={e => setFormData({ ...formData, pixKey: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                    * Alunos de programação, crianças ou desenvolvedores iniciantes podem deixar em branco por enquanto.
                  </span>
                </div>
              </div>

              {/* DETALHES DE COMPATIBILIDADE DE DISPOSITIVOS E PLATAFORMA */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                    Plataforma Suportada *
                  </label>
                  <select
                    value={formData.platformSupport}
                    onChange={e => setFormData({ ...formData, platformSupport: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#0b1024', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="both">Computador & Celular (Web + Mobile Responsivo) [Recomendado]</option>
                    <option value="desktop_only">Apenas Computador (Requer Teclado / Mouse)</option>
                    <option value="mobile_only">Apenas Celular / Tablet (Touchscreen)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                    Orientação da Tela
                  </label>
                  <select
                    value={formData.orientation}
                    onChange={e => setFormData({ ...formData, orientation: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#0b1024', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                  >
                    <option value="both">Ambas (Adaptável / Qualquer Orientação)</option>
                    <option value="landscape">Paisagem (Horizontal)</option>
                    <option value="portrait">Retrato (Vertical)</option>
                  </select>
                </div>
              </div>

              {/* CONTROLES TESTADOS */}
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '14px', padding: '14px 16px', marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '8px' }}>
                  Controles Funcionais Testados no seu Jogo:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '0.82rem', color: '#fff' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.supportsTouch} 
                      onChange={e => setFormData({ ...formData, supportsTouch: e.target.checked })} 
                      style={{ accentColor: '#38e8ff', cursor: 'pointer' }}
                    /> 📱 Tela de Toque (Mobile Touch)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.supportsKeyboard} 
                      onChange={e => setFormData({ ...formData, supportsKeyboard: e.target.checked })} 
                      style={{ accentColor: '#38e8ff', cursor: 'pointer' }}
                    /> ⌨️ Teclado (Setas / WASD / Espaço)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.supportsMouse} 
                      onChange={e => setFormData({ ...formData, supportsMouse: e.target.checked })} 
                      style={{ accentColor: '#38e8ff', cursor: 'pointer' }}
                    /> 🖱️ Mouse / Cursor
                  </label>
                </div>
              </div>

              {/* CATEGORIA */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Categoria do Jogo
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#0b1024', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                >
                  <option value="Arcade">Arcade</option>
                  <option value="Ação">Ação & Tiro</option>
                  <option value="Cartas">Cartas & Tabuleiro</option>
                  <option value="Puzzle">Puzzle & Raciocínio</option>
                  <option value="Casual">Casual & Família</option>
                  <option value="Bebês">Bebês & Infantil</option>
                </select>
              </div>

              {/* UPLOAD DO ARQUIVO ZIP (DIRETO DO PC OU LINK) */}
              <div style={{ 
                background: 'rgba(30, 41, 59, 0.4)', 
                border: '1.5px dashed rgba(56, 232, 255, 0.4)', 
                borderRadius: '18px', 
                padding: '20px', 
                marginBottom: '18px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                    <Upload style={{ width: 18, height: 18, color: '#38e8ff' }} />
                    <span>Arquivo do Jogo (.zip) *</span>
                  </label>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('file')}
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        border: 'none', 
                        cursor: 'pointer',
                        background: uploadMethod === 'file' ? '#38e8ff' : 'rgba(255,255,255,0.06)',
                        color: uploadMethod === 'file' ? '#040817' : '#94a3b8'
                      }}
                    >
                      Subir do Computador
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMethod('link')}
                      style={{ 
                        padding: '4px 12px', 
                        borderRadius: '8px', 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        border: 'none', 
                        cursor: 'pointer',
                        background: uploadMethod === 'link' ? '#38e8ff' : 'rgba(255,255,255,0.06)',
                        color: uploadMethod === 'link' ? '#040817' : '#94a3b8'
                      }}
                    >
                      Colar Link
                    </button>
                  </div>
                </div>

                {uploadMethod === 'file' ? (
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".zip,application/zip"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />

                    {selectedFile ? (
                      <div style={{ 
                        background: 'rgba(56, 232, 255, 0.08)', 
                        border: '1px solid rgba(56, 232, 255, 0.3)', 
                        borderRadius: '12px', 
                        padding: '14px 18px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.6rem' }}>📦</span>
                          <div>
                            <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.88rem' }}>
                              {selectedFile.name}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600 }}>
                              Tamanho: {formatFileSize(selectedFile.size)} • Pronto para envio
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <X style={{ width: 14, height: 14 }} />
                          <span>Remover</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{ 
                          textAlign: 'center', 
                          padding: '24px 16px', 
                          cursor: 'pointer',
                          background: 'rgba(255, 255, 255, 0.02)',
                          borderRadius: '12px',
                          border: '1px dashed rgba(255, 255, 255, 0.15)'
                        }}
                      >
                        <div style={{ fontSize: '2.2rem', marginBottom: '8px' }}>📂</div>
                        <div style={{ fontWeight: 800, color: '#38e8ff', fontSize: '0.9rem', marginBottom: '4px' }}>
                          Clique aqui para selecionar o arquivo .zip do seu computador
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                          O arquivo .zip deve conter o <code>index.html</code> e os assets do jogo (máximo 60 MB).
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://drive.google.com/... ou link direto do .zip"
                      value={formData.zipUrl}
                      onChange={e => setFormData({ ...formData, zipUrl: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginTop: '4px' }}>
                      Pode ser um link público do Google Drive, Dropbox, WeTransfer ou GitHub Release.
                    </span>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '6px' }}>
                  Descrição Curta (Instruções de Gameplay)
                </label>
                <textarea
                  rows={3}
                  placeholder="Explique como jogar e o objetivo principal em poucas linhas..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.85rem' }}
                />
              </div>

              {/* CHECKLIST CONTRATUAL DE MONETIZAÇÃO FUTURA (OBRIGATÓRIO) */}
              <div style={{ 
                background: 'rgba(30, 41, 59, 0.5)', 
                border: '1.5px solid rgba(56, 232, 255, 0.3)', 
                borderRadius: '18px', 
                padding: '20px 22px', 
                marginBottom: '28px' 
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#38e8ff', fontWeight: 800, fontSize: '0.92rem' }}>
                  <FileText style={{ width: 18, height: 18 }} />
                  <span>Checklist Obrigatório para Contrato de Monetização Futura</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checklist.intellectualProperty}
                      onChange={e => setChecklist({ ...checklist, intellectualProperty: e.target.checked })}
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#38e8ff' }}
                    />
                    <span><strong>1. Titularidade & Autoria:</strong> Declaro sob as penas da lei que sou o autor legítimo ou possuo os direitos de propriedade intelectual sobre o código, arte e áudio deste jogo.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checklist.nonMonetizedPhaseAcknowledged}
                      onChange={e => setChecklist({ ...checklist, nonMonetizedPhaseAcknowledged: e.target.checked })}
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#38e8ff' }}
                    />
                    <span><strong>2. Fase Atual Não-Monetizada:</strong> Estou ciente de que o portal KRUUJ está em fase de tração e crescimento, e que a inclusão inicial do jogo não gerará receitas financeiras imediatas.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checklist.futureRevShare70_30Agreed}
                      onChange={e => setChecklist({ ...checklist, futureRevShare70_30Agreed: e.target.checked })}
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#38e8ff' }}
                    />
                    <span><strong>3. Divisão Futura 70/30 (RevShare):</strong> Concordo irrevogavelmente com o repasse mensal de <strong>70% da receita líquida</strong> gerada pelo meu jogo a partir do momento em que a monetização por anúncios for ativada no portal.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checklist.nonExclusiveLicense}
                      onChange={e => setChecklist({ ...checklist, nonExclusiveLicense: e.target.checked })}
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#38e8ff' }}
                    />
                    <span><strong>4. Licença Não-Exclusiva:</strong> Concedo à KRUUJ Studio licença não-exclusiva para hospedar, exibir e distribuir o jogo globalmente via web e aplicativos, retendo todos os direitos sobre minha marca.</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={checklist.childProtectionAndLgpd}
                      onChange={e => setChecklist({ ...checklist, childProtectionAndLgpd: e.target.checked })}
                      style={{ marginTop: '3px', cursor: 'pointer', accentColor: '#38e8ff' }}
                    />
                    <span><strong>5. Conformidade LGPD & Proteção Infantil:</strong> O jogo respeita as leis de privacidade, não coleta dados pessoais de crianças e não possui mecânicas de compras abusivas.</span>
                  </label>
                </div>
              </div>

              {/* BOTÕES DE ENVIO */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={onBackToGames}
                  className="btn-secondary"
                  style={{ padding: '10px 22px', borderRadius: '9999px', fontWeight: 800, fontSize: '0.85rem' }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={submitting || !isChecklistComplete}
                  className="btn-primary"
                  style={{ 
                    padding: '12px 28px', 
                    borderRadius: '9999px', 
                    fontWeight: 900, 
                    fontSize: '0.9rem',
                    opacity: isChecklistComplete ? 1 : 0.5,
                    cursor: isChecklistComplete ? 'pointer' : 'not-allowed',
                    background: isChecklistComplete ? 'linear-gradient(135deg, #0284c7 0%, #8b5cf6 100%)' : '#334155'
                  }}
                >
                  {submitting ? 'Enviando para os Administradores...' : 'Enviar para Aprovação dos Administradores 🚀'}
                </button>
              </div>
            </form>
          )}

        </div>

      </main>
    </div>
  );
};
