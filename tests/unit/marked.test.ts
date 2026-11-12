import { Marked } from 'marked';
import { describe, expect, it } from 'vitest';

import { MARKED_POST_OPTIONS } from '@/utils';

const render = (markdown: string): string => new Marked(MARKED_POST_OPTIONS).parse(markdown) as string;

describe('MARKED_POST_OPTIONS', () => {
  it('strips images so third-party trackers are never loaded', () => {
    const html = render('![tracker](https://example.com/pixel.png)');

    expect(html).not.toContain('<img');
    expect(html).not.toContain('pixel.png');
  });

  it('strips javascript and non-http links down to their text', () => {
    const javascriptLink = render('[click me](javascript:alert(1))');
    const relativeLink = render('[relative](/somewhere)');
    const mailtoLink = render('[mail](mailto:test@example.com)');

    for (const html of [javascriptLink, relativeLink, mailtoLink]) {
      expect(html).not.toContain('<a');
      expect(html).not.toContain('href=');
    }

    expect(javascriptLink).toContain('click me');
    expect(relativeLink).toContain('relative');
    expect(mailtoLink).toContain('mail');
  });

  it('keeps https links', () => {
    const html = render('[Example](https://example.com/page)');

    expect(html).toContain('<a href="https://example.com/page">Example</a>');
  });

  it('does not render raw HTML', () => {
    const html = render('<script>alert(1)</script>\n\n<b>bold</b>');

    expect(html).not.toContain('<script');
    expect(html).not.toContain('<b>');
    expect(html).not.toContain('</b>');
    expect(html).toContain('&lt;');
  });
});
