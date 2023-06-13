import { randomBytes } from 'crypto';
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Kummerkasten');
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
  const password = process.env.UNLOCK_PASSWORD || 'test';

  await page.goto('/unlock');
  await page.fill('input[name="password"]', password);

  const unlockButton = page.getByRole('button', { name: 'Absenden' });
  await unlockButton.click();

  await expect(page).toHaveURL('/');

  const titelInput = page.getByRole('textbox', { name: 'Titel' });
  const nachrichtInput = page.getByRole('textbox', { name: 'Nachricht' });
  const submitButton = page.getByRole('button', { name: 'Absenden' });

  await expect(titelInput).toBeVisible();
  await expect(nachrichtInput).toBeVisible();
  await expect(submitButton).toBeVisible();
});

test('submit works', async ({ page }) => {
  const password = process.env.UNLOCK_PASSWORD || 'test';

  await page.goto('/unlock');
  await page.fill('input[name="password"]', password);

  const unlockButton = page.getByRole('button', { name: 'Absenden' });
  await unlockButton.click();

  await expect(page).toHaveURL('/');

  const titelInput = page.getByRole('textbox', { name: 'Titel' });
  const nachrichtInput = page.getByRole('textbox', { name: 'Nachricht' });
  const submitButton = page.getByRole('button', { name: 'Absenden' });

  await expect(titelInput).toBeVisible();
  await expect(nachrichtInput).toBeVisible();
  await expect(submitButton).toBeVisible();

  const randomTitle = randomBytes(16).toString('hex');
  const randomMessage = randomBytes(256).toString('hex');
  await titelInput.fill(randomTitle);
  await nachrichtInput.fill(randomMessage);
  await submitButton.click();

  await expect(page).toHaveURL('/');

  const title = page.getByText(randomTitle);
  const message = page.getByText(randomMessage);

  expect(await title.textContent()).toBe(randomTitle);
  expect(await message.textContent()).toBe(randomMessage);
});
