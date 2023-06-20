import { SinglePost } from '@/app/_components/singlePost';
import { prisma } from '@/utils/prisma';
import { AddReply } from '@/app/_components/addReply';
import { Replies } from '@/app/_components/replies';

type SinglePostPageProps = {
  params: {
    id: string;
  };
};

async function getRepliesRecursive(postId: string) {
  const replies = await prisma.post.findMany({
    where: {
      replyTo: postId,
    },
  });

  for (const reply of replies) {
    replies.push(...(await getRepliesRecursive(reply.id)));
  }

  return replies;
}

export default async function SinglePostPage(props: SinglePostPageProps) {
  const post = await prisma.post.findUnique({
    where: {
      id: props.params.id,
    },
  });

  const replies = await getRepliesRecursive(props.params.id);

  return (
    <div className="flex flex-col w-full self-center justify-center">
      {/* @ts-expect-error Server Component */}
      <SinglePost post={post} />
      <div className="ml-16">
        {/* @ts-expect-error Server Component */}
        <Replies replies={replies} />
        <div className="border-t border-zinc-700 my-4" />
        <AddReply postId={props.params.id} />
      </div>
    </div>
  );
}
