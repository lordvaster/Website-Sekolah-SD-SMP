// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { testimonialAdminSchema } from "@/lib/admin-validation";
import {
  deleteTestimonial,
  getTestimonialById,
  updateTestimonial,
} from "@/lib/repositories/testimonials";
import { logActivity } from "@/lib/repositories/activity-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getTestimonialById(id);
  if (!existing) return NextResponse.json({ error: "Testimoni tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = testimonialAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const updated = updateTestimonial(id, { ...parsed.data, hue: existing.hue });
  revalidatePath("/", "layout");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "testimonial.update",
    target: updated?.name,
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

  const existing = getTestimonialById(idNum);
  const deleted = deleteTestimonial(idNum);
  if (!deleted) {
    return NextResponse.json({ error: "Testimoni tidak ditemukan." }, { status: 404 });
  }
  revalidatePath("/", "layout");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "testimonial.delete",
    target: existing?.name,
  });
  return NextResponse.json({ ok: true });
}
