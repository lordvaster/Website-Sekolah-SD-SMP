// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin";
import { rateLimitGuard } from "@/lib/rate-limit";
import { disableTwoFactor } from "@/lib/two-factor";
import { logActivity } from "@/lib/repositories/activity-log";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "admin-2fa-disable");
  if (limited) return limited;

  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";

  const ok = disableTwoFactor(auth.user.id, code);
  if (!ok) {
    return NextResponse.json({ error: "Kode verifikasi salah." }, { status: 400 });
  }
  logActivity({ userId: auth.user.id, username: auth.user.username, action: "2fa.disable" });
  return NextResponse.json({ ok: true });
}
