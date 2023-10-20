import Posts from '@/app/_components/posts';
import { DEFAULTS } from '@/utils';
import { prisma } from '@/utils/prisma';

export default async function TopMonth() {
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
    <Posts posts={filteredPosts} />
  );
}
