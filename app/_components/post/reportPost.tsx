'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { reportPostAction } from '@/app/_actions/post/report';

export function ReportPost({ postId, fingerprint }: { postId: string; fingerprint: string }) {
  const [_, formAction] = useFormState(reportPostAction, '');
  const { pending } = useFormStatus();

  return (
    <form action={formAction}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="fingerprint" value={fingerprint} />
      <button className="hover:underline" type="submit" title="Report Post">
        {pending ? '...' : 'Report'}
      </button>
    </form>
  );
}
