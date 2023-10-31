import { marked } from 'marked';

import Link from 'next/link';

import { reportPost } from '@/app/_actions';
import { Voting } from '@/app/_components/voting';
import { DEFAULTS, getMarkedOptions } from '@/utils';
import { PostWithRelations, prisma } from '@/utils/prisma';

const MARKED_OPTIONS = getMarkedOptions();

type SinglePostProps = {
  post?: PostWithRelations | null;
  fingerprint?: string | null;
};

export async function SinglePost({ post, fingerprint }: SinglePostProps): Promise<JSX.Element | null> {
  if (!post || !fingerprint) return null;

  const votePromise = prisma.vote.findFirst({
    where: {
      fingerprint,
      postId: post.id,
    },
  });

  const reportedPromise = prisma.report.findFirst({
    where: {
      fingerprint,
      postId: post.id,
    },
  });

  const [userVote, userReported] = await Promise.all([votePromise, reportedPromise]);

  const upvotes = post.votes?.filter((vote) => vote.upvote === true).length;
  const downvotes = post.votes?.filter((vote) => vote.upvote === false).length;

  marked.use(MARKED_OPTIONS);

  return (
    <div className="flex p-2 gap-4 w-11/12">
      <Voting
        postId={post.id}
        upvotes={upvotes - downvotes}
        vote={userVote ? userVote.upvote : null}
        fingerprint={fingerprint}
      />
      <div id={post.id.toString()} className="flex flex-col gap-1 justify-between w-full">
        <div className="flex flex-col w-full">
          <div className="flex gap-4 items-baseline">
            <a href={`#${post.id}`} className="text-xs text-zinc-500">
              {post.createdAt.toLocaleDateString(process.env.DATE_LOCALE ?? DEFAULTS.DATE_LOCALE, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </a>
            <Link id={post.id} href={`/${post.id}`} className="text-xs text-zinc-500 post-id">
              #{post.id.toString().slice(0, 8)}
            </Link>
            {!userReported && (
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
            <h2 className="text-3xl -mt-1 font-bold truncate overflow-wrap whitespace-pre-line">{post.title}</h2>
          </div>
        </div>
        <div
          className="text-lg overflow-wrap w-full post-content"
          dangerouslySetInnerHTML={{ __html: marked(post.content) }}
        />
      </div>
    </div>
  );
}
