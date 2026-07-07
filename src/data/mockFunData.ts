export interface Persona {
  title: string;
  subtitle: string;
  description: string;
  emoji: string;
  color: string;
}

export interface WordFreq {
  word: string;
  count: number;
}

export interface HourlyActivity {
  hour: number;
  tweets: number;
  label: string;
}

export interface Clone {
  name: string;
  percentage: number;
  color: string;
  emoji: string;
  description: string;
}

export interface TweetExtra {
  translation: string;
  copypastaChance: number;
}

export const mockPersona: Persona = {
  title: '🤔 O Filósofo 3h da Manhã',
  subtitle: 'Especialista em soluções que nunca saem do papel',
  description: `Você tem insights existenciais depois da meia-noite e acha que descobriu o sentido da vida. Spoiler: não descobriu. Seus tweets parecem um "Penso, logo existo" escrito com os pés depois de 3 doses de café.`,
  emoji: '🤔',
  color: 'var(--purple)',
};

export const mockWords: WordFreq[] = [
  { word: 'kkkk', count: 5432 },
  { word: 'cara', count: 3210 },
  { word: 'tweetar', count: 2876 },
  { word: 'gente', count: 2543 },
  { word: 'coisa', count: 2210 },
  { word: 'mano', count: 1987 },
  { word: 'tipo', count: 1765 },
  { word: 'puta', count: 1543 },
  { word: 'merda', count: 1432 },
  { word: 'aff', count: 1321 },
  { word: 'sério', count: 1210 },
  { word: 'literalmente', count: 1109 },
  { word: 'bizarro', count: 987 },
  { word: 'foda', count: 876 },
  { word: 'crush', count: 765 },
  { word: 'sono', count: 654 },
  { word: 'triste', count: 598 },
  { word: 'feliz', count: 543 },
  { word: 'depressão', count: 432 },
  { word: 'pão de queijo', count: 321 },
  { word: 'café', count: 298 },
  { word: 'react', count: 265 },
  { word: 'nerd', count: 234 },
  { word: 'brasil', count: 210 },
  { word: 'palmeiras', count: 189 },
];

export const mockHourlyActivity: HourlyActivity[] = [
  { hour: 0, tweets: 312, label: '0h' },
  { hour: 1, tweets: 245, label: '1h' },
  { hour: 2, tweets: 189, label: '2h' },
  { hour: 3, tweets: 256, label: '3h' },
  { hour: 4, tweets: 134, label: '4h' },
  { hour: 5, tweets: 67, label: '5h' },
  { hour: 6, tweets: 45, label: '6h' },
  { hour: 7, tweets: 89, label: '7h' },
  { hour: 8, tweets: 156, label: '8h' },
  { hour: 9, tweets: 234, label: '9h' },
  { hour: 10, tweets: 312, label: '10h' },
  { hour: 11, tweets: 289, label: '11h' },
  { hour: 12, tweets: 345, label: '12h' },
  { hour: 13, tweets: 267, label: '13h' },
  { hour: 14, tweets: 234, label: '14h' },
  { hour: 15, tweets: 312, label: '15h' },
  { hour: 16, tweets: 289, label: '16h' },
  { hour: 17, tweets: 198, label: '17h' },
  { hour: 18, tweets: 234, label: '18h' },
  { hour: 19, tweets: 356, label: '19h' },
  { hour: 20, tweets: 423, label: '20h' },
  { hour: 21, tweets: 567, label: '21h' },
  { hour: 22, tweets: 678, label: '22h' },
  { hour: 23, tweets: 523, label: '23h' },
];

export const mockClones: Clone[] = [
  { name: 'Meme Lord', percentage: 35, color: '#FF4757', emoji: '🤡', description: 'Posta meme repetido e acha que é original' },
  { name: 'Filósofo 3h AM', percentage: 25, color: '#b388ff', emoji: '🤔', description: 'Insights profundos sobre o vazio da existência (e do feed)' },
  { name: 'Depressivo Romântico', percentage: 18, color: '#4d9eff', emoji: '😭', description: 'Triste pelo amor não correspondido (e pelo engajamento)' },
  { name: 'Politicólogo Amador', percentage: 12, color: '#FFC048', emoji: '🔥', description: 'Resolveu o Brasil em 280 caracteres (spoiler: não resolveu)' },
  { name: 'Vendedor de Curso', percentage: 7, color: '#2ED573', emoji: '💰', description: '“Como faturei 10k dormindo” — mentira, não faturou' },
  { name: 'Bot Humano', percentage: 3, color: '#FF6B9D', emoji: '🤖', description: 'Responde com "kkkk" em tudo. É humano? Ninguém sabe.' },
];

export const mockTranslations: Record<string, string> = {
  t1: 'Quero atenção e carinho, mas vou fingir que é sobre um gato.',
  t2: 'Sou nerd e orgulhoso disso (leia-se: não tenho amigos)',
  t3: 'Me odeio mas quero que você ria comigo',
  t4: 'Política é o único jeito de parecer inteligente no timeline',
  t5: 'Ela não me respondeu e estou em negação',
  t6: 'Vou reclamar do Brasil pra engajar',
  t7: 'Tive uma epifania às 4h da manhã e achei que era genial',
  t8: 'Curiosidade inútil pra encher linguiça',
  t9: 'Preciso de ajuda mas vou fingir que é sobre código',
  t10: 'Tô puto e quero que todo mundo saiba',
  t11: 'Quero ela e tô no Friendzone',
  t12: 'Solitude nerd é só carência disfarçada',
  t13: 'Crise existencial patrocinada pela madrugada',
  t14: 'Provocação barata pra ver o circo pegar fogo',
  t15: 'Meu ex me superou com gatos e isso dói',
};

export const mockCopypasta: Record<string, number> = {
  t1: 12,
  t2: 8,
  t3: 5,
  t4: 67,
  t5: 3,
  t6: 45,
  t7: 89,
  t8: 15,
  t9: 7,
  t10: 23,
  t11: 2,
  t12: 55,
  t13: 78,
  t14: 34,
  t15: 11,
};

export const shameMessages = [
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

export const ratioMessages = [
  'As pessoas te amam! Ou tão com pena.',
  'Respeitável. Nada mal pra um ser humano.',
  'Mediano. Como seu potencial.',
  'Tá sofrido. Talvez tente postar fotos de gato.',
  'Critério de rejeição do programa de tv.',
  'Selena Gomez teria mais engajamento dormindo.',
];

export const cringeLabels = [
  { threshold: 0, label: 'Normal 🤷', emoji: '😐' },
  { threshold: 20, label: 'Suportável 😬', emoji: '😬' },
  { threshold: 40, label: 'Tá ficando estranho 🙈', emoji: '🙈' },
  { threshold: 60, label: 'Cringe Avançado 🚩', emoji: '🚩' },
  { threshold: 80, label: 'Sua timeline inteira 🔥', emoji: '🔥' },
];
