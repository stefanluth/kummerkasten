'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

import { addPost } from '@/app/_actions/post/add';
import { DEFAULTS } from '@/utils';

export function AddPost() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [titleLength, setTitleLength] = React.useState(0);
  const [contentLength, setContentLength] = React.useState(0);

  const minTitleLength = Number(process.env.MIN_TITLE_LENGTH ?? DEFAULTS.MIN_TITLE_LENGTH);
  const maxTitleLength = Number(process.env.MAX_TITLE_LENGTH ?? DEFAULTS.MAX_TITLE_LENGTH);
  const minContentLength = Number(process.env.MIN_CONTENT_LENGTH ?? DEFAULTS.MIN_CONTENT_LENGTH);
  const maxContentLength = Number(process.env.MAX_CONTENT_LENGTH ?? DEFAULTS.MAX_CONTENT_LENGTH);

  return (
    <form
      action={(formData) => {
        addPost(formData).then(() => {
          formRef.current?.reset();
          setTitleLength(0);
          setContentLength(0);
        });
      }}
      ref={formRef}
      className="flex flex-col gap-2 w-full p-2"
    >
      <div className="flex flex-col gap-1 justify-between w-full">
        <div className="flex justify-between select-none">
          <label className="pl-1" htmlFor="title">
            Titel
          </label>
          <p className="flex items-end text-xs pr-1 text-zinc-500">
            {titleLength}/{maxTitleLength}
          </p>
        </div>
        <input
          className="h-8"
          id="title"
          name="title"
          type="text"
          minLength={minTitleLength}
          maxLength={maxTitleLength}
          onChange={(event) => setTitleLength(event.target.value.length)}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex flex-col gap-1 justify-between">
        <div className="flex justify-between">
          <div className="flex items-baseline gap-2 select-none">
            <label className="pl-1" htmlFor="content">
              Nachricht
            </label>
            <a
              className="flex w-fit h-fit px-1 border-zinc-600 text-zinc-600 text-xs font-black"
              href="/faq#markdown"
              title="Markdown Support"
            >
              M&darr;
            </a>
          </div>
          <p className="flex items-end text-xs pr-1 text-zinc-500">
            {contentLength}/{maxContentLength}
          </p>
        </div>
        <textarea
          className="resize-none"
          id="content"
          name="content"
          rows={5}
          minLength={minContentLength}
          maxLength={maxContentLength}
          onChange={(event) => setContentLength(event.target.value.length)}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex">
        <div className="flex gap-4 ml-auto items-center">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className={`rounded-md w-24 bg-zinc-700 px-2 ${pending ? 'cursor-not-allowed' : 'hover:underline'}`}
      disabled={pending}
      type="submit"
    >
      {pending ? '...' : 'Absenden'}
    </button>
  );
}
