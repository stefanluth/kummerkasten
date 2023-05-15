export function getFingerprintFromCookie(cookie: string): string {
  if (!cookie || typeof cookie !== "string") {
    throw new Error("Invalid fingerprint");
  }

  const [key, value] = cookie.split("=", 2);
  if (key !== "fingerprint" || value.length !== 64) {
    throw new Error("Invalid fingerprint");
  }

  return value;
}
