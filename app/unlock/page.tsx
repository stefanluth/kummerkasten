import React from 'react';
import { setPasswordCookie } from '../_actions';

export default function Unlock() {
  return (
    <form action={setPasswordCookie}>
      <div className="flex flex-col max-w-lg p-4 gap-2 mx-auto">
        <h1>Passwort eingeben</h1>
        <input type="password" name="password" id="password" placeholder="Passwort..." />
        <button type="submit" className="w-fit h-8 px-2 rounded-md bg-zinc-600">
          Absenden
        </button>
      </div>
    </form>
  );
}
