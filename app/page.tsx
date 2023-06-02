import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/utils/prisma';
import { AddPost } from '@/app/_components/addPost';
import Posts from '@/app/_components/posts';

export default async function Home() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="overflow-y-auto pb-4">
      <div className="flex flex-col min-w-[30rem] max-w-6xl mx-auto">
        <AddPost />
        {/* @ts-expect-error Server Component */}
        <Posts posts={posts} />
      </div>
    </div>
  );
}
