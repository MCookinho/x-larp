const DEFAULT_PROXY = 'https://x-larp-api-only.vercel.app/api/twitter';
const PROXY_KEY = 'xlarp_proxy_url';
const AUTH_TOKEN_KEY = 'xlarp_auth_token';
const CSRF_TOKEN_KEY = 'xlarp_csrf_token';

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
  nextCursor: string | null;
}

export function getProxyUrl(): string {
  return localStorage.getItem(PROXY_KEY) || DEFAULT_PROXY;
}

export function hasCustomProxy(): boolean {
  return !!localStorage.getItem(PROXY_KEY);
}

export function setProxyUrl(url: string) {
  localStorage.setItem(PROXY_KEY, url);
}

export function clearProxyUrl() {
  localStorage.removeItem(PROXY_KEY);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getCsrfToken(): string | null {
  return localStorage.getItem(CSRF_TOKEN_KEY);
}

export function setCsrfToken(token: string) {
  localStorage.setItem(CSRF_TOKEN_KEY, token);
}

export function clearCsrfToken() {
  localStorage.removeItem(CSRF_TOKEN_KEY);
}

export function isConfigured(): boolean {
  return true;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const authToken = getAuthToken();
  const csrfToken = getCsrfToken();
  if (authToken && csrfToken) {
    headers['x-auth-token'] = authToken;
    headers['x-csrf-token'] = csrfToken;
  }
  return headers;
}

async function fetchProxy(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const proxy = getProxyUrl();

  const query = new URLSearchParams({ ...params, action: endpoint }).toString();
  const url = `${proxy}?${query}`;

  const res = await fetch(url, { headers: buildHeaders() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || err.details || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchScrapedUser(username: string): Promise<ScrapedUser> {
  return fetchProxy('user', { username });
}

export async function fetchScrapedTweets(username: string, count = 100, cursor?: string): Promise<ScrapeResult> {
  const params: Record<string, string> = { username, count: String(count) };
  if (cursor) params.cursor = cursor;
  return fetchProxy('tweets', params);
}

export async function fetchAllTweets(username: string): Promise<ScrapedTweet[]> {
  const allTweets: ScrapedTweet[] = [];
  let cursor: string | null = null;
  let page = 0;

  do {
    const result = await fetchScrapedTweets(username, 100, cursor ?? undefined);
    allTweets.push(...result.tweets);
    cursor = result.nextCursor;
    page++;
  } while (cursor && page < 50);

  return allTweets;
}
