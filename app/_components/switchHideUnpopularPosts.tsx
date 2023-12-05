'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Switch } from './switch';

export function SwitchHideUnpopularPosts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideUnpopularPosts = searchParams.get('hideUnpopularPosts') !== null;

  return (
    <Switch
      label="Unbeliebte Posts verstecken"
      checked={hideUnpopularPosts}
      onSwitch={(checked) => router.push(pathname + (checked ? '?hideUnpopularPosts' : ''))}
    />
  );
}
