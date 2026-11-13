'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { reportPostAction } from '@/app/_actions/post/report';

export function ReportPostForm({ postId }: { postId: string }) {
  const [, formAction] = useActionState(reportPostAction, '');

  return (
    <form action={formAction}>
      <input type="hidden" name="postId" value={postId} />
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
