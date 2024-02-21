import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddPost, Posts } from '@/app/_components/post';
import { DEFAULTS } from '@/utils';
import { prisma, sortBy } from '@/utils/prisma';

export default async function Home() {
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

  const filteredPosts = posts.filter(
    (post) => post.reports.length < Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST),
  );

  return (
    <div className="flex flex-col mx-auto w-full">
      <AddPost />
      <div className="flex flex-col gap-2 divide-y divide-zinc-700 w-full">
        <Posts posts={filteredPosts} sortBy={sortBy.newest} />
      </div>
    </div>
  );
}
