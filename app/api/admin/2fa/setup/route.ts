// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin";
import { rateLimitGuard } from "@/lib/rate-limit";
import { startTwoFactorSetup } from "@/lib/two-factor";

export async function POST(request: NextRequest) {
  const limited = rateLimitGuard(request, "admin-2fa-setup");
  if (limited) return limited;

  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { secret, otpauthUrl, qrDataUrl } = await startTwoFactorSetup(auth.user);
  return NextResponse.json({ secret, otpauthUrl, qrDataUrl });
}
