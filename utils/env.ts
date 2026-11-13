import 'server-only';

import { DEFAULTS } from './defaults';

export type Env = {
  unlockPassword: string;
  deletePassword: string;
  sessionSecret: string;
  databaseUrl: string;
  databaseUrlNonPooling: string;
  minTitleLength: number;
  maxTitleLength: number;
  minContentLength: number;
  maxContentLength: number;
  reportsToHidePost: number;
};

let cachedEnv: Env | undefined;

const required = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const integer = (name: string, fallback: number): number => {
  const raw = process.env[name];

  if (!raw || !raw.trim()) return fallback;

  const value = Number(raw.trim());

  if (!Number.isInteger(value)) {
    throw new Error(`Environment variable ${name} must be an integer, received "${raw}"`);
  }

  return value;
};

export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const databaseUrl = required('KUMMERKASTEN_POSTGRES_PRISMA_URL');

  cachedEnv = {
    unlockPassword: required('UNLOCK_PASSWORD'),
    deletePassword: required('DELETE_PASSWORD'),
    sessionSecret: required('SESSION_SECRET'),
    databaseUrl,
    databaseUrlNonPooling: process.env.KUMMERKASTEN_POSTGRES_URL_NON_POOLING?.trim() || databaseUrl,
    minTitleLength: integer('MIN_TITLE_LENGTH', DEFAULTS.MIN_TITLE_LENGTH),
    maxTitleLength: integer('MAX_TITLE_LENGTH', DEFAULTS.MAX_TITLE_LENGTH),
    minContentLength: integer('MIN_CONTENT_LENGTH', DEFAULTS.MIN_CONTENT_LENGTH),
    maxContentLength: integer('MAX_CONTENT_LENGTH', DEFAULTS.MAX_CONTENT_LENGTH),
    reportsToHidePost: integer('REPORTS_TO_HIDE_POST', DEFAULTS.REPORTS_TO_HIDE_POST),
  };

  return cachedEnv;
}
