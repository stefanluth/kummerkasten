'use client';

import { createFingerprint } from '@/utils';
import { useEffect, useState } from 'react';

export function Fingerprint() {
  const [fingerprint, setFingerprint] = useState('' as string);
  useEffect(() => {
    setFingerprint(createFingerprint(window));
  }, []);

  return <input type="hidden" name="fingerprint" value={fingerprint} />;
}
