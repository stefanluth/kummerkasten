export type PostInputLimits = {
  minTitleLength: number;
  maxTitleLength: number;
  minContentLength: number;
  maxContentLength: number;
};

export type ValidPostInput = {
  title: string;
  content: string;
  replyTo?: string;
};

export type PostInputResult = ValidPostInput | { error: string };

export function parsePostInput(
  formData: FormData,
  limits: PostInputLimits,
  sanitizeContent: (content: string) => string = (content) => content,
): PostInputResult {
  const rawTitle = formData.get('title');
  const rawContent = formData.get('content');
  const rawReplyTo = formData.get('replyTo');

  if (!rawTitle || !rawContent || typeof rawTitle !== 'string' || typeof rawContent !== 'string') {
    return { error: 'Invalid title or content.' };
  }

  const title = rawTitle.trim();
  const content = sanitizeContent(rawContent.trim());

  switch (true) {
    case title.length < limits.minTitleLength:
      return { error: 'Title too short. Check for trailing spaces.' };
    case title.length > limits.maxTitleLength:
      return { error: 'Title too long. Check for trailing spaces.' };
    case content.length < limits.minContentLength:
      return { error: 'Content too short. Check for trailing spaces or HTML tags.' };
    case content.length > limits.maxContentLength:
      return { error: 'Content too long. Check for trailing spaces.' };
    default:
      return {
        title,
        content,
        ...(typeof rawReplyTo === 'string' ? { replyTo: rawReplyTo } : {}),
      };
  }
}
