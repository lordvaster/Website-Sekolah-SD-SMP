// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { createUserSchema } from "@/lib/admin-validation";
import { createAdminUser, getAdminUserByUsername, listAdminUsers, toSummary } from "@/lib/repositories/admin-users";
import { logActivity } from "@/lib/repositories/activity-log";

export async function GET(request: NextRequest) {
  const auth = await requireOwner(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  return NextResponse.json(listAdminUsers().map(toSummary));
}

export async function POST(request: NextRequest) {
  const auth = await requireOwner(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  if (getAdminUserByUsername(parsed.data.username)) {
    return NextResponse.json({ error: "Username ini sudah dipakai." }, { status: 409 });
  }

  const created = await createAdminUser(parsed.data);
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "user.create",
    target: created.username,
  });
  return NextResponse.json(toSummary(created), { status: 201 });
}
