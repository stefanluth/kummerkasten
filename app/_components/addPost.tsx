import React from 'react';

import config from '@/config.json';
import { addPost } from '@/app/_actions';

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
          minLength={config.minTitleLength}
          maxLength={config.maxTitleLength}
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
          minLength={config.minContentLength}
          maxLength={config.maxContentLength}
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
