// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { rateLimitGuard } from "@/lib/rate-limit";
import { startTwoFactorSetup } from "@/lib/two-factor";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "admin-2fa-setup");
  if (limited) return limited;

  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { secret, otpauthUrl, qrDataUrl } = await startTwoFactorSetup();
  return NextResponse.json({ secret, otpauthUrl, qrDataUrl });
}
