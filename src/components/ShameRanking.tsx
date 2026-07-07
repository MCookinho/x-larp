import type { Tweet } from '../types';
import { contextLabels } from '../data/mockData';
import { shameMessages as defaultShameMessages, mockTranslations, mockCopypasta } from '../data/mockFunData';

interface ShameRankingProps {
  tweets: Tweet[];
  translations?: Record<string, string>;
  copypastaScores?: Record<string, number>;
  shameMessages?: string[];
}

function getShameScore(tweet: Tweet, copypastaScores?: Record<string, number>): number {
  const copypasta = copypastaScores?.[tweet.id] ?? mockCopypasta[tweet.id] ?? 0;
  const lowEngagement = tweet.likes < 100 ? 30 : tweet.likes < 500 ? 15 : 0;
  const badRatio = tweet.likes > 0 && tweet.views > 0
    ? Math.max(0, 30 - (tweet.likes / tweet.views) * 10000)
    : 0;
  return Math.round(copypasta * 0.4 + lowEngagement + badRatio * 0.3);
}

export function ShameRanking({ tweets, translations, copypastaScores, shameMessages }: ShameRankingProps) {
  const msgs = shameMessages ?? defaultShameMessages;
  const ranked = [...tweets]
    .map((t) => ({ ...t, shame: getShameScore(t, copypastaScores) }))
    .sort((a, b) => b.shame - a.shame);

  return (
    <div className="card">
      <h2 className="card-title">🏆 Ranking da Vergonha</h2>
      <p className="card-subtitle">
        Os tweets mais vergonhosos da sua timeline. Prepare o papel higiênico.
      </p>

      <div className="shame-list">
        {ranked.map((tweet, index) => {
          const msg = msgs[index % msgs.length];
          const translation = translations?.[tweet.id] ?? mockTranslations[tweet.id];
          const copypasta = copypastaScores?.[tweet.id] ?? mockCopypasta[tweet.id] ?? 0;

          return (
            <div key={tweet.id} className="shame-card">
              <div className="shame-rank">#{index + 1}</div>
              <div className="shame-content">
                <p className="tweet-text">{tweet.text}</p>
                <div className="shame-msg">{msg}</div>
                <div className="shame-meta">
                  <span className="tweet-context">{contextLabels[tweet.context]}</span>
                  <span className="shame-score">{tweet.shame}pts de vergonha</span>
                  <span className="shame-copypasta">
                    📋 {copypasta}% copypasta
                  </span>
                </div>
                {translation && (
                  <div className="shame-translation">
                    🤫 Tradução: {translation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="chart-footer">
        🔥 O tweet mais vergonhoso tem {ranked[0]?.shame} pontos.
        {ranked[0]?.shame > 50
          ? ' Sugerimos apagar a conta.'
          : ' Ainda dá tempo de sair dessa.'}
      </p>
    </div>
  );
}
