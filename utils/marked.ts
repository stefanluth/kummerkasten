import { MarkedExtension, marked } from 'marked';

export const getMarkedOptions = (): MarkedExtension => {
  const renderer = new marked.Renderer();
  // Prevent images from being rendered
  // This is a privacy concern because images can be used to track users
  renderer.image = () => '';

  const options: MarkedExtension = {
    renderer: renderer,
    gfm: true,
    breaks: false,
    tokenizer: {
      // Prevent HTML from being rendered
      tag: (src: string) => undefined,
      html: (src: string) => undefined,
    },
  };

  return options;
};
