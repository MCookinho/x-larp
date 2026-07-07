import type { ContextType, Tweet as TweetType, User, Interaction, AccountStats } from '../types';
import type { WordFreq, HourlyActivity, Clone, Persona } from '../data/mockFunData';
import type { ScrapedUser, ScrapedTweet } from '../services/api';

const stopWords = new Set([
  'de', 'da', 'do', 'das', 'dos', 'a', 'o', 'e', 'é', 'que', 'em', 'no', 'na',
  'um', 'uma', 'pra', 'pro', 'com', 'se', 'por', 'para', 'os', 'as', 'ao',
  'aos', 'às', 'mas', 'mas', 'como', 'já', 'mais', 'muito', 'quem', 'tem',
  'todo', 'tudo', 'ser', 'estar', 'foi', 'era', 'são', 'não', 'sim', 'até',
  'só', 'vai', 'vou', 'vem', 'faz', 'fez', 'ter', 'teve', 'teria', 'terá',
  'me', 'te', 'se', 'lhe', 'nos', 'vos', 'lhes', 'minha', 'minhas', 'meu',
  'meus', 'sua', 'suas', 'seu', 'seus', 'nossa', 'nossas', 'nosso', 'nossos',
  'essa', 'esse', 'isso', 'isso', 'esta', 'este', 'isto', 'aquele', 'aquela',
  'eles', 'elas', 'nós', 'você', 'vocês', 'tua', 'tuas', 'teu', 'teus',
  'https', 't', 'co', 'rt', 'kkkk', 'kkk', 'kk',
]);

const contextKeywords: [ContextType, RegExp[]][] = [
  ['humor', [/(kkkk+)|(kkk)|(k{k2,})|(lol)|(piada)|(engraçad)|(haha)|(ahsu)/i, /😂|🤣|🤡/]],
  ['flerte', [/(crush)|(amor)|(linda?[oa])|(gata[oa]?)|(paquera)|(ficante)|(namor)|(beijar)/i, /😍|🥰|😏|💕|💘/]],
  ['tristeza', [/(triste)|(solo)|(sozinh)|(saudad)|(chora)|(lágrima)|(depress)/i, /😭|💔|🥺/]],
  ['raiva', [/(ódio)|(put[oa])|(raiva)|(ódio)|(cansei)|(chega)|(inaceit)/i, /😤|🤬|💢/]],
  ['reflexao', [/(penso)|(reflexão)|(será)|(talvez)|(existênc)|(sentido da vida)|(filosof)/i, /🤔|🧐/]],
  ['curiosidade', [/(curiosidade)|(sabia)|(interessante)|(fato)|(curioso)|(você sab)/i, /🤓|📚/]],
  ['politica', [/(política)|(governo)|(presidente)|(eleição)|(congresso)|(senado)|(partido)|(esquerd)|(direit)/i, /🔥|💀/]],
  ['nerdola', [/(código)|(react)|(programador)|(nerd)|(desenvolvedo)|(codar)|(bug)|(dev\b)|(framework)|(api\b)/i, /🤓|💻|🖥️/]],
  ['desabafo', [/(desabafo)|(cansad[oa])|(ansiedade)|(terapia)|(psicólogo)|(desabafa)|(preciso desabafar)/i, /💔|😔|🫂/]],
];

const cloneDefinitions = [
  { name: 'Meme Lord', emoji: '🤡', color: '#FF4757', description: 'Posta meme repetido e acha que é original' },
  { name: 'Filósofo 3h AM', emoji: '🤔', color: '#b388ff', description: 'Insights profundos sobre o vazio da existência (e do feed)' },
  { name: 'Depressivo Romântico', emoji: '😭', color: '#4d9eff', description: 'Triste pelo amor não correspondido (e pelo engajamento)' },
  { name: 'Politicólogo Amador', emoji: '🔥', color: '#FFC048', description: 'Resolveu o Brasil em 280 caracteres (spoiler: não resolveu)' },
  { name: 'Vendedor de Curso', emoji: '💰', color: '#2ED573', description: '"Como faturei 10k dormindo" — mentira, não faturou' },
  { name: 'Bot Humano', emoji: '🤖', color: '#FF6B9D', description: 'Responde com "kkkk" em tudo. É humano? Ninguém sabe.' },
];

function classifyContext(text: string): ContextType {
  for (const [ctx, patterns] of contextKeywords) {
    if (patterns.some((p) => p.test(text))) return ctx;
  }
  return 'resenha';
}

function computeCringeLevel(tweets: ScrapedTweet[], user: ScrapedUser): number {
  if (tweets.length === 0) return 30;
  const avgRetweets = tweets.reduce((s, t) => s + t.retweets, 0) / tweets.length;
  const avgLikes = tweets.reduce((s, t) => s + t.likes, 0) / tweets.length;
  const ratio = user.followersCount > 0 ? user.followingCount / user.followersCount : 0;
  let score = 30;
  if (avgLikes > 0 && avgRetweets / avgLikes > 0.5) score += 15;
  if (ratio > 2) score += 20;
  if (user.tweetCount > 50000) score += 10;
  if (tweets.some((t) => /copypasta|pasta|viral/i.test(t.text))) score += 10;
  return Math.min(99, score);
}

export function computeAltAccountProb(tweets: ScrapedTweet[], user: ScrapedUser): number {
  let prob = 10;
  if (user.followingCount > 0 && user.followersCount / user.followingCount < 0.1) prob += 25;
  if (user.tweetCount > 0 && user.followersCount / user.tweetCount < 0.01) prob += 20;
  if (tweets.filter((t) => /segue de volta|follow back|f4f/i.test(t.text)).length > 3) prob += 20;
  if (user.verified) prob = Math.max(5, prob - 15);
  return Math.min(99, prob);
}

export interface DerivedData {
  tweets: TweetType[];
  wordCloud: WordFreq[];
  hourlyActivity: HourlyActivity[];
  interactions: Interaction[];
  bestFriends: { user: User; mutualInteractions: number; contexts: ContextType[] }[];
  persona: Persona;
  clones: Clone[];
  stats: AccountStats;
  shameMessages: string[];
  translations: Record<string, string>;
  copypastaScores: Record<string, number>;
}

export function deriveData(scrapedUser: ScrapedUser, scrapedTweets: ScrapedTweet[]): DerivedData {
  const tweets: TweetType[] = scrapedTweets.map((t) => ({
    id: t.id,
    text: t.text,
    likes: t.likes,
    retweets: t.retweets,
    replies: t.replies,
    views: t.views,
    quotes: t.quotes,
    bookmarks: t.bookmarks,
    createdAt: t.createdAt,
    context: classifyContext(t.text),
  }));

  const hourBuckets = new Array(24).fill(0);
  for (const t of scrapedTweets) {
    const h = new Date(t.createdAt).getHours();
    if (h >= 0 && h < 24) hourBuckets[h]++;
  }
  const hourlyActivity: HourlyActivity[] = hourBuckets.map((c, h) => ({
    hour: h,
    tweets: c,
    label: `${h}h`,
  }));

  const wordCounts = new Map<string, number>();
  for (const t of scrapedTweets) {
    const words = t.text
      .toLowerCase()
      .replace(/[^a-záéíóúâêîôûãõàèìòùäëïöüç\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
    for (const w of words) {
      wordCounts.set(w, (wordCounts.get(w) ?? 0) + 1);
    }
  }
  const wordCloud: WordFreq[] = [...wordCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([word, count]) => ({ word, count }));

  const mentionMap = new Map<string, { username: string; name: string; count: number; contexts: Set<ContextType> }>();
  for (const t of scrapedTweets) {
    const ctx = classifyContext(t.text);
    for (const m of t.mentions) {
      const key = m.username.toLowerCase();
      if (!mentionMap.has(key)) {
        mentionMap.set(key, { username: m.username, name: m.name, count: 0, contexts: new Set() });
      }
      mentionMap.get(key)!.count++;
      mentionMap.get(key)!.contexts.add(ctx);
    }
  }
  const mentionUsers = [...mentionMap.values()].sort((a, b) => b.count - a.count);

  const interactions: Interaction[] = mentionUsers.flatMap((m) =>
    [...m.contexts].map((ctx) => ({
      user: {
        id: m.username,
        username: m.username,
        displayName: m.name || m.username,
        avatarUrl: `https://unavatar.io/${m.username}`,
        isVerified: false,
      },
      count: m.count,
      context: ctx,
    }))
  ).slice(0, 20);

  const bestFriends = mentionUsers.slice(0, 10).map((m) => ({
    user: {
      id: m.username,
      username: m.username,
      displayName: m.name || m.username,
      avatarUrl: `https://unavatar.io/${m.username}`,
      isVerified: false,
    },
    mutualInteractions: m.count,
    contexts: [...m.contexts] as ContextType[],
  }));

  const contextCounts = new Map<ContextType, number>();
  for (const t of tweets) {
    contextCounts.set(t.context, (contextCounts.get(t.context) ?? 0) + 1);
  }
  const sortedContexts = [...contextCounts.entries()].sort((a, b) => b[1] - a[1]);
  const topContext = sortedContexts[0]?.[0] ?? 'resenha';

  const cringeLevel = computeCringeLevel(scrapedTweets, scrapedUser);
  const ratio = scrapedUser.followersCount > 0
    ? Number((scrapedUser.followingCount / scrapedUser.followersCount).toFixed(1))
    : 0;

  const bestFriendName = bestFriends[0]?.user?.displayName ?? 'ninguém';

  const totalTweetsFromScraped = scrapedUser.tweetCount || scrapedTweets.length;

  const stats: AccountStats = {
    totalTweets: totalTweetsFromScraped,
    totalFollowers: scrapedUser.followersCount,
    totalFollowing: scrapedUser.followingCount,
    topContext,
    bestFriend: bestFriendName,
    cringeLevel,
    ratio,
  };

  const ctxPcts: Record<string, number> = {};
  const total = tweets.length || 1;
  for (const [ctx, count] of contextCounts) {
    ctxPcts[ctx] = (count / total) * 100;
  }

  const clones: Clone[] = cloneDefinitions.map((def) => {
    const cloneContextMap: Record<string, ContextType[]> = {
      'Meme Lord': ['humor'],
      'Filósofo 3h AM': ['reflexao'],
      'Depressivo Romântico': ['tristeza', 'flerte'],
      'Politicólogo Amador': ['politica'],
      'Vendedor de Curso': ['curiosidade'],
      'Bot Humano': ['resenha'],
    };
    const matchedKeys = cloneContextMap[def.name] ?? (['resenha'] as ContextType[]);

    const pct = matchedKeys.reduce((s, k) => s + (ctxPcts[k] ?? 0), 0);
    const adjusted = Math.max(3, Math.min(70, Math.round(pct || def.name === 'Bot Humano' ? 8 : 10)));
    return { ...def, percentage: adjusted };
  });

  const remaining = 100 - clones.reduce((s, c) => s + c.percentage, 0);
  if (remaining > 0) clones[0].percentage += remaining;

  const altProb = computeAltAccountProb(scrapedTweets, scrapedUser);

  const personaEmojis = ['🤔', '🤡', '😭', '🔥', '💀', '🤓', '😏', '💅'];
  const personaTitles: Record<string, string> = {
    humor: 'O Comediante do Sofá',
    reflexao: 'O Filósofo 3h da Manhã',
    tristeza: 'O Depressivo Romântico',
    politica: 'O Politicólogo de Boteco',
    flerte: 'O Romântico Desesperado',
    nerdola: 'O Dev que Não Dorme',
    desabafo: 'O Desabafador Serial',
    curiosidade: 'O Curioso Inútil',
    resenha: 'O Resenhista de Plantão',
    raiva: 'O Revoltado Online',
  };

  const persona: Persona = {
    title: `${personaEmojis[sortedContexts[0]?.[1] ?? 0 % personaEmojis.length]} ${personaTitles[topContext] ?? 'O Mistério do X'}`,
    subtitle: topContext === 'reflexao'
      ? 'Especialista em soluções que nunca saem do papel'
      : `Seu contexto principal é "${topContext}" com ${sortedContexts[0]?.[1] ?? 0} tweets`,
    description: `Com ${scrapedTweets.length} tweets analisados, seu arquétipo principal é ${topContext}. ${altProb > 50 ? 'Grandes chances de ser conta alternativa 👀' : 'Parece ser sua conta principal.'} ${cringeLevel > 60 ? 'Nível de cringe alarmante.' : 'Nível de cringe aceitável.'}`,
    emoji: personaEmojis[0],
    color: cloneDefinitions[clones.indexOf(clones[0])]?.color ?? 'var(--purple)',
  };

  const shameMessages = [
    'Esse tweet deveria vir com um aviso: "Contém vergonha alheia"',
    'Se tweet fosse crime, isso aqui era prisão perpétua',
    'Quem deu like nisso precisa de uma investigação',
    'Você realmente escreveu isso e pensou "boa"',
    'Esse tweet tem mais bandeira vermelha que corrida de fórmula 1',
    'Isso é o equivalente textual de um cartão de "desculpa pelo ocorrido"',
    'Esse tweet foi escrito num momento de delírio coletivo',
    'Se eu fosse você, deletava a conta. Mas não sou, então: 🔥',
    'Aqui vemos um espécime raro de tweet que nunca deveria ter saído do rascunho',
    'Esse tweet funciona melhor como print no Twitter do que como post original',
  ];

  const translations: Record<string, string> = {};
  const copypastaScores: Record<string, number> = {};
  for (const t of scrapedTweets) {
    copypastaScores[t.id] = Math.min(99, Math.round(
      (t.retweets > t.likes ? 20 : 0) +
      (/copypasta|pasta|viral|retweet/i.test(t.text) ? 20 : 0) +
      (t.retweets > 1000 ? 15 : 0) +
      (/kkkk+|haha|ashu|suah/i.test(t.text) ? 10 : 0) +
      Math.random() * 15
    ));
    translations[t.id] = '';
  }

  return {
    tweets,
    wordCloud,
    hourlyActivity,
    interactions,
    bestFriends,
    persona,
    clones,
    stats,
    shameMessages,
    translations,
    copypastaScores,
  };
}
