import React from 'react';

import { headers } from 'next/headers';
import Link from 'next/link';

import CodeOfConduct from '../code-of-conduct/page';
import { UnlockForm } from './form';

export default function Unlock() {
  const ipAddress = headers().get('x-real-ip') ?? headers().get('x-forwarded-for');

  return (
    <div className="flex flex-col w-full mx-auto px-2 divide-y divide-zinc-700">
      <CodeOfConduct />
      <div className="flex flex-col py-2 my-2">
        <h1 className="text-2xl font-semibold">Cookies</h1>
        <p>By submitting the password, two cookies will be set to unlock the page.</p>
        <p>
          One of the cookies contains the password, the other your{' '}
          <Link className="underline" href="/faq#fingerprint">
            fingerprint
          </Link>
          .
        </p>
        <p>The cookies expire after 24 hours.</p>
      </div>
      <UnlockForm ipAddress={ipAddress} />
    </div>
  );
}
