import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddPostForm, Posts } from '@/app/_components/Post';
import { sortBy } from '@/utils';
import { getEnv } from '@/utils/env';
import { prisma } from '@/utils/prisma';

export default async function Home() {
  const env = getEnv();
  const password = (await cookies()).get('password')?.value;
  if (password !== env.unlockPassword) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    where: {
      replyTo: null,
    },
    include: {
      reports: true,
      votes: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="flex flex-col mx-auto w-full">
      <AddPostForm
        limits={{
          minTitleLength: env.minTitleLength,
          maxTitleLength: env.maxTitleLength,
          minContentLength: env.minContentLength,
          maxContentLength: env.maxContentLength,
        }}
      />
      <Posts posts={posts} sortBy={sortBy.newest} />
    </div>
  );
}
