import React, { useState, useEffect } from 'react';
import { DirectCampaign, logAdTelemetry } from './directAdsEngine';

interface DirectAdModalProps {
  campaign: DirectCampaign | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectAdModal: React.FC<DirectAdModalProps> = ({ campaign, isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen || !campaign) {
      setTimeLeft(5);
      setCanClose(false);
      return;
    }

    // Registra a impressão auditada
    logAdTelemetry('impression', campaign);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, campaign]);

  if (!isOpen || !campaign) return null;

  const handleCtaClick = () => {
    logAdTelemetry('click', campaign);
    window.open(campaign.landingUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClose = () => {
    if (!canClose) return;
    logAdTelemetry('complete', campaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-sky-500/40 rounded-2xl shadow-2xl text-white overflow-hidden p-6 text-center space-y-5">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between text-xs">
          <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 font-extrabold uppercase tracking-wider border border-sky-500/30">
            {campaign.badgeText}
          </span>
          <div className="text-slate-400 font-mono text-[11px]">
            {canClose ? (
              <span className="text-emerald-400 font-bold">Pronto para continuar</span>
            ) : (
              <span>Anúncio: {timeLeft}s</span>
            )}
          </div>
        </div>

        {/* Sponsor Avatar & Title */}
        <div className="space-y-2 pt-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-sky-600/30 border-2 border-sky-400 flex items-center justify-center text-3xl shadow-lg shadow-sky-500/20">
            🩺
          </div>
          <h3 className="text-xl font-black text-white leading-tight">
            {campaign.title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            {campaign.tagline}
          </p>
        </div>

        {/* Benefícios em Destaque */}
        <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-left text-xs space-y-1.5 text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-sky-400">✔</span>
            <span>Atendimento acolhedor e oficinas de saúde da mente</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sky-400">✔</span>
            <span>Sem coparticipação surpresa em consultas e exames</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sky-400">✔</span>
            <span>Aprovado por milhares de beneficiários da melhor idade</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleCtaClick}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-sky-600/30 transition-all transform active:scale-98"
          >
            {campaign.ctaText} →
          </button>

          <button
            onClick={handleClose}
            disabled={!canClose}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
              canClose
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer'
                : 'bg-slate-950 text-slate-600 cursor-not-allowed border border-slate-800/50'
            }`}
          >
            {canClose ? '✕ Fechar e Continuar Jogando' : `Aguarde ${timeLeft} segundos para pular...`}
          </button>
        </div>

        <p className="text-[10px] text-slate-400">
          Publicidade direta contextualizada KRUUJ • Em conformidade com a LGPD (sem coleta de CPF ou dados sensíveis)
        </p>

      </div>
    </div>
  );
};
