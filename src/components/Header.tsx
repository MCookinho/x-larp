import { useState, useRef, useEffect } from 'react';
import { getAuthToken, getCsrfToken } from '../services/api';

interface HeaderProps {
  onAnalyze: (username: string) => void;
  isLoading: boolean;
  onOpenSettings: () => void;
}

export function Header({ onAnalyze, isLoading, onOpenSettings }: HeaderProps) {
  const [input, setInput] = useState('');
  const [showConnect, setShowConnect] = useState(false);
  const connectRef = useRef<HTMLDivElement>(null);

  const hasAuth = !!(getAuthToken() && getCsrfToken());

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (connectRef.current && !connectRef.current.contains(e.target as Node)) {
        setShowConnect(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
        <div className="connect-wrapper" ref={connectRef}>
          <button
            className={`connect-btn ${hasAuth ? 'connected' : ''}`}
            onClick={() => setShowConnect(!showConnect)}
          >
            ⚙️ Conectar
            {hasAuth && <span className="connect-badge">🔑</span>}
          </button>

          {showConnect && (
            <div className="connect-dropdown">
              <a
                className="connect-option"
                href={`${import.meta.env.BASE_URL}browser-extension/`}
                target="_blank"
                onClick={() => setShowConnect(false)}
              >
                <span className="connect-option-icon">🎭</span>
                <div>
                  <strong>Instalar Extensão</strong>
                  <small>Detecta cookies automaticamente</small>
                </div>
              </a>
              <button
                className="connect-option"
                onClick={() => { setShowConnect(false); onOpenSettings(); }}
              >
                <span className="connect-option-icon">🔑</span>
                <div>
                  <strong>Colar Cookies</strong>
                  <small>auth_token + ct0 manualmente</small>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="header-disclaimer">
        ⚠️ Esse site é 100% zoeira. Os dados mostrados podem ser fictícios.
        Se você levar a sério, o personagem venceu.
      </div>
    </header>
  );
}
