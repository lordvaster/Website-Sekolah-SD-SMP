// Author: Zeday | https://join.co.id
import { NextResponse, type NextRequest } from "next/server";

// Menggunakan Web Crypto API (bukan node:crypto) agar satu implementasi
// yang sama bisa dipakai baik oleh proxy.ts (Edge Runtime) maupun route
// handler di app/api/** (Node.js runtime).
//
// Token sesi berupa "<expiredAtEpochSeconds>.<hmacHex>" yang ditandatangani
// dengan HMAC-SHA256 (ADMIN_PASSWORD sebagai kunci). crypto.subtle.verify
// membandingkan signature secara timing-safe, sehingga verifikasi token
// tidak bocor lewat timing side-channel. Ini bukan pengganti session store
// sungguhan: token yang bocor sebelum masa berlakunya habis tetap valid
// sampai kedaluwarsa (tidak ada revocation list). Untuk kebutuhan admin
// yang lebih sensitif, ganti dengan session store terpusat (mis. Redis).

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 jam, samakan dengan cookie maxAge

function getSecret() {
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

// Perbandingan string tanpa early-exit, untuk mengurangi celah timing
// side-channel pada pengecekan password polos (bukan signature HMAC,
// yang verifikasinya sudah timing-safe lewat crypto.subtle.verify).
function constantTimeStringEqual(a: string, b: string) {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  const length = Math.max(aBytes.length, bBytes.length, 1);
  let diff = aBytes.length === bBytes.length ? 0 : 1;
  for (let i = 0; i < length; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

export function isValidPassword(password: string) {
  const secret = getSecret();
  return Boolean(secret) && constantTimeStringEqual(password, secret);
}

export async function createSessionToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(String(expiresAt))
  );
  return `${expiresAt}.${toHex(signature)}`;
}

export async function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const [expiresAtRaw, signatureHex] = token.split(".");
  const expiresAt = Number(expiresAtRaw);
  if (!expiresAtRaw || !signatureHex || Number.isNaN(expiresAt)) return false;
  if (Math.floor(Date.now() / 1000) > expiresAt) return false;

  const signatureBytes = fromHex(signatureHex);
  if (!signatureBytes) return false;

  const key = await getHmacKey(secret);
  return crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(String(expiresAt))
  );
}

export const SESSION_MAX_AGE_SECONDS = SESSION_TTL_SECONDS;

// Dipakai bersama oleh setiap route handler admin (selain login) supaya
// pengecekan cookie + verifikasi token tidak disalin-tempel di tiap route -
// proxy.ts sudah melindungi navigasi halaman /admin/**, helper ini
// melindungi route API /api/admin/** (dan /api/settings) dengan cara yang
// sama karena route handler tidak dilewati oleh proxy halaman.
export async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }
  return null;
}
