import React from 'react';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AddPostForm, Posts } from '@/app/_components/Post';
import { getEnv } from '@/utils/env';

type HomeProps = {
  searchParams: Promise<{ cursor?: string | string[] }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const env = getEnv();
  const password = (await cookies()).get('password')?.value;
  if (password !== env.unlockPassword) return redirect('/unlock');

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
