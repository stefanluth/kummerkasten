'use client';

import { useActionState } from 'react';

import { setSiteCookies } from '@/app/_actions/setSiteCookies';
import { Fingerprint } from '@/app/_components';

import { SubmitButton } from '../_components/SubmitButton';

type UnlockState = {
  error?: string;
};

async function wrappedSetSiteCookies(_: UnlockState, formData: FormData) {
  return setSiteCookies(formData);
}

export function UnlockForm({ ipAddress }: { ipAddress: string | null }) {
  const [state, formAction] = useActionState<UnlockState, FormData>(wrappedSetSiteCookies, {});

  return (
    <form action={formAction}>
      <Fingerprint ipAddress={ipAddress ?? 'unknown'} />
      <div className="flex flex-col gap-2 mt-2">
        <h1 className="text-2xl font-semibold">Unlock</h1>
        <input autoFocus type="password" name="password" id="password" placeholder="Password..." />
        <div className="flex flex-row gap-4 items-center">
          <SubmitButton text="Unlock" />
          {state.error && <div className="text-red-600">{state.error}</div>}
        </div>
      </div>
    </form>
  );
}
