import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/utils/prisma';
import Posts from '@/app/_components/posts';
import config from '@/config.json';

export default async function TopYear() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 365)),
      },
    },
    include: {
      reports: true,
    },
    orderBy: {
      upvotes: 'desc',
    },
  });

  const filteredPosts = posts.filter((post) => post.reports.length < config.reportsToHidePost);

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Posts posts={filteredPosts} />
    </>
  );
}
