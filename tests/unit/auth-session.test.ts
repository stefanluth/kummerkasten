import { describe, expect, it } from 'vitest';

import { SESSION_DURATION_SECONDS, createUnlockSessionToken, verifyUnlockSessionToken } from '@/utils/auth-session';

const SECRET = 'test-session-secret-that-is-not-used-outside-unit-tests';
const NOW = Date.UTC(2026, 10, 14, 12);

describe('unlock session tokens', () => {
  it('accepts a signed session before its 24-hour expiration', async () => {
    const token = await createUnlockSessionToken(SECRET, NOW);

    expect(await verifyUnlockSessionToken(token, SECRET, NOW + SESSION_DURATION_SECONDS * 1000 - 1000)).toBe(true);
  });

  it('rejects a token whose signature has been tampered with', async () => {
    const token = await createUnlockSessionToken(SECRET, NOW);
    const [payload, signature] = token.split('.');
    const tamperedToken = `${payload}.${signature.slice(0, -1)}${signature.endsWith('a') ? 'b' : 'a'}`;

    expect(await verifyUnlockSessionToken(tamperedToken, SECRET, NOW)).toBe(false);
  });

  it.each(['', 'not-a-session', 'a.b.c', '***.***'])('rejects malformed token %j', async (token) =>
    expect(await verifyUnlockSessionToken(token, SECRET, NOW)).toBe(false),
  );

  it('rejects a validly signed session once its 24-hour lifetime has elapsed', async () => {
    const token = await createUnlockSessionToken(SECRET, NOW);

    expect(await verifyUnlockSessionToken(token, SECRET, NOW + SESSION_DURATION_SECONDS * 1000)).toBe(false);
  });
});
