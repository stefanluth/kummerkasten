'use client';

import { redirect, usePathname } from 'next/navigation';

type HiddenRedirectProps = {
  fingerprint?: string;
  password?: string;
  unlock?: string;
};

export function HiddenRedirect({ fingerprint, password, unlock }: HiddenRedirectProps) {
  const pathName = usePathname();

  const passwordRequired = pathName !== '/unlock' && pathName !== '/faq' && pathName !== '/code-of-conduct';
  const noFingerprint = fingerprint == null || fingerprint === '';
  const wrongPassword = password !== unlock;

  if (passwordRequired && (noFingerprint || wrongPassword)) {
    redirect('/unlock');
  }

  return null;
}
