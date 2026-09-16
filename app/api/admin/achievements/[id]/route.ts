// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { achievementAdminSchema } from "@/lib/admin-validation";
import {
  deleteAchievement,
  getAchievementById,
  updateAchievement,
} from "@/lib/repositories/achievements";
import { logActivity } from "@/lib/repositories/activity-log";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const { id: idParam } = await params;
  const id = Number(idParam);
  const existing = getAchievementById(id);
  if (!existing) return NextResponse.json({ error: "Prestasi tidak ditemukan." }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = achievementAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const updated = updateAchievement(id, { ...parsed.data, hue: existing.hue });
  revalidatePath("/tentang");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "achievement.update",
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

  const existing = getAchievementById(idNum);
  const deleted = deleteAchievement(idNum);
  if (!deleted) {
    return NextResponse.json({ error: "Prestasi tidak ditemukan." }, { status: 404 });
  }
  revalidatePath("/tentang");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "achievement.delete",
    target: existing?.title,
  });
  return NextResponse.json({ ok: true });
}
