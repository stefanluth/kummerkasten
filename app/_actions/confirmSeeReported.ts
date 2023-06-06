'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function confirmSeeReported(formData: FormData) {
  cookies().set('confirmationSeeReported', 'true');
  revalidatePath('/top/reported');
  redirect('/top/reported');
}
