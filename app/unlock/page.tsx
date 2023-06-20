import React from 'react';
import Link from 'next/link';
import { setSiteCookies } from '@/app/_actions';
import { Fingerprint } from '@/app/_components/fingerprint';

export default function Unlock() {
  return (
    <div className="flex flex-col gap-4 pt-4 max-w-2xl mx-auto divide-y divide-zinc-700">
      <div className="flex flex-col gap-1">
        <p>Mit dem Absenden des Passworts werden zwei Cookies gesetzt, die den Zugriff auf die Seite freischalten.</p>
        <p>Die Cookies laufen nach 24 Stunden ab.</p>
        <p>
          Einer der Cookies enthält das Passwort, das andere deinen{' '}
          <Link className="underline" href="/faq">
            Fingerprint
          </Link>
          .
        </p>
      </div>
      <form action={setSiteCookies}>
        <Fingerprint />
        <div className="flex flex-col py-4 gap-2">
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
