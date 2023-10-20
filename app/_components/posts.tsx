import React from 'react';

import { cookies } from 'next/headers';

import { Post } from '@prisma/client';

import { SinglePost } from '@/app/_components/singlePost';

export interface PostsProps {
  posts: Post[];
}

export default async function Posts({ posts }: PostsProps) {
  if (posts.length === 0) return <span className="mx-auto py-8">Keine Nachrichten vorhanden.</span>;

  const fingerprint = cookies().get('fingerprint')?.value;

  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      {posts.map((post) => (
        <SinglePost key={post.id} post={post} fingerprint={fingerprint} />
      ))}
    </div>
  );
}
