// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_2FA_PENDING_COOKIE,
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isValidPendingTwoFactorToken,
} from "@/lib/admin-auth";
import { getAdminUserById } from "@/lib/repositories/admin-users";
import { logActivity } from "@/lib/repositories/activity-log";
import { verifyTwoFactorCode } from "@/lib/two-factor";
import { rateLimitGuard } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  // Prefix terpisah dari "admin-login" - percobaan menebak password dan
  // percobaan menebak kode 2FA dihitung sebagai anggaran yang berbeda.
  const limited = rateLimitGuard(request, "admin-login-2fa");
  if (limited) return limited;

  const pendingToken = request.cookies.get(ADMIN_2FA_PENDING_COOKIE)?.value;
  const userId = await isValidPendingTwoFactorToken(pendingToken);
  const user = userId !== null ? getAdminUserById(userId) : undefined;
  if (!user || !user.active) {
    return NextResponse.json(
      { error: "Sesi login kedaluwarsa. Silakan masukkan password kembali." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";
  if (!verifyTwoFactorCode(user, code)) {
    return NextResponse.json({ error: "Kode verifikasi salah." }, { status: 401 });
  }

  const token = await createSessionToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  logActivity({ userId: user.id, username: user.username, action: "login" });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  response.cookies.delete(ADMIN_2FA_PENDING_COOKIE);
  return response;
}
