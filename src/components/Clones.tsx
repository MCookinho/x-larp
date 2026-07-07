import { mockClones } from '../data/mockFunData';
import type { Clone } from '../data/mockFunData';

interface ClonesProps {
  clones?: Clone[];
}

export function Clones({ clones }: ClonesProps) {
  const data = clones ?? mockClones;
  const sorted = [...data].sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="card">
      <h2 className="card-title">👥 Seus Clones</h2>
      <p className="card-subtitle">
        Sua personalidade no Twitter dividida em arquétipos. Sim, você tem múltiplas personalidades.
        E nenhuma delas é surpreendente.
      </p>

      <div className="clones-bar">
        {sorted.map((clone) => (
          <div
            key={clone.name}
            className="clones-bar-segment"
            style={{
              width: `${clone.percentage}%`,
              background: clone.color,
            }}
            title={`${clone.name}: ${clone.percentage}%`}
          />
        ))}
      </div>

      <div className="clones-stats">
        {sorted.map((clone) => (
          <div key={clone.name} className="clone-item">
            <div className="clone-header">
              <span className="clone-emoji">{clone.emoji}</span>
              <span className="clone-name">{clone.name}</span>
              <span className="clone-pct">{clone.percentage}%</span>
            </div>
            <p className="clone-desc">{clone.description}</p>
          </div>
        ))}
      </div>

      <p className="chart-footer">
        🧬 Seu clone dominante é "{sorted[0].name}" com {sorted[0].percentage}%.
        {sorted[0].percentage > 30 ? ' Preocupante, mas esperado.' : ' Tá equilibrado.'}
      </p>
    </div>
  );
}
