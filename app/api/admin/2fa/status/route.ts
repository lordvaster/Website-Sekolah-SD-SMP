// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/require-admin";

export async function GET(request: NextRequest) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  return NextResponse.json({ enabled: auth.user.twoFactorEnabled });
}
