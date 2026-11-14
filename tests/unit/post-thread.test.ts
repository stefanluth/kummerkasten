import { beforeEach, describe, expect, it, vi } from 'vitest';

import { POST_THREAD_PAGE_SIZE, getPostThreadReplies, getPostThreadRootId } from '@/utils/post-thread';

const { queryRaw } = vi.hoisted(() => ({ queryRaw: vi.fn() }));

vi.mock('@/utils/prisma', () => ({ prisma: { $queryRaw: queryRaw } }));
vi.mock('@/utils/env', () => ({ getEnv: () => ({ reportsToHidePost: 3 }) }));

beforeEach(() => queryRaw.mockReset());

describe('post thread reads', () => {
  it('resolves a reply chain to its top-level post', async () => {
    queryRaw.mockResolvedValue([{ id: 'root-id' }]);

    await expect(getPostThreadRootId('reply-id')).resolves.toBe('root-id');

    const query = queryRaw.mock.calls[0][0] as { sql: string; values: unknown[] };
    expect(query.sql).toContain('WITH RECURSIVE parent_chain');
    expect(query.sql).toContain('parent.id = chain."replyTo"');
    expect(query.values).toContain('reply-id');
  });

  it('groups every descendant by root and filters reported replies from public threads', async () => {
    const reply = {
      id: 'nested-reply-id',
      title: 'Root title',
      content: 'Nested response',
      replyTo: 'reply-id',
      replyPage: 3,
      replyToPage: 2,
      rootPostId: 'root-id',
      createdAt: new Date('2026-11-14T12:00:00.000Z'),
      score: 2,
      reportCount: 0,
      viewerVote: true,
      viewerReported: false,
    };
    queryRaw.mockResolvedValue([{ ...reply, totalReplies: 1 }]);

    const threads = await getPostThreadReplies(['root-id'], 'viewer');

    expect(threads.get('root-id')?.replies).toEqual([reply]);
    const query = queryRaw.mock.calls[0][0] as { sql: string; values: unknown[] };
    expect(query.sql).toContain('WITH RECURSIVE root_posts');
    expect(query.sql).toContain('ROW_NUMBER() OVER');
    expect(query.sql).toContain('LEFT JOIN numbered_replies reply_parent');
    expect(query.sql).toContain('AS "replyPage"');
    expect(query.sql).toContain('AS "replyToPage"');
    expect(query.sql).toContain('WHERE COALESCE(reports.count, 0) <');
    expect(query.values).toEqual(expect.arrayContaining(['root-id', 'viewer', 3]));
  });

  it('returns one page of replies and marks when another page exists', async () => {
    queryRaw.mockResolvedValue(
      Array.from({ length: POST_THREAD_PAGE_SIZE + 1 }, (_, index) => ({
        id: `reply-${index}`,
        title: 'Root title',
        content: `Reply ${index}`,
        replyTo: 'root-id',
        replyPage: Math.floor(index / POST_THREAD_PAGE_SIZE) + 1,
        replyToPage: null,
        rootPostId: 'root-id',
        createdAt: new Date('2026-11-14T12:00:00.000Z'),
        score: 0,
        reportCount: 0,
        viewerVote: null,
        viewerReported: false,
        totalReplies: 25,
      })),
    );

    const threads = await getPostThreadReplies(['root-id']);

    expect(threads.get('root-id')).toMatchObject({
      totalReplies: 25,
      hasMore: true,
      replies: expect.arrayContaining([expect.objectContaining({ id: 'reply-0' })]),
    });
    expect(threads.get('root-id')?.replies).toHaveLength(POST_THREAD_PAGE_SIZE);

    const query = queryRaw.mock.calls[0][0] as { values: unknown[] };
    expect(query.values).toEqual(expect.arrayContaining([0, POST_THREAD_PAGE_SIZE + 1]));

    queryRaw.mockResolvedValue([]);
    await getPostThreadReplies(['root-id'], null, 'public', 2);
    const secondPageQuery = queryRaw.mock.calls[1][0] as { values: unknown[] };
    expect(secondPageQuery.values).toEqual(
      expect.arrayContaining([POST_THREAD_PAGE_SIZE, POST_THREAD_PAGE_SIZE * 2 + 1]),
    );
  });

  it('keeps reported replies available in the reported-post view and skips empty batches', async () => {
    queryRaw.mockResolvedValue([]);

    await getPostThreadReplies(['root-id'], null, 'reported');
    const reportedQuery = queryRaw.mock.calls[0][0] as { sql: string };
    expect(reportedQuery.sql).not.toContain('WHERE COALESCE(reports.count, 0) <');

    queryRaw.mockClear();
    await expect(getPostThreadReplies([])).resolves.toEqual(new Map());
    expect(queryRaw).not.toHaveBeenCalled();
  });
});
