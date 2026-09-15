// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/require-admin";
import { deleteGalleryItem, getGalleryItemById } from "@/lib/repositories/gallery";
import { logActivity } from "@/lib/repositories/activity-log";

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

  const existing = getGalleryItemById(idNum);
  const deleted = deleteGalleryItem(idNum);
  if (!deleted) {
    return NextResponse.json({ error: "Item galeri tidak ditemukan." }, { status: 404 });
  }
  revalidatePath("/galeri");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "gallery.delete",
    target: existing?.caption,
  });
  return NextResponse.json({ ok: true });
}
