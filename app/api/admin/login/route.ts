// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  isValidPassword,
} from "@/lib/admin-auth";
import { rateLimitGuard } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "admin-login");
  if (limited) return limited;

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const token = await createSessionToken();
  if (!token) {
    // Tidak seharusnya terjadi karena isValidPassword sudah mensyaratkan
    // ADMIN_PASSWORD terisi, tapi dijaga eksplisit agar tidak pernah diam-diam
    // mengeset cookie sesi dengan nilai yang tidak valid.
    return NextResponse.json({ error: "Konfigurasi admin tidak lengkap." }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
