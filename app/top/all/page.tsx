import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/utils/prisma';
import Posts from '@/app/_components/posts';
import config from '@/config.json';

export default async function TopDay() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    where: {
      reports: {
        lt: config.reportsToDeletePost,
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
}
