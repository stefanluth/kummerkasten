import React from 'react';

import config from '@/config.json';
import { addReply } from '@/app/_actions';

export function AddReply({ postId }: { postId: string }): JSX.Element {
  return (
    <form action={addReply} className="flex flex-col gap-2 pt-2 w-full">
      <p>Antwort schreiben:</p>
      <input type="hidden" name="postId" value={postId} />
      <div className="flex flex-col gap-1 justify-between">
        <textarea
          className="resize-none"
          id="content"
          name="content"
          minLength={config.minReplyLength}
          maxLength={config.maxReplyLength}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex">
        <div className="flex gap-4 ml-auto items-center">
          <button
            className="rounded-md w-fit bg-zinc-700 px-2 focus:outline-2 focus:ring-1 focus:ring-zinc-700"
            type="submit"
          >
            Absenden
          </button>
        </div>
      </div>
    </form>
  );
}
