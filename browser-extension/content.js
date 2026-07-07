(function () {
  const STYLE = document.createElement('style');
  STYLE.textContent = `
    @keyframes larpSlideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes larpSlideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
    .larp-toast {
      position: fixed; bottom: 24px; right: 24px; z-index: 999999;
      background: linear-gradient(135deg, #1e1230, #2a1a40);
      border: 3px solid #b388ff; border-radius: 16px;
      padding: 16px 20px; max-width: 360px;
      box-shadow: 6px 6px 0 rgba(0,0,0,.5);
      font-family: 'Fredoka', 'Comic Neue', sans-serif;
      color: #ede4ff; font-size: 14px; line-height: 1.5;
      animation: larpSlideIn .4s cubic-bezier(.34,1.56,.64,1);
    }
    .larp-toast.larp-hiding { animation: larpSlideOut .3s ease-in forwards; }
    .larp-toast .larp-title { font-weight: 700; font-size: 16px; color: #b388ff; margin-bottom: 4px; }
    .larp-toast .larp-sub { color: #b098d0; font-size: 12px; }
    .larp-toast .larp-close {
      position: absolute; top: 8px; right: 10px; cursor: pointer;
      color: #6a5080; font-size: 16px; background: none; border: none;
      font-family: inherit;
    }
    .larp-toast .larp-close:hover { color: #FF4757; }
  `;
  document.head.appendChild(STYLE);

  function showToast(authToken, ct0) {
    const existing = document.querySelector('.larp-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'larp-toast';
    toast.innerHTML = `
      <button class="larp-close">✕</button>
      <div class="larp-title">🎭 Larp Social</div>
      <div>🍪 Cookies do X importados com sucesso!</div>
      <div class="larp-sub">auth_token e ct0 salvos no X LARP</div>
    `;
    toast.querySelector('.larp-close')?.addEventListener('click', () => dismiss(toast));
    setTimeout(() => dismiss(toast), 6000);
    document.body.appendChild(toast);

    const script = document.createElement('script');
    script.textContent = `
      (function() {
        if (localStorage.getItem('xlarp_auth_token')) return;
        localStorage.setItem('xlarp_auth_token', ${JSON.stringify(authToken)});
        localStorage.setItem('xlarp_csrf_token', ${JSON.stringify(ct0)});
        window.dispatchEvent(new CustomEvent('larp-social-loaded', {
          detail: { authToken: ${JSON.stringify(authToken)}, ct0: ${JSON.stringify(ct0)} }
        }));
      })();
    `;
    document.documentElement.appendChild(script);
    script.remove();
  }

  function dismiss(toast) {
    toast.classList.add('larp-hiding');
    setTimeout(() => toast.remove(), 300);
  }

  function run() {
    chrome.runtime.sendMessage({ type: 'LARP_GET_COOKIES' }, (response) => {
      if (chrome.runtime.lastError) return;
      if (response?.authToken && response?.ct0) {
        showToast(response.authToken, response.ct0);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
