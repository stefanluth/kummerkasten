"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";

export default function AddPost(): JSX.Element {
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const createPost = async () => {
    if (!titleRef.current?.value || !contentRef.current?.value) {
      throw new Error("Missing title or content");
    }

    await fetch("/api/post/create", {
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
    <div className="flex flex-col gap-2 p-2 w-full">
      <div className="flex flex-col gap-1 justify-between w-full">
        <label htmlFor="title">Titel</label>
        <input
          className="h-8 text-input focus-outline"
          id="title"
          name="title"
          type="text"
          ref={titleRef}
          maxLength={64}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex flex-col gap-1 justify-between">
        <label htmlFor="content">Nachricht</label>
        <textarea
          className="text-input focus-outline resize-none"
          id="content"
          name="content"
          ref={contentRef}
          rows={5}
          maxLength={512}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <button
        className="rounded-md w-fit ml-auto bg-zinc-700 px-2 focus:outline-2 focus:ring-1 focus:ring-zinc-700"
        onClick={async () => await createPost()}
      >
        Absenden
      </button>
    </div>
  );
}
