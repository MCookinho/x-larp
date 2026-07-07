import { useState, useEffect } from 'react';
import { getApiConfig, setApiConfig, clearApiConfig } from '../services/api';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: () => void;
}

export function Settings({ isOpen, onClose, onConfigChange }: SettingsProps) {
  const config = getApiConfig();
  const [proxyUrl, setProxyUrl] = useState(config.proxyUrl || '');
  const [bearerToken, setBearerToken] = useState(config.bearerToken || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const c = getApiConfig();
      setProxyUrl(c.proxyUrl || '');
      setBearerToken(c.bearerToken || '');
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!proxyUrl.trim() || !bearerToken.trim()) return;
    setApiConfig(proxyUrl.trim(), bearerToken.trim());
    setSaved(true);
    onConfigChange();
  };

  const handleClear = () => {
    clearApiConfig();
    setProxyUrl('');
    setBearerToken('');
    setSaved(true);
    onConfigChange();
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="settings-close" onClick={onClose}>✕</button>
        <h2 className="settings-title">🔧 Configuração da API</h2>
        <p className="settings-desc">
          Pra funcionar de verdade, você precisa de uma chave da API do X (antigo Twitter).
          Se não configurar, o site usa dados fictícios (mas engraçados).
        </p>

        <div className="settings-steps">
          <div className="settings-step">
            <span className="settings-step-num">1</span>
            <span>Crie uma conta no <a href="https://developer.twitter.com" target="_blank" rel="noopener noreferrer">X Developer Portal</a> (grátis)</span>
          </div>
          <div className="settings-step">
            <span className="settings-step-num">2</span>
            <span>Crie um Project + App e gere um <strong>Bearer Token</strong> (v2)</span>
          </div>
          <div className="settings-step">
            <span className="settings-step-num">3</span>
            <span>Faça deploy do proxy (veja o README) e cole a URL abaixo</span>
          </div>
        </div>

        <div className="settings-fields">
          <label className="settings-label">
            Proxy URL (ex: https://seu-proxy.vercel.app/api/twitter)
            <input
              type="url"
              className="settings-input"
              placeholder="https://xlarp-api.vercel.app/api/twitter"
              value={proxyUrl}
              onChange={(e) => setProxyUrl(e.target.value)}
            />
          </label>
          <label className="settings-label">
            Bearer Token (X API v2)
            <input
              type="password"
              className="settings-input"
              placeholder="AAAAAAAAAAAAAAAAAAAA..."
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
            />
          </label>
        </div>

        <div className="settings-actions">
          <button className="settings-btn save" onClick={handleSave}>
            {saved ? '✅ Salvo!' : '💾 Salvar'}
          </button>
          <button className="settings-btn clear" onClick={handleClear}>
            🗑️ Limpar
          </button>
        </div>

        <p className="settings-footer">
          🔒 Seu token fica salvo só no seu navegador (localStorage).
          Nunca enviamos pra lugar nenhum além do proxy que você configurar.
        </p>
      </div>
    </div>
  );
}
