import { useState, useEffect } from 'react';
import {
  getProxyUrl, setProxyUrl, clearProxyUrl, isConfigured,
  getAuthToken, setAuthToken, clearAuthToken,
  getCsrfToken, setCsrfToken, clearCsrfToken,
} from '../services/api';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: () => void;
}

export function Settings({ isOpen, onClose, onConfigChange }: SettingsProps) {
  const [proxyUrl, setLocalUrl] = useState(getProxyUrl() || '');
  const [authToken, setLocalAuth] = useState(getAuthToken() || '');
  const [csrfToken, setLocalCsrf] = useState(getCsrfToken() || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalUrl(getProxyUrl() || '');
      setLocalAuth(getAuthToken() || '');
      setLocalCsrf(getCsrfToken() || '');
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!proxyUrl.trim()) return;
    setProxyUrl(proxyUrl.trim());
    if (authToken.trim()) setAuthToken(authToken.trim());
    if (csrfToken.trim()) setCsrfToken(csrfToken.trim());
    setSaved(true);
    onConfigChange();
  };

  const handleClear = () => {
    clearProxyUrl();
    clearAuthToken();
    clearCsrfToken();
    setLocalUrl('');
    setLocalAuth('');
    setLocalCsrf('');
    setSaved(true);
    onConfigChange();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="settings-close" onClick={onClose}>✕</button>
        <h2 className="settings-title">🌐 Configurar Proxy</h2>
        <p className="settings-desc">
          O X LARP usa os mesmos endpoints que o próprio Twitter/X usa internamente
          pra buscar dados públicos — sem precisar de API key!
          <br /><br />
          Você só precisa de um proxy (Vercel, Cloudflare Worker) pra resolver o CORS.
          <br />
          Sem proxy configurado? O site usa dados fictícios 🎭
        </p>

        <div className="settings-steps">
          <div className="settings-step">
            <span className="settings-step-num">1</span>
            <span>Instale o Vercel CLI: <code>npm i -g vercel</code></span>
          </div>
          <div className="settings-step">
            <span className="settings-step-num">2</span>
            <span>Na pasta do projeto: <code>vercel --prod</code></span>
          </div>
          <div className="settings-step">
            <span className="settings-step-num">3</span>
            <span>Cole a URL gerada (ex: <code>xlarp.vercel.app/api/twitter</code>)</span>
          </div>
        </div>

        <div className="settings-fields">
          <label className="settings-label">
            URL do Proxy
            <input
              type="url"
              className="settings-input"
              placeholder="https://xlarp.vercel.app/api/twitter"
              value={proxyUrl}
              onChange={(e) => setLocalUrl(e.target.value)}
            />
          </label>
          <label className="settings-label">
            auth_token (cookie do x.com)
            <input
              type="text"
              className="settings-input"
              placeholder="Cole o valor do cookie auth_token"
              value={authToken}
              onChange={(e) => setLocalAuth(e.target.value)}
            />
          </label>
          <label className="settings-label">
            ct0 (cookie do x.com)
            <input
              type="text"
              className="settings-input"
              placeholder="Cole o valor do cookie ct0"
              value={csrfToken}
              onChange={(e) => setLocalCsrf(e.target.value)}
            />
          </label>
          <details className="settings-auth-info">
            <summary>🔑 Onde encontrar esses cookies?</summary>
            <ol className="settings-steps" style={{ marginTop: 8 }}>
              <li className="settings-step">Faça login em <strong>x.com</strong> (navegador)</li>
              <li className="settings-step">Abra o DevTools (F12) → Application → Cookies → x.com</li>
              <li className="settings-step">Copie os valores de <code>auth_token</code> e <code>ct0</code></li>
              <li className="settings-step">Cole nos campos acima e salve</li>
            </ol>
            <p className="settings-desc" style={{ fontSize: 12 }}>
              ⚠️ Esses tokens ficam salvos <strong>apenas no seu navegador</strong>
              (localStorage). O proxy Vercel os usa pra fazer as requisições
              autenticadas ao X — sem eles, contas pequenas podem não retornar tweets.
            </p>
          </details>
        </div>

        <div className="settings-actions">
          <button className="settings-btn save" onClick={handleSave}>
            {saved ? '✅ Salvo!' : '💾 Salvar'}
          </button>
          {isConfigured() && (
            <button className="settings-btn clear" onClick={handleClear}>
              🗑️ Remover
            </button>
          )}
        </div>

        <p className="settings-footer">
          🔒 Os dados vão direto do proxy pro seu navegador. Nada é armazenado em servidor.
        </p>
      </div>
    </div>
  );
}
