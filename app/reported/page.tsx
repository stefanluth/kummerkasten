import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Posts from '@/app/_components/posts';
import config from '@/config.json';
import { prisma } from '@/utils/prisma';
import Confirmation from './confirmation';

export default async function Reported() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    include: {
      reports: true,
    },
    orderBy: {
      upvotes: 'desc',
    },
  });

  const filteredPosts = posts.filter((post) => post.reports.length >= config.reportsToHidePost);

  return (
    <>
      <Confirmation />
      {/* @ts-expect-error Server Component */}
      <Posts posts={filteredPosts} />
    </>
  );
}
