"use client";

import React, { MouseEventHandler, useState } from "react";

import { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, MIN_CONTENT_LENGTH, MAX_CONTENT_LENGTH } from "@/utils/constants";
import { addPost } from "../_actions";

export function AddPost(): JSX.Element {
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function validate(): MouseEventHandler<HTMLButtonElement> | undefined {
    return () => {
      if (content.length < MIN_CONTENT_LENGTH) {
        setError(`Die Nachricht muss mindestens ${MIN_CONTENT_LENGTH} Zeichen lang sein.`);
      } else if (content.length > MAX_CONTENT_LENGTH) {
        setError(`Die Nachricht darf maximal ${MAX_CONTENT_LENGTH} Zeichen lang sein.`);
      } else if (title.length < MIN_TITLE_LENGTH) {
        setError(`Der Titel muss mindestens ${MIN_TITLE_LENGTH} Zeichen lang sein.`);
      } else if (title.length > MAX_TITLE_LENGTH) {
        setError(`Der Titel darf maximal ${MAX_TITLE_LENGTH} Zeichen lang sein.`);
      } else {
        setError("");
        setTitle("");
        setContent("");
      }
    };
  }

  return (
    <form action={addPost} className="flex flex-col gap-2 p-2 w-full">
      <div className="flex flex-col gap-1 justify-between w-full">
        <label htmlFor="title">Titel</label>
        <input
          className="h-8"
          id="title"
          name="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          className="resize-none"
          id="content"
          name="content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
        <div className="flex gap-4 ml-auto items-center">
          <p className="text-sm text-red-800">{error}</p>
          <button
            className="rounded-md w-fit bg-zinc-700 px-2 focus:outline-2 focus:ring-1 focus:ring-zinc-700"
            onClick={validate}
            type="submit"
          >
            Absenden
          </button>
        </div>
      </div>
    </form>
  );
}
