import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  POST_FEED_PAGE_SIZE,
  type PostFeedItem,
  decodePostFeedCursor,
  encodePostFeedCursor,
  getPostFeed,
} from '@/utils/post-feed';
import { getPostReadModel } from '@/utils/post-read-model';

const { queryRaw } = vi.hoisted(() => ({ queryRaw: vi.fn() }));

vi.mock('@/utils/prisma', () => ({ prisma: { $queryRaw: queryRaw } }));
vi.mock('@/utils/env', () => ({ getEnv: () => ({ reportsToHidePost: 3 }) }));

beforeEach(() => queryRaw.mockReset());

function makeItem(id: string, score = 0): PostFeedItem {
  return {
    id,
    title: `Title ${id}`,
    content: 'Test body',
    replyTo: null,
    createdAt: new Date('2026-11-13T12:00:00.000Z'),
    score,
    reportCount: 0,
    viewerVote: null,
    viewerReported: false,
  };
}

describe('getPostFeed', () => {
  it('returns a bounded page and a score-aware cursor for top feeds', async () => {
    const rows = Array.from({ length: POST_FEED_PAGE_SIZE + 1 }, (_, index) => makeItem(`${index}`, 20 - index));
    queryRaw.mockResolvedValue(rows);

    const result = await getPostFeed({ period: 'week', sort: 'votes', fingerprint: 'viewer' });

    expect(result.items).toHaveLength(POST_FEED_PAGE_SIZE);
    expect(decodePostFeedCursor(result.nextCursor, 'votes')).toEqual({
      id: '29',
      createdAt: '2026-11-13T12:00:00.000Z',
      score: -9,
    });
    expect(queryRaw).toHaveBeenCalledTimes(1);

    const query = queryRaw.mock.calls[0][0] as { sql: string };
    expect(query.sql).toContain('SUM(CASE WHEN v."upvote" THEN 1 ELSE -1 END)');
    expect(query.sql).toContain('"score" DESC, "createdAt" DESC, id ASC');
    expect(query.sql).toContain('"reportCount" <');
  });

  it('does not create a cursor when the result fits in one page', async () => {
    queryRaw.mockResolvedValue([makeItem('only')]);

    const result = await getPostFeed({ sort: 'newest' });

    expect(result.nextCursor).toBeNull();
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });

  it('filters reported posts and continues a score-ranked page from its cursor', async () => {
    queryRaw.mockResolvedValue([]);

    await getPostFeed({
      sort: 'votes',
      visibility: 'reported',
      cursor: encodePostFeedCursor(makeItem('last-post', 7), 'votes'),
    });

    const query = queryRaw.mock.calls[0][0] as { sql: string };
    expect(query.sql).toContain('"reportCount" >=');
    expect(query.sql).toContain('"score" <');
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });
});

describe('post feed cursors', () => {
  it('round-trips newest and score-ranked cursors', () => {
    const item = makeItem('post-id', 4);

    expect(decodePostFeedCursor(encodePostFeedCursor(item, 'newest'), 'newest')).toEqual({
      id: 'post-id',
      createdAt: item.createdAt.toISOString(),
    });
    expect(decodePostFeedCursor(encodePostFeedCursor(item, 'votes'), 'votes')).toEqual({
      id: 'post-id',
      createdAt: item.createdAt.toISOString(),
      score: 4,
    });
  });

  it('ignores malformed, oversized, and score-less ranked cursors', () => {
    expect(decodePostFeedCursor('not-json', 'newest')).toBeNull();
    expect(decodePostFeedCursor('a'.repeat(2049), 'newest')).toBeNull();
    const scorelessCursor = Buffer.from(
      JSON.stringify({ id: 'post-id', createdAt: '2026-11-13T12:00:00.000Z' }),
    ).toString('base64url');
    expect(decodePostFeedCursor(scorelessCursor, 'votes')).toBeNull();
  });
});

describe('getPostReadModel', () => {
  it('returns the requested post projection from one aggregate query', async () => {
    const post = {
      ...makeItem('post-id', 2),
      reportCount: 3,
      viewerVote: true,
      viewerReported: true,
    };
    queryRaw.mockResolvedValue([post]);

    await expect(getPostReadModel('post-id', 'viewer')).resolves.toEqual(post);

    const query = queryRaw.mock.calls[0][0] as { sql: string; values: unknown[] };
    expect(query.sql).toContain('SUM(CASE WHEN v."upvote" THEN 1 ELSE -1 END)::INTEGER AS score');
    expect(query.sql).toContain('COUNT(*)::INTEGER AS count');
    expect(query.sql).toContain('WHERE p.id =');
    expect(query.values).toEqual(expect.arrayContaining(['post-id', 'viewer']));
  });

  it('returns null when the requested post does not exist', async () => {
    queryRaw.mockResolvedValue([]);

    await expect(getPostReadModel('missing-post', 'viewer')).resolves.toBeNull();
    expect(queryRaw).toHaveBeenCalledTimes(1);
  });
});
