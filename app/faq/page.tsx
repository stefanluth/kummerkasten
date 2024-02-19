import fs from 'fs';
import { marked } from 'marked';

const renderer = new marked.Renderer();

marked.use({
  renderer: renderer,
  gfm: true,
});

export default function Faq() {
  return (
    <div
      className="faq-content max-w-3xl mx-auto"
      dangerouslySetInnerHTML={{
        __html: marked(fs.readFileSync(process.cwd() + '/faq.en.md', 'utf-8'), { renderer }),
      }}
    />
  );
}
