import { useState, useEffect } from 'react';
import {
  getProxyUrl, setProxyUrl, clearProxyUrl, hasCustomProxy,
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

  const hasAuthSaved = !!(getAuthToken() && getCsrfToken());

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
    clearAuthToken();
    clearCsrfToken();
    if (hasCustomProxy()) clearProxyUrl();
    setLocalAuth('');
    setLocalCsrf('');
    setLocalUrl(getProxyUrl());
    setSaved(true);
    onConfigChange();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="settings-close" onClick={onClose}>✕</button>
        <h2 className="settings-title">🔧 Configurações</h2>
        <p className="settings-desc">
          O proxy Vercel já vem configurado de fábrica 🎉
          <br /><br />
          Se quiser usar seu próprio proxy (ex: fork do projeto), é só editar a URL abaixo.
          <br />
          Pra buscar <strong>todos</strong> os tweets (incluindo contas pequenas),
          cole seus cookies de autenticação do X.
        </p>

        <div className="settings-fields">
          <label className="settings-label">
            Proxy URL (opcional — padrão já funciona)
            <input
              type="url"
              className="settings-input"
              placeholder="https://x-larp.vercel.app"
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
          {(hasCustomProxy() || hasAuthSaved) && (
            <button className="settings-btn clear" onClick={handleClear}>
              🗑️ Limpar cookies
            </button>
          )}
        </div>

        <p className="settings-footer">
          🔒 Tokens ficam salvos <strong>apenas no seu navegador</strong> (localStorage).
          Nada é enviado pra servidores além do proxy Vercel.
        </p>
      </div>
    </div>
  );
}
