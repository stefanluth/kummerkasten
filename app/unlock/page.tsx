import React from 'react';

import { headers } from 'next/headers';
import Link from 'next/link';

import { setSiteCookies } from '@/app/_actions/setSiteCookies';
import { Fingerprint } from '@/app/_components/fingerprint';

import CodeOfConduct from '../code-of-conduct/page';

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
          <Link className="underline" href="/faq">
            Fingerprint
          </Link>
          .
        </p>
        <p>Die Cookies laufen nach 24 Stunden ab.</p>
      </div>
      <form action={setSiteCookies}>
        <Fingerprint ipAddress={ipAddress ?? 'unknown'} />
        <div className="flex flex-col gap-2 mt-4">
          <h1>Passwort eingeben</h1>
          <input autoFocus type="password" name="password" id="password" placeholder="Passwort..." />
          <button type="submit" className="w-fit h-8 px-2 rounded-md bg-zinc-600">
            Absenden
          </button>
        </div>
      </form>
    </div>
  );
}
