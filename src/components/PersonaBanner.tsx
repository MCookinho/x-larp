import { mockPersona } from '../data/mockFunData';
import { cringeLabels, ratioMessages } from '../data/mockFunData';

interface PersonaBannerProps {
  cringeLevel: number;
  ratio: number;
  altAccountProb: number;
}

function CringeGauge({ value }: { value: number }) {
  const radius = 70;
  const circumference = Math.PI * radius;
  const filled = (value / 100) * circumference;
  const labelObj = [...cringeLabels].reverse().find((l) => value >= l.threshold) ?? cringeLabels[0];

  const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const start = polarToCartesian(80, 80, radius, 180);
  const end = polarToCartesian(80, 80, radius, 0);

  return (
    <div className="gauge">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path
          d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`}
          fill="none"
          stroke="url(#cringeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset={0}
          style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
        />
        <defs>
          <linearGradient id="cringeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2ED573" />
            <stop offset="40%" stopColor="#FFC048" />
            <stop offset="70%" stopColor="#FF6348" />
            <stop offset="100%" stopColor="#FF4757" />
          </linearGradient>
        </defs>
      </svg>
      <div className="gauge-value">
        <span className="gauge-num">{value}%</span>
        <span className="gauge-label">{labelObj.emoji} {labelObj.label}</span>
      </div>
    </div>
  );
}

export function PersonaBanner({ cringeLevel, ratio, altAccountProb }: PersonaBannerProps) {
  const ratioMsg = ratioMessages[Math.min(Math.floor(ratio), ratioMessages.length - 1)];

  return (
    <div className="card persona-card">
      <div className="persona-grid">
        <div className="persona-main">
          <div className="persona-header">
            <span className="persona-emoji">{mockPersona.emoji}</span>
            <div>
              <h2 className="card-title">{mockPersona.title}</h2>
              <p className="persona-subtitle">{mockPersona.subtitle}</p>
            </div>
          </div>
          <p className="persona-desc">{mockPersona.description}</p>
          <div className="persona-tags">
            <span className="persona-tag" style={{ borderColor: 'var(--red)' }}>🥇 Meme Lord</span>
            <span className="persona-tag" style={{ borderColor: 'var(--blue)' }}>🌙 Notívago</span>
            <span className="persona-tag" style={{ borderColor: 'var(--green)' }}>💔 Carente</span>
            <span className="persona-tag" style={{ borderColor: 'var(--yellow)' }}>🔥 Polêmico</span>
          </div>
        </div>

        <div className="persona-meters">
          <div className="meter-item">
            <h3 className="meter-title">📈 Nível de Cringe</h3>
            <CringeGauge value={cringeLevel} />
          </div>

          <div className="meter-item">
            <h3 className="meter-title">💀 Like/View Ratio</h3>
            <div className="ratio-display">
              <span className="ratio-value">{ratio.toFixed(1)}</span>
              <span className="ratio-msg">{ratioMsg}</span>
            </div>
          </div>

          <div className="meter-item">
            <h3 className="meter-title">🕵️ Conta Fake?</h3>
            <div className="alt-display">
              <div className="alt-bar-bg">
                <div
                  className="alt-bar-fill"
                  style={{ width: `${altAccountProb}%` }}
                />
              </div>
              <span className="alt-value">{altAccountProb}% de chance</span>
              <span className="alt-msg">
                {altAccountProb > 70
                  ? 'Vaza, Robozinho 🤖'
                  : altAccountProb > 40
                  ? 'Suspeito... 🧐'
                  : 'Humano (provavelmente) ✅'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
