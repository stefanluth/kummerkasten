import { prisma } from '@/utils/prisma';

import { ReportPostForm } from './ReportPostForm';

export async function ReportPostButton({ postId, fingerprint }: { postId: string; fingerprint: string }) {
  const report = await prisma.report.findFirst({
    where: {
      fingerprint,
      postId: postId,
    },
  });

  if (report) return null;

  return <ReportPostForm postId={postId} fingerprint={fingerprint} />;
}
