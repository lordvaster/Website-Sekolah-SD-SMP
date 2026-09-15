// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { updateRegistrationStatus } from "@/lib/repositories/registrations";
import { logActivity } from "@/lib/repositories/activity-log";

const statusSchema = z.object({
  status: z.enum(["baru", "dihubungi", "diterima", "ditolak"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const updated = updateRegistrationStatus(idNum, parsed.data.status);
  if (!updated) {
    return NextResponse.json({ error: "Pendaftaran tidak ditemukan." }, { status: 404 });
  }
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "registration.status",
    target: `#${idNum} -> ${parsed.data.status}`,
  });
  return NextResponse.json({ ok: true });
}
