export function getTimeAgo(timeStamp: number): string {
  const timeDiff = new Date().getTime() - timeStamp;
  const minute = 60 * 1000;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;

  const units = [
    { value: month, singular: 'month', plural: 'months' },
    { value: week, singular: 'week', plural: 'weeks' },
    { value: day, singular: 'day', plural: 'days' },
    { value: hour, singular: 'hour', plural: 'hours' },
    { value: minute, singular: 'minute', plural: 'minutes' },
  ];

  for (const unit of units) {
    const unitDiff = Math.floor(timeDiff / unit.value);
    if (unitDiff > 0) {
      return `${unitDiff} ${unitDiff > 1 ? unit.plural : unit.singular} ago`;
    }
  }

  return 'just now';
}
