'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Etwas ist schief gegangen!</h2>
      <button onClick={() => reset()}>Erneut versuchen</button>
    </div>
  );
}
