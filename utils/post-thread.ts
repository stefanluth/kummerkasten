import { Prisma } from '@/generated/prisma/client';
import { getEnv } from '@/utils/env';
import { prisma } from '@/utils/prisma';

import type { PostFeedVisibility } from './post-feed';
import type { PostReadModel } from './post-read-model';

export type PostThreadReply = Omit<PostReadModel, 'replyTo'> & {
  replyTo: string;
  replyPage: number;
  replyToPage: number | null;
  rootPostId: string;
};

export type PostThreadPage = {
  replies: PostThreadReply[];
  totalReplies: number;
  hasMore: boolean;
};

type ThreadReplyRow = PostThreadReply & { totalReplies: number };

export const POST_THREAD_PAGE_SIZE = 20;

export async function getPostThreadRootId(postId: string): Promise<string | null> {
  const rows = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
    WITH RECURSIVE parent_chain AS (
      SELECT p.id, p."replyTo"
      FROM "Post" p
      WHERE p.id = ${postId}

      UNION ALL

      SELECT parent.id, parent."replyTo"
      FROM "Post" parent
      INNER JOIN parent_chain chain ON parent.id = chain."replyTo"
    )
    SELECT id
    FROM parent_chain
    WHERE "replyTo" IS NULL
    LIMIT 1
  `);

  return rows[0]?.id ?? null;
}

export async function getPostThreadReplies(
  rootPostIds: string[],
  fingerprint: string | null = null,
  visibility: PostFeedVisibility = 'public',
  page = 1,
): Promise<Map<string, PostThreadPage>> {
  const repliesByRoot = new Map<string, PostThreadPage>(
    rootPostIds.map((id): [string, PostThreadPage] => [id, { replies: [], totalReplies: 0, hasMore: false }]),
  );
  if (rootPostIds.length === 0) return repliesByRoot;

  const offset = (page - 1) * POST_THREAD_PAGE_SIZE;
  const roots = Prisma.join(rootPostIds.map((id) => Prisma.sql`(${id})`));
  const { reportsToHidePost } = getEnv();
  const publicVisibilityFilter =
    visibility === 'public' ? Prisma.sql`WHERE COALESCE(reports.count, 0) < ${reportsToHidePost}` : Prisma.empty;

  const rows = await prisma.$queryRaw<ThreadReplyRow[]>(Prisma.sql`
    WITH RECURSIVE root_posts(id) AS (
      VALUES ${roots}
    ), thread_replies("rootPostId", id, title, content, "replyTo", "createdAt") AS (
      SELECT root.id, reply.id, reply.title, reply.content, reply."replyTo", reply."createdAt"
      FROM root_posts root
      INNER JOIN "Post" reply ON reply."replyTo" = root.id

      UNION ALL

      SELECT parent."rootPostId", reply.id, reply.title, reply.content, reply."replyTo", reply."createdAt"
      FROM thread_replies parent
      INNER JOIN "Post" reply ON reply."replyTo" = parent.id
    ), report_counts AS (
      SELECT report."postId", COUNT(*)::INTEGER AS count
      FROM "Report" report
      INNER JOIN thread_replies reply ON reply.id = report."postId"
      GROUP BY report."postId"
    ), visible_replies AS (
      SELECT
        reply."rootPostId",
        reply.id,
        reply.title,
        reply.content,
        reply."replyTo",
        reply."createdAt",
        COALESCE(reports.count, 0)::INTEGER AS "reportCount"
      FROM thread_replies reply
      LEFT JOIN report_counts reports ON reports."postId" = reply.id
      ${publicVisibilityFilter}
    ), numbered_replies AS (
      SELECT
        reply.*,
        COUNT(*) OVER (PARTITION BY reply."rootPostId")::INTEGER AS "totalReplies",
        ROW_NUMBER() OVER (
          PARTITION BY reply."rootPostId"
          ORDER BY reply."createdAt" ASC, reply.id ASC
        ) AS "rowNumber"
      FROM visible_replies reply
    ), page_replies AS (
      SELECT *
      FROM numbered_replies
      WHERE "rowNumber" > ${offset} AND "rowNumber" <= ${offset + POST_THREAD_PAGE_SIZE + 1}
    ), vote_scores AS (
      SELECT vote."postId", SUM(CASE WHEN vote."upvote" THEN 1 ELSE -1 END)::INTEGER AS score
      FROM "Vote" vote
      INNER JOIN page_replies reply ON reply.id = vote."postId"
      GROUP BY vote."postId"
    )
      SELECT
        reply.id,
        reply.title,
        reply.content,
        reply."replyTo",
        reply."createdAt",
        reply."rootPostId",
        reply."totalReplies",
        ((reply."rowNumber" - 1) / ${POST_THREAD_PAGE_SIZE} + 1)::INTEGER AS "replyPage",
        ((reply_parent."rowNumber" - 1) / ${POST_THREAD_PAGE_SIZE} + 1)::INTEGER AS "replyToPage",
        COALESCE(votes.score, 0)::INTEGER AS score,
        reply."reportCount",
        viewer_vote."upvote" AS "viewerVote",
        viewer_report."postId" IS NOT NULL AS "viewerReported"
      FROM page_replies reply
      LEFT JOIN numbered_replies reply_parent ON reply_parent.id = reply."replyTo"
      LEFT JOIN vote_scores votes ON votes."postId" = reply.id
      LEFT JOIN "Vote" viewer_vote
        ON viewer_vote."postId" = reply.id AND viewer_vote."fingerprint" = ${fingerprint}
      LEFT JOIN "Report" viewer_report
        ON viewer_report."postId" = reply.id AND viewer_report."fingerprint" = ${fingerprint}
    ORDER BY reply."rootPostId" ASC, reply."createdAt" ASC, reply.id ASC
  `);

  for (const reply of rows) {
    const thread = repliesByRoot.get(reply.rootPostId);
    if (!thread) continue;

    const { totalReplies, ...threadReply } = reply;
    thread.totalReplies = totalReplies;
    if (thread.replies.length < POST_THREAD_PAGE_SIZE) thread.replies.push(threadReply);
    else thread.hasMore = true;
  }

  return repliesByRoot;
}
