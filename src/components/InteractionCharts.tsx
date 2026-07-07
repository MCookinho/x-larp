import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, Legend,
} from 'recharts';
import type { Interaction, ContextType } from '../types';
import { contextLabels } from '../data/mockData';

interface InteractionChartsProps {
  interactions: Interaction[];
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#34D399',
  '#F472B6', '#60A5FA', '#FBBF24', '#F97316', '#8B5CF6',
];

export function InteractionCharts({ interactions }: InteractionChartsProps) {
  const [chartType, setChartType] = useState<'bar' | 'radar'>('bar');
  const [selectedContext, setSelectedContext] = useState<ContextType | 'all'>('all');

  const contexts = [...new Set(interactions.map((i) => i.context))] as ContextType[];

  const filteredInteractions = selectedContext === 'all'
    ? interactions
    : interactions.filter((i) => i.context === selectedContext);

  const topByContext = filteredInteractions
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const radarData = contexts.map((ctx) => {
    const ctxInteractions = interactions.filter((i) => i.context === ctx);
    const total = ctxInteractions.reduce((sum, i) => sum + i.count, 0);
    return {
      context: contextLabels[ctx],
      total,
    };
  });

  const userNameMap = new Map<string, string>();
  filteredInteractions.forEach((i) => {
    if (!userNameMap.has(i.user.username)) {
      userNameMap.set(i.user.username, i.user.displayName);
    }
  });

  return (
    <div className="card">
      <div className="card-header-row">
        <h2 className="card-title">🗣️ Quem você mais enche o saco (por contexto)</h2>
        <div className="chart-controls">
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value as ContextType | 'all')}
            className="chart-select"
          >
            <option value="all">Todos os contextos 🌈</option>
            {contexts.map((ctx) => (
              <option key={ctx} value={ctx}>
                {contextLabels[ctx]}
              </option>
            ))}
          </select>
          <div className="chart-toggle">
            <button
              className={`toggle-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              📊 Barras
            </button>
            <button
              className={`toggle-btn ${chartType === 'radar' ? 'active' : ''}`}
              onClick={() => setChartType('radar')}
            >
              🕸️ Radar
            </button>
          </div>
        </div>
      </div>

      {chartType === 'bar' ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={topByContext} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="user.displayName"
              tick={{ fill: '#aaa', fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fill: '#aaa' }} />
            <Tooltip
              contentStyle={{ background: '#1a1a2e', border: '1px solid #e94560', borderRadius: 8 }}
              formatter={(value, _name, props) => [
                `${value} interações`,
                `@${props?.payload?.user?.username ?? 'desconhecido'}`,
              ]}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {topByContext.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#333" />
            <PolarAngleAxis dataKey="context" tick={{ fill: '#ccc', fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fill: '#aaa' }} />
            <Radar
              name="Interações"
              dataKey="total"
              stroke="#4ECDC4"
              fill="#4ECDC4"
              fillOpacity={0.3}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      )}

      <p className="chart-footer">
        * Dados coletados do último mês. Sim, você fala MUITO com {topByContext[0]?.user.displayName || 'ninguém'}.
      </p>
    </div>
  );
}
