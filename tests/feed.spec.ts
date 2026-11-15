import { randomBytes } from 'node:crypto';

import { expect, test } from '@playwright/test';

const UNLOCK_PASSWORD = process.env.UNLOCK_PASSWORD || 'test';
const TOP_PATHS = ['/top/day', '/top/week', '/top/month', '/top/year', '/top/all'];

test('shared feed supports all existing top routes and malformed cursors', async ({ page }) => {
  await page.goto('/unlock');
  const unauthorizedFeed = await page.request.get('/api/posts');
  expect(unauthorizedFeed.status()).toBe(401);
  const unauthorizedReportedFeed = await page.request.get('/api/posts?visibility=reported');
  expect(unauthorizedReportedFeed.status()).toBe(401);

  await page.fill('input[name="password"]', UNLOCK_PASSWORD);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page).toHaveURL('/');

  for (const path of TOP_PATHS) {
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    await expect(page).toHaveURL(path);
  }

  const cursorResponse = await page.request.get('/api/posts?cursor=invalid-cursor');
  expect(cursorResponse.status()).toBe(200);
  const cursorPage = await cursorResponse.json();
  expect(cursorPage).toMatchObject({ items: expect.any(Array), threads: expect.any(Object) });
  expect(cursorPage).toHaveProperty('nextCursor');

  const invalidSortResponse = await page.request.get('/api/posts?sort=unknown');
  expect(invalidSortResponse.status()).toBe(400);
});

test('loads and appends another feed batch when the bottom sentinel is reached', async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page).toHaveURL('/');

  const suffix = randomBytes(8).toString('hex');
  for (let index = 0; index < 31; index += 1) {
    const title = `Infinite scroll ${suffix} ${index}`;
    await page.getByRole('textbox', { name: 'Title' }).fill(title);
    await page.getByRole('textbox', { name: 'Content' }).fill(`Feed batch ${index} ${randomBytes(12).toString('hex')}`);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  }

  await expect(page.locator('.post-card')).toHaveCount(30);
  const nextPageRequest = page.waitForResponse((response) => response.url().includes('/api/posts?') && response.ok());
  await page.locator('[data-feed-sentinel]').scrollIntoViewIfNeeded();
  await nextPageRequest;
  await expect.poll(() => page.locator('.post-card').count()).toBeGreaterThan(30);
});
