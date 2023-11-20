import Posts from '@/app/_components/posts';
import { DEFAULTS } from '@/utils';
import { PostWithRelations, prisma, sortBy } from '@/utils/prisma';

export default async function TopMonth() {
  let posts: PostWithRelations[] = [];

  try {
    posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      },
      include: {
        reports: true,
        votes: true,
      },
    });
  } catch (error) {
    return null;
  }

  const filteredPosts = posts.filter(
    (post) => post.reports.length < Number(process.env.REPORTS_TO_HIDE_POST ?? DEFAULTS.REPORTS_TO_HIDE_POST),
  );

  return <Posts posts={filteredPosts} sortBy={sortBy.votes} />;
}
