import type { Post } from '@/generated/prisma/client';

import { DEFAULTS } from './defaults';
import type { PostWithRelations } from './prisma';

export type FilterFunction = (a: PostWithRelations) => boolean;
export type ReportsFilterFunction = (a: PostWithRelations, reports?: number) => boolean;
export type SortFunction = (a: PostWithRelations, b: PostWithRelations) => number;

const sortByVotes: SortFunction = (a: PostWithRelations, b: PostWithRelations) => {
  const aUpvotes = a.votes.filter((vote) => vote.upvote === true).length;
  const bUpvotes = b.votes.filter((vote) => vote.upvote === true).length;
  const aDownvotes = a.votes.filter((vote) => vote.upvote === false).length;
  const bDownvotes = b.votes.filter((vote) => vote.upvote === false).length;

  const aVotes = aUpvotes - aDownvotes;
  const bVotes = bUpvotes - bDownvotes;

  return bVotes - aVotes;
};

const sortByNewest: SortFunction = (a: Post, b: Post) => {
  return b.createdAt.getTime() - a.createdAt.getTime();
};

export const sortBy: {
  [key: string]: SortFunction;
} = {
  votes: sortByVotes,
  newest: sortByNewest,
};

const filterByReported: ReportsFilterFunction = (post: PostWithRelations, reports = DEFAULTS.REPORTS_TO_HIDE_POST) => {
  return post.reports.length < reports;
};

export const filterBy: {
  [key: string]: ReportsFilterFunction;
} = {
  reports: filterByReported,
};
