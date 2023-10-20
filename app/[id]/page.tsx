import { cookies } from 'next/headers';

import { SinglePost } from '@/app/_components/singlePost';
import { prisma } from '@/utils/prisma';

type SinglePostPageProps = {
  params: {
    id: string;
  };
};

export default async function SinglePostPage(props: SinglePostPageProps) {
  const fingerprint = cookies().get('fingerprint')?.value;

  const post = await prisma.post.findUnique({
    where: {
      id: props.params.id,
    },
  });

  return (
    <div className="flex justify-center">
      <SinglePost post={post} fingerprint={fingerprint} />
    </div>
  );
}
