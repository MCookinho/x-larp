import { useState } from 'react';
import type { FollowerEvent } from '../types';

interface FollowerTrackerProps {
  events: FollowerEvent[];
}

const typeConfig = {
  follow: { emoji: '✅', label: 'Seguiu', color: '#34D399' },
  unfollow: { emoji: '❌', label: 'Deixou de Seguir', color: '#FF6B6B' },
  block: { emoji: '🚫', label: 'Bloqueou', color: '#F97316' },
  mute: { emoji: '🔇', label: 'Mutou', color: '#A78BFA' },
};

export function FollowerTracker({ events }: FollowerTrackerProps) {
  const [filter, setFilter] = useState<FollowerEvent['type'] | 'all'>('all');
  const [trackingEnabled, setTrackingEnabled] = useState(true);

  const filtered = filter === 'all' ? events : events.filter((e) => e.type === filter);

  return (
    <div className="card">
      <div className="card-header-row">
        <h2 className="card-title">🕵️ Rastreador de Seguidores</h2>
        <label className="tracking-toggle">
          <input
            type="checkbox"
            checked={trackingEnabled}
            onChange={() => setTrackingEnabled(!trackingEnabled)}
          />
          <span className="toggle-slider" />
          <span className="toggle-label">
            {trackingEnabled ? '🔎 Vigilância Ativa' : '😴 Vigilância Desligada'}
          </span>
        </label>
      </div>

      {!trackingEnabled ? (
        <div className="tracking-disabled">
          <p>😴 Vigilância desligada. Enquanto isso, o @gatos_depressivos deixou de te seguir.</p>
          <p className="tracking-sub">Brincadeira. Ou não. Ativa aí pra descobrir.</p>
        </div>
      ) : (
        <>
          <p className="card-subtitle">
            Quem está te evitando, te bloqueando ou te seguindo ( provavelmente por engano)
          </p>

          <div className="filter-buttons event-filter">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos 📋
            </button>
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <button
                key={key}
                className={`filter-btn ${filter === key ? 'active' : ''}`}
                style={filter === key ? { background: cfg.color } : {}}
                onClick={() => setFilter(key as FollowerEvent['type'])}
              >
                {cfg.emoji} {cfg.label}
              </button>
            ))}
          </div>

          <div className="event-list">
            {filtered.map((event) => {
              const cfg = typeConfig[event.type];
              return (
                <div key={event.id} className="event-card" style={{ borderLeftColor: cfg.color }}>
                  <div className="event-avatar">
                    <img
                      src={event.user.avatarUrl}
                      alt={event.user.displayName}
                      className="avatar-img"
                    />
                  </div>
                  <div className="event-info">
                    <div className="event-user">
                      <strong>{event.user.displayName}</strong>
                      <span className="event-username">@{event.user.username}</span>
                      {event.user.isVerified && <span className="verified-badge">✔️</span>}
                    </div>
                    <div className="event-type" style={{ color: cfg.color }}>
                      {cfg.emoji} {cfg.label}
                    </div>
                    {event.reason && (
                      <div className="event-reason">"{event.reason}"</div>
                    )}
                  </div>
                  <div className="event-time">
                    {new Date(event.timestamp).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <p>🤷 Nenhum evento desse tipo. Talvez você não seja tão relevante (ou tão irritante) assim.</p>
            </div>
          )}
        </>
      )}

      <p className="chart-footer">
        🔔 O rastreador verifica a cada 6 horas. Se você não viu diferença, é porque ninguém liga.
        (brinks... ou não)
      </p>
    </div>
  );
}
