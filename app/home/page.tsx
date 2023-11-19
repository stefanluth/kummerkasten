'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

// workaround for the form not being cleared after submission. should instead redirect to /
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return <div />;
}
