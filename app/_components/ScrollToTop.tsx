'use client';

import { useCallback, useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 500;

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  const onScroll = useCallback(() => {
    setShow(window.scrollY > SCROLL_THRESHOLD);
  }, [window.scrollY]);

  useEffect(() => {
    // Initial check can't run outside of useEffect because window is not defined
    onScroll();

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`fixed bottom-12 right-4 h-12 w-12 bg-zinc-700 text-zinc-100 rounded-full focus:rounded-full hover:bg-zinc-600 hover:text-zinc-200 ${
        show ? 'opacity-100' : 'opacity-0 -z-10'
      } transition-all duration-300 ease-in-out`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      &uarr;
    </button>
  );
}
