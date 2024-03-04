import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Posts } from '@/app/_components/Post';
import { DEFAULTS } from '@/utils';
import { prisma } from '@/utils/prisma';

import Confirmation from './confirmation';

export default async function Reported() {
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
  });

  const filteredPosts = posts.filter(
    (post) => post.reports.length >= Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST),
  );

  return (
    <>
      <Confirmation />
      <Posts posts={filteredPosts} />
    </>
  );
}
