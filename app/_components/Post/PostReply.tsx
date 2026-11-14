import { Marked } from 'marked';

import type { JSX } from 'react';

import Link from 'next/link';

import { MARKED_POST_OPTIONS, getTimeAgo } from '@/utils';
import type { PostThreadReply } from '@/utils/post-thread';
import type { PostInputLimits } from '@/utils/post-validation';

import { AddPostForm } from './AddPostForm';
import { ReplyReferenceLink } from './ReplyReferenceLink';
import { ReportPostButton } from './ReportPost';
import { Voting } from './Voting';

type PostReplyProps = {
  reply: PostThreadReply;
  limits: PostInputLimits;
};

export async function PostReply({ reply, limits }: PostReplyProps): Promise<JSX.Element> {
  const marked = new Marked(MARKED_POST_OPTIONS);
  const repliedToReply = reply.replyTo !== reply.rootPostId;
  const repliedToLabel = repliedToReply ? `@${reply.replyTo.slice(0, 6)}` : null;
  const replyPageQuery = reply.replyPage > 1 ? `?replyPage=${reply.replyPage}` : '';

  return (
    <article
      id={reply.id}
      data-post-id={reply.id}
      className="post-reply flex w-full min-w-0 gap-2 border-l border-zinc-700 py-2 pl-2 sm:gap-3 sm:pl-3"
    >
      <div className="pt-2 w-5 shrink-0">
        <Voting postId={reply.id} score={reply.score} viewerVote={reply.viewerVote} targetType="reply" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <Link
          href={`/${reply.rootPostId}${replyPageQuery}#${reply.id}`}
          className="w-fit overflow-anywhere text-xs text-zinc-500 hover:underline"
        >
          #{reply.id.slice(0, 6)} · {getTimeAgo(reply.createdAt.getTime())}
        </Link>
        <div className="post-content overflow-anywhere">
          {repliedToLabel && (
            <p className="mb-1 text-sm text-zinc-500" title={`Reply to ${reply.replyTo}`}>
              <ReplyReferenceLink replyId={reply.replyTo}>{repliedToLabel}</ReplyReferenceLink>
            </p>
          )}
          <div dangerouslySetInnerHTML={{ __html: await marked.parse(reply.content) }} />
        </div>
        <div className="flex items-baseline gap-3 text-xs text-zinc-500">
          <ReportPostButton postId={reply.id} hasReported={reply.viewerReported} />
          <details>
            <summary className="cursor-pointer hover:underline">Reply</summary>
            <AddPostForm limits={limits} replyTo={reply.id} />
          </details>
        </div>
      </div>
    </article>
  );
}
