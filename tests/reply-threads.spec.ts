import { randomBytes } from 'node:crypto';

import { expect, test } from '@playwright/test';

const UNLOCK_PASSWORD = process.env.UNLOCK_PASSWORD || 'test';

async function createRootPost(page: import('@playwright/test').Page) {
  await page.goto('/unlock');
  await page.fill('input[name="password"]', UNLOCK_PASSWORD);
  await page.getByRole('button', { name: 'Unlock' }).click();
  await expect(page).toHaveURL('/');

  const suffix = randomBytes(8).toString('hex');
  const title = `Reply thread ${suffix}`;
  await page.getByRole('textbox', { name: 'Title' }).fill(title);
  await page.getByRole('textbox', { name: 'Content' }).fill(`Root post content ${randomBytes(16).toString('hex')}`);
  await page.getByRole('button', { name: 'Submit' }).click();

  const heading = page.getByRole('heading', { name: title, exact: true });
  await expect(heading).toBeVisible();
  const root = heading.locator('xpath=../../..').locator('xpath=..');
  const postId = await root.getAttribute('data-post-id');
  expect(postId).not.toBeNull();

  return { root, postId: postId! };
}

async function openRootReplyForm(root: import('@playwright/test').Locator) {
  const thread = root.locator('details.post-thread');
  await thread.locator(':scope > summary').click();
  await thread.getByText('Reply to post', { exact: true }).click();
  return { thread, form: thread.locator('form.post-reply-form').first() };
}

async function ensureDetailsOpen(details: import('@playwright/test').Locator) {
  const isOpen = await details.evaluate((element: HTMLDetailsElement) => element.open);
  if (!isOpen) await details.locator(':scope > summary').click();
}

test('creates and votes on a direct reply, and rejects a missing target', async ({ page }) => {
  const { root, postId } = await createRootPost(page);
  const { thread, form } = await openRootReplyForm(root);
  const content = `Direct reply ${randomBytes(12).toString('hex')}`;

  await form.getByRole('textbox', { name: 'Content' }).fill(`Invalid target ${randomBytes(12).toString('hex')}`);
  await form.locator('input[name="replyTo"]').evaluate((input: HTMLInputElement) => {
    input.value = 'missing-parent-id';
  });
  await expect(form.locator('input[name="replyTo"]')).toHaveValue('missing-parent-id');
  await form.getByRole('button', { name: 'Reply' }).click();
  await expect(form).toContainText('Reply target no longer exists.');

  await form.locator('input[name="replyTo"]').evaluate((input: HTMLInputElement, rootId) => {
    input.value = rootId;
  }, postId);
  await form.getByRole('textbox', { name: 'Content' }).fill(content);
  await form.getByRole('button', { name: 'Reply' }).click();

  const reply = thread.locator('.post-replies > .post-reply').filter({ hasText: content });
  await expect(reply).toHaveCount(1);
  await expect(thread.locator(':scope > summary')).toHaveText('1 Reply');
  const replyId = await reply.getAttribute('data-post-id');
  expect(replyId).not.toBeNull();
  await expect(reply.locator('a').first()).toContainText(`#${replyId!.slice(0, 6)}`);
  await expect(page.locator(`.post-card[data-post-id="${postId}"]`)).toHaveCount(1);

  await ensureDetailsOpen(thread);
  const score = reply.locator('.post-score');
  await expect(score).toHaveText('0');
  await reply.getByRole('button', { name: 'Upvote reply' }).click();
  await expect(score).toHaveText('1');
});

test('Reply button opens the root reply form and focuses its content field', async ({ page }) => {
  const { root, postId } = await createRootPost(page);

  await root.getByRole('button', { name: 'Reply', exact: true }).click();

  const form = root.locator('form.post-reply-form');
  await expect(form).toBeVisible();
  await expect(form.locator('input[name="replyTo"]')).toHaveValue(postId);
  await expect(form.getByRole('textbox', { name: 'Content' })).toBeFocused();
});

test('created-at link opens the post page directly', async ({ page }) => {
  const { root, postId } = await createRootPost(page);
  const createdAtLink = root.locator(`a[href="/${postId}"]`);

  await expect(createdAtLink).toBeVisible();
  await expect(createdAtLink).toContainText(`#${postId.slice(0, 6)}`);
  await createdAtLink.click();
  await expect(page).toHaveURL(`/${postId}`);
});

test('renders replies to replies as flat siblings and handles same-page references', async ({ page }) => {
  const { root } = await createRootPost(page);
  const { thread, form } = await openRootReplyForm(root);
  const firstReplyContent = `First reply ${randomBytes(12).toString('hex')}`;

  await form.getByRole('textbox', { name: 'Content' }).fill(firstReplyContent);
  await form.getByRole('button', { name: 'Reply' }).click();

  const firstReply = thread.locator('.post-replies > .post-reply').filter({ hasText: firstReplyContent });
  await expect(firstReply).toHaveCount(1);
  const firstReplyId = await firstReply.getAttribute('data-post-id');
  expect(firstReplyId).not.toBeNull();

  await ensureDetailsOpen(thread);
  await firstReply.locator('details > summary').click();
  const nestedForm = firstReply.locator('form.post-reply-form');
  const nestedContent = `Answer to reply ${randomBytes(12).toString('hex')}`;
  await nestedForm.getByRole('textbox', { name: 'Content' }).fill(nestedContent);
  await nestedForm.getByRole('button', { name: 'Reply' }).click();

  const replies = thread.locator('.post-replies > .post-reply');
  await expect(replies).toHaveCount(2);
  await expect(thread.locator(':scope > summary')).toHaveText('2 Replies');
  const nestedReply = replies.filter({ hasText: nestedContent });
  const targetLink = nestedReply.locator('.post-content p a');
  await expect(targetLink).toHaveText(`@${firstReplyId!.slice(0, 6)}`);
  await expect(targetLink).toHaveAttribute('href', `#${firstReplyId}`);
  await expect(thread.locator('.post-reply > .post-reply')).toHaveCount(0);

  const currentPath = new URL(page.url()).pathname + new URL(page.url()).search;
  await targetLink.click();
  await expect(page).toHaveURL(`${currentPath}#${firstReplyId}`);
  const targetReply = page.locator(`.post-reply[data-post-id="${firstReplyId}"]`);
  await expect(page.locator(':target')).toHaveAttribute('data-post-id', firstReplyId!);
  await expect(targetReply).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(targetReply).toHaveCSS('box-shadow', /0px 0px 0px 2px/);

  await targetReply.evaluate((element) => element.remove());
  await page.evaluate(() => window.history.replaceState(null, '', window.location.pathname + window.location.search));
  const urlBeforeMissingTargetClick = page.url();
  await targetLink.click();
  await expect(page).toHaveURL(urlBeforeMissingTargetClick);
});
