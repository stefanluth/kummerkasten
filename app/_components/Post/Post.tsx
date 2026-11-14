import { Marked } from 'marked';

import type { JSX } from 'react';

import Link from 'next/link';

import { CopyLinkButton } from '@/app/_components';
import { MARKED_POST_OPTIONS, getTimeAgo } from '@/utils';
import type { PostFeedItem } from '@/utils/post-feed';
import type { PostThreadPage } from '@/utils/post-thread';

import { BookmarkButton } from './BookmarkButton';
import { PostThread } from './PostThread';
import { ReplyButton } from './ReplyButton';
import { ReportPostButton } from './ReportPost';
import { Voting } from './Voting';

type PostProps = {
  post?: PostFeedItem | null;
  thread?: PostThreadPage;
  replyPage?: number;
};

export async function Post({ post, thread, replyPage }: PostProps): Promise<JSX.Element | null> {
  if (!post) return null;

  const marked = new Marked(MARKED_POST_OPTIONS);

  return (
    <article data-post-id={post.id} className="post-card flex w-full min-w-0 gap-2 p-2 sm:gap-4">
      <div className="pt-4 w-5 shrink-0">
        <Voting postId={post.id} score={post.score} viewerVote={post.viewerVote} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1 justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 items-baseline">
            <Link href={`/${post.id}`} className="overflow-anywhere text-xs text-zinc-500 hover:underline">
              #{post.id.slice(0, 6)} · {getTimeAgo(post.createdAt.getTime())}
            </Link>
          </div>
          <div className="flex items-baseline">
            <h2 className="text-xl font-bold overflow-anywhere sm:text-3xl">{post.title}</h2>
          </div>
        </div>
        <div
          className="text-base overflow-anywhere post-content sm:text-lg"
          dangerouslySetInnerHTML={{ __html: await marked.parse(post.content) }}
        />
        <div className="post-action-row flex gap-2 items-baseline text-xs text-zinc-500">
          <ReplyButton postId={post.id} />
          <CopyLinkButton path={`/${post.id}`} />
          <BookmarkButton postId={post.id} />
          <ReportPostButton postId={post.id} hasReported={post.viewerReported} />
        </div>
        <PostThread rootPostId={post.id} thread={thread} page={replyPage} />
      </div>
    </article>
  );
}
