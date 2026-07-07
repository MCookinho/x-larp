import { useState, useEffect } from 'react';
import { getProxyUrl, setProxyUrl, clearProxyUrl, isConfigured } from '../services/api';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: () => void;
}

export function Settings({ isOpen, onClose, onConfigChange }: SettingsProps) {
  const [proxyUrl, setLocalUrl] = useState(getProxyUrl() || '');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLocalUrl(getProxyUrl() || '');
      setSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!proxyUrl.trim()) return;
    setProxyUrl(proxyUrl.trim());
    setSaved(true);
    onConfigChange();
  };

  const handleClear = () => {
    clearProxyUrl();
    setLocalUrl('');
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
          🔒 Dados públicos de perfis públicos. Não precisa de login.
          O proxy não armazena nada — só repassa os dados.
        </p>
      </div>
    </div>
  );
}
