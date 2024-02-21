export function getTimeAgo(timeStamp: number): string {
  const time = new Date().getTime() - timeStamp;
  const minutes = time / 60000;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const months = weeks / 4;

  if (minutes < 1) {
    return 'just now';
  } else if (hours < 1) {
    return `${Math.floor(minutes)} minutes ago`;
  } else if (days < 1) {
    return `${Math.floor(hours)} hours ago`;
  } else if (weeks < 1) {
    return `${Math.floor(days)} days ago`;
  } else if (months < 1) {
    return `${Math.floor(weeks)} weeks ago`;
  } else {
    return `${Math.floor(months)} months ago`;
  }
}
