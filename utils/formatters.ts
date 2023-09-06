export const removeEmptyLines = (str: string) =>
  str
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');

export const sanitize = (str: string) => {
  return removeEmptyLines(str.replace(/</g, '&lt;').replace(/>/g, '&gt;'));
};

export const bbcodeToHtml = (str: string) => {
  return str
    .replace(/\[b\](.+?)\[\/b\]/g, '<b>$1</b>')
    .replace(/\[i\](.+?)\[\/i\]/g, '<i>$1</i>')
    .replace(/\[u\](.+?)\[\/u\]/g, '<u>$1</u>')
    .replace(/\[s\](.+?)\[\/s\]/g, '<s>$1</s>');
};
