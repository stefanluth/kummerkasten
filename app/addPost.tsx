"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const MIN_TITLE_LENGTH = 4;
const MAX_TITLE_LENGTH = 128;
const MIN_CONTENT_LENGTH = 32;
const MAX_CONTENT_LENGTH = 1028;

export default function AddPost(): JSX.Element {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const createPost = async () => {
    if (
      title.length < MIN_TITLE_LENGTH ||
      content.length < MIN_CONTENT_LENGTH
    ) {
      throw new Error("Missing title or content");
    }

    await fetch("/api/post/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
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
          onChange={(e) => setTitle(e.target.value)}
          id="title"
          name="title"
          type="text"
          minLength={MIN_TITLE_LENGTH}
          maxLength={MAX_TITLE_LENGTH}
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
          onChange={(e) => setContent(e.target.value)}
          id="content"
          name="content"
          rows={5}
          minLength={MIN_CONTENT_LENGTH}
          maxLength={MAX_CONTENT_LENGTH}
          autoComplete="on"
          autoCorrect="on"
          required
          spellCheck
        />
      </div>
      <div className="flex">
        <p className="text-xs ml-1">
          {content.length}/{MAX_CONTENT_LENGTH} (min. {MIN_CONTENT_LENGTH})
        </p>
        <button
          className="rounded-md w-fit ml-auto bg-zinc-700 px-2 focus:outline-2 focus:ring-1 focus:ring-zinc-700"
          onClick={async () => await createPost()}
        >
          Absenden
        </button>
      </div>
    </div>
  );
}
