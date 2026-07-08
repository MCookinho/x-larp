import { useState, useEffect } from 'react';
import {
  getAuthToken, setAuthToken, clearAuthToken,
  getCsrfToken, setCsrfToken, clearCsrfToken,
} from '../services/api';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: () => void;
}

export function ConnectModal({ isOpen, onClose, onConfigChange }: ConnectModalProps) {
  const [authToken, setLocalAuth] = useState(getAuthToken() || '');
  const [csrfToken, setLocalCsrf] = useState(getCsrfToken() || '');
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(!!getAuthToken());

  useEffect(() => {
    if (isOpen) {
      setLocalAuth(getAuthToken() || '');
      setLocalCsrf(getCsrfToken() || '');
      setSaved(false);
      setShowForm(!!getAuthToken());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCookies = () => {
    if (authToken.trim()) setAuthToken(authToken.trim());
    if (csrfToken.trim()) setCsrfToken(csrfToken.trim());
    setSaved(true);
    onConfigChange();
    setTimeout(() => onClose(), 1200);
  };

  const handleClear = () => {
    clearAuthToken();
    clearCsrfToken();
    setLocalAuth('');
    setLocalCsrf('');
    setSaved(true);
    onConfigChange();
  };

  const hasSaved = !!(getAuthToken() && getCsrfToken());

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal connect-modal" onClick={(e) => e.stopPropagation()}>
        <button className="settings-close" onClick={onClose}>✕</button>

        <div className="connect-header">
          <span className="connect-header-icon">🔗</span>
          <h2 className="settings-title">Conectar ao X</h2>
          <p className="settings-desc">
            Pra buscar dados <strong>reais</strong> com paginação completa de tweets,
            conecte sua conta do X de um dos jeitos abaixo.
          </p>
        </div>

        <div className="connect-cards">
          <div className="connect-card">
            <div className="connect-card-icon">🎭</div>
            <h3 className="connect-card-title">Instalar Extensão</h3>
            <p className="connect-card-desc">
              A extensão <strong>Larp Social</strong> lê os cookies da sua sessão
              do X.com automaticamente e salva no X LARP.
            </p>
            <ul className="connect-card-features">
              <li>🔌 Funciona em Chrome, Brave, Edge e Firefox</li>
              <li>📱 Firefox Android também é compatível</li>
              <li>🍪 Cookies detectados automaticamente</li>
              <li>🔒 Tudo fica no seu navegador</li>
            </ul>
            <a
              className="connect-card-btn"
              href={`${import.meta.env.BASE_URL}browser-extension/`}
              target="_blank"
            >
              ⬇️ Baixar Extensão
            </a>
          </div>

          <div className="connect-divider">
            <span>ou</span>
          </div>

          <div className="connect-card">
            <div className="connect-card-icon">🔑</div>
            <h3 className="connect-card-title">Colar Cookies</h3>
            <p className="connect-card-desc">
              Prefere fazer manualmente? Cole os cookies <strong>auth_token</strong>
              {' '}e <strong>ct0</strong> da sua sessão do X.com.
            </p>

            {!showForm ? (
              <button
                className="connect-card-btn secondary"
                onClick={() => setShowForm(true)}
              >
                🔑 Colar Cookies
              </button>
            ) : (
              <div className="connect-form">
                <label className="settings-label">
                  auth_token
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Cole o valor do cookie auth_token"
                    value={authToken}
                    onChange={(e) => setLocalAuth(e.target.value)}
                  />
                </label>
                <label className="settings-label">
                  ct0
                  <input
                    type="text"
                    className="settings-input"
                    placeholder="Cole o valor do cookie ct0"
                    value={csrfToken}
                    onChange={(e) => setLocalCsrf(e.target.value)}
                  />
                </label>

                <details className="settings-auth-info">
                  <summary>🔑 Onde encontrar?</summary>
                  <ol className="settings-steps" style={{ marginTop: 8 }}>
                    <li className="settings-step">Faça login em <strong>x.com</strong></li>
                    <li className="settings-step">Abra o DevTools (F12) → Application → Cookies → x.com</li>
                    <li className="settings-step">Copie <code>auth_token</code> e <code>ct0</code></li>
                    <li className="settings-step">Cole aqui e salve</li>
                  </ol>
                </details>

                <div className="connect-form-actions">
                  <button className="settings-btn save" onClick={handleSaveCookies}>
                    {saved ? '✅ Salvo!' : '💾 Salvar'}
                  </button>
                  {hasSaved && (
                    <button className="settings-btn clear" onClick={handleClear}>
                      🗑️ Limpar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="settings-footer">
          🔒 Tokens ficam salvos <strong>apenas no seu navegador</strong> (localStorage).
          Nada é enviado pra servidores além do proxy Vercel.
        </p>
      </div>
    </div>
  );
}
