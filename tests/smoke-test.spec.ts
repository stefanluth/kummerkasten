import { randomBytes } from 'crypto';

import { expect, test } from '@playwright/test';

const UNLOCK_PASSWORD = process.env.UNLOCK_PASSWORD || 'test';
const DELETE_PASSWORD = process.env.DELETE_PASSWORD || 'test';

test('redirects to /unlock', async ({ context }) => {
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL('/unlock');

  await page.goto('/top/day');
  await expect(page).toHaveURL('/unlock');

  await page.goto('/top/week');
  await expect(page).toHaveURL('/unlock');

  await page.goto('/top/month');
  await expect(page).toHaveURL('/unlock');

  await page.goto('/top/year');
  await expect(page).toHaveURL('/unlock');

  await page.goto('/top/all');
  await expect(page).toHaveURL('/unlock');
});

test('unlocks, submits, and deletes a post', async ({ page }) => {
  await page.goto('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);

  const unlockButton = page.getByRole('button', { name: 'Unlock' });
  await unlockButton.click();

  await expect(page).toHaveURL('/');

  const cookies = await page.context().cookies();
  const sessionCookie = cookies.find(({ name }) => name === 'session');
  expect(sessionCookie?.value).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  expect(sessionCookie?.value).not.toBe(UNLOCK_PASSWORD);
  expect(sessionCookie?.httpOnly).toBe(true);
  expect(sessionCookie?.secure).toBe(true);
  expect(sessionCookie?.sameSite).toBe('None');
  expect(sessionCookie?.expires).toBeGreaterThan(Date.now() / 1000);
  expect(cookies.some(({ name }) => name === 'password')).toBe(false);
  expect(cookies.some(({ name }) => name === 'fingerprint')).toBe(true);

  const titleInput = page.getByRole('textbox', { name: 'Title' });
  const contentInput = page.getByRole('textbox', { name: 'Content' });
  const submitButton = page.getByRole('button', { name: 'Submit' });
  await expect(titleInput).toBeVisible();
  await expect(contentInput).toBeVisible();
  await expect(submitButton).toBeVisible();

  const title = randomBytes(16).toString('hex');
  const content = randomBytes(256).toString('hex');
  await titleInput.fill(title);
  await contentInput.fill(content);
  await submitButton.click();

  const heading = page.getByRole('heading', { name: title, exact: true });
  await expect(heading).toBeVisible();
  await expect(page.getByText(content, { exact: true })).toBeVisible();

  const postContent = heading.locator('xpath=../../..');
  const postCard = postContent.locator('xpath=..');
  const postId = await postCard.locator('.post-id').getAttribute('id');
  expect(postId).not.toBeNull();

  const response = await page.request.post(new URL(`/${postId}/delete`, page.url()).toString(), {
    data: { password: DELETE_PASSWORD },
  });
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({});
  await page.reload();
  await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
});
