import React from 'react';

import { Post } from '@prisma/client';
import { SinglePost } from '@/app/_components/singlePost';

export interface PostsProps {
  posts: Post[];
}

export default async function Posts({ posts }: PostsProps) {
  if (posts.length === 0) {
    return <div className="flex p-4 justify-center">Keine Posts in diesem Zeitraum gefunden.</div>;
  }

  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      {posts.map((post) => (
        /* @ts-expect-error Server Component */
        <SinglePost key={post.id} post={post} />
      ))}
    </div>
  );
}
