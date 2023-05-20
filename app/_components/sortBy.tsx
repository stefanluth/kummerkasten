"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import React from "react";

enum SortBy {
  Date = "createdAt",
  Upvotes = "upvotes",
}

export function SortByComponent() {
  const sort = useSearchParams().get("sortBy") ?? SortBy.Date;

  return (
    <div className="flex gap-2">
      <Link
        href={{
          pathname: "/",
          query: { sortBy: SortBy.Date },
        }}
        className={`${sort === SortBy.Date ? "underline" : ""} px-2 py-1 rounded-md`}
      >
        Date
      </Link>
      <Link
        href={{
          pathname: "/",
          query: { sortBy: SortBy.Upvotes },
        }}
        className={`${sort === SortBy.Upvotes ? "underline" : ""} px-2 py-1 rounded-md`}
      >
        Upvotes
      </Link>
    </div>
  );
}
