import React from 'react';

import { Post } from '@prisma/client';
import { prisma } from '@/utils/prisma';
import { SinglePost } from '@/app/_components/singlePost';
import { REPORTS_TO_HIDE_POST } from '@/utils';

export interface PostsProps {
  posts: Post[];
  showAll?: boolean;
}

export default async function Posts({ posts, showAll }: PostsProps) {
  console.log('posts: ', posts);

  const filterPosts = async (post: Post) => {
    const reports = await prisma.report.findMany({
      where: {
        postId: post.id,
      },
    });
    console.log(`reports for ${post.title}: `, reports);
    console.log(`reports.length for ${post.title}: `, reports.length);

    return reports.length < REPORTS_TO_HIDE_POST;
  };

  const getFilteredPosts = async () => {
    const filteredPosts = await Promise.all(posts.map(filterPosts));

    return posts.filter((_, index) => filteredPosts[index]);
  };

  const postsToShow = showAll ? posts : await getFilteredPosts();

  console.log('postsToShow: ', postsToShow);

  if (postsToShow.length === 0) {
    return <div className="flex p-4 justify-center">Keine Posts in diesem Zeitraum gefunden.</div>;
  }

  return (
    <div className="flex flex-col gap-2 divide-y divide-zinc-700">
      {postsToShow.map((post) => (
        /* @ts-expect-error Server Component */
        <SinglePost key={post.id} post={post} />
      ))}
    </div>
  );
}
