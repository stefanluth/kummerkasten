import React from 'react';

import { cookies } from 'next/headers';

import { getEnv } from '@/utils/env';
import { type PostFeedSort, type PostFeedVisibility, getPostFeed } from '@/utils/post-feed';
import { getPostThreadReplies } from '@/utils/post-thread';
import type { TopPeriod } from '@/utils/top-periods';

import { PostFeed } from './PostFeed';

type PostsProps = {
  period?: TopPeriod;
  sort?: PostFeedSort;
  visibility?: PostFeedVisibility;
};

export async function Posts({ period, sort, visibility }: PostsProps) {
  const referenceTime = Date.now();
  const fingerprint = (await cookies()).get('fingerprint')?.value;
  const page = await getPostFeed({ period, sort, visibility, fingerprint });
  const repliesByRoot = await getPostThreadReplies(
    page.items.map((post) => post.id),
    fingerprint,
    visibility,
  );
  const env = getEnv();

  return (
    <PostFeed
      initialItems={page.items}
      initialThreads={Object.fromEntries(repliesByRoot)}
      initialNextCursor={page.nextCursor}
      initialReferenceTime={referenceTime}
      limits={{
        minTitleLength: env.minTitleLength,
        maxTitleLength: env.maxTitleLength,
        minContentLength: env.minContentLength,
        maxContentLength: env.maxContentLength,
      }}
      period={period ?? 'all'}
      sort={sort ?? 'newest'}
      visibility={visibility ?? 'public'}
    />
  );
}
