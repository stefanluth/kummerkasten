export const removeEmptyLines = (str: string) =>
  str
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
