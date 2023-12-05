import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddPost } from '@/app/_components/addPost';
import Posts from '@/app/_components/posts';
import { DEFAULTS } from '@/utils';
import { PostWithRelations, prisma, sortBy } from '@/utils/prisma';

type Props = {
  searchParams: {
    hideUnpopularPosts?: string;
  };
};

export default async function Home(props: Props) {
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

  function getPostsToDisplay(): PostWithRelations[] {
    const postsWithoutReported = posts.filter(
      (post) => post.reports.length < Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST),
    );

    const hideUnpopularPosts = props.searchParams.hideUnpopularPosts !== undefined;

    if (hideUnpopularPosts) {
      return postsWithoutReported.filter((post) => {
        const downvotes = post.votes.filter((vote) => !vote.upvote).length;
        return downvotes < Number(process.env.DOWNVOTES_TO_HIDE_POST ?? DEFAULTS.DOWNVOTES_TO_HIDE_POST);
      });
    }

    return postsWithoutReported;
  }

  const postsToDisplay = getPostsToDisplay();

  return (
    <div className="flex flex-col mx-auto w-full">
      <AddPost />
      <div className="flex flex-col gap-2 divide-y divide-zinc-700 w-full">
        <Posts posts={postsToDisplay} sortBy={sortBy.newest} />
      </div>
    </div>
  );
}
