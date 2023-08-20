import { SinglePost } from '@/app/_components/singlePost';
import { prisma } from '@/utils/prisma';
import { cookies } from 'next/headers';

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
    <div className="flex w-2/3 self-center justify-center">
      {/* @ts-expect-error Server Component */}
      <SinglePost post={post} fingerprint={fingerprint} />
    </div>
  );
}
