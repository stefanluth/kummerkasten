import React from 'react';

import { addPost } from '@/app/_actions';
import { DEFAULTS } from '@/utils';

export function AddPost(): JSX.Element {
  return (
    <form action={addPost} className="flex flex-col gap-2 p-2 w-full">
      <div className="flex flex-col gap-1 justify-between w-full">
        <label htmlFor="title">Titel</label>
        <input
          className="h-8"
          id="title"
          name="title"
          type="text"
          minLength={Number(process.env.MIN_TITLE_LENGTH ?? DEFAULTS.MIN_TITLE_LENGTH)}
          maxLength={Number(process.env.MAX_TITLE_LENGTH ?? DEFAULTS.MAX_TITLE_LENGTH)}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex flex-col gap-1 justify-between">
        <label htmlFor="content">Nachricht</label>
        <textarea
          className="resize-none"
          id="content"
          name="content"
          rows={5}
          minLength={Number(process.env.MIN_CONTENT_LENGTH ?? DEFAULTS.MIN_CONTENT_LENGTH)}
          maxLength={Number(process.env.MAX_CONTENT_LENGTH ?? DEFAULTS.MAX_CONTENT_LENGTH)}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex">
        <div className="flex gap-4 ml-auto items-center">
          <button className="rounded-md w-fit bg-zinc-700 px-2" type="submit">
            Absenden
          </button>
        </div>
      </div>
    </form>
  );
}
