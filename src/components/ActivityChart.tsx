import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HourlyActivity } from '../data/mockFunData';

interface ActivityChartProps {
  data: HourlyActivity[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const peak = [...data].sort((a, b) => b.tweets - a.tweets)[0];
  const sleep = data.filter((d) => d.hour >= 0 && d.hour <= 5).reduce((s, d) => s + d.tweets, 0);

  return (
    <div className="card">
      <h2 className="card-title">⏰ Seu Relógio Comportamental</h2>
      <p className="card-subtitle">
        Você posta mais às <strong>{peak.hour}h</strong> com {peak.tweets} tweets.
        {peak.hour >= 22 || peak.hour <= 4
          ? ' Isso explica MUITA coisa. Vai dormir.'
          : ' Horário comercial. Chato, mas saudável.'}
        {' '}E à{' '}
        {sleep > 500 ? 'madrugada' : 'noite'} você já postou {sleep.toLocaleString()} tweets.
        {sleep > 500 ? ' Você tem problemas. E a gente ama.' : ' Dá pra piorar.'}
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <defs>
            <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b388ff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#b388ff" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            interval={2}
          />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-card)',
              border: '3px solid var(--border-strong)',
              borderRadius: 12,
              boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
            }}
            formatter={(value) => [`${value} tweets`, 'Atividade']}
            labelFormatter={(label) => `${label}`}
          />
          <Area
            type="monotone"
            dataKey="tweets"
            stroke="#b388ff"
            strokeWidth={3}
            fill="url(#activityGrad)"
            dot={false}
            activeDot={{ r: 6, fill: '#b388ff', stroke: 'var(--bg-card)', strokeWidth: 3 }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="activity-peak">
        <span>🌙 Horário de pico: <strong>{peak.hour}h</strong></span>
        <span>📉 Horário morto: <strong>{[...data].sort((a, b) => a.tweets - b.tweets)[0].hour}h</strong></span>
      </div>

      <p className="chart-footer">
        * Se o gráfico mostrar atividade entre 0h-5h, você precisa de terapia. Nós também.
      </p>
    </div>
  );
}
