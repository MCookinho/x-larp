import { useState, useEffect } from 'react';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { InteractionCharts } from './components/InteractionCharts';
import { BestFriends } from './components/BestFriends';
import { TweetFilters } from './components/TweetFilters';
import { FollowerTracker } from './components/FollowerTracker';
import { PersonaBanner } from './components/PersonaBanner';
import { WordCloud } from './components/WordCloud';
import { ActivityChart } from './components/ActivityChart';
import { Clones } from './components/Clones';
import { ShameRanking } from './components/ShameRanking';
import { Settings } from './components/Settings';
import { FunFooter } from './components/FunFooter';
import {
  mockTweets,
  mockInteractions,
  mockFollowerEvents,
  bestFriends,
  mockStats,
} from './data/mockData';
import { mockWords, mockHourlyActivity } from './data/mockFunData';
import { fetchUser, fetchTweets, getApiConfig } from './services/api';

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiConnected, setApiConnected] = useState(getApiConfig().configured);
  const [error, setError] = useState<string | null>(null);

  const handleConfigChange = () => {
    setApiConnected(getApiConfig().configured);
  };

  const handleAnalyze = async (user: string) => {
    setIsLoading(true);
    setUsername(null);
    setError(null);

    const config = getApiConfig();

    if (config.configured) {
      try {
        const xUser = await fetchUser(user);
        const tweets = await fetchTweets(xUser.id);

        if (tweets.length > 0) {
          setUsername(user);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('API failed, falling back to mock data:', err);
        setError('⚠️ API não respondeu. Usando dados fictícios.');
      }
    }

    setTimeout(() => {
      setUsername(user);
      setIsLoading(false);
    }, config.configured ? 500 : 1500);
  };

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  return (
    <div className="app">
      <Background />
      <Header
        onAnalyze={handleAnalyze}
        isLoading={isLoading}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onConfigChange={handleConfigChange}
      />

      {error && (
        <div className="error-banner">
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <span className="loading-emoji">🔍</span>
            <div className="loading-bar">
              <div className="loading-progress" />
            </div>
          </div>
          <p className="loading-text">
            {apiConnected
              ? 'Puxando dados reais da API do X...'
              : 'Hackeando o X pra extrair seus dados...'}
            <br />
            <small>
              {apiConnected
                ? '(tomara que o rate limit não estoure)'
                : '(ou só gerando números aleatórios, você nunca saberá)'}
            </small>
          </p>
        </div>
      )}

      {!username && !isLoading && (
        <div className="welcome">
          <div className="welcome-content">
            <h2 className="welcome-title">Bem-vindo ao X LARP 🐦</h2>
            <p className="welcome-text">
              Cansou de fingir que sua timeline faz sentido? Coloca seu @ aí em cima
              e descobre qual personagem você tá interpretando no X.
            </p>
            {!apiConnected && (
              <div className="welcome-mock-notice">
                <p>
                  🎭 <strong>Modo zoeira ativado!</strong> Os dados são fictícios por enquanto.
                  {' '}
                  <button className="link-btn" onClick={() => setSettingsOpen(true)}>
                    Configurar API real
                  </button>
                  {' '}se quiser dados de verdade.
                </p>
              </div>
            )}
            <div className="welcome-features">
              <div className="feature">
                <span className="feature-icon">📊</span>
                <span>Gráficos das suas interações (sim, tudo observado)</span>
              </div>
              <div className="feature">
                <span className="feature-icon">👥</span>
                <span>Quem são seus melhores amigos (ou vítimas)</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔍</span>
                <span>Filtros de tweets (mais vergonha alheia primeiro)</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🕵️</span>
                <span>Rastreamento de seguidores (paranóia mode on)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {username && !isLoading && (
        <main className="dashboard">
          <StatsCard stats={mockStats} username={username} />
          <PersonaBanner />
          <WordCloud words={mockWords} />
          <ActivityChart data={mockHourlyActivity} />
          <Clones />
          <InteractionCharts interactions={mockInteractions} />
          <BestFriends friends={bestFriends} />
          <TweetFilters tweets={mockTweets} />
          <ShameRanking tweets={mockTweets} />
          <FollowerTracker events={mockFollowerEvents} />
        </main>
      )}

      <FunFooter />
    </div>
  );
}
