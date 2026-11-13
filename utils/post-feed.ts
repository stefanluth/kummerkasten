import { Prisma } from '@/generated/prisma/client';
import { getEnv } from '@/utils/env';
import { prisma } from '@/utils/prisma';

import type { PostReadModel } from './post-read-model';
import { type TopPeriod, getTopPeriodStart } from './top-periods';

export type PostFeedSort = 'newest' | 'votes';
export type PostFeedVisibility = 'public' | 'reported';

export type PostFeedItem = PostReadModel;

export type PostFeedPage = {
  items: PostFeedItem[];
  nextCursor: string | null;
};

export type PostFeedOptions = {
  period?: TopPeriod;
  sort?: PostFeedSort;
  visibility?: PostFeedVisibility;
  cursor?: string | null;
  fingerprint?: string | null;
};

type FeedRow = PostFeedItem;
type FeedCursor = { id: string; createdAt: string; score?: number };

export const POST_FEED_PAGE_SIZE = 30;

export async function getPostFeed({
  period = 'all',
  sort = 'newest',
  visibility = 'public',
  cursor: cursorValue,
  fingerprint = null,
}: PostFeedOptions): Promise<PostFeedPage> {
  const cursor = decodePostFeedCursor(cursorValue, sort);
  const periodStart = getTopPeriodStart(period);
  const { reportsToHidePost } = getEnv();
  const visibilityFilter =
    visibility === 'reported'
      ? Prisma.sql`AND "reportCount" >= ${reportsToHidePost}`
      : Prisma.sql`AND "reportCount" < ${reportsToHidePost}`;
  const cursorFilter = getCursorFilter(cursor, sort);
  const ordering =
    sort === 'votes' ? Prisma.sql`"score" DESC, "createdAt" DESC, id ASC` : Prisma.sql`"createdAt" DESC, id ASC`;

  const rows = await prisma.$queryRaw<FeedRow[]>(Prisma.sql`
    WITH eligible_posts AS (
      SELECT p.id, p.title, p.content, p."replyTo", p."createdAt"
      FROM "Post" p
      WHERE p."replyTo" IS NULL
        AND p."createdAt" >= COALESCE(${periodStart}::timestamp, '-infinity'::timestamp)
    ), vote_scores AS (
      SELECT v."postId", SUM(CASE WHEN v."upvote" THEN 1 ELSE -1 END)::INTEGER AS score
      FROM "Vote" v
      INNER JOIN eligible_posts p ON p.id = v."postId"
      GROUP BY v."postId"
    ), report_counts AS (
      SELECT r."postId", COUNT(*)::INTEGER AS count
      FROM "Report" r
      INNER JOIN eligible_posts p ON p.id = r."postId"
      GROUP BY r."postId"
    ), feed_items AS (
      SELECT
        p.id,
        p.title,
        p.content,
        p."replyTo",
        p."createdAt",
        COALESCE(vs.score, 0)::INTEGER AS score,
        COALESCE(rc.count, 0)::INTEGER AS "reportCount",
        viewer_vote."upvote" AS "viewerVote",
        viewer_report."postId" IS NOT NULL AS "viewerReported"
      FROM eligible_posts p
      LEFT JOIN vote_scores vs ON vs."postId" = p.id
      LEFT JOIN report_counts rc ON rc."postId" = p.id
      LEFT JOIN "Vote" viewer_vote
        ON viewer_vote."postId" = p.id AND viewer_vote."fingerprint" = ${fingerprint}
      LEFT JOIN "Report" viewer_report
        ON viewer_report."postId" = p.id AND viewer_report."fingerprint" = ${fingerprint}
    )
    SELECT *
    FROM feed_items
    WHERE TRUE
      ${visibilityFilter}
      ${cursorFilter}
    ORDER BY ${ordering}
    LIMIT ${POST_FEED_PAGE_SIZE + 1}
  `);

  const hasNextPage = rows.length > POST_FEED_PAGE_SIZE;
  const items = rows.slice(0, POST_FEED_PAGE_SIZE);
  const lastItem = items.at(-1);

  return {
    items,
    nextCursor: hasNextPage && lastItem ? encodePostFeedCursor(lastItem, sort) : null,
  };
}

export function encodePostFeedCursor(item: PostFeedItem, sort: PostFeedSort): string {
  const cursor: FeedCursor = {
    id: item.id,
    createdAt: item.createdAt.toISOString(),
    ...(sort === 'votes' ? { score: item.score } : {}),
  };

  return Buffer.from(JSON.stringify(cursor)).toString('base64url');
}

export function decodePostFeedCursor(value: string | null | undefined, sort: PostFeedSort): FeedCursor | null {
  if (!value || value.length > 2048) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(value, 'base64url').toString('utf8'));
    if (!parsed || typeof parsed !== 'object') return null;

    const candidate = parsed as Partial<FeedCursor>;
    if (typeof candidate.id !== 'string' || !candidate.id) return null;
    if (typeof candidate.createdAt !== 'string' || !Number.isFinite(Date.parse(candidate.createdAt))) {
      return null;
    }
    if (sort === 'votes' && !Number.isSafeInteger(candidate.score)) return null;

    return {
      id: candidate.id,
      createdAt: new Date(candidate.createdAt).toISOString(),
      ...(sort === 'votes' ? { score: candidate.score } : {}),
    };
  } catch {
    return null;
  }
}

function getCursorFilter(cursor: FeedCursor | null, sort: PostFeedSort): Prisma.Sql {
  if (!cursor) return Prisma.empty;

  if (sort === 'votes') {
    const score = cursor.score ?? 0;

    return Prisma.sql`AND (
      "score" < ${score}
      OR ("score" = ${score} AND "createdAt" < ${new Date(cursor.createdAt)}::timestamp)
      OR ("score" = ${score} AND "createdAt" = ${new Date(cursor.createdAt)}::timestamp AND id > ${cursor.id})
    )`;
  }

  return Prisma.sql`AND (
    "createdAt" < ${new Date(cursor.createdAt)}::timestamp
    OR ("createdAt" = ${new Date(cursor.createdAt)}::timestamp AND id > ${cursor.id})
  )`;
}
