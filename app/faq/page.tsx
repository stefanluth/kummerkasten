import fs from 'fs';
import { Marked, Renderer } from 'marked';

export default async function Faq() {
  const marked = new Marked();
  const renderer = new Renderer();
  marked.use({
    renderer: renderer,
  });

  return (
    <div
      className="faq-content max-w-3xl mx-auto"
      dangerouslySetInnerHTML={{
        __html: await marked.parse(fs.readFileSync(process.cwd() + '/faq.en.md', 'utf-8'), { renderer }),
      }}
    />
  );
}
