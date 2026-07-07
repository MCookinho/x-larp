import { useState, useMemo } from 'react';
import type { Tweet } from '../types';
import { filterOptions, contextLabels } from '../data/mockData';

interface TweetFiltersProps {
  tweets: Tweet[];
}

export function TweetFilters({ tweets }: TweetFiltersProps) {
  const [sortBy, setSortBy] = useState<keyof Tweet>('likes');
  const [contextFilter, setContextFilter] = useState<string>('all');

  const sorted = useMemo(() => {
    let filtered = tweets;
    if (contextFilter !== 'all') {
      filtered = tweets.filter((t) => t.context === contextFilter);
    }
    return [...filtered].sort((a, b) => (b[sortBy] as number) - (a[sortBy] as number));
  }, [tweets, sortBy, contextFilter]);

  const formatNumber = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toString();
  };

  return (
    <div className="card">
      <h2 className="card-title">🐦 Tweets Filtrados (ou "como eu humilhei meu timeline")</h2>

      <div className="filter-controls">
        <div className="filter-group">
          <label className="filter-label">Ordenar por:</label>
          <div className="filter-buttons">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                className={`filter-btn ${sortBy === opt.value ? 'active' : ''}`}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Contexto:</label>
          <select
            value={contextFilter}
            onChange={(e) => setContextFilter(e.target.value)}
            className="chart-select"
          >
            <option value="all">Todos 🌈</option>
            {Object.entries(contextLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tweet-list">
        {sorted.map((tweet, index) => (
          <div key={tweet.id} className="tweet-card">
            <div className="tweet-rank">#{index + 1}</div>
            <div className="tweet-content">
              <p className="tweet-text">{tweet.text}</p>
              <div className="tweet-meta">
                <span className="tweet-context">{contextLabels[tweet.context]}</span>
                <span className="tweet-date">
                  {new Date(tweet.createdAt).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
            <div className="tweet-stats">
              <div className="tweet-stat">
                <span>❤️</span>
                <span>{formatNumber(tweet.likes)}</span>
              </div>
              <div className="tweet-stat">
                <span>🔁</span>
                <span>{formatNumber(tweet.retweets)}</span>
              </div>
              <div className="tweet-stat">
                <span>💬</span>
                <span>{formatNumber(tweet.replies)}</span>
              </div>
              <div className="tweet-stat">
                <span>👁️</span>
                <span>{formatNumber(tweet.views)}</span>
              </div>
              <div className="tweet-stat">
                <span>📝</span>
                <span>{formatNumber(tweet.quotes)}</span>
              </div>
              <div className="tweet-stat">
                <span>🔖</span>
                <span>{formatNumber(tweet.bookmarks)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
