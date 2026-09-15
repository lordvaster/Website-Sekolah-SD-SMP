// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { validationErrorResponse } from "@/lib/api-helpers";
import { slugSchema, teacherAdminSchema } from "@/lib/admin-validation";
import { deleteTeacher, getTeacherById, updateTeacher } from "@/lib/repositories/teachers";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getTeacherById(id);
  if (!existing) return NextResponse.json({ error: "Guru tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = teacherAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const slug = slugSchema.parse(parsed.data.slug || parsed.data.name);

  try {
    const updated = updateTeacher(id, { ...parsed.data, slug, hue: existing.hue });
    revalidatePath("/tentang");
    return NextResponse.json(updated);
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Ada guru lain dengan nama yang menghasilkan slug sama. Ubah sedikit namanya." },
        { status: 409 }
      );
    }
    console.error("[api/admin/teachers] Gagal memperbarui profil guru:", error);
    return NextResponse.json({ error: "Gagal menyimpan profil guru." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  deleteTeacher(Number(id));
  revalidatePath("/tentang");
  return NextResponse.json({ ok: true });
}
