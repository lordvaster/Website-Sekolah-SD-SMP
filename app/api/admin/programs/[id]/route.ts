// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { validationErrorResponse } from "@/lib/api-helpers";
import { programAdminSchema, slugSchema } from "@/lib/admin-validation";
import { deleteProgram, getProgramById, updateProgram } from "@/lib/repositories/programs";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getProgramById(id);
  if (!existing) return NextResponse.json({ error: "Program tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = programAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const slug = slugSchema.parse(parsed.data.slug || parsed.data.name);

  try {
    const updated = updateProgram(id, {
      slug,
      name: parsed.data.name,
      ageRange: parsed.data.ageRange,
      description: parsed.data.description,
      highlights: parsed.data.highlights,
      hue: existing.hue,
    });
    revalidatePath("/program");
    revalidatePath("/kontak");
    return NextResponse.json(updated);
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Ada program lain dengan nama yang menghasilkan slug sama." },
        { status: 409 }
      );
    }
    console.error("[api/admin/programs] Gagal memperbarui program:", error);
    return NextResponse.json({ error: "Gagal menyimpan program." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const idNum = Number(id);
  if (!Number.isInteger(idNum)) {
    return NextResponse.json({ error: "ID tidak valid." }, { status: 400 });
  }

  const deleted = deleteProgram(idNum);
  if (!deleted) {
    return NextResponse.json({ error: "Program tidak ditemukan." }, { status: 404 });
  }
  revalidatePath("/program");
  revalidatePath("/kontak");
  return NextResponse.json({ ok: true });
}
