import React from 'react';

import { cookies } from 'next/headers';
import Link from 'next/link';

import { type PostFeedSort, type PostFeedVisibility, getPostFeed } from '@/utils/post-feed';
import type { TopPeriod } from '@/utils/top-periods';

import { Post } from './Post';

type PostsProps = {
  href: string;
  cursor?: string;
  period?: TopPeriod;
  sort?: PostFeedSort;
  visibility?: PostFeedVisibility;
};

export async function Posts({ href, cursor, period, sort, visibility }: PostsProps) {
  const fingerprint = (await cookies()).get('fingerprint')?.value;
  const page = await getPostFeed({ period, sort, visibility, cursor, fingerprint });

  return (
    <>
      {page.items.length === 0 ? (
        <span className="mx-auto py-8">No posts found.</span>
      ) : (
        <div className="flex flex-col gap-2 divide-y divide-zinc-700">
          {page.items.map((post) => (
            <Post key={post.id} post={post} />
          ))}
        </div>
      )}
      {page.nextCursor && (
        <Link
          className="mx-auto my-4 rounded-md border border-zinc-700 px-4 py-2 hover:bg-zinc-800"
          href={`${href}?cursor=${encodeURIComponent(page.nextCursor)}`}
          rel="next"
        >
          Next page
        </Link>
      )}
    </>
  );
}
