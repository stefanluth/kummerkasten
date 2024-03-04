import { randomBytes } from 'crypto';

import { expect, test } from '@playwright/test';

const POST_ID_CLASS_NAMES = '.post-id';
const UNLOCK_PASSWORD = process.env.UNLOCK_PASSWORD || 'test';
const DELETE_PASSWORD = process.env.DELETE_PASSWORD || 'test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Kummerkasten');
});

test('/faq is reachable', async ({ context }) => {
  const page = await context.newPage();
  await page.goto('/faq');
  await expect(page).toHaveURL('/faq');
});

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

test('unlock works', async ({ page }) => {
  await page.goto('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);

  const unlockButton = page.getByRole('button', { name: 'Unlock' });
  await unlockButton.click();

  await expect(page).toHaveURL('/');

  const titleInput = page.getByRole('textbox', { name: 'Title' });
  const contentInput = page.getByRole('textbox', { name: 'Content' });
  const submitButton = page.getByRole('button', { name: 'Submit' });

  await expect(titleInput).toBeVisible();
  await expect(contentInput).toBeVisible();
  await expect(submitButton).toBeVisible();
});

test('submit works', async ({ page }) => {
  await page.goto('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);

  const unlockButton = page.getByRole('button', { name: 'Unlock' });
  await unlockButton.click();

  await expect(page).toHaveURL('/');

  const titleInput = page.getByRole('textbox', { name: 'Title' });
  const contentInput = page.getByRole('textbox', { name: 'Content' });
  const submitButton = page.getByRole('button', { name: 'Submit' });

  await expect(titleInput).toBeVisible();
  await expect(contentInput).toBeVisible();
  await expect(submitButton).toBeVisible();

  const randomTitle = randomBytes(16).toString('hex');
  const randomMessage = randomBytes(256).toString('hex');
  await titleInput.fill(randomTitle);
  await contentInput.fill(randomMessage);
  await submitButton.click();

  await expect(page).toHaveURL('/');

  const title = page.getByText(randomTitle);
  const message = page.getByText(randomMessage);

  expect(await title.textContent()).toBe(randomTitle);
  expect(await message.textContent()).toBe(randomMessage);
});

test('delete works', async ({ page }) => {
  // Unlock page
  await page.goto('/unlock');
  await expect(page).toHaveURL('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);

  const unlockButton = page.getByRole('button', { name: 'Unlock' });
  await unlockButton.click();

  await expect(page).toHaveURL('/');

  // Submit post
  const titleInput = page.getByRole('textbox', { name: 'Title' });
  const contentInput = page.getByRole('textbox', { name: 'Content' });
  const submitButton = page.getByRole('button', { name: 'Submit' });

  await expect(titleInput).toBeVisible();
  await expect(contentInput).toBeVisible();
  await expect(submitButton).toBeVisible();

  const randomTitle = randomBytes(16).toString('hex');
  const randomMessage = randomBytes(256).toString('hex');
  await titleInput.fill(randomTitle);
  await contentInput.fill(randomMessage);

  const countBeforePost = await page.locator(POST_ID_CLASS_NAMES).count();

  await submitButton.click();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  await expect(page).toHaveURL('/');
  await page.reload();

  const countAfterPost = await page.locator(POST_ID_CLASS_NAMES).count();

  // Get post id
  const title = page.getByText(randomTitle);
  const message = page.getByText(randomMessage);

  expect(await title.textContent()).toBe(randomTitle);
  expect(await message.textContent()).toBe(randomMessage);
  expect(countAfterPost).toBe(countBeforePost + 1);

  const postId = await page.getAttribute(POST_ID_CLASS_NAMES, 'id');

  // Delete post
  const headers = new Headers([
    ['Content-Type', 'application/json'],
    ['Cookie', `password=${UNLOCK_PASSWORD}; fingerprint=123`],
  ]);

  const body = JSON.stringify({
    password: DELETE_PASSWORD,
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    redirect: 'follow',
    headers,
    body,
  };

  const response = await fetch(`${page.url()}${postId}/delete`, requestOptions);
  const status = response.status;
  const result = await response.json();

  expect(status).toBe(200);
  expect(result).toEqual({});

  await page.reload();

  const countAfterDelete = await page.locator(POST_ID_CLASS_NAMES).count();

  expect(countAfterDelete).toBe(countAfterPost - 1);
  expect(countAfterDelete).toBe(countBeforePost);
});
