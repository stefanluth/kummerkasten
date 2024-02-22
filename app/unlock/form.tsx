'use client';

import { useFormState, useFormStatus } from 'react-dom';

import { setSiteCookies } from '@/app/_actions/setSiteCookies';
import { Fingerprint } from '@/app/_components/fingerprint';

import { SubmitButton } from '../_components/submitButton';

async function wrappedSetSiteCookies(_: any, formData: FormData) {
  return setSiteCookies(formData);
}

export function UnlockForm({ ipAddress }: { ipAddress: string | null }) {
  const [state, formAction] = useFormState(wrappedSetSiteCookies, {});

  return (
    <form action={formAction}>
      <Fingerprint ipAddress={ipAddress ?? 'unknown'} />
      <div className="flex flex-col gap-2 mt-2">
        <h1 className="text-2xl font-semibold">Unlock</h1>
        <input autoFocus type="password" name="password" id="password" placeholder="Password..." />
        <div className="flex flex-row gap-4 items-center">
          <SubmitButton />
          {state.error && <div className="text-red-600">{state.error}</div>}
        </div>
      </div>
    </form>
  );
}
