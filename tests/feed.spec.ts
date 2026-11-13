import { expect, test } from '@playwright/test';

const UNLOCK_PASSWORD = process.env.UNLOCK_PASSWORD || 'test';
const TOP_PATHS = ['/top/day', '/top/week', '/top/month', '/top/year', '/top/all'];

test('shared feed supports all existing top routes and malformed cursors', async ({ page }) => {
  await page.goto('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page).toHaveURL('/');

  for (const path of TOP_PATHS) {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(path);
  }

  const cursorResponse = await page.goto('/top/week?cursor=invalid-cursor');
  expect(cursorResponse?.ok()).toBe(true);
  await expect(page).toHaveURL('/top/week?cursor=invalid-cursor');
});
