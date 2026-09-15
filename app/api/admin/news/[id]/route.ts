// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { validationErrorResponse } from "@/lib/api-helpers";
import { newsAdminSchema, slugSchema } from "@/lib/admin-validation";
import { deleteNews, getNewsById, updateNews } from "@/lib/repositories/news";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getNewsById(id);
  if (!existing) return NextResponse.json({ error: "Berita tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = newsAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const slug = slugSchema.parse(parsed.data.slug || parsed.data.title);

  try {
    const updated = updateNews(id, { ...parsed.data, slug, hue: existing.hue });
    revalidatePath("/");
    revalidatePath("/berita");
    revalidatePath(`/berita/${existing.slug}`);
    if (slug !== existing.slug) revalidatePath(`/berita/${slug}`);
    return NextResponse.json(updated);
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Slug/judul ini sudah dipakai berita lain. Ganti judul atau slug-nya." },
        { status: 409 }
      );
    }
    console.error("[api/admin/news] Gagal memperbarui berita:", error);
    return NextResponse.json({ error: "Gagal menyimpan berita." }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getNewsById(id);
  deleteNews(id);
  revalidatePath("/");
  revalidatePath("/berita");
  if (existing) revalidatePath(`/berita/${existing.slug}`);
  return NextResponse.json({ ok: true });
}
