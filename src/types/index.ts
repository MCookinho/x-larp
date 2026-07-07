export interface Tweet {
  id: string;
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  quotes: number;
  bookmarks: number;
  createdAt: string;
  context: ContextType;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
}

export interface Interaction {
  user: User;
  count: number;
  context: ContextType;
}

export interface FollowerEvent {
  id: string;
  user: User;
  type: 'follow' | 'unfollow' | 'block' | 'mute';
  timestamp: string;
  reason?: string;
}

export interface AccountStats {
  totalTweets: number;
  totalFollowers: number;
  totalFollowing: number;
  topContext: ContextType;
  bestFriend: string;
  cringeLevel: number;
  ratio: number;
}

export type ContextType =
  | 'resenha'
  | 'flerte'
  | 'tristeza'
  | 'raiva'
  | 'reflexao'
  | 'humor'
  | 'curiosidade'
  | 'politica'
  | 'nerdola'
  | 'desabafo';

export interface FilterOption {
  label: string;
  value: keyof Tweet;
  emoji: string;
}
