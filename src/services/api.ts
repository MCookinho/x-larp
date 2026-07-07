const PROXY_KEY = 'xlarp_proxy_url';

export interface ScrapedUser {
  id: string;
  name: string;
  username: string;
  description: string;
  avatar: string;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  likesCount: number;
  listedCount: number;
  verified: boolean;
  createdAt: string;
}

export interface ScrapedTweet {
  id: string;
  text: string;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  views: number;
  bookmarks: number;
  mentions: { username: string; name: string; id: string }[];
  createdAt: string;
}

export interface ScrapeResult {
  tweets: ScrapedTweet[];
  guestToken?: string;
}

export function getProxyUrl(): string | null {
  return localStorage.getItem(PROXY_KEY);
}

export function setProxyUrl(url: string) {
  localStorage.setItem(PROXY_KEY, url);
}

export function clearProxyUrl() {
  localStorage.removeItem(PROXY_KEY);
}

export function isConfigured(): boolean {
  return !!getProxyUrl();
}

async function fetchProxy(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const proxy = getProxyUrl();
  if (!proxy) throw new Error('Proxy not configured');

  const query = new URLSearchParams({ ...params, action: endpoint }).toString();
  const url = `${proxy}?${query}`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || err.details || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchScrapedUser(username: string): Promise<ScrapedUser> {
  return fetchProxy('user', { username });
}

export async function fetchScrapedTweets(username: string, count = 100): Promise<ScrapeResult> {
  return fetchProxy('tweets', { username, count: String(count) });
}
