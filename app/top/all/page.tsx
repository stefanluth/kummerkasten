import { Posts } from '@/app/_components/Post';
import { sortBy } from '@/utils';
import { PostWithRelations, prisma } from '@/utils/prisma';

export default async function TopDay() {
  let posts: PostWithRelations[] = [];

  try {
    posts = await prisma.post.findMany({
      where: {
        replyTo: null,
      },
      include: {
        reports: true,
        votes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    return null;
  }

  return <Posts posts={posts} sortBy={sortBy.votes} />;
}
