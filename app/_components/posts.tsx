import React from 'react';

import { cookies } from 'next/headers';

import { Post } from '@/app/_components/post';
import { PostWithRelations, sortBy } from '@/utils/prisma';

export default async function Posts({ posts, sortBy: sortFunction }: { posts: PostWithRelations[]; sortBy?: any }) {
  if (posts.length === 0) return <span className="mx-auto py-8">No posts found.</span>;

  const fingerprint = cookies().get('fingerprint')?.value;

  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      {posts.sort(sortFunction ?? sortBy.newest).map((post) => (
        <Post key={post.id} post={post} fingerprint={fingerprint} />
      ))}
    </div>
  );
}
