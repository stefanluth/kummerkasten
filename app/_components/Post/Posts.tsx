import React from 'react';

import { cookies } from 'next/headers';

import { FilterFunction, SortFunction, filterBy, sortBy } from '@/utils';
import { getEnv } from '@/utils/env';
import { PostWithRelations } from '@/utils/prisma';

import { Post } from './Post';

type PostsProps = {
  posts: PostWithRelations[];
  sortBy?: SortFunction;
  filterBy?: FilterFunction;
};

export async function Posts({ posts, sortBy: sortFunction, filterBy: filterFunction }: PostsProps) {
  if (posts.length === 0) return <span className="mx-auto py-8">No posts found.</span>;

  const fingerprint = (await cookies()).get('fingerprint')?.value;
  const { reportsToHidePost } = getEnv();
  const filteredPosts = filterFunction
    ? posts.filter(filterFunction)
    : posts.filter((post) => filterBy.reports(post, reportsToHidePost));

  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      {filteredPosts.sort(sortFunction ?? sortBy.newest).map((post) => (
        <Post key={post.id} post={post} fingerprint={fingerprint} />
      ))}
    </div>
  );
}
