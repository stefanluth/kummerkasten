'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

import { addPostAction } from '@/app/_actions/post/add';
import { DEFAULTS } from '@/utils';

import { SubmitButton } from '../SubmitButton';

const MIN_TITLE_LENGTH = Number(process.env.MIN_TITLE_LENGTH ?? DEFAULTS.MIN_TITLE_LENGTH);
const MAX_TITLE_LENGTH = Number(process.env.MAX_TITLE_LENGTH ?? DEFAULTS.MAX_TITLE_LENGTH);
const MIN_CONTENT_LENGTH = Number(process.env.MIN_CONTENT_LENGTH ?? DEFAULTS.MIN_CONTENT_LENGTH);
const MAX_CONTENT_LENGTH = Number(process.env.MAX_CONTENT_LENGTH ?? DEFAULTS.MAX_CONTENT_LENGTH);

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;

export function AddPostForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);
  const [state, formAction] = useFormState(addPostAction, '');

  const handleTitleChange = useCallback((e: InputEvent) => setTitleLength(e.target.value.length), []);
  const handleContentChange = useCallback((e: TextAreaEvent) => setContentLength(e.target.value.length), []);

  useEffect(() => {
    if (state != null) {
      return;
    }

    formRef.current?.reset();
    setTitleLength(0);
    setContentLength(0);
  }, [state]);

  return (
    <form action={formAction} ref={formRef} className="flex flex-col gap-2 w-full p-2">
      <div className="flex flex-col gap-1 justify-between w-full">
        <div className="flex justify-between select-none">
          <label className="pl-1" htmlFor="title">
            Title
          </label>
          <p className="flex items-end text-xs pr-1 text-zinc-500">
            {titleLength}/{MAX_TITLE_LENGTH}
          </p>
        </div>
        <input
          className="h-8"
          id="title"
          name="title"
          type="text"
          minLength={MIN_TITLE_LENGTH}
          maxLength={MAX_TITLE_LENGTH}
          onChange={handleTitleChange}
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
              Content
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
            {contentLength}/{MAX_CONTENT_LENGTH}
          </p>
        </div>
        <textarea
          className="resize-none"
          id="content"
          name="content"
          rows={5}
          minLength={MIN_CONTENT_LENGTH}
          maxLength={MAX_CONTENT_LENGTH}
          onChange={handleContentChange}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex">
        <div className="flex gap-4 ml-auto items-center">
          <p className="text-xs text-red-800">{state}</p>
          <SubmitButton text="Submit" />
        </div>
      </div>
    </form>
  );
}
