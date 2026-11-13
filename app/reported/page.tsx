import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Posts } from '@/app/_components/Post';
import { getEnv } from '@/utils/env';

import Confirmation from './confirmation';

type ReportedProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function Reported({ searchParams }: ReportedProps) {
  const { unlockPassword } = getEnv();
  const password = (await cookies()).get('password')?.value;
  if (password !== unlockPassword) return redirect('/unlock');

  const { cursor } = await searchParams;

  return (
    <>
      <Confirmation />
      <Posts href="/reported" cursor={typeof cursor === 'string' ? cursor : undefined} visibility="reported" />
    </>
  );
}
