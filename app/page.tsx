import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddPostForm, Posts } from '@/app/_components/Post';
import { sortBy } from '@/utils';
import { prisma } from '@/utils/prisma';

export default async function Home() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

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
      <AddPostForm />
      <Posts posts={posts} sortBy={sortBy.newest} />
    </div>
  );
}
