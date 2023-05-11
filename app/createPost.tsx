"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

export default function CreatePost(): JSX.Element {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const create = () => {
    if (!titleRef.current?.value || !contentRef.current?.value) {
      throw new Error("Missing title or content");
    }

    fetch("/api/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleRef.current.value,
        content: contentRef.current.value,
      }),
    });

    router.refresh();
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-col gap-1 justify-between w-full">
        <label htmlFor="title">Title</label>
        <input
          className="h-8 text-input focus-outline"
          type="text"
          name="title"
          ref={titleRef}
          maxLength={64}
          autoComplete="on"
          autoCorrect="on"
          autoCapitalize="on"
          required
          spellCheck
        />
      </div>
      <div className="flex flex-col gap-1 justify-between w-full">
        <label htmlFor="content">Content</label>
        <textarea
          className="text-input focus-outline resize-none"
          name="content"
          ref={contentRef}
          rows={5}
          maxLength={512}
          placeholder="Was liegt dir auf dem Herzen?"
          autoComplete="on"
          autoCorrect="on"
          autoCapitalize="on"
          required
          spellCheck
        />
      </div>
      <button
        className="rounded-md w-fit bg-zinc-700 px-2 focus:outline-2 focus:ring-1 focus:ring-zinc-700"
        onClick={() => create()}
      >
        Add Post
      </button>
    </div>
  );
}
