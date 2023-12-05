'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Switch } from '@/app/_components/switch';
import { DEFAULTS } from '@/utils';

export function SwitchHideUnpopularPosts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hideUnpopularPosts = searchParams.get('hideUnpopularPosts') !== null;
  const downvotesToHidePost = Number(process.env.DOWNVOTES_TO_HIDE_POST ?? DEFAULTS.DOWNVOTES_TO_HIDE_POST);

  function onSwitch(checked: boolean) {
    router.push(pathname + (checked ? '?hideUnpopularPosts' : ''));
  }

  return (
    <Switch
      checked={hideUnpopularPosts}
      label="Unbeliebte Posts verstecken"
      onSwitch={onSwitch}
      title={`Versteckt Posts mit ${downvotesToHidePost} oder mehr Downvotes`}
    />
  );
}
