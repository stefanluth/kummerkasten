import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import DEFAULTS from '@/utils/defaults';
import { prisma } from '@/utils/prisma';
import Posts from '@/app/_components/posts';

export default async function TopMonth() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    },
    include: {
      reports: true,
    },
    orderBy: {
      upvotes: 'desc',
    },
  });

  const filteredPosts = posts.filter(
    (post) => post.reports.length < Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST)
  );

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Posts posts={filteredPosts} />
    </>
  );
}
