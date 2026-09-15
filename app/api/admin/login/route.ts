// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_2FA_PENDING_COOKIE,
  ADMIN_COOKIE,
  PENDING_2FA_MAX_AGE_SECONDS,
  SESSION_MAX_AGE_SECONDS,
  createPendingTwoFactorToken,
  createSessionToken,
} from "@/lib/admin-auth";
import { getAdminUserByUsername } from "@/lib/repositories/admin-users";
import { logActivity } from "@/lib/repositories/activity-log";
import { verifyPassword } from "@/lib/password";
import { rateLimitGuard } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "admin-login");
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  const user = username ? getAdminUserByUsername(username) : undefined;
  // Tetap jalankan verifyPassword dengan hash dummy walau user tidak
  // ditemukan, supaya waktu respons username salah vs password salah tidak
  // gampang dibedakan (mencegah username enumeration lewat timing).
  const passwordOk = await verifyPassword(
    password,
    user?.passwordHash ?? "0".repeat(32) + ":" + "0".repeat(128)
  );

  if (!user || !user.active || !passwordOk) {
    return NextResponse.json({ error: "Username atau password salah." }, { status: 401 });
  }

  if (user.twoFactorEnabled) {
    const pendingToken = await createPendingTwoFactorToken(user.id);
    if (!pendingToken) {
      return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
    }
    const response = NextResponse.json({ ok: true, twoFactorRequired: true });
    response.cookies.set(ADMIN_2FA_PENDING_COOKIE, pendingToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: PENDING_2FA_MAX_AGE_SECONDS,
    });
    return response;
  }

  const token = await createSessionToken(user.id);
  if (!token) {
    return NextResponse.json({ error: "Konfigurasi server tidak lengkap." }, { status: 500 });
  }

  logActivity({ userId: user.id, username: user.username, action: "login" });

  const response = NextResponse.json({ ok: true, twoFactorRequired: false });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
