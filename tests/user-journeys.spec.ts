import { randomBytes } from 'node:crypto';

import { expect, test } from '@playwright/test';

const UNLOCK_PASSWORD = process.env.UNLOCK_PASSWORD || 'test';
const DELETE_PASSWORD = process.env.DELETE_PASSWORD || 'test';
const TOP_PATHS = ['/top/day', '/top/week', '/top/month', '/top/year', '/top/all'];
const REPORTS_TO_HIDE_POST = Number(process.env.REPORTS_TO_HIDE_POST || 3);

async function unlock(page: import('@playwright/test').Page) {
  await page.goto('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page).toHaveURL('/');
}

async function createPost(page: import('@playwright/test').Page, title: string, content: string) {
  await page.getByRole('textbox', { name: 'Title' }).fill(title);
  await page.getByRole('textbox', { name: 'Content' }).fill(content);
  await page.getByRole('button', { name: 'Submit' }).click();
  const heading = page.getByRole('heading', { name: title, exact: true });
  await expect(heading).toBeVisible();
  const card = heading.locator('xpath=../../..').locator('xpath=..');
  const postId = await card.locator('.post-id').getAttribute('id');
  expect(postId).not.toBeNull();
  return { card, heading, postId: postId! };
}

test('enforces post title and content length constraints in the form', async ({ page }) => {
  await unlock(page);

  const title = page.getByRole('textbox', { name: 'Title' });
  const content = page.getByRole('textbox', { name: 'Content' });
  const minTitleLength = Number(await title.getAttribute('minlength'));
  const maxTitleLength = Number(await title.getAttribute('maxlength'));
  const minContentLength = Number(await content.getAttribute('minlength'));
  const maxContentLength = Number(await content.getAttribute('maxlength'));

  await title.fill('');
  await title.pressSequentially('a'.repeat(minTitleLength - 1));
  expect(await title.evaluate((element: HTMLInputElement) => element.validity.tooShort)).toBe(true);

  await title.fill('Valid title');
  await content.fill('');
  await content.pressSequentially('a'.repeat(minContentLength - 1));
  expect(await content.evaluate((element: HTMLTextAreaElement) => element.validity.tooShort)).toBe(true);

  await title.fill('');
  await title.pressSequentially('A'.repeat(maxTitleLength + 1));
  await expect(title).toHaveValue('A'.repeat(maxTitleLength));

  await title.fill('Valid title');
  await content.fill('');
  await content.pressSequentially('A'.repeat(maxContentLength + 1));
  await expect(content).toHaveValue('A'.repeat(maxContentLength));
});

test('opens an individual post and handles an unknown post ID', async ({ page, context }) => {
  await unlock(page);
  await context.addCookies([
    { name: 'fingerprint', value: `detail-${randomBytes(10).toString('hex')}`, url: 'http://localhost:3000' },
  ]);
  await page.reload();

  const title = `Detail ${randomBytes(8).toString('hex')}`;
  const content = `Detail content ${randomBytes(16).toString('hex')}`;
  const { postId } = await createPost(page, title, content);

  await page.goto(`/${postId}`);
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
  await expect(page.locator('.post-content')).toContainText(content);

  await page.goto('/unknown-post-id');
  await expect(page.locator('.post-content')).toHaveCount(0);
});

test('reported post is hidden from the feed and shown after confirmation', async ({ page, context }) => {
  await unlock(page);
  const title = `Reported ${randomBytes(8).toString('hex')}`;
  const content = `Report test ${randomBytes(16).toString('hex')}`;
  const { postId } = await createPost(page, title, content);

  for (let index = 0; index < REPORTS_TO_HIDE_POST; index += 1) {
    await context.addCookies([
      {
        name: 'fingerprint',
        value: `reported-${randomBytes(10).toString('hex')}`,
        url: 'http://localhost:3000',
      },
    ]);
    await page.reload();
    const card = page.locator(`[id="${postId}"]`).locator('xpath=..');
    await card.getByRole('button', { name: 'Report' }).click();
  }

  await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);

  await page.goto('/reported');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();
});

test('delete endpoint rejects an incorrect password and a missing post', async ({ page }) => {
  await unlock(page);
  const invalidPassword = await page.request.post('/missing-post-id/delete', { data: { password: 'incorrect' } });
  expect(invalidPassword.status()).toBe(401);
  await expect(invalidPassword.json()).resolves.toEqual({ error: 'Invalid password' });

  const missingPost = await page.request.post('/missing-post-id/delete', { data: { password: DELETE_PASSWORD } });
  expect(missingPost.status()).toBe(500);
});

test('mobile navigation opens each top-period route and closes after navigation', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await unlock(page);

  for (const [index, path] of TOP_PATHS.entries()) {
    await page.locator('button.relative').click();
    const label = ['24h', '7d', '30d', '1y', 'All'][index];
    await page.getByRole('link', { name: label, exact: true }).click();
    await expect(page).toHaveURL(path);
  }
});
