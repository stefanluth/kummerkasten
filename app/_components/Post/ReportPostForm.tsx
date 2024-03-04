'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { reportPostAction } from '@/app/_actions/post/report';

export function ReportPostForm({ postId, fingerprint }: { postId: string; fingerprint: string }) {
  const [_, formAction] = useFormState(reportPostAction, '');

  return (
    <form action={formAction}>
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="fingerprint" value={fingerprint} />
      <SubmitButton text="Report" />
    </form>
  );
}

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`${pending ? 'text-zinc-600 cursor-not-allowed' : 'hover:underline'}`}
      type="submit"
      title="Submit"
      disabled={pending}
    >
      {pending ? <p className="animate-spin">_</p> : text}
    </button>
  );
}
