'use client';

import { useCallback, useState } from 'react';

export function CopyLinkButton({ url, path }: { url?: string; path?: string }) {
  const [text, setText] = useState('Copy Link');
  const handleClick = useCallback(() => {
    if (url) {
      navigator.clipboard.writeText(url);
    } else if (path) {
      navigator.clipboard.writeText(new URL(path, window.location.origin).toString());
    } else {
      return;
    }

    setText('Copied!');
    setTimeout(() => setText('Copy Link'), 2000);
  }, []);

  return (
    <button className="w-16 hover:underline" title="Copy Link to Clipboard" onClick={handleClick}>
      {text}
    </button>
  );
}
