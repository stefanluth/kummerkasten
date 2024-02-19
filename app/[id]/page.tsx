import { cookies } from 'next/headers';

import { Post } from '@/app/_components/post';
import { prisma } from '@/utils/prisma';

type PostPageProps = {
  params: {
    id: string;
  };
};

export default async function PostPage(props: PostPageProps) {
  const fingerprint = cookies().get('fingerprint')?.value;

  const post = await prisma.post.findUnique({
    where: {
      id: props.params.id,
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
