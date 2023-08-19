'use client';
import { redirect, usePathname } from 'next/navigation';

export function HiddenRedirect(fingerprint?: string, password?: string) {
  const pathName = usePathname();

  const passwordRequired = pathName !== '/unlock' && pathName !== '/faq' && pathName !== '/code-of-conduct';
  const noFingerprint = fingerprint == null || fingerprint === '';
  const wrongPassword = password !== process.env.UNLOCK_PASSWORD;

  if (passwordRequired && (noFingerprint || wrongPassword)) {
    redirect('/unlock');
  }

  return <></>;
}
