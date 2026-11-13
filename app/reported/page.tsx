import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Posts } from '@/app/_components/Post';
import { SESSION_COOKIE_NAME, verifyUnlockSessionToken } from '@/utils/auth-session';
import { getEnv } from '@/utils/env';

import Confirmation from './confirmation';

type ReportedProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function Reported({ searchParams }: ReportedProps) {
  const { sessionSecret } = getEnv();
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifyUnlockSessionToken(session, sessionSecret))) return redirect('/unlock');

  const { cursor } = await searchParams;

  return (
    <>
      <Confirmation />
      <Posts href="/reported" cursor={typeof cursor === 'string' ? cursor : undefined} visibility="reported" />
    </>
  );
}
