// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { faqAdminSchema } from "@/lib/admin-validation";
import { deleteFaq, getFaqById, updateFaq } from "@/lib/repositories/faqs";
import { logActivity } from "@/lib/repositories/activity-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getFaqById(id);
  if (!existing) return NextResponse.json({ error: "FAQ tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = faqAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const updated = updateFaq(id, parsed.data);
  revalidatePath("/kontak");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "faq.update",
    target: updated?.question,
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const existing = getFaqById(idNum);
  const deleted = deleteFaq(idNum);
  if (!deleted) {
    return NextResponse.json({ error: "FAQ tidak ditemukan." }, { status: 404 });
  }
  revalidatePath("/kontak");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "faq.delete",
    target: existing?.question,
  });
  return NextResponse.json({ ok: true });
}
