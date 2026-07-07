import type { AccountStats } from '../types';
import { contextLabels } from '../data/mockData';

interface StatsCardProps {
  stats: AccountStats;
  username: string;
}

export function StatsCard({ stats, username }: StatsCardProps) {
  const cringeEmoji = stats.cringeLevel > 80 ? '🤢' : stats.cringeLevel > 50 ? '😬' : '👍';
  const ratioEmoji = stats.ratio > 2 ? '👑' : stats.ratio > 1 ? '💪' : '😰';

  return (
    <div className="card stats-card">
      <h2 className="card-title">
        📊 O personagem de @{username}
      </h2>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{stats.totalTweets.toLocaleString()}</span>
          <span className="stat-label">Tweets (já foram mais)</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.totalFollowers.toLocaleString()}</span>
          <span className="stat-label">Seguidores (bots inclusos)</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{stats.totalFollowing.toLocaleString()}</span>
          <span className="stat-label">Seguindo (gente que não segue de volta: {Math.floor(stats.totalFollowing * 0.7)})</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{contextLabels[stats.topContext]}</span>
          <span className="stat-label">Contexto mais usado (sim, você é previsível)</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {stats.bestFriend} 💕
          </span>
          <span className="stat-label">Melhor amigo (ou a pessoa que você mais perturba)</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {cringeEmoji} {stats.cringeLevel}%
          </span>
          <span className="stat-label">Nível de Cringe (alto, a gente sabe)</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {ratioEmoji} {stats.ratio.toFixed(1)}
          </span>
          <span className="stat-label">Like/View Ratio (se for baixo, ninguém te aguenta)</span>
        </div>
      </div>
    </div>
  );
}
