// Author: Zeday | https://join.co.id
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireAdminUser } from "@/lib/require-admin";
import { validationErrorResponse } from "@/lib/api-helpers";
import { achievementAdminSchema, randomHue } from "@/lib/admin-validation";
import { createAchievement, listAchievements } from "@/lib/repositories/achievements";
import { logActivity } from "@/lib/repositories/activity-log";

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  return NextResponse.json(listAchievements());
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminUser(request);
  if ("unauthorized" in auth) return auth.unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = achievementAdminSchema.safeParse(body);
  if (!parsed.success) return validationErrorResponse(parsed.error);

  const created = createAchievement({ ...parsed.data, hue: randomHue() });
  revalidatePath("/tentang");
  logActivity({
    userId: auth.user.id,
    username: auth.user.username,
    action: "achievement.create",
    target: created.title,
  });
  return NextResponse.json(created, { status: 201 });
}
