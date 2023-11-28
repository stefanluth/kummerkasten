import React from 'react';

import { cookies } from 'next/headers';

import { SinglePost } from '@/app/_components/singlePost';
import { PostWithRelations, sortBy } from '@/utils/prisma';

export default async function Posts({ posts, sortBy: sortFunction }: { posts: PostWithRelations[]; sortBy?: any }) {
  if (posts.length === 0) return <span className="mx-auto py-8">Keine Nachrichten vorhanden.</span>;

  const fingerprint = cookies().get('fingerprint')?.value;

  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" defaultChecked />
        <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-zinc-300 dark:peer-focus:ring-zinc-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-700 peer-checked:bg-zinc-400"></div>
        <span className="ms-3 text-sm font-medium text-zinc-900 dark:text-zinc-300">Unbeliebte Posts verstecken</span>
      </label>

      <div className="flex flex-col gap-2 divide-y divide-zinc-700">
        {posts.sort(sortFunction ?? sortBy.newest).map((post) => (
          <SinglePost key={post.id} post={post} fingerprint={fingerprint} />
        ))}
      </div>
    </div>
  );
}
