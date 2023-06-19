import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Posts from '@/app/_components/posts';
import config from '@/config.json';
import { prisma } from '@/utils/prisma';
import Confirmation from './confirmation';

const TopReported = async () => {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    where: {
      reports: {
        gte: config.reportsToDeletePost,
      },
    },
    orderBy: {
      upvotes: 'desc',
    },
  });

  return (
    <>
      <Confirmation />
      {/* @ts-expect-error Server Component */}
      <Posts posts={posts} />
    </>
  );
};

export default TopReported;
