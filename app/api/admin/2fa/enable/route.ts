// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin";
import { rateLimitGuard } from "@/lib/rate-limit";
import { confirmTwoFactorSetup } from "@/lib/two-factor";
import { logActivity } from "@/lib/repositories/activity-log";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "admin-2fa-enable");
  if (limited) return limited;

  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";

  const ok = confirmTwoFactorSetup(auth.user.id, code);
  if (!ok) {
    return NextResponse.json(
      { error: "Kode salah atau proses setup belum dimulai. Coba scan ulang QR code." },
      { status: 400 }
    );
  }
  logActivity({ userId: auth.user.id, username: auth.user.username, action: "2fa.enable" });
  return NextResponse.json({ ok: true });
}
