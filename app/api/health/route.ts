import { prisma } from '@/utils/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json({ status: 'ok' }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ status: 'error' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
