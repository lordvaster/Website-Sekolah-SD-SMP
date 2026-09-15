// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { resetPasswordSchema } from "@/lib/admin-validation";
import { getAdminUserById, setAdminUserPassword } from "@/lib/repositories/admin-users";
import { logActivity } from "@/lib/repositories/activity-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireOwner(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getAdminUserById(id);
  if (!existing) return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  await setAdminUserPassword(id, parsed.data.password);
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "user.reset_password",
    target: existing.username,
  });
  return NextResponse.json({ ok: true });
}
