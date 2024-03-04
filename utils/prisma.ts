import { Prisma, PrismaClient } from '@prisma/client';

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
