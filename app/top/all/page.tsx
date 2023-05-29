import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { prisma } from '@/utils/prisma';
import Posts from '@/app/_components/posts';

export default async function TopDay() {
  const password = cookies().get('password')?.value;
  if (password !== process.env.UNLOCK_PASSWORD) return redirect('/unlock');

  const posts = await prisma.post.findMany({
    orderBy: {
      upvotes: 'desc',
    },
  });

  if (posts.length === 0)
    return <div className="flex p-4 justify-center">Keine Posts in diesem Zeitraum gefunden.</div>;

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Posts posts={posts} />
    </>
  );
}
