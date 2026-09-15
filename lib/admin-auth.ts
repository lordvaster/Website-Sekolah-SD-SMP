// Author: Zeday | https://join.co.id
// Menggunakan Web Crypto API (bukan node:crypto) agar kompatibel dengan
// Edge Runtime yang dipakai oleh middleware.ts.

export const ADMIN_COOKIE = "admin_session";

function getSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

async function sha256Hex(input: string) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function computeSessionToken() {
  const secret = getSecret();
  if (!secret) return null;
  return sha256Hex(`sdceria::${secret}`);
}

export function isValidPassword(password: string) {
  const secret = getSecret();
  return Boolean(secret) && password === secret;
}

export async function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  const expected = await computeSessionToken();
  return Boolean(expected) && token === expected;
}
