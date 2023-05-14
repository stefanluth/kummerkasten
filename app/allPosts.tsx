"use client";

import React, { useState, useRef } from "react";

import { Post } from "@prisma/client";

import SinglePost from "./singlePost";
import AddPost from "./addPost";
import { ScrollToTop } from "./scrollToTop";

enum SortBy {
  Date,
  Upvotes,
}

const sortByDate = (a: Post, b: Post) => (a.createdAt < b.createdAt ? 1 : -1);
const sortByUpvotes = (a: Post, b: Post) => (a.upvotes < b.upvotes ? 1 : -1);

export default function AllPosts(props: { posts: Post[] }) {
  const [sort, setSort] = useState<SortBy>(SortBy.Date);
  const scrollElement = useRef<HTMLDivElement>(null);

  return (
    <div className="overflow-y-auto pb-4" ref={scrollElement}>
      <div className="flex flex-col min-w-[30rem] max-w-6xl mx-auto">
        <AddPost />
        <div className="flex gap-2">
          <button
            className={`${
              sort === SortBy.Date ? "underline" : ""
            } px-2 py-1 rounded-md`}
            onClick={() => setSort(SortBy.Date)}
          >
            Date
          </button>
          <button
            className={`${
              sort === SortBy.Upvotes ? "underline" : ""
            } px-2 py-1 rounded-md`}
            onClick={() => setSort(SortBy.Upvotes)}
          >
            Upvotes
          </button>
        </div>
        <div className="flex flex-col gap-2 divide-y divide-zinc-700">
          {props.posts
            .sort(sort === SortBy.Date ? sortByDate : sortByUpvotes)
            .map((post) => (
              <SinglePost key={post.id} post={post} />
            ))}
        </div>
      </div>
      <ScrollToTop element={scrollElement.current} />
    </div>
  );
}
