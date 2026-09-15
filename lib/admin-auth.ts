// Author: Zeday | https://join.co.id
// Menggunakan Web Crypto API (bukan node:crypto) agar satu implementasi
// yang sama bisa dipakai baik oleh proxy.ts (Edge Runtime) maupun route
// handler di app/api/** (Node.js runtime). File ini SENGAJA tidak
// mengimpor lib/db.ts (better-sqlite3, modul native Node) - itu tidak
// tersedia di Edge Runtime. Pengecekan yang butuh data pengguna dari
// database (peran, status aktif) ada di lib/require-admin.ts, hanya
// dipakai oleh route handler (Node.js runtime), tidak pernah oleh proxy.ts.
//
// Token sesi berupa "<userId>.<expiredAtEpochSeconds>.<hmacHex>" yang
// ditandatangani dengan HMAC-SHA256 memakai ADMIN_PASSWORD sebagai kunci
// (nama env var ini sekarang berperan sebagai kunci penandatanganan sesi
// server-wide, bukan lagi password bersama - lihat lib/repositories/
// admin-users.ts untuk password per akun). crypto.subtle.verify
// membandingkan signature secara timing-safe. Ini bukan pengganti session
// store sungguhan: token yang bocor sebelum masa berlakunya habis tetap
// valid sampai kedaluwarsa (tidak ada revocation list terpusat) - untuk
// kebutuhan admin yang lebih sensitif, ganti dengan session store terpusat
// (mis. Redis).

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 jam, samakan dengan cookie maxAge

// Cookie sementara antara "password benar" dan "kode 2FA benar" saat 2FA
// aktif - sengaja dibuat pendek (5 menit) dan ditandatangani dengan pesan
// yang diberi awalan berbeda dari token sesi penuh (lihat PENDING_PREFIX di
// bawah), supaya token ini tidak bisa dipakai sebagai pengganti sesi admin
// yang sesungguhnya walau sama-sama ditandatangani dengan kunci yang sama.
export const ADMIN_2FA_PENDING_COOKIE = "admin_2fa_pending";
const PENDING_TTL_SECONDS = 60 * 5;
const PENDING_PREFIX = "pending2fa:";

function getSessionSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array | null {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

async function getHmacKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(message: string): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return toHex(signature);
}

async function verify(message: string, signatureHex: string): Promise<boolean> {
  const secret = getSessionSecret();
  if (!secret) return false;
  const signatureBytes = fromHex(signatureHex);
  if (!signatureBytes) return false;
  const key = await getHmacKey(secret);
  return crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(message));
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_SECONDS;
export const PENDING_2FA_MAX_AGE_SECONDS = PENDING_TTL_SECONDS;

export async function createSessionToken(userId: number): Promise<string | null> {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const signatureHex = await sign(`${userId}.${expiresAt}`);
  if (!signatureHex) return null;
  return `${userId}.${expiresAt}.${signatureHex}`;
}

// Mengembalikan userId yang tertanam di token bila valid, atau null bila
// tidak (kedaluwarsa, signature tidak cocok, atau format rusak).
export async function isValidSessionToken(token: string | undefined): Promise<number | null> {
  if (!token) return null;

  const [userIdRaw, expiresAtRaw, signatureHex] = token.split(".");
  const userId = Number(userIdRaw);
  const expiresAt = Number(expiresAtRaw);
  if (!userIdRaw || !expiresAtRaw || !signatureHex) return null;
  if (Number.isNaN(userId) || Number.isNaN(expiresAt)) return null;
  if (Math.floor(Date.now() / 1000) > expiresAt) return null;

  const ok = await verify(`${userId}.${expiresAt}`, signatureHex);
  return ok ? userId : null;
}

export async function createPendingTwoFactorToken(userId: number): Promise<string | null> {
  const expiresAt = Math.floor(Date.now() / 1000) + PENDING_TTL_SECONDS;
  const signatureHex = await sign(`${PENDING_PREFIX}${userId}.${expiresAt}`);
  if (!signatureHex) return null;
  return `${userId}.${expiresAt}.${signatureHex}`;
}

export async function isValidPendingTwoFactorToken(token: string | undefined): Promise<number | null> {
  if (!token) return null;

  const [userIdRaw, expiresAtRaw, signatureHex] = token.split(".");
  const userId = Number(userIdRaw);
  const expiresAt = Number(expiresAtRaw);
  if (!userIdRaw || !expiresAtRaw || !signatureHex) return null;
  if (Number.isNaN(userId) || Number.isNaN(expiresAt)) return null;
  if (Math.floor(Date.now() / 1000) > expiresAt) return null;

  const ok = await verify(`${PENDING_PREFIX}${userId}.${expiresAt}`, signatureHex);
  return ok ? userId : null;
}
