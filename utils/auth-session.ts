const SESSION_DURATION_SECONDS = 24 * 60 * 60;
const SESSION_COOKIE_NAME = 'session';
const SESSION_TOKEN_PART_PATTERN = /^[A-Za-z0-9_-]+$/;
const SHA256_SIGNATURE_LENGTH = 32;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8', { fatal: true });

type UnlockSessionPayload = {
  exp: number;
  iat: number;
};

export { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS };

export async function createUnlockSessionToken(secret: string, now = Date.now()): Promise<string> {
  const issuedAt = Math.floor(now / 1000);
  const payload: UnlockSessionPayload = {
    iat: issuedAt,
    exp: issuedAt + SESSION_DURATION_SECONDS,
  };
  const encodedPayload = encodeBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(encodedPayload));

  return `${encodedPayload}.${encodeBase64Url(new Uint8Array(signature))}`;
}

export async function verifyUnlockSessionToken(
  token: string | null | undefined,
  secret: string | undefined,
  now = Date.now(),
): Promise<boolean> {
  if (!token || !secret || token.length > 1024) return false;

  const parts = token.split('.');
  if (parts.length !== 2 || !parts.every((part) => SESSION_TOKEN_PART_PATTERN.test(part))) return false;

  const [encodedPayload, encodedSignature] = parts;
  const payloadBytes = decodeBase64Url(encodedPayload);
  const signature = decodeBase64Url(encodedSignature);
  if (!payloadBytes || !signature || signature.byteLength !== SHA256_SIGNATURE_LENGTH) return false;

  let payload: unknown;
  try {
    payload = JSON.parse(textDecoder.decode(payloadBytes));
  } catch {
    return false;
  }

  if (!isUnlockSessionPayload(payload)) return false;

  try {
    const key = await importSigningKey(secret);
    const validSignature = await crypto.subtle.verify('HMAC', key, signature, textEncoder.encode(encodedPayload));
    if (!validSignature) return false;
  } catch {
    return false;
  }

  const nowInSeconds = Math.floor(now / 1000);
  return payload.iat <= nowInSeconds && payload.exp > nowInSeconds;
}

async function importSigningKey(secret: string): Promise<CryptoKey> {
  if (!secret) throw new Error('SESSION_SECRET is required to sign unlock sessions');

  return crypto.subtle.importKey('raw', textEncoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
    'verify',
  ]);
}

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
}

function decodeBase64Url(value: string): ArrayBuffer | null {
  try {
    const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes.buffer;
  } catch {
    return null;
  }
}

function isUnlockSessionPayload(value: unknown): value is UnlockSessionPayload {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;

  const payload = value as Record<string, unknown>;
  return (
    Object.keys(payload).length === 2 &&
    Number.isSafeInteger(payload.iat) &&
    Number.isSafeInteger(payload.exp) &&
    (payload.exp as number) - (payload.iat as number) === SESSION_DURATION_SECONDS
  );
}
