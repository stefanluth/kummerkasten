import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createPostRecord } from '@/utils/post-mutations';

const { create, findFirst, findUnique, getPostThreadRootId, revalidatePath } = vi.hoisted(() => ({
  create: vi.fn(),
  findFirst: vi.fn(),
  findUnique: vi.fn(),
  getPostThreadRootId: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidatePath }));
vi.mock('@/utils/prisma', () => ({
  prisma: { post: { create, findFirst, findUnique } },
}));
vi.mock('@/utils/post-thread', () => ({ getPostThreadRootId }));

beforeEach(() => {
  create.mockReset();
  findFirst.mockReset();
  findUnique.mockReset();
  getPostThreadRootId.mockReset();
  revalidatePath.mockReset();
});

describe('createPostRecord', () => {
  it('links a reply to the exact target while retaining the root title', async () => {
    getPostThreadRootId.mockResolvedValue('root-id');
    findUnique.mockResolvedValue({ title: 'Root title' });
    findFirst.mockResolvedValue(null);

    await expect(createPostRecord({ content: 'Reply content', replyTo: 'target-reply-id' })).resolves.toBeNull();

    expect(findFirst).toHaveBeenCalledWith({
      where: { title: 'Root title', content: 'Reply content', replyTo: 'target-reply-id' },
      select: { id: true },
    });
    expect(create).toHaveBeenCalledWith({
      data: { title: 'Root title', content: 'Reply content', replyTo: 'target-reply-id' },
    });
    expect(revalidatePath).toHaveBeenCalledWith('/root-id');
  });

  it('rejects replies whose target does not belong to a valid thread', async () => {
    getPostThreadRootId.mockResolvedValue(null);

    await expect(createPostRecord({ content: 'Reply content', replyTo: 'missing-id' })).resolves.toBe(
      'target-not-found',
    );

    expect(findUnique).not.toHaveBeenCalled();
    expect(findFirst).not.toHaveBeenCalled();
    expect(create).not.toHaveBeenCalled();
  });

  it('scopes duplicate detection to the exact reply target', async () => {
    getPostThreadRootId.mockResolvedValue('root-id');
    findUnique.mockResolvedValue({ title: 'Root title' });
    findFirst.mockResolvedValue({ id: 'existing-reply' });

    await expect(createPostRecord({ content: 'Repeated content', replyTo: 'target-reply-id' })).resolves.toBe(
      'duplicate',
    );

    expect(findFirst).toHaveBeenCalledWith({
      where: { title: 'Root title', content: 'Repeated content', replyTo: 'target-reply-id' },
      select: { id: true },
    });
    expect(create).not.toHaveBeenCalled();
  });
});
