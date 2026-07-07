import { useMemo } from 'react';
import type { WordFreq } from '../data/mockFunData';

interface WordCloudProps {
  words: WordFreq[];
}

const CARD_COLORS = ['var(--red)', 'var(--blue)', 'var(--yellow)', 'var(--green)', 'var(--purple)', 'var(--pink)', 'var(--orange)'];

export function WordCloud({ words }: WordCloudProps) {
  const maxCount = useMemo(() => Math.max(...words.map((w) => w.count)), [words]);

  const total = words.reduce((s, w) => s + w.count, 0);

  return (
    <div className="card">
      <h2 className="card-title">🔤 As palavras que você mais usa</h2>
      <p className="card-subtitle">
        Spoiler: "kkkk" está no topo e não é nem um pouco surpreendente.
        Você escreveu "kkkk" {words[0]?.count.toLocaleString()} vezes. Procure ajuda.
      </p>

      <div className="wordcloud">
        {words.map((w, i) => {
          const ratio = w.count / maxCount;
          const size = 0.65 + ratio * 1.6;
          const color = CARD_COLORS[i % CARD_COLORS.length];
          const rotation = (i % 5) * 3 - 6;

          return (
            <span
              key={w.word}
              className="wordcloud-word"
              style={{
                fontSize: `${size}rem`,
                color,
                transform: `rotate(${rotation}deg)`,
                opacity: 0.4 + ratio * 0.6,
                order: Math.floor(Math.random() * words.length),
              }}
              title={`${w.word}: ${w.count.toLocaleString()} vezes`}
            >
              {w.word}
            </span>
          );
        })}
      </div>

      <p className="chart-footer">
        🗣️ Você já digitou {total.toLocaleString()} palavras repetidas. Isso é {total > 10000 ? 'preocupante' : 'normal'}.
      </p>
    </div>
  );
}
