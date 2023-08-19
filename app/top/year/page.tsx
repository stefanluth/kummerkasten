import Posts from '@/app/_components/posts';
import DEFAULTS from '@/utils/defaults';
import { prisma } from '@/utils/prisma';

export default async function TopYear() {
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

  const filteredPosts = posts.filter(
    (post) => post.reports.length < Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST)
  );

  return (
    /* @ts-expect-error Server Component */
    <Posts posts={filteredPosts} />
  );
}
