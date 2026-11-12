export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type LogFields = Record<string, unknown>;

const serialize = (value: unknown, seen = new WeakSet<object>()): unknown => {
  if (value instanceof Error) {
    if (seen.has(value)) return '[Circular]';

    seen.add(value);

    return {
      ...Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, serialize(nested, seen)])),
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...(value.cause === undefined ? {} : { cause: serialize(value.cause, seen) }),
    };
  }

  if (typeof value === 'bigint') return value.toString();

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) return value.map((item) => serialize(item, seen));

  if (value !== null && typeof value === 'object') {
    if (seen.has(value)) return '[Circular]';

    seen.add(value);

    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, serialize(nested, seen)]));
  }

  return value;
};

const write = (level: LogLevel, message: string, fields: LogFields): void => {
  const line = JSON.stringify({
    level,
    message,
    fields: serialize(fields),
    timestamp: new Date().toISOString(),
  });

  switch (level) {
    case 'error':
      console.error(line);
      break;
    case 'warn':
      console.warn(line);
      break;
    case 'debug':
      console.debug(line);
      break;
    default:
      console.info(line);
  }
};

export const logger = {
  debug: (message: string, fields: LogFields = {}) => write('debug', message, fields),
  info: (message: string, fields: LogFields = {}) => write('info', message, fields),
  warn: (message: string, fields: LogFields = {}) => write('warn', message, fields),
  error: (message: string, fields: LogFields = {}) => write('error', message, fields),
};

export default logger;
