'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';

import { addPostAction } from '@/app/_actions/post/add';
import { DEFAULTS } from '@/utils';

import { SubmitButton } from '../SubmitButton';

export function AddReplyForm({ postId }: { postId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(addPostAction, '');
  const [contentLength, setContentLength] = useState(0);
  // const [expanded, setExpanded] = useState(false);

  const minContentLength = Number(process.env.MIN_CONTENT_LENGTH ?? DEFAULTS.MIN_CONTENT_LENGTH);
  const maxContentLength = Number(process.env.MAX_CONTENT_LENGTH ?? DEFAULTS.MAX_CONTENT_LENGTH);

  useEffect(() => {
    formRef.current?.reset();
    setContentLength(0);
  }, []);

  return (
    <>
      {/* <button className="hover:underline" title="Reply to Post" onClick={() => setExpanded(!expanded)}>
        Reply
      </button> */}
      <form
        action={formAction}
        ref={formRef}
        // className={`${
        //   expanded ? 'opacity-100 max-h-full max-w-full text-zinc-400' : 'opacity-0 max-h-0 max-w-0'
        // } transition-all duration-200 flex flex-col gap-2 pb-4 -translate-x-36 translate-y-6`}
        className="flex flex-col gap-2"
      >
        <div className="flex flex-col gap-1 justify-between">
          <div className="flex justify-between select-none">
            <p className="flex items-end text-xs pr-1 text-zinc-500">
              {contentLength}/{maxContentLength}
            </p>
          </div>
          <input type="hidden" name="title" value={`@${postId}`} />
          <input type="hidden" name="replyTo" value={postId} />
          <textarea
            className="resize-none w-96"
            id="content"
            name="content"
            rows={3}
            minLength={minContentLength}
            maxLength={maxContentLength}
            onChange={(event) => setContentLength(event.target.value.length)}
            autoComplete="on"
            autoCorrect="on"
            required
            spellCheck
          />
        </div>
        <div className="flex justify-end">
          <div className="flex gap-4 ml-auto items-center">
            <p className="text-xs text-red-800">{state}</p>
            <SubmitButton text="Reply" />
          </div>
        </div>
      </form>
    </>
  );
}
