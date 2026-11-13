import { randomBytes } from 'node:crypto';

import { expect, test } from '@playwright/test';

const UNLOCK_PASSWORD = process.env.UNLOCK_PASSWORD || 'test';
const DELETE_PASSWORD = process.env.DELETE_PASSWORD || 'test';
const REPORTS_TO_HIDE_POST = Number(process.env.REPORTS_TO_HIDE_POST || 3);

test('votes toggle and reports are submitted for a post', async ({ page }) => {
  await page.goto('/unlock');
  await expect(page.locator('input[name="fingerprint"]')).not.toHaveValue('');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page).toHaveURL('/');
  await page.context().addCookies([
    {
      name: 'fingerprint',
      value: 'mutation-test-user',
      url: 'http://localhost:3000',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
  await page.reload();

  const title = randomBytes(12).toString('hex');
  await page.getByRole('textbox', { name: 'Title' }).fill(title);
  await page.getByRole('textbox', { name: 'Content' }).fill(randomBytes(32).toString('hex'));
  await page.getByRole('button', { name: 'Submit' }).click();

  const heading = page.getByRole('heading', { name: title, exact: true });
  await expect(heading).toBeVisible();
  const postContent = heading.locator('xpath=../../..');
  const postCard = postContent.locator('xpath=..');
  const postId = await postCard.locator('.post-id').getAttribute('id');
  const score = postCard.locator('.post-score');

  expect(postId).not.toBeNull();
  await expect(score).toHaveText('0');
  await postCard.getByRole('button', { name: 'Upvote post' }).click();
  await expect(score).toHaveText('1');
  await postCard.getByRole('button', { name: 'Upvote post' }).click();
  await expect(score).toHaveText('0');

  const upvoteButton = postCard.getByRole('button', { name: 'Upvote post' });
  await Promise.all([upvoteButton.click(), upvoteButton.click()]);
  await expect(score).toHaveText(/^(0|1)$/);
  if ((await score.textContent()) === '1') {
    await upvoteButton.click();
    await expect(score).toHaveText('0');
  }

  for (let index = 0; index < REPORTS_TO_HIDE_POST; index += 1) {
    await page.context().addCookies([
      {
        name: 'fingerprint',
        value: `mutation-test-user-${index}`,
        url: 'http://localhost:3000',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
    await page.reload();

    const reportButton = postCard.getByRole('button', { name: 'Report' });
    await reportButton.click();
    await expect(reportButton).toHaveCount(0);
  }

  await page.reload();
  await expect(page.getByRole('heading', { name: title, exact: true })).toHaveCount(0);
  await page.goto('/reported');
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible();

  await page.context().addCookies([
    {
      name: 'fingerprint',
      value: `mutation-test-delete-${randomBytes(12).toString('hex')}`,
      url: 'http://localhost:3000',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    },
  ]);
  await page.reload();
  await page.getByRole('button', { name: 'Continue' }).click();

  const reportedPostHeading = page.getByRole('heading', { name: title, exact: true });
  await expect(reportedPostHeading).toBeVisible();
  const reportedPostCard = reportedPostHeading.locator('xpath=../../..').locator('xpath=..');
  const reportedPostScore = reportedPostCard.locator('.post-score');
  const scoreBeforeDelete = Number(await reportedPostScore.textContent());
  await reportedPostCard.getByRole('button', { name: 'Upvote post' }).click();
  await expect(reportedPostScore).toHaveText(String(scoreBeforeDelete + 1));

  const deleteResult = await page.evaluate(
    async ({ postId, password }) =>
      fetch(`${window.location.origin}/${postId}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      }).then((response) => response.status),
    { postId, password: DELETE_PASSWORD },
  );
  expect(deleteResult).toBe(200);
});
