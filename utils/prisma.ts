import { Post, Prisma, PrismaClient } from '@prisma/client';

const sortByVotes = (a: PostWithRelations, b: PostWithRelations) => {
  const aUpvotes = a.votes.filter((vote) => vote.upvote === true).length;
  const bUpvotes = b.votes.filter((vote) => vote.upvote === true).length;
  const aDownvotes = a.votes.filter((vote) => vote.upvote === false).length;
  const bDownvotes = b.votes.filter((vote) => vote.upvote === false).length;

  const aVotes = aUpvotes - aDownvotes;
  const bVotes = bUpvotes - bDownvotes;

  return bVotes - aVotes;
};

const sortByNewest = (a: Post, b: Post) => {
  return b.createdAt.getTime() - a.createdAt.getTime();
};

export const sortBy: {
  [key: string]: (a: PostWithRelations, b: PostWithRelations) => number;
} = {
  votes: sortByVotes,
  newest: sortByNewest,
};

const postWithRelations = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: { reports: true, votes: true },
});

export type PostWithRelations = Prisma.PostGetPayload<typeof postWithRelations>;

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
