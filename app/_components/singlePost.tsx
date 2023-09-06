import Link from 'next/link';

import { Post } from '@prisma/client';

import { reportPost } from '@/app/_actions';
import { Voting } from '@/app/_components/voting';
import { DEFAULTS, bbcodeToHtml } from '@/utils';
import { prisma } from '@/utils/prisma';

type SinglePostProps = {
  post?: Post | null;
  fingerprint?: string | null;
};

export async function SinglePost({ post, fingerprint }: SinglePostProps): Promise<JSX.Element | null> {
  if (!post || !fingerprint) return null;

  const votedPromise = prisma.vote.findFirst({
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

  const [voted, reported] = await Promise.all([votedPromise, reportedPromise]);
  const votingDisabled = !!voted;
  const reportingDisabled = !!reported;

  return (
    <div className="flex p-2 gap-4">
      <Voting postId={post.id} upvotes={post.upvotes} disabled={votingDisabled} fingerprint={fingerprint} />
      <div id={post.id.toString()} className="flex flex-col gap-1 justify-between max-w-[80vw]">
        <div className="flex flex-col">
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
            <h2 className="text-2xl -mt-1 font-bold truncate overflow-wrap whitespace-pre-line">{post.title}</h2>
          </div>
        </div>
        <div className="text-lg overflow-wrap whitespace-pre-line">
          <div dangerouslySetInnerHTML={{ __html: bbcodeToHtml(post.content) }} />
        </div>
      </div>
    </div>
  );
}
