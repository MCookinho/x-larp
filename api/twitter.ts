import type { VercelRequest, VercelResponse } from '@vercel/node';

const BEARER_TOKEN =
  'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';

const HASHES = {
  UserByScreenName: '2qvSHpkWTMS9i0zJAwDNiA',
  UserTweets: 'hr4gzZONlq23okjU8fIe_A',
};

const FEATURES = {
  hidden_profile_subscriptions_enabled: true,
  profile_label_improvements_pcf_label_in_post_enabled: false,
  rweb_tipjar_consumption_enabled: true,
  responsive_web_graphql_exclude_directive_enabled: true,
  verified_phone_label_enabled: false,
  subscriptions_verification_info_verified_since_enabled: true,
  highlights_tweets_tab_ui_enabled: true,
  responsive_web_twitter_article_notes_tab_enabled: false,
  subscriptions_feature_can_gift_premium: false,
  creator_subscriptions_tweet_preview_api_enabled: true,
  responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
  responsive_web_graphql_timeline_navigation_enabled: true,
};

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let _guestToken: string | null = null;
let _guestBase: 'api' | 'x' | 'twitter' = 'api';

async function getGuestToken(): Promise<{ token: string; base: string }> {
  if (_guestToken) return { token: _guestToken, base: _guestBase };

  const attempts: { url: string; origin: string; key: typeof _guestBase }[] = [
    { url: 'https://api.twitter.com/1.1/guest/activate.json', origin: 'https://x.com', key: 'api' },
    { url: 'https://api.x.com/1.1/guest/activate.json', origin: 'https://x.com', key: 'x' },
  ];

  for (const a of attempts) {
    try {
      const res = await fetch(a.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
          'User-Agent': UA,
          Origin: a.origin,
          Referer: `${a.origin}/`,
        },
      });
      if (res.ok) {
        const d = await res.json();
        _guestToken = d.guest_token;
        _guestBase = a.key;
        return { token: d.guest_token, base: a.key };
      }
    } catch {}
  }
  throw new Error('Guest token failed: all endpoints unreachable');
}

function graphqlUrl(_base: string, hash: string, name: string) {
  return `https://twitter.com/i/api/graphql/${hash}/${name}`;
}

async function graphqlGet(
  url: string,
  variables: Record<string, unknown>,
  guestToken: string,
): Promise<any> {
  const params = new URLSearchParams({
    variables: JSON.stringify(variables),
    features: JSON.stringify(FEATURES),
  });
  const res = await fetch(`${url}?${params}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      'x-guest-token': guestToken,
      'x-twitter-active-user': 'yes',
      'User-Agent': UA,
      Origin: 'https://twitter.com',
      Referer: 'https://twitter.com/',
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphQL ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function graphqlGetAuth(
  url: string,
  variables: Record<string, unknown>,
  authToken: string,
  csrfToken: string,
): Promise<any> {
  const params = new URLSearchParams({
    variables: JSON.stringify(variables),
    features: JSON.stringify(FEATURES),
  });
  const res = await fetch(`${url}?${params}`, {
    headers: {
      Authorization: `Bearer ${BEARER_TOKEN}`,
      Cookie: `auth_token=${authToken}; ct0=${csrfToken}`,
      'x-csrf-token': csrfToken,
      'x-twitter-active-user': 'yes',
      'User-Agent': UA,
      Origin: 'https://twitter.com',
      Referer: 'https://twitter.com/',
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GraphQL ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

function extractTweets(data: any): any[] {
  const instructions =
    data?.data?.user_result_by_screen_name?.result?.profile_timeline_v2?.timeline?.instructions ?? [];
  const tweets: any[] = [];
  for (const inst of instructions) {
    if (inst.__typename !== 'TimelineAddEntries') continue;
    for (const entry of inst.entries ?? []) {
      const tweetResult = entry?.content?.content?.tweet_results?.result;
      if (!tweetResult || tweetResult.__typename !== 'Tweet') continue;
      const details = tweetResult.details ?? {};
      const counts = tweetResult.counts ?? {};
      const mentionEntities: any[] = tweetResult.mention_entities ?? [];
      const viewsCount = tweetResult.views?.count;
      tweets.push({
        id: tweetResult.rest_id ?? '',
        text: details.full_text ?? '',
        likes: counts.favorite_count ?? 0,
        retweets: counts.retweet_count ?? 0,
        replies: counts.reply_count ?? 0,
        quotes: counts.quote_count ?? 0,
        views: viewsCount ? Number(viewsCount) : 0,
        bookmarks: counts.bookmark_count ?? 0,
        mentions: mentionEntities.map((m: any) => ({
          username: m.screen_name ?? '',
          name: m.screen_name ?? '',
          id: m.id_str ?? '',
        })),
        createdAt: details.created_at_ms ? new Date(details.created_at_ms).toISOString() : '',
      });
    }
  }
  return tweets;
}

function extractCursor(data: any): string | null {
  const instructions =
    data?.data?.user_result_by_screen_name?.result?.profile_timeline_v2?.timeline?.instructions ?? [];
  for (const inst of instructions) {
    if (inst.__typename !== 'TimelineAddEntries') continue;
    for (const entry of inst.entries ?? []) {
      const eid = entry.entry_id ?? '';
      if (!eid.includes('cursor-bottom')) continue;
      const cursorContent = entry?.content?.content;
      if (cursorContent?.__typename === 'TimelineTimelineCursor') {
        return cursorContent.cursorValue ?? null;
      }
    }
  }
  return null;
}

function extractUserResult(data: any): any {
  return data?.data?.user_result_by_screen_name?.result;
}

function formatUser(userResult: any) {
  return {
    id: userResult.rest_id ?? '',
    name: userResult.core?.name ?? '',
    username: userResult.core?.screen_name ?? '',
    description: userResult.profile_bio?.description ?? '',
    avatar: (userResult.avatar?.image_url ?? '').replace('_normal', '_400x400'),
    banner: userResult.banner?.image_url ?? '',
    followersCount: userResult.relationship_counts?.followers ?? 0,
    followingCount: userResult.relationship_counts?.following ?? 0,
    tweetCount: userResult.tweet_counts?.tweets ?? 0,
    likesCount: 0,
    listedCount: 0,
    verified: !!userResult.verification?.is_blue_verified,
    createdAt: new Date(Number(userResult.core?.created_at_ms ?? 0)).toISOString(),
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token, x-csrf-token');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action as string | undefined;
  const authToken = req.headers['x-auth-token'] as string | undefined;
  const csrfToken = req.headers['x-csrf-token'] as string | undefined;
  const isAuth = !!(authToken && csrfToken);

  try {
    let guestToken = '';
    let base = 'api';
    if (!isAuth) {
      const gt = await getGuestToken();
      guestToken = gt.token;
      base = gt.base;
    }

    switch (action) {
      case 'user': {
        const screenName = req.query.username as string;
        if (!screenName) return res.status(400).json({ error: 'username required' });

        const url = graphqlUrl(base, HASHES.UserByScreenName, 'UserByScreenName');
        const variables = {
          screen_name: screenName,
        };

        const result = isAuth
          ? await graphqlGetAuth(url, variables, authToken!, csrfToken!)
          : await graphqlGet(url, variables, guestToken);

        const userResult = extractUserResult(result);
        if (!userResult) {
          const err = JSON.stringify(result).slice(0, 500);
          return res.status(404).json({ error: 'User not found', details: err });
        }

        return res.json(formatUser(userResult));
      }

      case 'tweets': {
        const screenName = req.query.username as string;
        if (!screenName) return res.status(400).json({ error: 'username required' });
        const count = Math.min(Number(req.query.count) || 100, 200);
        const cursor = req.query.cursor as string | undefined;

        const userId = req.query.userId as string | undefined;

        const userUrl = graphqlUrl(base, HASHES.UserByScreenName, 'UserByScreenName');
        const userVars = { screen_name: screenName };
        const userResult = isAuth
          ? await graphqlGetAuth(userUrl, userVars, authToken!, csrfToken!)
          : await graphqlGet(userUrl, userVars, guestToken);
        const uid = userId || extractUserResult(userResult)?.rest_id;
        if (!uid) return res.status(404).json({ error: 'User not found' });

        const url = graphqlUrl(base, HASHES.UserTweets, 'UserTweets');
        const variables: Record<string, unknown> = {
          userId: uid,
          count,
          includePromotedContent: true,
          withQuickPromoteEligibilityTweetFields: true,
          withVoice: true,
        };
        if (cursor) variables.cursor = cursor;

        const result = isAuth
          ? await graphqlGetAuth(url, variables, authToken!, csrfToken!)
          : await graphqlGet(url, variables, guestToken);

        const tweets = extractTweets(result);
        const nextCursor = extractCursor(result);

        return res.json({ tweets, nextCursor });
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
