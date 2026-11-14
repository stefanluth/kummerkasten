import { describe, expect, it } from 'vitest';

import { parsePostInput } from '@/utils/post-validation';

const limits = {
  minTitleLength: 4,
  maxTitleLength: 12,
  minContentLength: 8,
  maxContentLength: 24,
};

function makeFormData(title: string, content: string, replyTo?: string): FormData {
  const formData = new FormData();
  formData.set('title', title);
  formData.set('content', content);
  if (replyTo) formData.set('replyTo', replyTo);
  return formData;
}

describe('parsePostInput', () => {
  it('trims, sanitizes, and preserves the optional reply target', () => {
    const result = parsePostInput(
      makeFormData('  Title  ', '  Content <script>body</script>  ', '  parent-id  '),
      limits,
      (content) => content.replace('<script>', '').replace('</script>', ''),
    );

    expect(result).toEqual({ content: 'Content body', replyTo: 'parent-id' });
  });

  it('accepts titleless replies while still requiring a title for top-level posts', () => {
    const reply = new FormData();
    reply.set('content', 'A reply without a title');
    reply.set('replyTo', 'parent-id');

    expect(parsePostInput(reply, limits)).toEqual({ content: 'A reply without a title', replyTo: 'parent-id' });
    expect(parsePostInput(makeFormData('', 'A root post without a title'), limits)).toEqual({
      error: 'Invalid title or content.',
    });
  });

  it('keeps the existing invalid-field and length messages', () => {
    expect(parsePostInput(new FormData(), limits)).toEqual({ error: 'Invalid title or content.' });
    expect(parsePostInput(makeFormData('abc', 'Content body'), limits)).toEqual({
      error: 'Title too short. Check for trailing spaces.',
    });
    expect(parsePostInput(makeFormData('Title', 'short'), limits)).toEqual({
      error: 'Content too short. Check for trailing spaces or HTML tags.',
    });
    expect(parsePostInput(makeFormData('A title that is too long', 'Content body'), limits)).toEqual({
      error: 'Title too long. Check for trailing spaces.',
    });
    expect(parsePostInput(makeFormData('Title', 'Content body that exceeds the configured limit'), limits)).toEqual({
      error: 'Content too long. Check for trailing spaces.',
    });
  });
});
