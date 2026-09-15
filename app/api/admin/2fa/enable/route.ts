// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimitGuard } from "@/lib/rate-limit";
import { confirmTwoFactorSetup } from "@/lib/two-factor";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "admin-2fa-enable");
  if (limited) return limited;

  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : "";

  const ok = await confirmTwoFactorSetup(code);
  if (!ok) {
    return NextResponse.json(
      { error: "Kode salah atau proses setup belum dimulai. Coba scan ulang QR code." },
      { status: 400 }
    );
  }
  return NextResponse.json({ ok: true });
}
