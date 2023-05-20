import { PrismaClient } from '@prisma/client';

declare const global: Global & { prisma?: PrismaClient };

export let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env['NODE_ENV'] === 'production') {
    prisma = new PrismaClient({
      log: ['query'],
    });
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient({
        log: ['query'],
      });
    }
    prisma = global.prisma;
  }
}


// @ts-ignore https://github.com/prisma/prisma/issues/6219#issuecomment-840676092
export default prisma;
