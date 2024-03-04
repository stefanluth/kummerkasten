import { Marked } from 'marked';

import Link from 'next/link';

import { CopyLinkButton } from '@/app/_components';
import { DEFAULTS, MARKED_POST_OPTIONS, getTimeAgo } from '@/utils';
import { PostWithRelations, prisma } from '@/utils/prisma';

import { ReportPostButton } from './ReportPost';
import { Voting } from './Voting';

type PostProps = {
  post?: PostWithRelations | null;
  fingerprint?: string | null;
};

export async function Post({ post, fingerprint }: PostProps): Promise<JSX.Element | null> {
  if (!post || !fingerprint) return null;

  const marked = new Marked(MARKED_POST_OPTIONS);

  const upvotes = post.votes?.filter((vote) => vote.upvote === true).length;
  const downvotes = post.votes?.filter((vote) => vote.upvote === false).length;

  return (
    <div className="flex p-2 gap-4 max-w-[100%-10rem]">
      <div className="pt-4 w-5">
        <Voting postId={post.id} upvotes={upvotes - downvotes} fingerprint={fingerprint} />
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
          dangerouslySetInnerHTML={{ __html: await marked.parse(post.content) }}
        />
        <div className="flex gap-2 items-baseline text-xs text-zinc-500">
          <Link id={post.id} href={`/${post.id}`} className="post-id hover:underline" title="View Post in New Tab">
            View
          </Link>
          <CopyLinkButton path={`/${post.id}`} />
          <ReportPostButton postId={post.id} fingerprint={fingerprint} />
        </div>
      </div>
    </div>
  );
}
