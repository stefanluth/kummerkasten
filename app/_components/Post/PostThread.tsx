import Link from 'next/link';

import { getEnv } from '@/utils/env';
import type { PostThreadPage } from '@/utils/post-thread';

import { AddPostForm } from './AddPostForm';
import { PostReply } from './PostReply';

type PostThreadProps = {
  rootPostId: string;
  thread?: PostThreadPage;
  page?: number;
};

export function PostThread({ rootPostId, thread, page }: PostThreadProps) {
  const env = getEnv();
  const limits = {
    minTitleLength: env.minTitleLength,
    maxTitleLength: env.maxTitleLength,
    minContentLength: env.minContentLength,
    maxContentLength: env.maxContentLength,
  };
  const replies = thread?.replies ?? [];
  const totalReplies = thread?.totalReplies ?? 0;
  const replyLabel = totalReplies === 1 ? '1 Reply' : `${totalReplies} Replies`;

  return (
    <details id={`replies-${rootPostId}`} open={page !== undefined} className="post-thread mt-2">
      <summary className="w-fit cursor-pointer select-none text-sm font-semibold text-sky-500 hover:underline">
        {replyLabel}
      </summary>
      <div className="post-replies mt-2 flex flex-col divide-y divide-zinc-800">
        {replies.map((reply) => (
          <PostReply key={reply.id} reply={reply} limits={limits} />
        ))}
      </div>
      {page === undefined && thread?.hasMore && (
        <Link
          className="mt-2 inline-block text-sm text-sky-500 hover:underline"
          href={`/${rootPostId}#replies-${rootPostId}`}
        >
          View all replies
        </Link>
      )}
      {page !== undefined && (page > 1 || thread?.hasMore) && (
        <nav aria-label="Reply pages" className="mt-2 flex gap-4 text-sm">
          {page > 1 && (
            <Link
              className="text-sky-500 hover:underline"
              href={`/${rootPostId}?replyPage=${page - 1}#replies-${rootPostId}`}
            >
              Previous replies
            </Link>
          )}
          {thread?.hasMore && (
            <Link
              className="text-sky-500 hover:underline"
              href={`/${rootPostId}?replyPage=${page + 1}#replies-${rootPostId}`}
            >
              More replies
            </Link>
          )}
        </nav>
      )}
      <details id={`reply-form-disclosure-${rootPostId}`} className="mt-2">
        <summary className="w-fit cursor-pointer text-sm text-zinc-400 hover:underline">Reply to post</summary>
        <AddPostForm limits={limits} replyTo={rootPostId} />
      </details>
    </details>
  );
}
