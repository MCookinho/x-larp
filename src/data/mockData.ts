import type { Tweet, User, Interaction, FollowerEvent, AccountStats, ContextType } from '../types';

export const contextLabels: Record<ContextType, string> = {
  resenha: 'Resenha 👀',
  flerte: 'Flerte 😏',
  tristeza: 'Tristeza 😭',
  raiva: 'Raiva 😤',
  reflexao: 'Reflexão 🤔',
  humor: 'Humor 🤡',
  curiosidade: 'Curiosidade ❓',
  politica: 'Política 🔥',
  nerdola: 'Nerdola 🤓',
  desabafo: 'Desabafo 💔',
};

const users: User[] = [
  { id: '1', username: 'gatos_depressivos', displayName: 'Gatos Depressivos', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=gatos', isVerified: true },
  { id: '2', username: 'mestre_dos_pcs', displayName: 'Mestre dos PCs', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=pc', isVerified: false },
  { id: '3', username: 'pao_de_queijo_sp', displayName: 'Pão de Queijo Supremo', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=pao', isVerified: true },
  { id: '4', username: 'tristeza_nerd', displayName: 'Tristeza Nerd', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=tristeza', isVerified: false },
  { id: '5', username: 'brasil_sil_sil', displayName: 'Brasil Sil Sil', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=brasil', isVerified: true },
  { id: '6', username: 'cafemante', displayName: 'Cafemante', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=cafe', isVerified: false },
  { id: '7', username: 'sociedade_do_sono', displayName: 'Sociedade do Sono', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=sono', isVerified: false },
  { id: '8', username: 'teoria_da_conspiracao', displayName: 'Teoria da Conspiração', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=teoria', isVerified: true },
  { id: '9', username: 'memes_antigos', displayName: 'Memes Antigos', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=memes', isVerified: false },
  { id: '10', username: 'filosofia_de_buteco', displayName: 'Filosofia de Buteco', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=filosofia', isVerified: true },
  { id: '11', username: 'lovelace_moderno', displayName: 'Lovelace Moderno', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=lovelace', isVerified: false },
  { id: '12', username: 'bot_do_apocalipse', displayName: 'Bot do Apocalipse', avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=apocalipse', isVerified: false },
];

export const mockTweets: Tweet[] = [
  { id: 't1', text: 'acabei de ver um gato na rua e chorei. ele me lembrou minhas dividas', likes: 15472, retweets: 4321, replies: 892, views: 502000, quotes: 234, bookmarks: 5678, createdAt: '2026-06-15T14:30:00Z', context: 'tristeza' },
  { id: 't2', text: 'cara, se eu montar um pc com water cooler de leite condensado funciona? perguntando pra um amigo', likes: 8921, retweets: 2345, replies: 1567, views: 320000, quotes: 567, bookmarks: 1234, createdAt: '2026-06-14T10:00:00Z', context: 'nerdola' },
  { id: 't3', text: 'vc n é feio, vc só tem o azar de existir em 4k 😔✌️', likes: 42300, retweets: 12300, replies: 2341, views: 890000, quotes: 1567, bookmarks: 9876, createdAt: '2026-06-13T20:00:00Z', context: 'humor' },
  { id: 't4', text: 'a dilma falando de abelhas é literalmente eu tentando explicar meus sentimentos', likes: 67123, retweets: 18900, replies: 3456, views: 1200000, quotes: 2345, bookmarks: 14567, createdAt: '2026-06-12T08:15:00Z', context: 'politica' },
  { id: 't5', text: 'sera que se eu responder com "kkkk" ela sente algo? 5 horas de silencio radio', likes: 3210, retweets: 567, replies: 890, views: 150000, quotes: 89, bookmarks: 2345, createdAt: '2026-06-11T23:45:00Z', context: 'flerte' },
  { id: 't6', text: 'o Brasil é tipo aquele amigo que fala "vamos marcar" e nunca marca. 524 anos de "vamos marcar sim"', likes: 28900, retweets: 8900, replies: 1234, views: 750000, quotes: 890, bookmarks: 5678, createdAt: '2026-06-10T16:20:00Z', context: 'resenha' },
  { id: 't7', text: 'e se a gente for só simulações de um universo onde o zap zap nunca foi criado? mind blowing', likes: 4567, retweets: 1234, replies: 2345, views: 200000, quotes: 345, bookmarks: 3456, createdAt: '2026-06-09T12:00:00Z', context: 'reflexao' },
  { id: 't8', text: 'toda vez que eu vejo um passarinho eu penso "caralho, um dinossauro"', likes: 34500, retweets: 10200, replies: 4567, views: 950000, quotes: 1234, bookmarks: 7890, createdAt: '2026-06-08T09:30:00Z', context: 'curiosidade' },
  { id: 't9', text: 'estou a 3 dias sem dormir tentando fazer um deploy funcionar. ja aceitei que o erro 402 é pessoal', likes: 12300, retweets: 3400, replies: 2100, views: 420000, quotes: 567, bookmarks: 4567, createdAt: '2026-06-07T22:10:00Z', context: 'desabafo' },
  { id: 't10', text: 'quem inventou o segundo turno das 20h da noite de segunda-feira merece um lugar especial no inferno', likes: 56700, retweets: 15000, replies: 7890, views: 1500000, quotes: 2345, bookmarks: 12345, createdAt: '2026-06-06T18:00:00Z', context: 'raiva' },
  { id: 't11', text: 'ela: "só amigos" eu, dormindo no quarto dela as 3 da manhã: 😴🤝😴', likes: 23400, retweets: 6700, replies: 1234, views: 680000, quotes: 890, bookmarks: 6789, createdAt: '2026-06-05T03:00:00Z', context: 'flerte' },
  { id: 't12', text: 'o pior sentimento é quando vc termina uma série e n tem ngm pra discutir teorias. solidao nerdola', likes: 8900, retweets: 2345, replies: 3456, views: 300000, quotes: 456, bookmarks: 3456, createdAt: '2026-06-04T15:45:00Z', context: 'nerdola' },
  { id: 't13', text: 'as vezes eu olho pro céu e penso: "puta merda, to pagando boleto pra existir?"', likes: 78900, retweets: 21000, replies: 6789, views: 2000000, quotes: 3456, bookmarks: 23456, createdAt: '2026-06-03T11:20:00Z', context: 'reflexao' },
  { id: 't14', text: 'todo mundo fala de ansiedade mas ninguém fala que o palmeiras NÃO TEM MUNDIAL', likes: 45600, retweets: 13000, replies: 23456, views: 1200000, quotes: 4567, bookmarks: 8901, createdAt: '2026-06-02T19:30:00Z', context: 'resenha' },
  { id: 't15', text: 'descobri que meu ex segue 500 contas de gato. nunca amou ninguém além dos felinos', likes: 6700, retweets: 1800, replies: 2345, views: 250000, quotes: 345, bookmarks: 4567, createdAt: '2026-06-01T21:00:00Z', context: 'tristeza' },
];

export const mockInteractions: Interaction[] = [
  { user: users[0], count: 342, context: 'tristeza' },
  { user: users[1], count: 289, context: 'nerdola' },
  { user: users[2], count: 256, context: 'humor' },
  { user: users[3], count: 234, context: 'tristeza' },
  { user: users[4], count: 221, context: 'politica' },
  { user: users[5], count: 198, context: 'desabafo' },
  { user: users[6], count: 187, context: 'reflexao' },
  { user: users[7], count: 176, context: 'curiosidade' },
  { user: users[8], count: 165, context: 'humor' },
  { user: users[9], count: 154, context: 'resenha' },
  { user: users[10], count: 143, context: 'nerdola' },
  { user: users[11], count: 132, context: 'raiva' },
  { user: users[0], count: 98, context: 'flerte' },
  { user: users[3], count: 87, context: 'flerte' },
  { user: users[5], count: 76, context: 'flerte' },
  { user: users[9], count: 213, context: 'resenha' },
  { user: users[2], count: 198, context: 'resenha' },
  { user: users[4], count: 167, context: 'resenha' },
  { user: users[6], count: 145, context: 'resenha' },
  { user: users[1], count: 234, context: 'nerdola' },
  { user: users[10], count: 198, context: 'nerdola' },
  { user: users[7], count: 156, context: 'curiosidade' },
  { user: users[8], count: 145, context: 'curiosidade' },
  { user: users[11], count: 198, context: 'raiva' },
  { user: users[4], count: 187, context: 'raiva' },
  { user: users[5], count: 234, context: 'desabafo' },
  { user: users[0], count: 198, context: 'desabafo' },
  { user: users[3], count: 176, context: 'desabafo' },
  { user: users[9], count: 145, context: 'reflexao' },
  { user: users[6], count: 134, context: 'reflexao' },
];

export const mockFollowerEvents: FollowerEvent[] = [
  { id: 'f1', user: users[0], type: 'unfollow', timestamp: '2026-07-05T08:30:00Z', reason: 'não aguentou mais a depressão alheia' },
  { id: 'f2', user: users[3], type: 'follow', timestamp: '2026-07-04T22:15:00Z', reason: 'se identificou com o sofrimento' },
  { id: 'f3', user: users[8], type: 'block', timestamp: '2026-07-04T14:00:00Z', reason: 'postou meme repetido pela 500a vez' },
  { id: 'f4', user: users[5], type: 'follow', timestamp: '2026-07-03T19:45:00Z', reason: 'veio pelo café' },
  { id: 'f5', user: users[11], type: 'unfollow', timestamp: '2026-07-03T11:20:00Z', reason: 'profecia não se cumpriu' },
  { id: 'f6', user: users[2], type: 'follow', timestamp: '2026-07-02T16:30:00Z', reason: 'pão de queijo atrai todos' },
  { id: 'f7', user: users[6], type: 'mute', timestamp: '2026-07-02T09:00:00Z', reason: 'postava DEMAIS sobre sono' },
  { id: 'f8', user: users[7], type: 'follow', timestamp: '2026-07-01T20:10:00Z', reason: 'veio pelas teorias' },
  { id: 'f9', user: users[1], type: 'unfollow', timestamp: '2026-06-30T15:45:00Z', reason: 'montou o PC dos sonhos e vazou' },
  { id: 'f10', user: users[9], type: 'block', timestamp: '2026-06-29T12:30:00Z', reason: 'filosofia de buteco é demais pro feed' },
  { id: 'f11', user: users[4], type: 'follow', timestamp: '2026-06-28T10:00:00Z', reason: 'Brasil Sil Sil uni-vos' },
  { id: 'f12', user: users[10], type: 'unfollow', timestamp: '2026-06-27T23:59:00Z', reason: 'Lovelace não aprova suas práticas' },
];

export const bestFriends: { user: User; mutualInteractions: number; contexts: ContextType[] }[] = [
  { user: users[0], mutualInteractions: 534, contexts: ['tristeza', 'flerte', 'desabafo'] },
  { user: users[2], mutualInteractions: 478, contexts: ['humor', 'resenha'] },
  { user: users[1], mutualInteractions: 456, contexts: ['nerdola'] },
  { user: users[9], mutualInteractions: 412, contexts: ['resenha', 'reflexao'] },
  { user: users[4], mutualInteractions: 389, contexts: ['politica', 'resenha'] },
  { user: users[5], mutualInteractions: 345, contexts: ['desabafo', 'flerte'] },
  { user: users[3], mutualInteractions: 321, contexts: ['tristeza', 'flerte', 'desabafo'] },
  { user: users[10], mutualInteractions: 298, contexts: ['nerdola'] },
];

export const mockStats: AccountStats = {
  totalTweets: 15342,
  totalFollowers: 42890,
  totalFollowing: 1284,
  topContext: 'resenha',
  bestFriend: 'Gatos Depressivos',
  cringeLevel: 87,
  ratio: 3.2,
};

export const filterOptions = [
  { label: 'Mais Curtidas ❤️', value: 'likes' as keyof Tweet, emoji: '❤️' },
  { label: 'Mais Reposts 🔁', value: 'retweets' as keyof Tweet, emoji: '🔁' },
  { label: 'Mais Comentários 💬', value: 'replies' as keyof Tweet, emoji: '💬' },
  { label: 'Mais Views 👁️', value: 'views' as keyof Tweet, emoji: '👁️' },
  { label: 'Mais Quotes 📝', value: 'quotes' as keyof Tweet, emoji: '📝' },
  { label: 'Mais Salvos 🔖', value: 'bookmarks' as keyof Tweet, emoji: '🔖' },
];
