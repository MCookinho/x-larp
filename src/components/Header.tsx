import { useState } from 'react';
import { getApiConfig } from '../services/api';

interface HeaderProps {
  onAnalyze: (username: string) => void;
  isLoading: boolean;
  onOpenSettings: () => void;
}

export function Header({ onAnalyze, isLoading, onOpenSettings }: HeaderProps) {
  const [input, setInput] = useState('');
  const apiConfig = getApiConfig();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) onAnalyze(input.trim());
  };

  return (
    <header className="header">
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
            placeholder="coloca teu @ aqui (ex: MCookinho)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={isLoading}>
            {isLoading ? '🤔 ANALISANDO...' : '🔍 DESMASCARAR'}
          </button>
        </div>
      </form>

      <div className="header-actions">
        <button className="header-settings-btn" onClick={onOpenSettings}>
          ⚙️ API {apiConfig.configured ? '✅' : ''}
        </button>
        {apiConfig.configured && (
          <span className="header-api-status">🔌 API conectada</span>
        )}
        {!apiConfig.configured && (
          <span className="header-api-status mock">🎭 Modo zoeira (dados fictícios)</span>
        )}
      </div>

      <div className="header-disclaimer">
        ⚠️ Esse site é 100% zoeira. Os dados mostrados são fictícios (por enquanto).
        Se você levar a sério, o personagem venceu.
      </div>
    </header>
  );
}
