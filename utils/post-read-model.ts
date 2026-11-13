import { Prisma } from '@/generated/prisma/client';
import { prisma } from '@/utils/prisma';

export type PostReadModel = {
  id: string;
  title: string;
  content: string;
  replyTo: string | null;
  createdAt: Date;
  score: number;
  reportCount: number;
  viewerVote: boolean | null;
  viewerReported: boolean;
};

export async function getPostReadModel(id: string, fingerprint: string | null = null): Promise<PostReadModel | null> {
  const rows = await prisma.$queryRaw<PostReadModel[]>(Prisma.sql`
    WITH requested_post AS (
      SELECT p.id, p.title, p.content, p."replyTo", p."createdAt"
      FROM "Post" p
      WHERE p.id = ${id}
    ), vote_scores AS (
      SELECT v."postId", SUM(CASE WHEN v."upvote" THEN 1 ELSE -1 END)::INTEGER AS score
      FROM "Vote" v
      INNER JOIN requested_post p ON p.id = v."postId"
      GROUP BY v."postId"
    ), report_counts AS (
      SELECT r."postId", COUNT(*)::INTEGER AS count
      FROM "Report" r
      INNER JOIN requested_post p ON p.id = r."postId"
      GROUP BY r."postId"
    )
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
    FROM requested_post p
    LEFT JOIN vote_scores vs ON vs."postId" = p.id
    LEFT JOIN report_counts rc ON rc."postId" = p.id
    LEFT JOIN "Vote" viewer_vote
      ON viewer_vote."postId" = p.id AND viewer_vote."fingerprint" = ${fingerprint}
    LEFT JOIN "Report" viewer_report
      ON viewer_report."postId" = p.id AND viewer_report."fingerprint" = ${fingerprint}
  `);

  return rows[0] ?? null;
}
