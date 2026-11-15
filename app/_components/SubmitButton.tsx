'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      className={`w-20 h-7 rounded-md ${
        pending
          ? 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 cursor-not-allowed'
          : 'bg-zinc-300 dark:bg-zinc-700 border border-zinc-500 dark:border-0 hover:underline'
      }`}
      type="submit"
      title="Submit"
      disabled={pending}
    >
      {pending ? <p className="animate-spin">_</p> : text}
    </button>
  );
}
