// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { deleteGalleryItem } from "@/lib/repositories/gallery";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  deleteGalleryItem(Number(id));
  revalidatePath("/galeri");
  return NextResponse.json({ ok: true });
}
