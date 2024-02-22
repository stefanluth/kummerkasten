'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className={`w-20 h-7 rounded-md ${
        pending ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-700 hover:underline'
      }`}
      type="submit"
      title="Submit"
      disabled={pending}
    >
      {pending ? <p className="animate-spin">_</p> : 'Submit'}
    </button>
  );
}
