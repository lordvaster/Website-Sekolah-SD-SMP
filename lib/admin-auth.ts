// Author: Zeday | https://join.co.id
// Menggunakan Web Crypto API (bukan node:crypto) agar kompatibel dengan
// Edge Runtime yang dipakai oleh proxy.ts.
//
// Token sesi berupa "<expiredAtEpochSeconds>.<hmacHex>" yang ditandatangani
// dengan ADMIN_PASSWORD sebagai kunci, sehingga kedaluwarsa benar-benar
// diverifikasi di server (bukan hanya mengandalkan atribut maxAge cookie
// yang sepenuhnya dikontrol klien). Ini bukan pengganti session store
// sungguhan: token yang bocor sebelum masa berlakunya habis tetap valid
// sampai kedaluwarsa (tidak ada revocation list). Untuk kebutuhan admin
// yang lebih sensitif, ganti dengan session store terpusat (mis. Redis).

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 jam, samakan dengan cookie maxAge

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

async function signPayload(expiresAt: number) {
  const secret = getSecret();
  return sha256Hex(`sdceria::${secret}::${expiresAt}`);
}

export async function createSessionToken() {
  const secret = getSecret();
  if (!secret) return null;
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const signature = await signPayload(expiresAt);
  return `${expiresAt}.${signature}`;
}

export function isValidPassword(password: string) {
  const secret = getSecret();
  return Boolean(secret) && password === secret;
}

export async function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  const [expiresAtRaw, signature] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAtRaw || !signature || Number.isNaN(expiresAt)) return false;
  if (Math.floor(Date.now() / 1000) > expiresAt) return false;

  const expected = await signPayload(expiresAt);
  return Boolean(getSecret()) && signature === expected;
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_SECONDS;
