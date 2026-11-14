'use client';

type ReplyButtonProps = {
  postId: string;
};

export function ReplyButton({ postId }: ReplyButtonProps) {
  function handleClick() {
    const thread = document.getElementById(`replies-${postId}`);
    const replyDisclosure = document.getElementById(`reply-form-disclosure-${postId}`);
    const contentField = document.getElementById(`reply-${postId}-content`);

    if (thread instanceof HTMLDetailsElement) thread.open = true;
    if (replyDisclosure instanceof HTMLDetailsElement) replyDisclosure.open = true;
    if (contentField instanceof HTMLTextAreaElement) contentField.focus();
  }

  return (
    <button type="button" className="cursor-pointer hover:underline" onClick={handleClick}>
      Reply
    </button>
  );
}
