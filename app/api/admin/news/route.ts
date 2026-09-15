// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { validationErrorResponse } from "@/lib/api-helpers";
import { newsAdminSchema, randomHue, slugSchema } from "@/lib/admin-validation";
import { createNews, listNews } from "@/lib/repositories/news";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(listNews());
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = newsAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const slug = slugSchema.parse(parsed.data.slug || parsed.data.title);

  try {
    const created = createNews({ ...parsed.data, slug, hue: randomHue() });
    // Tanpa ini, halaman publik yang di-cache statis (ISR 60 detik) baru
    // menampilkan berita baru setelah cache-nya kedaluwarsa sendiri -
    // revalidatePath memaksa halaman terkait segar di request berikutnya.
    revalidatePath("/");
    revalidatePath("/berita");
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed")) {
      return NextResponse.json(
        { error: "Slug/judul ini sudah dipakai berita lain. Ganti judul atau slug-nya." },
        { status: 409 }
      );
    }
    console.error("[api/admin/news] Gagal membuat berita:", error);
    return NextResponse.json({ error: "Gagal menyimpan berita." }, { status: 500 });
  }
}
