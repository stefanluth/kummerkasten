import { ReportPostForm } from './ReportPostForm';

export function ReportPostButton({ postId, hasReported }: { postId: string; hasReported: boolean }) {
  if (hasReported) return null;

  return <ReportPostForm postId={postId} />;
}
