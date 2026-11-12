import type { Instrumentation } from 'next';

import { logger } from '@/utils/logger';

export const onRequestError: Instrumentation.onRequestError = async (error, request, context) => {
  const fields = {
    path: request.path,
    method: request.method,
    routeType: context.routeType,
    routePath: context.routePath,
    renderSource: context.renderSource,
    routerKind: context.routerKind,
    error,
  };

  try {
    logger.error('request error', fields);
  } catch {
    console.error(
      JSON.stringify({
        level: 'error',
        message: 'request error',
        fields,
        timestamp: new Date().toISOString(),
      }),
    );
  }
};
