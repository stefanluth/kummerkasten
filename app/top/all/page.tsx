import Posts from '@/app/_components/posts';
import { DEFAULTS } from '@/utils';
import { prisma, sortBy } from '@/utils/prisma';

export default async function TopDay() {
  const posts = await prisma.post.findMany({
    include: {
      reports: true,
      votes: true,
    },
  });

  const filteredPosts = posts.filter(
    (post) => post.reports.length < Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST),
  );

  return <Posts posts={filteredPosts} sortBy={sortBy.votes} />;
}
