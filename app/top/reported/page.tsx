import Posts from '@/app/_components/posts';
import { REPORTS_TO_HIDE_POST } from '@/utils';
import { prisma } from '@/utils/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const TopReported = async () => {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    where: {
      reports: {
        gte: REPORTS_TO_HIDE_POST,
      },
    },
    orderBy: {
      upvotes: 'desc',
    },
  });

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Posts posts={posts} />
    </>
  );
};

export default TopReported;
