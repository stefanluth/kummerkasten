'use client';

import type { MouseEvent, ReactNode } from 'react';

type ReplyReferenceLinkProps = {
  replyId: string;
  children: ReactNode;
};

export function ReplyReferenceLink({ replyId, children }: ReplyReferenceLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (!document.getElementById(replyId)) event.preventDefault();
  }

  return (
    <a
      href={`#${replyId}`}
      aria-label={`View reply ${replyId}`}
      className="reply-reference-link hover:underline"
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
