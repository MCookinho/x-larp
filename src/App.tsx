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
import { isConfigured, fetchScrapedUser, fetchScrapedTweets } from './services/api';
import type { ScrapedUser, ScrapedTweet } from './services/api';

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configured, setConfigured] = useState(isConfigured());
  const [error, setError] = useState<string | null>(null);
  const [realUser, setRealUser] = useState<ScrapedUser | null>(null);
  const [realTweets, setRealTweets] = useState<ScrapedTweet[]>([]);

  const handleConfigChange = () => setConfigured(isConfigured());

  const handleAnalyze = async (user: string) => {
    setIsLoading(true);
    setUsername(null);
    setError(null);
    setRealUser(null);
    setRealTweets([]);

    if (configured) {
      try {
        const [userData, tweetsData] = await Promise.all([
          fetchScrapedUser(user),
          fetchScrapedTweets(user, 100),
        ]);
        setRealUser(userData);
        setRealTweets(tweetsData.tweets);
        setUsername(user);
        setIsLoading(false);
        return;
      } catch (err) {
        console.warn('Scraper failed, falling back to mock:', err);
        setError('⚠️ Scraper não respondeu. Usando dados fictícios.');
      }
    }

    setTimeout(() => {
      setUsername(user);
      setIsLoading(false);
    }, 1500);
  };

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const hasRealData = realUser !== null;
  const displayTweets = realTweets.length > 0
    ? realTweets.map((t, i) => ({
        id: t.id,
        text: t.text,
        likes: t.likes,
        retweets: t.retweets,
        replies: t.replies,
        views: t.views,
        quotes: t.quotes,
        bookmarks: t.bookmarks,
        createdAt: t.createdAt,
        context: ['resenha', 'humor', 'reflexao', 'desabafo', 'nerdola'][i % 5] as any,
      }))
    : mockTweets;

  const displayStats = hasRealData
    ? {
        totalTweets: realUser.tweetCount,
        totalFollowers: realUser.followersCount,
        totalFollowing: realUser.followingCount,
        topContext: 'resenha' as const,
        bestFriend: 'ninguém (dados reais não mostram isso)',
        cringeLevel: Math.min(99, Math.floor(Math.random() * 40) + 30),
        ratio: realUser.followersCount > 0
          ? Number((realUser.followingCount / realUser.followersCount).toFixed(1))
          : 0,
      }
    : mockStats;

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
            {configured
              ? 'Extraindo dados reais do Twitter...'
              : 'Hackeando o X pra extrair seus dados...'}
            <br />
            <small>
              {configured
                ? '(usando os endpoints secretos do Twitter 🤫)'
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
            {!configured && (
              <div className="welcome-mock-notice">
                <p>
                  🎭 <strong>Modo zoeira ativado!</strong> Os dados são fictícios por enquanto.
                  {' '}
                  <button className="link-btn" onClick={() => setSettingsOpen(true)}>
                    Configurar proxy
                  </button>
                  {' '}pra buscar dados reais (sem API key).
                </p>
              </div>
            )}
            {hasRealData && (
              <div className="welcome-mock-notice" style={{ borderColor: 'var(--green)', color: 'var(--green)' }}>
                ✅ Dados reais de @{realUser.username} carregados!
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
          <StatsCard stats={displayStats} username={username} />
          <PersonaBanner />
          <WordCloud words={mockWords} />
          <ActivityChart data={mockHourlyActivity} />
          <Clones />
          <InteractionCharts interactions={mockInteractions} />
          <BestFriends friends={bestFriends} />
          <TweetFilters tweets={displayTweets as any} />
          <ShameRanking tweets={displayTweets as any} />
          <FollowerTracker events={mockFollowerEvents} />
        </main>
      )}

      <FunFooter />
    </div>
  );
}
