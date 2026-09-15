// Author: Zeday | https://join.co.id
// Autentikasi dua faktor (TOTP, kompatibel Google Authenticator/Authy/1Password
// dkk.) untuk login admin. Disimpan terpisah dari data/settings.json karena
// GET /api/settings tidak memerlukan otentikasi (dipakai halaman publik untuk
// baca tagline/icon) - secret 2FA tidak boleh pernah lewat endpoint itu.
import fs from "node:fs/promises";
import path from "node:path";
import QRCode from "qrcode";
import { TOTP, Secret } from "otpauth";
import { siteConfig } from "./site-config";

// TWO_FACTOR_STATE_PATH memungkinkan test E2E (lihat playwright.config.ts)
// memakai file terpisah dari data/2fa.json yang sungguhan, supaya test tidak
// ikut mengaktifkan/menonaktifkan 2FA pada login admin produksi yang sedang
// berjalan (proses dev server test dan proses produksi berjalan di port
// berbeda tapi berbagi direktori proyek & process.cwd() yang sama).
const statePath = process.env.TWO_FACTOR_STATE_PATH
  ? path.resolve(process.env.TWO_FACTOR_STATE_PATH)
  : path.join(process.cwd(), "data", "2fa.json");

type TwoFactorState = {
  enabled: boolean;
  // Secret aktif (dipakai untuk verifikasi login) - hanya terisi saat enabled.
  secret: string | null;
  // Secret yang baru dibuat lewat /2fa/setup tapi belum dikonfirmasi lewat
  // /2fa/enable dengan kode yang valid - mencegah 2FA aktif dengan secret
  // yang belum terbukti bisa dibaca aplikasi authenticator admin.
  pendingSecret: string | null;
  updatedAt: string;
};

function defaultState(): TwoFactorState {
  return { enabled: false, secret: null, pendingSecret: null, updatedAt: new Date().toISOString() };
}

async function readState(): Promise<TwoFactorState> {
  try {
    const raw = await fs.readFile(statePath, "utf-8");
    const parsed = JSON.parse(raw);
    return {
      enabled: Boolean(parsed.enabled),
      secret: typeof parsed.secret === "string" ? parsed.secret : null,
      pendingSecret: typeof parsed.pendingSecret === "string" ? parsed.pendingSecret : null,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code !== "ENOENT") {
      console.error("[two-factor] Gagal membaca data/2fa.json, memakai default:", error);
    }
    return defaultState();
  }
}

let writeQueue: Promise<unknown> = Promise.resolve();

function writeState(state: TwoFactorState): Promise<void> {
  const run = async () => {
    await fs.writeFile(statePath, JSON.stringify(state, null, 2), "utf-8");
  };
  const result = writeQueue.then(run, run);
  writeQueue = result.catch(() => {});
  return result;
}

export async function isTwoFactorEnabled(): Promise<boolean> {
  const state = await readState();
  return state.enabled;
}

function buildTotp(secret: string) {
  return new TOTP({
    issuer: siteConfig.name,
    label: "Admin",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: Secret.fromBase32(secret),
  });
}

// Membuat secret baru berstatus "pending" - belum aktif melindungi login
// sampai dikonfirmasi lewat confirmTwoFactorSetup dengan kode yang valid,
// supaya admin tidak terkunci dari akun sendiri gara-gara salah scan QR.
export async function startTwoFactorSetup() {
  const secret = new Secret({ size: 20 }).base32;
  const state = await readState();
  await writeState({ ...state, pendingSecret: secret });

  const totp = buildTotp(secret);
  const otpauthUrl = totp.toString();
  const qrDataUrl = await QRCode.toDataURL(otpauthUrl);
  return { secret, otpauthUrl, qrDataUrl };
}

export async function confirmTwoFactorSetup(code: string): Promise<boolean> {
  const state = await readState();
  if (!state.pendingSecret) return false;

  const totp = buildTotp(state.pendingSecret);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  if (delta === null) return false;

  await writeState({
    enabled: true,
    secret: state.pendingSecret,
    pendingSecret: null,
    updatedAt: new Date().toISOString(),
  });
  return true;
}

// Mensyaratkan kode valid sekali lagi untuk menonaktifkan - sesi admin yang
// bocor sendirian tidak cukup untuk mematikan lapisan proteksi ini.
export async function disableTwoFactor(code: string): Promise<boolean> {
  const state = await readState();
  if (!state.enabled || !state.secret) return false;

  const totp = buildTotp(state.secret);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  if (delta === null) return false;

  await writeState(defaultState());
  return true;
}

export async function verifyTwoFactorCode(code: string): Promise<boolean> {
  const state = await readState();
  if (!state.enabled || !state.secret) return false;

  const totp = buildTotp(state.secret);
  const delta = totp.validate({ token: code.trim(), window: 1 });
  return delta !== null;
}
