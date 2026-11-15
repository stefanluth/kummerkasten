import { cookies } from 'next/headers';

import { SESSION_COOKIE_NAME, verifyUnlockSessionToken } from '@/utils/auth-session';
import { getEnv } from '@/utils/env';
import { type PostFeedSort, type PostFeedVisibility, getPostFeed } from '@/utils/post-feed';
import { getPostThreadReplies } from '@/utils/post-thread';
import { TOP_PERIOD_DAYS, type TopPeriod } from '@/utils/top-periods';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const periods = Object.keys(TOP_PERIOD_DAYS) as TopPeriod[];
const sorts: PostFeedSort[] = ['newest', 'votes'];
const visibilities: PostFeedVisibility[] = ['public', 'reported'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = parseOption(searchParams.get('period'), periods, 'all');
  const sort = parseOption(searchParams.get('sort'), sorts, 'newest');
  const visibility = parseOption(searchParams.get('visibility'), visibilities, 'public');

  if (!period || !sort || !visibility) {
    return Response.json({ error: 'Invalid feed options' }, { status: 400, headers: noStoreHeaders });
  }

  const env = getEnv();
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const fingerprint = cookieStore.get('fingerprint')?.value;
  if (!fingerprint || !(await verifyUnlockSessionToken(session, env.sessionSecret))) {
    return Response.json({ error: 'Authentication required' }, { status: 401, headers: noStoreHeaders });
  }

  const page = await getPostFeed({
    period,
    sort,
    visibility,
    cursor: searchParams.get('cursor'),
    fingerprint,
  });
  const repliesByRoot = await getPostThreadReplies(
    page.items.map((post) => post.id),
    fingerprint,
    visibility,
  );

  return Response.json(
    {
      ...page,
      threads: Object.fromEntries(repliesByRoot),
      referenceTime: Date.now(),
    },
    { headers: noStoreHeaders },
  );
}

const noStoreHeaders = { 'Cache-Control': 'no-store' };

function parseOption<Value extends string>(value: string | null, options: readonly Value[], fallback: Value) {
  if (value === null) return fallback;
  return options.find((option) => option === value) ?? null;
}
