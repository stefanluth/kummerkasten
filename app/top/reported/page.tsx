import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import Posts from '@/app/_components/posts';
import { REPORTS_TO_HIDE_POST } from '@/utils';
import { prisma } from '@/utils/prisma';
import Confirmation from './confirmation';

const TopReported = async () => {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const confirmation = cookies().get('confirmationSeeReported')?.value;

  if (confirmation !== 'true') {
    return <Confirmation />;
  }

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
