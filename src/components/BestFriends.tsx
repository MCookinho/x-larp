import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { contextLabels } from '../data/mockData';
import type { ContextType, User } from '../types';

interface BestFriendEntry {
  user: User;
  mutualInteractions: number;
  contexts: ContextType[];
}

interface BestFriendsProps {
  friends: BestFriendEntry[];
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#34D399', '#F472B6', '#60A5FA', '#FBBF24'];

export function BestFriends({ friends }: BestFriendsProps) {
  const data = [...friends].sort((a, b) => b.mutualInteractions - a.mutualInteractions);

  return (
    <div className="card">
      <h2 className="card-title">👥 Melhores Amigos (ou algo assim)</h2>
      <p className="card-subtitle">
        As pessoas com quem você mais interage. Parabéns, você tem uma bolha.
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#aaa' }} />
          <YAxis
            type="category"
            dataKey="user.displayName"
            tick={{ fill: '#ccc', fontSize: 13 }}
            width={120}
          />
          <Tooltip
            contentStyle={{ background: '#1a1a2e', border: '1px solid #e94560', borderRadius: 8 }}
            formatter={(value, _name, props) => [
              `${value} interações`,
              `@${props?.payload?.user?.username ?? 'desconhecido'}`,
            ]}
          />
          <Bar dataKey="mutualInteractions" radius={[0, 8, 8, 0]}>
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="friend-contexts">
        {data.map((friend) => (
          <div key={friend.user.id} className="friend-context-tag">
            <span className="friend-name">@{friend.user.username}</span>
            <div className="friend-context-list">
              {friend.contexts.map((ctx) => (
                <span key={ctx} className="context-badge">
                  {contextLabels[ctx]}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="chart-footer">
        🏆 O prêmio de "maior abusado" vai para @{data[0]?.user.username} com {data[0]?.mutualInteractions} interações.
        Respira, amigo.
      </p>
    </div>
  );
}
