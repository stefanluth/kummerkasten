import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddPostForm, Posts } from '@/app/_components/Post';
import { SESSION_COOKIE_NAME, verifyUnlockSessionToken } from '@/utils/auth-session';
import { getEnv } from '@/utils/env';

type HomeProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const env = getEnv();
  const session = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  if (!(await verifyUnlockSessionToken(session, env.sessionSecret))) return redirect('/unlock');

  const { cursor } = await searchParams;

  return (
    <div className="flex flex-col mx-auto w-full">
      <AddPostForm
        limits={{
          minTitleLength: env.minTitleLength,
          maxTitleLength: env.maxTitleLength,
          minContentLength: env.minContentLength,
          maxContentLength: env.maxContentLength,
        }}
      />
      <Posts href="/" cursor={typeof cursor === 'string' ? cursor : undefined} />
    </div>
  );
}
