import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Posts } from '@/app/_components/Post';
import { FilterFunction } from '@/utils';
import { getEnv } from '@/utils/env';
import { PostWithRelations, prisma } from '@/utils/prisma';

import Confirmation from './confirmation';

export default async function Reported() {
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
  });

  const filterFunction: FilterFunction = (post: PostWithRelations): boolean =>
    post.reports.length >= env.reportsToHidePost;

  return (
    <>
      <Confirmation />
      <Posts posts={posts} filterBy={filterFunction} />
    </>
  );
}
