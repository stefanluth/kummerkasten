export const removeEmptyLines = (str: string) =>
  str
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');

export const sanitize = (str: string) => {
  return removeEmptyLines(
    str
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\{/g, '&lcub;')
      .replace(/\}/g, '&rcub;')
      .replace(/\(/g, '&lpar;')
      .replace(/\)/g, '&rpar;'),
  );
};
