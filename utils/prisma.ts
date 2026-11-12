import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from '@/generated/prisma/client';
import { getEnv } from '@/utils/env';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export type PostWithRelations = Prisma.PostGetPayload<{
  include: { reports: true; votes: true };
}>;

const connectionString = getEnv().databaseUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg({ connectionString, connectionTimeoutMillis: 5000 }),
    log: ['info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
