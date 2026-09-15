// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, computeSessionToken, isValidPassword } from "@/lib/admin-auth";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (isRateLimited(`admin-login:${ip}`)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";

  if (!isValidPassword(password)) {
    return NextResponse.json({ error: "Password salah." }, { status: 401 });
  }

  const token = await computeSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token as string, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
