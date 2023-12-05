import React from 'react';

import { cookies } from 'next/headers';

import { SinglePost } from '@/app/_components/singlePost';
import { PostWithRelations, sortBy } from '@/utils/prisma';

import { SwitchHideUnpopularPosts } from './switchHideUnpopularPosts';

export default async function Posts({ posts, sortBy: sortFunction }: { posts: PostWithRelations[]; sortBy?: any }) {
  if (posts.length === 0) return <span className="mx-auto py-8">Keine Nachrichten vorhanden.</span>;

  const fingerprint = cookies().get('fingerprint')?.value;

  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      <SwitchHideUnpopularPosts />
      <div className="flex flex-col gap-2 divide-y divide-zinc-700">
        {posts.sort(sortFunction ?? sortBy.newest).map((post) => (
          <SinglePost key={post.id} post={post} fingerprint={fingerprint} />
        ))}
      </div>
    </div>
  );
}
