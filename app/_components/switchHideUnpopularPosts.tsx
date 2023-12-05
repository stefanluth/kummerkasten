'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { DEFAULTS } from '@/utils';

import { Switch } from './switch';

export function SwitchHideUnpopularPosts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideUnpopularPosts = searchParams.get('hideUnpopularPosts') !== null;
  const downvotesToHidePost = Number(process.env.DOWNVOTES_TO_HIDE_POST ?? DEFAULTS.DOWNVOTES_TO_HIDE_POST);

  return (
    <Switch
      checked={hideUnpopularPosts}
      label="Unbeliebte Posts verstecken"
      onSwitch={(checked) => router.push(pathname + (checked ? '?hideUnpopularPosts' : ''))}
      title={`Versteckt Posts mit ${downvotesToHidePost} oder mehr Downvotes`}
    />
  );
}
