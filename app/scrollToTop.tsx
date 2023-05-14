"use client";

import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";

export function ScrollToTop(props: { element: HTMLElement | null }) {
  const { element } = props;
  if (!element) return null;

  return (
    <button
      className="fixed bottom-4 right-6"
      onClick={() => {
        element.scroll({ top: -element.scrollTop, behavior: "smooth" });
      }}
    >
      <ArrowUpCircleIcon className="w-8" />
    </button>
  );
}
