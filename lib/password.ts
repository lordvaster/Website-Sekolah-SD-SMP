// Author: Zeday | https://join.co.id
// Hashing password akun admin individual (bukan skema token sesi - lihat
// lib/admin-auth.ts untuk itu). Sengaja pakai node:crypto (bukan Web Crypto)
// karena file ini hanya pernah dipanggil dari route handler (Node.js
// runtime) - tidak seperti admin-auth.ts yang juga harus jalan di proxy.ts
// (Edge Runtime, tidak punya node:crypto).
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) return false;

  const hashBuffer = Buffer.from(hashHex, "hex");
  const derived = (await scrypt(password, salt, hashBuffer.length)) as Buffer;
  if (derived.length !== hashBuffer.length) return false;
  return timingSafeEqual(derived, hashBuffer);
}
