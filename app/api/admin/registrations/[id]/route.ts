// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { validationErrorResponse } from "@/lib/api-helpers";
import { updateRegistrationStatus } from "@/lib/repositories/registrations";

const statusSchema = z.object({
  status: z.enum(["baru", "dihubungi", "diterima", "ditolak"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

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
  return NextResponse.json({ ok: true });
}
