import { marked } from 'marked';

import Link from 'next/link';

import { CopyLink } from '@/app/_components/copyLink';
import { Voting } from '@/app/_components/voting';
import { MARKED_POST_OPTIONS, getTimeAgo } from '@/utils';
import { PostWithRelations, prisma } from '@/utils/prisma';

import { ReportPost } from './reportPost';

type PostProps = {
  post?: PostWithRelations | null;
  fingerprint?: string | null;
};

export async function Post({ post, fingerprint }: PostProps): Promise<JSX.Element | null> {
  if (!post || !fingerprint) return null;

  marked.use(MARKED_POST_OPTIONS);

  const votePromise = prisma.vote.findFirst({
    where: {
      fingerprint,
      postId: post.id,
    },
  });

  const reportPromise = prisma.report.findFirst({
    where: {
      fingerprint,
      postId: post.id,
    },
  });

  const [userVote, userReport] = await Promise.all([votePromise, reportPromise]);

  const upvotes = post.votes?.filter((vote) => vote.upvote === true).length;
  const downvotes = post.votes?.filter((vote) => vote.upvote === false).length;

  return (
    <div className="flex p-2 gap-4 max-w-[100%-10rem]">
      <div className="pt-4 w-6">
        <Voting
          postId={post.id}
          upvotes={upvotes - downvotes}
          vote={userVote?.upvote ?? null}
          fingerprint={fingerprint}
        />
      </div>
      <div id={post.id.toString()} className="flex flex-col gap-1 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 items-baseline">
            <a href={`#${post.id}`} className="text-xs text-zinc-500">
              {getTimeAgo(post.createdAt.getTime())}
            </a>
          </div>
          <div className="flex items-baseline">
            <h2 className="text-3xl font-bold overflow-anywhere">{post.title}</h2>
          </div>
        </div>
        <div
          className="text-lg overflow-anywhere post-content"
          dangerouslySetInnerHTML={{ __html: marked(post.content) }}
        />
        <div className="flex gap-4 items-baseline text-xs text-zinc-500">
          <Link id={post.id} href={`/${post.id}`} className="post-id hover:underline" title="View Post in New Tab">
            View
          </Link>
          <CopyLink path={`/${post.id}`} />
          {!userReport && <ReportPost postId={post.id} fingerprint={fingerprint} />}
        </div>
      </div>
    </div>
  );
}
