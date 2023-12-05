import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddPost } from '@/app/_components/addPost';
import Posts from '@/app/_components/posts';
import { DEFAULTS } from '@/utils';
import { PostWithRelations, prisma, sortBy } from '@/utils/prisma';

export default async function Home(props: {
  searchParams: {
    hideUnpopularPosts?: string;
  };
}) {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    include: {
      reports: true,
      votes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const postsToDisplay = getPostsToDisplay(posts, props.searchParams.hideUnpopularPosts !== undefined);

  return (
    <div className="flex flex-col mx-auto w-full">
      <AddPost />
      <div className="flex flex-col gap-2 divide-y divide-zinc-700 w-full">
        <Posts posts={postsToDisplay} sortBy={sortBy.newest} />
      </div>
    </div>
  );
}

function getPostsToDisplay(posts: PostWithRelations[], hideUnpopularPosts: boolean): PostWithRelations[] {
  const postsWithoutReported = posts.filter(
    (post) => post.reports.length < Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST),
  );

  if (hideUnpopularPosts) {
    return postsWithoutReported.filter((post) => {
      const downvotes = post.votes.filter((vote) => !vote.upvote).length;
      return downvotes < Number(process.env.DOWNVOTES_TO_HIDE_POST ?? DEFAULTS.DOWNVOTES_TO_HIDE_POST);
    });
  }

  return postsWithoutReported;
}
