// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { videoAdminSchema } from "@/lib/admin-validation";
import { deleteVideo, getVideoById, updateVideo } from "@/lib/repositories/videos";
import { logActivity } from "@/lib/repositories/activity-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getVideoById(id);
  if (!existing) return NextResponse.json({ error: "Video tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = videoAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const updated = updateVideo(id, parsed.data);
  revalidatePath("/galeri");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "video.update",
    target: updated?.title,
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

  const existing = getVideoById(idNum);
  const deleted = deleteVideo(idNum);
  if (!deleted) {
    return NextResponse.json({ error: "Video tidak ditemukan." }, { status: 404 });
  }
  revalidatePath("/galeri");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "video.delete",
    target: existing?.title,
  });
  return NextResponse.json({ ok: true });
}
