/**
 * KRUUJ SDK — Biblioteca Oficial de Integração Jogo <-> Portal
 * Compatível 100% com a especificação PokiSDK (developers.poki.com)
 * Version: 1.0.0
 */
(function (window) {
  'use strict';

  let isInitialized = false;
  let isGameplayActive = false;
  const pendingRequests = new Map();

  function sendToParent(action, payload) {
    return new Promise((resolve, reject) => {
      const id = 'req_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
      pendingRequests.set(id, { resolve, reject });

      try {
        window.parent.postMessage(
          {
            source: 'KRUUJ_SDK',
            id: id,
            action: action,
            payload: payload || {}
          },
          '*'
        );
      } catch (err) {
        pendingRequests.delete(id);
        resolve(true); // Resiliente: nunca quebra o jogo
      }

      // Timeout de segurança para promises (resolve se o jogo estiver rodando fora do portal)
      setTimeout(() => {
        if (pendingRequests.has(id)) {
          pendingRequests.delete(id);
          resolve(true);
        }
      }, 4000);
    });
  }

  // Escuta de respostas da janela-mãe (Portal KRUUJ)
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!data || (data.source !== 'KRUUJ_PORTAL' && data.source !== 'POKI_PORTAL')) return;

    if (data.id && pendingRequests.has(data.id)) {
      const { resolve, reject } = pendingRequests.get(data.id);
      pendingRequests.delete(data.id);
      if (data.success) {
        resolve(data.data !== undefined ? data.data : true);
      } else {
        reject(new Error(data.error || 'Falha na requisição'));
      }
    }
  });

  const KruujSDK = {
    // 1. Inicialização Resiliente (Resolve mesmo com AdBlockers)
    init: function () {
      return sendToParent('init')
        .then(() => {
          isInitialized = true;
          return true;
        })
        .catch(() => {
          isInitialized = true;
          return true;
        });
    },

    // 2. Fim do Carregamento Inicial (Aferição de C2P - Conversion to Play)
    gameLoadingFinished: function () {
      return sendToParent('gameLoadingFinished');
    },

    // 3. Início da Gameplay (Quando o jogador assume o controle)
    gameplayStart: function () {
      if (!isGameplayActive) {
        isGameplayActive = true;
        return sendToParent('gameplayStart');
      }
      return Promise.resolve(true);
    },

    // 4. Parada da Gameplay (Menus, Game Over, Pausas)
    gameplayStop: function () {
      if (isGameplayActive) {
        isGameplayActive = false;
        return sendToParent('gameplayStop');
      }
      return Promise.resolve(true);
    },

    // 5. Intersticial Comercial (Com cooldown automático no portal de 90 a 180s)
    commercialBreak: function (onStartCallback) {
      if (typeof onStartCallback === 'function') {
        try { onStartCallback(); } catch (e) {}
      }
      return sendToParent('commercialBreak');
    },

    // 6. Vídeo Recompensado (Ativado estritamente por ação voluntária do jogador)
    rewardedBreak: function (onStartCallback) {
      if (typeof onStartCallback === 'function') {
        try { onStartCallback(); } catch (e) {}
      }
      return sendToParent('rewardedBreak').then((res) => Boolean(res && res.success !== false));
    },

    // 7. Telemetria Granular (Ex: level, tutorial, shop)
    measure: function (category, what, action) {
      return sendToParent('measure', { category, what, action });
    },

    // 8. Detecção do Idioma Ativo (pt, en, es)
    getLanguage: function () {
      const queryLang = new URLSearchParams(window.location.search).get('lang');
      if (queryLang) return queryLang.toLowerCase();
      return (navigator.language || 'pt').split('-')[0].toLowerCase();
    },

    // 9. Dados do Usuário / Autenticação
    getUser: function () {
      return sendToParent('getUser');
    },

    getToken: function () {
      return sendToParent('getToken');
    }
  };

  // Compatibilidade com jogos já preparados para PokiSDK
  window.KruujSDK = KruujSDK;
  window.PokiSDK = KruujSDK;

  // Auto-init se não chamado explicitamente
  setTimeout(() => {
    if (!isInitialized) {
      KruujSDK.init();
    }
  }, 100);
})(window);
