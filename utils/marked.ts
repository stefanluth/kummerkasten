import { MarkedExtension, marked } from 'marked';

const renderer = new marked.Renderer();
// Prevent images from being rendered
// This is a privacy concern because images can be used to track users
renderer.image = () => '';
renderer.link = (href, title, text) => {
  // If the link does not start with http or https, it can't be trusted
  if (!href.startsWith('http://') && !href.startsWith('https://')) {
    return text;
  }

  // If the link is not a valid URL, it can't be trusted
  try {
    new URL(href);
  } catch {
    return text;
  }

  return `<a href="${href}" title="${title}">${text}</a>`;
};

export const MARKED_POST_OPTIONS: MarkedExtension = {
  renderer: renderer,
  gfm: true,
  breaks: false,
  tokenizer: {
    // Prevent HTML from being rendered
    tag: (src: string) => undefined,
    html: (src: string) => undefined,
  },
};
