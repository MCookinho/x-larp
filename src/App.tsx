import { useState } from 'react';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { StatsCard } from './components/StatsCard';
import { InteractionCharts } from './components/InteractionCharts';
import { BestFriends } from './components/BestFriends';
import { TweetFilters } from './components/TweetFilters';
import { FollowerTracker } from './components/FollowerTracker';
import { FunFooter } from './components/FunFooter';
import {
  mockTweets,
  mockInteractions,
  mockFollowerEvents,
  bestFriends,
  mockStats,
} from './data/mockData';

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = (user: string) => {
    setIsLoading(true);
    setUsername(null);

    // Simula um delay de "análise" pra dar aquela emoção
    setTimeout(() => {
      setUsername(user);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="app">
      <Background />
      <Header onAnalyze={handleAnalyze} isLoading={isLoading} />

      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <span className="loading-emoji">🔍</span>
            <div className="loading-bar">
              <div className="loading-progress" />
            </div>
          </div>
          <p className="loading-text">
            Hackeando o X pra extrair seus dados...
            <br />
            <small>(ou só gerando números aleatórios, você nunca saberá)</small>
          </p>
        </div>
      )}

      {!username && !isLoading && (
        <div className="welcome">
          <div className="welcome-content">
            <h2 className="welcome-title">Bem-vindo ao X LARP 🎭</h2>
            <p className="welcome-text">
              Cansou de fingir que sua timeline faz sentido? Coloca seu @ aí em cima
              e descobre qual personagem você tá interpretando no X.
            </p>
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
          <InteractionCharts interactions={mockInteractions} />
          <BestFriends friends={bestFriends} />
          <TweetFilters tweets={mockTweets} />
          <FollowerTracker events={mockFollowerEvents} />
        </main>
      )}

      <FunFooter />
    </div>
  );
}
