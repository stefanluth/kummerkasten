import { cookies } from 'next/headers';

import { Post } from '@/app/_components/Post';
import { prisma } from '@/utils/prisma';

type PostPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostPage(props: PostPageProps) {
  const { id } = await props.params;
  const fingerprint = (await cookies()).get('fingerprint')?.value;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      reports: true,
      votes: true,
    },
  });

  return (
    <div className="flex justify-center">
      <Post post={post} fingerprint={fingerprint} />
    </div>
  );
}
