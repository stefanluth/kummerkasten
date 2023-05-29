import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/utils/prisma';
import Posts from '@/app/_components/posts';

export default async function TopYear() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    where: {
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 365)),
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
