import Link from 'next/link';
import { cookies } from 'next/headers';

import { prisma } from '@/utils/prisma';
import { Voting } from './voting';
import { reportPost } from '../_actions';
import NotFound from '../not-found';

export async function SinglePost(props: { postId: string }) {
  const fingerprint = cookies().get('fingerprint')?.value;
  if (!fingerprint) {
    return <p>Something went wrong. Try refreshing the page.</p>;
  }

  // TODO: Remove redundant query
  const postPromise = prisma.post.findUnique({
    where: {
      id: props.postId,
    },
  });

  const votedPromise = prisma.vote.findFirst({
    where: {
      fingerprint,
      postId: props.postId,
      OR: [
        { value: 1 },
        { value: 2 }
      ],
    },
  });

  const reportedPromise = prisma.report.findFirst({
    where: {
      fingerprint,
      postId: props.postId,
    },
  });

  const [post, voted, reported] = await Promise.all([postPromise, votedPromise, reportedPromise]);

  if (!post) {
    return <NotFound />;
  }

  const reportingDisabled = !!reported;

  return (
    <div className="flex p-2 gap-4">
      <Voting postId={post.id} upvotes={post.upvotes} voted={!!voted} fingerprint={fingerprint} />
      <div id={post.id.toString()} className="flex flex-col w-11/12 gap-1 justify-between">
        <div className="flex flex-col">
          <div className="flex gap-2 items-baseline justify-between">
            <a href={`#${post.id}`} className="text-xs text-zinc-500">
              {post.createdAt.toDateString()}
            </a>
            {!reportingDisabled && (
              <form action={reportPost}>
                <input type="hidden" name="postId" value={post.id} />
                <input type="hidden" name="fingerprint" value={fingerprint} />
                <button className="text-xs text-zinc-500 hover:underline" type="submit">
                  Melden
                </button>
              </form>
            )}
          </div>
          <div className="flex gap-2 items-baseline">
            <h2 className="text-2xl -mt-1 font-bold max-w-7xl truncate">{post.title}</h2>
            <Link href={`${post.id}`} className="text-sm pb-1 text-zinc-500">
              #{post.id.toString().slice(0, 8)}
            </Link>
          </div>
        </div>
        <p className="max-w-7xl text-lg overflow-wrap">{post.content}</p>
      </div>
    </div>
  );
}
