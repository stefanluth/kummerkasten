import { describe, expect, it } from 'vitest';

import { filterBy, sortBy } from '@/utils';
import type { PostWithRelations } from '@/utils/prisma';

const makeVote = (upvote: boolean, id = `vote-${upvote}`): PostWithRelations['votes'][number] => ({
  id,
  fingerprint: 'fingerprint',
  postId: 'post',
  upvote,
});

const makeReport = (id = 'report'): PostWithRelations['reports'][number] => ({
  id,
  fingerprint: 'fingerprint',
  postId: 'post',
});

const makePost = (overrides: Partial<PostWithRelations> = {}): PostWithRelations => ({
  id: 'post',
  title: 'Title',
  content: 'Content',
  replyTo: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  reports: [],
  votes: [],
  ...overrides,
});

const filterReports = filterBy.reports as (post: PostWithRelations, reports: number) => boolean;

describe('sortBy.votes', () => {
  it('orders posts by upvotes minus downvotes, highest first', () => {
    const neutral = makePost({ id: 'neutral', votes: [makeVote(true), makeVote(false)] });
    const popular = makePost({
      id: 'popular',
      votes: [makeVote(true, 'a'), makeVote(true, 'b'), makeVote(true, 'c')],
    });
    const controversial = makePost({
      id: 'controversial',
      votes: [makeVote(true, 'd'), makeVote(false, 'e'), makeVote(false, 'f')],
    });

    expect([neutral, popular, controversial].sort(sortBy.votes).map((post) => post.id)).toEqual([
      'popular',
      'neutral',
      'controversial',
    ]);
  });

  it('treats posts without votes as zero score and keeps the higher score first', () => {
    const noVotes = makePost({ id: 'no-votes' });
    const downvoted = makePost({ id: 'downvoted', votes: [makeVote(false)] });

    expect([downvoted, noVotes].sort(sortBy.votes).map((post) => post.id)).toEqual(['no-votes', 'downvoted']);
  });
});

describe('sortBy.newest', () => {
  it('orders posts by createdAt, newest first', () => {
    const oldest = makePost({ id: 'oldest', createdAt: new Date('2023-01-01T00:00:00.000Z') });
    const newest = makePost({ id: 'newest', createdAt: new Date('2025-01-01T00:00:00.000Z') });
    const middle = makePost({ id: 'middle', createdAt: new Date('2024-01-01T00:00:00.000Z') });

    expect([oldest, newest, middle].sort(sortBy.newest).map((post) => post.id)).toEqual(['newest', 'middle', 'oldest']);
  });
});

describe('filterBy.reports', () => {
  it('keeps posts below the report threshold', () => {
    const post = makePost({ reports: [makeReport('a'), makeReport('b')] });

    expect(filterReports(post, 3)).toBe(true);
    expect(filterReports(post, 2)).toBe(false);
  });

  it('keeps posts without reports and hides posts at the threshold', () => {
    const clean = makePost({ reports: [] });
    const reported = makePost({ reports: [makeReport('a'), makeReport('b'), makeReport('c')] });

    expect(filterReports(clean, 3)).toBe(true);
    expect(filterReports(reported, 3)).toBe(false);
  });
});
