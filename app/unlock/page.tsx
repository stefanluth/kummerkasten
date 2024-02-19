import React from 'react';

import { headers } from 'next/headers';

import CodeOfConduct from '../code-of-conduct/page';
import { UnlockForm } from './form';

export default function Unlock() {
  const ipAddress = headers().get('x-real-ip') ?? headers().get('x-forwarded-for');

  return (
    <div className="flex flex-col max-w-2xl mx-auto divide-y divide-zinc-700">
      <CodeOfConduct />
      <div className="flex flex-col py-2 my-2">
        <h1 className="text-2xl font-semibold">Cookies</h1>
        <p>By submitting the password, two cookies will be set to unlock the page.</p>
        <p>
          One of the cookies contains the password, the other your{' '}
          <a className="underline" href="/faq">
            fingerprint
          </a>
          .
        </p>
        <p>The cookies expire after 24 hours.</p>
      </div>
      <UnlockForm ipAddress={ipAddress} />
    </div>
  );
}
