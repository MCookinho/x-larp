import type { VercelRequest, VercelResponse } from '@vercel/node';

const PUBLIC_BEARER_TOKEN =
  'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

const API_BASE = 'https://api.twitter.com';

interface TwitterUser {
  id_str: string;
  name: string;
  screen_name: string;
  description: string;
  profile_image_url_https: string;
  followers_count: number;
  friends_count: number;
  statuses_count: number;
  verified: boolean;
  created_at: string;
  favourites_count: number;
  listed_count: number;
}

interface TwitterTweet {
  id_str: string;
  full_text: string;
  created_at: string;
  favorite_count: number;
  retweet_count: number;
  reply_count: number;
  quote_count: number;
  bookmarked?: boolean;
  views?: { count: number };
  entities: {
    user_mentions: { screen_name: string; name: string; id_str: string }[];
  };
}

async function getGuestToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/1.1/guest/activate.json`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PUBLIC_BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error(`Guest token failed: ${res.status}`);
  const data = await res.json();
  return data.guest_token;
}

async function apiCall<T>(path: string, token?: string): Promise<T> {
  const guestToken = token ?? (await getGuestToken());
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${PUBLIC_BEARER_TOKEN}`,
      'x-guest-token': guestToken,
      'x-twitter-active-user': 'yes',
    },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text().catch(() => '')}`);
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action as string | undefined;

  try {
    switch (action) {
      case 'user': {
        const screenName = req.query.username as string;
        if (!screenName) return res.status(400).json({ error: 'username required' });
        const user = await apiCall<TwitterUser>(
          `/1.1/users/show.json?screen_name=${encodeURIComponent(screenName)}`,
          req.query.guest as string,
        );
        return res.json({
          id: user.id_str,
          name: user.name,
          username: user.screen_name,
          description: user.description,
          avatar: user.profile_image_url_https.replace('_normal', '_400x400'),
          followersCount: user.followers_count,
          followingCount: user.friends_count,
          tweetCount: user.statuses_count,
          likesCount: user.favourites_count,
          listedCount: user.listed_count,
          verified: user.verified,
          createdAt: user.created_at,
        });
      }

      case 'tweets': {
        const screenName = req.query.username as string;
        if (!screenName) return res.status(400).json({ error: 'username required' });
        const count = Math.min(Number(req.query.count) || 100, 200);
        const data = await apiCall<{ statuses?: TwitterTweet[] }>(
          `/1.1/statuses/user_timeline.json?screen_name=${encodeURIComponent(screenName)}&count=${count}&tweet_mode=extended&include_entities=true`,
          req.query.guest as string,
        );
        const tweets = (data.statuses ?? []).map((t) => ({
          id: t.id_str,
          text: t.full_text,
          likes: t.favorite_count,
          retweets: t.retweet_count,
          replies: t.reply_count,
          quotes: t.quote_count ?? 0,
          views: 0,
          bookmarks: 0,
          mentions: (t.entities?.user_mentions ?? []).map((m) => ({
            username: m.screen_name,
            name: m.name,
            id: m.id_str,
          })),
          createdAt: t.created_at,
        }));
        const guestToken = data as unknown as { guest_token?: string };
        return res.json({
          tweets,
          guestToken: guestToken.guest_token,
        });
      }

      case 'guest': {
        const token = await getGuestToken();
        return res.json({ guest_token: token });
      }

      default:
        return res.status(400).json({ error: 'unknown action' });
    }
  } catch (err) {
    return res.status(500).json({
      error: 'Scraper failed',
      details: err instanceof Error ? err.message : String(err),
    });
  }
}
