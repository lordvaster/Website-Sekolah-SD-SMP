// Author: Zeday | https://join.co.id
// Autentikasi dua faktor (TOTP, kompatibel Google Authenticator/Authy/1Password
// dkk.) untuk login admin - satu secret per akun (lib/repositories/
// admin-users.ts), bukan satu status global untuk semua admin.
import QRCode from "qrcode";
import { TOTP, Secret } from "otpauth";
import { siteConfig } from "./site-config";
import {
  activateTwoFactor,
  deactivateTwoFactor,
  getAdminUserById,
  setTwoFactorPendingSecret,
  type AdminUser,
} from "./repositories/admin-users";

function buildTotp(username: string, secret: string) {
  return new TOTP({
    issuer: siteConfig.name,
    label: username,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
}

// Membuat secret baru berstatus "pending" - belum aktif melindungi login
// sampai dikonfirmasi lewat confirmTwoFactorSetup dengan kode yang valid,
// supaya admin tidak terkunci dari akun sendiri gara-gara salah scan QR.
export async function startTwoFactorSetup(user: AdminUser) {
  const secret = new Secret({ size: 20 }).base32;
  setTwoFactorPendingSecret(user.id, secret);

  const totp = buildTotp(user.username, secret);
  const otpauthUrl = totp.toString();
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);
  return { secret, otpauthUrl, qrDataUrl };
}

export function confirmTwoFactorSetup(userId: number, code: string): boolean {
  const user = getAdminUserById(userId);
  if (!user?.twoFactorPendingSecret) return false;

  const totp = buildTotp(user.username, user.twoFactorPendingSecret);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  if (delta === null) return false;

  activateTwoFactor(userId, user.twoFactorPendingSecret);
  return true;
}

// Mensyaratkan kode valid sekali lagi untuk menonaktifkan - sesi admin yang
// bocor sendirian tidak cukup untuk mematikan lapisan proteksi ini.
export function disableTwoFactor(userId: number, code: string): boolean {
  const user = getAdminUserById(userId);
  if (!user?.twoFactorEnabled || !user.twoFactorSecret) return false;

  const totp = buildTotp(user.username, user.twoFactorSecret);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  if (delta === null) return false;

  deactivateTwoFactor(userId);
  return true;
}

export function verifyTwoFactorCode(user: AdminUser, code: string): boolean {
  if (!user.twoFactorEnabled || !user.twoFactorSecret) return false;

  const totp = buildTotp(user.username, user.twoFactorSecret);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}
