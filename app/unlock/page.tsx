import React from 'react';

import { headers } from 'next/headers';

import CodeOfConduct from '../code-of-conduct/page';
import { UnlockForm } from './form';

export default function Unlock() {
  const ipAddress = headers().get('x-real-ip') ?? headers().get('x-forwarded-for');

  return (
    <div className="flex flex-col max-w-2xl mx-auto divide-y divide-zinc-700">
      <CodeOfConduct />
      <div className="flex flex-col py-4 my-4">
        <h1 className="text-2xl font-semibold">Seite entsperren</h1>
        <p>Mit dem Absenden des Passworts werden zwei Cookies gesetzt, die den Zugriff auf die Seite freischalten.</p>
        <p>
          Einer der Cookies enthält das Passwort, das andere deinen{' '}
          <a className="underline" href="/faq#fingerprint">
            Fingerprint
          </a>
          .
        </p>
        <p>Die Cookies laufen nach 24 Stunden ab.</p>
      </div>
      <UnlockForm ipAddress={ipAddress} />
    </div>
  );
}
