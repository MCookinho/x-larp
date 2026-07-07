/// <reference types="vite/client" />

const PROXY_URL_KEY = 'xlarp_proxy_url';
const TOKEN_KEY = 'xlarp_bearer_token';

function getProxyUrl(): string | null {
  return localStorage.getItem(PROXY_URL_KEY);
}

function getBearerToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getApiConfig() {
  return {
    proxyUrl: getProxyUrl(),
    bearerToken: getBearerToken(),
    configured: !!(getProxyUrl() && getBearerToken()),
  };
}

export function setApiConfig(proxyUrl: string, bearerToken: string) {
  localStorage.setItem(PROXY_URL_KEY, proxyUrl);
  localStorage.setItem(TOKEN_KEY, bearerToken);
}

export function clearApiConfig() {
  localStorage.removeItem(PROXY_URL_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

async function fetchXApi(endpoint: string, params: Record<string, string> = {}) {
  const config = getApiConfig();
  if (!config.proxyUrl || !config.bearerToken) {
    throw new Error('API not configured');
  }

  const query = new URLSearchParams(params).toString();
  const url = `${config.proxyUrl}?endpoint=${encodeURIComponent(endpoint)}${query ? '&' + query : ''}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${config.bearerToken}`,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error: ${response.status}`);
  }

  return response.json();
}

export interface XUser {
  id: string;
  name: string;
  username: string;
  description: string;
  profile_image_url: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count: number;
  };
  verified: boolean;
  created_at: string;
}

export interface XTweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
    bookmark_count: number;
    impression_count: number;
  };
}

export async function fetchUser(username: string): Promise<XUser> {
  const data = await fetchXApi(`users/by/username/${username}`, {
    'user.fields': 'description,profile_image_url,public_metrics,verified,created_at',
  });
  return data.data;
}

export async function fetchTweets(userId: string, maxResults = 100): Promise<XTweet[]> {
  const data = await fetchXApi(`users/${userId}/tweets`, {
    'tweet.fields': 'created_at,public_metrics',
    'max_results': String(Math.min(maxResults, 100)),
    exclude: 'retweets,replies',
  });
  return data.data ?? [];
}

export async function fetchFollowers(userId: string, maxResults = 100): Promise<XUser[]> {
  const data = await fetchXApi(`users/${userId}/followers`, {
    'user.fields': 'description,profile_image_url,public_metrics',
    'max_results': String(Math.min(maxResults, 100)),
  });
  return data.data ?? [];
}

export async function fetchFollowing(userId: string, maxResults = 100): Promise<XUser[]> {
  const data = await fetchXApi(`users/${userId}/following`, {
    'user.fields': 'description,profile_image_url,public_metrics',
    'max_results': String(Math.min(maxResults, 100)),
  });
  return data.data ?? [];
}
