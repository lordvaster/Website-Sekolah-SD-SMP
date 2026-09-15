// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { requireAdminUser } from "@/lib/require-admin";
import { logActivity } from "@/lib/repositories/activity-log";

export async function POST(request: NextRequest) {
  const auth = await requireAdminUser(request);
  if ("user" in auth) {
    logActivity({ userId: auth.user.id, username: auth.user.username, action: "logout" });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
