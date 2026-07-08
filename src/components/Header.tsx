import { useState } from 'react';
import { getAuthToken, getCsrfToken } from '../services/api';
import { ConnectModal } from './ConnectModal';

interface HeaderProps {
  onAnalyze: (username: string) => void;
  isLoading: boolean;
  onOpenSettings: () => void;
  extensionDetected?: boolean;
}

export function Header({ onAnalyze, isLoading, onOpenSettings: _onOpenSettings, extensionDetected }: HeaderProps) {
  const [input, setInput] = useState(() => localStorage.getItem('xlarp_last_user') ?? '');
  const [connectOpen, setConnectOpen] = useState(false);

  const hasAuth = !!(getAuthToken() && getCsrfToken());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = input.trim();
    if (!user) return;
    localStorage.setItem('xlarp_last_user', user);
    onAnalyze(user);
  };

  return (
    <header className="header">
      <ConnectModal
        isOpen={connectOpen}
        onClose={() => setConnectOpen(false)}
        onConfigChange={() => {}}
      />

      <div className="header-top">
        <h1 className="title">
          <span className="title-icon">🐦</span>
          X LARP
        </h1>
        <p className="subtitle">
          🤫 A única verdade sobre o Twitter/X é que todo mundo tá larpando.
          Nós só estamos aqui pra mostrar que é verdade!!
        </p>
      </div>

      <form className="search-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <span className="input-prefix">@</span>
          <input
            type="text"
            placeholder={extensionDetected ? 'seu @' : 'coloca teu @ aqui (ex: MCookinho)'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={isLoading || !input.trim()}>
            {isLoading ? '🤔 ANALISANDO...' : '🔍 DESMASCARAR'}
          </button>
        </div>
      </form>

      <div className="header-actions">
        <button
          className={`connect-btn ${hasAuth ? 'connected' : ''}`}
          onClick={() => setConnectOpen(true)}
        >
          ⚙️ Conectar
          {hasAuth && <span className="connect-badge">🔑</span>}
        </button>
      </div>

      <div className="header-disclaimer">
        ⚠️ Esse site é 100% zoeira. Os dados mostrados podem ser fictícios.
        Se você levar a sério, o personagem venceu.
      </div>
    </header>
  );
}
