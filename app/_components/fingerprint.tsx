'use client';

import { createFingerprint } from '@/utils';
import { useEffect, useState } from 'react';

export function Fingerprint({ ipAddress }: { ipAddress: string }) {
  const [fingerprint, setFingerprint] = useState('' as string);
  useEffect(() => {
    setFingerprint(createFingerprint(window, ipAddress));
  }, []);

  return <input type="hidden" name="fingerprint" value={fingerprint} />;
}
