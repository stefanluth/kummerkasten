'use client';

import React, { useActionState, useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { addPostAction } from '@/app/_actions/post/add';
import type { PostInputLimits } from '@/utils/post-validation';

import { SubmitButton } from '../SubmitButton';

type InputEvent = React.ChangeEvent<HTMLInputElement>;
type TextAreaEvent = React.ChangeEvent<HTMLTextAreaElement>;

type AddPostFormProps = {
  limits: PostInputLimits;
  replyTo?: string;
};

export function AddPostForm({ limits, replyTo }: AddPostFormProps) {
  const { minTitleLength, maxTitleLength, minContentLength, maxContentLength } = limits;
  const isReply = Boolean(replyTo);
  const formId = replyTo ? `reply-${replyTo}` : 'new-post';

  const formRef = useRef<HTMLFormElement>(null);
  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);
  const [state, formAction] = useActionState(addPostAction, '');

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
    <form
      action={formAction}
      ref={formRef}
      className={`flex flex-col gap-2 w-full p-2 ${isReply ? 'post-reply-form' : 'post-form'}`}
    >
      {replyTo && <input type="hidden" name="replyTo" value={replyTo} />}
      {!isReply && (
        <div className="flex flex-col gap-1 justify-between w-full">
          <div className="flex justify-between select-none">
            <label className="pl-1" htmlFor={`${formId}-title`}>
              Title
            </label>
            <p className="flex items-end text-xs pr-1 text-zinc-500">
              {titleLength}/{maxTitleLength}
            </p>
          </div>
          <input
            className="h-8"
            id={`${formId}-title`}
            name="title"
            type="text"
            minLength={minTitleLength}
            maxLength={maxTitleLength}
            onChange={handleTitleChange}
            autoComplete="on"
            autoCorrect="on"
            required
            spellCheck
          />
        </div>
      )}
      <div className="flex flex-col gap-1 justify-between">
        <div className="flex justify-between">
          <div className="flex items-baseline gap-2 select-none">
            <label className="pl-1" htmlFor={`${formId}-content`}>
              Content
            </label>
            <Link
              className="flex w-fit h-fit px-1 border-zinc-600 text-zinc-600 text-xs font-black"
              href="/faq#markdown"
              title="Markdown Support"
            >
              M&darr;
            </Link>
          </div>
          <p className="flex items-end text-xs pr-1 text-zinc-500">
            {contentLength}/{maxContentLength}
          </p>
        </div>
        <textarea
          className="resize-none"
          id={`${formId}-content`}
          name="content"
          rows={5}
          minLength={minContentLength}
          maxLength={maxContentLength}
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
          <SubmitButton text={isReply ? 'Reply' : 'Submit'} />
        </div>
      </div>
    </form>
  );
}
