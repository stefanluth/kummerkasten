"use client";

import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const SCROLL_TO_TOP_THRESHOLD = 300;
export function ScrollToTop(props: { element: HTMLElement | null }) {
  const [show, setShow] = useState(false);
  const { element } = props;
  if (!element) return null;

  const checkShow = () => {
    setShow(element.scrollTop > SCROLL_TO_TOP_THRESHOLD);
  };

  element.onscroll = checkShow;
  element.onmousemove = checkShow;

  return (
    <>
      {show && (
        <button
          className="fixed bottom-4 right-6"
          onClick={() => {
            element.scroll({ top: -element.scrollTop, behavior: "smooth" });
          }}
        >
          <ArrowUpCircleIcon className="w-8" />
        </button>
      )}
    </>
  );
}
